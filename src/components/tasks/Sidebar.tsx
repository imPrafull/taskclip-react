import { ChevronRightIcon, SettingsIcon, LogOutIcon, XIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { TaskList, Tag } from "../../data/dummyTasks";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedListId: string | null;
  onListSelect: (listId: string) => void;
  lists: TaskList[];
  tags: Tag[];
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedListId,
  onListSelect,
  lists,
  tags,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[280px] bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-auto flex flex-col h-screen
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
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
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">
              TASKS
            </h3>
            <nav className="space-y-2">
              <button className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Upcoming</span>
                </div>
                <span className="text-sm text-gray-500 font-medium">12</span>
              </button>
              <button
                onClick={() => onListSelect("today")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  selectedListId === "today"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">≡</div>
                  <span className="font-medium">Today</span>
                </div>
                <span className="text-sm text-gray-500 font-medium">5</span>
              </button>
              <button className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">📅</div>
                  <span className="font-medium">Calendar</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">📌</div>
                  <span className="font-medium">Sticky Wall</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                LISTS
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto text-gray-400 hover:text-gray-600"
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
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-sm ${list.color}`} />
                    <span className="font-medium text-gray-700">{list.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{list.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">
              TAGS
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${tag.color} transition-colors hover:opacity-80`}
                >
                  {tag.name}
                </button>
              ))}
              <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900">
                + Add Tag
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 space-y-2">
          <Button
            variant="ghost"
            className="w-full !justify-start gap-3 text-gray-700 hover:text-gray-900"
          >
            <SettingsIcon className="w-5 h-5" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full !justify-start gap-3 text-gray-700 hover:text-gray-900"
          >
            <LogOutIcon className="w-5 h-5" />
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
};
