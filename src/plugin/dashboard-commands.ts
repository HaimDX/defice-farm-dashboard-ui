import { Session, Logs } from "../models/index";
import { SessionInfo } from "../interfaces/session-info";
import { logger } from "../loggers/logger";
import { pluginLogger } from "../loggers/plugin-logger";
export class DashboardCommands {
  constructor(private sessionInfo: SessionInfo) {
    (this as any).updateStatus = this.updateStatus.bind(this);
  }

  /**
   * commandName: dashboard: setTestName
   */
  public async setTestName(args: any[]): Promise<void> {
    logger.info(`Updating test name for session ${args[0]}`);
    await Session.update(
      {
        name: args[0],
      },
      {
        where: { session_id: this.sessionInfo.session_id },
      }
    );
  }

  /**
   * commandName: dashboard: debug
   */
  public async debug(args: any[]): Promise<void> {
    logger.info(`Adding debug logs for session ${this.sessionInfo.session_id}`);
    let props: any = args[0];
    await Logs.create({
      session_id: this.sessionInfo.session_id,
      log_type: "DEBUG",
      message: props.message,
      args: props.args || null,
      timestamp: new Date(),
    } as any);
  }

  /**
   * commandName: dashboard: updateStatus
   */
  public async updateStatus(args: any[]): Promise<void> {
    pluginLogger.info(`Updating test status for session ${this.sessionInfo.session_id}`);

    const props: any = Array.isArray(args[0]) ? args[0][0] : args[0];
    pluginLogger.info(
      `Updating status for session ${this.sessionInfo.session_id} with status ${props.status} and message ${props.message}`
    );

    if (!props.status || !/(passed|failed|retried)/i.test(props.status)) {
      pluginLogger.info(
        `Not updating status for session ${this.sessionInfo.session_id} as status '${props.status}' is unsupported`
      );
      return;
    }

    let normalizedStatus = props.status.toUpperCase();
    let isPassed = props.status.toLowerCase() === "passed";

    await Session.update(
      {
        session_status_message: props.message,
        session_status: normalizedStatus,
        is_test_passed: isPassed,
      },
      {
        where: { session_id: this.sessionInfo.session_id },
      }
    );

    pluginLogger.info(
      `✅ Updated session ${this.sessionInfo.session_id} in DB with status ${normalizedStatus}`
    );
  }

}
