import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import QuizResultView from "../components/quiz/QuizResultView";
import Sticker from "../components/ui/Sticker";
import { useAuth } from "../context/AuthContext";
import { GENRES } from "../data/genres";
import { QUIZ } from "../data/quiz";
import { tilt } from "../lib/utils";
import { PENDING_QUIZ_KEY } from "../services/auth";
import type { GenreId, QuizResult } from "../types";

function computeResult(answers: number[]): QuizResult {
  const score = Object.fromEntries(GENRES.map((g) => [g.id, 0])) as Record<GenreId, number>;
  answers.forEach((choice, q) => {
    const points = QUIZ[q].opcoes[choice].pontos;
    for (const [id, value] of Object.entries(points)) score[id as GenreId] += value ?? 0;
  });
  const total = Object.values(score).reduce((a, b) => a + b, 0) || 1;
  const ranking = (Object.entries(score) as [GenreId, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([id, v]) => ({ id, pct: Math.round((v / total) * 100) }));
  return { genre: ranking[0].id, ranking, date: new Date().toISOString() };
}

export default function QuizPage() {
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  const answer = useCallback(
    (choice: number) => {
      const next = [...answers.slice(0, step), choice];
      setAnswers(next);
      if (step + 1 < QUIZ.length) {
        setStep(step + 1);
        return;
      }
      const final = computeResult(next);
      setResult(final);
      if (user) updateProfile({ quiz: final });
      else sessionStorage.setItem(PENDING_QUIZ_KEY, JSON.stringify(final));
    },
    [answers, step, user, updateProfile],
  );

  useEffect(() => {
    if (step < 0 || result) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= QUIZ[step].opcoes.length) answer(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, result, answer]);

  const restart = () => {
    setAnswers([]);
    setResult(null);
    setStep(0);
  };

  // RESULTADO
  if (result) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <QuizResultView result={result} />
        <div className="mt-16 flex flex-wrap gap-4">
          {user ? (
            <Link to="/perfil" className="btn-bone">
              Ver no meu perfil
            </Link>
          ) : (
            <Link to="/cadastro" className="btn-bone">
              Criar conta e salvar
            </Link>
          )}
          <button onClick={restart} className="btn-punk">
            Refazer o quiz
          </button>
        </div>
      </div>
    );
  }

  // INTRO
  if (step < 0) {
    return (
      <div className="relative mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center">
        <Sticker id="noise" className="absolute left-2 top-10 w-24 -rotate-12 animate-float md:w-32" />
        <Sticker id="knob" className="absolute bottom-10 right-4 w-20 animate-float md:w-28" />
        <h1 className="rough font-display text-7xl uppercase leading-[0.85] md:text-9xl">Que tipo de barulho é você?</h1>
        <p className="mt-6 max-w-lg font-type text-lg text-dust">
          {QUIZ.length} perguntas rápidas. No fim você descobre sua tribo, ganha um patch pro perfil e uma lista de bandas e músicas pra ouvir.
        </p>
        {!user && <p className="mt-3 font-marker text-fog">Dica: com conta, o resultado vai direto pro seu perfil.</p>}
        <button onClick={() => setStep(0)} className="btn-bone mt-10 text-2xl">
          Começar
        </button>
      </div>
    );
  }

  // PERGUNTA
  const q = QUIZ[step];
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="flex items-center justify-between font-type text-sm text-fog">
        <span>
          faixa {String(step + 1).padStart(2, "0")} de {QUIZ.length}
        </span>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="underline underline-offset-4 hover:text-bone">
            voltar
          </button>
        )}
      </div>
      <div className="mt-3 h-5 border-[3px] border-bone p-0.5">
        <div className="h-full bg-bone transition-[width] duration-500" style={{ width: `${(step / QUIZ.length) * 100}%` }} />
      </div>

      <h1 key={step} className="mt-12 animate-page font-display text-5xl uppercase leading-[0.95] md:text-7xl">
        {q.pergunta}
      </h1>

      <div key={`o${step}`} className="mt-10 grid gap-5 sm:grid-cols-2">
        {q.opcoes.map((o, i) => (
          <button
            key={o.texto}
            onClick={() => answer(i)}
            className={`group flex animate-pop items-start gap-4 p-5 text-left shadow-[6px_6px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0_#000] ${answers[step] === i ? "bg-dust text-ink" : "paper"}`}
            style={{ "--rot": `${tilt(o.texto, 2)}deg`, animationDelay: `${i * 70}ms` } as CSSProperties}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] border-ink font-display text-lg group-hover:bg-ink group-hover:text-bone">
              {i + 1}
            </span>
            <span className="font-type text-lg leading-snug">{o.texto}</span>
          </button>
        ))}
      </div>
      <p className="mt-8 text-center font-type text-xs text-ash">dá pra responder com as teclas 1 a 4</p>
    </div>
  );
}
