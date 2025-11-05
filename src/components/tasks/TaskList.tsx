import { CalendarIcon, FlagIcon } from "lucide-react";
import React from "react";
import { Task } from "../../lib/supabase";

type TaskListProps = {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskSelect: (taskId: string) => void;
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, selectedTaskId, onTaskSelect }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-orange-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "todo":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="[font-family:'Darker_Grotesque',Helvetica] font-normal text-[#7c7c7c] text-[22px]">
          No tasks found
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#ebebeb]">
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => onTaskSelect(task.id)}
          className={`
            w-full text-left p-4 hover:bg-gray-50 transition-colors
            ${selectedTaskId === task.id ? "bg-[#58419f]/5 border-l-4 border-[#58419f]" : ""}
          `}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="[font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-[22px] truncate mb-1">
                {task.title}
              </h3>
              {task.description && (
                <p className="[font-family:'Darker_Grotesque',Helvetica] font-normal text-[#7c7c7c] text-[18px] line-clamp-2 mb-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`
                    px-2 py-1 rounded-md text-xs font-medium
                    [font-family:'Darker_Grotesque',Helvetica]
                    ${getStatusBadge(task.status)}
                  `}
                >
                  {task.status.replace("_", " ")}
                </span>
                {task.due_date && (
                  <span className="flex items-center gap-1 text-[#7c7c7c] text-sm [font-family:'Darker_Grotesque',Helvetica]">
                    <CalendarIcon className="w-4 h-4" />
                    {formatDate(task.due_date)}
                  </span>
                )}
                <span className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                  <FlagIcon className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
