import { tilt } from "../../utilitarios/utilidades";
import type { Member, WikiPerson } from "../../tipos";
import FotoXerox from "../interface/FotoXerox";

interface Props {
  member: Member;
  person?: WikiPerson;
  hasDossier: boolean;
  onOpen: () => void;
}

// CARD DE INTEGRANTE NA FORMAÇÃO
export default function CartaoIntegrante({ member, person, hasDossier, onOpen }: Props) {
  const rot = tilt(member.id, 3);
  return (
    <button
      onClick={onOpen}
      className="group relative bg-bone p-3 pb-4 text-left text-ink shadow-[6px_6px_0_#000] transition-all duration-300 hover:z-10 hover:-translate-y-2 hover:rotate-0 hover:shadow-[12px_12px_0_#000]"
      style={{ rotate: `${rot}deg` }}
    >
      <div className="relative overflow-hidden">
        <FotoXerox src={person?.image} alt={member.name} className={`aspect-[4/5] w-full transition duration-500 group-hover:scale-105 ${member.current ? "" : "opacity-80"}`} />
        {!member.current && (
          <span className="absolute right-2 top-2 rotate-[-12deg] border-[3px] border-ink bg-dust px-2 font-display text-2xl text-ink">EX</span>
        )}
        {member.original && (
          <span className="absolute bottom-2 left-2 bg-ink px-2 py-0.5 font-type text-xs text-bone">fundador</span>
        )}
        {hasDossier && (
          <span className="absolute left-2 top-2 flex items-center gap-1 bg-ink px-2 py-0.5 font-marker text-xs text-bone">
            <span className="h-2 w-2 animate-flicker rounded-full bg-blood" /> tem fofoca
          </span>
        )}
      </div>
      <p className="mt-3 font-marker text-xl leading-tight">{member.name}</p>
      <p className="mt-1 line-clamp-1 font-type text-xs text-ash">{member.instruments.join(", ") || "integrante"}</p>
      <p className="font-type text-xs text-ash">{member.periods.join(", ")}</p>
      <span className="mt-2 inline-block font-display text-sm uppercase tracking-wide underline decoration-2 underline-offset-4 opacity-0 transition-opacity group-hover:opacity-100">
        Abrir dossiê
      </span>
    </button>
  );
}
