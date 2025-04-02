import { forwardRef } from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const TaskCard = forwardRef<HTMLDivElement, Props>(
  ({ children, className = '', style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`card ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
); 