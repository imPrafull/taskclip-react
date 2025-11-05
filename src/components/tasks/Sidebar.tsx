import { CheckCircle2Icon, ClipboardListIcon, ClockIcon, LogOutIcon, MenuIcon, PlusIcon, XIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onNewTask: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeFilter, onFilterChange, onNewTask }) => {
  const filters = [
    { id: "all", label: "All Tasks", icon: ClipboardListIcon },
    { id: "todo", label: "To Do", icon: ClockIcon },
    { id: "in_progress", label: "In Progress", icon: ClockIcon },
    { id: "completed", label: "Completed", icon: CheckCircle2Icon },
  ];

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
          w-[280px] bg-white border-r border-[#ebebeb]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-[#ebebeb]">
            <h2 className="[font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-2xl">
              TaskClip
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <Button
              onClick={onNewTask}
              className="w-full mb-6 h-[45px] bg-[#58419f] hover:bg-[#58419f]/90 rounded-[10px] [font-family:'Darker_Grotesque',Helvetica] font-bold text-white text-[20px]"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              New Task
            </Button>

            <nav className="space-y-2">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg
                      [font-family:'Darker_Grotesque',Helvetica] font-normal text-[20px]
                      transition-colors
                      ${
                        activeFilter === filter.id
                          ? "bg-[#58419f]/10 text-[#58419f] font-bold"
                          : "text-[#7c7c7c] hover:bg-gray-50"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    {filter.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-[#ebebeb]">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-[45px] [font-family:'Darker_Grotesque',Helvetica] font-normal text-[#7c7c7c] text-[20px] hover:text-[#212529]"
            >
              <LogOutIcon className="w-5 h-5" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
