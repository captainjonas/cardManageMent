import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from './TaskCard';

interface Props {
  id: string;
  children: React.ReactNode;
  className?: string;
  currentStatus: 'in_progress' | 'done';
}

export function SortableItem({ 
  id, 
  children, 
  className,
  currentStatus,
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
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <TaskCard
      ref={setNodeRef}
      style={style}
      className={`${className} ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      {children}
    </TaskCard>
  );
} 