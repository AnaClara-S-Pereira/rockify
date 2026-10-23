import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import RansomText from "../components/ui/RansomText";
import Sticker from "../components/ui/Sticker";
import XeroxImage from "../components/ui/XeroxImage";
import { DOSSIES } from "../data/dossies";
import { WALL_BANDS } from "../data/featured";
import { useBandPictures } from "../hooks/useBandPictures";
import { bandPath, normalize, tilt } from "../lib/utils";
import { getLineup } from "../services/lineup";
import { getArtist, searchArtists } from "../services/musicbrainz";
import type { ArtistSummary, Member } from "../types";

// PESQUISA QUALQUER BANDA NO MUSICBRAINZ E BUSCA A FORMAÇÃO DAS 3 PRIMEIRAS, UMA POR UMA, PRA APARECER AOS POUCOS
function useBandSearch(query: string, skip: string[]) {
  const [results, setResults] = useState<ArtistSummary[]>([]);
  const [lineups, setLineups] = useState<Record<string, Member[]>>({});
  const [loading, setLoading] = useState(false);
  const skipKey = skip.join("|");

  useEffect(() => {
    setResults([]);
    setLineups({});
    if (query.length < 2) {
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const { artists } = await searchArtists({ query, limit: 10 });
        const top = artists.filter((a) => !skip.includes(normalize(a.name))).slice(0, 3);
        if (!alive) return;
        setResults(top);
        for (const artist of top) {
          if (!alive) return;
          const detail = await getArtist(artist.id).catch(() => null);
          const members = detail ? await getLineup(detail).catch(() => detail.members) : [];
          if (alive) setLineups((prev) => ({ ...prev, [artist.id]: members }));
        }
      } catch {
        if (alive) setResults([]);
      } finally {
        if (alive) setLoading(false);
      }
    }, 600);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [query, skipKey]);

  return { results, lineups, loading };
}

const CARD = "group border-[3px] border-ink bg-bone p-4 transition-all hover:-translate-y-1 hover:bg-ink hover:text-bone";

export default function BlackBookPage() {
  // A PESQUISA FICA NA URL, ENTÃO AO VOLTAR DE UM DOSSIÊ A LISTA DE INTEGRANTES CONTINUA LÁ
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  useEffect(() => setParams(query ? { q: query } : {}, { replace: true }), [query]);
  const q = query.trim().toLowerCase();

  // AS BANDAS DE EXEMPLO (ESCRITAS À MÃO) SÓ APARECEM QUANDO COMBINAM COM O QUE FOI DIGITADO
  const examples = DOSSIES.filter(
    (band) =>
      !q ||
      band.banda.toLowerCase().includes(q) ||
      band.integrantes.some((m) => m.nome.toLowerCase().includes(q) || m.apelido.toLowerCase().includes(q)),
  );
  const found = useBandSearch(q, examples.map((b) => normalize(b.banda)));
  const moreBands = WALL_BANDS.filter((name) => !DOSSIES.some((d) => normalize(d.banda) === normalize(name)));
  const pictures = useBandPictures(moreBands);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <header className="relative mb-16 text-center">
        <Sticker id="coffin" className="absolute -top-10 left-0 hidden w-16 -rotate-12 md:block" />
        <Sticker id="heart" className="absolute -top-8 right-0 hidden w-16 rotate-12 md:block" />
        <h1 className="font-goth text-6xl leading-none md:text-8xl">Livro Negro do Rock</h1>
        <p className="mx-auto mt-6 max-w-xl font-type text-lg text-dust">
          Infância, manias, segredos e polêmicas de quem fez barulho de verdade. Escolhe um nome e o livro abre na página dele.
        </p>
        <p className="mt-4 inline-block rotate-[-3deg] border-4 border-blood px-4 py-1 font-display text-2xl uppercase tracking-widest text-blood">
          Polêmicas em vermelho
        </p>
      </header>

      <div className="mx-auto mb-16 max-w-xl">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar qualquer banda ou integrante..."
            className="w-full border-[3px] border-bone bg-ink px-4 py-3 font-type text-bone placeholder:text-ash shadow-[6px_6px_0_#f3f2ee] transition-all focus:outline-none focus:ring-2 focus:ring-blood"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 font-display text-sm text-ash hover:text-bone">
              LIMPAR
            </button>
          )}
        </div>
      </div>

      <div className="space-y-16">
        {/* BANDAS DE EXEMPLO */}
        {examples.map((band) => (
          <article key={band.banda} className="paper paper-lines relative p-6 shadow-[12px_12px_0_#000] md:p-10" style={{ rotate: `${tilt(band.banda, 1)}deg` }}>
            <span className="tape -top-3 left-12 rotate-[-6deg]" />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Link to={`${bandPath(band.banda)}?livro=true`} className="transition-transform hover:-rotate-1">
                <RansomText text={band.banda} size="text-4xl md:text-6xl" />
              </Link>
              <p className="max-w-sm font-marker text-lg">{band.manchete}</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {band.integrantes.map((m) => (
                <Link key={m.nome} to={`${bandPath(band.banda)}?membro=${encodeURIComponent(m.nome)}`} className={CARD}>
                  <p className="font-display text-2xl uppercase leading-tight">{m.nome}</p>
                  <p className="font-marker text-sm">"{m.apelido}"</p>
                  <p className="mt-3 font-type text-xs">
                    {m.curiosidades.length + m.infancia.length} segredos ·{" "}
                    <span className="text-blood">{m.polemicas.length ? `${m.polemicas.length} polêmica${m.polemicas.length > 1 ? "s" : ""}` : "mais no dossiê"}</span>
                  </p>
                </Link>
              ))}
            </div>
          </article>
        ))}

        {/* QUALQUER BANDA PESQUISADA: A FORMAÇÃO VEM DO MUSICBRAINZ, DO WIKIDATA E DA WIKIPEDIA */}
        {found.results.map((artist) => {
          const members = found.lineups[artist.id];
          const cards = members?.length ? members : members ? [{ id: artist.id, name: artist.name, instruments: [] as string[] }] : [];
          return (
            <article key={artist.id} className="paper paper-lines relative p-6 shadow-[12px_12px_0_#000] md:p-10" style={{ rotate: `${tilt(artist.id, 1)}deg` }}>
              <span className="tape -top-3 left-12 rotate-[-6deg]" />
              <div className="flex flex-wrap items-end justify-between gap-4">
                <Link to={`/banda/${artist.id}?livro=true`} className="transition-transform hover:-rotate-1">
                  <RansomText text={artist.name} size="text-4xl md:text-6xl" />
                </Link>
                <p className="max-w-sm font-marker text-lg">
                  {artist.disambiguation || [artist.country, artist.begin?.slice(0, 4)].filter(Boolean).join(" · ") || "Dossiê do arquivo"}
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {members === undefined && <p className="font-type text-ash">Procurando a formação...</p>}
                {cards.map((m) => (
                  <Link key={m.id} to={`/banda/${artist.id}?membro=${encodeURIComponent(m.name)}`} className={CARD}>
                    <p className="font-display text-2xl uppercase leading-tight">{m.name}</p>
                    <p className="font-marker text-sm">"{m.instruments[0] ?? artist.country ?? "Integrante"}"</p>
                    <p className="mt-3 font-type text-xs">
                      Segredos do arquivo · <span className="text-blood">Dossiê ativo</span>
                    </p>
                  </Link>
                ))}
              </div>
            </article>
          );
        })}

        {/* OUTROS ARQUIVOS: BANDAS SEM DOSSIÊ ESCRITO À MÃO, COM DADOS AUTOMÁTICOS */}
        {!q && (
          <section>
            <h2 className="mb-8 text-center font-display text-4xl uppercase md:text-6xl">Mais arquivos</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {moreBands.map((name) => (
                <Link key={name} to={`${bandPath(name)}?livro=true`} className="photo-sticker block transition-transform hover:-translate-y-1 hover:rotate-0" style={{ rotate: `${tilt(name, 4)}deg` }}>
                  <XeroxImage src={pictures[name] ?? undefined} alt={name} className="aspect-square w-full" />
                  <p className="mt-1 text-center font-marker text-ink">{name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {found.loading && <p className="text-center font-marker text-2xl text-dust">Abrindo arquivos do Livro Negro...</p>}

        {!found.loading && examples.length === 0 && found.results.length === 0 && q.length > 0 && (
          <div className="py-12 text-center">
            <p className="font-marker text-2xl text-dust">Nenhum registro encontrado para "{query}".</p>
          </div>
        )}
      </div>
    </div>
  );
}
