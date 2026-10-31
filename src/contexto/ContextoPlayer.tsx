import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { PlayableTrack } from "../tipos";

interface PlayerValue {
  current: PlayableTrack | null;
  playing: boolean;
  progress: number;
  play: (track: PlayableTrack, queue?: PlayableTrack[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (ratio: number) => void;
  close: () => void;
}

const PlayerContext = createContext<PlayerValue | null>(null);

// PLAYER GLOBAL: UM ÁUDIO SÓ PRO SITE INTEIRO, COM FILA DE FAIXAS
export function ProvedorPlayer({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<PlayableTrack[]>([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const current = queue[index] ?? null;

  useEffect(() => {
    const el = new Audio();
    el.preload = "auto";
    el.volume = 0.85;
    const onTime = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    audio.current = el;
    return () => {
      el.pause();
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    const el = audio.current;
    if (!el || !current) return;
    el.src = current.preview;
    el.play().catch(() => setPlaying(false));
  }, [current]);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const onEnd = () => setIndex((i) => (i + 1 < queue.length ? i + 1 : i));
    el.addEventListener("ended", onEnd);
    return () => el.removeEventListener("ended", onEnd);
  }, [queue.length]);

  const play = useCallback(
    (track: PlayableTrack, list?: PlayableTrack[]) => {
      if (current?.id === track.id) {
        const el = audio.current;
        if (el?.paused) el.play();
        else el?.pause();
        return;
      }
      const nextQueue = list && list.some((t) => t.id === track.id) ? list : [track];
      setQueue(nextQueue);
      setIndex(nextQueue.findIndex((t) => t.id === track.id));
    },
    [current],
  );

  const toggle = useCallback(() => {
    const el = audio.current;
    if (!el || !current) return;
    if (el.paused) el.play();
    else el.pause();
  }, [current]);

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, queue.length - 1)), [queue.length]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  const seek = useCallback((ratio: number) => {
    const el = audio.current;
    if (el?.duration) el.currentTime = ratio * el.duration;
  }, []);

  const close = useCallback(() => {
    audio.current?.pause();
    setQueue([]);
    setIndex(-1);
    setProgress(0);
  }, []);

  return (
    <PlayerContext.Provider value={{ current, playing, progress, play, toggle, next, prev, seek, close }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer precisa estar dentro de <ProvedorPlayer>");
  return ctx;
}
