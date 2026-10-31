import { Link } from "react-router";
import { DOSSIES } from "../../dados/dossies";
import { bandPath, tilt } from "../../utilitarios/utilidades";

// CHAMADA DO LIVRO NEGRO NA HOME
export default function ChamadaLivroNegro() {
  const polemicas = DOSSIES.reduce((n, d) => n + d.integrantes.reduce((m, i) => m + i.polemicas.length, 0), 0);

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 md:px-8 lg:grid-cols-2">
      <Link to="/livro-negro" className="group relative mx-auto block w-full max-w-md">
        <div className="relative aspect-[3/4] rotate-[-3deg] border-[3px] border-smoke bg-coal p-8 shadow-[14px_14px_0_#000] transition-transform duration-500 group-hover:rotate-0">
          <div className="halftone absolute inset-0 opacity-40" />
          <div className="relative flex h-full flex-col justify-between border-2 border-ash p-6">
            <p className="font-type text-sm text-fog">volume único · não empreste</p>
            <h2 className="font-goth text-7xl leading-[0.9] text-bone md:text-8xl">Livro Negro do Rock</h2>
            <p className="font-marker text-xl text-dust">o que a Wikipedia não te contou</p>
          </div>
          <span className="absolute right-[-18px] top-16 rotate-[14deg] border-4 border-blood px-4 py-1 font-display text-3xl tracking-widest text-blood">
            Proibido
          </span>
        </div>
      </Link>

      <div>
        <h2 className="font-display text-5xl leading-[0.95] md:text-7xl">
          Infância, manias e {polemicas} polêmicas anotadas à mão.
        </h2>
        <p className="mt-5 max-w-lg font-type text-fog">
          Algumas bandas têm dossiê completo. Abre a banda, clica num integrante e o livro abre na página dele, com as polêmicas
          marcadas em vermelho.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {DOSSIES.map((d) => (
            <Link
              key={d.banda}
              to={bandPath(d.banda)}
              className="paper px-4 py-2 font-marker text-lg shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-1"
              style={{ rotate: `${tilt(d.banda, 4)}deg` }}
            >
              {d.banda}
            </Link>
          ))}
        </div>
        <Link to="/livro-negro" className="btn-punk mt-10">
          Abrir o livro
        </Link>
      </div>
    </section>
  );
}
