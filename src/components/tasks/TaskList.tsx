import React from "react";
import { TaskItem } from "./TaskItem";
import { TaskItem as Task } from "../../models/task";

type TaskListProps = {
  tasks: Task[];
  selectedTaskId?: string;
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, selectedTaskId }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-foreground font-medium">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="divide-y-2 divide-gray-100">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          selectedTaskId={selectedTaskId}
        />
      ))}
    </div>
  );
};
