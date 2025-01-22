import { AppState } from "../..";


export const getSessionFilterCount = (state: AppState): number => {
  return Object.values(state.ui.sessionFilter.session).filter((d) => !!d && d.length)
    .length;
};

export const getSessionFilters = (state: AppState) => state.ui.sessionFilter.session;


/**
 *
 * Build filters
 */
export const getBuildFilterCount = (state: AppState): number => {
  return Object.values(state.ui.buildFilter.build).filter((d) => !!d && d.length)
    .length;
};

export const getBuildFilters = (state : AppState) => state.ui.buildFilter.build;

