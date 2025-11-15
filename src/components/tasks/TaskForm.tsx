import { ArrowLeftIcon, XIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { TaskItem } from "../../models/task";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type TaskFormProps = {
  task?: TaskItem | null;
  onClose: () => void;
  onSave: (task: Partial<TaskItem>) => void;
  isMobile: boolean;
  mode: "create" | "edit";
};

export const TaskForm: React.FC<TaskFormProps> = ({ task, onClose, onSave, isMobile, mode }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [listId, setListId] = useState(task?.listId || "personal");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([
        ...subtasks,
        { id: Date.now().toString(), title: newSubtask, completed: false },
      ]);
      setNewSubtask("");
    }
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== subtaskId));
  };

  const handleToggleSubtask = (subtaskId: string) => {
    setSubtasks(
      subtasks.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    const taskData: Partial<TaskItem> = {
      title,
      description,
      listId,
      dueDate,
      subtasks,
      listName: listId === "personal" ? "Personal" : listId === "work" ? "Work" : "List 1",
      listColor: listId === "personal" ? "bg-red-400" : listId === "work" ? "bg-cyan-400" : "bg-yellow-400",
    };

    if (mode === "edit" && task) {
      taskData.id = task.id;
    }

    onSave(taskData);
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
          <h2 className="text-xl font-bold text-gray-900">
            {mode === "create" ? "New Task" : "Edit Task"}
          </h2>
        </div>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-500 uppercase">Title</h4>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-full text-lg font-medium"
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-500 uppercase">Description</h4>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#58419f] resize-none"
          />
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">List</h4>
              <select
                value={listId}
                onChange={(e) => setListId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#58419f]"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="list1">List 1</option>
              </select>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Due date</h4>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#58419f]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-3">
          <h4 className="text-lg font-bold text-gray-900">Subtasks:</h4>
          <div className="space-y-2">
            {subtasks.map((subtask) => (
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
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#58419f]"
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

      <div className="w-full p-6 flex gap-3 max-w-lg mx-auto">
        <Button
          onClick={onClose}
          variant="outline"
          size="lg"
          className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          size="lg"
          className="flex-1"
        >
          {mode === "create" ? "Create Task" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
