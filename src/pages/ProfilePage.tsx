import { useState } from "react";
import { Link, Navigate } from "react-router";
import ProfileEditor, { COVERS } from "../components/profile/ProfileEditor";
import QuizResultView, { GenrePatch } from "../components/quiz/QuizResultView";
import Icon from "../components/ui/Icon";
import Sticker from "../components/ui/Sticker";
import XeroxImage from "../components/ui/XeroxImage";
import { useAuth } from "../context/AuthContext";
import { tilt } from "../lib/utils";

export default function ProfilePage() {
  const { user, logout, toggleFavorite } = useAuth();
  const [editing, setEditing] = useState(false);

  if (!user) return <Navigate to="/entrar" replace />;
  const { profile } = user;
  const since = new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div>
      {/* CAPA */}
      <section className={`relative h-56 border-b-[3px] border-bone md:h-72 ${profile.coverImage ? "bg-ink" : COVERS[profile.cover].className}`}>
        {profile.coverImage && <img src={profile.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />}
        {profile.status && (
          <div className="bubble after:hidden absolute bottom-10 right-4 max-w-xs rotate-[3deg] px-4 py-2 md:right-12">
            <p className="font-type text-xs text-ash">tocando na cabeça</p>
            <p className="font-marker text-lg leading-tight">{profile.status}</p>
          </div>
        )}
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="relative z-10 flex flex-wrap items-end gap-6">
          <div className={`-mt-20 grid h-40 w-40 place-items-center overflow-hidden rounded-full border-[4px] border-bone bg-ink shadow-[8px_8px_0_#000] md:-mt-24 md:h-48 md:w-48 ${profile.avatarImage ? "" : "p-5"}`}>
            {profile.avatarImage ? (
              <img src={profile.avatarImage} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <Sticker id={profile.avatar} className="h-full w-full" />
            )}
          </div>
          <div className="pt-4">
            <h1 className="font-display text-5xl uppercase leading-none md:text-7xl">{user.name}</h1>
            <p className="font-marker text-xl text-dust">@{user.username}</p>
            <p className="font-type text-sm text-ash">no porão desde {since}</p>
          </div>
          <div className="ml-auto flex flex-wrap gap-3 pb-2">
            <button onClick={() => setEditing((e) => !e)} className="btn-bone">
              {editing ? "Fechar edição" : "Personalizar"}
            </button>
            <button onClick={logout} className="btn-punk">
              Sair
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          {profile.quiz && <GenrePatch result={profile.quiz} small />}
          <p className="font-type text-dust">
            {profile.favorites.length} banda{profile.favorites.length === 1 ? "" : "s"} favorita{profile.favorites.length === 1 ? "" : "s"}
          </p>
        </div>

        {profile.bio && (
          <p className="paper mt-8 max-w-2xl rotate-[-0.6deg] p-5 font-type text-lg shadow-[6px_6px_0_#000]">{profile.bio}</p>
        )}

        {editing && (
          <div className="mt-12">
            <ProfileEditor profile={profile} onDone={() => setEditing(false)} />
          </div>
        )}

        {/* FAVORITAS */}
        <section className="mt-20">
          <h2 className="mb-8 font-display text-5xl uppercase md:text-7xl">Bandas favoritas</h2>
          {profile.favorites.length === 0 ? (
            <div className="border-[3px] border-dashed border-ash p-8 text-center">
              <p className="font-marker text-2xl text-dust">Nenhuma ainda.</p>
              <p className="mt-2 font-type text-fog">Abre a página de uma banda e aperta Favoritar.</p>
              <Link to="/buscar" className="btn-punk mt-6">
                Buscar bandas
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {profile.favorites.map((b) => (
                <div key={b.id} className="group relative" style={{ rotate: `${tilt(b.id, 4)}deg` }}>
                  <Link to={`/banda/${b.id}`} className="photo-sticker block">
                    <XeroxImage src={b.image} alt={b.name} className="aspect-square w-full" />
                    <p className="mt-1 truncate text-center font-marker text-ink">{b.name}</p>
                  </Link>
                  <button
                    onClick={() => toggleFavorite(b)}
                    className="absolute -right-3 -top-3 grid h-9 w-9 place-items-center rounded-full border-[3px] border-ink bg-bone text-ink opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Remover ${b.name}`}
                  >
                    <Icon name="close" className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* TRIBO */}
        <section className="mt-24">
          <h2 className="mb-10 font-display text-5xl uppercase md:text-7xl">Minha tribo</h2>
          {profile.quiz ? (
            <>
              <QuizResultView result={profile.quiz} />
              <Link to="/quiz" className="btn-punk mt-12">
                Refazer o quiz
              </Link>
            </>
          ) : (
            <div className="paper flex flex-wrap items-center justify-between gap-6 p-8 shadow-[10px_10px_0_#000]">
              <div>
                <p className="font-marker text-3xl">Você ainda não fez o quiz.</p>
                <p className="mt-1 font-type">20 perguntas pra descobrir sua tribo, ganhar um patch e uma lista de bandas.</p>
              </div>
              <Link to="/quiz" className="btn-bone bg-ink text-bone">
                Fazer o quiz
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
