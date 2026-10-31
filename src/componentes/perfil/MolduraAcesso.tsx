import type { ReactNode } from "react";
import Adesivo from "../interface/Adesivo";

// MOLDURA DO LOGIN E DO CADASTRO
export default function MolduraAcesso({ title, bubble, children }: { title: string; bubble: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid min-h-[85vh] max-w-6xl items-center gap-12 px-4 py-14 md:px-8 lg:grid-cols-2">
      <div className="halftone relative hidden aspect-square border-[3px] border-bone lg:block">
        <p className="absolute left-8 top-8 rotate-[-6deg] font-display text-8xl leading-[0.8]">
          SEM
          <br />
          CRACHÁ
          <br />
          NÃO
          <br />
          ENTRA
        </p>
        <Adesivo id="skull" className="absolute bottom-16 right-14 w-40 rotate-12 animate-float" />
        <Adesivo id="bolt" className="absolute right-10 top-10 w-20 -rotate-12" />
        <Adesivo id="star" className="absolute bottom-10 left-12 w-16" />
        <div className="bubble absolute bottom-[45%] right-6 rotate-[5deg] px-5 py-3">
          <p className="font-marker text-xl">{bubble}</p>
        </div>
      </div>

      <div className="paper relative p-6 shadow-[12px_12px_0_#000] md:p-10">
        <h1 className="font-display text-6xl uppercase leading-none">{title}</h1>
        {children}
      </div>
    </div>
  );
}

// CAMPO DE FORMULÁRIO
export function CampoFormulario(props: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-marker text-lg">{props.label}</span>
      <input
        name={props.name}
        type={props.type ?? "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        required
        className="mt-1 w-full border-b-[3px] border-ink bg-transparent px-1 py-2 font-type text-lg text-ink placeholder:text-ash/70 focus:border-dashed focus:outline-none"
      />
    </label>
  );
}
