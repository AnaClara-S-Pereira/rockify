import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { SEARCH_HINTS } from "../../dados/destaques";
import Icone from "./Icone";

// CAMPO DE BUSCA COM SUGESTÕES QUE TROCAM SOZINHAS
export default function CampoBusca({ initial = "", big = false, onSearch }: { initial?: string; big?: boolean; onSearch?: (q: string) => void }) {
  const [value, setValue] = useState(initial);
  const [hint, setHint] = useState(0);
  const navigate = useNavigate();

  useEffect(() => setValue(initial), [initial]);

  useEffect(() => {
    const id = setInterval(() => setHint((h) => (h + 1) % SEARCH_HINTS.length), 2600);
    return () => clearInterval(id);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    if (onSearch) onSearch(q);
    else navigate(`/buscar?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={submit} className="group relative flex w-full" role="search">
      <label htmlFor="band-search" className="sr-only">
        Buscar banda
      </label>
      <input
        id="band-search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Tenta: ${SEARCH_HINTS[hint]}`}
        className={`w-full border-[3px] border-bone bg-ink font-type text-bone placeholder:text-ash focus:bg-soot focus:outline-none ${big ? "px-5 py-5 text-xl md:text-2xl" : "px-4 py-3 text-lg"}`}
        autoComplete="off"
      />
      <button
        type="submit"
        className={`flex items-center gap-2 border-[3px] border-l-0 border-bone bg-bone font-display uppercase text-ink transition-colors hover:bg-dust ${big ? "px-6 text-2xl" : "px-4 text-lg"}`}
      >
        <Icone name="search" className="h-6 w-6" />
        <span className="hidden sm:inline">Achar</span>
      </button>
    </form>
  );
}
