import Checkbox from "../../Checkbox/Checkbox";
import Select from "../../Select/Select";
import "./viewTask.scss";

export default function ViewTask() {
  return (
    <div className="form view-task">
      <div className="view-task__title">
        <h2 className="hL view-task__heading">
          Research pricing points of various competitors and trial different
          business models
        </h2>
        <Select menu={true} options={["Edit Task", "Delete Task"]} />
      </div>
      <p className="view-task__description pL">
        We know what we're planning to build for version one. Now we need to
        finalise the first pricing model we'll use. Keep iterating the subtasks
        until we have a coherent proposition.
      </p>
      <form className="view-task__subtasks">
        <label className="view-task__label pM">Subtasks (2 of 3)</label>
        <Checkbox>Research competitor pricing and business models</Checkbox>
        <Checkbox>
          Outline a business model that works for our solution
        </Checkbox>
        <Checkbox>
          Talk to potential customers about our proposed solution and ask for
          fair price expectancy
        </Checkbox>
      </form>
      <div className="view-task__statuses">
        <label className="view-task__label pM">Current Status</label>
        <Select activeOption={1} options={["Todo", "Doing", "Done"]} />
      </div>
    </div>
  );
}
