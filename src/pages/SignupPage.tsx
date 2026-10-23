import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import AuthShell, { Field } from "../components/profile/AuthShell";
import Sticker from "../components/ui/Sticker";
import { useAuth } from "../context/AuthContext";
import { PENDING_QUIZ_KEY } from "../services/auth";
import type { QuizResult } from "../types";

export default function SignupPage() {
  const { user, signup, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const pending = sessionStorage.getItem(PENDING_QUIZ_KEY);

  if (user && !done) return <Navigate to="/perfil" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[a-z0-9_.]{3,20}$/i.test(form.username.replace(/^@/, ""))) return setError("O @ precisa ter de 3 a 20 letras, números, ponto ou _.");
    if (form.password.length < 6) return setError("A senha precisa de pelo menos 6 caracteres.");
    if (form.password !== form.confirm) return setError("As senhas não batem.");
    setBusy(true);
    try {
      setDone(true);
      await signup(form);
    } catch (err) {
      setDone(false);
      setError(err instanceof Error ? err.message : "Não deu pra criar a conta.");
    } finally {
      setBusy(false);
    }
  };

  if (user && done) {
    const savePending = () => {
      if (pending) {
        updateProfile({ quiz: JSON.parse(pending) as QuizResult });
        sessionStorage.removeItem(PENDING_QUIZ_KEY);
      }
      navigate("/perfil");
    };
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <Sticker id="heart" className="w-28 animate-pop" />
        <h1 className="mt-6 font-display text-6xl uppercase leading-none md:text-8xl">Bem-vindo, {user.name.split(" ")[0]}</h1>
        {pending ? (
          <>
            <p className="mt-4 font-type text-lg text-dust">Você já tinha feito o quiz. Quer guardar o resultado no perfil?</p>
            <button onClick={savePending} className="btn-bone mt-8">
              Salvar e ver meu perfil
            </button>
          </>
        ) : (
          <>
            <p className="mt-4 font-type text-lg text-dust">
              Quer descobrir que tipo de barulho combina com você? São 20 perguntas e o resultado vira um patch no seu perfil.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate("/quiz")} className="btn-bone">
                Fazer o quiz
              </button>
              <button onClick={() => navigate("/perfil")} className="btn-punk">
                Depois
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <AuthShell title="Criar conta" bubble="Bem-vindo ao porão.">
      <form onSubmit={submit} className="mt-8 space-y-5">
        <Field label="Nome" name="name" value={form.name} onChange={set("name")} autoComplete="name" />
        <Field label="@usuário" name="username" value={form.username} onChange={set("username")} autoComplete="username" placeholder="ex: fantasma_do_porao" />
        <Field label="E-mail" name="email" type="email" value={form.email} onChange={set("email")} autoComplete="email" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Senha" name="password" type="password" value={form.password} onChange={set("password")} autoComplete="new-password" />
          <Field label="Repete a senha" name="confirm" type="password" value={form.confirm} onChange={set("confirm")} autoComplete="new-password" />
        </div>
        {error && <p className="font-marker text-lg text-blood">{error}</p>}
        <button type="submit" disabled={busy} className="btn-bone w-full justify-center bg-ink text-bone disabled:opacity-50">
          {busy ? "Criando..." : "Criar conta"}
        </button>
        <p className="font-type">
          Já tem conta?{" "}
          <Link to="/entrar" className="font-bold underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
