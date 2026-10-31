import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useUsuario } from "../../contexto/ContextoUsuario";
import Icone from "../interface/Icone";
import Adesivo from "../interface/Adesivo";

const LINKS = [
  { to: "/buscar", label: "Buscar" },
  { to: "/livro-negro", label: "Livro Negro" },
  { to: "/quiz", label: "Quiz" },
];

// MENU FIXO NO TOPO
export default function Menu() {
  const { user } = useUsuario();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-display text-xl uppercase tracking-wide transition-colors ${isActive ? "text-bone underline decoration-[3px] underline-offset-8" : "text-fog hover:text-bone"}`;

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-bone bg-ink/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <Adesivo id="bolt" className="h-9 w-9 transition-transform group-hover:rotate-12" />
          <span className="glitch rough font-display text-3xl tracking-wider" data-text="ROCKIFY">
            ROCKIFY
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <Link to="/perfil" className="flex items-center gap-2 border-[3px] border-bone px-3 py-1 hover:bg-bone hover:text-ink">
              {user.profile.avatarImage ? (
                <img src={user.profile.avatarImage} alt="" className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <Adesivo id={user.profile.avatar} className="h-7 w-7" diecut={false} />
              )}
              <span className="font-marker">@{user.username}</span>
            </Link>
          ) : (
            <Link to="/entrar" className="btn-bone py-1.5 text-base">
              Entrar
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Abrir menu" aria-expanded={open}>
          <Icone name={open ? "close" : "menu"} className="h-8 w-8" />
        </button>
      </nav>

      {open && (
        <div className="torn-bottom flex flex-col gap-4 bg-bone px-6 pb-10 pt-4 text-ink md:hidden">
          {[...LINKS, user ? { to: "/perfil", label: `@${user.username}` } : { to: "/entrar", label: "Entrar" }].map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="font-display text-4xl uppercase">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
