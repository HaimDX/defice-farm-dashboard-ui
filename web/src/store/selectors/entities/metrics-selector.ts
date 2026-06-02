import { AppState } from "../..";

export const getMetricsData = (state: AppState) => state.entities.metrics.data;

export const getMetricsFilter = (state: AppState) =>
  state.entities.metrics.filter;

export const getIsMetricsLoading = (state: AppState) =>
  state.entities.metrics.isLoading;

export const getMetricsError = (state: AppState) =>
  state.entities.metrics.error;