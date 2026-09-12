"use client";

/**
 * FeedbackBanner — retorno imediato de acerto, erro ou informação.
 * Sempre com ícone + texto + cor (dupla codificação, nunca só cor).
 * role="status" + aria-live="polite" para leitores de tela.
 */

import { useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { FeedbackMessage } from "@/games/_shared/use-game-session";

export function FeedbackBanner({
  feedback,
}: {
  feedback: FeedbackMessage | null;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedback?.kind === "error" && ref.current) {
      ref.current.classList.remove("anim-shake");
      void ref.current.offsetWidth; // reinicia a animação
      ref.current.classList.add("anim-shake");
    }
  }, [feedback]);

  if (!feedback) {
    return (
      <div
        className="min-h-[3.25rem]"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    );
  }

  const styles = {
    success: {
      wrap: "border-success bg-success-soft text-success-dark",
      icon: "bg-success text-white",
    },
    error: {
      wrap: "border-danger bg-danger-soft text-danger-dark",
      icon: "bg-danger text-white",
    },
    info: {
      wrap: "border-hint bg-hint-soft text-ink",
      icon: "bg-hint text-ink",
    },
  }[feedback.kind];

  const Icon =
    feedback.kind === "success"
      ? CheckCircle2
      : feedback.kind === "error"
        ? AlertCircle
        : Info;

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`anim-fade-up flex min-h-[3.25rem] items-center gap-3 rounded-2xl border-2 p-3 pr-4 font-semibold ${styles.wrap}`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        aria-hidden
      >
        <Icon className="size-5" strokeWidth={2.6} />
      </span>
      <p className="text-[0.95rem] leading-snug sm:text-base">
        {feedback.text}
      </p>
    </div>
  );
}
