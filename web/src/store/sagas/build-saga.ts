import { ReduxActionType } from "../../interfaces/redux";
import { omitBy } from "lodash";
import { ApiResponse, PaginatedResponse } from "../../interfaces/api";
import { all, put, takeEvery, takeLatest } from "redux-saga/effects";
import BuildApi from "../../api/builds";
import ReduxActionTypes from "../redux-action-types";
import Build from "../../interfaces/build";
import { fetchBuildSuccess } from "../actions/build-actions";

function* fetchBuilds(action?: ReduxActionType<Record<string, string>>) {
  const payload = omitBy(action?.payload, (d) => !d);
  const builds: ApiResponse<PaginatedResponse<Build>> =
    yield BuildApi.getAllBuilds(payload);
  if (builds.success) {
    yield put(
      fetchBuildSuccess({
        count: builds.result.count,
        rows: builds.result.rows,
      }),
    );
  }
}

function* fetchBuild(action: ReduxActionType<string>) {
  if (action.payload) {
    const build: ApiResponse<Build> = yield BuildApi.getBuildById(
      action.payload,
    );
    if (build.success) {
      yield put(fetchBuildSuccess(build.result));
    }
  }
}


export default function* () {
  yield all([
    takeEvery(ReduxActionTypes.FETCH_BUILD_INIT, fetchBuilds),
    takeLatest(ReduxActionTypes.FETCH_BUILD, fetchBuild),
  ]);
}