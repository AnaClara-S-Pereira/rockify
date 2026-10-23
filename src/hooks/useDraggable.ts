import { useCallback, useRef, useState, type PointerEvent } from "react";

export function useDraggable() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const moved = useRef(false);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      start.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
      moved.current = false;
      setDragging(true);
    },
    [offset],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!dragging) return;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved.current = true;
      setOffset({ x: start.current.ox + dx, y: start.current.oy + dy });
    },
    [dragging],
  );

  const onPointerUp = useCallback(() => setDragging(false), []);

  const onClickCapture = useCallback((e: { preventDefault: () => void; stopPropagation: () => void }) => {
    if (moved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return {
    dragging,
    style: { translate: `${offset.x}px ${offset.y}px`, touchAction: "none" as const },
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onClickCapture },
  };
}
