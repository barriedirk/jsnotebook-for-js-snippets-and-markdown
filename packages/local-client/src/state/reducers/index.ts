import { combineReducers } from "redux";

import cellsReducer from "./cellsReducer";
import bundlesReducer from "./bundlesReducer";

const reducers = combineReducers({
  cells: cellsReducer,
  blundes: bundlesReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
