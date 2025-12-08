import { ArrowLeftIcon, XIcon, PinIcon, PinOffIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { TaskItem, TaskPayload } from "../../models/task";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchLists } from "../../store/slices/listsSlice";

type TaskFormProps = {
  task?: TaskItem | null;
  onClose: () => void;
  onSave: (task: TaskPayload) => Promise<void> | void;
  isMobile: boolean;
  mode: "create" | "edit";
  isPinned?: boolean;
  onPinToggle?: () => void;
};

export const TaskForm: React.FC<TaskFormProps> = ({ task, onClose, onSave, isMobile, mode, isPinned, onPinToggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { lists, status } = useSelector((state: RootState) => state.lists);

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [listId, setListId] = useState(task?.list?.id || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLists());
    }
  }, [status, dispatch]);

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setListId(task?.list?.id || "");
    setDueDate(task?.dueDate || "");
    setSubtasks(task?.subtasks || []);
    // When switching to create mode, task is null, so state is reset to defaults.
    // When a new task is selected for editing, state is updated.
  }, [task]);

  useEffect(() => {
    // if (!task?.list?.id && lists.length > 0) {
    //   setListId(lists[0].id);
    // }
  }, [lists, task?.list]);

  // const handleAddSubtask = () => {
  //   if (newSubtask.trim()) {
  //     setSubtasks([
  //       ...subtasks,
  //       { id: Date.now().toString(), title: newSubtask, completed: false },
  //     ]);
  //     setNewSubtask("");
  //   }
  // };

  // const handleDeleteSubtask = (subtaskId: string) => {
  //   setSubtasks(subtasks.filter((s) => s.id !== subtaskId));
  // };

  // const handleToggleSubtask = (subtaskId: string) => {
  //   setSubtasks(
  //     subtasks.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s))
  //   );
  // };

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError("Title is a required field.");
      return;
    }

    const taskData: TaskPayload = {
      title,
      description,
      list: listId, // The backend expects the ID in the 'list' key
      dueDate,
      subtasks,
    };

    if (mode === "edit" && task) {
      taskData.id = task.id;
    }

    onSave(taskData);
  };

  return (
    <div className={`flex flex-col ${isMobile ? 'h-full' : 'h-full rounded-xl bg-accent overflow-hidden'} ${isPinned ? '' : 'shadow-lg' }`}>
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
          )}
          <h2 className="text-xl font-bold text-foreground">
            {mode === "create" ? "New Task" : "Edit Task"}
          </h2>
        </div>
        {!isMobile && (
          <div className="flex items-center gap-2">
            {onPinToggle && (
              <Button variant="ghost" size="icon" onClick={onPinToggle}>
                {isPinned ? <PinOffIcon className="w-5 h-5" /> : <PinIcon className="w-5 h-5" />}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XIcon className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
        <div className="space-y-1">
          <h4 className="text-base sm:text-lg font-bold text-muted-foreground">Title</h4>
          <Input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) {
                setTitleError(null);
              }
            }}
            placeholder="Enter task title"
            className="w-full"
            error={!!titleError}
          />
          {titleError && <p className="text-sm text-red-500">{titleError}</p>}
        </div>

        <div className="space-y-1">
          <h4 className="text-base sm:text-lg font-bold text-muted-foreground">Description</h4>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows={4}
          />
        </div>

        <div className="space-y-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-muted-foreground mb-1">List</h4>
              <Select
                value={listId}
                onChange={(e) => setListId(e.target.value)}
              >
                <option value="">
                  None
                </option>
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-muted-foreground mb-1">Due date</h4>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* <div className="pt-6 space-y-3">
          <h4 className="text-lg font-bold text-foreground">Subtasks:</h4>
          <div className="space-y-2">
            {subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => handleToggleSubtask(subtask.id)}
                  className="w-4 h-4 text-foreground cursor-pointer"
                />
                <span
                  className={`flex-1 text-foreground ${
                    subtask.completed ? "line-through text-foreground" : ""
                  }`}
                >
                  {subtask.title}
                </span>
                <button
                  onClick={() => handleDeleteSubtask(subtask.id)}
                  className="text-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleAddSubtask();
              }}
              placeholder="Add New Subtask"
              className="flex-1 h-auto"
            />
            <Button
              onClick={handleAddSubtask}
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-foreground"
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </div>
        </div> */}
      </div>

      <div className="w-full p-6 flex gap-3 max-w-lg mx-auto">
        <Button
          onClick={onClose}
          variant="outline"
          size="lg"
          className="flex-1 border-border text-foreground hover:bg-background"
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
