import { throttledJson } from "../utilitarios/requisicoes";

const ENGLISH = /\b(the|and|was|were|his|her|with|for|that|from|after|when|had|he|she|of|to|in|by|on|is|who|they|their|been|has|have|not|as a)\b/gi;

export const isEnglish = (text: string) => (text.match(ENGLISH) ?? []).length >= 2;

// TRADUZ PRO PORTUGUÊS PELO ENDPOINT PÚBLICO DO TRADUTOR DO GOOGLE; SE FALHAR DEVOLVE NULL
export async function toPortuguese(text: string): Promise<string | null> {
  const short = text.length > 1400 ? text.slice(0, text.lastIndexOf(". ", 1400) + 1 || 1400) : text;
  try {
    const data = await throttledJson<[string, string][][]>(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(short)}`,
    );
    return data[0].map((part) => part[0]).join("").trim() || null;
  } catch {
    return null;
  }
}
