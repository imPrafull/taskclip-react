import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { ArrowLeftIcon, Edit2Icon, Trash2, PlusIcon } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { AddListModal } from "../../components/AddListModal";
import { RootState, AppDispatch } from "../../store/store";
import { deleteList, fetchLists } from "../../store/slices/listsSlice";

export const ListManagement = (): JSX.Element => {
  const navigate = useNavigate();
  const lists = useSelector((state: RootState) => state.lists.lists);
  const listStatus = useSelector((state: RootState) => state.lists.status);
  const [isAddOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: string; name?: string; description?: string; color?: string } | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  useEffect(() => {
    if ((lists.length === 0) && listStatus === 'idle') {
      dispatch(fetchLists());
    }
  }, [lists.length, listStatus, dispatch]);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/tasks')}>
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Manage Lists</h1>
          </div>

          <div className="ml-auto">
            <Button onClick={() => setAddOpen(true)} size="default">
              <span className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                <p className="mb-1">New List</p>
              </span>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {lists.map((list) => (
            <div key={list.id} className="bg-background border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg flex-shrink-0" style={{ backgroundColor: list.color }} />
                <div>
                  <div className="text-base font-semibold text-foreground">{list.name}</div>
                  <div className="text-sm text-muted-foreground">{(list as any).description || 'No description'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing({ id: list.id, name: list.name, description: (list as any).description, color: list.color });
                    setAddOpen(true);
                  }}
                >
                  <Edit2Icon className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    setDeletingIds((s) => [...s, list.id]);
                    try {
                      await dispatch(deleteList(list.id)).unwrap();
                      toast.success(`Deleted list "${list.name}"`);
                    } catch (err) {
                      toast.error((err as Error).message || 'Failed to delete list');
                    } finally {
                      setDeletingIds((s) => s.filter((id) => id !== list.id));
                    }
                  }}
                  disabled={deletingIds.includes(list.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddListModal isOpen={isAddOpen} initial={editing ?? undefined} onClose={() => { setAddOpen(false); setEditing(null); }} />
    </div>
  );
};

export default ListManagement;
