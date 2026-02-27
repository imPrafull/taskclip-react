import { useEffect, useState } from "react";
import Header from '../../components/Header';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet, useLocation, useParams } from "react-router-dom";
import { TaskList } from "../../components/tasks/TaskList";
import { Sidebar } from "../../components/Sidebar";
import { TaskListInfo } from "../../models/task";
import { RootState, AppDispatch } from '../../store/store';
import { getTasks, resetTasks } from '../../store/slices/tasksSlice';
import { fetchLists, addNewList } from '../../store/slices/listsSlice';
import { fetchTags } from "../../store/slices/tagsSlice";
// import { Input } from "../../components/ui/Input";
import { selectList, selectTaskNavItem } from '../../store/slices/filtersSlice';
import { Loader2 } from "lucide-react";

export const TaskDashboard = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: selectedTaskId } = useParams<{ id:string }>();
  const { tasks, status: taskStatus, error: taskError } = useSelector((state: RootState) => state.tasks);
  const { lists, status: listStatus, error: listError } = useSelector((state: RootState) => state.lists);
  const { selectedListId, selectedTaskNavItemId, sortBy, selectedStatus } = useSelector((state: RootState) => state.taskfilters);
  const { status: tagsStatus, error: tagsError } = useSelector((state: RootState) => state.tags);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  const [isDetailPinned, setIsDetailPinned] = useState(true);

  useEffect(() => {
    if (listStatus === 'idle') {
      dispatch(fetchLists());
    }
    if (tagsStatus === 'idle') {
      dispatch(fetchTags());
    }
  }, [listStatus, tagsStatus, dispatch]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch tasks when selected list, selected task nav item, or sort changes
  useEffect(() => {
    dispatch(resetTasks());
    const dueParam = selectedTaskNavItemId && selectedTaskNavItemId !== 'all' ? selectedTaskNavItemId : undefined;
    const statusParam = selectedStatus && selectedStatus !== 'all' ? selectedStatus : undefined;
    dispatch(getTasks({ page: 1, sort: sortBy, listId: selectedListId, due: dueParam, status: statusParam }));
  }, [selectedListId, selectedTaskNavItemId, sortBy, selectedStatus, dispatch]);

  const handleAddNewTask = () => {
    navigate('/tasks/new');
  };

  const handleTaskCreated = (newTaskId: string) => {
    navigate(`/tasks/${newTaskId}`);
  };

  const handleListCreated = (newListInfo: Omit<TaskListInfo, 'id'>) => {
    dispatch(addNewList(newListInfo));
    setSidebarOpen(false);
  };

  const showDetail = location.pathname !== '/tasks';

  useEffect(() => {
    if (isMobile) setIsDetailPinned(false);
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedListId={selectedListId}
        selectedTaskNavItemId={selectedTaskNavItemId}
        onListSelect={(listId) => {
          dispatch(selectList(listId!));
          setSidebarOpen(false);
        }}
        onTaskNavItemSelect={(itemId) => {
          dispatch(selectTaskNavItem(itemId!));
        }}
        lists={lists}
        onListCreated={handleListCreated}
        isLoading={taskStatus === 'loading' && tasks.length === 0}
      />

      <div
        className={`flex flex-col min-w-0 ${
          showDetail && isDetailPinned && !isMobile ? 'basis-3/5' : 'flex-1'
        } ${
          isMobile && showDetail && !isDetailPinned
            ? 'hidden'
            : ''
        }`}
      >
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onAdd={handleAddNewTask}
          isLoading={taskStatus === 'loading' && tasks.length === 0}
        />

        {(taskStatus === "loading" && tasks.length === 0) && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-foreground text-base font-medium">Loading tasks...</p>
          </div>
        )}
        {(taskError || listError || tagsError) && (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-red-500">
              Error: {taskError || listError || tagsError}
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <TaskList selectedTaskId={selectedTaskId} />
        </div>
      </div>

      {showDetail &&
        (isDetailPinned && !isMobile ? (
          <div className="flex-shrink-0 flex-grow-0 basis-2/5 max-w-lg">
            <div className="h-full overflow-hidden pt-12 pr-4 pb-12 pl-0">
              <Outlet
                context={{
                  isMobile,
                  onTaskCreated: handleTaskCreated,
                  isDetailPinned,
                  setIsDetailPinned,
                }}
              />
            </div>
          </div>
        ) : (
          // Unpinned "popup" mode on desktop, or default view on mobile
          <div
            className={`absolute z-10 ${
              isMobile
                ? "inset-0"
                : "h-full top-0 right-0 w-1/2 max-w-lg pt-12 px-4 pb-12"
            }`}
          >
            <Outlet
              context={{
                isMobile,
                onTaskCreated: handleTaskCreated,
                isDetailPinned,
                setIsDetailPinned,
              }}
            />
          </div>
        ))}
    </div>
  );
};
