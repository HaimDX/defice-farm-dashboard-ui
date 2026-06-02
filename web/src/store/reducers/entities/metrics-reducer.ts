import { ReduxActionType } from "../../../interfaces/redux";
import { MetricsFilter, MetricsPayload } from "../../../interfaces/metrics";
import createReducer from "../../../utils/createReducer";
import ReduxActionTypes from "../../redux-action-types";

export type MetricsEntityType = {
  data: MetricsPayload | null;
  filter: MetricsFilter;
  isLoading: boolean;
  error: string | null;
};

const initialState: MetricsEntityType = {
  data: null,
  filter: { days: 30 },
  isLoading: false,
  error: null,
};

export default createReducer(initialState, {
  [ReduxActionTypes.FETCH_METRICS_INIT]: (state: MetricsEntityType) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [ReduxActionTypes.FETCH_METRICS_SUCCESS]: (
    state: MetricsEntityType,
    action: ReduxActionType<MetricsPayload>
  ) => ({
    ...state,
    data: action.payload,
    isLoading: false,
    error: null,
  }),
  [ReduxActionTypes.FETCH_METRICS_FAILURE]: (
    state: MetricsEntityType,
    action: ReduxActionType<string>
  ) => ({
    ...state,
    isLoading: false,
    error: action.payload,
  }),
  [ReduxActionTypes.SET_METRICS_FILTER]: (
    state: MetricsEntityType,
    action: ReduxActionType<MetricsFilter>
  ) => ({
    ...state,
    filter: { ...state.filter, ...action.payload },
  }),
});