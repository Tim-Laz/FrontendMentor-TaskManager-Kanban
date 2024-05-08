import { createContext, useReducer, ReactNode, useContext } from "react";
import { useData } from "./dataContexReducer";

const ActiveContext: React.Context<string> = createContext("");
const ActiveDispatchContext: React.Context<any> = createContext({});

type Props = {
  children: ReactNode;
};

export function ActiveProvider({ children }: Props) {
  const data = useData();

  const initialActive =
    localStorage.getItem("activeBoard") &&
    data.boards?.some(
      (board) => board.id === localStorage.getItem("activeBoard")
    )
      ? localStorage.getItem("activeBoard")
      : data.boards[0]?.id
      ? data.boards[0].id
      : "";

  const [active, dispatch] = useReducer(activeReducer, initialActive);

  return (
    <ActiveContext.Provider value={active}>
      <ActiveDispatchContext.Provider value={dispatch}>
        {children}
      </ActiveDispatchContext.Provider>
    </ActiveContext.Provider>
  );
}

export function useActive() {
  return useContext(ActiveContext);
}
export function useActiveDispatch() {
  return useContext(ActiveDispatchContext);
}

type ActiveReducerAction = {
  type: string;
  boardID: string;
};

function activeReducer(active: string, action: ActiveReducerAction) {
  switch (action.type) {
    case "change active board":
      localStorage.setItem("activeBoard", action.boardID);
      return action.boardID;
    default:
      return active;
  }
}
