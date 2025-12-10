import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TaskDetail } from './TaskDetail';
import { RootState, AppDispatch } from '../../store/store';
import { getTasks, deleteTask } from '../../store/slices/tasksSlice';
import { fetchLists } from '../../store/slices/listsSlice';

export const TaskDetailWrapper = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { 
        isMobile, 
        isDetailPinned, 
        setIsDetailPinned 
    } = useOutletContext<{ isMobile: boolean; isDetailPinned: boolean; setIsDetailPinned: (pinned: boolean) => void; }>();

    const { tasks, status: taskStatus } = useSelector((state: RootState) => state.tasks);
    const { lists, status: listStatus } = useSelector((state: RootState) => state.lists);

    useEffect(() => {
        if (taskStatus === 'idle') {
            dispatch(getTasks({ page: 1 }));
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
        return taskFromStore;
    }, [id, tasks, lists, listStatus]);

    const handleEdit = () => {
        navigate(`/tasks/edit/${id}`);
    };

    const handleDelete = async () => {
        if (id) {
            try {
                await dispatch(deleteTask(id)).unwrap();
                navigate('/tasks');
            } catch (err) {
                console.error('Failed to delete the task: ', err);
                // Optionally, show an error message to the user here
            }
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
            isPinned={isDetailPinned}
            onPinToggle={() => setIsDetailPinned(!isDetailPinned)}
        />
    );
};
