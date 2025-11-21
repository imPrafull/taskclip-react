import { ArrowLeftIcon, XIcon } from "lucide-react";
import React from "react";
import { TaskItem } from "../../models/task";
import { Button } from "../ui/Button";

type TaskDetailProps = {
  task: TaskItem | null;
  onClose: () => void;
  onEdit: (task: TaskItem) => void;
  onDelete: (taskId: string) => void;
  isMobile: boolean;
};

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose, onEdit, onDelete, isMobile }) => {

  if (!task) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <p className="text-foreground font-medium">Select a task to view details</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
          )}
          <h2 className="text-xl font-bold text-foreground">Task:</h2>
        </div>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-3">{task.title}</h3>
        </div>

        <div>
          <h4 className="text-lg font-medium text-foreground">Description</h4>
          <p className="text-foreground mt-1">{task.description || "No description provided"}</p>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-lg font-medium text-foreground">List</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-sm ${task.listColor}`} />
                <span className="text-foreground font-medium">{task.listName}</span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-foreground">Due date</h4>
              <p className="text-foreground font-medium mt-1">
                {task.dueDate || "No due date"}
              </p>
            </div>
          </div>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-foreground">Tags</h4>
            <div className="flex gap-2 flex-wrap">
              {task.tags && task.tags.map((tag) => (
                <span
                  key={tag.id}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${tag.color}`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="border-t border-border-100 pt-6 space-y-3">
            <h4 className="text-lg font-medium text-foreground">Subtasks</h4>
            <div className="space-y-2">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    readOnly
                    className="w-4 h-4 text-foreground cursor-default"
                  />
                  <span
                    className={`flex-1 text-foreground ${
                      subtask.completed ? "line-through text-foreground" : ""
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-full p-6 flex gap-3 max-w-lg mx-auto">
        <Button
          onClick={() => onDelete(task.id)}
          variant="outline"
          size="lg"
          className="flex-1 border-border text-foreground hover:bg-background"
        >
          Delete
        </Button>
        <Button
          onClick={() => onEdit(task)}
          size="lg"
          className="flex-1 flex items-center justify-center gap-2"
        >
          Edit
        </Button>
      </div>
    </div>
  );
};
