import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from './TaskCard';

interface Props {
  id: string;
  content: string;
  getTaskBackground: (content: string) => string;
  isOverColumn?: boolean;
  activeId?: string;
}

export const SortableItem = memo(function SortableItem({ 
  id, 
  content,
  getTaskBackground,
  isOverColumn,
  activeId,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <TaskCard
        content={content}
        getTaskBackground={getTaskBackground}
        className={isDragging ? 'dragging' : ''}
      />
    </div>
  );
}); 