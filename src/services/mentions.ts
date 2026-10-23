import { throttledJson as getJson } from "../lib/http";
import { lastName, plain, sentences } from "../lib/text";
import { normalize } from "../lib/utils";
import { CONTROVERSY_WORDS } from "../lib/words";
import { wikiApi, type Lang } from "./wiki";

// BUSCA DE TEXTO LIVRE EM TODOS OS ARTIGOS DA WIKIPEDIA QUE CITAM A PESSOA JUNTO COM PALAVRAS DE POLÊMICA
export async function searchMentions(lang: Lang, name: string, band: string): Promise<string[]> {
  const terms =
    lang === "pt"
      ? "preso OR polêmica OR escândalo OR processado OR overdose OR acusado OR expulso OR agressão OR censurado"
      : "arrested OR controversy OR scandal OR lawsuit OR overdose OR accused OR assault OR banned OR fired";
  try {
    const data = await getJson<{ query?: { search: { snippet: string }[] } }>(
      wikiApi(lang, { action: "query", list: "search", srsearch: `"${name}" "${band}" (${terms})`, srlimit: "10", srprop: "snippet" }),
    );
    const surname = lastName(name);
    return (data.query?.search ?? [])
      .flatMap((r) => sentences(plain(r.snippet), 35))
      .filter((t) => normalize(t).includes(surname) && CONTROVERSY_WORDS.test(t));
  } catch {
    return [];
  }
}
