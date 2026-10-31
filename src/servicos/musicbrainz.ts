import { throttledJson } from "../utilitarios/requisicoes";
import { normalize, translateInstrument, year } from "../utilitarios/utilidades";
import type { Album, Artist, ArtistSummary, ExternalLink, Member, Track } from "../tipos";

const API = "https://musicbrainz.org/ws/2";

interface MbLifeSpan { begin?: string; end?: string; ended?: boolean }
interface MbTag { name: string; count: number }
interface MbArtist {
  id: string;
  name: string;
  type?: string;
  country?: string;
  disambiguation?: string;
  score?: number;
  "life-span"?: MbLifeSpan;
  tags?: MbTag[];
  genres?: MbTag[];
  area?: { name: string };
  "begin-area"?: { name: string };
  relations?: MbRelation[];
  aliases?: { name: string; type?: string }[];
}
interface MbRelation {
  type: string;
  direction: "forward" | "backward";
  begin?: string;
  end?: string;
  ended?: boolean;
  attributes?: string[];
  artist?: { id: string; name: string };
  url?: { resource: string };
}
interface MbReleaseGroup {
  id: string;
  title: string;
  "first-release-date"?: string;
  "primary-type"?: string;
  "secondary-types"?: string[];
}

function toSummary(a: MbArtist): ArtistSummary {
  const tags = [...(a.genres ?? []), ...(a.tags ?? [])]
    .sort((x, y) => y.count - x.count)
    .map((t) => t.name)
    .filter((t, i, arr) => arr.indexOf(t) === i)
    .slice(0, 8);
  return {
    id: a.id,
    name: a.name,
    type: a.type,
    country: a.country,
    disambiguation: a.disambiguation,
    begin: a["life-span"]?.begin,
    end: a["life-span"]?.end,
    ended: a["life-span"]?.ended,
    tags,
  };
}

function escapeLucene(text: string): string {
  return text.replace(/([+\-&|!(){}[\]^"~*?:\\/])/g, "\\$1");
}

const FAKE = /tribute|cover band|in honou?r of|plays |imitat|impersonat|double|tributo|homenagem|karaok/i;

function cleanResults(artists: MbArtist[], query?: string): ArtistSummary[] {
  const seen = new Set<string>();
  const unique = artists.filter((a) => {
    const key = normalize(a.name) || a.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (!query) return unique.map(toSummary);
  const target = normalize(query);
  const real = unique.filter((a) => {
    if (normalize(a.name) === target) return true;
    if (!FAKE.test(query) && FAKE.test(`${a.name} ${a.disambiguation ?? ""}`)) return false;
    return (a.score ?? 0) >= 70 || (a.tags?.length ?? 0) > 0 || !!a["life-span"]?.begin;
  });
  return (real.length > 0 ? real : unique).map(toSummary);
}

// BUSCA DE BANDAS E ARTISTAS
export async function searchArtists(opts: { query?: string; tag?: string; offset?: number; limit?: number }) {
  const parts: string[] = [];
  if (opts.query?.trim()) parts.push(`(${escapeLucene(opts.query.trim())})`);
  if (opts.tag) parts.push(`tag:"${opts.tag}"`);
  const q = encodeURIComponent(parts.join(" AND "));
  const url = `${API}/artist?query=${q}&limit=${opts.limit ?? 24}&offset=${opts.offset ?? 0}&fmt=json`;
  const data = await throttledJson<{ artists: MbArtist[]; count: number }>(url);
  return { artists: cleanResults(data.artists, opts.query?.trim()), count: data.count };
}

export async function resolveByName(name: string): Promise<string | undefined> {
  const url = `${API}/artist?query=${encodeURIComponent(`artist:"${name}"`)}&limit=10&fmt=json`;
  const data = await throttledJson<{ artists: MbArtist[] }>(url);
  const target = normalize(name);
  const exact = data.artists.filter((a) => normalize(a.name) === target);
  const pick = exact.find((a) => a.type === "Group") ?? exact[0] ?? data.artists[0];
  return pick?.id;
}

function buildMembers(relations: MbRelation[]): Member[] {
  const byId = new Map<string, Member>();
  for (const r of relations) {
    if (r.type !== "member of band" || r.direction !== "backward" || !r.artist) continue;
    const attrs = r.attributes ?? [];
    const member = byId.get(r.artist.id) ?? {
      id: r.artist.id,
      name: r.artist.name,
      instruments: [],
      periods: [],
      current: false,
      original: false,
    };
    for (const a of attrs) {
      if (["original", "founder", "additional", "minor", "guest"].includes(a)) continue;
      const pt = translateInstrument(a);
      if (!member.instruments.includes(pt)) member.instruments.push(pt);
    }
    const from = year(r.begin) ?? "?";
    const to = r.ended ? year(r.end) ?? "?" : "hoje";
    const period = `${from}–${to}`;
    if (!member.periods.includes(period)) member.periods.push(period);
    if (!r.ended) member.current = true;
    if (attrs.includes("original") || attrs.includes("founder")) member.original = true;
    byId.set(r.artist.id, member);
  }
  return [...byId.values()].sort((a, b) => Number(b.current) - Number(a.current) || Number(b.original) - Number(a.original));
}

const LINK_TYPES = ["official homepage", "bandcamp", "youtube", "social network", "soundcloud", "free streaming", "streaming", "last.fm"];

function buildLinks(relations: MbRelation[]): ExternalLink[] {
  return relations
    .filter((r) => r.url && LINK_TYPES.includes(r.type))
    .map((r) => ({ type: r.type, url: r.url!.resource }))
    .slice(0, 10);
}

// DADOS COMPLETOS DE UMA BANDA OU ARTISTA
export async function getArtist(id: string): Promise<Artist> {
  const url = `${API}/artist/${id}?inc=artist-rels+url-rels+tags+genres+aliases&fmt=json`;
  const a = await throttledJson<MbArtist>(url);
  const relations = a.relations ?? [];
  const wikidata = relations.find((r) => r.type === "wikidata")?.url?.resource;
  const memberOf = relations
    .filter((r) => r.type === "member of band" && r.direction === "forward" && r.artist)
    .map((r) => r.artist!)
    .filter((g, i, arr) => arr.findIndex((x) => x.id === g.id) === i);

  return {
    ...toSummary(a),
    area: a.area?.name,
    beginArea: a["begin-area"]?.name,
    members: buildMembers(relations),
    links: buildLinks(relations),
    wikidataId: wikidata?.split("/").pop(),
    memberOf,
    aliases: [...new Set((a.aliases ?? []).map((x) => x.name).filter((n) => n !== a.name))].slice(0, 4),
  };
}

// DISCOGRAFIA E FAIXAS
export async function getAlbums(artistId: string): Promise<Album[]> {
  const url = `${API}/release-group?artist=${artistId}&type=album|ep&limit=100&fmt=json`;
  const data = await throttledJson<{ "release-groups": MbReleaseGroup[] }>(url);
  return data["release-groups"]
    .filter((rg) => (rg["secondary-types"] ?? []).length === 0)
    .sort((a, b) => (a["first-release-date"] ?? "9999").localeCompare(b["first-release-date"] ?? "9999"))
    .map((rg) => ({
      id: rg.id,
      title: rg.title,
      year: year(rg["first-release-date"]),
      type: rg["primary-type"] === "EP" ? "EP" : "Álbum",
      cover: `https://coverartarchive.org/release-group/${rg.id}/front-250`,
    }));
}

export async function getTracklist(releaseGroupId: string): Promise<Track[]> {
  const list = await throttledJson<{ releases: { id: string; date?: string }[] }>(
    `${API}/release?release-group=${releaseGroupId}&status=official&limit=25&fmt=json`,
  );
  const first = [...list.releases].sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"))[0];
  if (!first) return [];
  const release = await throttledJson<{ media: { tracks: { number: string; title: string; length?: number }[] }[] }>(
    `${API}/release/${first.id}?inc=recordings&fmt=json`,
  );
  return release.media.flatMap((m) => m.tracks.map((t) => ({ position: t.number, title: t.title, length: t.length })));
}
