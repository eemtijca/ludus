"use client";

/**
 * Hash router minimalista — navegação client-side em uma única rota.
 * Rotas: #/ (hub) · #/jogo/<id> · #/progresso · #/professores
 * Funciona no sandbox, em qualquer hospedagem estática ou Node.
 */

import { useCallback, useEffect, useState } from "react";

export type Route =
  | { view: "hub" }
  | { view: "game"; gameId: string }
  | { view: "progress" }
  | { view: "teacher" };

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#/, "").replace(/^\/+/, "").replace(/\/+$/, "");
  if (!clean) return { view: "hub" };

  const parts = clean.split("/");
  if (parts[0] === "jogo" && parts[1])
    return { view: "game", gameId: parts[1] };
  if (parts[0] === "progresso") return { view: "progress" };
  if (parts[0] === "professores") return { view: "teacher" };
  return { view: "hub" };
}

export function hrefFor(route: Route): string {
  switch (route.view) {
    case "game":
      return `#/jogo/${route.gameId}`;
    case "progress":
      return "#/progresso";
    case "teacher":
      return "#/professores";
    default:
      return "#/";
  }
}

export function useHashRoute(): {
  route: Route;
  navigate: (route: Route) => void;
} {
  const [route, setRoute] = useState<Route>({ view: "hub" });

  useEffect(() => {
    let lastHash = window.location.hash;
    const sync = () => {
      setRoute(parseHash(window.location.hash));
      // Troca de visão via hash (inclui botões voltar/avançar do navegador)
      // recomeça do topo — nada de título cortado pelo scroll antigo.
      if (window.location.hash !== lastHash) {
        lastHash = window.location.hash;
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const navigate = useCallback((next: Route) => {
    const href = hrefFor(next);
    if (window.location.hash === href) {
      setRoute(next);
    } else {
      window.location.hash = href;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return { route, navigate };
}
