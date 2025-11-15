import { MenuIcon, PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TaskDetail } from "../../components/tasks/TaskDetail";
import { TaskForm } from "../../components/tasks/TaskForm";
import { TaskList } from "../../components/tasks/TaskList";
import { Sidebar } from "../../components/tasks/Sidebar";
import { Button } from "../../components/ui/button";
import { dummyTasks, dummyLists, dummyTags, TaskItem } from "../../data/dummyTasks";

export const TaskDashboard = (): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>(dummyTasks);
  const [filteredTasks, setFilteredTasks] = useState<TaskItem[]>(dummyTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedListId, setSelectedListId] = useState<string | null>("today");
  const [isMobile, setIsMobile] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "detail" | "form">("list");
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, selectedListId]);

  const filterTasks = () => {
    let filtered = [...tasks];

    if (selectedListId && selectedListId !== "today") {
      filtered = filtered.filter((task) => task.listId === selectedListId);
    }

    setFilteredTasks(filtered);
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    setViewMode("detail");
    if (isMobile) {
      setShowDetail(true);
    }
  };

  const handleAddNewTask = () => {
    setFormMode("create");
    setEditingTask(null);
    setSelectedTaskId(null);
    setViewMode("form");
    if (isMobile) {
      setShowDetail(true);
    }
  };

  const handleEditTask = (task: TaskItem) => {
    setFormMode("edit");
    setEditingTask(task);
    setViewMode("form");
  };

  const handleCloseDetail = () => {
    if (formMode === "edit" && editingTask) {
      setViewMode("detail");
      setSelectedTaskId(editingTask.id);
      setEditingTask(null);
    } else {
      setViewMode("list");
      setSelectedTaskId(null);
      setEditingTask(null);
      if (isMobile) {
        setShowDetail(false);
      }
    }
  };

  const handleSaveTask = (taskData: Partial<TaskItem>) => {
    if (formMode === "create") {
      const newTask: TaskItem = {
        id: Date.now().toString(),
        title: taskData.title!,
        description: taskData.description!,
        listId: taskData.listId!,
        listName: taskData.listName!,
        listColor: taskData.listColor!,
        dueDate: taskData.dueDate || "",
        subtasks: taskData.subtasks || [],
        tags: taskData.tags || [],
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setSelectedTaskId(newTask.id);
      setViewMode("detail");
    } else if (formMode === "edit" && editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...taskData } : task
        )
      );
      setSelectedTaskId(editingTask.id);
      setViewMode("detail");
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    setSelectedTaskId(null);
    setViewMode("list");
    if (isMobile) {
      setShowDetail(false);
    }
  };

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  const shouldShowTaskList = !isMobile || !showDetail;
  const shouldShowRightPanel = !isMobile || showDetail;

  const renderRightPanel = () => {
    if (viewMode === "form") {
      return (
        <TaskForm
          key={formMode === "create" ? "create" : editingTask?.id}
          task={editingTask}
          onClose={handleCloseDetail}
          onSave={handleSaveTask}
          isMobile={isMobile}
          mode={formMode}
        />
      );
    }

    if (viewMode === "detail") {
      return (
        <TaskDetail
          task={selectedTask}
          onClose={handleCloseDetail}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          isMobile={isMobile}
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500 font-medium">Select a task to view details</p>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedListId={selectedListId}
        onListSelect={(listId) => {
          setSelectedListId(listId);
          setSidebarOpen(false);
        }}
        lists={dummyLists}
        tags={dummyTags}
      />

      {shouldShowTaskList && (
        <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200">
          <div className="flex items-center gap-4 p-6 border-b border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Today</h1>
            <span className="text-2xl font-bold text-gray-400">{filteredTasks.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            <button
              onClick={handleAddNewTask}
              className="w-full flex items-center gap-2 p-6 text-gray-600 hover:text-gray-900 transition-colors border-b border-gray-200"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="font-medium">Add New Task</span>
            </button>
            <TaskList
              tasks={filteredTasks}
              selectedTaskId={selectedTaskId}
              onTaskSelect={handleTaskSelect}
            />
          </div>
        </div>
      )}

      {shouldShowRightPanel && (
        <div className={`${isMobile ? "fixed inset-0 z-50" : "flex-1 min-w-0"} bg-white`}>
          {renderRightPanel()}
        </div>
      )}
    </div>
  );
};
