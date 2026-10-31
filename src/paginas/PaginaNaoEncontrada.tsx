import { Link } from "react-router";
import LetrasRecortadas from "../componentes/interface/LetrasRecortadas";
import Adesivo from "../componentes/interface/Adesivo";

// PÁGINA 404
export default function PaginaNaoEncontrada() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center gap-8 px-4 text-center">
      <Adesivo id="coffin" className="w-24 animate-float" />
      <LetrasRecortadas text="FAIXA 404" size="text-5xl md:text-7xl" />
      <p className="max-w-md font-type text-lg text-dust">Essa página saiu da banda. Tenta voltar pro começo do disco.</p>
      <Link to="/" className="btn-bone">
        Voltar pro início
      </Link>
    </div>
  );
}
