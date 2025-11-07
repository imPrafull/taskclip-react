import { ArrowLeftIcon, CalendarIcon, TrashIcon, XIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { TaskItem, Subtask } from "../../data/dummyTasks";
import { Button } from "../ui/button";

type TaskDetailProps = {
  task: TaskItem | null;
  onClose: () => void;
  onUpdate: (taskId: string, updates: Partial<TaskItem>) => void;
  onDelete: (taskId: string) => void;
  isMobile: boolean;
};

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onClose, onUpdate, onDelete, isMobile }) => {
  const [newSubtask, setNewSubtask] = useState("");

  if (!task) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500 font-medium">Select a task to view details</p>
      </div>
    );
  }

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const updatedSubtasks = [
        ...task.subtasks,
        { id: Date.now().toString(), title: newSubtask, completed: false },
      ];
      onUpdate(task.id, { subtasks: updatedSubtasks });
      setNewSubtask("");
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    onUpdate(task.id, { subtasks: updatedSubtasks });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter((s) => s.id !== subtaskId);
    onUpdate(task.id, { subtasks: updatedSubtasks });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
          )}
          <h2 className="text-xl font-bold text-gray-900">Task:</h2>
        </div>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{task.title}</h3>
          {task.description && (
            <p className="text-gray-700 font-medium">{task.description}</p>
          )}
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-500 uppercase">Description</h4>
          <p className="text-gray-600">{task.description}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-600">List</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-sm ${task.listColor}`} />
                <select
                  value={task.listId}
                  onChange={(e) => onUpdate(task.id, { listId: e.target.value })}
                  className="bg-transparent text-gray-900 font-medium text-sm focus:outline-none"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="list1">List 1</option>
                </select>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600">Due date</h4>
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => onUpdate(task.id, { dueDate: e.target.value })}
                className="bg-transparent text-gray-900 font-medium text-sm focus:outline-none border-b border-gray-200"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-600">Tags</h4>
          <div className="flex gap-2 flex-wrap">
            {task.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium"
              >
                {tag.name}
              </span>
            ))}
            <button className="text-cyan-600 font-medium text-sm hover:text-cyan-700">
              + Add Tag
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-3">
          <h4 className="text-lg font-bold text-gray-900">Subtasks:</h4>
          <div className="space-y-2">
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => handleToggleSubtask(subtask.id)}
                  className="w-4 h-4 text-gray-400 cursor-pointer"
                />
                <span
                  className={`flex-1 text-gray-700 ${
                    subtask.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {subtask.title}
                </span>
                <button
                  onClick={() => handleDeleteSubtask(subtask.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleAddSubtask();
              }}
              placeholder="Add New Subtask"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button
              onClick={handleAddSubtask}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-600"
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 p-6 flex gap-3">
        <Button
          onClick={() => onDelete(task.id)}
          variant="outline"
          className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Delete Task
        </Button>
        <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold">
          Save changes
        </Button>
      </div>
    </div>
  );
};
