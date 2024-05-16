import TaskData from "../../data.json";
import { useImmerReducer } from "use-immer";
import { createContext, useContext, ReactNode, Dispatch } from "react";

type Props = {
  children: ReactNode;
};

export type SubtaskType = {
  id: string;
  title: string;
  isCompleted: boolean;
};

export type TaskType = {
  id: string;
  title: string;
  description: string;
  status: string;
  subtasks: SubtaskType[];
};

type ColumnType = {
  id: string;
  name: string;
  tasks: TaskType[];
};

export type BoardType = {
  id: string;
  name: string;
  columns: ColumnType[];
};

type DataType = {
  boards: BoardType[];
};

type ActionBoard = {
  id: string;
  name: string;
  columns: ColumnType[];
};

type AddBoard = {
  type: "add board";
} & ActionBoard;

type EditBoard = {
  type: "edit board";
} & ActionBoard;

type DeleteBoard = {
  type: "delete board";
  id: string;
};

type ActionTask = {
  activeBoard: string;
  id: string;
  title: string;
  description: string;
  status: string;
  subtasks: SubtaskType[];
  columnID: string;
};

type AddTask = {
  type: "add task";
} & ActionTask;

type EditTask = {
  type: "edit task";
  newColumnID: string;
} & ActionTask;
type DeleteTask = {
  type: "delete task";
  id: string;
  boardID: string;
};

type ActionViewTask = {
  taskID: string;
  activeBoard: string;
  columnID: string;
};
type ChangeTaskStatus = {
  type: "change task status";
  newColumnID: string;
  status: string;
} & ActionViewTask;
type CheckSubtask = {
  type: "check subtask";
  subtaskID: string;
} & ActionViewTask;

type DataAction =
  | AddBoard
  | EditBoard
  | DeleteBoard
  | AddTask
  | EditTask
  | DeleteTask
  | ChangeTaskStatus
  | CheckSubtask;

const initialData: DataType = localStorage.getItem("taskData")
  ? JSON.parse(localStorage.getItem("taskData") as string)
  : TaskData;

const DataContext: React.Context<DataType> = createContext({} as DataType);
const DataDispatchContext: React.Context<Dispatch<DataAction>> = createContext(
  (() => {}) as Dispatch<DataAction>
);

function updateLocalStorage(data: DataType) {
  localStorage.setItem("taskData", JSON.stringify(data));
}

export function DataProvider({ children }: Props) {
  const [data, dispatch] = useImmerReducer(dataReducer, initialData);
  updateLocalStorage(data);
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

function dataReducer(draft: DataType, action: DataAction) {
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

      const newColumns: ColumnType[] = [];
      action.columns.forEach((newCol: ColumnType) => {
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
      activeTask.status = action.status;

      const newSubtaks: SubtaskType[] = [];
      action.subtasks.forEach((newSub: SubtaskType) => {
        const oldSub = draft.boards[activeBoardIndex].columns[
          activeColumnIndex
        ].tasks[activeTaskIndex].subtasks.find((sub) => sub.id === newSub.id);
        if (oldSub !== undefined) {
          newSubtaks.push({
            id: oldSub.id,
            title: newSub.title,
            isCompleted: oldSub.isCompleted,
          });
        } else {
          newSubtaks.push(newSub);
        }
      });

      activeTask.subtasks = newSubtaks;

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
