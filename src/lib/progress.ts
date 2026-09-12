/**
 * Store de progresso do estudante (Zustand + persistência em localStorage).
 * Registra por jogo: melhor estado da partida, selos conquistados,
 * contagem de partidas concluídas e data da última vitória.
 * Nada aqui vira punição: progresso só soma (princípio DUA/AEE).
 */

"use client";

import { create } from "zustand";
import { GAMES } from "@/lib/catalog";

export type BadgeId = "lente" | "chave" | "selo-final";

export interface GameProgress {
  /** Selos já conquistados pelo menos uma vez. */
  badges: BadgeId[];
  /** Número de partidas concluídas (veredito alcançado). */
  completions: number;
  /** Última vez que o jogo foi concluído (ISO string). */
  lastCompletedAt: string | null;
  /** Caso/variante da última conclusão (para "continuar de onde parou"). */
  lastCaseId?: string;
}

export type ProgressMap = Record<string, GameProgress>;

export interface ProgressState {
  progress: ProgressMap;
  loaded: boolean;
  /** Carrega do localStorage (chamado no mount, client-only). */
  load: () => void;
  /** Marca um selo como conquistado (idempotente). */
  awardBadge: (gameId: string, badge: BadgeId) => void;
  /** Registra a conclusão de uma partida. */
  completeGame: (gameId: string, caseId?: string) => void;
  /** Zera tudo (com confirmação na UI antes de chegar aqui). */
  resetAll: () => void;
}

const STORAGE_KEY = "ludus:progress:v1";

const emptyProgress = (): GameProgress => ({
  badges: [],
  completions: 0,
  lastCompletedAt: null,
});

function readStorage(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {};
    }
    // Sanitiza entradas malformadas sem travar a app.
    const safe: ProgressMap = {};
    for (const game of GAMES) {
      const entry = parsed[game.id];
      if (!entry) continue;
      safe[game.id] = {
        badges: Array.isArray(entry.badges)
          ? entry.badges.filter(
              (b): b is BadgeId =>
                b === "lente" || b === "chave" || b === "selo-final",
            )
          : [],
        completions:
          typeof entry.completions === "number" && entry.completions > 0
            ? Math.floor(entry.completions)
            : 0,
        lastCompletedAt:
          typeof entry.lastCompletedAt === "string"
            ? entry.lastCompletedAt
            : null,
        lastCaseId:
          typeof entry.lastCaseId === "string" ? entry.lastCaseId : undefined,
      };
    }
    return safe;
  } catch {
    return {};
  }
}

function writeStorage(progress: ProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* armazenamento bloqueado — progresso vive só em memória */
  }
}

export const useProgress = create<ProgressState>((set, get) => ({
  progress: {},
  loaded: false,

  load: () => {
    if (get().loaded) return;
    set({ progress: readStorage(), loaded: true });
  },

  awardBadge: (gameId, badge) => {
    const current = get().progress[gameId] ?? emptyProgress();
    if (current.badges.includes(badge)) return;
    const next: ProgressMap = {
      ...get().progress,
      [gameId]: { ...current, badges: [...current.badges, badge] },
    };
    set({ progress: next });
    writeStorage(next);
  },

  completeGame: (gameId, caseId) => {
    const current = get().progress[gameId] ?? emptyProgress();
    const next: ProgressMap = {
      ...get().progress,
      [gameId]: {
        ...current,
        completions: current.completions + 1,
        lastCompletedAt: new Date().toISOString(),
        lastCaseId: caseId ?? current.lastCaseId,
      },
    };
    set({ progress: next });
    writeStorage(next);
  },

  resetAll: () => {
    set({ progress: {} });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* noop */
      }
    }
  },
}));

/* ------------------------------------------------------------ Derivadas */

export function isGameCompleted(progress: GameProgress | undefined): boolean {
  if (!progress) return false;
  return progress.badges.length >= 3 || progress.completions > 0;
}

export function countCompleted(progress: ProgressMap): number {
  return GAMES.filter((g) => isGameCompleted(progress[g.id])).length;
}

export function totalBadges(progress: ProgressMap): number {
  return GAMES.reduce(
    (acc, g) => acc + (progress[g.id]?.badges.length ?? 0),
    0,
  );
}

export const TOTAL_BADGES = GAMES.length * 3;
