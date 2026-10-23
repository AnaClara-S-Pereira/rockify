declare const process: { env: Record<string, string | undefined> };

// FUNÇÃO DO SERVIDOR: JUNTA POLÊMICAS, VIDA PESSOAL, INFÂNCIA E BIOGRAFIA DE QUALQUER ARTISTA
// 1) MANCHETES DA IMPRENSA (GOOGLE NOTÍCIAS, RSS PÚBLICO, SEM CHAVE)
// 2) PESQUISA DO GEMINI COM BUSCA DO GOOGLE, SÓ SE EXISTIR A VARIÁVEL GEMINI_API_KEY

type Topic = "polemicas" | "pessoal" | "infancia";

const TOPICS: Record<Topic, { search: string[]; words: RegExp }> = {
  polemicas: {
    search: [
      "polêmica OR acusado OR acusação OR preso OR escândalo OR processo OR denúncia",
      "overdose OR vício OR expulso OR briga OR agressão OR censura OR cancelado OR racismo OR assédio",
    ],
    words: /pol[eê]mic|acus|preso|presa|pris[aã]o|prende|process|esc[aâ]ndalo|abus|ass[eé]dio|den[uú]ncia|denunc|overdose|expuls|briga|agress|cancel|censur|v[ií]cio|investig|condenad|multa|racis|homofob|machis|sexis|alega|crime|reabilita|rehab|arrest|lawsuit|scandal|accus|assault|banned/i,
  },
  pessoal: {
    search: ["casamento OR casou OR esposa OR marido OR namorada OR namorado OR filho OR filha OR família OR divórcio OR separação OR pai OR mãe OR irmão OR luto"],
    words: /casa(u|mento|da|do|l)|espos|marido|namor|noiv|filh|fam[ií]lia|div[oó]rcio|separa|luto|\bpai\b|\bm[aã]e\b|irm[aã]|romance|relacionamento|gr[aá]vid|herdeir|neto|sobrinh/i,
  },
  infancia: {
    search: ["infância OR \"quando era criança\" OR adolescência OR cresceu OR \"primeira guitarra\" OR \"primeira banda\" OR \"primeira bateria\" OR \"quando criança\""],
    words: /inf[aâ]ncia|quando (era|foi|crian[cç]a|pequen)|adolesc[eê]ncia|cresc(eu|endo)|nasceu|primeira (guitarra|banda|bateria|m[uú]sica)/i,
  },
};

// SÍMBOLOS DE NOME ARTÍSTICO VIRAM LETRA ("¥o-Landi Vi$$er" = "Yolandi Visser")
const letters = (t: string) => t.replace(/\$/g, "s").replace(/¥/g, "y");
const normalize = (t: string) => letters(t).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z0-9]/g, "");

const decode = (t: string) =>
  t
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

// MANCHETES DO GOOGLE NOTÍCIAS SOBRE UM TÓPICO; A MANCHETE PRECISA CITAR A PESSOA (OU A BANDA, NO CASO DE POLÊMICAS)
async function headlines(name: string, band: string, topic: Topic, duo: boolean): Promise<string[]> {
  const sameName = normalize(band) === normalize(name);
  const subject = band && !sameName ? `"${name}" "${band}"` : `"${name}"`;
  const lists = await Promise.all(
    TOPICS[topic].search.map(async (terms) => {
      try {
        const res = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(`${subject} (${terms})`)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        if (!res.ok) return [];
        const xml = await res.text();
        return [...xml.matchAll(/<item>[\s\S]*?<title>([\s\S]*?)<\/title>/g)].map((m) => decode(m[1]));
      } catch {
        return [];
      }
    }),
  );

  const full = normalize(name);
  const surname = normalize(name.split(/\s+/).pop() ?? name);
  const multiword = name.trim().split(/\s+/).length > 1;
  const about = (text: string) => {
    const n = normalize(text);
    if (topic === "polemicas" && duo && !!band && n.includes(normalize(band))) return true;
    return n.includes(full) || (multiword && n.includes(surname) && !!band && n.includes(normalize(band)));
  };

  const seen = new Set<string>();
  return lists
    .flat()
    .map((title) => {
      const cut = title.lastIndexOf(" - ");
      return cut > 0 ? { text: title.slice(0, cut), source: title.slice(cut + 3) } : { text: title, source: "" };
    })
    .filter(({ text }) => text.length > 30 && TOPICS[topic].words.test(text) && about(text))
    .filter(({ text }) => {
      const key = normalize(text).slice(0, 45);
      return !seen.has(key) && seen.add(key);
    })
    .slice(0, 12)
    .map(({ text, source }) => (source ? `${text} (${source})` : text));
}

interface Found {
  polemicas: string[];
  pessoal: string[];
  infancia: string[];
  biografia: string[];
}

// PESQUISA DO GEMINI COM A BUSCA DO GOOGLE LIGADA (SÓ SE A CHAVE EXISTIR)
async function gemini(name: string, band: string): Promise<Found> {
  const empty: Found = { polemicas: [], pessoal: [], infancia: [], biografia: [] };
  const key = process.env.GEMINI_API_KEY;
  if (!key) return empty;
  const prompt = `Pesquise na web sobre "${name}"${band ? ` (da banda ${band})` : ""}, só sobre ele(a) como pessoa e não sobre a banda inteira, e responda em português do Brasil, só com fatos de fontes confiáveis, sem opinião e sem inventar.
Responda APENAS com um objeto JSON com 4 arrays de strings (cada string com 1 ou 2 frases e o ano quando souber):
"polemicas": prisões, processos, brigas, saídas conturbadas, vícios, overdoses, declarações ofensivas, censura, escândalos e acusações com cobertura da imprensa (acusação não provada deve dizer "acusado de"), até 8 itens;
"pessoal": casamentos, filhos, família, relacionamentos, saúde, até 6 itens;
"infancia": onde e como cresceu, pais, primeiros contatos com a música, até 6 itens;
"biografia": carreira em ordem cronológica, até 6 itens.
Use [] para o que não achar.`;
  try {
    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], tools: [{ google_search: {} }] }),
    });
    if (!res.ok) return empty;
    const data = await res.json();
    const text: string = (data.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? "{}") as Partial<Record<keyof Found, unknown[]>>;
    const strings = (list?: unknown[]) => (list ?? []).filter((t): t is string => typeof t === "string" && t.length > 20);
    return { polemicas: strings(parsed.polemicas), pessoal: strings(parsed.pessoal), infancia: strings(parsed.infancia), biografia: strings(parsed.biografia) };
  } catch {
    return empty;
  }
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const name = letters((url.searchParams.get("name") ?? "").trim()).slice(0, 80);
  const band = (url.searchParams.get("band") ?? "").trim().slice(0, 80);
  // BANDA DE 1 OU 2 PESSOAS: A POLÊMICA DA DUPLA É DOS DOIS
  const duo = url.searchParams.get("duo") === "1";
  if (!name) return Response.json({ polemicas: [], pessoal: [], infancia: [], biografia: [] }, { status: 400 });

  const [ai, polemicas, pessoal, infancia] = await Promise.all([
    gemini(name, band),
    headlines(name, band, "polemicas", duo),
    headlines(name, band, "pessoal", false),
    headlines(name, band, "infancia", false),
  ]);

  const body: Found = {
    polemicas: [...ai.polemicas, ...polemicas],
    pessoal: [...ai.pessoal, ...pessoal],
    infancia: [...ai.infancia, ...infancia],
    biografia: ai.biografia,
  };
  return Response.json(body, { headers: { "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=86400" } });
}
