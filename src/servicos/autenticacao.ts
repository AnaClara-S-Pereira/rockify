import type { Profile, StoredUser, User } from "../tipos";

const USERS_KEY = "rockify:users";
const SESSION_KEY = "rockify:session";
export const PENDING_QUIZ_KEY = "rockify:pendingQuiz";

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function strip({ passHash: _ignored, ...user }: StoredUser): User {
  return user;
}

async function hash(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(`rockify::${text}`);
  if (!crypto.subtle) return [...bytes].reduce((h, b) => Math.imul(h ^ b, 16777619) >>> 0, 2166136261).toString(16);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function newId(): string {
  return crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export const DEFAULT_PROFILE: Profile = {
  bio: "",
  avatar: "skull",
  cover: "halftone",
  status: "",
  favorites: [],
};

// CADASTRO, LOGIN E PERFIL GUARDADOS NO LOCALSTORAGE
export async function signup(data: { name: string; username: string; email: string; password: string }): Promise<User> {
  const users = readUsers();
  const email = data.email.trim().toLowerCase();
  const username = data.username.trim().toLowerCase().replace(/^@/, "");
  if (users.some((u) => u.email === email)) throw new Error("Esse e-mail já tá no rolê.");
  if (users.some((u) => u.username === username)) throw new Error("Esse @ já tem dono.");

  const user: StoredUser = {
    id: newId(),
    name: data.name.trim(),
    username,
    email,
    createdAt: new Date().toISOString(),
    profile: { ...DEFAULT_PROFILE },
    passHash: await hash(data.password),
  };
  writeUsers([...users, user]);
  localStorage.setItem(SESSION_KEY, user.id);
  return strip(user);
}

export async function login(identifier: string, password: string): Promise<User> {
  const id = identifier.trim().toLowerCase().replace(/^@/, "");
  const user = readUsers().find((u) => u.email === id || u.username === id);
  if (!user || user.passHash !== (await hash(password))) throw new Error("E-mail/usuário ou senha errados.");
  localStorage.setItem(SESSION_KEY, user.id);
  return strip(user);
}

export function currentUser(): User | null {
  const id = localStorage.getItem(SESSION_KEY);
  const user = readUsers().find((u) => u.id === id);
  return user ? strip(user) : null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function saveProfile(userId: string, patch: Partial<Profile>): User {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index < 0) throw new Error("Usuário não encontrado.");
  users[index] = { ...users[index], profile: { ...users[index].profile, ...patch } };
  writeUsers(users);
  return strip(users[index]);
}
