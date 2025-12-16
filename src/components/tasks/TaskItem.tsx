import { useNavigate } from "react-router-dom";
import React from "react";
import { Calendar } from "lucide-react";
import { cn } from "../../lib/utils";

import { TaskItem as Task, TaskStatus } from "../../models/task";
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
          <p className="text-foreground font-medium truncate">{task.title}</p>
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

      <select
        value={task.status}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          e.stopPropagation();
          const newStatus = e.target.value as TaskStatus;
          dispatch(updateTask({ id: task.id, status: newStatus } as any)).catch((err) => console.error(err));
        }}
        className="capitalize text-sm bg-transparent text-muted-foreground border border-border rounded px-2 py-0.5"
      >
        <option value={TaskStatus.Todo}>{TaskStatus.Todo}</option>
        <option value={TaskStatus.InProgress}>{TaskStatus.InProgress}</option>
        <option value={TaskStatus.OnHold}>{TaskStatus.OnHold}</option>
        <option value={TaskStatus.Done}>{TaskStatus.Done}</option>
      </select>
    </div>
  );
};
