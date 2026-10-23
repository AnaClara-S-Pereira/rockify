declare const process: { env: Record<string, string | undefined> };

// FUNÇÃO DO SERVIDOR: BUSCA FOTOS NO GOOGLE IMAGENS
// COM SERPER_API_KEY USA O SERPER.DEV; COM GOOGLE_CSE_KEY E GOOGLE_CSE_ID USA A API OFICIAL DO GOOGLE; SEM NENHUMA DEVOLVE LISTA VAZIA

interface Found {
  title: string;
  thumb: string;
  page: string;
}

const normalize = (t: string) =>
  t.replace(/\$/g, "s").replace(/¥/g, "y").normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]/g, "");

const NOT_PHOTO = /camiseta|spotify|letra|ingresso|ticket|vinil|download|lyrics|t-shirt|shop|mercado livre|amazon/i;
const CHILD = /crian|inf[aâ]ncia|pequen|antig|tbt|throwback|child|young|jovem|adolesc|menino|garoto|\bkid|quando era|anos 80|anos 90|aos \d+ anos/i;

async function serper(key: string, queries: string[]): Promise<Found[]> {
  const lists = await Promise.all(
    queries.map((q) =>
      fetch("https://google.serper.dev/images", {
        method: "POST",
        headers: { "X-API-KEY": key, "Content-Type": "application/json" },
        body: JSON.stringify({ q, gl: "br", hl: "pt-br" }),
      })
        .then((r) => r.json() as Promise<{ images?: { title?: string; thumbnailUrl?: string; link?: string; source?: string }[] }>)
        .then((d) => (d.images ?? []).map((i) => ({ title: `${i.title ?? ""} ${i.source ?? ""}`, thumb: i.thumbnailUrl ?? "", page: i.link ?? "" })))
        .catch(() => [] as Found[]),
    ),
  );
  return lists.flat();
}

async function googleCse(key: string, cx: string, queries: string[]): Promise<Found[]> {
  const lists = await Promise.all(
    queries.map((q) =>
      fetch(`https://www.googleapis.com/customsearch/v1?${new URLSearchParams({ key, cx, q, searchType: "image", num: "10", safe: "active" })}`)
        .then((r) => r.json() as Promise<{ items?: { title?: string; image?: { thumbnailLink?: string; contextLink?: string } }[] }>)
        .then((d) => (d.items ?? []).map((i) => ({ title: i.title ?? "", thumb: i.image?.thumbnailLink ?? "", page: i.image?.contextLink ?? "" })))
        .catch(() => [] as Found[]),
    ),
  );
  return lists.flat();
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const name = (url.searchParams.get("name") ?? "").trim().slice(0, 80);
  const band = (url.searchParams.get("band") ?? "").trim().slice(0, 80);
  const kid = url.searchParams.get("fase") === "crianca";
  const { SERPER_API_KEY, GOOGLE_CSE_KEY, GOOGLE_CSE_ID } = process.env;
  if (!name || !(SERPER_API_KEY || (GOOGLE_CSE_KEY && GOOGLE_CSE_ID))) return Response.json({ items: [] });

  // O SERPER GRÁTIS NÃO ACEITA ASPAS, ENTÃO A BUSCA É SIMPLES E O FILTRO ABAIXO GARANTE QUE É A PESSOA CERTA
  const queries = kid ? [`${name} ${band} quando era criança`, `${name} ${band} infância`, `${name} ${band} jovem antiga`] : [`${name} ${band}`];
  const results = SERPER_API_KEY ? await serper(SERPER_API_KEY, queries) : await googleCse(GOOGLE_CSE_KEY!, GOOGLE_CSE_ID!, queries);

  // SÓ FICA FOTO CUJO TÍTULO OU LINK TEM O NOME COMPLETO E A BANDA (NADA DE OUTRO "NINJA" OU OUTRO "GAMA")
  const seen = new Set<string>();
  const items = results
    .filter((r) => r.thumb && !NOT_PHOTO.test(r.title) && normalize(`${r.title} ${r.page}`).includes(normalize(name)) && normalize(`${r.title} ${r.page}`).includes(normalize(band)))
    .filter((r) => !seen.has(r.thumb) && seen.add(r.thumb))
    .map((r) => ({ src: r.thumb, page: r.page, title: r.title, kid: CHILD.test(r.title) }))
    .sort((a, b) => Number(b.kid) - Number(a.kid))
    .slice(0, 8);

  return Response.json({ items }, { headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" } });
}
