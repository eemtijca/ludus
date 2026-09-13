"use client";

/**
 * EvidenceCard: carta de evidência com virada 3D.
 * Frente: ícone, categoria e gancho. Verso: evidência completa e botão
 * de leitura. As duas faces ocupam a mesma célula de grid, então a altura
 * do cartão acompanha o verso (o texto nunca transborda). Com movimento
 * reduzido, a troca acontece sem rotação.
 */

import { useRef, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { GameIcon } from "./game-icon";
import { SpeakerButton } from "./speaker-button";
import { useA11y } from "@/components/a11y/a11y-provider";
import { playTick } from "@/lib/sound";
import { cn } from "@/lib/utils";

export interface EvidenceCardData {
  icon: string;
  category: string;
  hook: string;
  evidence: string;
  /** Texto curto extraído da evidência para o verso (padrão: evidence). */
  reveal?: string;
}

export function EvidenceCard({
  data,
  color,
  onReveal,
}: {
  data: EvidenceCardData;
  color: string;
  onReveal?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const { reducedMotion } = useA11y();
  const backRef = useRef<HTMLDivElement>(null);
  const showMotion = !reducedMotion;

  const handleFlip = () => {
    if (flipped) return;
    setFlipped(true);
    playTick();
    onReveal?.();
  };

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <div className="[perspective:1200px]">
      <div
        role="button"
        tabIndex={0}
        onClick={handleFlip}
        onKeyDown={handleKey}
        aria-expanded={flipped}
        aria-label={
          flipped
            ? `Carta ${data.category} virada. ${data.evidence}`
            : `Carta ${data.category}. ${data.hook}. Toque para virar.`
        }
        className={cn(
          "ludus-card flip-scene w-full",
          showMotion && "transition-transform duration-500 [transform-style:preserve-3d]",
        )}
        style={flipped && showMotion ? { transform: "rotateY(180deg)" } : undefined}
      >
        {/* Frente */}
        <div
          className={cn(
            "flip-face flex min-h-44 flex-col items-center gap-2 p-4 text-center [backface-visibility:hidden]",
            !showMotion && flipped && "hidden",
          )}
        >
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl border-2 text-white sm:size-16"
            style={{ background: color, borderColor: color }}
          >
            <GameIcon name={data.icon} className="size-7 sm:size-8" strokeWidth={2.2} />
          </span>
          <span className="font-display text-lg font-bold leading-tight text-ink">
            {data.category}
          </span>
          <span className="text-sm leading-snug text-ink-soft">{data.hook}</span>
          <span className="mt-auto inline-flex items-center gap-1.5 rounded-full bg-cloud px-3 py-1 font-display text-[0.72rem] font-bold uppercase tracking-wider text-ink-soft">
            <Sparkles className="size-3.5" aria-hidden />
            Virar carta
          </span>
        </div>

        {/* Verso */}
        <div
          ref={backRef}
          className={cn(
            "flip-face flex min-h-44 flex-col gap-2 p-4 text-left",
            showMotion
              ? "[backface-visibility:hidden] [transform:rotateY(180deg)]"
              : !flipped && "hidden",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-[0.72rem] font-bold uppercase tracking-wider text-white"
              style={{ background: color }}
            >
              <Check className="size-3.5" strokeWidth={3} aria-hidden />
              {data.category}
            </span>
          </div>
          <p className="text-[0.92rem] leading-relaxed text-ink">{data.evidence}</p>
          <div className="mt-auto pt-1" onClick={(e) => e.preventDefault()}>
            <SpeakerButton
              text={`${data.category}. ${data.evidence}`}
              highlight={backRef}
              label="Ouvir evidência"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
