import { useState } from "react";
import { Link } from "react-router";
import { usePlayer } from "../../contexto/ContextoPlayer";
import { GENRE_BY_ID } from "../../dados/generos";
import { useFotosBandas } from "../../hooks/useFotosBandas";
import { bandPath, tilt, youtubeSearch } from "../../utilitarios/utilidades";
import { findTrack } from "../../servicos/deezer";
import type { QuizResult } from "../../tipos";
import Icone from "../interface/Icone";
import Adesivo from "../interface/Adesivo";
import FotoXerox from "../interface/FotoXerox";

// PATCH DO GÊNERO
export function SeloGenero({ result, small = false }: { result: QuizResult; small?: boolean }) {
  const genre = GENRE_BY_ID[result.genre];
  return (
    <div className={`stitch inline-flex items-center gap-3 rounded-[40%_60%_55%_45%/50%] bg-bone text-ink shadow-[5px_5px_0_#000] ${small ? "px-4 py-2" : "px-8 py-5"}`}>
      <Adesivo id={genre.sticker} className={small ? "h-8 w-8" : "h-16 w-16"} diecut={false} />
      <div>
        <p className={`font-marker leading-none ${small ? "text-lg" : "text-3xl"}`}>{genre.arquetipo}</p>
        <p className="font-type text-xs">{genre.nome}</p>
      </div>
    </div>
  );
}

// RESULTADO DO QUIZ: PATCH, RANKING, BANDAS E MÚSICAS
export default function ResultadoQuiz({ result }: { result: QuizResult }) {
  const genre = GENRE_BY_ID[result.genre];
  const pictures = useFotosBandas(genre.bandas);
  const { play } = usePlayer();
  const [loadingSong, setLoadingSong] = useState<string | null>(null);
  const [missing, setMissing] = useState<string[]>([]);

  const playSong = async (artist: string, title: string) => {
    setLoadingSong(title);
    const hit = await findTrack(artist, title);
    setLoadingSong(null);
    if (hit) play(hit);
    else setMissing((m) => [...m, title]);
  };

  return (
    <div className="space-y-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="font-type text-dust">Seu barulho é</p>
          <h2 className="rough font-display text-6xl uppercase leading-[0.85] md:text-8xl">{genre.arquetipo}</h2>
          <p className="mt-4 max-w-md font-type text-lg text-dust">{genre.descricao}</p>
          <div className="mt-6">
            <SeloGenero result={result} />
          </div>
        </div>

        <div className="paper p-6 shadow-[10px_10px_0_#000]">
          <p className="font-marker text-2xl">Sua mistura</p>
          <div className="mt-4 space-y-4">
            {result.ranking.slice(0, 5).map((r) => (
              <div key={r.id}>
                <div className="flex justify-between font-type text-sm">
                  <span>{GENRE_BY_ID[r.id].nome}</span>
                  <span>{r.pct}%</span>
                </div>
                <div className="mt-1 h-4 border-2 border-ink">
                  <div className="h-full bg-ink" style={{ width: `${Math.max(r.pct, 2)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-8 font-display text-5xl uppercase">Bandas pra você</h3>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {genre.bandas.map((b) => (
            <Link key={b} to={bandPath(b)} className="photo-sticker block transition-transform hover:-translate-y-1 hover:rotate-0" style={{ rotate: `${tilt(b, 4)}deg` }}>
              <FotoXerox src={pictures[b] ?? undefined} alt={b} className="aspect-square w-full" />
              <p className="mt-1 text-center font-marker text-ink">{b}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-8 font-display text-5xl uppercase">Músicas pra começar</h3>
        <ul className="paper paper-lines divide-y-2 divide-dashed divide-ash/40 p-3 shadow-[8px_8px_0_#000]">
          {genre.musicas.map((m) => (
            <li key={m.titulo} className="flex items-center gap-3 px-2 py-3">
              <button
                onClick={() => playSong(m.artista, m.titulo)}
                disabled={missing.includes(m.titulo)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink hover:bg-ink hover:text-bone disabled:opacity-30"
                aria-label={`Tocar ${m.titulo}`}
              >
                <Icone name={loadingSong === m.titulo ? "disc" : "play"} className={`h-4 w-4 ${loadingSong === m.titulo ? "animate-spin" : ""}`} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-xl uppercase leading-tight">{m.titulo}</p>
                <p className="font-type text-sm text-ash">{m.artista}</p>
              </div>
              <a href={youtubeSearch(`${m.artista} ${m.titulo}`)} target="_blank" rel="noreferrer" aria-label={`${m.titulo} no YouTube`} className="opacity-60 hover:opacity-100">
                <Icone name="youtube" className="h-7 w-7" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
