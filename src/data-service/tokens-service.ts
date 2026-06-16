import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { getAuthDb, TokenRow } from "./auth-db";

const TOKEN_BYTES = 32;

function hashToken(plaintext: string): string {
  return crypto.createHash("sha256").update(plaintext).digest("hex");
}

export interface IssuedToken {
  id: string;
  plaintext: string;
}

export function issueToken(userId: string): IssuedToken {
  const plaintext = crypto.randomBytes(TOKEN_BYTES).toString("base64url");
  const id = uuid();
  getAuthDb()
    .prepare(
      `INSERT INTO tokens (id, user_id, token_hash, created_at, last_used_at, revoked_at)
       VALUES (?, ?, ?, ?, NULL, NULL)`,
    )
    .run(id, userId, hashToken(plaintext), new Date().toISOString());
  return { id, plaintext };
}

export function findActiveByPlaintext(plaintext: string): TokenRow | null {
  if (!plaintext) return null;
  const row = getAuthDb()
    .prepare("SELECT * FROM tokens WHERE token_hash = ? AND revoked_at IS NULL")
    .get(hashToken(plaintext)) as TokenRow | undefined;
  return row ?? null;
}

export function touchTokenUsage(token: TokenRow): void {
  getAuthDb()
    .prepare("UPDATE tokens SET last_used_at = ? WHERE id = ?")
    .run(new Date().toISOString(), token.id);
}

export function revokeToken(id: string): void {
  getAuthDb()
    .prepare("UPDATE tokens SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL")
    .run(new Date().toISOString(), id);
}

export function revokeAllForUser(userId: string): void {
  getAuthDb()
    .prepare("UPDATE tokens SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL")
    .run(new Date().toISOString(), userId);
}
