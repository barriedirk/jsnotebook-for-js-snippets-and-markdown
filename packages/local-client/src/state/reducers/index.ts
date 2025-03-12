import { combineReducers } from "redux";

import cellsReducer from "./cellsReducer";
import bundlesReducer from "./bundlesReducer";
import notebooksReducer from "./notebooksReducer";

const reducers = combineReducers({
  cells: cellsReducer,
  blundes: bundlesReducer,
  notebooks: notebooksReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
