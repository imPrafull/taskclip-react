import { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TaskForm } from './TaskForm';
import { RootState, AppDispatch } from '../../store/store';
import { fetchTasks, addNewTask, updateTask } from '../../store/slices/tasksSlice';
import { TaskItem } from '../../models/task';

interface TaskFormWrapperProps {
    mode: 'create' | 'edit';
}

export const TaskFormWrapper = ({ mode }: TaskFormWrapperProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { isMobile } = useOutletContext<{ isMobile: boolean }>();
    const { tasks, status } = useSelector((state: RootState) => state.tasks);
    const [task, setTask] = useState<TaskItem | null>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTasks());
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

    const handleSave = (taskData: Partial<TaskItem>) => {
        if (mode === 'create') {
            dispatch(addNewTask(taskData as Omit<TaskItem, 'id'>));
            navigate('/tasks');
        } else if (mode === 'edit' && id) {
            dispatch(updateTask({ ...task, ...taskData }));
            navigate(`/tasks/${id}`);
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
        />
    );
};
