import { ActionType } from "@state/action-types";
import { Cell, CellTypes } from "@state/cell";
import { Notebook } from "@state/notebook";

export type Direction = "up" | "down";

export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: Direction;
  };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string; // id
}

export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: {
    id: string | null;
    type: CellTypes;
  };
}

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: string;
    content: string;
  };
}

export interface BundleStartAction {
  type: ActionType.BUNDLE_START;
  payload: {
    cellId: string;
  };
}

export interface BundleCompleteAction {
  type: ActionType.BUNDLE_COMPLETE;
  payload: {
    cellId: string;
    bundle: {
      code: string;
      err: string;
    };
  };
}

export interface FetchCellsAction {
  type: ActionType.FETCH_CELLS;
}

export interface FethCellsCompleteAction {
  type: ActionType.FETCH_CELLS_COMPLETE;
  payload: Cell[];
}

export interface FetchCellsErrorAction {
  type: ActionType.FETCH_CELLS_ERROR;
  payload: string;
}

export interface SaveCellsErrorAction {
  type: ActionType.SAVE_CELLS_ERROR;
  payload: string;
}

export interface InitialNotebook {
  type: ActionType.INITIAL_NOTEBOOK;
  payload: {
    activeFileId: string | undefined;
    files: Notebook[];
  };
}

export interface ErrorNotebook {
  type: ActionType.ERROR_NOTEBOOK;
  payload: string;
}

export interface CreateNotebook {
  type: ActionType.CREATE_NOTEBOOK;
  payload: {
    newNotebook: Notebook;
    files: Notebook[];
  };
}

export interface DeleteNotebook {
  type: ActionType.DELETE_NOTEBOOK;
  payload: {
    activeFileId: string | null | undefined;
    files: Notebook[];
  };
}

export interface SetNotebook {
  type: ActionType.ACTIVE_NOTEBOOK;
  payload: string; // fileId
}

export interface UpdateNotebookTitle {
  type: ActionType.UPDATE_NOTEBOOK_TITLE;
  payload: Notebook[];
}

export interface LoadingNotebook {
  type: ActionType.LOADING_NOTEBOOK;
}

export type Action =
  | MoveCellAction
  | DeleteCellAction
  | InsertCellAfterAction
  | UpdateCellAction
  | BundleStartAction
  | BundleCompleteAction
  | FetchCellsAction
  | FethCellsCompleteAction
  | FetchCellsErrorAction
  | InitialNotebook
  | ErrorNotebook
  | SaveCellsErrorAction
  | LoadingNotebook
  | CreateNotebook
  | DeleteNotebook
  | SetNotebook
  | UpdateNotebookTitle;
