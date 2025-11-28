import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TaskDetail } from './TaskDetail';
import { RootState, AppDispatch } from '../../store/store';
import { fetchTasks, deleteTask } from '../../store/slices/tasksSlice';
import { fetchLists } from '../../store/slices/listsSlice';

export const TaskDetailWrapper = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { isMobile } = useOutletContext<{ isMobile: boolean }>();
    const { tasks, status: taskStatus } = useSelector((state: RootState) => state.tasks);
    const { lists, status: listStatus } = useSelector((state: RootState) => state.lists);

    useEffect(() => {
        if (taskStatus === 'idle') {
            dispatch(fetchTasks());
        }
        if (listStatus === 'idle') {
            dispatch(fetchLists());
        }
    }, [taskStatus, listStatus, dispatch]);

    const task = useMemo(() => {
        const taskFromStore = tasks.find(t => t.id === id);
        if (!taskFromStore || listStatus !== 'succeeded') {
            return undefined;
        }
        // This mapping will become unnecessary once the backend sends the populated list.
        // For now, it's corrected to use the right property names.
        return taskFromStore;
    }, [id, tasks, lists, listStatus]);

    const handleEdit = () => {
        navigate(`/tasks/edit/${id}`);
    };

    const handleDelete = () => {
        if (id) {
            dispatch(deleteTask(id));
            navigate('/tasks');
        }
    };

    const handleClose = () => {
        navigate('/tasks');
    }

    if (!task) {
        return <div className="p-6">Task not found</div>;
    }

    return (
        <TaskDetail
            task={task}
            onClose={handleClose}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isMobile={isMobile}
        />
    );
};
