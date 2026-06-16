import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { getAuthDb, UserRow } from "./auth-db";
import { revokeAllForUser } from "./tokens-service";

const BCRYPT_COST = 10;

export interface PublicUser {
  id: string;
  username: string;
  isAdmin: boolean;
  isBootstrapped: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

function rowToPublic(row: UserRow): PublicUser {
  return {
    id: row.id,
    username: row.username,
    isAdmin: row.is_admin === 1,
    isBootstrapped: row.is_bootstrapped === 1,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function findUserByUsername(username: string): UserRow | null {
  const row = getAuthDb()
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(normalizeUsername(username)) as UserRow | undefined;
  return row ?? null;
}

export function findUserById(id: string): UserRow | null {
  const row = getAuthDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as
    | UserRow
    | undefined;
  return row ?? null;
}

export function listUsers(): PublicUser[] {
  const rows = getAuthDb()
    .prepare("SELECT * FROM users ORDER BY created_at ASC")
    .all() as UserRow[];
  return rows.map(rowToPublic);
}

export async function createUser(input: {
  username: string;
  password: string;
  isAdmin: boolean;
  isBootstrapped?: boolean;
}): Promise<PublicUser> {
  const username = normalizeUsername(input.username);
  if (!username || username.length < 2) throw new Error("Username must be at least 2 characters");
  if (!input.password || input.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  if (findUserByUsername(username)) throw new Error("Username already exists");

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST);
  const row: UserRow = {
    id: uuid(),
    username,
    password_hash: passwordHash,
    is_admin: input.isAdmin ? 1 : 0,
    is_bootstrapped: input.isBootstrapped ? 1 : 0,
    created_at: new Date().toISOString(),
    last_login_at: null,
  };
  getAuthDb()
    .prepare(
      `INSERT INTO users (id, username, password_hash, is_admin, is_bootstrapped, created_at, last_login_at)
       VALUES (@id, @username, @password_hash, @is_admin, @is_bootstrapped, @created_at, @last_login_at)`,
    )
    .run(row);
  return rowToPublic(row);
}

export async function verifyPassword(user: UserRow, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password_hash);
}

export function recordLogin(userId: string): void {
  getAuthDb()
    .prepare("UPDATE users SET last_login_at = ? WHERE id = ?")
    .run(new Date().toISOString(), userId);
}

export function deleteUserById(id: string): void {
  const user = findUserById(id);
  if (!user) throw new Error("User not found");
  if (user.is_bootstrapped === 1) throw new Error("The bootstrapped admin cannot be deleted");
  revokeAllForUser(user.id);
  getAuthDb().prepare("DELETE FROM users WHERE id = ?").run(id);
}

export { rowToPublic as publicUser };
