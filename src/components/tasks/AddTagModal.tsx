import React, { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { addNewTag } from "../../store/slices/tagsSlice";

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
type AddTagModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AddTagModal: React.FC<AddTagModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [tagName, setTagName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(FIXED_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setTagName("");
      setDescription("");
      setSelectedColor(FIXED_COLORS[0]);
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) {
      setError("Tag name cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await dispatch(addNewTag({
        name: tagName,
        description: description,
        color: selectedColor,
      })).unwrap();
      onClose();
    } catch (err) {
      setError((err as Error).message || "Failed to create tag.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">Create New Tag</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground">
            <XIcon className="w-5 h-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <Input type="text" placeholder="Tag Name" value={tagName} onChange={(e) => setTagName(e.target.value)} autoFocus className="h-10 text-base sm:text-base" />
            <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 text-base text-foreground bg-transparent border border-border rounded-md shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]" />
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
              <div className="flex flex-wrap gap-2">
                {FIXED_COLORS.map(color => (
                  <button key={color} type="button" onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`} style={{ backgroundColor: color }}>
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Tag"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
