import TaskData from "../../data.json";
import { useImmerReducer } from "use-immer";
import { createContext, useContext, ReactNode } from "react";

const initialData = TaskData;
type Data = typeof TaskData;

const DataContext: React.Context<Data> = createContext({} as Data);
const DataDispatchContext: React.Context<any> = createContext({});

type Props = {
  children: ReactNode;
};

export function DataProvider({ children }: Props) {
  const [data, dispatch] = useImmerReducer(dataReducer, initialData);
  return (
    <DataContext.Provider value={data}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
export function useDataDispatch() {
  return useContext(DataDispatchContext);
}

function dataReducer(draft: Data, action: Record<string, any>) {
  switch (action.type) {
    case "add board": {
      draft.boards.push({
        id: action.id,
        name: action.name,
        columns: action.columns,
      });
      break;
    }
    case "edit board": {
      const editIndex = draft.boards.findIndex(
        (board) => board.id === action.id
      );
      console.log(editIndex, action.id);
      draft.boards[editIndex].name = action.name;
      type column = {
        id: string;
        name: string;
        tasks: any[];
      };
      const newColumns: column[] = [];
      action.columns.forEach((newCol: column) => {
        const oldCol = draft.boards[editIndex].columns.find(
          (col) => col.id === newCol.id
        );
        if (oldCol !== undefined) {
          newColumns.push(oldCol);
        } else {
          newColumns.push(newCol);
        }
      });
      draft.boards[editIndex].columns = newColumns;
      break;
    }
    case "delete board": {
      const deleteIndex = draft.boards.findIndex(
        (board) => board.id === action.id
      );
      draft.boards.splice(deleteIndex, 1);
      break;
    }
    default:
      return draft;
  }
}
