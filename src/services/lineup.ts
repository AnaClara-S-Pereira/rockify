import { normalize } from "../lib/utils";
import type { Artist, Member, WikiPerson } from "../types";
import { findWikiPage, getWikiMembers } from "./wiki";
import { getWikidataLineup, getWikiTitles } from "./wikidata";

// FORMAÇÃO DA BANDA: O MUSICBRAINZ MANDA; SE ELE LISTA MENOS DE 2 PESSOAS, COMPLETA COM O WIKIDATA E COM A LISTA DE INTEGRANTES DA WIKIPEDIA
export async function getLineup(artist: Artist): Promise<Member[]> {
  if (artist.type === "Person") return [];
  if (artist.members.length >= 2) return artist.members;

  const known = new Set(artist.members.map((m) => normalize(m.name)));
  const fresh = (list: Member[]) => list.filter((m) => !known.has(normalize(m.name)));

  const fromWikidata = fresh(await getWikidataLineup(artist.wikidataId ?? artist.id).catch(() => [] as Member[]));
  if (fromWikidata.length > 0) return [...artist.members, ...fromWikidata];

  const titles = await getWikiTitles(artist.wikidataId ?? artist.id).catch(() => undefined);
  const pages = [titles?.pt && { lang: "pt" as const, title: titles.pt }, titles?.en && { lang: "en" as const, title: titles.en }].filter((p) => !!p);
  if (pages.length === 0) {
    const found = await Promise.all([findWikiPage(artist.name, artist.tags[0] ?? "rock", ["pt"]), findWikiPage(artist.name, artist.tags[0] ?? "rock", ["en"])]);
    pages.push(...found.filter((p) => !!p));
  }
  for (const { lang, title } of pages) {
    const fromWiki = fresh(await getWikiMembers(lang, title));
    if (fromWiki.length > 0) return [...artist.members, ...fromWiki];
  }
  return artist.members;
}

// MEMBROS SEM FOTO NO WIKIDATA GANHAM A FOTO DA PÁGINA DELES NA WIKIPEDIA (ACHADA PELO NOME, CONFERINDO QUE CITA A BANDA)
export async function addMissingPhotos(people: Record<string, WikiPerson>, members: Member[], band: string): Promise<Record<string, WikiPerson>> {
  const out = { ...people };
  await Promise.all(
    members
      .filter((m) => !out[m.id]?.image)
      .map(async (m) => {
        const page = await findWikiPage(m.name, band, ["pt", "en"], band);
        if (page?.image) out[m.id] = { ...(out[m.id] ?? { mbid: m.id }), image: page.image };
      }),
  );
  return out;
}
