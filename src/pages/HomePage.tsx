import BlackBookTeaser from "../components/home/BlackBookTeaser";
import GenreCassettes from "../components/home/GenreCassettes";
import Hero from "../components/home/Hero";
import QuizCta from "../components/home/QuizCta";
import StickerWall from "../components/home/StickerWall";
import Marquee from "../components/ui/Marquee";
import { SLOGANS } from "../data/featured";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="-rotate-1">
        <Marquee items={SLOGANS} />
      </div>
      <StickerWall />
      <div className="rotate-1">
        <Marquee items={["ROCK", "METAL", "PUNK", "GRUNGE", "GÓTICO", "SHOEGAZE", "STONER", "HARDCORE", "EMO", "PROG"]} reverse dark />
      </div>
      <GenreCassettes />
      <QuizCta />
      <BlackBookTeaser />
    </>
  );
}
