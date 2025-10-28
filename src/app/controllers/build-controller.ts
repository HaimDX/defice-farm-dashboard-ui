import { NextFunction, Router, Request, Response } from "express";
import { Op } from "sequelize";
import { BaseController } from "../commons/base-controller";
import { Build } from "../../models/build";
import { Session } from "../../models/session";
import { parseSessionFilterParams } from "../utils/common-utils";
import _ from "lodash";
import { Project } from "../../models";

export class BuildController extends BaseController {
  public initializeRoutes(router: Router, config: any) {
    router.get("/", this.getBuilds.bind(this));
    router.get("/:build_id/sessions", this.getSessionsForBuild.bind(this));

    //New route for fetching a single build by name
    router.get("/by-name", this.getBuildByName.bind(this));
  }

  public async getBuilds(request: Request, response: Response, next: NextFunction) {
    let { created_at, name , user, platformName } = request.query as any;
    let filter: any = {};
    if (created_at) {
      filter.created_at = { [Op.gte]: new Date(created_at) };
    }
    if (name) {
      filter.name = {
        [Op.like]: `%${name.trim()}%`,
      };
    }
    if (user) {
      filter.user = {
        [Op.like]: `%${user.trim()}%`,
      };
    }
    if( platformName){
      filter.platform_name = {
        [Op.like]: `%${platformName.trim()}%`,
      };
    }
    let builds = await Build.findAndCountAll({
      where: filter,
      include: [
        {
          model: Session,
          as: "sessions",
          required: true,
          where: parseSessionFilterParams(_.pick(request.query as any, ["device_udid", "os"])),
        },
        {
          model: Project,
          as: "project",
        },
      ],
      order: [["updated_at", "DESC"]],
    });
    builds.rows = JSON.parse(JSON.stringify(builds.rows)).map((build: any) => {
      let sessionInfo = {
        total: build.sessions.length,
        passed: build.sessions.filter((s: Session) => s.session_status?.toLowerCase() === "passed").length,
        running: build.sessions.filter((s: Session) => s.session_status?.toLowerCase() === "running").length,
        failed: build.sessions.filter((s: Session) => s.session_status?.toLowerCase() === "failed").length,
        timeout: build.sessions.filter((s: Session) => s.session_status?.toLowerCase() === "timeout").length,
      };

      return _.assign(
        {},
        {
          session: sessionInfo,
          user : build.user || 'undefined user',
          build_id: build.build_id,
          build_name: build.name ? build.name : 'undefined build ',
          project_name: build.project ? build.project.name : 'undefined project',
          platform_name: build.sessions[0].platform_name,
          created_at: build.created_at
        }
      );
    }) as any;
    this.sendSuccessResponse(response, builds);
  }

  public async getSessionsForBuild(request: Request, response: Response, next: NextFunction) {
    let buildId = request.params.build_id;
    const filters = parseSessionFilterParams(request.query as any);

    this.sendSuccessResponse(
      response,
      await Session.findAndCountAll({
        where: {
          build_id: buildId,
          [Op.and]: filters,
        },
        order: [["start_time", "DESC"]],
      })
    );
  }

  public async getBuildByName(request: Request, response: Response, next: NextFunction) {
    try {
      const { name } = request.query as any;

      if (!name) {
        return this.sendFailureResponse(response, "Missing required parameter: name", 400);
      }

      const filter: any = { name: { [Op.eq]: name.trim() } };

      const build = await Build.findOne({
        where: { name: { [Op.eq]: name.trim() } },
        include: [
          { model: Project, as: "project" },
          { model: Session, as: "sessions" },
        ],
        order: [["updated_at", "DESC"]],
      });

      if (!build) {
        return this.sendFailureResponse(response, "Build not found", 404);
      }

      const data = {
        build_id: build.build_id,
        build_name: build.name,
        user: build.user,
        project_name: build.project ? build.project.name : null,
        platform_name: build.platform_name,
        session_count: build.sessions?.length || 0,
        created_at: build.createdAt,
      };

      this.sendSuccessResponse(response, data);
    } catch (error) {
      next(error);
    }
  }
}
