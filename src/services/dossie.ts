import { dropSimilar, lastName, listPt, onlyNew, sentences, yearFrom } from "../lib/text";
import { formatDate, normalize } from "../lib/utils";
import type { Artist, Member, MemberDossier, PersonFacts, PressItems, WikiPerson, WikiSection } from "../types";
import { isEnglish, toPortuguese } from "./translate";
import { getWikiSections, type WikiPage } from "./wiki";
import { searchMentions } from "./mentions";
import { CONTROVERSY_TITLE, CONTROVERSY_WORDS, DEPARTURE } from "../lib/words";

// BIOGRAFIA DA WIKIPEDIA: PÁGINA EM PORTUGUÊS + PÁGINA EM INGLÊS TRADUZIDA

const PT_TITLES: Record<string, string> = {
  "early life": "Infância e Juventude",
  "early years": "Infância e Juventude",
  childhood: "Infância",
  background: "Origens",
  biography: "Biografia",
  "life and career": "Vida e Carreira",
  "personal life": "Vida Pessoal",
  family: "Família",
  relationships: "Relacionamentos",
  career: "Carreira",
  "music career": "Carreira Musical",
  "musical career": "Carreira Musical",
  "solo career": "Carreira Solo",
  "later life": "Últimos Anos",
  "illness and death": "Doença e Morte",
  health: "Saúde",
  death: "Falecimento",
  legacy: "Legado",
  influences: "Influências",
  artistry: "Estilo Musical",
  controversies: "Polêmicas",
  controversy: "Polêmicas",
  "legal issues": "Problemas Legais",
  philanthropy: "Filantropia",
  "political views": "Posições Políticas",
};

const KINDS: [RegExp, string][] = [
  [/inf[aâ]ncia|juventude|adolesc|early|childhood|origens|background/i, "infancia"],
  [/pessoal|personal|fam[ií]lia|family|relacion|casamento/i, "pessoal"],
  [/morte|death|falecimento/i, "morte"],
  [/sa[uú]de|health|doen[cç]a|illness/i, "saude"],
  [/legado|legacy/i, "legado"],
  [/pol[eê]mic|controvers|legal|problemas/i, "polemica"],
  [/carreira|career|m[uú]sica|biograf/i, "carreira"],
];
const kindOf = (title: string) => KINDS.find(([re]) => re.test(title))?.[1];

async function toPtSection(sec: WikiSection): Promise<WikiSection> {
  const title = PT_TITLES[sec.title.toLowerCase()] ?? (await toPortuguese(sec.title)) ?? sec.title;
  const paragraphs = await Promise.all(sec.paragraphs.slice(0, 4).map((p) => toPortuguese(p)));
  return { title, paragraphs: paragraphs.filter((p): p is string => !!p) };
}

// SEÇÕES DAS DUAS PÁGINAS SEM REPETIR; O QUE SÓ EXISTE EM INGLÊS É TRADUZIDO E SÓ ENTRA SE NÃO CONTAR O QUE A PÁGINA EM PORTUGUÊS JÁ CONTA
export async function getBiography(pages: WikiPage[]): Promise<WikiSection[]> {
  const result: WikiSection[] = [];
  for (const { lang, title } of pages) {
    const sections = await getWikiSections(lang, title).catch(() => []);
    const have = new Set(result.map((r) => normalize(r.title)));
    const haveKinds = new Set(result.map((r) => kindOf(r.title)).filter(Boolean));
    const fresh = sections.filter((sec) => {
      const kind = kindOf(sec.title);
      return !have.has(normalize(PT_TITLES[sec.title.toLowerCase()] ?? sec.title)) && !(lang === "en" && kind && haveKinds.has(kind));
    });
    const room = Math.max(0, 9 - result.length);
    if (lang === "pt") {
      result.push(...fresh.slice(0, room));
      continue;
    }
    const known = result.flatMap((r) => r.paragraphs);
    const translated = await Promise.all(fresh.slice(0, Math.min(room, 6)).map(toPtSection));
    for (const sec of translated) {
      const paragraphs = onlyNew(sec.paragraphs, known);
      if (paragraphs.length > 0) result.push({ ...sec, paragraphs });
    }
  }
  return result.filter((r) => r.paragraphs.length > 0);
}

// FICHA DA PESSOA: JUNTA WIKIDATA, MUSICBRAINZ E O QUE O INTEGRANTE TOCOU NA BANDA

export interface PersonContext {
  name: string;
  band: string;
  member: Member;
  solo: boolean;
  person?: WikiPerson;
  facts?: PersonFacts;
  artist?: Artist;
  press?: PressItems;
  mentions?: string[];
}

export function profileOf({ person, artist, facts, member, band }: PersonContext) {
  const ended = artist?.ended;
  return {
    birth: person?.birth ?? (artist?.type === "Person" ? artist.begin : undefined),
    birthPlace: person?.birthPlace ?? (artist?.type === "Person" ? artist.beginArea : undefined),
    birthName: person?.birthName ?? artist?.aliases.find((a) => a.split(/\s+/).length > 1 && a !== member.name),
    death: person?.death ?? (artist?.type === "Person" && ended ? artist.end : undefined),
    deathPlace: facts?.deathPlace,
    deathCause: facts?.deathCause,
    otherBands: (artist?.memberOf ?? []).map((b) => b.name).filter((n) => normalize(n) !== normalize(member.name) && normalize(n) !== normalize(band)),
  };
}

const bandPhrase = ({ member, band, solo }: PersonContext) => {
  const periods = member.periods.join(", ");
  const instruments = member.instruments.join(", ");
  if (solo) return `Carreira solo${periods ? ` (${periods})` : ""}.`;
  return `${member.current ? "Integra" : "Integrou"} o ${band}${periods ? ` (${periods})` : ""}${instruments ? `, tocando ${instruments}` : ""}.`;
};

function factsBiography(ctx: PersonContext): string[] {
  const p = profileOf(ctx);
  const f = ctx.facts;
  const born = p.birth || p.birthPlace ? `Nasceu${p.birth ? ` em ${formatDate(p.birth)}` : ""}${p.birthPlace ? `, em ${p.birthPlace}` : ""}.` : "";
  const died = p.death ? `Morreu em ${formatDate(p.death)}${p.deathPlace ? `, em ${p.deathPlace}` : ""}${p.deathCause ? `, de ${p.deathCause}` : ""}.` : "";
  const jobs = (f?.occupations ?? []).filter((o) => !/^(m[uú]sic|musician)/i.test(o));
  return [
    [born, bandPhrase(ctx), p.otherBands.length ? `Também passou por ${listPt(p.otherBands.slice(0, 5))}.` : "", jobs.length ? `Atua também como ${listPt(jobs.slice(0, 4))}.` : ""]
      .filter(Boolean)
      .join(" "),
    f?.awards.length ? `Reconhecimentos: ${listPt(f.awards.slice(0, 4))}.` : "",
    died,
    ...(ctx.press?.biografia ?? []),
    ...(ctx.mentions ?? []).slice(0, 5),
  ].filter(Boolean);
}

const PERSONAL = /casou|casad|casamento|espos|marido|namorad|noiv|divorci|separou|separa[cç][aã]o|\bfilh[oa]s?\b|gr[aá]vid|vive em|mora em|reside|vi[uú]v/i;
const CHILDHOOD = /nasceu|nascid|cresceu|crescer|inf[aâ]ncia|crian[cç]a|criad[oa]|adolesc|juventude|aos \d+ anos|escola|col[eé]gio/i;

const allSentences = (sections: WikiSection[]) => sections.flatMap((s) => s.paragraphs.flatMap((p) => sentences(p, 30)));

function personalParagraphs(ctx: PersonContext, sections: WikiSection[]): string[] {
  const f = ctx.facts;
  const lines = [
    f?.spouses.length ? `Casou-se com ${listPt(f.spouses)}.` : "",
    f?.partners.length ? `Relacionou-se com ${listPt(f.partners)}.` : "",
    f?.children.length ? `Filhos: ${listPt(f.children)}.` : "",
    f?.parents.length ? `Pais: ${listPt(f.parents)}.` : "",
    f?.siblings.length ? `Irmãos: ${listPt(f.siblings)}.` : "",
    f?.residence.length ? `Já morou em ${listPt(f.residence)}.` : "",
    f?.education.length ? `Estudou em ${listPt(f.education)}.` : "",
  ].filter(Boolean);
  const fromWiki = [...allSentences(sections), ...(ctx.mentions ?? [])].filter((t) => PERSONAL.test(t));
  const own = [...lines, ...fromWiki.slice(0, 6)];
  return dropSimilar([...own, ...(own.length < 4 ? ctx.press?.pessoal ?? [] : [])], (t) => t).slice(0, 10);
}

// BIOGRAFIAS SÃO CRONOLÓGICAS: A INFÂNCIA SÃO AS PRIMEIRAS FRASES, ATÉ APARECER UM ANO EM QUE A PESSOA JÁ ERA ADULTA
function earlyLifeSentences(sections: WikiSection[], born?: number): string[] {
  const body = sections.find((s) => !/introdu/i.test(s.title)) ?? sections[0];
  const out: string[] = [];
  for (const text of (body?.paragraphs ?? []).flatMap((p) => sentences(p, 30))) {
    const years = [...text.matchAll(/\b(19\d\d|20[0-2]\d)\b/g)].map((m) => Number(m[1]));
    if (born && years.some((y) => y - born > 19)) break;
    out.push(text);
    if (out.length >= 5) break;
  }
  return out;
}

function childhoodParagraphs(ctx: PersonContext, sections: WikiSection[]): string[] {
  const f = ctx.facts;
  const p = profileOf(ctx);
  const lines = [
    p.birth || p.birthPlace ? `Nasceu${p.birth ? ` em ${formatDate(p.birth)}` : ""}${p.birthPlace ? `, em ${p.birthPlace}` : ""}.` : "",
    f?.parents.length ? `Pais: ${listPt(f.parents)}.` : "",
    f?.siblings.length ? `Irmãos: ${listPt(f.siblings)}.` : "",
    f?.education.length ? `Estudou em ${listPt(f.education)}.` : "",
  ].filter(Boolean);
  const early = sections.find((s) => /inf[aâ]ncia|juventude|origens|early/i.test(s.title));
  const introYear = yearFrom(sections[0]?.paragraphs.join(" ").slice(0, 300) ?? "");
  const born = p.birth ? Number(p.birth.slice(0, 4)) : introYear;
  const fromWiki = early
    ? early.paragraphs.flatMap((t) => sentences(t, 30))
    : sections.length > 1 && born
      ? earlyLifeSentences(sections, born)
      : [...allSentences(sections.slice(0, 2)), ...(ctx.mentions ?? [])].filter((t) => CHILDHOOD.test(t)).slice(0, 4);
  const own = [...lines, ...fromWiki.slice(0, 6)];
  return dropSimilar([...own, ...(own.length < 4 ? ctx.press?.infancia ?? [] : [])], (t) => t).slice(0, 10);
}

const RANK: [RegExp, number][] = [
  [/introdu/i, 0],
  [/inf[aâ]ncia|juventude|origens/i, 1],
  [/biografia|carreira|vida e carreira|hist[oó]ria|m[uú]sica/i, 2],
  [/pessoal|fam[ií]lia|relacionament/i, 3],
];

// GARANTE QUE TODA PESSOA TENHA "INFÂNCIA", "BIOGRAFIA" E "VIDA PESSOAL", USANDO WIKIDATA, MUSICBRAINZ E IMPRENSA QUANDO A WIKIPEDIA NÃO CHEGA
export function completeBiography(wiki: WikiSection[], ctx: PersonContext): WikiSection[] {
  const out = [...wiki];
  const has = (re: RegExp) => out.some((s) => re.test(s.title));

  if (!has(/inf[aâ]ncia|juventude|origens|early/i)) {
    const paragraphs = childhoodParagraphs(ctx, wiki);
    out.push({ title: "Infância e Juventude", paragraphs: paragraphs.length ? paragraphs : [`Pouco se sabe publicamente sobre a infância de ${ctx.name}.`] });
  }
  if (!has(/biografia|carreira|vida e carreira|hist[oó]ria/i)) out.push({ title: "Biografia", paragraphs: factsBiography(ctx) });
  if (!has(/pessoal|fam[ií]lia|relacionament/i)) {
    const paragraphs = personalParagraphs(ctx, wiki);
    out.push({ title: "Vida Pessoal", paragraphs: paragraphs.length ? paragraphs : [`Pouco se sabe publicamente sobre a vida pessoal de ${ctx.name}.`] });
  }

  const rank = (s: WikiSection) => RANK.find(([re]) => re.test(s.title))?.[1] ?? 4;
  return out.map((s, i) => ({ s, i })).sort((a, b) => rank(a.s) - rank(b.s) || a.i - b.i).map(({ s }) => s);
}

export function childhoodItems(ctx: PersonContext, sections: WikiSection[], dossier?: MemberDossier): string[] {
  const own = dossier?.infancia ?? [];
  const found = childhoodParagraphs(ctx, sections);
  const items = dropSimilar([...own, ...found], (t) => t).slice(0, 7);
  return items.length ? items : [`Pouco se sabe publicamente sobre a infância de ${ctx.name}.`];
}

export function curiosityItems(ctx: PersonContext, dossier?: MemberDossier): string[] {
  if (dossier?.curiosidades.length) return dossier.curiosidades;
  const p = profileOf(ctx);
  const f = ctx.facts;
  const names = [...(f?.nicknames ?? []), ...(ctx.artist?.aliases ?? []), p.birthName ?? ""].filter((n) => n && n !== ctx.name);
  const items = [
    names.length ? `Também aparece como ${listPt([...new Set(names)].slice(0, 4))}.` : "",
    p.otherBands.length ? `Já tocou em ${listPt(p.otherBands.slice(0, 5))}.` : "",
    f?.instruments.length && !ctx.member.instruments.length ? `Instrumentos: ${listPt(f.instruments.slice(0, 4))}.` : "",
    f?.awards.length ? `Recebeu ${listPt(f.awards.slice(0, 3))}.` : "",
    ctx.member.periods.length > 1 ? `Voltou ao ${ctx.band} mais de uma vez: ${ctx.member.periods.join(", ")}.` : "",
    f?.residence.length ? `Já morou em ${listPt(f.residence.slice(0, 3))}.` : "",
  ].filter(Boolean);
  return items.length ? items : [`${bandPhrase(ctx)}`];
}

// POLÊMICAS: SEÇÕES DE POLÊMICA DA WIKIPEDIA, BUSCA NA WIKIPEDIA INTEIRA E IMPRENSA

const ABOUT_HIM = /^(ele|ela|he|she)\b/i;

interface Claim {
  text: string;
  lang: string;
}

export async function getControversies(opts: { name: string; bandName: string; pages: WikiPage[]; bands: WikiPage[]; max?: number }): Promise<string[]> {
  const { name, bandName, pages, bands, max = 10 } = opts;
  const surname = lastName(name);
  const mentionsHim = (t: string) => normalize(t).includes(surname);
  const tag = (list: string[], lang: string): Claim[] => list.map((text) => ({ text, lang }));
  const strong: Claim[] = [];
  const weak: Claim[] = [];

  for (const { lang, title } of pages) {
    for (const sec of await getWikiSections(lang, title).catch(() => [])) {
      const dedicated = CONTROVERSY_TITLE.test(sec.title);
      for (const para of sec.paragraphs) {
        const list = sentences(para);
        if (dedicated) strong.push(...tag(list.filter((t) => CONTROVERSY_WORDS.test(t) || DEPARTURE.test(t) || list.length <= 3), lang));
        else weak.push(...tag(list.filter((t) => CONTROVERSY_WORDS.test(t) && (mentionsHim(t) || ABOUT_HIM.test(t))), lang));
      }
    }
  }

  // PÁGINAS DA BANDA: SÓ FRASES QUE CITAM O INTEGRANTE, NUNCA AS POLÊMICAS DA BANDA INTEIRA
  const aboutHim: Claim[] = [];
  for (const { lang, title } of bands) {
    for (const sec of await getWikiSections(lang, title).catch(() => [])) {
      for (const text of sec.paragraphs.flatMap((para) => sentences(para))) {
        if (mentionsHim(text) && (CONTROVERSY_WORDS.test(text) || DEPARTURE.test(text))) aboutHim.push({ text, lang });
      }
    }
  }

  const mentions = (await Promise.all((["pt", "en"] as const).map(async (lang) => tag(await searchMentions(lang, name, bandName), lang)))).flat();

  const candidates = dropSimilar([...strong, ...weak, ...aboutHim, ...mentions], (c) => c.text)
    .filter(({ text }) => /^[A-ZÀ-Ú"“]/.test(text) && !/^["“].*["”]\.?$/.test(text))
    .slice(0, max + 6);

  const final = await Promise.all(candidates.map(({ text, lang }) => (lang === "en" || isEnglish(text) ? toPortuguese(text) : Promise.resolve(text))));
  return dropSimilar(final.filter((t): t is string => !!t), (t) => t).slice(0, max);
}


export async function getIntroPt(page: WikiPage): Promise<string[]> {
  const sections = await getWikiSections(page.lang, page.title, true).catch(() => []);
  const paragraphs = (sections[0]?.paragraphs ?? []).slice(0, 5);
  if (page.lang === "pt") return paragraphs;
  return (await Promise.all(paragraphs.map((p) => toPortuguese(p)))).filter((p): p is string => !!p);
}

export async function getBandMentions(name: string, bands: WikiPage[]): Promise<string[]> {
  const full = normalize(name);
  const claims: Claim[] = [];
  for (const { lang, title } of bands) {
    for (const sec of await getWikiSections(lang, title).catch(() => [])) {
      for (const para of sec.paragraphs) {
        for (const text of sentences(para, 30)) if (normalize(text).includes(full)) claims.push({ text, lang });
      }
    }
  }
  const picked = dropSimilar(claims, (c) => c.text).slice(0, 8);
  const done = await Promise.all(picked.map(({ text, lang }) => (lang === "en" || isEnglish(text) ? toPortuguese(text) : Promise.resolve(text))));
  return done.filter((t): t is string => !!t);
}
