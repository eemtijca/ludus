"use client";

/**
 * Revisor Crítico: palco do jogo.
 *
 * Fase 1 (Explorar): o rascunho aparece com os trechos problemáticos;
 *   o estudante lê os 3 trechos em cartas de leitura.
 * Fase 2 (Testar): escolher o reparo certo entre as alternativas.
 * Fase 3 (Decidir): publicar a versão final (comparação antes e depois).
 */

import { useState } from "react";
import { ArrowRight, Newspaper, Check, X } from "lucide-react";
import { GameShell } from "@/components/game-shell/game-shell";
import { EvidenceCard } from "@/components/game-shell/evidence-card";
import { OptionTile } from "@/components/game-shell/option-tile";
import { useGameSession } from "@/games/_shared/use-game-session";
import { GAME_BY_ID, AREAS } from "@/lib/catalog";
import { TEXTS, type RevisorText } from "./content";

const GAME_ID = "revisor-critico";

export function RevisorCriticoGame({ onExit }: { onExit: () => void }) {
  const game = GAME_BY_ID[GAME_ID];
  const [textIndex, setTextIndex] = useState(0);
  const session = useGameSession(GAME_ID);

  const nextVariant = {
    label: "Revisar outro texto",
    onPick: () => setTextIndex((i) => (i + 1) % TEXTS.length),
  };

  const area = AREAS[game.area];

  return (
    <GameShell
      game={game}
      session={session}
      mission={TEXTS[textIndex].mission}
      instruction={
        session.phase === 1
          ? "Toque nos trechos do rascunho para ler o que trava o texto."
          : session.phase === 2
            ? TEXTS[textIndex].repairQuestion
            : "Confira a versão final e publique no mural."
      }
      narration={TEXTS[textIndex].context.brief}
      nextVariant={nextVariant}
      onExit={onExit}
    >
      <Stage
        key={`${textIndex}-${session.generation}`}
        session={session}
        texto={TEXTS[textIndex]}
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
  texto,
  areaColor,
  areaColorDark,
  onPhase2,
  onPhase3,
}: {
  session: ReturnType<typeof useGameSession>;
  texto: RevisorText;
  areaColor: string;
  areaColorDark: string;
  onPhase2: () => void;
  onPhase3: () => void;
}) {
  const [read, setRead] = useState<number[]>([]);
  const [repairSolved, setRepairSolved] = useState(false);

  const handleRead = (index: number) => {
    if (read.includes(index)) return;
    const next = [...read, index];
    setRead(next);
    if (next.length === 3) {
      session.showSuccess("Trechos mapeados. Agora escolha o reparo certeiro.");
    }
  };

  /* ---------------------------------------------------- Fase 1 (Explorar) */
  if (session.phase === 1) {
    const allRead = read.length === 3;
    return (
      <div className="flex flex-col gap-5">
        {/* Mesa do editor */}
        <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-soft">
            <Newspaper className="size-4" aria-hidden />
            {texto.context.journal}
            <span className="ml-auto font-semibold text-ink-faint">{texto.context.deadline}</span>
          </div>
          <blockquote
            className="mt-3 rounded-2xl border-2 border-border bg-surface p-4 text-[0.95rem] leading-relaxed text-ink"
            style={{ borderLeft: `6px solid ${areaColor}` }}
          >
            {texto.draft.lead}
            {texto.draft.segments.map((seg) => (
              <mark
                key={seg.note}
                className="mt-2 block rounded-lg bg-hint-soft px-2 py-1 font-semibold text-ink"
                title={seg.note}
              >
                {seg.text}
                <span className="mt-1 block text-[0.7rem] font-bold uppercase tracking-wide text-hint-dark">
                  {seg.note}
                </span>
              </mark>
            ))}
          </blockquote>
          <p className="mt-2 text-xs font-semibold text-ink-soft">Pauta: {texto.context.brief}</p>
        </div>

        {/* Cartas de leitura */}
        <div>
          <p className="mb-3 font-display text-sm font-bold text-ink-soft">
            Leitura de trechos · {read.length}/3
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {texto.cards.map((card, i) => (
              <EvidenceCard
                key={card.category}
                data={card}
                color={areaColor}
                onReveal={() => handleRead(i)}
              />
            ))}
          </div>
        </div>

        {allRead && (
          <button
            type="button"
            onClick={onPhase2}
            className="ludus-btn ludus-btn-xl anim-bounce-in text-white"
            style={{ background: areaColor, borderColor: areaColorDark }}
          >
            Testar o reparo
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
        <p className="font-display text-lg font-bold text-ink sm:text-xl">{texto.repairQuestion}</p>
        <div className="flex flex-col gap-3">
          {texto.repairOptions.map((option, i) => (
            <OptionTile
              key={option.title}
              icon={option.icon}
              title={option.title}
              subtitle={option.subtitle}
              color={areaColor}
              colorDark={areaColorDark}
              disabled={repairSolved}
              correct={repairSolved && i === texto.repairCorrect}
              onPick={() => {
                if (i === texto.repairCorrect) {
                  setRepairSolved(true);
                  session.showSuccess("Reparo certeiro. A versão final está pronta.");
                  return true;
                }
                session.showError(`Ainda não. ${texto.repairWrong[i] ?? texto.repairHint}`);
                return false;
              }}
            />
          ))}
        </div>
        {repairSolved && (
          <button
            type="button"
            onClick={onPhase3}
            className="ludus-btn ludus-btn-xl anim-bounce-in text-white"
            style={{ background: areaColor, borderColor: areaColorDark }}
          >
            Publicar a versão final
            <ArrowRight className="size-5" aria-hidden />
          </button>
        )}
      </div>
    );
  }

  /* ----------------------------------------------------- Fase 3 (Decidir) */
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border-2 border-danger/40 bg-danger-soft p-4">
          <p className="flex items-center gap-1.5 font-display text-[0.72rem] font-bold uppercase tracking-wider text-danger-dark">
            <X className="size-4" strokeWidth={3} aria-hidden />
            Rascunho
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            {texto.draft.lead} {texto.draft.segments.map((s) => s.text).join(" ")}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-success bg-success-soft p-4">
          <p className="flex items-center gap-1.5 font-display text-[0.72rem] font-bold uppercase tracking-wider text-success-dark">
            <Check className="size-4" strokeWidth={3} aria-hidden />
            Versão final
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">{texto.published}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() =>
          session.finish({
            title: texto.verdict.title,
            text: texto.verdict.text,
            detail: texto.verdict.detail,
            caseId: texto.id,
          })
        }
        className="ludus-btn ludus-btn-xl text-white"
        style={{ background: areaColor, borderColor: areaColorDark }}
      >
        <Check className="size-5" strokeWidth={3} aria-hidden />
        Publicar no mural
      </button>
    </div>
  );
}
