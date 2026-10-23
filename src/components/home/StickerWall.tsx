import { Link } from "react-router";
import { SLOGANS, WALL_BANDS } from "../../data/featured";
import { useBandPictures } from "../../hooks/useBandPictures";
import { bandPath, seeded, tilt } from "../../lib/utils";
import XeroxImage from "../ui/XeroxImage";

const SHAPES = ["aspect-square", "aspect-[3/4]", "aspect-[4/5]", "aspect-[5/4]"];

export default function StickerWall() {
  const pictures = useBandPictures(WALL_BANDS);

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
                <span className="tape -top-3 left-1/2 -translate-x-1/2" style={{ rotate: `${-rot * 2}deg` }} />
                <div className="relative overflow-hidden">
                  <XeroxImage src={pictures[name] ?? undefined} alt={name} className={`${shape} w-full transition-transform duration-500 group-hover:scale-110`} />
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
