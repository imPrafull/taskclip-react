import { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TaskForm } from './TaskForm';
import { RootState, AppDispatch } from '../../store/store';
import { getTasks, addNewTask, updateTask } from '../../store/slices/tasksSlice';
import { TaskItem, TaskPayload, TaskStatus } from '../../models/task';

interface TaskFormWrapperProps {
    mode: 'create' | 'edit';
}

export const TaskFormWrapper = ({ mode }: TaskFormWrapperProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { isMobile, onTaskCreated, isDetailPinned, setIsDetailPinned } = useOutletContext<{ isMobile: boolean, onTaskCreated: (taskId: string) => void, isDetailPinned?: boolean, setIsDetailPinned?: (pinned: boolean) => void }>();
    const { tasks, status } = useSelector((state: RootState) => state.tasks);
    const [task, setTask] = useState<TaskItem | null>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(getTasks({ page: 1 }));
        }
    }, [status, dispatch]);

    useEffect(() => {
        if (mode === 'edit' && id) {
            const existingTask = tasks.find(t => t.id === id);
            if (existingTask) {
                setTask(existingTask);
            }
        } else if (mode === 'create') {
            setTask(null);
        }
    }, [id, mode, tasks]);

    const handleSave = async (taskData: TaskPayload) => {
        try {
            if (mode === 'create') {
                // When creating a task, default status is 'todo'.
                const taskToCreate: Omit<TaskPayload, 'id'> & { status?: TaskStatus } = {
                    title: taskData.title,
                    description: taskData.description,
                    list: taskData.list ?? null,
                    dueDate: taskData.dueDate,
                    subtasks: taskData.subtasks,
                    status: taskData.status ?? TaskStatus.Todo,
                };
                const newTask = await dispatch(addNewTask(taskToCreate)).unwrap();
                if (onTaskCreated && newTask) {
                    onTaskCreated(newTask.id);
                } else {
                    navigate(`/tasks/${newTask.id}`);
                }
            } else if (mode === 'edit' && id) {
                await dispatch(updateTask({ ...taskData, id })).unwrap();
                navigate(`/tasks/${id}`);
            }
        } catch (err) {
            console.error('Failed to save the task: ', err);
        }
    };

    const handleClose = () => {
        if (mode === 'edit' && id) {
            navigate(`/tasks/${id}`);
        } else {
            navigate('/tasks');
        }
    }

    if (mode === 'edit' && !task) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <TaskForm
            task={task}
            onClose={handleClose}
            onSave={handleSave}
            isMobile={isMobile}
            mode={mode}
            isPinned={isDetailPinned}
            onPinToggle={setIsDetailPinned ? () => setIsDetailPinned(!isDetailPinned) : undefined}
        />
    );
};
