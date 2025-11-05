import { MenuIcon, PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TaskDetail } from "../../components/tasks/TaskDetail";
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
    if (isMobile) {
      setShowDetail(true);
    }
  };

  const handleCloseDetail = () => {
    if (isMobile) {
      setShowDetail(false);
    }
  };

  const handleUpdateTask = (taskId: string, updates: Partial<TaskItem>) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    setSelectedTaskId(null);
    if (isMobile) {
      setShowDetail(false);
    }
  };

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  const shouldShowTaskList = !isMobile || !showDetail;
  const shouldShowTaskDetail = !isMobile || showDetail;

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
            <button className="w-full flex items-center gap-2 p-6 text-gray-600 hover:text-gray-900 transition-colors border-b border-gray-200">
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

      {shouldShowTaskDetail && (
        <div className={`${isMobile ? "fixed inset-0 z-50" : "flex-1 min-w-0"} bg-white`}>
          <TaskDetail
            task={selectedTask}
            onClose={handleCloseDetail}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
            isMobile={isMobile}
          />
        </div>
      )}
    </div>
  );
};
