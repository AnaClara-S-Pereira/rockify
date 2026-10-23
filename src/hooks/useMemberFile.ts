import { dropSimilar, yearFrom } from "../lib/text";
import { ageAt, formatDate, isMbid, normalize } from "../lib/utils";
import { childhoodItems, completeBiography, curiosityItems, getBandMentions, getBiography, getControversies, profileOf, type PersonContext } from "../services/dossie";
import { getArtist } from "../services/musicbrainz";
import { getPress, getSearchPhotos } from "../services/press";
import { findWikiPage, getCommonsPhotos, getWikiImages, isPortrait, type WikiPage } from "../services/wiki";
import { getPersonFacts } from "../services/wikidata";
import type { Member, MemberDossier, WikiImage, WikiPerson } from "../types";
import { useAsync } from "./useAsync";

interface Args {
  member: Member;
  person?: WikiPerson;
  dossier?: MemberDossier;
  band: string;
  solo: boolean;
  bandPages: WikiPage[];
  bandSize: number;
  waiting: boolean;
}

const CHILD_WORDS = /child|as a boy|as a girl|infância|criança|menino|menina|aged? \d|aos \d/i;
const BAND_SHOT = /band|banda|group|live|concert|tour|festival|album|reunion/i;
const describe = (img: WikiImage) => `${img.caption ?? ""} ${img.file ?? ""}`;

// TUDO QUE O DOSSIÊ MOSTRA SOBRE UM INTEGRANTE, JUNTANDO WIKIPEDIA, WIKIDATA, MUSICBRAINZ, COMMONS E IMPRENSA
export function useMemberFile({ member, person, dossier, band, solo, bandPages, bandSize, waiting }: Args) {
  const artistQ = useAsync(() => (isMbid(member.id) ? getArtist(member.id).catch(() => undefined) : Promise.resolve(undefined)), [member.id]);
  const factsQ = useAsync(() => (waiting ? Promise.resolve(undefined) : getPersonFacts(member.id).catch(() => undefined)), [waiting, member.id]);
  const pressQ = useAsync(() => getPress(member.name, band, bandSize <= 2), [member.id, bandSize]);
  const searchKidQ = useAsync(() => getSearchPhotos(member.name, band, "crianca"), [member.id]);

  // PÁGINAS DA WIKIPEDIA: AS DO WIKIDATA; SEM ELAS, PROCURA PELO NOME (E PELOS APELIDOS DO MUSICBRAINZ) CONFERINDO SE CITAM A BANDA
  const pagesQ = useAsync(async (): Promise<WikiPage[]> => {
    if (waiting) return [];
    const titles = person?.titles;
    if (titles?.pt || titles?.en) {
      return [titles.pt && { lang: "pt" as const, title: titles.pt }, titles.en && { lang: "en" as const, title: titles.en }].filter((p): p is WikiPage => !!p);
    }
    const search = (names: string[]) =>
      Promise.all([findWikiPage(names, band, ["pt"], band), findWikiPage(names, band, ["en"], band)]).then((r) => r.filter((p): p is WikiPage => !!p));
    const byName = await search([member.name]);
    if (byName.length) return byName;
    const aliases = isMbid(member.id) ? ((await getArtist(member.id).catch(() => undefined))?.aliases ?? []) : [];
    return aliases.length ? search(aliases) : [];
  }, [waiting, member.id, person?.titles?.pt, person?.titles?.en]);
  const pages = pagesQ.data ?? [];
  const pageKey = pages.map((p) => `${p.lang}:${p.title}`).join("|");

  const wikiQ = useAsync(() => getBiography(pages), [pageKey]);
  const imagesQ = useAsync(async () => (await Promise.all(pages.map((p) => getWikiImages(p.lang, p.title).catch(() => [] as WikiImage[])))).flat(), [pageKey]);
  const commonsQ = useAsync(() => (waiting ? Promise.resolve([] as WikiImage[]) : getCommonsPhotos(member.name, band, person?.commons)), [waiting, member.id, person?.commons]);
  const wikiDirtQ = useAsync(
    () => (pagesQ.loading ? Promise.resolve([] as string[]) : getControversies({ name: member.name, bandName: band, pages, bands: bandPages })),
    [pageKey, pagesQ.loading, bandPages.map((p) => p.title).join("|")],
  );

  const mentionsQ = useAsync(
    () => (pagesQ.loading || waiting || pages.length > 0 || solo ? Promise.resolve([] as string[]) : getBandMentions(member.name, bandPages)),
    [pagesQ.loading, waiting, pageKey, bandPages.map((p) => p.title).join("|")],
  );

  const ctx: PersonContext = { name: member.name, band, member, solo, person, facts: factsQ.data, artist: artistQ.data, press: pressQ.data, mentions: mentionsQ.data };
  const profile = profileOf(ctx);
  const wikiLoading = waiting || pagesQ.loading || wikiQ.loading || mentionsQ.loading;

  const factImages = (factsQ.data?.images ?? []).map((i): WikiImage => ({ src: i.src, file: i.file, year: i.year, mine: true }));
  const seen = new Set<string>();
  const gallery = [
    ...(dossier?.fotos ?? []).map((f): WikiImage => ({ src: f.src, caption: f.legenda, mine: true })),
    ...factImages,
    ...(imagesQ.data ?? []),
    ...(commonsQ.data ?? []),
  ].filter((img) => {
    const key = normalize(img.file ?? img.src);
    return !seen.has(key) && seen.add(key);
  });

  const introYear = yearFrom((wikiQ.data?.[0]?.paragraphs[0] ?? "").slice(0, 250));
  const born = profile.birth ? Number(profile.birth.slice(0, 4)) : introYear;
  const surname = normalize(member.name.trim().split(/\s+/).pop() ?? member.name);
  const ageInPhoto = (img: WikiImage) => (born && img.year ? img.year - born : undefined);

  // A FOTO É DA PESSOA SE VEIO DO ITEM/CATEGORIA DELA OU SE O NOME DO ARQUIVO TEM O SOBRENOME OU A LEGENDA COMEÇA COM O NOME (E NÃO SÓ CITA ELE)
  const depicts = (img: WikiImage) =>
    img.mine || normalize(img.file ?? "").includes(surname) || [surname, normalize(member.name)].some((n) => normalize((img.caption ?? "").slice(0, 70)).startsWith(n));

  // FOTO DE CRIANÇA OU ADOLESCENTE: A IDADE NA FOTO (ANO DA FOTO MENOS ANO DE NASCIMENTO) TEM QUE SER ATÉ 19 ANOS; SEM DATA, A LEGENDA TEM QUE FALAR DE INFÂNCIA
  const young = gallery
    .filter(isPortrait)
    .filter(depicts)
    .filter((i) => {
      const age = ageInPhoto(i);
      if (age !== undefined) return age >= 0 && age <= 19;
      return CHILD_WORDS.test(describe(i)) && !BAND_SHOT.test(describe(i));
    })
    .sort((a, b) => (ageInPhoto(a) ?? 0) - (ageInPhoto(b) ?? 0));
  const curatedKid = dossier?.fotos?.find((f) => f.fase === "infancia")?.src;
  // SÓ VALE FOTO DO GOOGLE CUJO TÍTULO FALA DE INFÂNCIA; FOTO COMUM DA PESSOA FICA PRA "AGORA"
  const searched = searchKidQ.data?.find((i) => i.kid);
  const kidAge = young[0] ? ageInPhoto(young[0]) : undefined;
  const kid = {
    src: curatedKid ?? young[0]?.src ?? searched?.src,
    label: kidAge !== undefined && kidAge > 12 ? "jovem" : "pequeno",
    credit: !curatedKid && !young[0] && searched?.page ? searched.page : undefined,
    loading: !curatedKid && !young[0] && (commonsQ.loading || imagesQ.loading || wikiLoading || searchKidQ.loading),
  };
  const newest = [...factImages].sort((a, b) => (b.year ?? 0) - (a.year ?? 0))[0];
  const ownAdult =
    dossier?.fotos?.find((f) => f.fase === "adulto")?.src ??
    person?.image ??
    pages.find((p) => p.image)?.image ??
    newest?.src ??
    gallery.find((i) => isPortrait(i) && depicts(i) && i.src !== kid.src && (ageInPhoto(i) ?? 99) > 19)?.src;

  const needsSearch = !ownAdult && !wikiLoading && !commonsQ.loading;
  const searchAdultQ = useAsync(() => (needsSearch ? getSearchPhotos(member.name, band, "atual") : Promise.resolve([])), [member.id, needsSearch]);
  const foundAdult = searchAdultQ.data?.find((i) => i.src !== kid.src);
  const adult = { src: ownAdult ?? foundAdult?.src, credit: ownAdult ? undefined : foundAdult?.page };

  const sections = completeBiography(wikiQ.data ?? [], ctx);
  const childhood = childhoodItems(ctx, wikiQ.data ?? [], dossier);
  const curiosities = curiosityItems(ctx, dossier);

  const curatedDirt = dossier?.polemicas ?? [];
  const found = dropSimilar([...curatedDirt, ...(pressQ.data?.polemicas ?? []), ...(wikiDirtQ.data ?? [])], (t) => t).slice(0, 14);
  const dirtLoading = pagesQ.loading || waiting || pressQ.loading || wikiDirtQ.loading;
  const comings = [
    !member.current && !solo && `Deixou o ${band} (${member.periods.join(", ")}).`,
    member.periods.length > 1 && !solo && `Entrou, saiu e voltou ao ${band}: ${member.periods.join(", ")}.`,
  ].filter((t): t is string => !!t);
  const controversies = found.length > 0 || dirtLoading ? found : comings;

  const age = ageAt(profile.birth, profile.death);
  const facts: [string, string | undefined][] = [
    ["Nome de batismo", profile.birthName],
    ["Nasceu", [formatDate(profile.birth), profile.birthPlace].filter(Boolean).join(", ") || undefined],
    [profile.death ? "Morreu" : "Idade", profile.death ? `${formatDate(profile.death)}${age !== undefined ? `, aos ${age} anos` : ""}` : age !== undefined ? `${age} anos` : undefined],
    ["Função", member.instruments.join(", ") || factsQ.data?.instruments.slice(0, 3).join(", ") || undefined],
    [`No ${band}`, solo ? undefined : member.periods.join(", ")],
  ];
  const alias = dossier?.apelido || factsQ.data?.nicknames[0] || artistQ.data?.aliases[0] || profile.birthName || member.name;

  return {
    alias,
    facts,
    kid,
    adult,
    sections,
    childhood,
    curiosities,
    controversies,
    dirtLoading: dirtLoading && found.length === 0,
    gallery,
    wikiLoading,
  };
}
