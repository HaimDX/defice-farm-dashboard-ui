import fs from "fs";
import os from "os";
import path from "path";
import Database from "better-sqlite3";
import { pluginLogger as log } from "../loggers/plugin-logger";

export interface UserRow {
  id: string;
  username: string;
  password_hash: string;
  is_admin: 0 | 1;
  is_bootstrapped: 0 | 1;
  created_at: string;
  last_login_at: string | null;
}

export interface TokenRow {
  id: string;
  user_id: string;
  token_hash: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

let dbInstance: Database.Database | null = null;

function resolveDbPath(): string {
  const override = process.env.DEVICE_FARM_AUTH_DB;
  if (override && override.trim().length > 0) return override;
  return path.join(os.homedir(), ".appium-device-farm", "auth.db");
}

function ensureParentDir(filePath: string): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
}

// Seed values for the bootstrapped admin row.
// Identical to the device-farm plugin's seed — same UUID + same pre-computed
// bcrypt hash. INSERT OR IGNORE means whichever plugin boots first creates
// the row; the other no-ops on the unique constraint.
const SEED_ADMIN_ID = "00000000-0000-0000-0000-0000000000ad";
const SEED_ADMIN_USERNAME = "admin";
const SEED_ADMIN_PASSWORD_HASH = "$2b$10$Gm4lpwjeKy0eh.TMQnhd3OOvKMXr/VUe8ym1IBRav1UdJaWnIJd4.";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY,
  username        TEXT NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  is_admin        INTEGER NOT NULL DEFAULT 0,
  is_bootstrapped INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL,
  last_login_at   TEXT
);

CREATE TABLE IF NOT EXISTS tokens (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash    TEXT NOT NULL UNIQUE,
  created_at    TEXT NOT NULL,
  last_used_at  TEXT,
  revoked_at    TEXT
);

CREATE INDEX IF NOT EXISTS idx_tokens_user ON tokens(user_id);

INSERT OR IGNORE INTO users (id, username, password_hash, is_admin, is_bootstrapped, created_at, last_login_at)
VALUES ('${SEED_ADMIN_ID}', '${SEED_ADMIN_USERNAME}', '${SEED_ADMIN_PASSWORD_HASH}', 1, 1, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL);
`;

export function getAuthDbPath(): string {
  return resolveDbPath();
}

export function initAuthDb(): void {
  if (dbInstance) return;
  const filePath = resolveDbPath();
  ensureParentDir(filePath);
  const db = new Database(filePath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  try {
    fs.chmodSync(filePath, 0o600);
  } catch (err: any) {
    log.warn(`Could not chmod auth DB to 0600: ${err?.message ?? err}`);
  }
  dbInstance = db;
  log.info(`Auth DB ready at ${filePath}`);
}

export function getAuthDb(): Database.Database {
  if (!dbInstance) throw new Error("Auth DB not initialized — call initAuthDb() first");
  return dbInstance;
}

export function closeAuthDb(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
