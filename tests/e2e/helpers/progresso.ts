import type { Page } from "@playwright/test";
import { INVESTIGATION_CASES } from "../../../src/games/cases";
import type { BadgeId, GameProgress, ProgressMap } from "../../../src/lib/progress";

/**
 * Progresso determinístico para capturas e verificações visuais.
 *
 * O store de `src/lib/progress.ts` não usa o middleware persist do Zustand:
 * `writeStorage` grava o mapa direto, sob a chave versionada `ludus:progress:v1`.
 * É esse formato que o auxiliar injeta, com identificadores reais do catálogo
 * e do registro de casos e datas fixas.
 *
 * O aluno semeado concluiu quatro jogos, um por área, com os três casos
 * registrados e os três selos de cada jogo. Cada caso concluído conta uma
 * partida, então `completions` nunca é menor que os casos registrados.
 */

const STORAGE_KEY = "ludus:progress:v1";

const SELOS_COMPLETOS: BadgeId[] = ["lente", "chave", "selo-final"];

interface JogoSemeado {
  gameId: string;
  completions: number;
  lastCompletedAt: string;
}

const JOGOS_SEMEADOS: JogoSemeado[] = [
  { gameId: "fonte-suspeita", completions: 4, lastCompletedAt: "2026-09-12T14:20:00.000Z" },
  { gameId: "orcamento-limite", completions: 3, lastCompletedAt: "2026-09-26T15:10:00.000Z" },
  { gameId: "circuito-falhou", completions: 4, lastCompletedAt: "2026-10-02T13:45:00.000Z" },
  { gameId: "fonte-historica", completions: 3, lastCompletedAt: "2026-10-09T14:05:00.000Z" },
];

export const progressoSemeado: ProgressMap = Object.fromEntries(
  JOGOS_SEMEADOS.map(({ gameId, completions, lastCompletedAt }): [string, GameProgress] => {
    const casos = INVESTIGATION_CASES[gameId].map((caso) => caso.id);
    return [
      gameId,
      {
        badges: [...SELOS_COMPLETOS],
        completions,
        lastCompletedAt,
        lastCaseId: casos[casos.length - 1],
        completedCaseIds: casos,
      },
    ];
  }),
);

/** Injeta o estado semeado no localStorage; a página seguinte já o carrega. */
export async function semearProgresso(page: Page): Promise<void> {
  await page.evaluate(
    ({ chave, estado }) => {
      window.localStorage.setItem(chave, JSON.stringify(estado));
    },
    { chave: STORAGE_KEY, estado: progressoSemeado },
  );
}
