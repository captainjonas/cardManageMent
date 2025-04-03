import { Transform } from '@dnd-kit/utilities';
import { SortingStrategy } from '@dnd-kit/sortable';

// 自定义排序策略，使其他任务不移动
export const customSortingStrategy: SortingStrategy = ({
  activeIndex,
  index,
  rects,
}) => {
  // 如果当前项不是被拖拽的项，则保持原位
  if (index !== activeIndex) {
    return {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    };
  }

  // 如果是被拖拽的项，则应用变换
  const rect = rects[index];
  const activeRect = rects[activeIndex];

  if (!rect || !activeRect) {
    return {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    };
  }

  return {
    x: 0,
    y: activeRect.top - rect.top,
    scaleX: 1,
    scaleY: 1,
  };
}; 