import { Link } from "react-router";
import Sticker from "../ui/Sticker";

export default function Footer() {
  return (
    <footer className="torn-top mt-24 bg-bone pb-28 pt-16 text-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <p className="font-display text-6xl leading-none">ROCKIFY</p>
          <p className="mt-3 max-w-sm font-type">
            Arquivo não-oficial de tudo que faz barulho. Do estádio ao porão, da lenda à banda que ensaia na garagem do vizinho.
          </p>
          <div className="mt-5 flex gap-3">
            <Sticker id="skull" className="h-10 w-10" />
            <Sticker id="heart" className="h-10 w-10" />
            <Sticker id="cassette" className="h-10 w-12" />
          </div>
        </div>
        <div className="flex flex-col gap-2 font-display text-xl uppercase">
          <Link to="/buscar" className="hover:underline">Buscar bandas</Link>
          <Link to="/livro-negro" className="hover:underline">Livro Negro</Link>
          <Link to="/quiz" className="hover:underline">Quiz</Link>
          <Link to="/perfil" className="hover:underline">Meu perfil</Link>
        </div>
        <div className="font-type text-sm leading-relaxed">
          <p className="font-marker text-lg">Dados vindos de:</p>
          <p>MusicBrainz (bandas, integrantes, discos), Wikipedia e Wikidata (biografias e fotos), Cover Art Archive (capas) e Deezer (prévias de 30s).</p>
          <p className="mt-3 text-ash"> Rockify 2026 © Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
