import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import CartaoArtista from "../componentes/banda/CartaoArtista";
import { AvisoErro, Carregando } from "../componentes/interface/Carregando";
import CampoBusca from "../componentes/interface/CampoBusca";
import Adesivo from "../componentes/interface/Adesivo";
import { GENRE_BY_ID, GENRES, OTHER_BY_ID, OTHER_GENRES } from "../dados/generos";
import { useFotosBandas } from "../hooks/useFotosBandas";
import { normalize } from "../utilitarios/utilidades";
import { searchArtists } from "../servicos/musicbrainz";
import type { ArtistSummary, GenreId } from "../tipos";

const PAGE = 24;

// BUSCA POR NOME OU GÊNERO, SEM RESULTADO REPETIDO, COM OUTROS GÊNEROS ATRÁS DE UM BOTÃO
export default function PaginaBusca() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const genreId = params.get("genero");
  const genre = genreId ? GENRE_BY_ID[genreId as GenreId] ?? OTHER_BY_ID[genreId] : undefined;
  const [showOther, setShowOther] = useState(!!genreId && !!OTHER_BY_ID[genreId]);

  const [results, setResults] = useState<ArtistSummary[]>([]);
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const pictures = useFotosBandas(results);

  useEffect(() => {
    setResults([]);
    setOffset(0);
    setCount(0);
  }, [q, genreId]);

  useEffect(() => {
    if (!q && !genre) return;
    let alive = true;
    setLoading(true);
    setError("");
    searchArtists({ query: q, tag: genre?.tag, offset, limit: PAGE })
      .then((data) => {
        if (!alive) return;
        setCount(data.count);
        setResults((prev) => (offset === 0 ? data.artists : [...prev, ...data.artists.filter((a) => !prev.some((p) => p.id === a.id || normalize(p.name) === normalize(a.name)))]));
      })
      .catch(() => alive && setError("O MusicBrainz não respondeu. Espera uns segundos e tenta de novo."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [q, genre, offset, attempt]);

  const setGenre = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id && id !== genreId) next.set("genero", id);
    else next.delete("genero");
    setParams(next);
  };

  const dig = () => {
    const deepest = Math.max(0, Math.min(count, 2000) - PAGE);
    if (deepest < PAGE) return;
    setResults([]);
    setAttempt((a) => a + 1);
    setOffset(Math.floor(Math.random() * deepest / PAGE) * PAGE + PAGE);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <h1 className="font-display text-7xl leading-none md:text-9xl">{genre ? genre.nome : "Buscar"}</h1>
      <p className="mb-8 mt-3 max-w-xl font-type text-fog">
        {genre ? genre.descricao : "Digita o nome de qualquer banda ou artista, de MPB a pop. O rock é a casa, mas a busca acha tudo."}
      </p>

      <div className="max-w-3xl">
        <CampoBusca initial={q} onSearch={(value) => setParams(genreId ? { q: value, genero: genreId } : { q: value })} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {GENRES.map((g) => (
          <button
            key={g.id}
            onClick={() => setGenre(g.id)}
            className={`flex items-center gap-1.5 border-2 px-3 py-1 font-type text-sm transition-colors ${genreId === g.id ? "border-bone bg-bone text-ink" : "border-smoke text-dust hover:border-bone"}`}
          >
            <Adesivo id={g.sticker} className="h-4 w-4" diecut={false} />
            {g.nome}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <button onClick={() => setShowOther((v) => !v)} className="font-type text-sm text-fog underline underline-offset-4 hover:text-bone">
          {showOther ? "Esconder outros gêneros" : "Quer ver outros gêneros? MPB, pop, hip hop, samba e mais"}
        </button>
        {showOther && (
          <div className="mt-3 flex flex-wrap gap-2">
            {OTHER_GENRES.map((g) => (
              <button
                key={g.id}
                onClick={() => setGenre(g.id)}
                className={`border-2 px-3 py-1 font-type text-sm transition-colors ${genreId === g.id ? "border-bone bg-bone text-ink" : "border-smoke text-dust hover:border-bone"}`}
              >
                {g.nome}
              </button>
            ))}
          </div>
        )}
      </div>

      {genre && (
        <div className="mt-8 flex flex-wrap items-center gap-4 border-[3px] border-dashed border-ash p-4">
          <p className="flex-1 font-type text-dust">
            Quer achar banda que ninguém conhece? O botão sorteia uma página lá no fundo do arquivo de {genre.nome.toLowerCase()}.
          </p>
          <button onClick={dig} className="btn-punk" disabled={loading}>
            <Adesivo id="coffin" className="h-6 w-6" diecut={false} />
            Desenterrar
          </button>
        </div>
      )}

      {count > 0 && (
        <p className="mt-10 font-type text-sm text-ash">
          {q
            ? `${results.length} ${results.length === 1 ? "banda achada" : "bandas achadas"} (sem repetidas)`
            : `${count.toLocaleString("pt-BR")} resultados${offset > 0 ? ` · mostrando a partir do nº ${offset + 1}` : ""}`}
        </p>
      )}

      {!q && !genre && (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <Adesivo id="eye" className="h-24 w-24 animate-float" />
          <p className="font-marker text-2xl text-dust">Digita um nome ou escolhe um gênero ali em cima.</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {results.map((a) => (
          <CartaoArtista key={a.id} artist={a} picture={pictures[a.id]} />
        ))}
      </div>

      {loading && <Carregando text="Revirando o arquivo" />}
      {error && <AvisoErro message={error} onRetry={() => setAttempt((a) => a + 1)} />}
      {!loading && !error && (q || genre) && results.length === 0 && (
        <AvisoErro message="Nada com esse nome. Confere a grafia ou tenta só uma parte do nome." />
      )}

      {!loading && results.length > 0 && offset + PAGE < count && (
        <div className="mt-12 text-center">
          <button onClick={() => setOffset((o) => o + PAGE)} className="btn-punk">
            Carregar mais
          </button>
        </div>
      )}
    </div>
  );
}
