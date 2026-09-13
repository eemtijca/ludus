"use client";

/**
 * AppBottomNav: navegação principal em telas pequenas.
 * Itens com ícone e rótulo; oculta a partir de sm (a topbar assume).
 */

import { Dices, Trophy, GraduationCap } from "lucide-react";
import { hrefFor, type Route } from "@/lib/router";
import { cn } from "@/lib/utils";

const ITEMS: { label: string; route: Route; match: string; Icon: typeof Dices }[] = [
  { label: "Jogos", route: { view: "hub" }, match: "hub", Icon: Dices },
  { label: "Progresso", route: { view: "progress" }, match: "progress", Icon: Trophy },
  { label: "Professores", route: { view: "teacher" }, match: "teacher", Icon: GraduationCap },
];

export function AppBottomNav({ current, hidden }: { current: Route["view"]; hidden?: boolean }) {
  return (
    <nav
      aria-label="Navegação principal"
      hidden={hidden}
      className={cn(
        "bottom-nav fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-1 px-2 pt-1 sm:hidden",
        hidden && "invisible",
      )}
    >
      {ITEMS.map(({ label, route, match, Icon }) => {
        const active = current === match;
        return (
          <a
            key={match}
            href={hrefFor(route)}
            aria-current={active ? "page" : undefined}
            className="bottom-nav-link"
          >
            <Icon className="size-6" strokeWidth={active ? 2.6 : 2.2} aria-hidden />
            {label}
          </a>
        );
      })}
    </nav>
  );
}
