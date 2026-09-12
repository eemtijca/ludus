"use client";

/**
 * Ludus — casca da aplicação.
 * Roteamento client-side por hash:
 *   #/ (hub) · #/jogo/<id> · #/progresso · #/professores
 */

import { useEffect } from "react";
import { A11yProvider } from "@/components/a11y/a11y-provider";
import { AppHeader } from "@/components/app-shell/app-header";
import { AppFooter } from "@/components/app-shell/app-footer";
import { HubView } from "@/components/hub/hub-view";
import { ProgressDashboard } from "@/components/progress/progress-dashboard";
import { TeacherPanel } from "@/components/teacher/teacher-panel";
import { GAME_COMPONENTS } from "@/games/registry";
import { GAME_BY_ID } from "@/lib/catalog";
import { useHashRoute, hrefFor } from "@/lib/router";
import { useProgress } from "@/lib/progress";
import { stopSpeech } from "@/lib/speech";

export default function Page() {
  return (
    <A11yProvider>
      <App />
    </A11yProvider>
  );
}

function App() {
  const { route, navigate } = useHashRoute();
  const loadProgress = useProgress((s) => s.load);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Interrompe leitura órfã ao trocar de visão via hash.
  useEffect(() => {
    const handler = () => stopSpeech();
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const exitGame = () => navigate({ view: "hub" });

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
            <h1 className="font-display text-2xl font-bold text-ink">
              Jogo não encontrado
            </h1>
            <p className="text-sm text-ink-soft">
              O endereço aponta para um jogo que não existe (ainda).
            </p>
            <a
              href={hrefFor({ view: "hub" })}
              className="ludus-btn ludus-btn-ink"
            >
              Voltar aos jogos
            </a>
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
        key={route.view === "game" ? route.gameId : route.view}
        className="anim-fade-up flex-1"
      >
        {content}
      </main>
      <AppFooter />
    </div>
  );
}
