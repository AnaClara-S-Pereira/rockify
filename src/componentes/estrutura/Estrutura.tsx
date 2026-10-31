import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import FiltrosSvg from "../interface/FiltrosSvg";
import Rodape from "./Rodape";
import Menu from "./Menu";
import BarraPlayer from "./BarraPlayer";

// ESQUELETO DE TODAS AS PÁGINAS
export default function Estrutura() {
  const { pathname } = useLocation();
  const pageKey = pathname.split("/membro/")[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pageKey]);

  return (
    <div className="grain flex min-h-screen flex-col">
      <FiltrosSvg />
      <Menu />
      <main key={pageKey} className="flex-1 animate-page">
        <Outlet />
      </main>
      <Rodape />
      <BarraPlayer />
    </div>
  );
}
