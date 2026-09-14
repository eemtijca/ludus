import { AppRoot } from "@/components/app-shell/app-root";
import { GAMES } from "@/lib/catalog";

export function generateStaticParams() {
  return GAMES.map((game) => ({ gameId: game.id }));
}

export default function GamePage() {
  return <AppRoot />;
}
