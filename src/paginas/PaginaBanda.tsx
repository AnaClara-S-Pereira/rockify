import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import GradeAlbuns from "../componentes/banda/GradeAlbuns";
import JanelaAlbum from "../componentes/banda/JanelaAlbum";
import CabecalhoBanda from "../componentes/banda/CabecalhoBanda";
import CartaoIntegrante from "../componentes/banda/CartaoIntegrante";
import DossieIntegrante from "../componentes/banda/DossieIntegrante";
import MaisTocadas from "../componentes/banda/MaisTocadas";
import { AvisoErro, Carregando } from "../componentes/interface/Carregando";
import Adesivo from "../componentes/interface/Adesivo";
import { findBandDossier, findMemberDossier } from "../dados/dossies";
import { useAssincrono } from "../hooks/useAssincrono";
import { normalize, year } from "../utilitarios/utilidades";
import { findDeezerArtist, getTopTracks } from "../servicos/deezer";
import { getIntroPt } from "../servicos/dossie";
import { addMissingPhotos, getLineup } from "../servicos/formacao";
import { getAlbums, getArtist } from "../servicos/musicbrainz";
import { findWikiPages, pagesFrom, type WikiPage } from "../servicos/wikipedia";
import { getWikiPeople } from "../servicos/wikidata";
import type { Album, Member, WikiPerson } from "../tipos";

function SectionTitle({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-10 flex flex-wrap items-end gap-x-6 gap-y-2">
      <h2 className="font-display text-5xl uppercase leading-none md:text-7xl">{title}</h2>
      {note && <p className="font-marker text-lg text-fog">{note}</p>}
    </div>
  );
}

// PÁGINA DA BANDA: DADOS, HISTÓRIA, FORMAÇÃO, MÚSICAS E DISCOGRAFIA; ABRE O DOSSIÊ QUANDO A URL TEM UM INTEGRANTE
export default function PaginaBanda() {
  const { mbid = "", memberId } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);

  const artistQ = useAssincrono(() => getArtist(mbid), [mbid]);
  const albumsQ = useAssincrono(() => getAlbums(mbid), [mbid]);
  const artist = artistQ.data;

  const lineupQ = useAssincrono(() => (artist ? getLineup(artist) : Promise.resolve([] as Member[])), [artist?.id]);
  const isSolo = artist ? lineupQ.data?.length === 0 : false;
  const lineup: Member[] = !artist
    ? []
    : isSolo
      ? [{ id: artist.id, name: artist.name, instruments: [], periods: [`${year(artist.begin) ?? "?"}–${artist.ended ? year(artist.end) ?? "?" : "hoje"}`], current: !artist.ended, original: true }]
      : lineupQ.data ?? [];

  const peopleQ = useAssincrono(
    async () => {
      if (!artist || lineupQ.loading) return {} as Record<string, WikiPerson>;
      const found = await getWikiPeople([artist.id, ...lineup.map((m) => m.id)]);
      return addMissingPhotos(found, lineup, artist.name);
    },
    [artist?.id, lineupQ.loading],
  );
  const people = peopleQ.data ?? {};

  // PÁGINAS DA BANDA NA WIKIPEDIA (PORTUGUÊS E INGLÊS): AS DO WIKIDATA OU, SEM ELAS, A BUSCA PELO NOME
  const bandPagesQ = useAssincrono(async (): Promise<WikiPage[]> => {
    if (!artist || peopleQ.loading || lineupQ.loading) return [];
    const pages = pagesFrom(people[artist.id]?.titles);
    return pages.length > 0 ? pages : findWikiPages(artist.name, artist.tags[0] ?? "rock");
  }, [artist?.id, peopleQ.loading, lineupQ.loading]);
  const bandPages = bandPagesQ.data ?? [];
  const bioQ = useAssincrono(() => (bandPages[0] ? getIntroPt(bandPages[0]) : Promise.resolve([] as string[])), [bandPages[0]?.title, bandPages[0]?.lang]);

  const deezerQ = useAssincrono(async () => {
    if (!artist) return null;
    const dz = await findDeezerArtist(artist.name);
    return { picture: dz?.picture, tracks: dz ? await getTopTracks(dz.id) : [] };
  }, [artist?.id]);

  // VOLTAR DO DOSSIÊ LEVA PRA ONDE A PESSOA ESTAVA (LIVRO NEGRO, BUSCA, BANDA); SEM HISTÓRICO, VAI PRA PÁGINA DA BANDA
  const closeDossier = useCallback(() => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(`/banda/${mbid}`, { replace: true });
  }, [navigate, mbid]);

  const [params] = useSearchParams();
  const wanted = params.get("membro");
  const wantedBook = params.get("livro");

  // ABRE O DOSSIÊ DIRETO QUANDO A URL TEM ?membro= OU ?livro=; O NOME EXATO NÃO PRECISA ESPERAR O WIKIDATA, SÓ O APELIDO DOS EXEMPLOS PRECISA
  useEffect(() => {
    if ((!wanted && !wantedBook) || !artist || lineup.length === 0 || memberId || lineupQ.loading) return;

    const key = normalize(wanted ?? "");
    const exact = key ? lineup.find((m) => normalize(m.name) === key) : undefined;
    if (!exact && key && peopleQ.loading) return;
    const byAlias = key ? lineup.find((m) => normalize(findMemberDossier(m.name, people[m.id]?.birthName)?.nome ?? "") === key) : undefined;
    navigate(`/banda/${mbid}/membro/${(exact ?? byAlias ?? lineup[0]).id}`, { replace: true });
  }, [wanted, wantedBook, artist, mbid, navigate, lineup, memberId, people, peopleQ.loading, lineupQ.loading]);

  if (artistQ.loading) return <Carregando text="Abrindo a ficha da banda" />;
  if (artistQ.error || !artist) return <AvisoErro message="Não achei essa banda no arquivo." onRetry={artistQ.reload} />;

  const bandDossier = findBandDossier(artist.name);
  const picture = deezerQ.data?.picture ?? people[artist.id]?.image;
  const tracks = deezerQ.data?.tracks ?? [];
  const bio = bioQ.data ?? [];
  const openMember = lineup.find((m) => m.id === memberId);

  const manualDossier = openMember ? findMemberDossier(openMember.name, people[openMember.id]?.birthName) : undefined;

  return (
    <>
      <CabecalhoBanda artist={artist} picture={picture} tracks={tracks} hasDossier={!!bandDossier} />

      {/* HISTÓRIA */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <SectionTitle title="A história" note={bandPages[0]?.lang === "en" ? "(traduzido do inglês)" : undefined} />
          {bioQ.loading || bandPagesQ.loading || peopleQ.loading || lineupQ.loading ? (
            <Carregando text="Lendo a história" />
          ) : bio.length > 0 ? (
            <div className="paper relative p-6 shadow-[10px_10px_0_#000] md:p-10">
              <div className="space-y-4 font-type text-lg leading-relaxed">
                {bio.slice(0, 5).map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="border-[3px] border-dashed border-ash p-8 font-type text-dust">
              Ninguém escreveu a história dessa banda ainda. Isso é o que chamam de underground de verdade.
              {artist.area && ` Sabemos que ela vem de ${artist.area}.`}
            </div>
          )}
        </div>

        {bandDossier && (
          <aside className="relative self-start bg-bone p-6 text-ink shadow-[10px_10px_0_#000]" style={{ rotate: "1.5deg" }}>
            <Adesivo id="eye" className="absolute -right-6 -top-8 w-16" />
            <p className="font-marker text-3xl">Segredos da banda</p>
            <p className="mt-1 font-type text-sm text-ash">{bandDossier.manchete}</p>
            <ul className="mt-5 space-y-4 font-type">
              {bandDossier.segredos.map((s) => (
                <li key={s} className="border-l-4 border-ink pl-3">
                  {s}
                </li>
              ))}
            </ul>
          </aside>
        )}
      </section>

      {/* FORMAÇÃO */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionTitle title={isSolo ? "O artista" : "A formação"} note="clica num rosto pra abrir o dossiê" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {lineup.map((m) => (
            <CartaoIntegrante
              key={m.id}
              member={m}
              person={people[m.id]}
              onOpen={() => navigate(`/banda/${mbid}/membro/${m.id}`)}
            />
          ))}
        </div>
        {artist.memberOf.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <p className="font-marker text-xl text-fog">Também tocou em:</p>
            {artist.memberOf.map((g) => (
              <Link key={g.id} to={`/banda/${g.id}`} className="border-2 border-bone px-3 py-1 font-display uppercase hover:bg-bone hover:text-ink">
                {g.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* MAIS TOCADAS */}
      <section className="mx-auto max-w-4xl px-4 py-20 md:px-8">
        <SectionTitle title="Mais tocadas" note="prévias de 30s · versão completa no YouTube" />
        {deezerQ.loading ? (
          <Carregando text="Rebobinando a fita" />
        ) : tracks.length > 0 ? (
          <MaisTocadas tracks={tracks} />
        ) : (
          <p className="font-type text-dust">Nenhuma prévia disponível pra essa banda. Tenta pelo YouTube ou pelos links lá em cima.</p>
        )}
      </section>

      {/* DISCOGRAFIA */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionTitle title="Discografia" note={albumsQ.data ? `${albumsQ.data.length} discos de estúdio e EPs` : undefined} />
        {albumsQ.loading && <Carregando text="Tirando os discos da estante" />}
        {albumsQ.error && <AvisoErro message="A discografia não carregou." onRetry={albumsQ.reload} />}
        {albumsQ.data?.length === 0 && <p className="font-type text-dust">Nenhum disco cadastrado ainda.</p>}
        {albumsQ.data && <GradeAlbuns albums={albumsQ.data} artist={artist.name} onOpen={setAlbum} />}
      </section>

      {album && <JanelaAlbum album={album} artist={artist.name} onClose={() => setAlbum(null)} />}

      {openMember && (
        <DossieIntegrante
          member={openMember}
          person={people[openMember.id]}
          dossier={manualDossier}
          band={artist.name}
          solo={isSolo}
          bandPages={bandPages}
          bandSize={lineup.length}
          waiting={peopleQ.loading || lineupQ.loading}
          onClose={closeDossier}
        />
      )}
    </>
  );
}