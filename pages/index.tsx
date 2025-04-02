import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { SortableItem } from '../components/SortableItem';
import { TaskCard } from '../components/TaskCard';

interface Task {
  id: string;
  content: string;
  status: 'in_progress' | 'done';
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      content: 'Task A',
      status: 'in_progress',
    },
    {
      id: '2',
      content: 'Task B',
      status: 'in_progress',
    },
    {
      id: '3',
      content: 'Task C',
      status: 'done',
    },
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [dragOverStatus, setDragOverStatus] = useState<'in_progress' | 'done' | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id;
    if (typeof id === 'string') {
      setActiveId(id);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const activeTask = tasks.find((task) => task.id === event.active.id);
    const overTask = tasks.find((task) => task.id === event.over?.id);

    if (!activeTask || !overTask) {
      setDragOverStatus(null);
      return;
    }

    if (activeTask.status !== overTask.status) {
      setDragOverStatus(overTask.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setDragOverStatus(null);
      return;
    }

    const activeTask = tasks.find((task) => task.id === active.id);
    const overTask = tasks.find((task) => task.id === over.id);

    if (!activeTask || !overTask) {
      setActiveId(null);
      setDragOverStatus(null);
      return;
    }

    if (activeTask.status !== overTask.status) {
      setTasks(tasks.map((task) => {
        if (task.id === activeTask.id) {
          return { ...task, status: overTask.status };
        }
        return task;
      }));
    } else if (active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === active.id);
        const newIndex = tasks.findIndex((task) => task.id === over.id);
        return arrayMove(tasks, oldIndex, newIndex);
      });
    }

    setActiveId(null);
    setDragOverStatus(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDragOverStatus(null);
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          content: newTask,
          status: 'in_progress',
        },
      ]);
      setNewTask('');
      setIsAddingTask(false);
    }
  };

  const getTaskBackground = (content: string) => {
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
  };

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;
  const inProgressTasks = tasks.filter((task) => task.status === 'in_progress');
  const doneTasks = tasks.filter((task) => task.status === 'done');

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="board-container">
        <div className="board-header">
          <h1 className="text-2xl font-medium text-gray-800">Task Management</h1>
          
          <div className="add-task-section">
            {!isAddingTask ? (
              <button
                onClick={() => setIsAddingTask(true)}
                className="add-task-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <div className="task-form-buttons">
                  <button
                    onClick={handleAddTask}
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
            <div className={`column ${dragOverStatus === 'in_progress' ? 'drag-over' : ''}`}>
              <div className="column-header">
                <h2 className="column-title">IN PROGRESS</h2>
              </div>
              <div className="droppable-area">
                <SortableContext
                  items={inProgressTasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {inProgressTasks.map((task) => (
                    <SortableItem 
                      key={task.id} 
                      id={task.id}
                      className={getTaskBackground(task.content)}
                      currentStatus="in_progress"
                    >
                      {task.content}
                    </SortableItem>
                  ))}
                </SortableContext>
              </div>
            </div>
          </div>

          <div className="column-wrapper">
            <div className={`column ${dragOverStatus === 'done' ? 'drag-over' : ''}`}>
              <div className="column-header">
                <h2 className="column-title">DONE</h2>
              </div>
              <div className="droppable-area">
                <SortableContext
                  items={doneTasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {doneTasks.map((task) => (
                    <SortableItem 
                      key={task.id} 
                      id={task.id}
                      className={getTaskBackground(task.content)}
                      currentStatus="done"
                    >
                      {task.content}
                    </SortableItem>
                  ))}
                </SortableContext>
              </div>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId ? (
            <TaskCard 
              className={getTaskBackground(
                tasks.find(task => task.id === activeId)?.content || ''
              )}
            >
              {tasks.find(task => task.id === activeId)?.content}
            </TaskCard>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
} 