import { AppState } from "../..";
import { ReduxActionType } from "../../../interfaces/redux";
import Session from "../../../interfaces/session";
import createReducer from "../../../utils/createReducer";
import ReduxActionTypes from "../../redux-action-types";
import Build from "../../../interfaces/build";

export type SelectedState = {
  session: Session | null;
  build: Build | null;
};

const initialState: SelectedState = {
  session: null,
  build : null
};

export default createReducer(initialState, {
  [ReduxActionTypes.SELECT_SESSION]: (
    state: AppState,
    action: ReduxActionType<Session>,
  ) => ({
    ...state,
    session: action.payload,
  }),
  [ReduxActionTypes.DESELECT_SESSION]: (state: AppState) => ({
    ...state,
    session: null,
  }),

  /** Build **/
  [ReduxActionTypes.SELECT_BUILD]: (
    state: AppState,
    action: ReduxActionType<Build>,
  ) => ({
    ...state,
    build: action.payload,
  }),
  [ReduxActionTypes.DESELECT_BUILD]: (state: AppState) => ({
    ...state,
    build: null,
  }),
});
