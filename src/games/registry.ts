"use client";

/**
 * Registro de componentes de jogo: mapeia o id do catálogo ao componente.
 * Cada jogo recebe onExit para voltar ao hub.
 */

import type { ComponentType } from "react";
import { FonteSuspeitaGame } from "./fonte-suspeita";
import { RevisorCriticoGame } from "./revisor-critico";
import { TeseAntiteseGame } from "./tese-antitese";
import { OrcamentoLimiteGame } from "./orcamento-limite";
import { FuncaoVivaGame } from "./funcao-viva";
import { RiscoProvavelGame } from "./risco-provavel";
import { CircuitoFalhouGame } from "./circuito-falhou";
import { ReacaoEquilibradaGame } from "./reacao-equilibrada";
import { GeneDilemaGame } from "./gene-dilema";
import { FonteHistoricaGame } from "./fonte-historica";
import { TerritorioDisputaGame } from "./territorio-disputa";
import { DilemaEticoGame } from "./dilema-etico";

export type GameComponent = ComponentType<{ onExit: () => void }>;

export const GAME_COMPONENTS: Record<string, GameComponent> = {
  "fonte-suspeita": FonteSuspeitaGame,
  "revisor-critico": RevisorCriticoGame,
  "tese-antitese": TeseAntiteseGame,
  "orcamento-limite": OrcamentoLimiteGame,
  "funcao-viva": FuncaoVivaGame,
  "risco-provavel": RiscoProvavelGame,
  "circuito-falhou": CircuitoFalhouGame,
  "reacao-equilibrada": ReacaoEquilibradaGame,
  "gene-dilema": GeneDilemaGame,
  "fonte-historica": FonteHistoricaGame,
  "territorio-disputa": TerritorioDisputaGame,
  "dilema-etico": DilemaEticoGame,
};
