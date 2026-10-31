export interface ArtistSummary {
  id: string;
  name: string;
  type?: string;
  country?: string;
  disambiguation?: string;
  begin?: string;
  end?: string;
  ended?: boolean;
  tags: string[];
}

export interface Member {
  id: string;
  name: string;
  instruments: string[];
  periods: string[];
  current: boolean;
  original: boolean;
}

export interface ExternalLink {
  type: string;
  url: string;
}

export interface Artist extends ArtistSummary {
  area?: string;
  beginArea?: string;
  members: Member[];
  links: ExternalLink[];
  memberOf: { id: string; name: string }[];
  aliases: string[];
  wikidataId?: string;
}

export interface Album {
  id: string;
  title: string;
  year?: string;
  type: string;
  cover: string;
}

export interface Track {
  position: string;
  title: string;
  length?: number;
}

export interface WikiPerson {
  mbid: string;
  image?: string;
  birth?: string;
  death?: string;
  birthPlace?: string;
  birthName?: string;
  commons?: string;
  wiki?: { lang: "pt" | "en"; title: string };
  titles?: { pt?: string; en?: string };
}

// DADOS ESTRUTURADOS DE UMA PESSOA (WIKIDATA): FAMÍLIA, MORTE, TRABALHO E FOTOS COM DATA
export interface PersonFacts {
  nicknames: string[];
  spouses: string[];
  partners: string[];
  children: string[];
  siblings: string[];
  parents: string[];
  residence: string[];
  education: string[];
  occupations: string[];
  instruments: string[];
  awards: string[];
  convictions: string[];
  deathPlace?: string;
  deathCause?: string;
  images: { src: string; file: string; year?: number }[];
}

// RESULTADO DA FUNÇÃO /api/pessoa (MANCHETES DA IMPRENSA E, SE HOUVER CHAVE, PESQUISA DO GEMINI)
export interface PressItems {
  polemicas: string[];
  pessoal: string[];
  infancia: string[];
  biografia: string[];
}

export interface WikiSection {
  title: string;
  paragraphs: string[];
}

export interface WikiImage {
  src: string;
  caption?: string;
  file?: string;
  year?: number;
  mine?: boolean;
}

export interface PlayableTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover?: string;
  preview: string;
  duration?: number;
}

export interface DossierPhoto {
  src: string;
  legenda: string;
  fase: "infancia" | "adulto";
}

export interface DossieIntegrante {
  nome: string;
  aliases?: string[];
  apelido: string;
  infancia: string[];
  curiosidades: string[];
  polemicas: string[];
  fotos?: DossierPhoto[];
}

export interface BandDossier {
  banda: string;
  manchete: string;
  segredos: string[];
  integrantes: DossieIntegrante[];
}

export type GenreId =
  | "classico"
  | "punk"
  | "grunge"
  | "postpunk"
  | "alternativo"
  | "shoegaze"
  | "heavy"
  | "thrash"
  | "extremo"
  | "doom"
  | "numetal"
  | "emo"
  | "prog";

export interface Genre {
  id: GenreId;
  nome: string;
  arquetipo: string;
  descricao: string;
  tag: string;
  sticker: StickerId;
  bandas: string[];
  musicas: { titulo: string; artista: string }[];
}

export interface QuizOption {
  texto: string;
  pontos: Partial<Record<GenreId, number>>;
}

export interface QuizQuestion {
  pergunta: string;
  opcoes: QuizOption[];
}

export interface QuizResult {
  genre: GenreId;
  ranking: { id: GenreId; pct: number }[];
  date: string;
}

export type StickerId =
  | "bolt"
  | "skull"
  | "star"
  | "heart"
  | "eye"
  | "cassette"
  | "vinyl"
  | "pick"
  | "pin"
  | "flame"
  | "knob"
  | "noise"
  | "coffin"
  | "moon";

export type CoverId = "halftone" | "static" | "stripes" | "grid" | "checker";

export interface FavoriteBand {
  id: string;
  name: string;
  image?: string;
}

export interface Profile {
  bio: string;
  avatar: StickerId;
  avatarImage?: string;
  cover: CoverId;
  coverImage?: string;
  status: string;
  quiz?: QuizResult;
  favorites: FavoriteBand[];
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  createdAt: string;
  profile: Profile;
}

export interface StoredUser extends User {
  passHash: string;
}
