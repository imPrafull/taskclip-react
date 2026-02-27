import React from 'react';
import { MenuIcon, PlusIcon, ArrowDownUpIcon, ListFilterIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { Select } from './ui/select';
import { TaskStatus } from '../models/task';
import { useTheme } from '../hooks/useTheme';
import { getContrastTextClass } from '../lib/utils';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setStatus, setSortBy } from '../store/slices/filtersSlice';

type Props = {
  onOpenSidebar: () => void;
  onAdd: () => void;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({ onOpenSidebar, onAdd, isLoading }) => {
  const { theme } = useTheme();
  const dispatch: AppDispatch = useDispatch();
  const lists = useSelector((state: RootState) => state.lists.lists);
  const selectedListId = useSelector((state: RootState) => state.taskfilters.selectedListId);
  const selectedTaskNavItemId = useSelector((state: RootState) => state.taskfilters.selectedTaskNavItemId);
  const selectedStatus = useSelector((state: RootState) => state.taskfilters.selectedStatus);
  const sortBy = useSelector((state: RootState) => state.taskfilters.sortBy);
  const visibleCount = useSelector((state: RootState) => state.tasks.tasks.length);

  const formatNavLabel = (key?: string | null) => {
    if (!key || key === 'all') return 'All Tasks';
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const navLabel = formatNavLabel(selectedTaskNavItemId);
  const selectedList = selectedListId ? lists.find((l) => l.id === selectedListId) : undefined;
  const selectedListName = selectedList?.name;
  const selectedListColor = selectedList?.color;

  const isTailwindColor = !!selectedListColor && selectedListColor.startsWith('bg-');
  const chipBgClass = isTailwindColor ? selectedListColor : undefined;
  const chipStyle = !isTailwindColor && selectedListColor ? { backgroundColor: selectedListColor } : undefined;

  const selectedListTextClass = getContrastTextClass(selectedListColor, theme);
  const countBadgeClass = selectedListColor
    ? (selectedListTextClass === 'text-white' ? 'bg-white/20 text-white' : 'bg-white text-gray-800')
    : (theme === 'dark' ? 'bg-white/20 text-white' : 'bg-white text-gray-800');

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar}>
            <MenuIcon className="w-6 h-6 text-foreground" />
          </Button>
          <div className="flex items-center">
            <img src="/logo.png" alt="TaskClip Logo" className="w-7 h-7 pb-[2px]" />
            <h3 className="text-2xl font-bold text-foreground ml-[-7px]">askclip</h3>
          </div>
        </div>

        <Button onClick={onAdd} disabled={isLoading} className="flex items-center gap-2 py-2 px-4 text-base" size="sm">
          <PlusIcon className="w-4 h-4" />
          <span className="font-medium mb-1">Add</span>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 mr-2 rounded-lg ${chipBgClass ?? 'bg-accent'} ${selectedListTextClass} font-semibold text-sm md:text-base shadow-sm`}
              style={chipStyle}
            >
              <span className="mr-2">{navLabel}</span>
              <span className={`inline-flex items-center ${countBadgeClass} px-2 py-0.5 rounded-lg text-xs sm:text-sm font-medium`}>{visibleCount}</span>
            </span>

            {selectedListName && (
              <span
                className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg ${chipBgClass ?? 'bg-emerald-600'} ${selectedListTextClass} font-semibold text-sm md:text-base shadow-sm`}
                style={chipStyle}
              >
                {selectedListName}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="relative">
            <ListFilterIcon className="w-4 h-4 text-accent-foreground absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => dispatch(setStatus(e.target.value as TaskStatus | 'all'))}
              disabled={isLoading}
              className="text-xs sm:text-sm px-2 py-1 pl-8 pr-2 sm:pr-8 appearance-none min-w-26"
            >
              <option value="all">Status</option>
              {(Object.keys(TaskStatus) as Array<keyof typeof TaskStatus>).map((k) => (
                <option key={k} value={TaskStatus[k]}>
                  {k.replace(/([A-Z])/g, ' $1').trim()}
                </option>
              ))}
            </Select>
          </div>

          <div className="relative">
            <ArrowDownUpIcon className="w-4 h-4 text-accent-foreground absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Select id="sort-by" value={sortBy} onChange={(e) => dispatch(setSortBy(e.target.value))} disabled={isLoading} className="text-xs sm:text-sm px-2 py-1 pl-8 pr-2 sm:pr-8 min-w-26 appearance-none">
              <option value="createdAt:asc">Oldest First</option>
              <option value="createdAt:desc">Newest First</option>
              <option value="dueDate:asc">Due Soon</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
