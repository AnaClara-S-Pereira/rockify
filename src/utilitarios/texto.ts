import { normalize } from "./utilidades";

export const lastName = (name: string) => normalize(name.trim().split(/\s+/).pop() ?? name);

export function yearFrom(text: string): number | undefined {
  const found = text.match(/\b(19[0-9]\d|20[0-2]\d)\b/)?.[1];
  return found ? Number(found) : undefined;
}

export function plain(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const ABBREVIATION = /\b(?:St|Dr|Sr|Sra|Sta|Mr|Mrs|Ms|Jr|Prof|vs)\.$/;

export function sentences(text: string, min = 50): string[] {
  const parts = text.split(/([.!?]["”')\]]?)\s+(?=[A-ZÀ-Ú"“])/);
  const out: string[] = [];
  let current = "";
  for (let i = 0; i < parts.length; i++) {
    current += parts[i];
    if (i % 2 === 0) continue;
    if (ABBREVIATION.test(current)) {
      current += " ";
    } else {
      out.push(current.trim());
      current = "";
    }
  }
  if (current.trim()) out.push(current.trim());
  return out.filter((t) => t.length > min && t.length < 360);
}

const wordsOf = (text: string) => new Set(text.toLowerCase().match(/\p{L}{4,}/gu) ?? []);
const overlaps = (a: Set<string>, b: Set<string>) => [...a].filter((w) => b.has(w)).length / Math.max(1, Math.min(a.size, b.size)) > 0.5;

// TIRA FRASES QUE CONTAM O MESMO FATO (MAIS DE METADE DAS PALAVRAS IGUAIS)
export function dropSimilar<T>(list: T[], text: (item: T) => string): T[] {
  const kept: Set<string>[] = [];
  return list.filter((item) => {
    const words = wordsOf(text(item));
    const dup = kept.some((k) => overlaps(words, k));
    if (!dup) kept.push(words);
    return !dup;
  });
}

// SÓ O QUE AINDA NÃO ESTÁ NA LISTA "known"
export function onlyNew(list: string[], known: string[]): string[] {
  const seen = known.map(wordsOf);
  return list.filter((t) => !seen.some((k) => overlaps(wordsOf(t), k)));
}

export function listPt(items: string[]): string {
  return items.length < 2 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}
