import { Link } from "react-router";
import { GENRES } from "../../data/genres";
import { tilt } from "../../lib/utils";
import type { Genre } from "../../types";

export function Cassette({ genre }: { genre: Genre }) {
  return (
    <div className="group relative w-72 shrink-0 rounded-md border-[3px] border-bone bg-soot p-3 shadow-[6px_6px_0_#000]">
      <div className="paper relative rounded-sm px-3 pb-2 pt-1">
        <p className="truncate font-marker text-2xl text-ink">{genre.nome}</p>
        <p className="truncate font-type text-xs text-ash">lado A · {genre.arquetipo}</p>
      </div>
      <div className="mx-auto mt-3 flex h-14 w-48 items-center justify-between rounded-full border-2 border-ash bg-ink px-4">
        {[0, 1].map((r) => (
          <span key={r} className="grid h-9 w-9 place-items-center rounded-full border-[3px] border-dust group-hover:animate-spin-slow">
            <span className="h-3 w-3 rounded-full bg-dust" />
          </span>
        ))}
      </div>
      <p className="mt-3 h-10 overflow-hidden font-type text-xs leading-5 text-fog">{genre.descricao}</p>
    </div>
  );
}

export default function GenreCassettes() {
  return (
    <section className="py-20">
      <div className="mx-auto mb-10 flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 md:px-8">
        <h2 className="font-display text-6xl leading-none md:text-8xl">Escolhe uma fita</h2>
        <p className="max-w-sm font-type text-fog">Cada fita abre um gênero e cava bandas dele, inclusive as que ninguém conhece.</p>
      </div>
      <div className="flex gap-8 overflow-x-auto px-4 pb-8 pt-2 md:px-8">
        {GENRES.map((g) => (
          <Link
            key={g.id}
            to={`/buscar?genero=${g.id}`}
            className="transition-transform duration-300 hover:-translate-y-2"
            style={{ rotate: `${tilt(g.id, 3)}deg` }}
          >
            <Cassette genre={g} />
          </Link>
        ))}
      </div>
    </section>
  );
}
