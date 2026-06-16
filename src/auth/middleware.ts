import { Request, Response, NextFunction } from "express";
import { findActiveByPlaintext, touchTokenUsage } from "../data-service/tokens-service";
import { findUserById } from "../data-service/users-service";
import { UserRow } from "../data-service/auth-db";
import { isAuthEnabled } from "./bootstrap-admin";

export interface AuthedRequest extends Request {
  user?: UserRow;
}

function extractBearer(req: Request): string | null {
  const header = req.headers["authorization"];
  if (!header || typeof header !== "string") return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  if (!isAuthEnabled()) {
    next();
    return;
  }
  const token = extractBearer(req);
  if (!token) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }
  const record = findActiveByPlaintext(token);
  if (!record) {
    res.status(401).json({ error: "Invalid or revoked token" });
    return;
  }
  const user = findUserById(record.user_id);
  if (!user) {
    res.status(401).json({ error: "Token user not found" });
    return;
  }
  touchTokenUsage(record);
  req.user = user;
  next();
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction): void {
  if (!isAuthEnabled()) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  if (req.user.is_admin !== 1) {
    res.status(403).json({ error: "Admin privileges required" });
    return;
  }
  next();
}
