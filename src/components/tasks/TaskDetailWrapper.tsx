import { useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TaskDetail } from './TaskDetail';
import { RootState, AppDispatch } from '../../store/store';
import { fetchTasks, deleteTask } from '../../store/slices/tasksSlice';

export const TaskDetailWrapper = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { isMobile } = useOutletContext<{ isMobile: boolean }>();
    const { tasks, status } = useSelector((state: RootState) => state.tasks);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTasks());
        }
    }, [status, dispatch]);

    const task = tasks.find(t => t.id === id);

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
            onEdit={() => handleEdit()}
            onDelete={() => handleDelete()}
            isMobile={isMobile}
        />
    );
};
