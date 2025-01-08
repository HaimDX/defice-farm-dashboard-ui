import { AppState } from "../..";

export const getBuilds = (state: AppState) => state.entities.builds.items;

export const getIsBuildsLoading = (state: AppState) =>
  state.entities.builds.isLoading;

export const getSelectedBuild = (state: AppState) =>
  state.ui.selected.build;