"use client";

/**
 * VerdictCard: tela de conclusão da partida.
 * Confete, selos conquistados, bastidor pedagógico expansível (com
 * expressões em MathJax) e ações: jogar de novo, outro caso ou voltar.
 */

import { useRef, useState } from "react";
import { ChevronDown, RotateCcw, ArrowRight, Trophy } from "lucide-react";
import { Confetti } from "./confetti";
import { BadgeTray } from "./badge-tray";
import { MathText } from "@/components/mathjax/math-text";
import type { AreaId } from "@/lib/catalog";
import { AREA_BG, AREA_BG_SOFT, AREA_BORDER, AREA_BTN } from "@/lib/area-styles";
import { stripLatex } from "@/lib/tex";
import type { BadgeId } from "@/lib/progress";
import type { VerdictPayload } from "@/games/_shared/use-game-session";
import { SpeakerButton } from "./speaker-button";
import { cn } from "@/lib/utils";

export function VerdictCard({
  verdict,
  badges,
  area,
  gameTitle,
  onReplay,
  onNextVariant,
  onExit,
}: {
  verdict: VerdictPayload;
  badges: BadgeId[];
  area: AreaId;
  gameTitle: string;
  onReplay: () => void;
  onNextVariant?: { label: string; onPick: () => void } | null;
  onExit: () => void;
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const fullText = [
    verdict.title,
    stripLatex(verdict.text),
    verdict.detail ? stripLatex(verdict.detail.speech ?? verdict.detail.text) : "",
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <section
      className={cn(
        "anim-bounce-in relative overflow-hidden rounded-3xl border-2 p-5 sm:p-8",
        AREA_BG_SOFT[area],
        AREA_BORDER[area],
      )}
      aria-labelledby="verdict-title"
    >
      <Confetti />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <span
          className={cn(
            "anim-wiggle flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-white/60 text-white sm:size-24",
            AREA_BG[area],
          )}
          aria-hidden
        >
          <Trophy className="size-10 sm:size-12" strokeWidth={2} />
        </span>

        <div>
          <p className="font-display text-[0.74rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
            {gameTitle} · caso encerrado
          </p>
          <h2
            id="verdict-title"
            className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl"
          >
            {verdict.title}
          </h2>
        </div>

        <div ref={textRef} className="max-w-2xl">
          <p className="text-base leading-relaxed text-ink sm:text-lg">
            <MathText text={verdict.text} />
          </p>
          <div className="mt-3">
            <SpeakerButton
              text={fullText}
              highlight={textRef}
              label="Ouvir veredito"
              className={cn("ludus-btn ludus-btn-sm border-transparent text-white", AREA_BTN[area])}
            />
          </div>
        </div>

        <BadgeTray badges={badges} />

        {verdict.detail && (
          <div className="w-full max-w-2xl">
            <button
              type="button"
              onClick={() => setDetailOpen((v) => !v)}
              aria-expanded={detailOpen}
              className="ludus-btn ludus-btn-paper ludus-btn-sm w-full"
            >
              <ChevronDown
                className={`size-4 transition-transform ${detailOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
              {verdict.detail.label}
            </button>
            {detailOpen && (
              <p className="anim-fade-up mt-3 rounded-2xl border-2 border-border bg-surface p-4 text-left text-sm leading-relaxed text-ink-soft sm:text-base">
                <MathText text={verdict.detail.text} />
              </p>
            )}
          </div>
        )}

        <div className="mt-2 flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onReplay} className="ludus-btn ludus-btn-paper flex-1">
            <RotateCcw className="size-5" aria-hidden />
            Jogar de novo
          </button>
          {onNextVariant && (
            <button
              type="button"
              onClick={() => {
                onNextVariant.onPick();
                onReplay();
              }}
              className={cn("ludus-btn text-white sm:flex-[2]", AREA_BTN[area])}
            >
              {onNextVariant.label}
              <ArrowRight className="size-5" aria-hidden />
            </button>
          )}
          <button type="button" onClick={onExit} className="ludus-btn ludus-btn-ink flex-1">
            Outros jogos
          </button>
        </div>
      </div>
    </section>
  );
}
