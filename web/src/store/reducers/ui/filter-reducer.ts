import { ReduxActionType } from "../../../interfaces/redux";
import createReducer from "../../../utils/createReducer";
import ReduxActionTypes from "../../redux-action-types";

export type SessionFilterType = {
  name: string;
  os: Array<string>;
  status: Array<string>;
  device_udid: string;
  user: Array<string>;
};

export type BuildFilterType = {
  user : string;
  project : Array<string>;
  platform_name : Array<string>;
}

export type FilterState = {
  session: SessionFilterType;
  build: BuildFilterType;
};

const initialState: FilterState = {
  session: {
    name: "",
    os: [],
    status: [],
    device_udid: "",
    user: [],
  },
  build : {
    user : "",
    project : [],
    platform_name : [],
  }
};

export default createReducer(initialState, {
  [ReduxActionTypes.SET_SESSION_FILTER]: (
    state: FilterState,
    action: ReduxActionType<SessionFilterType>,
  ) => ({
    ...state,
    session: action.payload,
  }),
  [ReduxActionTypes.SET_BUILD_FILTER]: (
    state: FilterState,
    action: ReduxActionType<BuildFilterType>,
  ) => ({
    ...state,
    build: action.payload,
  }),
});
