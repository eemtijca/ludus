"use client";

/**
 * AppHeader: barra superior fixa.
 * Marca à esquerda e atalhos de acessibilidade à direita; a navegação
 * entre visões fica na barra inferior (mobile) e aqui a partir de sm.
 */

import { Dices, Contrast, Type, Trophy, GraduationCap } from "lucide-react";
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
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 sm:px-6">
        {/* Marca */}
        <a
          href={hrefFor({ view: "hub" })}
          className="flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-offset-4"
          aria-label="Ludus, página inicial"
        >
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-success text-white shadow-[0_3px_0_var(--success-dark)] sm:size-11"
            aria-hidden
          >
            <Dices className="size-5 sm:size-6" strokeWidth={2.4} />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
              Ludus
            </span>
            <span className="truncate text-[0.6rem] font-bold uppercase tracking-[0.12em] text-ink-faint sm:text-[0.66rem]">
              Jogos do Ensino Médio
            </span>
          </span>
        </a>

        {/* Navegação (a partir de sm; no mobile vive na barra inferior) */}
        <nav
          className="ml-auto hidden items-center gap-1.5 sm:flex"
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
                  "inline-flex min-h-11 items-center gap-1.5 rounded-xl px-4 font-display text-sm font-bold transition-colors",
                  active
                    ? "bg-ink text-white shadow-[0_3px_0_#26242f]"
                    : "text-ink-soft hover:bg-cloud hover:text-ink",
                )}
              >
                {item.match === "hub" && <Dices className="size-4" strokeWidth={2.4} aria-hidden />}
                {item.match === "progress" && (
                  <Trophy className="size-4" strokeWidth={2.4} aria-hidden />
                )}
                {item.match === "teacher" && (
                  <GraduationCap className="size-4" strokeWidth={2.4} aria-hidden />
                )}
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Atalhos de acessibilidade (sempre visíveis) */}
        <div className="ml-auto flex items-center gap-1.5 sm:ml-2">
          <button
            type="button"
            onClick={() => a11y.toggle("highContrast")}
            aria-pressed={a11y.highContrast}
            aria-label="Alternar alto contraste"
            title="Alto contraste"
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl border-2 transition-colors",
              a11y.highContrast
                ? "border-success bg-success-soft text-success-dark"
                : "border-border bg-surface text-ink-soft hover:border-ink-faint",
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
              "flex size-11 shrink-0 items-center justify-center rounded-xl border-2 transition-colors",
              a11y.largeText
                ? "border-success bg-success-soft text-success-dark"
                : "border-border bg-surface text-ink-soft hover:border-ink-faint",
            )}
          >
            <Type className="size-5" strokeWidth={2.2} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
