import { combineReducers } from "redux";
import AppInitialised, { AppInitilisedState } from "./app-initialised";
import SelectedReducer, { SelectedState } from "./selected-reducer";
import ThemeReducer, { ThemeState } from "./theme-reducer";
import FilterReducer, {  FilterState } from "./filter-reducer";
import LoaderReducer, { LoadersState } from "./loaders";

export type UIState = {
  theme: ThemeState;
  selected: SelectedState;
  appInitialised: AppInitilisedState;
  sessionFilter: FilterState;
  buildFilter: FilterState;
  loaders: LoadersState;
};

export default combineReducers({
  theme: ThemeReducer,
  selected: SelectedReducer,
  appInitialised: AppInitialised,
  sessionFilter: FilterReducer,
  buildFilter: FilterReducer,
  loaders: LoaderReducer,
});
