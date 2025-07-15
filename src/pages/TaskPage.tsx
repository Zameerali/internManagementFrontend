import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Task } from "../types/task";
import { getTasksByIntern } from "../services/taskService";
import TaskItem from "../components/TaskItem";
import AddTask from "../components/AddTask";

export default function TasksPage() {
  const { id } = useParams();
  const internId = parseInt(id || "", 10);
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    if (!internId) return;
    const data = await getTasksByIntern(internId);
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [internId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Tasks for Intern #{internId}</h2>

      <div className="mt-6">
        {tasks.length === 0 ? (
          <p>No tasks assigned.</p>
        ) : (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} onStatusChange={fetchTasks} />
          ))
        )}
        <AddTask internId={internId} />
      </div>
    </div>
  );
}
