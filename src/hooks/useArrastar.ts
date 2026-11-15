import { useRef, useState, type PointerEvent } from "react";

// ARRASTAR UM ELEMENTO COM MOUSE OU DEDO
export function useArrastar() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const moved = useRef(false);

  function onPointerDown(e: PointerEvent<HTMLElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    moved.current = false;
    setDragging(true);
  }

  function onPointerMove(e: PointerEvent<HTMLElement>) {
    if (!dragging) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) moved.current = true;
    setOffset({ x: start.current.ox + dx, y: start.current.oy + dy });
  }

  const onPointerUp = () => setDragging(false);

  // SE ARRASTOU, O CLIQUE NO FINAL NÃO CONTA
  function onClickCapture(e: { preventDefault: () => void; stopPropagation: () => void }) {
    if (!moved.current) return;
    e.preventDefault();
    e.stopPropagation();
  }

  return {
    dragging,
    style: { translate: `${offset.x}px ${offset.y}px`, touchAction: "none" as const },
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onClickCapture },
  };
}
