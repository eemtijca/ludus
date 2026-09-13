"use client";

/**
 * useGameSession: motor de partida compartilhado pelos jogos.
 *
 * Responsabilidades:
 * - Fases (1 Explorar, 2 Testar, 3 Decidir) com selos automáticos;
 * - Feedback imediato (acerto, erro, informação) com som e animação;
 * - Veredito final com confete, som de vitória e registro de progresso;
 * - Reinício limpo (generation key) que zera o palco sem recarregar a página.
 *
 * Princípios DUA/AEE: sem cronômetro, sem punição, progresso só soma.
 */

import { useCallback, useRef, useState } from "react";
import { useProgress, type BadgeId } from "@/lib/progress";
import { playBadge, playCorrect, playError, playVictory } from "@/lib/sound";
import { speak, stopSpeech } from "@/lib/speech";
import { useA11y } from "@/components/a11y/a11y-provider";

export type Phase = 1 | 2 | 3;

export const PHASE_LABELS: Record<Phase, string> = {
  1: "Explorar",
  2: "Testar",
  3: "Decidir",
};

export interface FeedbackMessage {
  kind: "success" | "error" | "info";
  text: string;
}

export interface VerdictPayload {
  title: string;
  text: string;
  /** Bastidor pedagógico opcional (expande no veredito). */
  detail?: { label: string; text: string; speech?: string };
  /** Id do caso/variante concluído para o progresso. */
  caseId?: string;
}

export interface GameSession {
  gameId: string;
  phase: Phase;
  badges: BadgeId[];
  feedback: FeedbackMessage | null;
  verdict: VerdictPayload | null;
  /** Muda a cada reinício; use como key do palco para zerar o jogo. */
  generation: number;
  setPhase: (phase: Phase) => void;
  showSuccess: (text: string, opts?: { speakText?: boolean }) => void;
  showError: (text: string, opts?: { speakText?: boolean }) => void;
  showInfo: (text: string, opts?: { speakText?: boolean }) => void;
  clearFeedback: () => void;
  finish: (payload: VerdictPayload) => void;
  restart: () => void;
}

export function useGameSession(gameId: string): GameSession {
  const [phase, setPhaseState] = useState<Phase>(1);
  const [badges, setBadges] = useState<BadgeId[]>([]);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [verdict, setVerdict] = useState<VerdictPayload | null>(null);
  const [generation, setGeneration] = useState(0);

  const { awardBadge, completeGame } = useProgress.getState();
  const soundRef = useRef(true);
  const a11y = useA11y();
  soundRef.current = a11y.soundEffects;

  const award = useCallback(
    (badge: BadgeId) => {
      setBadges((prev) => {
        if (prev.includes(badge)) return prev;
        if (soundRef.current) playBadge();
        return [...prev, badge];
      });
      awardBadge(gameId, badge);
    },
    [gameId, awardBadge],
  );

  const setPhase = useCallback(
    (next: Phase) => {
      setPhaseState(next);
      if (next >= 2) award("lente");
      if (next >= 3) award("chave");
    },
    [award],
  );

  const pushFeedback = useCallback(
    (kind: FeedbackMessage["kind"], text: string, speakText: boolean) => {
      setFeedback({ kind, text });
      if (soundRef.current) {
        if (kind === "success") playCorrect();
        if (kind === "error") playError();
      }
      if (speakText) speak(text);
    },
    [],
  );

  const showSuccess = useCallback(
    (text: string, opts?: { speakText?: boolean }) => {
      pushFeedback("success", text, opts?.speakText ?? false);
    },
    [pushFeedback],
  );

  const showError = useCallback(
    (text: string, opts?: { speakText?: boolean }) => {
      pushFeedback("error", text, opts?.speakText ?? false);
    },
    [pushFeedback],
  );

  const showInfo = useCallback(
    (text: string, opts?: { speakText?: boolean }) => {
      pushFeedback("info", text, opts?.speakText ?? false);
    },
    [pushFeedback],
  );

  const clearFeedback = useCallback(() => setFeedback(null), []);

  const finish = useCallback(
    (payload: VerdictPayload) => {
      award("selo-final");
      setVerdict(payload);
      if (soundRef.current) playVictory();
      completeGame(gameId, payload.caseId);
    },
    [award, completeGame, gameId],
  );

  const restart = useCallback(() => {
    stopSpeech();
    setPhaseState(1);
    setBadges([]);
    setFeedback(null);
    setVerdict(null);
    setGeneration((g) => g + 1);
  }, []);

  return {
    gameId,
    phase,
    badges,
    feedback,
    verdict,
    generation,
    setPhase,
    showSuccess,
    showError,
    showInfo,
    clearFeedback,
    finish,
    restart,
  };
}
