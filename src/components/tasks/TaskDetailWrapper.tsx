import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TaskDetail } from './TaskDetail';
import { RootState, AppDispatch } from '../../store/store';
import { deleteTask, fetchTaskById } from '../../store/slices/tasksSlice';
import { fetchLists } from '../../store/slices/listsSlice';
import { Loader2 } from 'lucide-react';

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

    const [notFound, setNotFound] = useState(false);
    const fetchedIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (listStatus === 'idle') {
            dispatch(fetchLists());
        }
    }, [listStatus, dispatch]);

    // Reset not-found state when navigating to a different task
    useEffect(() => {
        setNotFound(false);
        fetchedIdRef.current = null;
    }, [id]);

    const task = useMemo(() => {
        const taskFromStore = tasks.find(t => t.id === id);
        if (!taskFromStore || listStatus !== 'succeeded') {
            return undefined;
        }
        return taskFromStore;
    }, [id, tasks, lists, listStatus]);

    // Fetch the individual task by ID if it isn't in the paginated store results
    useEffect(() => {
        if (!id || task || notFound) return;
        if (taskStatus === 'idle' || taskStatus === 'loading') return;
        if (listStatus === 'idle' || listStatus === 'loading') return;
        if (fetchedIdRef.current === id) return;

        fetchedIdRef.current = id;
        dispatch(fetchTaskById(id))
            .unwrap()
            .catch(() => setNotFound(true));
    }, [id, task, taskStatus, listStatus, notFound, dispatch]);

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
            }
        }
    };

    const handleClose = () => {
        navigate('/tasks');
    };

    if (!task && notFound) {
        return <div className="p-6 text-foreground">Task not found</div>;
    }

    if (!task) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
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
