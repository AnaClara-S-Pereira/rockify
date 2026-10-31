import { Link } from "react-router";
import { useFotosBandas } from "../../hooks/useFotosBandas";
import { bandPath } from "../../utilitarios/utilidades";
import type { StickerId } from "../../tipos";
import Arrastavel from "../interface/Arrastavel";
import CampoBusca from "../interface/CampoBusca";
import Adesivo from "../interface/Adesivo";
import FotoXerox from "../interface/FotoXerox";

const STICKERS: { id: StickerId; top: string; left: string; size: string; rot: number; delay: string; desktop?: boolean }[] = [
  { id: "skull", top: "8%", left: "4%", size: "w-20 md:w-28", rot: -12, delay: "0s" },
  { id: "bolt", top: "8%", left: "70%", size: "w-16 md:w-24", rot: 14, delay: ".8s" },
  { desktop: true, id: "noise", top: "62%", left: "86%", size: "w-24 md:w-32", rot: -8, delay: "1.6s" },
  { desktop: true, id: "heart", top: "70%", left: "3%", size: "w-16 md:w-24", rot: 10, delay: ".4s" },
  { id: "eye", top: "4%", left: "46%", size: "w-14 md:w-20", rot: 6, delay: "1.2s" },
  { id: "knob", top: "84%", left: "62%", size: "w-14 md:w-20", rot: 0, delay: "2s" },
  { desktop: true, id: "pick", top: "40%", left: "1%", size: "w-12 md:w-16", rot: -20, delay: "1s" },
  { desktop: true, id: "moon", top: "36%", left: "92%", size: "w-12 md:w-16", rot: 18, delay: ".6s" },
];

const PHOTOS = [
  { name: "Black Sabbath", top: "20%", left: "8%", rot: -9 },
  { name: "Nirvana", top: "20%", left: "77%", rot: 7 },
  { name: "Sepultura", top: "64%", left: "74%", rot: -5 },
  { name: "The Cure", top: "66%", left: "12%", rot: 6 },
];

// TOPO DA HOME: TÍTULO, BUSCA E ADESIVOS ARRASTÁVEIS
export default function Topo() {
  const pictures = useFotosBandas(PHOTOS.map((p) => p.name));

  return (
    <section className="halftone scanlines relative flex min-h-[92vh] items-center justify-center overflow-hidden px-4 py-24">
      {PHOTOS.map((p) => (
        <Arrastavel key={p.name} rotate={p.rot} className="hidden lg:block" style={{ top: p.top, left: p.left }}>
          <Link to={bandPath(p.name)} className="photo-sticker block w-40" draggable={false}>
            <FotoXerox src={pictures[p.name] ?? undefined} alt={p.name} className="pointer-events-none aspect-square w-full" />
            <span className="mt-1 block text-center font-marker text-ink">{p.name}</span>
          </Link>
        </Arrastavel>
      ))}

      {STICKERS.map((s) => (
        <Arrastavel key={s.id} rotate={s.rot} className={s.desktop ? "hidden md:block" : ""} style={{ top: s.top, left: s.left }}>
          <div className="animate-float" style={{ animationDelay: s.delay }}>
            <Adesivo id={s.id} className={`${s.size} pointer-events-none`} />
          </div>
        </Arrastavel>
      ))}

      <div className="relative z-20 flex w-full max-w-4xl flex-col items-center text-center">
        <p className="font-type text-base text-dust md:text-lg">o arquivo não-oficial de tudo que faz barulho</p>

        <h1
          className="rough glitch my-2 select-none font-display text-[26vw] leading-[0.82] tracking-tight text-bone md:text-[17vw] lg:text-[15rem]"
          data-text="ROCKIFY"
        >
          ROCKIFY
        </h1>

        <div className="bubble mb-10 mt-6 ml-[-30%] rotate-[-4deg] px-6 py-3 md:ml-[-45%]">
          <p className="font-marker text-2xl md:text-3xl">
            R = ock<sup className="text-base">∞</sup>
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <CampoBusca big />
          <p className="mt-3 font-type text-sm text-fog">
            Qualquer banda. Da lenda de estádio à que tem 12 ouvintes mensais.
          </p>
        </div>
      </div>

      <p className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rotate-[-2deg] font-marker text-lg text-dust">
        psiu: os adesivos se arrastam ↴
      </p>
    </section>
  );
}
