export interface Task {
  id: string;
  content: string;
}

export interface Items {
  in_progress: Task[];
  done: Task[];
}

export interface SortingStrategy {
  sort(items: Items, activeId: string, overId: string): Items;
}

export interface SameContainerStrategy extends SortingStrategy {
  sort(items: Items, activeId: string, overId: string): Items;
}

export interface CrossContainerStrategy extends SortingStrategy {
  sort(items: Items, activeId: string, overId: string, hoverIndex?: number): Items;
} 