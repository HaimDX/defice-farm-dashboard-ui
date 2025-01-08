import { AppState } from "../..";

export const getSessionFilterCount = (state: AppState): number => {
  return Object.values(state.ui.filter.session).filter((d) => !!d && d.length)
    .length;
};

export const getSessionFilters = (state: AppState) => state.ui.filter.session;

export const getBuildFilterCount = (state: AppState): number => {
  return 0;
};
