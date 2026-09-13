"use client";

/**
 * PhaseStepper: trilha das 3 fases da partida (Explorar, Testar, Decidir).
 * Fase concluída ganha check verde; a atual recebe a cor da área.
 */

import { Check } from "lucide-react";
import { PHASE_LABELS, type Phase } from "@/games/_shared/use-game-session";
import { AREA_BG, AREA_BORDER } from "@/lib/area-styles";
import type { AreaId } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function PhaseStepper({ phase, area }: { phase: Phase; area: AreaId }) {
  const steps: Phase[] = [1, 2, 3];

  return (
    <ol className="flex items-center gap-1.5 sm:gap-2" aria-label="Fases da partida">
      {steps.map((step, idx) => {
        const done = step < phase;
        const current = step === phase;
        return (
          <li key={step} className="flex flex-1 items-center gap-1.5 sm:gap-2">
            <div
              className={cn(
                "flex min-h-11 min-w-11 flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 px-2 py-2 font-display text-[0.78rem] font-bold sm:text-sm",
                done
                  ? "border-success bg-success-soft text-success-dark"
                  : current
                    ? cn("border-transparent text-white", AREA_BG[area], AREA_BORDER[area])
                    : "border-border bg-cloud text-ink-faint",
              )}
              aria-current={current ? "step" : undefined}
            >
              {done ? (
                <>
                  <Check className="size-4 shrink-0" strokeWidth={3.5} aria-hidden />
                  <span className="hidden sm:inline">{PHASE_LABELS[step]}</span>
                  <span className="sr-only">fase {PHASE_LABELS[step]} concluída</span>
                </>
              ) : (
                <>
                  <span className="shrink-0" aria-hidden>
                    {step}.
                  </span>
                  <span className="truncate">{PHASE_LABELS[step]}</span>
                </>
              )}
            </div>
            {idx < steps.length - 1 && (
              <div
                aria-hidden
                className={cn(
                  "hidden h-1 w-3 shrink-0 rounded-full sm:block",
                  step < phase ? "bg-success" : "bg-line",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
