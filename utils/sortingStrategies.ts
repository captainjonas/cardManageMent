import { arrayMove } from '@dnd-kit/sortable';
import { Items, SameContainerStrategy, CrossContainerStrategy } from '../types';

export class DefaultSameContainerStrategy implements SameContainerStrategy {
  sort(items: Items, activeId: string, overId: string): Items {
    const activeContainer = this.findContainer(items, activeId);
    if (!activeContainer) return items;

    const newItems = { ...items };
    const activeIndex = items[activeContainer].findIndex(task => task.id === activeId);
    const overIndex = items[activeContainer].findIndex(task => task.id === overId);

    newItems[activeContainer] = arrayMove(
      items[activeContainer],
      activeIndex,
      overIndex
    );

    return newItems;
  }

  private findContainer(items: Items, id: string): keyof Items | null {
    if (items.in_progress.some(task => task.id === id)) return 'in_progress';
    if (items.done.some(task => task.id === id)) return 'done';
    return null;
  }
}

export class DefaultCrossContainerStrategy implements CrossContainerStrategy {
  sort(items: Items, activeId: string, overId: string, hoverIndex?: number): Items {
    const activeContainer = this.findContainer(items, activeId);
    const overContainer = this.findContainer(items, overId);
    
    if (!activeContainer || !overContainer) return items;

    const newItems = { ...items };
    const activeIndex = items[activeContainer].findIndex(task => task.id === activeId);
    const [removed] = newItems[activeContainer].splice(activeIndex, 1);

    if (overId === 'in_progress' || overId === 'done') {
      const targetItems = items[overContainer];
      const insertIndex = targetItems.findIndex(item => 
        item.content.localeCompare(removed.content) > 0
      );
      
      const finalIndex = hoverIndex !== undefined && hoverIndex >= 0 
        ? hoverIndex 
        : (insertIndex >= 0 ? insertIndex : targetItems.length);
      
      newItems[overContainer].splice(finalIndex, 0, removed);
      return newItems;
    }

    const overIndex = items[overContainer].findIndex(task => task.id === overId);
    const overTask = items[overContainer][overIndex];
    
    if (removed.content.localeCompare(overTask.content) < 0) {
      newItems[overContainer].splice(overIndex, 0, removed);
    } else {
      newItems[overContainer].splice(overIndex + 1, 0, removed);
    }

    return newItems;
  }

  private findContainer(items: Items, id: string): keyof Items | null {
    if (id === 'in_progress' || id === 'done') return id as keyof Items;
    if (items.in_progress.some(task => task.id === id)) return 'in_progress';
    if (items.done.some(task => task.id === id)) return 'done';
    return null;
  }
} 