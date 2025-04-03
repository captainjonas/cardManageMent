import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDndMonitor,
  Over,
  DragMoveEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import { SortableItem } from '../components/SortableItem';
import { TaskCard } from '../components/TaskCard';
import { DroppableColumn } from '../components/DroppableColumn';
import { Items, Task } from '../types';
import { DefaultSameContainerStrategy, DefaultCrossContainerStrategy } from '../utils/sortingStrategies';

// 创建一个单独的组件来使用useDndMonitor
function DragMonitor({ 
  onDragMove, 
  onDragStart, 
  onDragEnd 
}: { 
  onDragMove: (over: Over | null) => void;
  onDragStart: (activeId: string) => void;
  onDragEnd: () => void;
}) {
  useDndMonitor({
    onDragStart({ active }) {
      onDragStart(active.id as string);
    },
    onDragMove({ over }) {
      onDragMove(over);
    },
    onDragEnd() {
      onDragEnd();
    }
  });
  return null;
}

function useBoardManager(initialState: Items) {
  const [items, setItems] = useState<Items>(initialState);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [targetContainer, setTargetContainer] = useState<keyof Items | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number>(-1);
  const [isOverColumn, setIsOverColumn] = useState(false);
  const [isCrossColumn, setIsCrossColumn] = useState(false);

  const findContainer = useCallback((id: string) => {
    if (id === 'in_progress' || id === 'done') {
      return id as keyof Items;
    }
    
    if (items.in_progress.some(task => task.id === id)) return 'in_progress';
    if (items.done.some(task => task.id === id)) return 'done';
    return null;
  }, [items]);

  const updatePlaceholderPosition = useCallback((over: Over | null) => {
    if (!over) {
      setHoverIndex(-1);
      setTargetContainer(null);
      setIsOverColumn(false);
      return;
    }

    const overContainer = findContainer(over.id as string);
    if (!overContainer) return;

    // If dragging over a column
    if (over.id === 'in_progress' || over.id === 'done') {
      setTargetContainer(over.id as keyof Items);
      
      // Get the dragged task content
      const draggedTask = activeId ? 
        [...items.in_progress, ...items.done].find(task => task.id === activeId) : 
        null;
      
      if (draggedTask) {
        // Find the position based on task name
        const targetItems = items[over.id as keyof Items];
        const insertIndex = targetItems.findIndex(item => 
          item.content.localeCompare(draggedTask.content) > 0
        );
        setHoverIndex(insertIndex >= 0 ? insertIndex : targetItems.length);
      } else {
        setHoverIndex(items[over.id as keyof Items].length);
      }
      
      setIsOverColumn(true);
      return;
    }

    // If dragging over a task
    const overIndex = items[overContainer].findIndex(task => task.id === over.id);
    setTargetContainer(overContainer);
    
    // Get the dragged task and target task
    const draggedTask = activeId ? 
      [...items.in_progress, ...items.done].find(task => task.id === activeId) : 
      null;
    const overTask = items[overContainer][overIndex];
    
    if (draggedTask && overTask) {
      // If dragged task name is less than target task name, place before target
      if (draggedTask.content.localeCompare(overTask.content) < 0) {
        setHoverIndex(overIndex);
      } else {
        setHoverIndex(overIndex + 1);
      }
    } else {
      setHoverIndex(overIndex);
    }
    
    setIsOverColumn(false);
  }, [activeId, findContainer, items]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const id = event.active.id;
    if (typeof id === 'string') {
      setActiveId(id);
    }
  }, []);

  const sameContainerStrategy = new DefaultSameContainerStrategy();
  const crossContainerStrategy = new DefaultCrossContainerStrategy();

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) as keyof Items;

    if (!activeContainer || !overContainer) return;

    setItems((prev) => {
      if (activeContainer === overContainer) {
        return sameContainerStrategy.sort(prev, activeId, overId);
      } else {
        return crossContainerStrategy.sort(prev, activeId, overId, hoverIndex);
      }
    });

    resetState();
  }, [findContainer, hoverIndex]);

  const handleDragCancel = useCallback(() => {
    resetState();
  }, []);

  const resetState = useCallback(() => {
    setActiveId(null);
    setTargetContainer(null);
    setHoverIndex(-1);
    setIsOverColumn(false);
    setIsCrossColumn(false);
  }, []);

  const handleAddTask = useCallback((content: string) => {
    if (content.trim()) {
      setItems(prev => ({
        ...prev,
        in_progress: [
          ...prev.in_progress,
          {
            id: Date.now().toString(),
            content,
          },
        ],
      }));
    }
  }, []);

  return {
    items,
    activeId,
    hoverIndex,
    isOverColumn,
    isCrossColumn,
    targetContainer,
    findContainer,
    updatePlaceholderPosition,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    handleAddTask,
    resetState
  };
}

export default function Home() {
  const {
    items,
    activeId,
    hoverIndex,
    isOverColumn,
    isCrossColumn,
    targetContainer,
    findContainer,
    updatePlaceholderPosition,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    handleAddTask,
    resetState
  } = useBoardManager({
    in_progress: [
      { id: 'task-1', content: 'Task A' },
      { id: 'task-2', content: 'Task B' },
    ],
    done: [
      { id: 'task-3', content: 'Task C' },
    ],
  });

  const [newTask, setNewTask] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        tolerance: 5,
        delay: 0,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTaskBackground = useCallback((content: string) => {
    switch (content) {
      case 'Task A':
        return 'bg-blue-200 border-blue-300 text-blue-900 font-medium';
      case 'Task B':
        return 'bg-emerald-200 border-emerald-300 text-emerald-900 font-medium';
      case 'Task C':
        return 'bg-rose-200 border-rose-300 text-rose-900 font-medium';
      default:
        return 'bg-slate-200 border-slate-300 text-slate-900 font-medium';
    }
  }, []);

  const handleAddTaskClick = () => {
    if (newTask.trim()) {
      handleAddTask(newTask);
      setNewTask('');
      setIsAddingTask(false);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      onDragOver={({ active, over }) => {
        if (!over) return;
        updatePlaceholderPosition(over);
      }}
    >
      <DragMonitor 
        onDragMove={updatePlaceholderPosition} 
        onDragStart={(id) => {
          // 不需要在这里设置activeId，因为handleDragStart已经设置了
        }}
        onDragEnd={resetState}
      />
      <div className="board-container">
        <div className="board-header">
          <h1 className="text-2xl font-medium text-gray-800">Task Management</h1>
          
          <div className="add-task-section">
            {!isAddingTask ? (
              <button
                onClick={() => setIsAddingTask(true)}
                className="add-task-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Add Task
              </button>
            ) : (
              <div className="add-task-form">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Please enter the task name."
                  className="task-input"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTaskClick()}
                />
                <div className="task-form-buttons">
                  <button
                    onClick={handleAddTaskClick}
                    className="submit-button"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingTask(false);
                      setNewTask('');
                    }}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
                          </div>
                        )}
          </div>
                  </div>

        <div className="board-content">
          <div className="column-wrapper">
            <DroppableColumn
              id="in_progress"
              title="IN PROGRESS"
              items={items.in_progress}
              getTaskBackground={getTaskBackground}
              activeId={activeId || undefined}
              hoverIndex={targetContainer === 'in_progress' ? hoverIndex : undefined}
            />
          </div>

          <div className="column-wrapper">
            <DroppableColumn
              id="done"
              title="DONE"
              items={items.done}
              getTaskBackground={getTaskBackground}
              activeId={activeId || undefined}
              hoverIndex={targetContainer === 'done' ? hoverIndex : undefined}
            />
          </div>
      </div>

        <DragOverlay 
          dropAnimation={null}
          adjustScale={false}
        >
          {activeId ? (
            <TaskCard 
              content={[...items.in_progress, ...items.done].find(task => task.id === activeId)?.content || ''}
              getTaskBackground={getTaskBackground}
              className="dragging"
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

function moveWithinContainer(
  items: Items,
  container: keyof Items,
  activeId: string,
  overId: string
) {
  const oldIndex = items[container].findIndex(task => task.id === activeId);
  const newIndex = items[container].findIndex(task => task.id === overId);

  return {
    ...items,
    [container]: arrayMove(items[container], oldIndex, newIndex),
  };
} 