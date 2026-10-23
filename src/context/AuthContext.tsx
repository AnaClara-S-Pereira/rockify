import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import * as auth from "../services/auth";
import type { FavoriteBand, Profile, User } from "../types";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => auth.currentUser());

  const login = useCallback(async (identifier: string, password: string) => {
    setUser(await auth.login(identifier, password));
  }, []);

  const signup = useCallback(async (data: { name: string; username: string; email: string; password: string }) => {
    setUser(await auth.signup(data));
  }, []);

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Profile>) => {
      if (user) setUser(auth.saveProfile(user.id, patch));
    },
    [user],
  );

  const toggleFavorite = useCallback(
    (band: FavoriteBand) => {
      if (!user) return;
      const list = user.profile.favorites;
      const next = list.some((b) => b.id === band.id) ? list.filter((b) => b.id !== band.id) : [band, ...list];
      setUser(auth.saveProfile(user.id, { favorites: next }));
    },
    [user],
  );

  const isFavorite = useCallback((id: string) => !!user?.profile.favorites.some((b) => b.id === id), [user]);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
