import { usePlayer } from "../../contexto/ContextoPlayer";
import { duration, youtubeSearch } from "../../utilitarios/utilidades";
import type { PlayableTrack } from "../../tipos";
import Icone from "../interface/Icone";

// LISTA DAS MÚSICAS MAIS TOCADAS
export default function MaisTocadas({ tracks }: { tracks: PlayableTrack[] }) {
  const { current, playing, play } = usePlayer();

  return (
    <ol className="paper paper-lines divide-y-2 divide-dashed divide-ash/40 p-2 shadow-[8px_8px_0_#000] md:p-4">
      {tracks.map((t, i) => {
        const active = current?.id === t.id;
        return (
          <li key={t.id} className={`flex items-center gap-3 px-2 py-2.5 ${active ? "bg-ink text-bone" : ""}`}>
            <span className="w-6 text-right font-display text-xl">{i + 1}</span>
            <button
              onClick={() => play(t, tracks)}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition-transform hover:scale-110 ${active ? "border-bone bg-bone text-ink" : "border-ink"}`}
              aria-label={active && playing ? `Pausar ${t.title}` : `Tocar ${t.title}`}
            >
              <Icone name={active && playing ? "pause" : "play"} className="h-4 w-4" />
            </button>
            {t.cover && <img src={t.cover} alt="" className="xerox hidden h-10 w-10 object-cover sm:block" />}
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg uppercase leading-tight">{t.title}</p>
              <p className={`truncate font-type text-xs ${active ? "text-fog" : "text-ash"}`}>{t.album}</p>
            </div>
            <span className="hidden font-type text-sm sm:block">{duration((t.duration ?? 0) * 1000)}</span>
            <a
              href={youtubeSearch(`${t.artist} ${t.title}`)}
              target="_blank"
              rel="noreferrer"
              className="p-1 opacity-70 hover:opacity-100"
              aria-label={`Ver ${t.title} no YouTube`}
            >
              <Icone name="youtube" className="h-6 w-6" />
            </a>
          </li>
        );
      })}
    </ol>
  );
}
