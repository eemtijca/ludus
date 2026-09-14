"use client";

/**
 * Roteador da aplicação sobre as rotas reais do App Router, sem hash.
 * Rotas: / (hub), /jogo/<id>, /progresso e /professores.
 */

import { useCallback, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

export type Route =
  { view: "hub" } | { view: "game"; gameId: string } | { view: "progress" } | { view: "teacher" };

export function parsePath(pathname: string): Route {
  const parts = pathname.split("?")[0].split("/").filter(Boolean);
  if (parts.length === 0) return { view: "hub" };
  if (parts[0] === "jogo" && parts[1]) {
    return { view: "game", gameId: decodeURIComponent(parts[1]) };
  }
  if (parts[0] === "progresso") return { view: "progress" };
  if (parts[0] === "professores") return { view: "teacher" };
  return { view: "hub" };
}

export function hrefFor(route: Route): string {
  switch (route.view) {
    case "game":
      return `/jogo/${route.gameId}`;
    case "progress":
      return "/progresso";
    case "teacher":
      return "/professores";
    default:
      return "/";
  }
}

export function useAppRoute(): {
  route: Route;
  navigate: (route: Route) => void;
} {
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const route = useMemo(() => parsePath(pathname), [pathname]);

  // Troca de visão recomeça do topo: nada de título cortado pelo scroll antigo.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  const navigate = useCallback(
    (next: Route) => {
      router.push(hrefFor(next));
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [router],
  );

  return { route, navigate };
}
