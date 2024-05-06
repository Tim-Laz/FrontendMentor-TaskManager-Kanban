import React, { useReducer, createContext, useContext, ReactNode } from "react";

const initialData = "";

const ActionContext: React.Context<string> = createContext("");
const ActionDispatchContext: React.Context<any> = createContext({}); // todo

type Props = {
  children: ReactNode;
};

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

function actionReducer(data: string, action: Record<string, string>) {
  switch (action.type) {
    case "adding board": {
      return "adding board";
    }
    case "editing board": {
      return "editing board";
    }
    default:
      return "";
  }
}
