import ReduxActionTypes from "../redux-action-types";
import Build from "../../interfaces/build";

export const fetchBuildInit = (payload?: any) => ({
  type: ReduxActionTypes.FETCH_BUILD_INIT,
  payload,
});

export const setBuildFilter = (payload: any) => ({
  type: ReduxActionTypes.SET_BUILD_FILTER,
  payload,
});

export const fetchBuildSuccess = (payload: Build) => ({
  type: ReduxActionTypes.FETCH_BUILD_SUCCESS,
  payload,
});

export const setSelectedBuild = (payload: Build | null) => ({
  type: ReduxActionTypes.SELECT_BUILD,
  payload,
});