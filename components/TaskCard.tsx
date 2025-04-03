import { forwardRef } from 'react';

interface Props {
  content: string;
  getTaskBackground: (content: string) => string;
  className?: string;
}

export function TaskCard({ content, getTaskBackground, className = '' }: Props) {
  return (
    <div className={`card ${getTaskBackground(content)} ${className}`}>
      {content}
    </div>
  );
} 