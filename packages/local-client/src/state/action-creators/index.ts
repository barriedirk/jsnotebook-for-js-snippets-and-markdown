import axios from "axios";

import { Dispatch } from "redux";
import { ActionType } from "@state/action-types";
import {
  UpdateCellAction,
  DeleteCellAction,
  MoveCellAction,
  InsertCellAfterAction,
  Direction,
  Action,
} from "@state/actions";
import { RootState } from "@state/reducers";
import { Cell, CellTypes } from "@state/cell";
import { FilesNotebook, Notebook } from "@state/notebook";

import bundle from "@blunder/index";

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

export const insertCellAfter = (
  id: string | null,
  cellType: CellTypes,
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      type: cellType,
    },
  };
};

export const createBundle = (cellId: string, input: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BUNDLE_START,
      payload: {
        cellId,
      },
    });

    const result = await bundle(input);

    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: {
        cellId,
        bundle: result,
      },
    });
  };
};

export const fetchCells = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const { notebooks } = getState();

    dispatch({ type: ActionType.FETCH_CELLS });

    try {
      const { data }: { data: Cell[] } = await axios.get("/cells", {
        headers: {
          activeFileId: notebooks.fileNotebooks?.activeFileId,
        },
      });

      dispatch({
        type: ActionType.FETCH_CELLS_COMPLETE,
        payload: data,
      });
    } catch (err) {
      if (err instanceof Error) {
        dispatch({
          type: ActionType.FETCH_CELLS_ERROR,
          payload: err.message,
        });
      }
    }
  };
};

export const saveCells = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const {
      notebooks,
      cells: { data, order },
    } = getState();

    const cells = order.map((id) => data[id]);

    try {
      await axios.post(
        "/cells",
        {
          cells,
        },
        {
          headers: {
            activeFileId: notebooks.fileNotebooks?.activeFileId,
          },
        },
      );
    } catch (err) {
      if (err instanceof Error) {
        dispatch({
          type: ActionType.SAVE_CELLS_ERROR,
          payload: err.message,
        });
      }
    }
  };
};

const updateOrderByTitle = (notebooks: Notebook[]) => {
  return notebooks
    .slice()
    .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
};

const errorNotebook = (dispatch: Dispatch<Action>, err: string) => {
  dispatch({
    type: ActionType.ERROR_NOTEBOOK,
    payload: err,
  });
};

export const fetchNotebooks = () => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const {
        data: { files, activeFileId },
      }: { data: FilesNotebook } = await axios.get("/filenotebooks");

      dispatch({
        type: ActionType.INITIAL_NOTEBOOK,
        payload: { files, activeFileId },
      });
    } catch (err) {
      if (err instanceof Error) {
        errorNotebook(dispatch, err.message);
      }
    }
  };
};

export const createNotebook = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const { notebooks } = getState();
    const newFileNotebooks = { ...notebooks.fileNotebooks };
    const newNotebook = {
      title: "[New Notebook]",
      fileId: crypto.randomUUID(),
    };

    let files = [...newFileNotebooks.files];

    files.push(newNotebook);
    files = updateOrderByTitle(files);

    try {
      await axios.post("/filenotebooks", {
        files,
        activeFileId: newNotebook.fileId,
      });

      dispatch({
        type: ActionType.CREATE_NOTEBOOK,
        payload: { newNotebook, files },
      });
    } catch (err) {
      if (err instanceof Error) {
        errorNotebook(dispatch, err.message);
      }
    }
  };
};

export const deleteNotebook = (fileId: string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const { notebooks } = getState();
    const filesFiltered = notebooks.fileNotebooks.files.filter(
      (notebook) => notebook.fileId !== fileId,
    );
    const activeFileId =
      notebooks.fileNotebooks.activeFileId === fileId
        ? undefined
        : notebooks.fileNotebooks.activeFileId;

    try {
      await axios.post(
        "/filenotebooks",
        {
          files: filesFiltered,
          activeFileId,
        },
        {
          headers: {
            deleteFileId: fileId,
          },
        },
      );

      dispatch({
        type: ActionType.DELETE_NOTEBOOK,
        payload: { activeFileId, files: filesFiltered },
      });
    } catch (err) {
      if (err instanceof Error) {
        errorNotebook(dispatch, err.message);
      }
    }
  };
};

export const setNotebook = (fileId: string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const { notebooks } = getState();

    try {
      await axios.post("/filenotebooks", {
        files: notebooks.fileNotebooks.files,
        activeFileId: fileId,
      });

      dispatch({
        type: ActionType.ACTIVE_NOTEBOOK,
        payload: fileId,
      });
    } catch (err) {
      if (err instanceof Error) {
        errorNotebook(dispatch, err.message);
      }
    }
  };
};

export const updateNoteboolTitle = (title: string, fileId: string) => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const { notebooks } = getState();

    let files = [...notebooks.fileNotebooks.files];
    const idx = files.findIndex((notebook) => notebook.fileId == fileId);

    if (idx > -1) {
      files[idx] = { ...files[idx], title };
    }

    files = updateOrderByTitle(files);

    try {
      await axios.post("/filenotebooks", {
        files,
        activeFileId: fileId,
      });

      dispatch({
        type: ActionType.UPDATE_NOTEBOOK_TITLE,
        payload: files,
      });
    } catch (err) {
      if (err instanceof Error) {
        errorNotebook(dispatch, err.message);
      }
    }
  };
};
