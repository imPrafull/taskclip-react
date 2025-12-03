import { ChevronRightIcon, SettingsIcon, LogOutIcon, XIcon, PlusIcon, MoonIcon, SunIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../lib/authService";
import { Button } from "../ui/Button";
import { Tag as TagType, TaskListInfo } from "../../models/task";
import { AddListModal } from "./AddListModal";
import { AddTagModal } from "./AddTagModal";
import Tag from "../ui/Tag";
import { useTheme } from "../../hooks/useTheme";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedListId: string | null;
  onListSelect: (listId: string) => void;
  lists: TaskListInfo[];
  onListCreated: (newList: TaskListInfo) => void;
  tags: TagType[];
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedListId,
  onListSelect,
  lists,
  onListCreated,
  tags,
}) => {
  const { theme, toggleTheme } = useTheme();

  const taskNavItems = [
    { id: 'upcoming', icon: <ChevronRightIcon className="w-5 h-5 text-foreground" />, name: 'Upcoming', count: 12 },
    { id: 'today', icon: <div className="w-5 h-5 flex items-center justify-center">≡</div>, name: 'Today', count: 5 },
    // { id: 'calendar', icon: <div className="w-5 h-5 flex items-center justify-center">📅</div>, name: 'Calendar' },
    // { id: 'sticky', icon: <div className="w-5 h-5 flex items-center justify-center">📌</div>, name: 'Sticky Wall' },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddListModalOpen, setAddListModalOpen] = useState(false);
  const [isAddTagModalOpen, setAddTagModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/", { replace: true });
  };

  const handleListCreated = (newList: TaskListInfo) => {
    onListCreated(newList);
    onClose(); // Close sidebar on mobile after creation
  };

  return (
    <>
      <AddListModal isOpen={isAddListModalOpen} onClose={() => setAddListModalOpen(false)} onListCreated={handleListCreated} />
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
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
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
                  onClick={item.id === 'today' ? () => onListSelect("today") : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedListId === item.id
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                  disabled={item.id !== 'today'} // Disabling non-functional buttons for now
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
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => onListSelect(list.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedListId === list.id
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
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
