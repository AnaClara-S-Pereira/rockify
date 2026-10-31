import { usePlayer } from "../../contexto/ContextoPlayer";
import { youtubeSearch } from "../../utilitarios/utilidades";
import Icone from "../interface/Icone";

// PLAYER FIXO NO RODAPÉ
export default function BarraPlayer() {
  const { current, playing, progress, toggle, next, prev, seek, close } = usePlayer();
  if (!current) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-page border-t-[3px] border-bone bg-ink">
      <div
        className="h-2 cursor-pointer bg-smoke"
        onClick={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          seek((e.clientX - box.left) / box.width);
        }}
        role="slider"
        aria-label="Progresso da música"
        aria-valuenow={Math.round(progress * 100)}
      >
        <div className="h-full bg-bone transition-[width] duration-200" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 md:gap-5 md:px-8">
        {current.cover && (
          <img src={current.cover} alt="" className={`xerox h-12 w-12 border-2 border-bone object-cover ${playing ? "animate-spin-slow rounded-full" : ""}`} />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg uppercase leading-tight">{current.title}</p>
          <p className="truncate font-type text-sm text-fog">
            {current.artist} <span className="text-ash">· prévia de 30s</span>
          </p>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button onClick={prev} className="p-2 text-fog hover:text-bone" aria-label="Anterior">
            <Icone name="prev" />
          </button>
          <button onClick={toggle} className="grid h-11 w-11 place-items-center rounded-full bg-bone text-ink hover:scale-110" aria-label={playing ? "Pausar" : "Tocar"}>
            <Icone name={playing ? "pause" : "play"} />
          </button>
          <button onClick={next} className="p-2 text-fog hover:text-bone" aria-label="Próxima">
            <Icone name="next" />
          </button>
          <a
            href={youtubeSearch(`${current.artist} ${current.title}`)}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 border-2 border-bone px-2 py-1 font-display text-sm uppercase hover:bg-bone hover:text-ink sm:flex"
          >
            <Icone name="youtube" className="h-4 w-4" /> Completa
          </a>
          <button onClick={close} className="p-2 text-fog hover:text-bone" aria-label="Fechar player">
            <Icone name="close" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
