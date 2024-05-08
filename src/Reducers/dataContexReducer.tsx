import TaskData from "../../data.json";
import { useImmerReducer } from "use-immer";
import { createContext, useContext, ReactNode } from "react";
import { useActive } from "./activeContextReducer";

const initialData = TaskData;
// const initialData: any = { boards: [] };
type Data = typeof initialData;

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
          newColumns.push({
            id: oldCol.id,
            name: newCol.name,
            tasks: oldCol.tasks,
          });
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
    case "add task": {
      const activeBoardIndex = draft.boards.findIndex(
        (board) => board.id === action.activeBoard
      );
      const activeColumnIndex = draft.boards[
        activeBoardIndex
      ].columns.findIndex((column) => column.id === action.columnID);

      draft.boards[activeBoardIndex].columns[activeColumnIndex].tasks.push({
        id: action.id,
        title: action.title,
        description: action.description,
        status: action.status,
        subtasks: action.subtasks,
      });
      break;
    }
    case "check subtask": {
      const activeBoardIndex = draft.boards.findIndex(
        (board) => board.id === action.activeBoard
      );
      const activeColumnIndex = draft.boards[
        activeBoardIndex
      ].columns.findIndex((column) => column.id === action.columnID);

      const activeTaskIndex = draft.boards[activeBoardIndex].columns[
        activeColumnIndex
      ].tasks.findIndex((task) => task.id === action.taskID);

      const activeSubtaskIndex = draft.boards[activeBoardIndex].columns[
        activeColumnIndex
      ].tasks[activeTaskIndex].subtasks.findIndex(
        (subtask) => subtask.id === action.subtaskID
      );

      draft.boards[activeBoardIndex].columns[activeColumnIndex].tasks[
        activeTaskIndex
      ].subtasks[activeSubtaskIndex].isCompleted =
        !draft.boards[activeBoardIndex].columns[activeColumnIndex].tasks[
          activeTaskIndex
        ].subtasks[activeSubtaskIndex].isCompleted;

      break;
    }
    case "change task status": {
      const activeBoardIndex = draft.boards.findIndex(
        (board) => board.id === action.activeBoard
      );
      const activeColumnIndex = draft.boards[
        activeBoardIndex
      ].columns.findIndex((column) => column.id === action.columnID);

      const newColumnIndex = draft.boards[activeBoardIndex].columns.findIndex(
        (column) => column.id === action.newColumnID
      );

      const activeTaskIndex = draft.boards[activeBoardIndex].columns[
        activeColumnIndex
      ].tasks.findIndex((task) => task.id === action.taskID);

      const activeTask =
        draft.boards[activeBoardIndex].columns[activeColumnIndex].tasks[
          activeTaskIndex
        ];

      activeTask.status = action.status;
      draft.boards[activeBoardIndex].columns[newColumnIndex].tasks.push(
        activeTask
      );
      draft.boards[activeBoardIndex].columns[activeColumnIndex].tasks.splice(
        activeTaskIndex,
        1
      );

      break;
    }

    case "delete task": {
      const activeBoardIndex = draft.boards.findIndex(
        (board) => board.id === action.boardID
      );

      const activeColumnIndex = draft.boards[
        activeBoardIndex
      ].columns.findIndex((column) =>
        column.tasks.some((task) => task.id === action.id)
      );

      const activeTaskIndex = draft.boards[activeBoardIndex].columns[
        activeColumnIndex
      ].tasks.findIndex((task) => task.id === action.id);

      draft.boards[activeBoardIndex].columns[activeColumnIndex].tasks.splice(
        activeTaskIndex,
        1
      );

      break;
    }
    case "edit task": {
      const activeBoardIndex = draft.boards.findIndex(
        (board) => board.id === action.activeBoard
      );
      const activeColumnIndex = draft.boards[
        activeBoardIndex
      ].columns.findIndex((column) => column.id === action.columnID);

      const activeTaskIndex = draft.boards[activeBoardIndex].columns[
        activeColumnIndex
      ].tasks.findIndex((task) => task.id === action.id);

      const newColumnIndex = draft.boards[activeBoardIndex].columns.findIndex(
        (column) => column.id === action.newColumnID
      );

      const activeTask =
        draft.boards[activeBoardIndex].columns[activeColumnIndex].tasks[
          activeTaskIndex
        ];

      activeTask.title = action.title;
      activeTask.description = action.description;
      activeTask.subtasks = action.subtasks;
      activeTask.status = action.status;

      if (newColumnIndex !== activeColumnIndex) {
        draft.boards[activeBoardIndex].columns[newColumnIndex].tasks.push(
          activeTask
        );
        draft.boards[activeBoardIndex].columns[activeColumnIndex].tasks.splice(
          activeTaskIndex,
          1
        );
      }

      break;
    }
    default:
      return draft;
  }
}
