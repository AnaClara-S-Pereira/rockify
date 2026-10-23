import type { CSSProperties, ReactNode } from "react";
import { useDraggable } from "../../hooks/useDraggable";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  rotate?: number;
}

export default function Draggable({ children, className = "", style, rotate = 0 }: Props) {
  const { dragging, style: dragStyle, handlers } = useDraggable();
  return (
    <div
      {...handlers}
      className={`absolute select-none ${dragging ? "z-40 cursor-grabbing" : "z-10 cursor-grab"} ${className}`}
      style={{ ...style, ...dragStyle }}
    >
      <div
        className="transition-transform duration-200"
        style={{ transform: `rotate(${rotate}deg) scale(${dragging ? 1.12 : 1})` }}
      >
        {children}
      </div>
    </div>
  );
}
