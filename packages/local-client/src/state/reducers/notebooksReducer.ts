import { produce } from "immer";

import { ActionType } from "@state/action-types";
import { Action } from "@state/actions";
import { FilesNotebook } from "@state/notebook";

interface NotebooksState {
  loading: boolean;
  error: string | null;
  fileNotebooks: FilesNotebook;
}

const initialState: NotebooksState = {
  loading: false,
  error: null,
  fileNotebooks: {
    activeFileId: undefined,
    files: [],
  },
};

const reducer = produce(
  (state: NotebooksState = initialState, action: Action) => {
    switch (action.type) {
      case ActionType.INITIAL_NOTEBOOK:
        state.loading = false;
        state.error = null;
        state.fileNotebooks.activeFileId = action.payload.activeFileId;
        state.fileNotebooks.files = action.payload.files;

        return state;
      case ActionType.LOADING_NOTEBOOK:
        state.loading = true;
        state.error = null;

        return state;
      case ActionType.ERROR_NOTEBOOK:
        state.loading = false;
        state.error = action.payload;

        return state;
      case ActionType.CREATE_NOTEBOOK:
        state.loading = false;
        state.fileNotebooks.files = action.payload.files;
        state.fileNotebooks.activeFileId = action.payload.newNotebook.fileId;

        return state;
      case ActionType.DELETE_NOTEBOOK:
        state.loading = false;
        state.fileNotebooks.activeFileId =
          action.payload.activeFileId ?? undefined;
        state.fileNotebooks.files = action.payload.files;

        return state;
      case ActionType.ACTIVE_NOTEBOOK:
        state.loading = false;
        state.fileNotebooks.activeFileId = action.payload;

        return state;
      case ActionType.UPDATE_NOTEBOOK_TITLE:
        state.loading = false;
        state.fileNotebooks.files = action.payload;

        return state;
      default:
        return state;
    }
  },
  initialState,
);

export default reducer;
