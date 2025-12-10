import React, { useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { TaskItem } from "./TaskItem";
import { RootState, AppDispatch } from '../../store/store';
import { getTasks } from '../../store/slices/tasksSlice';

type TaskListProps = {
  selectedTaskId?: string;
};

export const TaskList: React.FC<TaskListProps> = ({ selectedTaskId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { tasks, status, hasMore, page } = useSelector((state: RootState) => state.tasks);

  const observer = useRef<IntersectionObserver>();
  const lastTaskElementRef = useCallback((node: any) => {
    if (status === 'loading') return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        dispatch(getTasks({ page }));
      }
    });
    if (node) observer.current.observe(node);
  }, [status, hasMore, dispatch, page]);

  if (tasks.length === 0 && status !== 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-foreground font-medium">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="divide-y-2 divide-gray-100">
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
      {status === 'loading' && <p className="text-center p-4">Loading more tasks...</p>}
    </div>
  );
};
