import ChamadaLivroNegro from "../componentes/inicio/ChamadaLivroNegro";
import FitasGeneros from "../componentes/inicio/FitasGeneros";
import Topo from "../componentes/inicio/Topo";
import ChamadaQuiz from "../componentes/inicio/ChamadaQuiz";
import MuralAdesivos from "../componentes/inicio/MuralAdesivos";
import FaixaTexto from "../componentes/interface/FaixaTexto";
import { SLOGANS } from "../dados/destaques";

// PÁGINA INICIAL: JUNTA AS SEÇÕES DA HOME EM ORDEM
export default function PaginaInicial() {
  return (
    <>
      <Topo />
      <div className="-rotate-1">
        <FaixaTexto items={SLOGANS} />
      </div>
      <MuralAdesivos />
      <div className="rotate-1">
        <FaixaTexto items={["ROCK", "METAL", "PUNK", "GRUNGE", "GÓTICO", "SHOEGAZE", "STONER", "HARDCORE", "EMO", "PROG"]} reverse dark />
      </div>
      <FitasGeneros />
      <ChamadaQuiz />
      <ChamadaLivroNegro />
    </>
  );
}
