import { ChevronRightIcon } from "lucide-react";
import React from "react";
import { TaskItem } from "../../models/task";

type TaskListProps = {
  tasks: TaskItem[];
  selectedTaskId: string | null;
  onTaskSelect: (taskId: string) => void;
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, selectedTaskId, onTaskSelect }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 font-medium">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => onTaskSelect(task.id)}
          className={`
            w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between
            ${selectedTaskId === task.id ? "bg-muted" : ""}
          `}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => e.stopPropagation()}
              className="w-5 h-5 text-gray-300 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-medium truncate">{task.title}</p>
              {task.subtasks && task.subtasks.length > 0 && (
                <p className="text-sm text-gray-500">
                  {task.subtasks.filter((s) => s.completed).length} Subtasks
                </p>
              )}
            </div>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </button>
      ))}
    </div>
  );
};
