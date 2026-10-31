import type { ReactNode } from "react";
import type { StickerId } from "../../tipos";

const B = "#070707";
const W = "#f3f2ee";
const G = "#8c8c8c";

function burst(points: number, outer: number, inner: number): string {
  return Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

// DESENHOS DOS ADESIVOS
const ART: Record<StickerId, ReactNode> = {
  bolt: <polygon points="60,4 18,56 46,56 36,96 82,40 54,40 68,4" fill={W} stroke={B} strokeWidth="4" strokeLinejoin="round" />,
  skull: (
    <>
      <path d="M50 8C26 8 12 26 12 46c0 14 8 22 16 26v14h44V72c8-4 16-12 16-26C88 26 74 8 50 8Z" fill={W} stroke={B} strokeWidth="4" />
      <ellipse cx="35" cy="47" rx="10" ry="11" fill={B} />
      <ellipse cx="65" cy="47" rx="10" ry="11" fill={B} />
      <polygon points="50,58 44,68 56,68" fill={B} />
      <path d="M40 74v12M50 74v12M60 74v12" stroke={B} strokeWidth="3" />
    </>
  ),
  star: <polygon points={burst(5, 47, 19)} fill={B} stroke={W} strokeWidth="2" strokeLinejoin="round" />,
  heart: (
    <>
      <path d="M50 88C20 66 8 50 8 34 8 20 19 10 31 10c9 0 15 5 19 12 4-7 10-12 19-12 12 0 23 10 23 24 0 16-12 32-42 54Z" fill={B} />
      <g transform="rotate(32 50 50)">
        <polygon points="46,62 46,6 50,-2 54,6 54,62" fill={W} stroke={B} strokeWidth="2.5" />
        <rect x="36" y="60" width="28" height="7" fill={G} stroke={B} strokeWidth="2.5" />
        <rect x="46" y="67" width="8" height="24" fill={B} stroke={W} strokeWidth="1.5" />
      </g>
    </>
  ),
  eye: (
    <>
      <path d="M6 50Q50 6 94 50 50 94 6 50Z" fill={W} stroke={B} strokeWidth="5" />
      <circle cx="50" cy="50" r="18" fill={B} />
      <circle cx="56" cy="44" r="5" fill={W} />
      <path d="M20 34l-6-10M35 25l-3-11M50 22V10M65 25l3-11M80 34l6-10" stroke={B} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  cassette: (
    <>
      <rect x="4" y="20" width="92" height="62" rx="6" fill={B} stroke={W} strokeWidth="2" />
      <rect x="12" y="27" width="76" height="22" fill={W} />
      <text x="50" y="43" textAnchor="middle" fontFamily="Permanent Marker" fontSize="12" fill={B}>MIXTAPE</text>
      <rect x="24" y="54" width="52" height="18" rx="9" fill={G} />
      <circle cx="35" cy="63" r="6" fill={W} stroke={B} strokeWidth="2" />
      <circle cx="65" cy="63" r="6" fill={W} stroke={B} strokeWidth="2" />
    </>
  ),
  vinyl: (
    <>
      <circle cx="50" cy="50" r="46" fill={B} />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#2c2c2c" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#2c2c2c" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="15" fill={W} />
      <circle cx="50" cy="50" r="2.5" fill={B} />
      <path d="M22 30a34 34 0 0 1 16-12" stroke={G} strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  pick: (
    <>
      <path d="M50 96C30 80 8 50 10 26 12 10 30 4 50 4s38 6 40 22c2 24-20 54-40 70Z" fill={W} stroke={B} strokeWidth="4" />
      <text x="50" y="48" textAnchor="middle" fontFamily="Anton" fontSize="22" fill={B}>ROCK</text>
    </>
  ),
  pin: (
    <g transform="rotate(-40 50 50)">
      <path d="M16 44H74M16 56H70" stroke={B} strokeWidth="9" strokeLinecap="round" />
      <path d="M16 44H74M16 56H70" stroke={G} strokeWidth="4" strokeLinecap="round" />
      <circle cx="14" cy="50" r="8" fill="none" stroke={B} strokeWidth="8" />
      <circle cx="14" cy="50" r="8" fill="none" stroke={G} strokeWidth="3" />
      <rect x="68" y="38" width="24" height="24" rx="5" fill={W} stroke={B} strokeWidth="4" />
    </g>
  ),
  flame: (
    <>
      <path d="M50 96C24 96 12 78 14 60c2-16 14-22 16-38 10 10 12 18 12 26 6-10 8-26 4-44 20 12 36 32 38 54 2 22-12 38-34 38Z" fill={B} stroke={W} strokeWidth="2" />
      <path d="M50 90c-12 0-18-10-16-20 2-8 10-12 12-20 8 8 16 16 16 26 0 9-5 14-12 14Z" fill={W} />
    </>
  ),
  knob: (
    <>
      <circle cx="50" cy="50" r="44" fill={B} />
      {Array.from({ length: 11 }, (_, i) => {
        const a = (-225 + i * 27) * (Math.PI / 180);
        return <line key={i} x1={50 + 34 * Math.cos(a)} y1={50 + 34 * Math.sin(a)} x2={50 + 41 * Math.cos(a)} y2={50 + 41 * Math.sin(a)} stroke={W} strokeWidth="2.5" />;
      })}
      <circle cx="50" cy="50" r="27" fill="#262626" stroke={W} strokeWidth="2" />
      <line x1="50" y1="50" x2="68" y2="30" stroke={W} strokeWidth="5" strokeLinecap="round" />
      <text x="82" y="16" fontFamily="Anton" fontSize="16" fill={W}>11</text>
    </>
  ),
  noise: (
    <>
      <polygon points={burst(14, 48, 34)} fill={W} stroke={B} strokeWidth="3" strokeLinejoin="round" />
      <text x="50" y="58" textAnchor="middle" fontFamily="Anton" fontSize="22" fill={B} transform="rotate(-8 50 50)">NOISE!</text>
    </>
  ),
  coffin: (
    <>
      <polygon points="35,4 65,4 80,30 66,96 34,96 20,30" fill={B} stroke={W} strokeWidth="2" />
      <rect x="46" y="22" width="8" height="44" fill={W} />
      <rect x="34" y="34" width="32" height="8" fill={W} />
    </>
  ),
  moon: (
    <>
      <path d="M62 8A42 42 0 1 0 92 66 34 34 0 1 1 62 8Z" fill={W} stroke={B} strokeWidth="4" strokeLinejoin="round" />
      <g transform="translate(26 -28)">
        <polygon points={burst(4, 11, 3)} fill={W} stroke={B} strokeWidth="2" />
      </g>
    </>
  ),
};

export const STICKER_IDS = Object.keys(ART) as StickerId[];

export default function Adesivo({ id, className = "", diecut = true }: { id: StickerId; className?: string; diecut?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={`${diecut ? "diecut" : ""} ${className}`} aria-hidden="true">
      {ART[id]}
    </svg>
  );
}
