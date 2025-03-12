import { Dispatch } from "redux";
import { Action } from "@state/actions";
import { ActionType } from "@state/action-types";
import { saveCells } from "@state/action-creators";
import { RootState } from "@state/reducers";

import { ThunkMiddleware } from "redux-thunk";

interface PersistMiddlewareStoreProps {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}

// type PersistMiddlewareNextProps = (action: Action) => void;
type PersistMiddlewareNextProps = (action: unknown) => void; // Type action as `unknown` to align with ThunkMiddleware

export const persistMiddleware: ThunkMiddleware<RootState, Action> = ({
  dispatch,
  getState,
}: PersistMiddlewareStoreProps) => {
  let timer: ReturnType<typeof setTimeout>;

  return (next: PersistMiddlewareNextProps) => {
    return (action: unknown) => {
      // Type assertion here to let TypeScript know this action is an Action
      const typedAction = action as Action;

      next(typedAction); // Passing action to the next middleware

      // Check action type
      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(typedAction.type)
      ) {
        if (timer) clearTimeout(timer);

        // Delay saveCells dispatch to debounce saving cells
        timer = setTimeout(() => {
          saveCells()(dispatch, getState);
        }, 250);
      }
    };
  };
};

/*

ThunkMiddleware expects a function signature like this:
(store: MiddlewareAPI<Dispatch<Action>, RootState>) => (next: Dispatch<Action>) => (action: Action) => void;


Note: there was an error with typescript and persistMiddleware: ThunkMiddleware<RootState, Action>

Explanation: 
The error you're seeing arises because redux-thunk's ThunkMiddleware expects the action type in the next function to be unknown, whereas your persistMiddleware is trying to type it as Action.

The core of the issue is that redux-thunk expects middleware to handle actions of type unknown, while your middleware is strongly typing actions as Action.

Let me show you how to fix this by adjusting the persistMiddleware function's type to handle the unknown action type that redux-thunk expects, while maintaining your custom action types.
*/
