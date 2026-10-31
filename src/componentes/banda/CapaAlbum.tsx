import { useRef, useState } from "react";
import { findAlbumCover } from "../../servicos/deezer";
import type { Album } from "../../tipos";
import FotoXerox from "../interface/FotoXerox";

// CAPA DO ÁLBUM: COVER ART ARCHIVE E, SE NÃO TIVER, A CAPA DO DEEZER
export default function CapaAlbum({ album, artist, className }: { album: Album; artist: string; className: string }) {
  const [src, setSrc] = useState<string | undefined>(album.cover);
  const tried = useRef(false);

  const fallback = () => {
    if (tried.current) return;
    tried.current = true;
    findAlbumCover(artist, album.title).then((url) => url && setSrc(url));
  };

  return <FotoXerox src={src} alt={album.title} className={className} onFail={fallback} />;
}
