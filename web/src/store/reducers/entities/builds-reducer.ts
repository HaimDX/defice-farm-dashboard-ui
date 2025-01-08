import { ListEntityType } from ".";
import { PaginatedResponse } from "../../../interfaces/api";
import { ReduxActionType } from "../../../interfaces/redux";
import createReducer from "../../../utils/createReducer";
import ReduxActionTypes from "../../redux-action-types";
import Build from "../../../interfaces/build";

export type BuildEntityType = ListEntityType<Build>;

const initialState: BuildEntityType = {
  count: 0,
  items: [],
  isLoading: false,
};

export default createReducer(initialState, {
  [ReduxActionTypes.FETCH_BUILD_INIT]: (state: BuildEntityType) => ({
    ...state,
    isLoading: true,
  }),
  [ReduxActionTypes.FETCH_BUILD_SUCCESS]: (
    state: BuildEntityType,
    action: ReduxActionType<PaginatedResponse<Build>>,
  ) => ({
    ...state,
    count: action.payload?.count,
    items: action.payload?.rows,
    isLoading: false,
  }),
});
