import { Link } from "react-router";
import { useUsuario } from "../../contexto/ContextoUsuario";
import { usePlayer } from "../../contexto/ContextoPlayer";
import { year, youtubeSearch } from "../../utilitarios/utilidades";
import type { Artist, PlayableTrack } from "../../tipos";
import Icone from "../interface/Icone";
import Adesivo from "../interface/Adesivo";
import FotoXerox from "../interface/FotoXerox";

function linkLabel(url: string, type: string): string {
  let host = url;
  try {
    host = new URL(url).hostname.replace("www.", "");
  } catch {
    return "Link";
  }
  const known: Record<string, string> = {
    "bandcamp.com": "Bandcamp",
    "instagram.com": "Instagram",
    "facebook.com": "Facebook",
    "twitter.com": "X / Twitter",
    "x.com": "X / Twitter",
    "youtube.com": "YouTube",
    "open.spotify.com": "Spotify",
    "soundcloud.com": "SoundCloud",
    "deezer.com": "Deezer",
    "last.fm": "Last.fm",
    "tiktok.com": "TikTok",
  };
  const match = Object.keys(known).find((k) => host.endsWith(k));
  if (match) return known[match];
  return type === "official homepage" ? "Site oficial" : host;
}

interface Props {
  artist: Artist;
  picture?: string;
  tracks: PlayableTrack[];
  hasDossier: boolean;
}

// TOPO DA BANDA: FOTO, NOME, TAGS, BOTÕES E LINKS
export default function CabecalhoBanda({ artist, picture, tracks, hasDossier }: Props) {
  const { user, toggleFavorite, isFavorite } = useUsuario();
  const { play } = usePlayer();
  const fav = isFavorite(artist.id);
  const from = year(artist.begin);
  const to = artist.ended ? year(artist.end) ?? "?" : "hoje";
  const kind = artist.type === "Person" ? "Artista" : "Banda";
  const origin = artist.beginArea ?? artist.area;

  return (
    <section className="relative overflow-hidden border-b-[3px] border-bone">
      {picture && <img src={picture} alt="" className="xerox-hard absolute inset-0 h-full w-full scale-110 object-cover opacity-[0.12]" />}
      <div className="halftone absolute inset-0" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:px-8 lg:grid-cols-[minmax(0,400px)_1fr]">
        <div className="relative mx-auto w-full max-w-sm">
          <div className="photo-sticker relative rotate-[-3deg]">
            <FotoXerox src={picture} alt={artist.name} className="aspect-square w-full" />
            <p className="mt-2 text-center font-marker text-2xl text-ink">{artist.name}</p>
          </div>
          {hasDossier && (
            <span className="absolute -right-4 -top-6 rotate-12 border-4 border-blood bg-ink px-3 py-1 font-display text-xl uppercase tracking-widest text-blood">
              Tem dossiê
            </span>
          )}
          <Adesivo id={artist.type === "Person" ? "pick" : "bolt"} className="absolute -bottom-8 -left-6 w-20 animate-float" />
        </div>

        <div>
          <p className="font-type text-dust">
            {[kind, origin, artist.country, from && `${from}–${to}`].filter(Boolean).join(" · ")}
          </p>
          <h1 className="rough my-3 break-words font-display text-6xl uppercase leading-[0.85] md:text-8xl xl:text-9xl">{artist.name}</h1>
          {artist.disambiguation && <p className="font-type text-fog">({artist.disambiguation})</p>}

          <div className="mt-5 flex flex-wrap gap-2">
            {artist.tags.map((t, i) => (
              <Link
                key={t}
                to={`/buscar?q=${encodeURIComponent(t)}`}
                className={`px-3 py-1 font-marker text-sm transition-transform hover:-translate-y-0.5 ${i % 3 === 0 ? "bg-bone text-ink" : "border-2 border-bone"}`}
                style={{ rotate: `${(i % 4) * 2 - 3}deg` }}
              >
                {t}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {tracks.length > 0 && (
              <button onClick={() => play(tracks[0], tracks)} className="btn-bone">
                <Icone name="play" /> Ouvir agora
              </button>
            )}
            <a href={youtubeSearch(artist.name)} target="_blank" rel="noreferrer" className="btn-punk">
              <Icone name="youtube" /> YouTube
            </a>
            {user ? (
              <button
                onClick={() => toggleFavorite({ id: artist.id, name: artist.name, image: picture })}
                className={`btn-punk ${fav ? "bg-bone text-ink" : ""}`}
                aria-pressed={fav}
              >
                <Icone name="heart" /> {fav ? "Favoritada" : "Favoritar"}
              </button>
            ) : (
              <Link to="/entrar" className="btn-punk">
                <Icone name="heart" /> Entrar pra favoritar
              </Link>
            )}
          </div>

          {artist.links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-type text-sm">
              {artist.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-fog underline-offset-4 hover:text-bone hover:underline">
                  {linkLabel(l.url, l.type)} <Icone name="external" className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
