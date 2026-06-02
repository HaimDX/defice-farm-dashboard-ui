import { all, put, takeLatest } from "redux-saga/effects";
import { omitBy } from "lodash";
import MetricsApi from "../../api/metrics";
import { ApiResponse } from "../../interfaces/api";
import { MetricsFilter, MetricsPayload } from "../../interfaces/metrics";
import { ReduxActionType } from "../../interfaces/redux";
import {
  fetchMetricsFailure,
  fetchMetricsSuccess,
} from "../actions/metrics-actions";
import ReduxActionTypes from "../redux-action-types";

function* fetchMetrics(action?: ReduxActionType<MetricsFilter>) {
  const payload = omitBy(
    action?.payload || {},
    (v) => v === undefined || v === null || v === ""
  ) as MetricsFilter;
  const response: ApiResponse<MetricsPayload> = yield MetricsApi.getMetrics(
    payload
  );
  if (response?.success) {
    yield put(fetchMetricsSuccess(response.result));
  } else {
    yield put(fetchMetricsFailure("Failed to load metrics"));
  }
}

export default function* () {
  yield all([
    takeLatest(ReduxActionTypes.FETCH_METRICS_INIT, fetchMetrics),
    takeLatest(ReduxActionTypes.SET_METRICS_FILTER, fetchMetrics),
  ]);
}