import type { CSSProperties, ReactNode } from "react";
import { useArrastar } from "../../hooks/useArrastar";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  rotate?: number;
}

// CAIXA QUE PODE SER ARRASTADA
export default function Arrastavel({ children, className = "", style, rotate = 0 }: Props) {
  const { dragging, style: dragStyle, handlers } = useArrastar();
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
