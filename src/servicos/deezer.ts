import { jsonp } from "../utilitarios/requisicoes";
import { normalize } from "../utilitarios/utilidades";
import type { PlayableTrack } from "../tipos";

const API = "https://api.deezer.com";

interface DzArtist { id: number; name: string; picture_xl: string; picture_big: string; nb_fan: number }
interface DzTrack {
  id: number;
  title: string;
  preview: string;
  duration: number;
  artist: { name: string };
  album: { title: string; cover_medium: string };
}

function toPlayable(t: DzTrack): PlayableTrack {
  return {
    id: String(t.id),
    title: t.title,
    artist: t.artist.name,
    album: t.album.title,
    cover: t.album.cover_medium,
    preview: t.preview,
    duration: t.duration,
  };
}

export async function findDeezerArtist(name: string): Promise<{ id: number; picture: string; fans: number } | null> {
  try {
    const data = await jsonp<{ data?: DzArtist[] }>(`${API}/search/artist?q=${encodeURIComponent(name)}&limit=5`);
    const target = normalize(name);
    const match = (data.data ?? []).find((a) => normalize(a.name) === target);
    if (!match || match.picture_xl.includes("/artist//")) return null;
    return { id: match.id, picture: match.picture_xl, fans: match.nb_fan };
  } catch {
    return null;
  }
}

export async function getTopTracks(artistId: number, limit = 10): Promise<PlayableTrack[]> {
  try {
    const data = await jsonp<{ data?: DzTrack[] }>(`${API}/artist/${artistId}/top?limit=${limit}`);
    return (data.data ?? []).filter((t) => t.preview).map(toPlayable);
  } catch {
    return [];
  }
}

export async function findTrack(artist: string, title: string): Promise<PlayableTrack | null> {
  const wantArtist = normalize(artist);
  const wantTitle = normalize(title);
  // A BUSCA COM ASPAS DO DEEZER ÀS VEZES NÃO ACHA NADA; A BUSCA SIMPLES ACHA
  for (const q of [`artist:"${artist}" track:"${title}"`, `${artist} ${title}`]) {
    try {
      const data = await jsonp<{ data?: DzTrack[] }>(`${API}/search?q=${encodeURIComponent(q)}&limit=10`);
      const hits = (data.data ?? []).filter((t) => t.preview && normalize(t.artist.name).includes(wantArtist));
      const hit = hits.find((t) => normalize(t.title) === wantTitle) ?? hits.find((t) => normalize(t.title).startsWith(wantTitle)) ?? hits[0];
      if (hit) return toPlayable(hit);
    } catch {
      continue;
    }
  }
  return null;
}

// CAPA DO ÁLBUM NO DEEZER (QUANDO O COVER ART ARCHIVE NÃO TEM)
export async function findAlbumCover(artist: string, title: string): Promise<string | undefined> {
  const wantArtist = normalize(artist);
  const wantTitle = normalize(title);
  for (const q of [`artist:"${artist}" album:"${title}"`, `${artist} ${title}`]) {
    try {
      const data = await jsonp<{ data?: { title: string; cover_big: string; artist: { name: string } }[] }>(`${API}/search/album?q=${encodeURIComponent(q)}&limit=10`);
      const hits = (data.data ?? []).filter((a) => normalize(a.artist.name).includes(wantArtist));
      const hit = hits.find((a) => normalize(a.title) === wantTitle) ?? hits.find((a) => normalize(a.title).startsWith(wantTitle));
      if (hit && !hit.cover_big.includes("/album//")) return hit.cover_big;
    } catch {
      continue;
    }
  }
  return undefined;
}
