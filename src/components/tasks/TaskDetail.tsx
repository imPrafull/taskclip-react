import { ArrowLeftIcon, CalendarIcon, FlagIcon, TrashIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { Task } from "../../lib/supabase";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type TaskDetailProps = {
  task: Task | null;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  isMobile: boolean;
};

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose, onUpdate, onDelete, isMobile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  React.useEffect(() => {
    if (task) {
      setEditedTask({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date,
      });
    }
  }, [task]);

  if (!task) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="[font-family:'Darker_Grotesque',Helvetica] font-normal text-[#7c7c7c] text-[22px]">
          Select a task to view details
        </p>
      </div>
    );
  }

  const handleSave = () => {
    if (editedTask.title && editedTask.title.trim()) {
      onUpdate(task.id, editedTask);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
    });
    setIsEditing(false);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "No due date";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-6 border-b border-[#ebebeb]">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
          )}
          <h2 className="[font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-2xl">
            Task Details
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XIcon className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="block mb-2 [font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-[20px]">
                Title
              </label>
              <Input
                type="text"
                value={editedTask.title || ""}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="h-[50px] [font-family:'Darker_Grotesque',Helvetica] text-[22px]"
              />
            </div>

            <div>
              <label className="block mb-2 [font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-[20px]">
                Description
              </label>
              <textarea
                value={editedTask.description || ""}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                rows={5}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [font-family:'Darker_Grotesque',Helvetica]"
              />
            </div>

            <div>
              <label className="block mb-2 [font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-[20px]">
                Status
              </label>
              <select
                value={editedTask.status || "todo"}
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task["status"] })}
                className="w-full h-[50px] rounded-md border border-input bg-transparent px-3 text-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [font-family:'Darker_Grotesque',Helvetica]"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 [font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-[20px]">
                Priority
              </label>
              <select
                value={editedTask.priority || "medium"}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task["priority"] })}
                className="w-full h-[50px] rounded-md border border-input bg-transparent px-3 text-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [font-family:'Darker_Grotesque',Helvetica]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 [font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-[20px]">
                Due Date
              </label>
              <Input
                type="date"
                value={editedTask.due_date ? new Date(editedTask.due_date).toISOString().split('T')[0] : ""}
                onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
                className="h-[50px] [font-family:'Darker_Grotesque',Helvetica] text-[22px]"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                className="flex-1 h-[50px] bg-[#58419f] hover:bg-[#58419f]/90 [font-family:'Darker_Grotesque',Helvetica] font-bold text-[22px]"
              >
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 h-[50px] [font-family:'Darker_Grotesque',Helvetica] font-bold text-[22px]"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="[font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-[28px] mb-2">
                {task.title}
              </h3>
              {task.description && (
                <p className="[font-family:'Darker_Grotesque',Helvetica] font-normal text-[#7c7c7c] text-[20px] whitespace-pre-wrap">
                  {task.description}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="[font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-[20px] w-24">
                  Status:
                </span>
                <span
                  className={`
                    px-3 py-1 rounded-md text-sm font-medium
                    [font-family:'Darker_Grotesque',Helvetica]
                    ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "in_progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  {task.status.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="[font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-[20px] w-24">
                  Priority:
                </span>
                <span className="flex items-center gap-2">
                  <FlagIcon
                    className={`w-5 h-5 ${
                      task.priority === "high"
                        ? "text-red-500"
                        : task.priority === "medium"
                        ? "text-orange-500"
                        : "text-green-500"
                    }`}
                  />
                  <span className="[font-family:'Darker_Grotesque',Helvetica] font-normal text-[#212529] text-[20px] capitalize">
                    {task.priority}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="[font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-[20px] w-24">
                  Due Date:
                </span>
                <span className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#7c7c7c]" />
                  <span className="[font-family:'Darker_Grotesque',Helvetica] font-normal text-[#212529] text-[20px]">
                    {formatDate(task.due_date)}
                  </span>
                </span>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full h-[50px] bg-[#58419f] hover:bg-[#58419f]/90 [font-family:'Darker_Grotesque',Helvetica] font-bold text-[22px]"
              >
                Edit Task
              </Button>
              <Button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this task?")) {
                    onDelete(task.id);
                  }
                }}
                variant="outline"
                className="w-full h-[50px] border-red-500 text-red-500 hover:bg-red-50 [font-family:'Darker_Grotesque',Helvetica] font-bold text-[22px]"
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Delete Task
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
