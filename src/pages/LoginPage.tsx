import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import AuthShell, { Field } from "../components/profile/AuthShell";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/perfil" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(identifier, password);
      navigate("/perfil");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não deu pra entrar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Entrar" bubble="De volta pro barulho?">
      <form onSubmit={submit} className="mt-8 space-y-6">
        <Field label="E-mail ou @usuário" name="identifier" value={identifier} onChange={setIdentifier} autoComplete="username" />
        <Field label="Senha" name="password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        {error && <p className="font-marker text-lg text-blood">{error}</p>}
        <button type="submit" disabled={busy} className="btn-bone w-full justify-center bg-ink text-bone disabled:opacity-50">
          {busy ? "Entrando..." : "Entrar"}
        </button>
        <p className="font-type">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="font-bold underline underline-offset-4">
            Criar conta
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
