import { Link } from "react-router";
import { SLOGANS, WALL_BANDS } from "../../dados/destaques";
import { useFotosBandas } from "../../hooks/useFotosBandas";
import { bandPath, seeded, tilt } from "../../utilitarios/utilidades";
import FotoXerox from "../interface/FotoXerox";

const SHAPES = ["aspect-square", "aspect-[3/4]", "aspect-[4/5]", "aspect-[5/4]"];

// MURAL DE FOTOS DE BANDAS COM FRASES SOLTAS
export default function MuralAdesivos() {
  const pictures = useFotosBandas(WALL_BANDS);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-6xl leading-none md:text-8xl">O mural</h2>
        <p className="max-w-sm font-type text-fog">
          Clássicos, cult e porão, tudo colado na mesma parede. Clica num adesivo pra abrir a ficha da banda.
        </p>
      </div>

      <div className="columns-2 gap-5 md:columns-3 lg:columns-4">
        {WALL_BANDS.map((name, i) => {
          const rot = tilt(name, 5);
          const shape = SHAPES[Math.floor(seeded(name)() * SHAPES.length)];
          return (
            <div key={name} className="mb-6 break-inside-avoid">
              {i % 4 === 1 && (
                <div
                  className={`mb-6 border-[3px] px-4 py-5 text-center font-display text-3xl leading-none ${Math.floor(i / 4) % 2 ? "border-bone bg-ink text-bone" : "border-ink bg-bone text-ink"}`}
                  style={{ transform: `rotate(${-rot}deg)` }}
                >
                  {SLOGANS[Math.floor(i / 4) % SLOGANS.length]}
                </div>
              )}
              <Link
                to={bandPath(name)}
                className="photo-sticker group relative block transition-transform duration-300 hover:z-10 hover:scale-[1.04]"
                style={{ transform: `rotate(${rot}deg)` }}
              >
                <div className="relative overflow-hidden">
                  <FotoXerox src={pictures[name] ?? undefined} alt={name} className={`${shape} w-full transition-transform duration-500 group-hover:scale-110`} />
                  <span className="absolute inset-x-0 bottom-0 translate-y-full bg-ink py-2 text-center font-display uppercase tracking-wide text-bone transition-transform group-hover:translate-y-0">
                    Abrir ficha
                  </span>
                </div>
                <p className="mt-2 text-center font-marker text-lg leading-tight text-ink">{name}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
