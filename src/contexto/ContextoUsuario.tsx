import { createContext, useContext, useState, type ReactNode } from "react";
import * as auth from "../servicos/autenticacao";
import type { FavoriteBand, Profile, User } from "../tipos";

interface AuthValue {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (data: { name: string; username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (patch: Partial<Profile>) => void;
  toggleFavorite: (band: FavoriteBand) => void;
  isFavorite: (id: string) => boolean;
}

const AuthContext = createContext<AuthValue | null>(null);

// USUÁRIO LOGADO E AÇÕES DE LOGIN, CADASTRO, PERFIL E FAVORITAS
export function ProvedorUsuario({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => auth.currentUser());

  async function login(identifier: string, password: string) {
    setUser(await auth.login(identifier, password));
  }

  async function signup(data: { name: string; username: string; email: string; password: string }) {
    setUser(await auth.signup(data));
  }

  function logout() {
    auth.logout();
    setUser(null);
  }

  function updateProfile(patch: Partial<Profile>) {
    if (user) setUser(auth.saveProfile(user.id, patch));
  }

  function toggleFavorite(band: FavoriteBand) {
    if (!user) return;
    const list = user.profile.favorites;
    const next = list.some((b) => b.id === band.id) ? list.filter((b) => b.id !== band.id) : [band, ...list];
    setUser(auth.saveProfile(user.id, { favorites: next }));
  }

  const isFavorite = (id: string) => !!user?.profile.favorites.some((b) => b.id === id);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUsuario(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useUsuario precisa estar dentro de <ProvedorUsuario>");
  return ctx;
}
