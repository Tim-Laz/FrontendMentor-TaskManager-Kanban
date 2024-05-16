import React, {
  useReducer,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
} from "react";

const initialData = "";

type actionType =
  | "adding board"
  | "editing board"
  | "deleting board confirmation"
  | "adding new task"
  | "viewing task"
  | "editing task"
  | "deleting task confirmation"
  | "";

type Props = {
  children: ReactNode;
};

const ActionContext: React.Context<string> = createContext("");
const ActionDispatchContext: React.Context<Dispatch<{ type: actionType }>> =
  createContext((() => {}) as Dispatch<{ type: actionType }>);

export function ActionProvider({ children }: Props) {
  const [action, dispatch] = useReducer(actionReducer, initialData);
  return (
    <ActionContext.Provider value={action}>
      <ActionDispatchContext.Provider value={dispatch}>
        {children}
      </ActionDispatchContext.Provider>
    </ActionContext.Provider>
  );
}

export function useAction() {
  return useContext(ActionContext);
}

export function useActionDispatch() {
  return useContext(ActionDispatchContext);
}

function actionReducer(data: string, action: { type: actionType }) {
  switch (action.type) {
    case "adding board": {
      return "adding board";
    }
    case "editing board": {
      return "editing board";
    }
    case "deleting board confirmation": {
      return "deleting board confirmation";
    }
    case "adding new task": {
      return "adding new task";
    }

    case "viewing task": {
      return "viewing task";
    }
    case "editing task": {
      return "editing task";
    }
    case "deleting task confirmation": {
      return "deleting task confirmation";
    }
    default:
      return "";
  }
}
