import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";
import { TaskType } from "./dataContexReducer";

type Props = {
  children: ReactNode;
};

type TaskWithColumn = {
  columnID: string;
} & TaskType;

type SetTask = {
  type: "set task";
  taskData: TaskWithColumn;
};
type CheckSubtask = {
  type: "check subtask";
  subtaskID: string;
  completed: boolean;
};

type ChangeStatus = {
  type: "change status";
  columnID: string;
  status: string;
};

type TaskAction = SetTask | CheckSubtask | ChangeStatus;

const initialData = {} as TaskWithColumn;

const TaskContext: React.Context<TaskWithColumn> = createContext(
  {} as TaskWithColumn
);
const TaskDispatchContext: React.Context<Dispatch<TaskAction>> = createContext(
  (() => {}) as Dispatch<TaskAction>
);

export function TaskProvider({ children }: Props) {
  const [task, dispatch] = useReducer(taskReducer, initialData);
  return (
    <TaskContext.Provider value={task}>
      <TaskDispatchContext.Provider value={dispatch}>
        {children}
      </TaskDispatchContext.Provider>
    </TaskContext.Provider>
  );
}

export function useTask() {
  return useContext(TaskContext);
}

export function useTaskDispatch() {
  return useContext(TaskDispatchContext);
}

function taskReducer(task: TaskWithColumn, action: TaskAction) {
  switch (action.type) {
    case "set task": {
      return action.taskData;
    }
    case "check subtask": {
      const newSubtasks = task.subtasks.map((subtask) => {
        return subtask.id === action.subtaskID
          ? {
              id: subtask.id,
              title: subtask.title,
              isCompleted: action.completed,
            }
          : subtask;
      });
      const newTask = {
        ...task,
        subtasks: newSubtasks,
      };
      return newTask;
    }
    case "change status": {
      const newTask = {
        ...task,
        columnID: action.columnID,
        status: action.status,
      };

      return newTask;
    }

    default:
      return task;
  }
}
