// ÍCONES DESENHADOS EM SVG
const PATHS = {
  play: "M7 4v16l13-8z",
  pause: "M6 4h4v16H6zM14 4h4v16h-4z",
  next: "M5 4v16l10-8zM17 4h3v16h-3z",
  prev: "M19 4v16L9 12zM4 4h3v16H4z",
  search: "M10.5 3a7.5 7.5 0 1 0 4.6 13.4l4.8 4.8 1.4-1.4-4.8-4.8A7.5 7.5 0 0 0 10.5 3zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11z",
  close: "M5.6 4.2 12 10.6l6.4-6.4 1.4 1.4-6.4 6.4 6.4 6.4-1.4 1.4-6.4-6.4-6.4 6.4-1.4-1.4 6.4-6.4-6.4-6.4z",
  menu: "M3 5h18v3H3zM3 11h18v3H3zM3 17h18v3H3z",
  heart: "M12 21s-8-5.2-8-11.2A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8 3.2C20 15.8 12 21 12 21z",
  youtube: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z",
  external: "M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14zM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  shuffle: "M16 3h5v5l-1.8-1.8-4 4-1.4-1.4 4-4zM3 5.6 4.4 4.2 19.8 19.6 18.4 21zM14.6 15.9l1.4-1.4 3.2 3.2L21 16v5h-5l1.8-1.8z",
  disc: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
} as const;

export type IconName = keyof typeof PATHS;

export default function Icone({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={PATHS[name]} fillRule="evenodd" />
    </svg>
  );
}
