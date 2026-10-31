import { seeded } from "../../utilitarios/utilidades";

const FONTS = ["font-display", "font-type", "font-marker", "font-goth", "font-body font-bold"];
const SKINS = ["bg-bone text-ink", "bg-ink text-bone border border-bone", "bg-dust text-ink", "bg-ash text-bone", "bg-paper text-ink"];

// LETRAS RECORTADAS DE REVISTA
export default function LetrasRecortadas({ text, className = "", size = "text-3xl" }: { text: string; className?: string; size?: string }) {
  const rand = seeded(text);
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-0.5 gap-y-1 ${className}`} aria-label={text}>
      {text.split("").map((char, i) => {
        if (char === " ") return <span key={i} className="w-3" aria-hidden="true" />;
        const font = FONTS[Math.floor(rand() * FONTS.length)];
        const skin = SKINS[Math.floor(rand() * SKINS.length)];
        const rot = (rand() * 14 - 7).toFixed(1);
        const lift = (rand() * 6 - 3).toFixed(1);
        return (
          <span
            key={i}
            aria-hidden="true"
            className={`${font} ${skin} ${size} inline-block px-1 leading-none shadow-[2px_2px_0_rgba(0,0,0,.5)]`}
            style={{ transform: `rotate(${rot}deg) translateY(${lift}px)` }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}
