"use client";

/**
 * AppHeader — barra superior do hub.
 * Navegação entre Jogos / Progresso / Professores + atalhos DUA.
 */

import { Dices, Contrast, Type } from "lucide-react";
import { useA11y } from "@/components/a11y/a11y-provider";
import { hrefFor, type Route } from "@/lib/router";
import { cn } from "@/lib/utils";

const NAV: { label: string; route: Route; match: string }[] = [
  { label: "Jogos", route: { view: "hub" }, match: "hub" },
  { label: "Progresso", route: { view: "progress" }, match: "progress" },
  { label: "Professores", route: { view: "teacher" }, match: "teacher" },
];

export function AppHeader({ current }: { current: Route["view"] }) {
  const a11y = useA11y();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2.5 sm:gap-4 sm:px-6">
        {/* Marca */}
        <a
          href={hrefFor({ view: "hub" })}
          className="flex items-center gap-2.5 rounded-xl focus-visible:outline-offset-4"
          aria-label="Ludus — página inicial"
        >
          <span
            className="flex size-10 items-center justify-center rounded-2xl border-2 text-white shadow-[0_3px_0_#8941d4] sm:size-11"
            style={{ background: "#a560e8", borderColor: "#8941d4" }}
            aria-hidden
          >
            <Dices className="size-5 sm:size-6" strokeWidth={2.4} />
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-xl font-bold tracking-tight text-ink">
              Ludus
            </span>
            <span className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
              Jogos do Ensino Médio
            </span>
          </span>
        </a>

        {/* Navegação */}
        <nav
          className="ml-auto flex items-center gap-1 sm:gap-1.5"
          aria-label="Navegação principal"
        >
          {NAV.map((item) => {
            const active = current === item.match;
            return (
              <a
                key={item.match}
                href={hrefFor(item.route)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-xl px-3 font-display text-[0.82rem] font-bold transition-colors sm:px-4 sm:text-sm",
                  active
                    ? "bg-ink text-white shadow-[0_3px_0_#26242f]"
                    : "text-ink-soft hover:bg-cloud hover:text-ink",
                )}
              >
                {item.label}
              </a>
            );
          })}

          {/* Atalhos DUA (persistentes) */}
          <span
            className="mx-1 hidden h-8 w-0.5 rounded-full bg-border sm:block"
            aria-hidden
          />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => a11y.toggle("highContrast")}
              aria-pressed={a11y.highContrast}
              aria-label="Alternar alto contraste"
              title="Alto contraste"
              className={cn(
                "flex size-11 items-center justify-center rounded-xl border-2 transition-colors",
                a11y.highContrast
                  ? "border-linguagens bg-linguagens-soft text-linguagens-dark"
                  : "border-border bg-white text-ink-soft hover:border-ink-faint",
              )}
            >
              <Contrast className="size-5" strokeWidth={2.2} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => a11y.toggle("largeText")}
              aria-pressed={a11y.largeText}
              aria-label="Alternar texto amplo"
              title="Texto amplo"
              className={cn(
                "flex size-11 items-center justify-center rounded-xl border-2 transition-colors",
                a11y.largeText
                  ? "border-linguagens bg-linguagens-soft text-linguagens-dark"
                  : "border-border bg-white text-ink-soft hover:border-ink-faint",
              )}
            >
              <Type className="size-5" strokeWidth={2.2} aria-hidden />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
