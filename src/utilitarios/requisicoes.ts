const memory = new Map<string, unknown>();
const pending = new Map<string, Promise<unknown>>();

function readCache<T>(key: string): T | undefined {
  if (memory.has(key)) return memory.get(key) as T;
  try {
    const raw = sessionStorage.getItem(`rk:${key}`);
    if (!raw) return undefined;
    const value = JSON.parse(raw) as T;
    memory.set(key, value);
    return value;
  } catch {
    return undefined;
  }
}

function writeCache(key: string, value: unknown) {
  memory.set(key, value);
  try {
    sessionStorage.setItem(`rk:${key}`, JSON.stringify(value));
  } catch {}
}

// BUSCA JSON COM CACHE; PEDIDOS IGUAIS AO MESMO TEMPO VIRAM UM SÓ
export function getJson<T>(url: string): Promise<T> {
  const cached = readCache<T>(url);
  if (cached !== undefined) return Promise.resolve(cached);
  if (pending.has(url)) return pending.get(url) as Promise<T>;

  const run = (async () => {
    const pedir = () => fetch(url, { headers: { Accept: "application/json" } });
    let res = await pedir();
    // LIMITE DE REQUISIÇÕES (429 OU 503 DO MUSICBRAINZ): ESPERA UM POUCO E TENTA DE NOVO
    for (let tries = 0; (res.status === 429 || res.status === 503) && tries < 3; tries++) {
      await new Promise((r) => setTimeout(r, (Number(res.headers.get("retry-after")) || 3) * 1000));
      res = await pedir();
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as T;
    writeCache(url, data);
    return data;
  })().finally(() => pending.delete(url));

  pending.set(url, run);
  return run;
}

// ESPAÇO MÍNIMO ENTRE PEDIDOS DE CADA SERVIDOR (MUSICBRAINZ PEDE NO MÁXIMO 1 POR SEGUNDO)
const GAPS: Record<string, number> = { "musicbrainz.org": 1100, "query.wikidata.org": 350, "news.google.com": 0 };
const nextStart = new Map<string, number>();

export async function throttledJson<T>(url: string): Promise<T> {
  const cached = readCache<T>(url);
  if (cached !== undefined) return cached;

  const host = url.startsWith("/") ? "local" : new URL(url).host;
  const start = Math.max(Date.now(), nextStart.get(host) ?? 0);
  nextStart.set(host, start + (GAPS[host] ?? 120));
  await new Promise((r) => setTimeout(r, start - Date.now()));
  return getJson<T>(url);
}

let jsonpCount = 0;

// JSONP PARA APIS SEM CORS (DEEZER)
export function jsonp<T>(url: string, timeout = 9000): Promise<T> {
  const cached = readCache<T>(url);
  if (cached !== undefined) return Promise.resolve(cached);

  return new Promise<T>((resolve, reject) => {
    const name = `__rk_jsonp_${Date.now()}_${jsonpCount++}`;
    const script = document.createElement("script");
    const win = window as unknown as Record<string, unknown>;

    const cleanup = () => {
      delete win[name];
      script.remove();
      clearTimeout(timer);
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("timeout"));
    }, timeout);

    win[name] = (data: T) => {
      cleanup();
      writeCache(url, data);
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("jsonp error"));
    };
    script.src = `${url}${url.includes("?") ? "&" : "?"}output=jsonp&callback=${name}`;
    document.body.appendChild(script);
  });
}
