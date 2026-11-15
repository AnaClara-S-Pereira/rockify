import { throttledJson } from "../utilitarios/requisicoes";
import type { PressItems } from "../tipos";

const EMPTY: PressItems = { polemicas: [], pessoal: [], infancia: [], biografia: [] };

// MANCHETES DA IMPRENSA (E PESQUISA DO GEMINI, SE HOUVER CHAVE) VINDAS DA FUNÇÃO /api/pessoa; SEM A FUNÇÃO VOLTA VAZIO
export async function getPress(name: string, band: string, duo: boolean): Promise<PressItems> {
  try {
    const data = await throttledJson<Partial<PressItems>>(`/api/pessoa?name=${encodeURIComponent(name)}&band=${encodeURIComponent(band)}&duo=${duo ? 1 : 0}`);
    return { ...EMPTY, ...data };
  } catch {
    return EMPTY;
  }
}

export interface SearchPhoto {
  src: string;
  page: string;
  title: string;
  kid: boolean;
}

// FOTOS DO GOOGLE IMAGENS (API OFICIAL) VINDAS DA FUNÇÃO /api/fotos; SEM CHAVES VOLTA VAZIO
export async function getSearchPhotos(name: string, band: string, fase: "crianca" | "atual"): Promise<SearchPhoto[]> {
  try {
    const data = await throttledJson<{ items?: SearchPhoto[] }>(`/api/fotos?name=${encodeURIComponent(name)}&band=${encodeURIComponent(band)}&fase=${fase}`);
    return data.items ?? [];
  } catch {
    return [];
  }
}
