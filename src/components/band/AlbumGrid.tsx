import { tilt } from "../../lib/utils";
import type { Album } from "../../types";
import AlbumCover from "./AlbumCover";

export default function AlbumGrid({ albums, artist, onOpen }: { albums: Album[]; artist: string; onOpen: (album: Album) => void }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
      {albums.map((a) => (
        <button key={a.id} onClick={() => onOpen(a)} className="group text-left" style={{ rotate: `${tilt(a.id, 2)}deg` }}>
          <div className="relative">
            <div className="absolute inset-[4%] rounded-full bg-[repeating-radial-gradient(circle,#0a0a0a_0_2px,#1d1d1d_2px_4px)] transition-transform duration-500 group-hover:translate-x-[38%] group-hover:rotate-180">
              <div className="absolute inset-[34%] rounded-full bg-dust" />
            </div>
            <AlbumCover album={a} artist={artist} className="relative aspect-square w-full border-[3px] border-bone shadow-[6px_6px_0_#000]" />
          </div>
          <p className="mt-3 line-clamp-2 font-display text-lg uppercase leading-tight">{a.title}</p>
          <p className="font-type text-sm text-fog">
            {a.year ?? "s/d"} · {a.type}
          </p>
        </button>
      ))}
    </div>
  );
}
