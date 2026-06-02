import { NextFunction, Router, Request, Response } from "express";
import { Op } from "sequelize";
import _ from "lodash";
import { BaseController } from "../commons/base-controller";
import { Session } from "../../models/session";
import { Build } from "../../models/build";

type MetricsRange = {
  start: Date;
  end: Date;
};

type SessionRow = {
  session_id: string;
  build_id: string | null;
  name: string | null;
  platform_name: string;
  device_name: string;
  udid: string;
  app_version: string | null;
  user: string | null;
  session_status: "PASSED" | "FAILED" | "TIMEOUT" | "RUNNING" | string;
  start_time: Date;
  end_time: Date | null;
};

function parseRange(query: any): MetricsRange {
  const end = query.end ? new Date(query.end) : new Date();
  const days = query.days ? Math.max(1, parseInt(query.days, 10)) : 30;
  const start = query.start
    ? new Date(query.start)
    : new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  return { start, end };
}

function dayKey(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function eachDay(range: MetricsRange): string[] {
  const out: string[] = [];
  const cursor = new Date(range.start);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(range.end);
  end.setHours(0, 0, 0, 0);
  while (cursor.getTime() <= end.getTime()) {
    out.push(dayKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

function durationSeconds(s: SessionRow): number | null {
  if (!s.end_time) return null;
  const ms = new Date(s.end_time).getTime() - new Date(s.start_time).getTime();
  if (!isFinite(ms) || ms < 0) return null;
  return ms / 1000;
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export class MetricsController extends BaseController {
  public initializeRoutes(router: Router) {
    router.get("/", this.getMetrics.bind(this));
  }

  public async getMetrics(request: Request, response: Response, next: NextFunction) {
    try {
      const range = parseRange(request.query);
      const { platform, app_version, user } = request.query as any;

      const where: any = {
        start_time: { [Op.between]: [range.start, range.end] },
      };
      if (platform) {
        where.platform_name = {
          [Op.in]: String(platform).split(",").map((p) => p.toUpperCase()),
        };
      }
      if (app_version) {
        where.app_version = { [Op.like]: `%${String(app_version).trim()}%` };
      }
      if (user) {
        where.user = { [Op.like]: `%${String(user).trim()}%` };
      }

      const rawSessions = await Session.findAll({
        where,
        attributes: [
          "session_id",
          "build_id",
          "name",
          "platform_name",
          "device_name",
          "udid",
          "app_version",
          "user",
          "session_status",
          "start_time",
          "end_time",
        ],
        order: [["start_time", "ASC"]],
      });

      const sessions: SessionRow[] = JSON.parse(JSON.stringify(rawSessions));

      const kpis = this.computeKpis(sessions);
      const trend = this.computeDailyTrend(sessions, range);
      const platformSplit = this.computePlatformSplit(sessions);
      const topFailingTests = this.computeTopFailingTests(sessions);
      const deviceReliability = this.computeDeviceReliability(sessions);
      const buildHealth = await this.computeBuildHealth(sessions);
      const appVersions = this.computeAppVersionBreakdown(sessions);

      this.sendSuccessResponse(response, {
        range: { start: range.start, end: range.end },
        kpis,
        trend,
        platform_split: platformSplit,
        top_failing_tests: topFailingTests,
        device_reliability: deviceReliability,
        build_health: buildHealth,
        app_versions: appVersions,
      });
    } catch (error) {
      next(error);
    }
  }

  private computeKpis(sessions: SessionRow[]) {
    const total = sessions.length;
    const byStatus = _.countBy(sessions, (s) =>
      (s.session_status || "").toUpperCase()
    );
    const passed = byStatus["PASSED"] || 0;
    const failed = byStatus["FAILED"] || 0;
    const timeout = byStatus["TIMEOUT"] || 0;
    const running = byStatus["RUNNING"] || 0;

    const completed = passed + failed + timeout;
    const passRate = completed ? (passed / completed) * 100 : 0;

    const durations = sessions
      .map(durationSeconds)
      .filter((v): v is number => v !== null);
    const avgDurationSec = average(durations);

    // Flaky tests: same test name appears as both passed and failed in window
    const byName = _.groupBy(
      sessions.filter((s) => s.name),
      "name"
    );
    let flakyCount = 0;
    for (const name of Object.keys(byName)) {
      const statuses = new Set(
        byName[name].map((s) => (s.session_status || "").toUpperCase())
      );
      if (statuses.has("PASSED") && (statuses.has("FAILED") || statuses.has("TIMEOUT"))) {
        flakyCount++;
      }
    }
    const namedTotal = Object.keys(byName).length;
    const flakyRate = namedTotal ? (flakyCount / namedTotal) * 100 : 0;

    const uniqueBuilds = new Set(sessions.map((s) => s.build_id).filter(Boolean)).size;
    const uniqueAppVersions = new Set(
      sessions.map((s) => s.app_version).filter(Boolean)
    ).size;

    return {
      total,
      passed,
      failed,
      timeout,
      running,
      pass_rate: Number(passRate.toFixed(2)),
      avg_duration_sec: Number(avgDurationSec.toFixed(1)),
      flaky_tests: flakyCount,
      flaky_rate: Number(flakyRate.toFixed(2)),
      unique_builds: uniqueBuilds,
      unique_app_versions: uniqueAppVersions,
    };
  }

  private computeDailyTrend(sessions: SessionRow[], range: MetricsRange) {
    const days = eachDay(range);
    const buckets: Record<string, SessionRow[]> = {};
    days.forEach((d) => (buckets[d] = []));
    sessions.forEach((s) => {
      const k = dayKey(new Date(s.start_time));
      if (buckets[k]) buckets[k].push(s);
    });

    return days.map((day) => {
      const list = buckets[day];
      const byStatus = _.countBy(list, (s) =>
        (s.session_status || "").toUpperCase()
      );
      const durations = list
        .map(durationSeconds)
        .filter((v): v is number => v !== null);
      return {
        day,
        total: list.length,
        passed: byStatus["PASSED"] || 0,
        failed: byStatus["FAILED"] || 0,
        timeout: byStatus["TIMEOUT"] || 0,
        running: byStatus["RUNNING"] || 0,
        avg_duration_sec: Number(average(durations).toFixed(1)),
      };
    });
  }

  private computePlatformSplit(sessions: SessionRow[]) {
    const grouped = _.groupBy(sessions, (s) =>
      (s.platform_name || "UNKNOWN").toUpperCase()
    );
    return Object.entries(grouped).map(([platform, list]) => {
      const byStatus = _.countBy(list, (s) =>
        (s.session_status || "").toUpperCase()
      );
      const passed = byStatus["PASSED"] || 0;
      const failed = byStatus["FAILED"] || 0;
      const timeout = byStatus["TIMEOUT"] || 0;
      const completed = passed + failed + timeout;
      return {
        platform,
        total: list.length,
        passed,
        failed,
        timeout,
        pass_rate: completed ? Number(((passed / completed) * 100).toFixed(2)) : 0,
      };
    });
  }

  private computeTopFailingTests(sessions: SessionRow[]) {
    const named = sessions.filter((s) => s.name);
    const grouped = _.groupBy(named, "name");
    const rows = Object.entries(grouped).map(([name, list]) => {
      const byStatus = _.countBy(list, (s) =>
        (s.session_status || "").toUpperCase()
      );
      const passed = byStatus["PASSED"] || 0;
      const failed = (byStatus["FAILED"] || 0) + (byStatus["TIMEOUT"] || 0);
      const completed = passed + failed;
      const lastFailure = _.maxBy(
        list.filter((s) =>
          ["FAILED", "TIMEOUT"].includes((s.session_status || "").toUpperCase())
        ),
        (s) => new Date(s.start_time).getTime()
      );
      return {
        name,
        total: list.length,
        failed,
        passed,
        pass_rate: completed ? Number(((passed / completed) * 100).toFixed(2)) : 0,
        last_failure_at: lastFailure ? lastFailure.start_time : null,
      };
    });
    return _.orderBy(rows, ["failed", "total"], ["desc", "desc"]).slice(0, 20);
  }

  private computeDeviceReliability(sessions: SessionRow[]) {
    const grouped = _.groupBy(
      sessions,
      (s) => `${s.device_name || "?"}::${s.udid || "?"}`
    );
    const rows = Object.entries(grouped).map(([key, list]) => {
      const [device_name, udid] = key.split("::");
      const byStatus = _.countBy(list, (s) =>
        (s.session_status || "").toUpperCase()
      );
      const passed = byStatus["PASSED"] || 0;
      const failed = byStatus["FAILED"] || 0;
      const timeout = byStatus["TIMEOUT"] || 0;
      const completed = passed + failed + timeout;
      const durations = list
        .map(durationSeconds)
        .filter((v): v is number => v !== null);
      return {
        device_name,
        udid,
        platform: (list[0]?.platform_name || "").toUpperCase(),
        total: list.length,
        passed,
        failed,
        timeout,
        pass_rate: completed ? Number(((passed / completed) * 100).toFixed(2)) : 0,
        avg_duration_sec: Number(average(durations).toFixed(1)),
      };
    });
    return _.orderBy(rows, ["total"], ["desc"]).slice(0, 25);
  }

  private async computeBuildHealth(sessions: SessionRow[]) {
    const grouped = _.groupBy(
      sessions.filter((s) => s.build_id),
      "build_id"
    );
    const buildIds = Object.keys(grouped);
    if (!buildIds.length) return [];

    const builds = await Build.findAll({
      where: { build_id: { [Op.in]: buildIds } },
      attributes: ["build_id", "name", "user", "platform_name", "app_version", "created_at"],
    });
    const buildMap = _.keyBy(JSON.parse(JSON.stringify(builds)), "build_id");

    const rows = buildIds.map((build_id) => {
      const list = grouped[build_id];
      const byStatus = _.countBy(list, (s) =>
        (s.session_status || "").toUpperCase()
      );
      const passed = byStatus["PASSED"] || 0;
      const failed = byStatus["FAILED"] || 0;
      const timeout = byStatus["TIMEOUT"] || 0;
      const completed = passed + failed + timeout;
      const durations = list
        .map(durationSeconds)
        .filter((v): v is number => v !== null);
      const meta = buildMap[build_id] || {};
      return {
        build_id,
        build_name: meta.name || null,
        user: meta.user || null,
        platform: meta.platform_name || (list[0]?.platform_name || ""),
        app_version: meta.app_version || null,
        created_at: meta.created_at || null,
        total: list.length,
        passed,
        failed,
        timeout,
        pass_rate: completed ? Number(((passed / completed) * 100).toFixed(2)) : 0,
        avg_duration_sec: Number(average(durations).toFixed(1)),
      };
    });
    return _.orderBy(rows, ["created_at"], ["desc"]).slice(0, 20);
  }

  private computeAppVersionBreakdown(sessions: SessionRow[]) {
    const versioned = sessions.filter((s) => s.app_version);
    const grouped = _.groupBy(versioned, "app_version");
    const rows = Object.entries(grouped).map(([app_version, list]) => {
      const byStatus = _.countBy(list, (s) =>
        (s.session_status || "").toUpperCase()
      );
      const passed = byStatus["PASSED"] || 0;
      const failed = byStatus["FAILED"] || 0;
      const timeout = byStatus["TIMEOUT"] || 0;
      const completed = passed + failed + timeout;
      return {
        app_version,
        total: list.length,
        passed,
        failed,
        timeout,
        pass_rate: completed ? Number(((passed / completed) * 100).toFixed(2)) : 0,
      };
    });
    return _.orderBy(rows, ["total"], ["desc"]).slice(0, 15);
  }
}