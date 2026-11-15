import { useEffect, useState } from "react";
import { findDeezerArtist } from "../servicos/deezer";
import { getWikiPeople } from "../servicos/wikidata";
import { isMbid } from "../utilitarios/utilidades";

// FOTOS DE BANDAS: DEEZER E, SE FALTAR, WIKIDATA
export function useFotosBandas(artists: (string | { id: string; name: string })[]) {
  const [pictures, setPictures] = useState<Record<string, string | null>>({});
  const list = artists.map((a) => (typeof a === "string" ? { id: a, name: a } : a));
  const key = list.map((a) => a.id).join("|");

  useEffect(() => {
    let alive = true;
    const queue = [...list];
    const missing: string[] = [];

    const worker = async () => {
      while (queue.length && alive) {
        const artist = queue.shift()!;
        const hit = await findDeezerArtist(artist.name);
        if (!hit && isMbid(artist.id)) missing.push(artist.id);
        if (alive) setPictures((p) => ({ ...p, [artist.id]: hit?.picture ?? null }));
      }
    };

    Promise.all([worker(), worker(), worker(), worker()]).then(async () => {
      if (!alive || missing.length === 0) return;
      const people = await getWikiPeople(missing);
      if (!alive) return;
      setPictures((p) => {
        const next = { ...p };
        for (const id of missing) if (people[id]?.image) next[id] = people[id].image!;
        return next;
      });
    });

    return () => {
      alive = false;
    };
  }, [key]);

  return pictures;
}
