import { throttledJson as getJson } from "../lib/http";
import { lastName, plain, sentences, yearFrom } from "../lib/text";
import { normalize } from "../lib/utils";
import type { Member, WikiImage, WikiSection } from "../types";

export type Lang = "pt" | "en";
export interface WikiPage {
  lang: Lang;
  title: string;
  image?: string;
}

export function wikiApi(lang: string, params: Record<string, string>) {
  const query = new URLSearchParams({ format: "json", formatversion: "2", origin: "*", ...params });
  return `https://${lang}.wikipedia.org/w/api.php?${query}`;
}

export async function pageImages(lang: string, titles: string[]): Promise<Record<string, string>> {
  if (titles.length === 0) return {};
  const data = await getJson<{ query?: { pages: { title: string; thumbnail?: { source: string } }[]; normalized?: { from: string; to: string }[] } }>(
    wikiApi(lang, { action: "query", prop: "pageimages", piprop: "thumbnail", pithumbsize: "600", redirects: "1", titles: titles.join("|") }),
  );
  const found: Record<string, string> = {};
  for (const p of data.query?.pages ?? []) if (p.thumbnail) found[p.title] = p.thumbnail.source;
  for (const n of data.query?.normalized ?? []) if (found[n.to]) found[n.from] = found[n.to];
  return found;
}

export function mentionsBand(text: string, band: string): boolean {
  const clean = band.replace(/^The\s+/i, "").trim();
  if (!clean) return true;
  return new RegExp(`(^|[^\\p{L}])${clean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\p{L}]|$)`, "u").test(text);
}

// PROCURA A PÁGINA DA WIKIPEDIA DE UMA PESSOA PELO NOME (OU APELIDOS); SE "band" VEM, A INTRODUÇÃO TEM QUE CITAR A BANDA
export async function findWikiPage(names: string | string[], context: string, langs: Lang[] = ["pt", "en"], band?: string): Promise<WikiPage | undefined> {
  for (const name of [names].flat()) {
    const target = normalize(name);
    for (const lang of langs) {
      try {
        const data = await getJson<{ query?: { pages: { title: string; index: number; extract?: string; thumbnail?: { source: string } }[] } }>(
          wikiApi(lang, {
            action: "query",
            generator: "search",
            gsrsearch: `"${name}" ${context}`,
            gsrlimit: "5",
            prop: "pageimages|extracts",
            piprop: "thumbnail",
            pithumbsize: "600",
            exintro: "1",
            explaintext: "1",
            exlimit: "5",
          }),
        );
        const hit = (data.query?.pages ?? [])
          .sort((a, b) => a.index - b.index)
          .find((p) => normalize(p.title).startsWith(target) && (!band || mentionsBand(p.extract ?? "", band)));
        if (hit) return { lang, title: hit.title, image: hit.thumbnail?.source };
      } catch {
        continue;
      }
    }
  }
  return undefined;
}

const SKIP_SECTIONS = /discografia|discography|refer[eê]ncias|references|liga[cç][oõ]es externas|external links|ver tamb[eé]m|see also|notas|notes|bibliografia|bibliography|filmografia|filmography|leitura adicional|further reading|equipamento|equipment|pr[eê]mios?|awards?|turn[eê]s|tours|videografia/i;

const WANTED_SUBSECTIONS = /vida pessoal|personal life|inf[aâ]ncia|juventude|early life|early years|childhood|fam[ií]lia|family|relacionament|relationship|casamento|marriage|sa[uú]de|health|morte|death|legado|legacy|pol[eê]mic|controv|carreira solo|solo career|problemas legais|legal|v[ií]cio|addiction|origens|background/i;

// TEXTO DA PÁGINA JÁ DIVIDIDO EM SEÇÕES, COM TODAS AS LINHAS (INCLUSIVE AS CURTAS, COMO LISTAS DE INTEGRANTES)
// TÍTULO COM "==" É SEÇÃO. SUBTÍTULO COM "===" SÓ VIRA SEÇÃO PRÓPRIA SE FOR DE ASSUNTO PESSOAL (WANTED_SUBSECTIONS); SENÃO O TEXTO VAI PRA SEÇÃO PAI
async function getWikiRaw(lang: string, title: string, introOnly = false): Promise<WikiSection[]> {
  const params: Record<string, string> = { action: "query", prop: "extracts", explaintext: "1", exsectionformat: "wiki", redirects: "1", titles: title };
  if (introOnly) params.exintro = "1";
  const data = await getJson<{ query: { pages: { extract?: string }[] } }>(wikiApi(lang, params));
  const text = data.query.pages[0]?.extract ?? "";

  const sections: WikiSection[] = [{ title: "Introdução", paragraphs: [] }];
  let parent = sections[0];
  let target = sections[0];
  for (const line of text.split("\n")) {
    const heading = line.match(/^(=+)\s*(.+?)\s*\1$/);
    if (heading) {
      const isTop = heading[1].length === 2;
      if (isTop || WANTED_SUBSECTIONS.test(heading[2])) {
        const section: WikiSection = { title: heading[2], paragraphs: [] };
        sections.push(section);
        target = section;
        if (isTop) parent = section;
      } else {
        target = parent;
      }
      continue;
    }
    if (line.trim()) target.paragraphs.push(line.trim());
  }
  return sections;
}

export async function getWikiSections(lang: string, title: string, introOnly = false): Promise<WikiSection[]> {
  const sections = await getWikiRaw(lang, title, introOnly);
  return sections
    .map((s) => ({ ...s, paragraphs: s.paragraphs.filter((p) => p.length > 40) }))
    .filter((s) => s.paragraphs.length > 0 && !SKIP_SECTIONS.test(s.title));
}

// INTEGRANTES CITADOS NA PÁGINA DA BANDA: EM LISTA ("Nome – vocal (2017–presente)") OU NA INTRODUÇÃO ("composta por Nome (guitarra) e Nome (baixo)")
const PERSON_NAME = /^[A-ZÀ-Ú][\p{L}'’."\- ]{1,50}$/u;
const INTRO_MEMBERS = /compost|formad|integrad|constitu|formed by|composed of|consists of|comprises|line-?up|members/i;

function memberFrom(name: string, details: string): Member | undefined {
  const clean = name.replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
  if (!PERSON_NAME.test(clean) || clean.split(" ").length > 5) return undefined;
  const years = details.match(/\(([^)]*\d{4}[^)]*)\)/)?.[1];
  const [from, to] = years?.match(/\d{4}|presente|present|atualidade/gi) ?? [];
  return {
    id: `wp:${normalize(clean)}`,
    name: clean,
    instruments: details.replace(/\(.*?\)/g, "").split(/,|;| e | and /).map((i) => i.trim()).filter((i) => i && i.length < 30).slice(0, 4),
    periods: from ? [`${from}–${to && /^\d{4}$/.test(to) ? to : "hoje"}`] : [],
    current: !years || /presente|present|atualidade/i.test(years),
    original: false,
  };
}

export async function getWikiMembers(lang: string, title: string): Promise<Member[]> {
  const sections = await getWikiRaw(lang, title).catch(() => []);
  const found: Member[] = [];

  for (const sec of sections.filter((s) => /integrantes|membros|forma[cç][aã]o|members|line-?up|personnel/i.test(s.title))) {
    for (const line of sec.paragraphs) {
      const m = line.match(/^(.+?)\s+[–—-]\s+(.+)$/);
      const member = m && memberFrom(m[1], m[2]);
      if (member) found.push(member);
    }
  }

  if (found.length === 0) {
    for (const text of (sections[0]?.paragraphs ?? []).flatMap((p) => sentences(p, 30)).filter((t) => INTRO_MEMBERS.test(t))) {
      for (const m of text.matchAll(/([A-ZÀ-Ú][\p{L}'’."\-]*(?:\s+(?:da|de|do|dos|das|van|von|[A-ZÀ-Ú"][\p{L}'’."\-]*)){0,4})\s*\(([^)]{2,50})\)/gu)) {
        const member = memberFrom(m[1], m[2]);
        if (member && member.instruments.length > 0) found.push(member);
      }
    }
  }
  return found.filter((m, i, all) => all.findIndex((x) => x.id === m.id) === i).slice(0, 15);
}

const NOT_PHOTO = /\.svg$|\.pdf$|\.djvu$|logo|signature|assinatura|flag|bandeira|icon|ícone|symbol|\bmap\b|cover|capa|poster/i;
const NOT_PERSON = /\b(house|home|hospital|memorial|park|street|graffiti|grave|tomb|cemetery|statue|museum|mopop|emp|exhibit|smashed|cafe|amplifier|bridge|mural|sign|doll|plaque|ticket|tattoo|casa|túmulo|estátua|placa)\b/i;

export function fileName(file: string): string {
  return file.replace(/^(File|Arquivo|Ficheiro):/i, "").replace(/\.\w+$/, "").replace(/_/g, " ").replace(/\s*\(\d{6,}\)/, "");
}

export function isPortrait(img: WikiImage): boolean {
  return !NOT_PERSON.test(`${img.caption ?? ""} ${img.file ?? ""}`);
}

export async function getWikiImages(lang: string, title: string): Promise<WikiImage[]> {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title.replace(/ /g, "_"))}`;
  const data = await getJson<{ items: { type: string; title: string; caption?: { text: string }; srcset?: { src: string }[] }[] }>(url);
  return data.items
    .filter((i) => i.type === "image" && i.srcset?.length && !NOT_PHOTO.test(i.title))
    .map((i): WikiImage => {
      const src = i.srcset![i.srcset!.length - 1].src;
      const file = fileName(i.title);
      const caption = i.caption?.text;
      return { src: src.startsWith("//") ? `https:${src}` : src, caption, file, year: yearFrom(`${caption ?? ""} ${file}`) };
    })
    .slice(0, 16);
}

// FOTOS DO COMMONS: BUSCA NO TEXTO DOS ARQUIVOS, CATEGORIA DA PESSOA E SUBCATEGORIAS DE ÉPOCA, USANDO A DATA EM QUE A FOTO FOI TIRADA
type CommonsPage = { title: string; index?: number; imageinfo?: { thumburl?: string; extmetadata?: Record<string, { value?: string }> }[] };

async function commons<T>(params: Record<string, string>): Promise<T | undefined> {
  const query = new URLSearchParams({ action: "query", format: "json", origin: "*", ...params });
  return getJson<T>(`https://commons.wikimedia.org/w/api.php?${query}`).catch(() => undefined);
}

const FILE_INFO = { prop: "imageinfo", iiprop: "url|extmetadata", iiextmetadatafilter: "DateTimeOriginal|DateTime|ImageDescription", iiurlwidth: "600" };

async function commonsFiles(extra: Record<string, string>): Promise<CommonsPage[]> {
  const data = await commons<{ query?: { pages: Record<string, CommonsPage> } }>({ ...FILE_INFO, ...extra });
  return Object.values(data?.query?.pages ?? {}).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
}

async function periodCategories(category: string): Promise<string[]> {
  const data = await commons<{ query?: { categorymembers: { title: string }[] } }>({ list: "categorymembers", cmtitle: `Category:${category}`, cmtype: "subcat", cmlimit: "60" });
  return (data?.query?.categorymembers ?? []).map((c) => c.title).filter((t) => /\d{4}|child|young|youth|early|teen|school|[0-9]0s/i.test(t)).slice(0, 4);
}

export async function getCommonsPhotos(name: string, band: string, category?: string): Promise<WikiImage[]> {
  const single = name.trim().split(/\s+/).length < 2;
  const who = single ? `"${name}" "${band}"` : `"${name}"`;
  const cat = category ?? (single ? undefined : name);

  const subcats = cat ? await periodCategories(cat) : [];
  const searches = await Promise.all([
    commonsFiles({ generator: "search", gsrnamespace: "6", gsrlimit: "40", gsrsearch: `${who} filetype:bitmap` }),
    commonsFiles({ generator: "search", gsrnamespace: "6", gsrlimit: "40", gsrsearch: `${who} (child OR childhood OR boy OR teenager OR school OR kid OR young OR 1960 OR 1970 OR 1975 OR 1980 OR 1985 OR 1990) filetype:bitmap` }),
  ]);
  const categories = await Promise.all([
    ...(cat ? [commonsFiles({ generator: "categorymembers", gcmtitle: `Category:${cat}`, gcmtype: "file", gcmlimit: "60" })] : []),
    ...subcats.map((sub) => commonsFiles({ generator: "categorymembers", gcmtitle: sub, gcmtype: "file", gcmlimit: "30" })),
  ]);

  // ARQUIVOS DA CATEGORIA DA PESSOA JÁ SÃO DELA; OS DA BUSCA PRECISAM CITAR O SOBRENOME
  const surname = lastName(name);
  const candidates = [
    ...searches.flat().map((page) => ({ page, mine: false })),
    ...categories.flat().map((page) => ({ page, mine: true })),
  ];
  const seen = new Set<string>();
  return candidates
    .filter(({ page }) => page.imageinfo?.[0]?.thumburl && !NOT_PHOTO.test(page.title))
    .map(({ page: p, mine }) => {
      const meta = p.imageinfo![0].extmetadata ?? {};
      const file = fileName(p.title);
      const caption = plain(meta.ImageDescription?.value ?? "").slice(0, 160) || undefined;
      const when = meta.DateTimeOriginal?.value ?? meta.DateTime?.value ?? "";
      return { mine, img: { src: p.imageinfo![0].thumburl!, file, caption, year: yearFrom(when) ?? yearFrom(file), mine } as WikiImage };
    })
    .filter(({ mine, img }) => isPortrait(img) && (mine || normalize(`${img.file} ${img.caption ?? ""}`).includes(surname)))
    .map(({ img }) => img)
    .filter((img) => !seen.has(img.src) && seen.add(img.src))
    .slice(0, 50);
}
