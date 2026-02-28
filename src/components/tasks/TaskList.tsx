import React, { useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { TaskItem } from "./TaskItem";
import { RootState, AppDispatch } from '../../store/store';
import { getTasks } from '../../store/slices/tasksSlice';
import { Loader2 } from "lucide-react";

type TaskListProps = {
  selectedTaskId?: string;
};

export const TaskList: React.FC<TaskListProps> = ({ selectedTaskId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { tasks, status, hasMore, page } = useSelector((state: RootState) => state.tasks);

  const loadingRef = useRef(false);
  const observer = useRef<IntersectionObserver>();

  const lastTaskElementRef = useCallback((node: any) => {
    if (status === 'loading') return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        loadingRef.current = true;
        dispatch(getTasks({ page, loadingRef }));
      }
    });
    if (node) observer.current.observe(node);
  }, [status, hasMore, dispatch, page]); // loadingRef is stable, no need to add

  if (tasks.length === 0 && status !== 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-foreground font-medium">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="divide-y-2 divide-gray-100 dark:divide-border">
      {tasks.map((task, index) => {
        if (tasks.length === index + 1) {
          return (
            <div ref={lastTaskElementRef} key={task.id}>
              <TaskItem
                task={task}
                selectedTaskId={selectedTaskId}
              />
            </div>
          );
        } else {
          return (
            <TaskItem
              key={task.id}
              task={task}
              selectedTaskId={selectedTaskId}
            />
          );
        }
      })}
      {status === 'loading' && tasks.length > 0 && (
        <div className="flex items-center justify-center gap-2 p-4">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <p className="text-muted-foreground text-base">Loading more tasks...</p>
        </div>
      )}
    </div>
  );
};
