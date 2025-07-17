import { useParams } from "react-router-dom";
import TaskItem from "../../components/TaskItem";
import AddTask from "../../components/AddTask";
import { useGetTasksByInternQuery } from "./tasksApi";
export default function TasksPage() {
  const { id } = useParams();
  const internId = parseInt(id || "", 10);
  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useGetTasksByInternQuery({ internId }, { skip: !internId });

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Tasks for Intern #{internId}</h2>
      <div className="mt-6">
        {isLoading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks assigned.</p>
        ) : (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} onStatusChange={refetch} />
          ))
        )}
        <AddTask internId={internId} />
      </div>
    </div>
  );
}
