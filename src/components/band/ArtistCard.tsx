import { Link } from "react-router";
import { tilt, year } from "../../lib/utils";
import type { ArtistSummary } from "../../types";
import XeroxImage from "../ui/XeroxImage";

const TYPES: Record<string, string> = { Group: "Banda", Person: "Artista", Orchestra: "Orquestra", Choir: "Coral" };

export default function ArtistCard({ artist, picture }: { artist: ArtistSummary; picture?: string | null }) {
  const from = year(artist.begin);
  const to = artist.ended ? year(artist.end) ?? "?" : "hoje";

  return (
    <Link
      to={`/banda/${artist.id}`}
      className="group block bg-bone p-3 text-ink shadow-[6px_6px_0_#000] transition-all duration-300 hover:-translate-y-1 hover:rotate-0 hover:shadow-[10px_10px_0_#000]"
      style={{ rotate: `${tilt(artist.id, 2.5)}deg` }}
    >
      <div className="relative overflow-hidden">
        <XeroxImage src={picture ?? undefined} alt={artist.name} className="aspect-square w-full transition-transform duration-500 group-hover:scale-110" />
        {artist.type && (
          <span className="absolute left-2 top-2 bg-ink px-2 py-0.5 font-display text-sm uppercase tracking-wide text-bone">
            {TYPES[artist.type] ?? artist.type}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-2xl uppercase leading-tight">{artist.name}</h3>
      <p className="font-type text-sm text-ash">
        {[artist.country, from && `${from}–${to}`].filter(Boolean).join(" · ") || "origem desconhecida"}
      </p>
      {artist.disambiguation && <p className="mt-1 line-clamp-1 font-type text-xs text-ash">({artist.disambiguation})</p>}
      <div className="mt-2 flex flex-wrap gap-1">
        {artist.tags.slice(0, 3).map((t) => (
          <span key={t} className="border border-ink px-1.5 font-type text-xs">
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
