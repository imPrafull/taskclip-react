import React, { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { Button } from "./ui/Button";
import { CreateListPayload } from "../api/lists";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from "../store/store";
import { addNewList, updateList } from "../store/slices/listsSlice";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";

const FIXED_COLORS = [
  '#FF6B6B', // Red
  '#FFD43B', // Yellow,
  '#ADFF2F', // GreenYellow
  '#66D9E8', // Cyan
  '#6495ED', // CornflowerBlue
  '#FF69B4', // HotPink
  '#20B2AA', // LightSeaGreen
  '#D2B48C'  // Tan
];
type AddListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Optional initial values for editing a list. If provided, modal will operate in edit mode */
  initial?: { id?: string; name?: string; description?: string; color?: string };
};

export const AddListModal: React.FC<AddListModalProps> = ({
  isOpen,
  onClose,
  initial,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(FIXED_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setListName("");
      setDescription("");
      setSelectedColor(FIXED_COLORS[0]);
      if (initial) {
        setListName(initial.name || "");
        setDescription(initial.description || "");
        setSelectedColor(initial.color || FIXED_COLORS[0]);
      }
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) {
      setError("List name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const payload: CreateListPayload = {
        name: listName,
        description: description,
        color: selectedColor,
      };
      if (initial && initial.id) {
        await dispatch(updateList({ id: initial.id, data: payload } as any)).unwrap();
      } else {
        await dispatch(addNewList(payload)).unwrap();
      }
      onClose();
    } catch (err) {
      setError((err as Error).message || "Failed to create list.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl p-6 w-full max-w-md border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">{initial && initial.id ? 'Edit List' : 'Create New List'}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground">
            <XIcon className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <Input type="text" placeholder="List Name" value={listName} onChange={(e) => setListName(e.target.value)} autoFocus className="w-full" />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={4}
            />
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
              <div className="flex flex-wrap gap-2">
                {FIXED_COLORS.map(color => (
                  <button key={color} type="button" onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-background ring-primary' : ''}`} style={{ backgroundColor: color }}>
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? (initial && initial.id ? 'Updating...' : 'Creating...') : (initial && initial.id ? 'Save' : 'Create List')}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};