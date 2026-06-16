import { pluginLogger as log } from "../loggers/plugin-logger";
import { initAuthDb } from "../data-service/auth-db";

let authEnabled = false;

export function isAuthEnabled(): boolean {
  return authEnabled;
}

/**
 * Initialize auth based on the `auth` plugin flag.
 *
 * - `enabled=false`: do nothing. The middleware will be a no-op and admin-only
 *   endpoints respond 404 to keep them hidden.
 * - `enabled=true`: open the SQLite DB. The bootstrapped admin row is seeded by
 *   the DB schema itself (INSERT OR IGNORE), so this is safe whether or not
 *   the device-farm plugin has already created the file.
 */
export async function bootstrapAdmin(enabled: boolean): Promise<void> {
  if (!enabled) {
    authEnabled = false;
    log.info("Auth is disabled (pass --plugin-tractive-appium-dashboard-auth to enable).");
    return;
  }

  initAuthDb();
  authEnabled = true;
  log.info("Auth enabled — using credentials stored in auth.db.");
}
