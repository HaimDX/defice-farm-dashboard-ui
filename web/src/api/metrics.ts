import Api from "./index";
import { MetricsFilter, MetricsPayload } from "../interfaces/metrics";
import { ApiResponse } from "../interfaces/api";

export default class MetricsApi {
  public static getMetrics(
    filter?: MetricsFilter
  ): Promise<ApiResponse<MetricsPayload>> {
    return Api.get("/metrics", filter || {});
  }
}