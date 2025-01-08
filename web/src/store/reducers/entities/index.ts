import { combineReducers } from "@reduxjs/toolkit";
import SessionsReducer, { SessionEntityType } from "./sessions-reducer";
import LogsReducer, { LogsState } from "./logs-reducer";
import BuildsReducer, { BuildEntityType } from "./builds-reducer";

export type ListEntityType<T> = {
  count: number;
  items: Array<T>;
  isLoading: boolean;
};

export type EntitiesState = {
  sessions: SessionEntityType;
  builds: BuildEntityType;
  logs: LogsState;
};

export default combineReducers({
  sessions: SessionsReducer,
  builds: BuildsReducer,
  logs: LogsReducer,
});
