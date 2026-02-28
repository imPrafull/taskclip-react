import { useNavigate } from "react-router-dom";
import React from "react";
import { Calendar } from "lucide-react";
import { cn } from "../../lib/utils";

import { TaskItem as Task, TaskStatus, statusOptionClassMap, statusBorderClassMap } from "../../models/task";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { updateTask } from "../../store/slices/tasksSlice";

type TaskItemProps = {
  task: Task;
  selectedTaskId?: string;
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, selectedTaskId }) => {
   const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleTaskSelect = () => {
    navigate(`/tasks/${task.id}`);
  };

  const getDueDateInfo = () => {
    if (!task.dueDate) return { isUrgent: false, dateString: null };

    const today = new Date();
    const dueDate = new Date(task.dueDate);

    // Normalize dates to midnight to compare only the date part
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // A task is urgent if its due date is today, tomorrow, or in the past.
    const isUrgent = dueDate <= tomorrow;

    return {
      isUrgent,
      dateString: new Date(task.dueDate).toLocaleDateString(),
    };
  };

  const { isUrgent, dateString } = getDueDateInfo();

  // Use the list's color for the border, or a default gray if no list is assigned.
  const borderColor = task.list?.color || 'hsl(220 8% 91%)';

  return (
    <div
      onClick={handleTaskSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTaskSelect();
        }
      }}
      style={{ borderLeftColor: borderColor }}
      className={`
        w-full text-left p-4 transition-colors flex items-center justify-between border-l-4
        ${selectedTaskId === task.id ? 'bg-accent' : 'hover:bg-muted'}
      `}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-medium truncate mr-3">{task.title}</p>
        </div>
      </div>
      
      {task.dueDate && (
        <div
          className={cn("text-sm mx-4 flex-shrink-0 flex items-center gap-1.5",
            isUrgent ? "text-destructive" : "text-muted-foreground"
          )}
        >
          <Calendar className="w-4 h-4" />
          {dateString}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <select
            value={task.status}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              const newStatus = e.target.value as TaskStatus;
              dispatch(updateTask({ id: task.id, status: newStatus } as any)).catch((err) => console.error(err));
            }}
            className={cn("appearance-none capitalize text-sm font-semibold bg-background border rounded-lg pl-2 pr-5 py-1 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]", statusOptionClassMap[task.status], statusBorderClassMap[task.status])}
          >
            <option className={cn(statusOptionClassMap[TaskStatus.Todo], "font-semibold")} value={TaskStatus.Todo}>{TaskStatus.Todo}</option>
            <option className={cn(statusOptionClassMap[TaskStatus.InProgress], "font-semibold")} value={TaskStatus.InProgress}>{TaskStatus.InProgress}</option>
            <option className={cn(statusOptionClassMap[TaskStatus.OnHold], "font-semibold")} value={TaskStatus.OnHold}>{TaskStatus.OnHold}</option>
            <option className={cn(statusOptionClassMap[TaskStatus.Done], "font-semibold")} value={TaskStatus.Done}>{TaskStatus.Done}</option>
          </select>
          <svg className={cn("pointer-events-none absolute right-1.5 w-3.5 h-3.5", statusOptionClassMap[task.status])} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};
