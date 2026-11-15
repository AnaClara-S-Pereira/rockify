import { throttledJson } from "../utilitarios/requisicoes";
import { yearFrom } from "../utilitarios/texto";
import { isMbid } from "../utilitarios/utilidades";
import type { Member, PersonFacts, WikiPerson } from "../tipos";
import { fileName, pageImages } from "./wikipedia";

// USA A API NORMAL DO WIKIDATA (O SERVIÇO DE CONSULTAS SPARQL BLOQUEIA COM POUCOS PEDIDOS)
type Value = any; // eslint-disable-line @typescript-eslint/no-explicit-any
interface Statement {
  mainsnak: { datavalue?: { value: Value } };
  qualifiers?: Record<string, { datavalue?: { value: Value } }[]>;
}
interface Entity {
  id: string;
  claims: Record<string, Statement[]>;
  sitelinks: Record<string, { title: string }>;
  labels: Record<string, { value: string }>;
}

function wikidata<T>(params: Record<string, string>): Promise<T> {
  return throttledJson<T>(`https://www.wikidata.org/w/api.php?${new URLSearchParams({ format: "json", origin: "*", ...params })}`);
}

const isQid = (key: string) => /^Q\d+$/.test(key);

const entities = new Map<string, Entity | null>();
const labels = new Map<string, string>();

function register(entity: Entity) {
  entities.set(entity.id, entity);
  for (const s of entity.claims?.P434 ?? []) if (s.mainsnak.datavalue?.value) entities.set(s.mainsnak.datavalue.value, entity);
}

// BAIXA OS ITENS A PARTIR DO ID DO WIKIDATA (Q...) OU DO ID DO MUSICBRAINZ (PROCURA PELA PROPRIEDADE P434)
async function loadEntities(keys: string[]) {
  const need = [...new Set(keys)].filter((k) => !entities.has(k));
  if (need.length === 0) return;

  const mbids = need.filter(isMbid);
  const searched = await Promise.all(
    mbids.map((mbid) =>
      wikidata<{ query: { search: { title: string }[] } }>({ action: "query", list: "search", srsearch: `haswbstatement:P434=${mbid}`, srlimit: "1" })
        .then((d) => d.query.search[0]?.title)
        .catch(() => undefined),
    ),
  );
  const ids = [...new Set([...need.filter(isQid), ...searched.filter((id): id is string => !!id)])];
  for (let i = 0; i < ids.length; i += 40) {
    const data = await wikidata<{ entities: Record<string, Entity> }>({
      action: "wbgetentities",
      ids: ids.slice(i, i + 40).join("|"),
      props: "claims|sitelinks|labels",
      sitefilter: "ptwiki|enwiki",
      languages: "pt|en",
    }).catch(() => undefined);
    Object.values(data?.entities ?? {}).forEach(register);
  }
  // O ITEM PODE TER VÁRIOS IDS DO MUSICBRAINZ (P434); GARANTE QUE O ID PEDIDO APONTE PRA ELE
  mbids.forEach((mbid, i) => {
    const found = searched[i] ? entities.get(searched[i]!) : undefined;
    if (found) entities.set(mbid, found);
  });
  for (const key of need) if (!entities.has(key)) entities.set(key, null);
}

async function loadLabels(ids: string[]) {
  const need = [...new Set(ids)].filter((id) => !labels.has(id));
  for (let i = 0; i < need.length; i += 50) {
    const chunk = need.slice(i, i + 50);
    const data = await wikidata<{ entities: Record<string, { labels?: Record<string, { value: string }> }> }>({
      action: "wbgetentities",
      ids: chunk.join("|"),
      props: "labels",
      languages: "pt|en",
    }).catch(() => undefined);
    for (const id of chunk) labels.set(id, data?.entities[id]?.labels?.pt?.value ?? data?.entities[id]?.labels?.en?.value ?? "");
  }
}

const values = (entity: Entity, property: string): Value[] =>
  (entity.claims[property] ?? []).map((s) => s.mainsnak.datavalue?.value).filter((v) => v !== undefined);

const itemIds = (entity: Entity, property: string, max = 8): string[] =>
  values(entity, property)
    .map((v) => v?.id as string | undefined)
    .filter((id): id is string => !!id)
    .slice(0, max);

const labelOf = (e: Entity) => e.labels?.pt?.value ?? e.labels?.en?.value ?? "";

function toDate(value?: Value): string | undefined {
  if (!value?.time) return undefined;
  const iso = (value.time as string).replace(/^\+/, "").slice(0, 10);
  return value.precision >= 11 ? iso : value.precision === 10 ? iso.slice(0, 7) : iso.slice(0, 4);
}

const commonsUrl = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=600`;

export async function getWikiPeople(ids: string[]): Promise<Record<string, WikiPerson>> {
  await loadEntities(ids);
  const found = ids.filter((id) => entities.get(id));
  await loadLabels(found.flatMap((id) => itemIds(entities.get(id)!, "P19", 1)));

  const people: Record<string, WikiPerson> = {};
  for (const id of found) {
    const e = entities.get(id)!;
    const pt = e.sitelinks.ptwiki?.title;
    const en = e.sitelinks.enwiki?.title;
    const file = values(e, "P18")[0] as string | undefined;
    people[id] = {
      mbid: id,
      image: file ? commonsUrl(file) : undefined,
      birth: toDate(values(e, "P569")[0]),
      death: toDate(values(e, "P570")[0]),
      birthPlace: labels.get(itemIds(e, "P19", 1)[0] ?? "") || undefined,
      birthName: values(e, "P1477")[0]?.text,
      commons: values(e, "P373")[0],
      wiki: pt ? { lang: "pt", title: pt } : en ? { lang: "en", title: en } : undefined,
      titles: { pt, en },
    };
  }

  const missing = Object.values(people).filter((p) => !p.image && p.wiki);
  for (const lang of ["pt", "en"] as const) {
    const titles = missing.filter((p) => p.wiki!.lang === lang).map((p) => p.wiki!.title);
    const photos = await pageImages(lang, titles.slice(0, 50)).catch(() => ({}) as Record<string, string>);
    for (const p of missing) if (p.wiki!.lang === lang) p.image = photos[p.wiki!.title];
  }
  return people;
}

const LISTS = {
  spouses: "P26",
  partners: "P451",
  children: "P40",
  siblings: "P3373",
  residence: "P551",
  education: "P69",
  occupations: "P106",
  instruments: "P1303",
  awards: "P166",
  convictions: "P1399",
} as const;

export async function getPersonFacts(id: string): Promise<PersonFacts> {
  await loadEntities([id]);
  const e = entities.get(id);
  const facts: PersonFacts = {
    nicknames: [], spouses: [], partners: [], children: [], siblings: [], parents: [], residence: [],
    education: [], occupations: [], instruments: [], awards: [], convictions: [], images: [],
  };
  if (!e) return facts;

  const parentIds = [...itemIds(e, "P22", 2), ...itemIds(e, "P25", 2)];
  await loadLabels([...Object.values(LISTS).flatMap((p) => itemIds(e, p)), ...parentIds, ...itemIds(e, "P20", 1), ...itemIds(e, "P509", 1)]);

  const names = (list: string[]) => list.map((x) => labels.get(x) ?? "").filter(Boolean);
  for (const [key, property] of Object.entries(LISTS)) facts[key as keyof typeof LISTS] = names(itemIds(e, property));
  facts.parents = names(parentIds);
  facts.nicknames = values(e, "P1449").map((v) => v?.text as string).filter(Boolean);
  facts.deathPlace = names(itemIds(e, "P20", 1))[0];
  facts.deathCause = names(itemIds(e, "P509", 1))[0];

  facts.images = (e.claims.P18 ?? [])
    .map((s) => ({ file: s.mainsnak.datavalue?.value as string | undefined, when: s.qualifiers?.P585?.[0]?.datavalue?.value?.time as string | undefined }))
    .filter((i): i is { file: string; when: string | undefined } => !!i.file)
    .map((i) => ({ src: commonsUrl(i.file), file: fileName(i.file), year: yearFrom(i.when ?? "") }));
  return facts;
}

// INTEGRANTES SEGUNDO O WIKIDATA (QUEM TEM "MEMBRO DE" = A BANDA, MAIS A LISTA "PARTES" DA BANDA); SERVE QUANDO O MUSICBRAINZ NÃO LISTA A FORMAÇÃO
export async function getWikidataLineup(bandKey: string): Promise<Member[]> {
  await loadEntities([bandKey]);
  const band = entities.get(bandKey);
  if (!band) return [];
  const bandQid = band.id;
  const search = await wikidata<{ query: { search: { title: string }[] } }>({ action: "query", list: "search", srsearch: `haswbstatement:P463=${bandQid}`, srlimit: "25" }).catch(() => undefined);
  const ids = [...new Set([...(search?.query.search ?? []).map((s) => s.title), ...itemIds(band, "P527", 20)])].filter((id) => id !== bandQid);
  await loadEntities(ids);

  const people = ids.map((id) => entities.get(id)).filter((e): e is Entity => !!e && values(e, "P31").some((v) => v?.id === "Q5"));
  await loadLabels(people.flatMap((e) => itemIds(e, "P1303", 3)));

  return people.map((e): Member => {
    const stay = (e.claims.P463 ?? []).find((s) => s.mainsnak.datavalue?.value?.id === bandQid);
    const from = toDate(stay?.qualifiers?.P580?.[0]?.datavalue?.value)?.slice(0, 4);
    const to = toDate(stay?.qualifiers?.P582?.[0]?.datavalue?.value)?.slice(0, 4);
    return {
      id: e.claims.P434?.[0]?.mainsnak.datavalue?.value ?? e.id,
      name: labelOf(e),
      instruments: itemIds(e, "P1303", 3).map((i) => labels.get(i) ?? "").filter(Boolean),
      periods: from || to ? [`${from ?? "?"}–${to ?? "hoje"}`] : [],
      current: !to,
      original: false,
    };
  }).filter((m) => m.name);
}

export async function getWikiTitles(key: string): Promise<{ pt?: string; en?: string } | undefined> {
  await loadEntities([key]);
  const e = entities.get(key);
  return e ? { pt: e.sitelinks.ptwiki?.title, en: e.sitelinks.enwiki?.title } : undefined;
}
