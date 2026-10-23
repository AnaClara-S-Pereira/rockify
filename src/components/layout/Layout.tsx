import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import SvgFilters from "../ui/SvgFilters";
import Footer from "./Footer";
import Navbar from "./Navbar";
import PlayerBar from "./PlayerBar";

export default function Layout() {
  const { pathname } = useLocation();
  const pageKey = pathname.split("/membro/")[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pageKey]);

  return (
    <div className="grain flex min-h-screen flex-col">
      <SvgFilters />
      <Navbar />
      <main key={pageKey} className="flex-1 animate-page">
        <Outlet />
      </main>
      <Footer />
      <PlayerBar />
    </div>
  );
}
