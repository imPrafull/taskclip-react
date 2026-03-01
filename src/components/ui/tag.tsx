import React from 'react';
import { Tag as TagType } from '../../models/task';

interface TagProps {
  tag: TagType;
  onClick?: () => void;
}
const lightenColor = (color: string, percent: number) => {
  const num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
};

const Tag: React.FC<TagProps> = ({ tag, onClick }) => {
  const backgroundColor = lightenColor(tag.color, 50); 

  return (
    <button
      key={tag.id}
      onClick={onClick}
      className="px-3 py-1 rounded-md text-sm font-bold transition-colors hover:opacity-80"
      style={{ backgroundColor, color: tag.color }}
    >
      {tag.name}
    </button>
  );
};

export default Tag;
