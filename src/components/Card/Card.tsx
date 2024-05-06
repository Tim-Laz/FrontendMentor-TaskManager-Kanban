import "./card.scss";

type Props = {
  children: React.ReactNode;
  allSubtasks: number;
  completedSubtasks: number;
};

export default function Card({
  children,
  allSubtasks,
  completedSubtasks,
}: Props) {
  return (
    <div className="card">
      <h1 className="card__title hM">{children}</h1>
      <p className="card__text pM">
        {completedSubtasks} of {allSubtasks} subtasks
      </p>
    </div>
  );
}
