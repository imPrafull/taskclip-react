import { LogOutIcon, XIcon, PlusIcon, MoonIcon, SunIcon, AlertTriangleIcon, ListTodoIcon, ClockAlertIcon, ClockArrowUpIcon, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/auth";
import { Button } from "./ui/Button";
import { TaskListInfo } from "../models/task";
import { AddListModal } from "./AddListModal";
import { AddTagModal } from "./AddTagModal";
import { useTheme } from "../hooks/useTheme";
import { getTaskCounts } from "../api/tasks";
import { storageService, USER_KEY } from "../lib/storage";
import { User } from "../models/auth";
import UserCard from "./UserCard";
import { posthog } from "../lib/posthog";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedListId: string | null;
  selectedTaskNavItemId: string | null;
  onListSelect: (listId: string | null) => void;
  onTaskNavItemSelect: (itemId: string | null) => void;
  lists: TaskListInfo[];
  isLoading: boolean;
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedListId,
  selectedTaskNavItemId,
  onListSelect,
  onTaskNavItemSelect,
  lists,
  isLoading,
}) => {
  const { theme, toggleTheme } = useTheme();

  const [counts, setCounts] = useState<{ all: number; today: number; upcoming: number; delayed: number }>({ all: 0, today: 0, upcoming: 0, delayed: 0 });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getTaskCounts();
        if (mounted && data) setCounts(data);
      } catch (e) {
        // ignore errors for now
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const taskNavItems = [
    { id: 'all', icon: <ListTodoIcon className="w-5 h-5 text-foreground" />, name: 'All', count: counts.all },
    { id: 'today', icon: <ClockAlertIcon className="w-5 h-5 text-foreground" />, name: 'Today', count: counts.today },
    { id: 'upcoming', icon: <ClockArrowUpIcon className="w-5 h-5 text-foreground" />, name: 'Upcoming', count: counts.upcoming },
    { id: 'delayed', icon: <AlertTriangleIcon className="w-5 h-5 text-foreground" />, name: 'Delayed', count: counts.delayed },
  ];

  const [isAddListModalOpen, setAddListModalOpen] = useState(false);
  const [isAddTagModalOpen, setAddTagModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = storageService.getItem(USER_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as User;
        setUser(parsed);
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = async () => {
    posthog.capture('user_signed_out');
    posthog.reset();
    await authService.logout();
    navigate("/", { replace: true });
  };

  // no-op: AddListModal dispatches creation directly

  return (
    <>
            <AddListModal isOpen={isAddListModalOpen} onClose={() => setAddListModalOpen(false)} />
      <AddTagModal isOpen={isAddTagModalOpen} onClose={() => setAddTagModalOpen(false)} />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[280px] bg-background border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-auto flex flex-col h-screen
        `}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <UserCard user={user} />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase mb-3 tracking-wider">
              TASKS
            </h3>
            <nav className="space-y-2">
              {taskNavItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTaskNavItemSelect(selectedTaskNavItemId === item.id ? null : item.id);
                  }}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedTaskNavItemId === item.id
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-muted"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.count && <span className="text-sm text-muted-foreground font-medium">{item.count}</span>}
                </button>
              ))}
            </nav>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                LISTS
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto text-foreground hover:text-foreground"
                onClick={() => setAddListModalOpen(true)}
                disabled={isLoading}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => {
                    onListSelect(selectedListId === list.id ? null : list.id); // Deselect if already selected
                  }}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedListId === list.id
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-muted"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: list.color }}
                    />
                    <span className="font-medium">{list.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">{list.count}</span>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="default"
                className="w-full"
                onClick={() => navigate('/lists/manage')}
                disabled={isLoading}
              >
                <Settings className="w-4 h-4" />
                <p className="mb-1">Manage lists</p>
              </Button>
            </div>
          </div>

          {/* <div className="px-6 py-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                TAGS
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto text-foreground hover:text-foreground"
                onClick={() => setAddTagModalOpen(true)}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Tag key={tag.id} tag={tag} />
              ))}
            </div>
          </div> */}
        </div>

        <div className="p-6 space-y-2">
          <Button
            variant="ghost"
            className="w-full !justify-start gap-3 text-foreground"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            Switch Theme
          </Button>
          <Button
            variant="ghost"
            className="w-full !justify-start gap-3 text-foreground"
            onClick={handleLogout}
          >
            <LogOutIcon className="w-5 h-5" />
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
};