import { MenuIcon, PlusIcon, SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TaskDetail } from "../../components/tasks/TaskDetail";
import { TaskList } from "../../components/tasks/TaskList";
import { Sidebar } from "../../components/tasks/Sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { supabase, Task } from "../../lib/supabase";

export const TaskDashboard = (): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
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
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, activeFilter, searchQuery]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data || []);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    if (activeFilter !== "all") {
      filtered = filtered.filter((task) => task.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
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
    setSelectedTaskId(null);
  };

  const handleNewTask = async () => {
    const newTask = {
      user_id: "00000000-0000-0000-0000-000000000000",
      title: "New Task",
      description: "",
      status: "todo" as const,
      priority: "medium" as const,
      due_date: null,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert([newTask])
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
    } else {
      setTasks([data, ...tasks]);
      setSelectedTaskId(data.id);
      if (isMobile) {
        setShowDetail(true);
      }
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from("tasks")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task:", error);
    } else {
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task)));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      setTasks(tasks.filter((task) => task.id !== taskId));
      setSelectedTaskId(null);
      if (isMobile) {
        setShowDetail(false);
      }
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
        activeFilter={activeFilter}
        onFilterChange={(filter) => {
          setActiveFilter(filter);
          setSidebarOpen(false);
        }}
        onNewTask={handleNewTask}
      />

      {shouldShowTaskList && (
        <div className="flex-1 flex flex-col min-w-0 border-r border-[#ebebeb]">
          <div className="flex items-center gap-3 p-4 border-b border-[#ebebeb]">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="w-6 h-6" />
            </Button>

            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7c7c7c]" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-[45px] [font-family:'Darker_Grotesque',Helvetica] text-[20px]"
              />
            </div>

            <Button
              onClick={handleNewTask}
              size="icon"
              className="lg:hidden w-[45px] h-[45px] bg-[#58419f] hover:bg-[#58419f]/90"
            >
              <PlusIcon className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TaskList
              tasks={filteredTasks}
              selectedTaskId={selectedTaskId}
              onTaskSelect={handleTaskSelect}
            />
          </div>
        </div>
      )}

      {shouldShowTaskDetail && (
        <div className={`${isMobile ? "fixed inset-0 z-50" : "flex-1"} bg-white`}>
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
