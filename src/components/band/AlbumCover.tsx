import { useRef, useState } from "react";
import { findAlbumCover } from "../../services/deezer";
import type { Album } from "../../types";
import XeroxImage from "../ui/XeroxImage";

// CAPA DO ÁLBUM: COVER ART ARCHIVE E, SE NÃO TIVER, A CAPA DO DEEZER
export default function AlbumCover({ album, artist, className }: { album: Album; artist: string; className: string }) {
  const [src, setSrc] = useState<string | undefined>(album.cover);
  const tried = useRef(false);

  const fallback = () => {
    if (tried.current) return;
    tried.current = true;
    findAlbumCover(artist, album.title).then((url) => url && setSrc(url));
  };

  return <XeroxImage src={src} alt={album.title} className={className} onFail={fallback} />;
}
