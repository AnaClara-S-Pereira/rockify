import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMemberFile } from "../../hooks/useMemberFile";
import { youtubeSearch } from "../../lib/utils";
import type { WikiPage } from "../../services/wiki";
import type { Member, MemberDossier as Dossier, WikiImage, WikiPerson } from "../../types";
import Icon from "../ui/Icon";
import { Loader } from "../ui/Loader";
import RansomText from "../ui/RansomText";
import Sticker from "../ui/Sticker";
import XeroxImage from "../ui/XeroxImage";

interface Props {
  member: Member;
  person?: WikiPerson;
  dossier?: Dossier;
  band: string;
  solo: boolean;
  bandPages: WikiPage[];
  bandSize: number;
  waiting: boolean;
  onClose: () => void;
}

interface PhotoProps {
  src?: string;
  label: string;
  rot: number;
  alt: string;
  empty: string;
  loading?: boolean;
  credit?: string;
  searchHref?: string;
}

// FOTO COLADA COM FITA E LEGENDA ESCRITA À MÃO
function TapedPhoto({ src, label, rot, alt, empty, loading, credit, searchHref }: PhotoProps) {
  return (
    <figure className="relative w-full bg-bone p-2 pb-3 shadow-[5px_6px_0_rgba(0,0,0,.45)]" style={{ rotate: `${rot}deg` }}>
      <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-5deg]" />
      {src ? (
        <XeroxImage src={src} alt={alt} className="aspect-[4/5] w-full" />
      ) : (
        <div className="halftone-dark grid aspect-[4/5] w-full place-items-center bg-dust p-4 text-center">
          <div>
            <p className="font-marker text-xl text-ink/80">{loading ? "procurando no arquivo..." : empty}</p>
            {!loading && searchHref && (
              <a href={searchHref} target="_blank" rel="noreferrer" className="mt-3 inline-block font-type text-xs underline underline-offset-4">
                procurar no Google Imagens
              </a>
            )}
          </div>
        </div>
      )}
      <figcaption className="mt-2 text-center font-marker text-lg text-ink">{label}</figcaption>
      {credit && (
        <a href={credit} target="_blank" rel="noreferrer" className="block truncate text-center font-type text-[10px] text-ash underline">
          foto: {new URL(credit).hostname.replace("www.", "")}
        </a>
      )}
    </figure>
  );
}

// O DOSSIÊ: LIVRO ABERTO EM TELA CHEIA COM FICHA, INFÂNCIA, CURIOSIDADES E POLÊMICAS EM VERMELHO
export default function MemberDossier({ member, person, dossier, band, solo, bandPages, bandSize, waiting, onClose }: Props) {
  const file = useMemberFile({ member, person, dossier, band, solo, bandPages, bandSize, waiting });
  const [zoom, setZoom] = useState<WikiImage | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (zoom ? setZoom(null) : onClose());
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, zoom]);

  const searchHref = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${member.name} ${band} criança infância jovem`)}`;

  return createPortal(
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-ink/95 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Dossiê de ${member.name}`}>
      <div className="halftone pointer-events-none fixed inset-0" />

      <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-smoke bg-ink/90 px-4 py-3 md:px-8">
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={onClose} className="font-display text-lg uppercase text-fog hover:text-bone">
            ← Voltar
          </button>
          <p className="hidden font-goth text-2xl sm:block md:text-3xl">Livro Negro do Rock</p>
        </div>
        <button onClick={onClose} className="flex items-center gap-2 font-display text-lg uppercase text-fog hover:text-bone" aria-label="Fechar dossiê">
          Fechar <Icon name="close" className="h-6 w-6" />
        </button>
      </div>

      <div className="relative mx-auto max-w-6xl animate-pop px-3 py-10 md:px-6">
        <div className="grid shadow-[18px_18px_0_#000] lg:grid-cols-2">
          {/* PÁGINA ESQUERDA */}
          <article className="paper paper-lines relative border-r-0 p-6 md:p-10 lg:border-r-[6px] lg:border-r-ink/80">
            <p className="font-type text-sm text-ash">dossiê nº {member.id.slice(0, 6)} · {band}</p>
            <h2 className="my-4">
              <RansomText text={member.name} size="text-4xl md:text-5xl" />
            </h2>
            <p className="font-marker text-2xl">a.k.a. "{file.alias}"</p>

            <div className="my-8 grid grid-cols-2 gap-6 px-2">
              <TapedPhoto
                src={file.kid.src}
                label={file.kid.label}
                rot={-4}
                alt={`${member.name} na infância`}
                empty="foto de infância confiscada"
                loading={file.kid.loading}
                credit={file.kid.credit}
                searchHref={searchHref}
              />
              <TapedPhoto src={file.adult.src} label="agora" rot={3} alt={member.name} empty="sem foto no arquivo" loading={file.wikiLoading && !file.adult.src} credit={file.adult.credit} />
            </div>

            <dl className="space-y-2 font-type">
              {file.facts
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[150px_1fr] gap-3 border-b border-dashed border-ash/50 pb-1">
                    <dt className="text-ash">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>

            <div className="mt-8">
              <p className="font-marker text-3xl">Quando era pequeno...</p>
              <ul className="mt-3 space-y-2 font-type">
                {file.childhood.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="font-marker">✎</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* PÁGINA DIREITA */}
          <article className="paper paper-lines relative p-6 md:p-10">
            <Sticker id="star" className="absolute right-6 top-6 w-14 rotate-12" />
            <p className="font-marker text-4xl">Coisas que ninguém sabe</p>
            <ul className="mt-4 space-y-4 font-type">
              {file.curiosities.map((t, i) => (
                <li key={t} className="flex gap-3" style={{ rotate: `${i % 2 ? 0.6 : -0.6}deg` }}>
                  <Sticker id={i % 2 ? "bolt" : "star"} className="mt-0.5 h-5 w-5 shrink-0" diecut={false} />
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <p className="scribble-circle inline-block font-marker text-4xl text-blood">Polêmicas</p>
              {file.controversies.length > 0 ? (
                <ul className="mt-6 space-y-5">
                  {file.controversies.map((t, i) => (
                    <li key={t} className="font-marker text-lg leading-snug text-blood" style={{ rotate: `${i % 2 ? 0.8 : -0.8}deg` }}>
                      <span className="marker-underline">{t}</span>
                    </li>
                  ))}
                </ul>
              ) : file.dirtLoading ? (
                <p className="mt-6 font-type text-ash">Cavando nos arquivos...</p>
              ) : (
                <p className="mt-6 inline-block rotate-[-6deg] border-4 border-ink px-4 py-2 font-display text-2xl uppercase text-blood">
                  Nenhuma polêmica pública achada
                </p>
              )}
              {file.controversies.length > 0 && file.dirtLoading && <p className="mt-4 font-type text-sm text-ash">Cavando mais fundo...</p>}
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              <a href={youtubeSearch(`${member.name} entrevista`)} target="_blank" rel="noreferrer" className="btn-bone bg-ink text-bone">
                <Icon name="youtube" /> Entrevistas
              </a>
            </div>
          </article>
        </div>

        {/* BIOGRAFIA */}
        <section className="paper mt-12 p-6 shadow-[12px_12px_0_#000] md:p-10">
          <p className="font-display text-5xl uppercase">Biografia</p>
          {file.wikiLoading && <Loader text="Folheando a biografia" />}
          <div className="mt-6 space-y-3">
            {!file.wikiLoading &&
              file.sections.map((s, i) => (
                <details key={s.title} open={i === 0} className="group border-b-2 border-dashed border-ash/50 pb-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-marker text-2xl">
                    {s.title}
                    <span className="font-display text-3xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-3 max-w-3xl space-y-3 font-type leading-relaxed">
                    {s.paragraphs.slice(0, 10).map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                </details>
              ))}
          </div>
        </section>

        {/* ARQUIVO VISUAL */}
        {file.gallery.length > 0 && (
          <section className="mt-12">
            <p className="mb-6 font-display text-5xl uppercase">Arquivo visual</p>
            <div className="columns-2 gap-6 md:columns-4">
              {file.gallery.map((img, i) => (
                <button key={img.src} onClick={() => setZoom(img)} className="mb-6 block w-full break-inside-avoid bg-bone p-2 shadow-[5px_5px_0_#000] transition-transform hover:rotate-0 hover:scale-105" style={{ rotate: `${(i % 3) * 2.5 - 2.5}deg` }}>
                  <XeroxImage src={img.src} alt={img.caption ?? member.name} className="w-full" />
                  {img.caption && <p className="mt-1 line-clamp-2 text-left font-type text-xs text-ink">{img.caption}</p>}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {zoom && (
        <div className="fixed inset-0 z-20 grid place-items-center bg-ink/95 p-6" onClick={() => setZoom(null)}>
          <figure className="max-h-full max-w-3xl animate-pop bg-bone p-3">
            <img src={zoom.src} alt={zoom.caption ?? ""} className="xerox max-h-[75vh] w-auto" />
            {zoom.caption && <figcaption className="mt-2 font-type text-sm text-ink">{zoom.caption}</figcaption>}
          </figure>
        </div>
      )}
    </div>,
    document.body,
  );
}
