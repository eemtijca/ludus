"use client";

/**
 * SpeakerButton — botão "Ouvir" contextual: lê o texto indicado em voz
 * alta e realça o elemento de origem durante a leitura (DUA: texto + voz).
 * O realce é resolvido via ref dentro do handler (nunca durante render).
 */

import { Volume2, Square } from "lucide-react";
import { isSpeaking, speak, stopSpeech } from "@/lib/speech";
import { useState } from "react";

export function SpeakerButton({
  text,
  highlight,
  label = "Ouvir",
  className = "",
}: {
  text: string;
  /** Ref do elemento a realçar durante a leitura. */
  highlight?: React.RefObject<HTMLElement | null>;
  label?: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (active || isSpeaking()) {
      stopSpeech();
      setActive(false);
      return;
    }
    setActive(true);
    speak(text, {
      highlight: highlight?.current ?? null,
      onEnd: () => setActive(false),
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 border-border bg-white px-3 py-1.5 font-display text-[0.78rem] font-bold text-ink-soft transition-colors hover:border-ink-faint hover:text-ink ${className}`}
      aria-label={`${label} este texto em voz alta`}
    >
      {active ? (
        <Square className="size-4" strokeWidth={2.6} aria-hidden />
      ) : (
        <Volume2 className="size-4" strokeWidth={2.4} aria-hidden />
      )}
      <span>{active ? "Parar" : label}</span>
    </button>
  );
}
