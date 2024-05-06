import "./taskColumn.scss";

type Props = {
  children: React.ReactNode;
  title: string;
  tasksCount: number;
};

export default function TaskColumn({ children, title, tasksCount }: Props) {
  return (
    <div className="task-column">
      <div className="task-column__header">
        <div className="task-column__color"></div>
        <p className="task-column__title hS">
          {title + " (" + tasksCount + ")"}
        </p>
      </div>
      <div className="task-column__body-container">
        <div className="task-column__body">{children}</div>
      </div>
    </div>
  );
}
