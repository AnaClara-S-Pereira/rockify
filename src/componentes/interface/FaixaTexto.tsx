import Adesivo from "./Adesivo";

// FAIXA DE TEXTO CORRENDO
export default function FaixaTexto({ items, reverse = false, dark = false }: { items: string[]; reverse?: boolean; dark?: boolean }) {
  const row = [...items, ...items];
  return (
    <div
      className={`relative overflow-hidden border-y-[3px] border-ink py-3 ${dark ? "bg-ink text-bone border-bone" : "bg-bone text-ink"}`}
      aria-hidden="true"
    >
      <div className={`flex w-max gap-8 whitespace-nowrap ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
        {row.map((text, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-2xl tracking-wide md:text-3xl">
            {text}
            <Adesivo id={i % 2 ? "star" : "bolt"} className="h-7 w-7" diecut={false} />
          </span>
        ))}
      </div>
    </div>
  );
}
