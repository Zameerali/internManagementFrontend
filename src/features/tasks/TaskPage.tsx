import { useParams } from "react-router-dom";
import TaskItem from "../../components/TaskItem";
import AddTask from "../../components/AddTask";
import { useGetTasksByInternQuery } from "./tasksApi";
import { useGetAllProjectsQuery } from "../../features/projects/projectsApi";
import { useGetAllAssignedInternsQuery } from "../../features/projects/projectsApi";
export default function TasksPage() {
  const { id } = useParams();
  const internId = parseInt(id || "", 10);
  if (!internId || isNaN(internId)) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2 text-red-600">
          Invalid intern ID.
        </h2>
      </div>
    );
  }

  const {
    data: tasks = [],
    isLoading,
    refetch,
  } = useGetTasksByInternQuery({ internId }, { skip: !internId });

  const { data: assignedMap = {} } = useGetAllAssignedInternsQuery();
  const projectId = Object.keys(assignedMap).find((pid) =>
    assignedMap[Number(pid)].includes(internId)
  );
  const numericProjectId = projectId ? Number(projectId) : null;

  const { data: projects = [] } = useGetAllProjectsQuery();
  const project = numericProjectId
    ? projects.find((p: any) => p.id === numericProjectId)
    : null;
  const projectName = project ? project.name : "";

  const currentTasks = tasks.filter(
    (task) => task.project_id === numericProjectId
  );
  const previousTasksByProject: { [key: number]: typeof tasks } = {};
  tasks.forEach((task) => {
    if (task.project_id !== numericProjectId) {
      if (!previousTasksByProject[task.project_id])
        previousTasksByProject[task.project_id] = [];
      previousTasksByProject[task.project_id].push(task);
    }
  });

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">Tasks for Intern #{internId}</h2>
      {projectName ? (
        <div className="text-md font-semibold mb-4 text-blue-700">
          <h2>
            Assigned Project: <b>{projectName}</b>
          </h2>
        </div>
      ) : (
        <div className="text-md font-semibold mb-4 text-red-600">
          No project assigned to this intern.
        </div>
      )}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Current Project Tasks</h3>
        {isLoading ? (
          <p>Loading tasks...</p>
        ) : currentTasks.length === 0 ? (
          <p>No tasks assigned.</p>
        ) : (
          currentTasks.map((task) => (
            <TaskItem key={task.id} task={task} onStatusChange={refetch} />
          ))
        )}
        {numericProjectId && internId > 0 && !isNaN(internId) && (
          <AddTask internId={internId} projectId={numericProjectId} />
        )}
      </div>
      {Object.keys(previousTasksByProject).length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Previous Project Tasks</h3>
          {Object.entries(previousTasksByProject).map(([pid, ptasks]) => {
            const prevProject = projects.find((p: any) => p.id === Number(pid));
            return (
              <div key={pid} className="mb-4">
                <div className="font-semibold text-gray-700 mb-1">
                  Project: <b>{prevProject ? prevProject.name : `ID ${pid}`}</b>
                </div>
                {ptasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={refetch}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
