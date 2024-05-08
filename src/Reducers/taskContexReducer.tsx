import { ReactNode, createContext, useContext, useReducer } from "react";

const initialData = {};

const TaskContext: React.Context<any> = createContext({});
const TaskDispatchContext: React.Context<any> = createContext({});

type Props = {
  children: ReactNode;
};

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

function taskReducer(task, action) {
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
