import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePlayer } from "../../contexto/ContextoPlayer";
import { useAssincrono } from "../../hooks/useAssincrono";
import { duration, youtubeSearch } from "../../utilitarios/utilidades";
import { findTrack } from "../../servicos/deezer";
import { getTracklist } from "../../servicos/musicbrainz";
import type { Album } from "../../tipos";
import Icone from "../interface/Icone";
import { AvisoErro, Carregando } from "../interface/Carregando";
import CapaAlbum from "./CapaAlbum";

// JANELA DO ÁLBUM: CAPA, FAIXAS, PRÉVIA E LINK DO YOUTUBE
export default function JanelaAlbum({ album, artist, onClose }: { album: Album; artist: string; onClose: () => void }) {
  const { data: tracks, loading, error, reload } = useAssincrono(() => getTracklist(album.id), [album.id]);
  const { play } = usePlayer();
  const [searching, setSearching] = useState<string | null>(null);
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const playTrack = async (title: string) => {
    setSearching(title);
    const hit = await findTrack(artist, title);
    setSearching(null);
    if (hit) play(hit);
    else setMissing((m) => [...m, title]);
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink/90 p-4 backdrop-blur-sm md:items-center" onClick={onClose} role="dialog" aria-modal="true" aria-label={album.title}>
      <div className="relative my-10 grid w-full max-w-4xl animate-pop gap-8 bg-bone p-5 text-ink shadow-[14px_14px_0_#000] md:grid-cols-[300px_1fr] md:p-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -right-3 -top-3 grid h-11 w-11 place-items-center rounded-full border-[3px] border-ink bg-bone hover:rotate-90" aria-label="Fechar">
          <Icone name="close" />
        </button>

        <div>
          <CapaAlbum album={album} artist={artist} className="aspect-square w-full border-[3px] border-ink" />
          <h2 className="mt-4 font-display text-4xl uppercase leading-none">{album.title}</h2>
          <p className="mt-1 font-type">
            {artist} · {album.year ?? "s/d"} · {album.type}
          </p>
          <a href={youtubeSearch(`${artist} ${album.title} full album`)} target="_blank" rel="noreferrer" className="btn-bone mt-5 bg-ink text-bone">
            <Icone name="youtube" /> Álbum no YouTube
          </a>
        </div>

        <div>
          <p className="mb-3 font-marker text-2xl">Faixas</p>
          {loading && <Carregando text="Lendo o encarte" />}
          {error && <AvisoErro message="Não deu pra carregar as faixas." onRetry={reload} />}
          {tracks && tracks.length === 0 && <p className="font-type">Esse disco ainda não tem faixas cadastradas.</p>}
          <ol className="divide-y-2 divide-dashed divide-ash/40">
            {tracks?.map((t) => (
              <li key={`${t.position}-${t.title}`} className="flex items-center gap-3 py-2">
                <span className="w-7 text-right font-type text-sm text-ash">{t.position}</span>
                <button
                  onClick={() => playTrack(t.title)}
                  disabled={searching === t.title || missing.includes(t.title)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink hover:bg-ink hover:text-bone disabled:opacity-30"
                  aria-label={`Tocar prévia de ${t.title}`}
                >
                  <Icone name={searching === t.title ? "disc" : "play"} className={`h-3.5 w-3.5 ${searching === t.title ? "animate-spin" : ""}`} />
                </button>
                <span className="min-w-0 flex-1 truncate font-type">{t.title}</span>
                {missing.includes(t.title) && <span className="font-type text-xs text-ash">sem prévia</span>}
                <span className="font-type text-sm text-ash">{duration(t.length)}</span>
                <a href={youtubeSearch(`${artist} ${t.title}`)} target="_blank" rel="noreferrer" aria-label={`${t.title} no YouTube`} className="opacity-60 hover:opacity-100">
                  <Icone name="youtube" />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>,
    document.body,
  );
}
