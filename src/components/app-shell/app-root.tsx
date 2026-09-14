"use client";

/**
 * AppRoot: casca da aplicação, usada por todas as rotas.
 *   / (hub) · /jogo/<id> · /progresso · /professores
 * Em telas pequenas, a navegação principal vive na barra inferior;
 * dentro dos jogos ela fica oculta para não competir com o palco.
 */

import { useEffect } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/app-shell/app-header";
import { AppBottomNav } from "@/components/app-shell/app-bottom-nav";
import { AppFooter } from "@/components/app-shell/app-footer";
import { HubView } from "@/components/hub/hub-view";
import { ProgressDashboard } from "@/components/progress/progress-dashboard";
import { TeacherPanel } from "@/components/teacher/teacher-panel";
import { GAME_COMPONENTS } from "@/games/registry";
import { GAME_BY_ID } from "@/lib/catalog";
import { useAppRoute, hrefFor } from "@/lib/router";
import { useProgress } from "@/lib/progress";
import { stopSpeech } from "@/lib/speech";

export function AppRoot() {
  const { route, navigate } = useAppRoute();
  const loadProgress = useProgress((s) => s.load);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Interrompe leitura órfã ao trocar de visão.
  useEffect(() => {
    stopSpeech();
  }, [route]);

  const exitGame = () => navigate({ view: "hub" });
  const inGame = route.view === "game";

  let content: React.ReactNode;

  switch (route.view) {
    case "game": {
      const meta = GAME_BY_ID[route.gameId];
      const Component = GAME_COMPONENTS[route.gameId];
      if (meta && Component) {
        content = <Component key={route.gameId} onExit={exitGame} />;
      } else {
        content = (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
            <h1 className="font-display text-2xl font-bold text-ink">Jogo não encontrado</h1>
            <p className="text-sm text-ink-soft">O endereço aponta para um jogo que não existe.</p>
            <Link href={hrefFor({ view: "hub" })} className="ludus-btn ludus-btn-ink">
              Voltar aos jogos
            </Link>
          </div>
        );
      }
      break;
    }
    case "progress":
      content = <ProgressDashboard />;
      break;
    case "teacher":
      content = <TeacherPanel />;
      break;
    default:
      content = <HubView />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader current={route.view} />
      <main
        key={inGame ? route.gameId : route.view}
        className={`anim-fade-up flex-1 ${inGame ? "" : "pb-nav sm:pb-0"}`}
      >
        {content}
      </main>
      {!inGame && <AppFooter />}
      <AppBottomNav current={route.view} hidden={inGame} />
    </div>
  );
}
