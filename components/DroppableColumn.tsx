import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Task } from '../types';

interface Props {
  id: string;
  title: string;
  items: Array<{ id: string; content: string }>;
  getTaskBackground: (content: string) => string;
  activeId?: string;
  hoverIndex?: number;
}

export function DroppableColumn({
  id,
  title,
  items,
  getTaskBackground,
  activeId,
  hoverIndex,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const showDropIndicator = activeId && !items.find(item => item.id === activeId);

  return (
    <div className={`column ${isOver ? 'drag-over' : ''}`} ref={setNodeRef}>
      <div className="column-header">
        <h2 className="droppable-column-title">
          {title}
          <span>({items.length})</span>
        </h2>
      </div>
      <div className="column-content">
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => (
            <div key={item.id} className="relative">
              {showDropIndicator && hoverIndex === index && (
                <div className="drop-placeholder visible" />
              )}
              <SortableItem
                id={item.id}
                content={item.content}
                getTaskBackground={getTaskBackground}
                isOverColumn={isOver}
                activeId={activeId}
              />
            </div>
          ))}
          {showDropIndicator && hoverIndex === items.length && (
            <div className="drop-placeholder visible" />
          )}
        </SortableContext>
      </div>
    </div>
  );
}

const PlaceholderIndicator = ({ visible, position, total }: { 
  visible: boolean; 
  position: number; 
  total: number 
}) => (
  <div className={`absolute left-0 right-0 transition-opacity duration-200 pointer-events-none ${visible ? 'opacity-100' : 'opacity-0'}`}>
    <div className={`h-1 bg-blue-500 mx-4 rounded-full transition-all duration-200 ${
      position === 0 ? '-translate-y-1' : 
      position === total ? 'translate-y-1' : ''
    }`} />
  </div>
); 