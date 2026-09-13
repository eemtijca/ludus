"use client";

/**
 * Fonte Histórica: palco do jogo. Mesma estrutura da Fonte Suspeita,
 * com foco em crítica documental (data, autor e intenção).
 *
 * Fase 1 (Explorar): o post agendado e as 3 peças documentais.
 * Fase 2 (Testar): cruzar as peças (pergunta de verificação).
 * Fase 3 (Decidir): decidir o que sobe no mural.
 */

import { useState } from "react";
import { MessageCircle, ArrowRight, ScanSearch } from "lucide-react";
import { GameShell } from "@/components/game-shell/game-shell";
import { EvidenceCard } from "@/components/game-shell/evidence-card";
import { OptionTile } from "@/components/game-shell/option-tile";
import { useGameSession } from "@/games/_shared/use-game-session";
import { GAME_BY_ID, AREAS } from "@/lib/catalog";
import { CASES, type HistoricCase } from "./content";

const GAME_ID = "fonte-historica";

export function FonteHistoricaGame({ onExit }: { onExit: () => void }) {
  const game = GAME_BY_ID[GAME_ID];
  const [caseIndex, setCaseIndex] = useState(0);
  const session = useGameSession(GAME_ID);

  const nextVariant = {
    label: "Avaliar outro post",
    onPick: () => setCaseIndex((i) => (i + 1) % CASES.length),
  };

  const area = AREAS[game.area];

  return (
    <GameShell
      game={game}
      session={session}
      mission={CASES[caseIndex].mission}
      instruction={
        session.phase === 1
          ? "Vire as três peças documentais antes de qualquer decisão."
          : session.phase === 2
            ? CASES[caseIndex].crossQuestion
            : CASES[caseIndex].decisionPrompt
      }
      narration={CASES[caseIndex].context.message}
      nextVariant={nextVariant}
      onExit={onExit}
    >
      <Stage
        key={`${caseIndex}-${session.generation}`}
        session={session}
        caso={CASES[caseIndex]}
        areaColor={`var(--${game.area})`}
        areaColorDark={`var(--${game.area}-dark)`}
        onPhase2={() => session.setPhase(2)}
        onPhase3={() => session.setPhase(3)}
      />
    </GameShell>
  );
}

/* ------------------------------------------------------------------ Palco */

function Stage({
  session,
  caso,
  areaColor,
  areaColorDark,
  onPhase2,
  onPhase3,
}: {
  session: ReturnType<typeof useGameSession>;
  caso: HistoricCase;
  areaColor: string;
  areaColorDark: string;
  onPhase2: () => void;
  onPhase3: () => void;
}) {
  const [flipped, setFlipped] = useState<number[]>([]);
  const [crossSolved, setCrossSolved] = useState(false);

  const handleReveal = (index: number) => {
    if (flipped.includes(index)) return;
    const next = [...flipped, index];
    setFlipped(next);
    if (next.length === 3) {
      session.showSuccess("Peças catalogadas. Quem produziu, quando e para quê: hora de cruzar.");
    }
  };

  /* ---------------------------------------------------- Fase 1 (Explorar) */
  if (session.phase === 1) {
    const allFlipped = flipped.length === 3;
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-soft">
            <MessageCircle className="size-4" aria-hidden />
            {caso.context.channel}
            <span className="ml-auto font-semibold text-ink-faint">{caso.context.meta}</span>
          </div>
          <blockquote
            className="mt-3 rounded-2xl rounded-tl-md border-2 border-humanas/30 bg-surface p-4 font-semibold leading-relaxed text-ink"
            style={{ borderLeft: `6px solid ${areaColor}` }}
          >
            {caso.context.message}
            <footer className="mt-2 text-xs font-semibold text-ink-faint">
              {caso.context.annotation}
            </footer>
          </blockquote>
        </div>

        <div>
          <p className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-ink-soft">
            <ScanSearch className="size-4" aria-hidden />
            Peças documentais · {flipped.length}/3 examinadas
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {caso.cards.map((card, i) => (
              <EvidenceCard
                key={card.category}
                data={card}
                color={areaColor}
                onReveal={() => handleReveal(i)}
              />
            ))}
          </div>
        </div>

        {allFlipped && (
          <button
            type="button"
            onClick={onPhase2}
            className="ludus-btn ludus-btn-xl anim-bounce-in text-white"
            style={{ background: areaColor, borderColor: areaColorDark }}
          >
            Cruzar as peças
            <ArrowRight className="size-5" aria-hidden />
          </button>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------ Fase 2 (Testar) */
  if (session.phase === 2) {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-display text-lg font-bold text-ink sm:text-xl">{caso.crossQuestion}</p>
        <div className="flex flex-col gap-3">
          {caso.crossOptions.map((option, i) => (
            <OptionTile
              key={option.title}
              icon={option.icon}
              title={option.title}
              subtitle={option.subtitle}
              color={areaColor}
              colorDark={areaColorDark}
              disabled={crossSolved}
              correct={crossSolved && i === caso.crossCorrect}
              onPick={() => {
                if (i === caso.crossCorrect) {
                  setCrossSolved(true);
                  session.showSuccess("Peça-chave identificada. A decisão agora tem lastro.");
                  return true;
                }
                session.showError(`Ainda não. ${caso.crossWrong[i] ?? caso.crossHint}`);
                return false;
              }}
            />
          ))}
        </div>
        {crossSolved && (
          <button
            type="button"
            onClick={onPhase3}
            className="ludus-btn ludus-btn-xl anim-bounce-in text-white"
            style={{ background: areaColor, borderColor: areaColorDark }}
          >
            Levar ao mural
            <ArrowRight className="size-5" aria-hidden />
          </button>
        )}
      </div>
    );
  }

  /* ----------------------------------------------------- Fase 3 (Decidir) */
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-dashed border-border bg-cloud/50 p-4 text-sm leading-relaxed text-ink-soft">
        <strong className="text-ink">Ficha das peças:</strong>{" "}
        {caso.cards.map((c) => c.evidence).join(" ")}
      </div>
      <p className="font-display text-lg font-bold text-ink sm:text-xl">{caso.decisionPrompt}</p>
      <div className="flex flex-col gap-3">
        {caso.decisions.map((decision) => (
          <OptionTile
            key={decision.id}
            icon={decision.icon}
            title={decision.title}
            subtitle={decision.subtitle}
            color={areaColor}
            colorDark={areaColorDark}
            onPick={() => {
              if (decision.id === caso.expected) {
                session.finish({
                  title: caso.verdict.title,
                  text: caso.verdict.text,
                  detail: caso.verdict.detail,
                  caseId: caso.id,
                });
                return true;
              }
              if (decision.id === "publicar") {
                session.showError(
                  "Publicar sem lastro documental usa o mural como megafone de uma versão só, e a história cobra caro por isso.",
                );
              } else {
                session.showError(`Quase! ${caso.crossHint}`);
              }
              return false;
            }}
          />
        ))}
      </div>
    </div>
  );
}
