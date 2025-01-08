import Api from "./index";

type ListResponse = {
  result: {
    count: number;
    rows: any[];
  };
};

export default class BuildApi{

  public static getAllBuilds(filterParams?: Record<string, string>):Promise<ListResponse>{
    return Api.get("/builds",filterParams || {})
  }

  public static getBuildById(buildId: string) {
    return Api.get(`/builds/${buildId}`, {});
  }

  public static deleteAllBuilds() {
    return Api.delete(`/builds`);
  }

}