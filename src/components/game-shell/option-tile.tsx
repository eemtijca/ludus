"use client";

/**
 * OptionTile: peça grande de resposta/decisão.
 * Estados: normal, correta (após validação) e tremendo (erro).
 * O ícone acompanha sempre (dupla codificação: forma, cor e texto).
 */

import { useState } from "react";
import { GameIcon } from "./game-icon";
import { playTick } from "@/lib/sound";
import { cn } from "@/lib/utils";

export interface OptionTileProps {
  icon?: string;
  title: string;
  subtitle?: string;
  /** Chamado ao escolher. Devolva false para disparar o tremor visual. */
  onPick: () => boolean | void;
  color: string;
  colorDark: string;
  disabled?: boolean;
  /** Exibe visual de escolha correta (controlado pelo jogo). */
  correct?: boolean;
  className?: string;
}

export function OptionTile({
  icon,
  title,
  subtitle,
  onPick,
  color,
  colorDark,
  disabled,
  correct,
  className,
}: OptionTileProps) {
  const [shake, setShake] = useState(false);
  const [chosen, setChosen] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    playTick();
    setChosen(true);
    const ok = onPick();
    if (ok === false) {
      setShake(true);
      window.setTimeout(() => setShake(false), 420);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={subtitle ? `${title}. ${subtitle}` : title}
      className={cn(
        "ludus-card flex w-full items-center gap-3 p-4 text-left sm:gap-4 sm:p-5",
        shake && "anim-shake",
        correct && "ludus-card-correct",
        chosen && !shake && !correct && "border-danger",
        className,
      )}
    >
      {icon && (
        <span
          className="ludus-tile flex size-14 shrink-0 items-center justify-center rounded-2xl text-white sm:size-16"
          style={{ background: correct ? "var(--success)" : color }}
          aria-hidden
        >
          <GameIcon name={icon} className="size-7 sm:size-8" strokeWidth={2.2} />
        </span>
      )}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="font-display text-base font-bold leading-tight text-ink sm:text-lg">
          {title}
        </span>
        {subtitle && <span className="text-sm leading-snug text-ink-soft">{subtitle}</span>}
      </span>
    </button>
  );
}
