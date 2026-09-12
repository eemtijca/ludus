"use client";

/**
 * Território em Disputa — palco do jogo.
 *
 * Fase 1 · Explorar: a comissão apresenta 3 projetos; escolha 1 para alocar.
 * Fase 2 · Testar: o mapa de 6 lotes — toque para posicionar o projeto
 *   (lotes de risco recusam galpão com feedback pedagógico).
 * Fase 3 · Decidir: a chuva de março anima o mapa e testa as escolhas.
 */

import { useState } from "react";
import { ArrowRight, CloudRain, MapPin } from "lucide-react";
import { GameShell } from "@/components/game-shell/game-shell";
import { OptionTile } from "@/components/game-shell/option-tile";
import { useGameSession } from "@/games/_shared/use-game-session";
import { GAME_BY_ID, AREAS } from "@/lib/catalog";
import {
  LOTS,
  PROJECTS,
  RAIN_NARRATIVE,
  VERDICT,
  type Project,
} from "./content";

const GAME_ID = "territorio-disputa";

export function TerritorioDisputaGame({ onExit }: { onExit: () => void }) {
  const game = GAME_BY_ID[GAME_ID];
  const session = useGameSession(GAME_ID);

  const area = AREAS[game.area];

  return (
    <GameShell
      game={game}
      session={session}
      mission="A comissão do bairro: 6 lotes, escolhas e uma chuva a caminho"
      instruction={
        session.phase === 1
          ? "Escolha o projeto da comissão para alocar no mapa."
          : session.phase === 2
            ? "Toque no lote onde o projeto deve ficar. Cuidado com o risco."
            : "A chuva de março chegou. Veja o plano sob o teste da água."
      }
      narration="Mapa esquemático de seis lotes. Onde a água entra, o erro aparece."
      nextVariant={null}
      onExit={onExit}
    >
      <Stage
        key={session.generation}
        session={session}
        areaColor={area.color}
        areaColorDark={area.colorDark}
      />
    </GameShell>
  );
}

/* ------------------------------------------------------------------ Palco */

function Stage({
  session,
  areaColor,
  areaColorDark,
}: {
  session: ReturnType<typeof useGameSession>;
  areaColor: string;
  areaColorDark: string;
}) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [lotId, setLotId] = useState<number | null>(null);
  const [rained, setRained] = useState(false);

  const project = PROJECTS.find((p) => p.id === projectId) ?? null;

  /* ---------------------------------------------------- Fase 1 · Explorar */
  if (session.phase === 1) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-soft">
            <MapPin className="size-4" aria-hidden />
            Comissão de planejamento do bairro
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Três projetos disputam o território. Escolha um para alocar — os
            outros dois esperam a próxima rodada. A chuva de março testa tudo no
            fim.
          </p>
        </div>

        {/* Prévia do mapa (informativa) */}
        <div className="rounded-2xl border-2 border-dashed border-border bg-white p-4">
          <p className="mb-3 font-display text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
            O bairro em disputa · 6 lotes
          </p>
          <div className="grid grid-cols-3 gap-2">
            {LOTS.map((lot) => (
              <div
                key={lot.id}
                className={`flex min-h-16 flex-col justify-center rounded-xl border-2 px-2.5 py-2 ${
                  lot.floodRisk
                    ? "border-matematica bg-matematica-soft"
                    : "border-border bg-cloud/50"
                }`}
              >
                <span className="font-display text-[0.72rem] font-bold leading-tight text-ink">
                  {lot.name}
                </span>
                {lot.floodRisk && (
                  <span className="mt-0.5 inline-flex items-center gap-1 text-[0.62rem] font-bold text-matematica-dark">
                    <CloudRain className="size-3" aria-hidden />
                    alaga em março
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {PROJECTS.map((p) => (
            <OptionTile
              key={p.id}
              icon={p.icon}
              title={p.title}
              subtitle={p.hook}
              color={areaColor}
              colorDark={areaColorDark}
              correct={projectId === p.id}
              onPick={() => {
                setProjectId(p.id);
                session.showSuccess(`Projeto escolhido: ${p.title}. ${p.rule}`);
                return true;
              }}
            />
          ))}
        </div>

        {project && (
          <div className="anim-fade-up rounded-2xl border-2 border-humanas/40 bg-humanas-soft p-4 text-sm leading-relaxed text-ink">
            <strong className="font-display">{project.title}:</strong>{" "}
            {project.brief}
          </div>
        )}

        {project && (
          <button
            type="button"
            onClick={() => session.setPhase(2)}
            className="ludus-btn ludus-btn-xl anim-bounce-in text-white"
            style={{ background: areaColor, borderColor: areaColorDark }}
          >
            Abrir o mapa do bairro
            <ArrowRight className="size-5" aria-hidden />
          </button>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------ Fase 2 · Testar */
  if (session.phase === 2) {
    const place = (lot: (typeof LOTS)[number]) => {
      if (project?.id === "galpao" && lot.floodRisk) {
        session.showError(
          `“${lot.name}” é lote que alaga: o estoque do galpão não pode molhar. Procure terreno seco.`,
        );
        return;
      }
      setLotId(lot.id);
      session.showSuccess(
        `${project?.title} alocado em “${lot.name}”. ${lot.terrain}`,
      );
    };

    return (
      <div className="flex flex-col gap-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LOTS.map((lot) => {
            const chosen = lotId === lot.id;
            return (
              <button
                key={lot.id}
                type="button"
                onClick={() => place(lot)}
                aria-label={`Lote ${lot.id + 1}: ${lot.name}. ${lot.terrain}`}
                aria-pressed={chosen}
                className={[
                  "ludus-card flex min-h-36 flex-col gap-1.5 p-4 text-left",
                  lot.floodRisk ? "border-matematica" : "",
                  chosen ? "border-success" : "",
                ].join(" ")}
                style={
                  chosen
                    ? { boxShadow: "0 5px 0 #46a302", background: "#eaffd6" }
                    : lot.floodRisk
                      ? { background: "#e0f7f4" }
                      : undefined
                }
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-ink">
                    {lot.name}
                  </span>
                  {lot.floodRisk && (
                    <span
                      className="ludus-chip border-matematica text-matematica-dark"
                      style={{ background: "#e0f7f4" }}
                    >
                      <CloudRain className="size-3" aria-hidden />
                      alaga
                    </span>
                  )}
                </span>
                <span className="text-xs leading-snug text-ink-soft">
                  {lot.terrain}
                </span>
                {chosen && (
                  <span className="mt-auto font-display text-[0.72rem] font-bold uppercase tracking-wider text-success-dark">
                    ✓ {project?.title} aqui
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            if (lotId === null) {
              session.showError(
                "Escolha um lote no mapa antes de chamar a chuva.",
              );
              return;
            }
            session.setPhase(3);
          }}
          className="ludus-btn ludus-btn-xl text-white"
          style={{ background: areaColor, borderColor: areaColorDark }}
        >
          <CloudRain className="size-5" aria-hidden />
          Chamar a chuva de março
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------- Fase 3 · Decidir */
  const chosenLot = LOTS.find((l) => l.id === lotId) ?? null;
  const riskyChoice = project?.id === "galpao" && chosenLot?.floodRisk;

  return (
    <div className="flex flex-col gap-5">
      <div className="anim-fade-up rounded-2xl border-2 border-matematica bg-matematica-soft p-4">
        <p className="flex items-center gap-2 font-display text-sm font-bold text-ink">
          <CloudRain
            className="size-4 text-matematica-dark anim-pulse-soft"
            aria-hidden
          />
          {RAIN_NARRATIVE.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {RAIN_NARRATIVE.text}
        </p>
      </div>

      {/* Mapa molhado */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LOTS.map((lot) => {
          const chosen = lot.id === lotId;
          const wet = lot.floodRisk;
          return (
            <div
              key={lot.id}
              className={[
                "anim-fade-up flex min-h-28 flex-col gap-1.5 rounded-2xl border-2 p-4",
                wet
                  ? chosen
                    ? riskyChoice
                      ? "border-danger bg-danger-soft"
                      : "border-success bg-success-soft"
                    : "border-matematica bg-matematica-soft"
                  : chosen
                    ? "border-success bg-success-soft"
                    : "border-border bg-white",
              ].join(" ")}
              style={{ animationDelay: `${lot.id * 120}ms` }}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-display text-sm font-bold text-ink">
                  {lot.name}
                </span>
                {wet && (
                  <span aria-hidden>
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5"
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    >
                      <path
                        d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"
                        className="anim-sheen"
                      />
                    </svg>
                  </span>
                )}
              </span>
              <span className="text-xs leading-snug text-ink-soft">
                {wet
                  ? "Debaixo d’água com a chuva forte."
                  : "Sequinho com a chuva forte."}
              </span>
              {chosen && (
                <span className="mt-auto font-display text-[0.72rem] font-bold uppercase tracking-wider text-ink">
                  {riskyChoice
                    ? "✗ estoque molhado"
                    : `✓ ${project?.title} intacto`}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          if (riskyChoice) {
            session.showError(
              "O galpão molhou: lote de risco pede uso permeável, nunca estoque. Volte ao mapa e realoque.",
            );
            session.setPhase(2);
            return;
          }
          setRained(true);
          session.finish({
            title: VERDICT.title,
            text: `${VERDICT.text} Seu ${project?.title} ficou em “${chosenLot?.name}” — ${
              chosenLot?.floodRisk
                ? "segurando a água exatamente onde ela costuma parar."
                : "em terreno seco e tranquilo."
            }`,
            detail: VERDICT.detail,
            caseId: `${projectId}-${lotId}`,
          });
        }}
        className="ludus-btn ludus-btn-xl text-white"
        style={{ background: areaColor, borderColor: areaColorDark }}
      >
        {rained ? "Ver o veredito" : "Testar o plano na chuva"}
        <ArrowRight className="size-5" aria-hidden />
      </button>
    </div>
  );
}
