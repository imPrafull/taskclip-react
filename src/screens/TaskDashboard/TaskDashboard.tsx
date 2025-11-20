import { MenuIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { TaskDetail } from "../../components/tasks/TaskDetail";
import { TaskForm } from "../../components/tasks/TaskForm";
import { TaskList } from "../../components/tasks/TaskList";
import { Sidebar } from "../../components/tasks/Sidebar";
import { Button } from "../../components/ui/Button";
import { TaskItem, TaskListInfo } from "../../models/task";
import { RootState, AppDispatch } from '../../store/store';
import { fetchTasks, addNewTask, updateTask, deleteTask } from '../../store/slices/tasksSlice';
import { fetchLists, addNewList, selectList } from '../../store/slices/listsSlice';
import { fetchTags } from "../../store/slices/tagsSlice";

export const TaskDashboard = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { tasks, status: taskStatus, error: taskError } = useSelector((state: RootState) => state.tasks);
  const { lists, selectedListId, status: listStatus, error: listError } = useSelector((state: RootState) => state.lists);
  const { tags, status: tagsStatus, error: tagsError } = useSelector((state: RootState) => state.tags);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<TaskItem[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "detail" | "form">("list");
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    if (taskStatus === 'idle') {
      dispatch(fetchTasks());
    }
    if (listStatus === 'idle') {
      dispatch(fetchLists());
    }
    if (tagsStatus === 'idle') {
      dispatch(fetchTags());
    }
  }, [taskStatus, listStatus, tagsStatus, dispatch]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const filterTasks = () => {
      let filtered = [...tasks];

      if (selectedListId && selectedListId !== "today") {
        filtered = filtered.filter((task) => task.listId === selectedListId);
      }

      setFilteredTasks(filtered);
    };

    filterTasks()
  }, [tasks, selectedListId]);

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

  const handleSaveTask = async (taskData: Partial<TaskItem>) => {
    if (formMode === "create") {
        const newTaskPayload = {
          ...taskData,
          listId: selectedListId === 'today' ? null : selectedListId,
        };
        dispatch(addNewTask(newTaskPayload as Omit<TaskItem, 'id'>));
        setViewMode("list");
    } else if (formMode === "edit" && editingTask) {
      dispatch(updateTask({ ...editingTask, ...taskData }));
      setSelectedTaskId(editingTask.id);
      setViewMode("detail");
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
    setSelectedTaskId(null);
    setViewMode("list");
    if (isMobile) {
      setShowDetail(false);
    }
  };

  const handleListCreated = (newListInfo: Omit<TaskListInfo, 'id'>) => {
    dispatch(addNewList(newListInfo));
    setSidebarOpen(false);
  };

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  const shouldShowRightPanel = (viewMode !== "list" && !isMobile) || (isMobile && showDetail);
  const shouldShowTaskList = !isMobile || !showDetail;

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
          dispatch(selectList(listId));
          setSidebarOpen(false);
        }}
        lists={lists}
        onListCreated={handleListCreated}
        tags={tags}
      />

      {shouldShowTaskList && (
        <div className={`flex-1 flex flex-col min-w-0`}>
          <div className="flex items-center gap-4 p-6">
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
.          </div>

          {(taskStatus === 'loading' || listStatus === 'loading' || tagsStatus === 'loading') && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}
          {(taskError || listError || tagsError) && (
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="text-red-500">Error: {taskError || listError || tagsError}</p>
            </div>
          )}

          {(taskStatus === 'succeeded' && listStatus === 'succeeded' && tagsStatus === 'succeeded') && (
            <div className="flex-1 overflow-y-auto">
              <button
                onClick={handleAddNewTask}
                className="w-full flex items-center gap-2 p-6 text-gray-600 hover:text-gray-900 transition-colors"
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
          )}
        </div>
      )}

      {shouldShowRightPanel && (
        <div className={`${isMobile ? "fixed inset-0 z-50 bg-white" : "flex-1 min-w-0 pt-16"}`}>
          <div className={`${isMobile ? 'h-full' : 'h-auto rounded-xl bg-muted overflow-hidden'}`}>
            {renderRightPanel()}
          </div>
        </div>
      )}
    </div>
  );
};
