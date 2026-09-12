"use client";

/**
 * VerdictCard — tela de conclusão da partida.
 * Confete + selos conquistados + bastidor pedagógico expansível
 * + ações: jogar de novo / outro caso / voltar ao hub.
 */

import { useRef, useState } from "react";
import { ChevronDown, RotateCcw, ArrowRight, Trophy } from "lucide-react";
import { Confetti } from "./confetti";
import { BadgeTray } from "./badge-tray";
import type { BadgeId } from "@/lib/progress";
import type { VerdictPayload } from "@/games/_shared/use-game-session";
import { SpeakerButton } from "./speaker-button";

export function VerdictCard({
  verdict,
  badges,
  color,
  colorDark,
  colorSoft,
  gameTitle,
  onReplay,
  onNextVariant,
  onExit,
}: {
  verdict: VerdictPayload;
  badges: BadgeId[];
  color: string;
  colorDark: string;
  colorSoft: string;
  gameTitle: string;
  onReplay: () => void;
  onNextVariant?: { label: string; onPick: () => void } | null;
  onExit: () => void;
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const fullText = `${verdict.title}. ${verdict.text}${verdict.detail ? ` ${verdict.detail.text}` : ""}`;

  return (
    <section
      className="anim-bounce-in relative overflow-hidden rounded-3xl border-2 p-5 sm:p-8"
      style={{ background: colorSoft, borderColor: color }}
      aria-labelledby="verdict-title"
    >
      <Confetti />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <span
          className="flex size-20 items-center justify-center rounded-full border-4 text-white anim-wiggle sm:size-24"
          style={{ background: color, borderColor: colorDark }}
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
            {verdict.text}
          </p>
          <div className="mt-3">
            <SpeakerButton
              text={fullText}
              highlight={textRef}
              label="Ouvir veredito"
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
              <p className="anim-fade-up mt-3 rounded-2xl border-2 border-border bg-white p-4 text-left text-sm leading-relaxed text-ink-soft sm:text-base">
                {verdict.detail.text}
              </p>
            )}
          </div>
        )}

        <div className="mt-2 flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onReplay}
            className="ludus-btn ludus-btn-paper flex-1"
          >
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
              className="ludus-btn text-white sm:flex-[2]"
              style={{ background: color, borderColor: colorDark }}
            >
              {onNextVariant.label}
              <ArrowRight className="size-5" aria-hidden />
            </button>
          )}
          <button
            type="button"
            onClick={onExit}
            className="ludus-btn ludus-btn-ink flex-1"
          >
            Outros jogos
          </button>
        </div>
      </div>
    </section>
  );
}
