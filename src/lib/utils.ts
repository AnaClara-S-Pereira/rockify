export function normalize(text: string): string {
  return text
    .replace(/\$/g, "s")
    .replace(/¥/g, "y")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/[^a-z0-9]/g, "");
}

export function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function tilt(seed: string, max = 4): number {
  return Math.round((seeded(seed)() * 2 - 1) * max * 10) / 10;
}

export function year(date?: string): string | undefined {
  return date ? date.slice(0, 4) : undefined;
}

// DATA COMPLETA, SÓ MÊS E ANO OU SÓ O ANO (O WIKIDATA E O MUSICBRAINZ NEM SEMPRE TÊM O DIA)
export function formatDate(date?: string): string | undefined {
  if (!date) return undefined;
  if (/^\d{4}$/.test(date)) return date;
  const d = new Date(date.length === 7 ? `${date}-01` : date);
  if (Number.isNaN(d.getTime())) return date;
  if (date.length === 7) return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" });
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function duration(ms?: number): string {
  if (!ms) return "--:--";
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// IDADE EM ANOS; COM DATA INCOMPLETA SÓ CONTA O ANO
export function ageAt(birth?: string, until?: string): number | undefined {
  if (!birth) return undefined;
  const b = new Date(birth.length === 4 ? `${birth}-06-30` : birth);
  const e = until ? new Date(until.length === 4 ? `${until}-06-30` : until) : new Date();
  let age = e.getUTCFullYear() - b.getUTCFullYear();
  const exact = birth.length > 7 && (!until || until.length > 7);
  if (exact && (e.getUTCMonth() < b.getUTCMonth() || (e.getUTCMonth() === b.getUTCMonth() && e.getUTCDate() < b.getUTCDate()))) age--;
  return Number.isFinite(age) && age >= 0 ? age : undefined;
}

export function youtubeSearch(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function bandPath(name: string): string {
  return `/b/${encodeURIComponent(name)}`;
}

const INSTRUMENTS: Record<string, string> = {
  "lead vocals": "vocal",
  vocals: "vocal",
  "background vocals": "backing vocal",
  guitar: "guitarra",
  "electric guitar": "guitarra",
  "lead guitar": "guitarra solo",
  "rhythm guitar": "guitarra base",
  "bass guitar": "baixo",
  bass: "baixo",
  "electric bass guitar": "baixo",
  drums: "bateria",
  "drums (drum set)": "bateria",
  percussion: "percussão",
  keyboard: "teclado",
  keyboards: "teclado",
  synthesizer: "sintetizador",
  piano: "piano",
  violin: "violino",
  saxophone: "saxofone",
};

export function translateInstrument(name: string): string {
  return INSTRUMENTS[name.toLowerCase()] ?? name;
}

export const isMbid = (id: string) => /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(id);

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function resizeImage(file: File, max: number, square = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const side = Math.min(img.width, img.height);
      const sw = square ? side : img.width;
      const sh = square ? side : img.height;
      const scale = Math.min(1, max / Math.max(sw, sh));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(sw * scale);
      canvas.height = Math.round(sh * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#070707";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Essa imagem não abriu. Tenta um JPG ou PNG."));
    };
    img.src = url;
  });
}
