import { MetricsFilter, MetricsPayload } from "../../interfaces/metrics";
import ReduxActionTypes from "../redux-action-types";

export const fetchMetricsInit = (payload?: MetricsFilter) => ({
  type: ReduxActionTypes.FETCH_METRICS_INIT,
  payload,
});

export const fetchMetricsSuccess = (payload: MetricsPayload) => ({
  type: ReduxActionTypes.FETCH_METRICS_SUCCESS,
  payload,
});

export const fetchMetricsFailure = (payload: string) => ({
  type: ReduxActionTypes.FETCH_METRICS_FAILURE,
  payload,
});

export const setMetricsFilter = (payload: MetricsFilter) => ({
  type: ReduxActionTypes.SET_METRICS_FILTER,
  payload,
});