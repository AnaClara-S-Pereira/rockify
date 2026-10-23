import { useState, type ChangeEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import { resizeImage } from "../../lib/utils";
import type { CoverId, Profile, StickerId } from "../../types";
import Sticker, { STICKER_IDS } from "../ui/Sticker";

export const COVERS: Record<CoverId, { label: string; className: string }> = {
  halftone: { label: "Retícula", className: "halftone bg-soot" },
  static: { label: "Chiado", className: "scanlines bg-coal" },
  stripes: { label: "Faixa", className: "bg-[repeating-linear-gradient(45deg,#f3f2ee_0_14px,#070707_14px_28px)]" },
  grid: { label: "Caderno", className: "bg-ink bg-[linear-gradient(#2a2a2a_1px,transparent_1px),linear-gradient(90deg,#2a2a2a_1px,transparent_1px)] bg-[size:28px_28px]" },
  checker: { label: "Xadrez", className: "bg-[conic-gradient(#f3f2ee_25%,#070707_0_50%,#f3f2ee_0_75%,#070707_0)] bg-[size:44px_44px]" },
};

function UploadButton({ label, onFile }: { label: string; onFile: (file: File) => void }) {
  const pick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  };
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 border-[3px] border-ink px-3 py-1.5 font-display uppercase tracking-wide transition-colors hover:bg-ink hover:text-bone">
      <input type="file" accept="image/*" onChange={pick} className="sr-only" />
      {label}
    </label>
  );
}

export default function ProfileEditor({ profile, onDone }: { profile: Profile; onDone: () => void }) {
  const { updateProfile } = useAuth();
  const [draft, setDraft] = useState({
    bio: profile.bio,
    status: profile.status,
    avatar: profile.avatar,
    avatarImage: profile.avatarImage,
    cover: profile.cover,
    coverImage: profile.coverImage,
  });
  const [error, setError] = useState("");

  const upload = (field: "avatarImage" | "coverImage") => async (file: File) => {
    setError("");
    try {
      const image = field === "avatarImage" ? await resizeImage(file, 400, true) : await resizeImage(file, 1600);
      setDraft((d) => ({ ...d, [field]: image }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não deu pra abrir a imagem.");
    }
  };

  const save = () => {
    try {
      updateProfile(draft);
      onDone();
    } catch {
      setError("A imagem ficou pesada demais pro navegador guardar. Tenta uma menor.");
    }
  };

  return (
    <div className="paper animate-pop p-6 shadow-[12px_12px_0_#000] md:p-10">
      <p className="font-display text-5xl uppercase">Personalizar</p>

      <p className="mt-8 font-marker text-xl">Avatar</p>
      <div className="mt-3 grid grid-cols-7 gap-3 sm:grid-cols-[repeat(14,minmax(0,1fr))]">
        {STICKER_IDS.map((id: StickerId) => (
          <button
            key={id}
            onClick={() => setDraft((d) => ({ ...d, avatar: id, avatarImage: undefined }))}
            className={`grid aspect-square place-items-center rounded-full p-1.5 transition-transform hover:scale-110 ${!draft.avatarImage && draft.avatar === id ? "bg-ink ring-4 ring-ink ring-offset-2 ring-offset-paper" : "bg-dust"}`}
            aria-label={`Avatar ${id}`}
            aria-pressed={!draft.avatarImage && draft.avatar === id}
          >
            <Sticker id={id} className="h-full w-full" diecut={false} />
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {draft.avatarImage && (
          <img src={draft.avatarImage} alt="Sua foto" className="h-16 w-16 rounded-full border-[3px] border-ink object-cover ring-4 ring-ink ring-offset-2 ring-offset-paper" />
        )}
        <UploadButton label={draft.avatarImage ? "Trocar foto" : "Usar foto do PC"} onFile={upload("avatarImage")} />
        {draft.avatarImage && (
          <button onClick={() => setDraft((d) => ({ ...d, avatarImage: undefined }))} className="font-type underline underline-offset-4">
            Tirar foto
          </button>
        )}
      </div>

      <p className="mt-8 font-marker text-xl">Capa</p>
      <div className="mt-3 flex flex-wrap gap-4">
        {(Object.keys(COVERS) as CoverId[]).map((id) => (
          <button
            key={id}
            onClick={() => setDraft((d) => ({ ...d, cover: id, coverImage: undefined }))}
            className="text-center"
            aria-pressed={!draft.coverImage && draft.cover === id}
          >
            <span className={`block h-16 w-24 border-[3px] ${!draft.coverImage && draft.cover === id ? "border-ink outline outline-4 outline-offset-2 outline-ink" : "border-ash"} ${COVERS[id].className}`} />
            <span className="font-type text-sm">{COVERS[id].label}</span>
          </button>
        ))}
        {draft.coverImage && (
          <div className="text-center">
            <img src={draft.coverImage} alt="Seu banner" className="block h-16 w-24 border-[3px] border-ink object-cover outline outline-4 outline-offset-2 outline-ink" />
            <span className="font-type text-sm">Sua foto</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <UploadButton label={draft.coverImage ? "Trocar banner" : "Usar banner do PC"} onFile={upload("coverImage")} />
        {draft.coverImage && (
          <button onClick={() => setDraft((d) => ({ ...d, coverImage: undefined }))} className="font-type underline underline-offset-4">
            Tirar banner
          </button>
        )}
      </div>

      <label className="mt-8 block">
        <span className="font-marker text-xl">Tocando na sua cabeça agora</span>
        <input
          value={draft.status}
          maxLength={60}
          onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
          placeholder="ex: A Forest no repeat"
          className="mt-1 w-full border-b-[3px] border-ink bg-transparent px-1 py-2 font-type text-lg focus:outline-none"
        />
      </label>

      <label className="mt-8 block">
        <span className="font-marker text-xl">Bio</span>
        <textarea
          value={draft.bio}
          maxLength={280}
          rows={4}
          onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
          placeholder="Conta tua história com o barulho..."
          className="paper-lines mt-1 w-full resize-none border-[3px] border-ink bg-transparent p-3 font-type text-lg leading-8 focus:outline-none"
        />
        <span className="font-type text-xs text-ash">{draft.bio.length}/280</span>
      </label>

      {error && <p className="mt-6 font-marker text-lg text-blood">{error}</p>}

      <div className="mt-8 flex flex-wrap gap-4">
        <button onClick={save} className="btn-bone bg-ink text-bone">
          Salvar perfil
        </button>
        <button onClick={onDone} className="font-type underline underline-offset-4">
          Cancelar
        </button>
      </div>
    </div>
  );
}
