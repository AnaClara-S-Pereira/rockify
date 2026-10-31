import { Link } from "react-router";
import { GENRES } from "../../dados/generos";
import Adesivo from "../interface/Adesivo";

// CHAMADA DO QUIZ NA HOME
export default function ChamadaQuiz() {
  return (
    <section className="paper torn-top torn-bottom relative overflow-hidden py-28">
      <div className="halftone-dark absolute inset-0 opacity-50" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="font-display text-6xl leading-[0.92] md:text-8xl">Que tipo de barulho é você?</h2>
          <p className="mt-6 max-w-md font-type text-lg">
            20 perguntas, 13 tribos possíveis. No final você ganha um patch pro perfil, bandas e músicas pra ouvir na hora.
          </p>
          <Link to="/quiz" className="btn-bone mt-8 bg-ink text-bone">
            Fazer o quiz
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {GENRES.slice(0, 9).map((g, i) => (
            <span
              key={g.id}
              className="stitch flex items-center gap-2 rounded-full bg-ink px-4 py-2 font-marker text-bone"
              style={{ rotate: `${(i % 3) * 4 - 4}deg` }}
            >
              <Adesivo id={g.sticker} className="h-6 w-6" diecut={false} />
              {g.arquetipo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
