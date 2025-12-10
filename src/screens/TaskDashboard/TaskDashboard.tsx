import { MenuIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet, useLocation, useParams } from "react-router-dom";
import { TaskList } from "../../components/tasks/TaskList";
import { Sidebar } from "../../components/Sidebar";
import { Button } from "../../components/ui/Button";
import { TaskItem, TaskListInfo } from "../../models/task";
import { RootState, AppDispatch } from '../../store/store';
import { getTasks } from '../../store/slices/tasksSlice';
import { fetchLists, addNewList } from '../../store/slices/listsSlice';
import { fetchTags } from "../../store/slices/tagsSlice";
import { Select } from "../../components/ui/Select";
// import { Input } from "../../components/ui/Input";
import { selectList, selectTaskNavItem, setSortBy } from '../../store/slices/filtersSlice';

export const TaskDashboard = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: selectedTaskId } = useParams<{ id:string }>();
  const { tasks, status: taskStatus, error: taskError } = useSelector((state: RootState) => state.tasks);
  const { lists, status: listStatus, error: listError } = useSelector((state: RootState) => state.lists);
  const { selectedListId, selectedTaskNavItemId, sortBy } = useSelector((state: RootState) => state.taskfilters);
  const { tags, status: tagsStatus, error: tagsError } = useSelector((state: RootState) => state.tags);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  const [isDetailPinned, setIsDetailPinned] = useState(true);

  useEffect(() => {
    if (taskStatus === 'idle') {
      dispatch(getTasks({ page: 1 }));
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
    dispatch(getTasks({ page: 1 }));
  }, [sortBy, dispatch]);

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
        tags={tags}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 ${
          isMobile && showDetail && !isDetailPinned ? "hidden" : "flex"
        }`}
      >
        <div className="p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <MenuIcon className="w-6 h-6 text-foreground" />
              </Button>
              <div className="flex items-center">
                <img src="/logo.png" alt="TaskClip Logo" className="w-8 h-8" />
                <h2 className="text-4xl font-bold text-foreground ml-[-6px]">askclip</h2>
              </div>
            </div>
            {/* <div className="relative flex-1 max-w-md ml-4">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2"
                    />
                </div> */}
            <Button
              onClick={handleAddNewTask}
              className="flex items-center gap-2 p-6"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="font-medium mb-1">Add</span>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mt-4">
              <label htmlFor="sort-by" className="text-sm font-medium text-muted-foreground">Sort by:</label>
              <Select
                id="sort-by"
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                className="text-sm sm:text-base"
              >
                <option value="createdAt:asc">Oldest First</option>
                <option value="createdAt:desc">Newest First</option>
                {/* <option value="dueDate:asc">Due Soon</option> */}
              </Select>
            </div>
          </div>
        </div>

        {(taskStatus === "loading" && tasks.length === 0) && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-foreground">Loading...</p>
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
          <div className="flex-1 min-w-0">
            <div className="h-full overflow-hidden pt-12 pr-4 pb-12 pl-0 max-w-lg">
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
