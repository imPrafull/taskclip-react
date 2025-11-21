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
          <h3 className="text-xl font-bold text-foreground">Task</h3>
        </div>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
        <div>
          <h2 className="text-4xl font-medium">{task.title}</h2>
        </div>

        <div>
          <h4 className="text-lg font-bold text-muted-foreground">Description</h4>
          <p className="text-lg text-foreground mt-1">{task.description || "No description provided"}</p>
        </div>

        {/* <div className="flex items-center gap-4 mt-1">
          <h4 className="text-base font-medium text-muted-foreground">List</h4>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm ${task.listColor}`} />
            <span className="text-lg text-foreground">List name</span>
          </div>
        </div> */}

        <div className="flex w-full flex-col items-start">
          <span className="text-lg font-bold text-muted-foreground mb-1">
            Details
          </span>
          <div className="flex w-full flex-col items-start">
            <div className="flex w-full items-center gap-2">
              <div className="flex w-20 flex-none items-center gap-2">
                <span className="text-lg text-muted-foreground">
                  List
                </span>
              </div>
              <div className="flex grow shrink-0 basis-0 items-center gap-2">
                <span className="text-lg text-foreground">
                  List name
                </span>
              </div>
            </div>
            <div className="flex w-full items-center gap-2">
              <div className="flex w-20 flex-none items-center gap-2">
                <span className="text-lg text-muted-foreground">
                  Due date
                </span>
              </div>
              <div className="flex grow shrink-0 basis-0 items-center gap-2">
                <span className="text-lg text-foreground">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "No due date"}
                </span>
              </div>
            </div>
            <div className="flex w-full items-center gap-2">
              <div className="flex w-20 flex-none items-center gap-2">
                <span className="text-lg text-muted-foreground">
                  Status
                </span>
              </div>
              <div className="flex grow shrink-0 basis-0 items-center gap-2">
                <span className="text-lg text-foreground">
                  { task.completed ? "Done" : "Todo" }
                </span>
              </div>
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
