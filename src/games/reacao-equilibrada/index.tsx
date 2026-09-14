"use client";

/**
 * Reação Equilibrada: palco do jogo.
 *
 * Fase 1 (Explorar): cards virados explicam as três receitas e a ordem
 *   dos ajustes (água, gás natural e etano).
 * Fase 2 (Testar): ajuste dos coeficientes da água e do gás natural,
 *   cada um seguido do seu veredito.
 * Fase 3 (Decidir): combustão do etano, cujo veredito encerra a partida.
 */

import { useRef, useState } from "react";
import { ArrowRight, FlaskConical, Minus, Plus, Check, ChevronDown } from "lucide-react";
import { GameShell } from "@/components/game-shell/game-shell";
import { EvidenceCard } from "@/components/game-shell/evidence-card";
import { SpeakerButton } from "@/components/game-shell/speaker-button";
import { MathText } from "@/components/mathjax/math-text";
import { useGameSession } from "@/games/_shared/use-game-session";
import { GAME_BY_ID, AREAS } from "@/lib/catalog";
import { stripLatex } from "@/lib/tex";
import { REACTIONS, elementsOf, type Reaction, type Species } from "./content";

const GAME_ID = "reacao-equilibrada";

/** Converte subscritos unicode para a notação ASCII do mhchem. */
const CE_DIGITS: Record<string, string> = {
  "\u2080": "0",
  "\u2081": "1",
  "\u2082": "2",
  "\u2083": "3",
  "\u2084": "4",
  "\u2085": "5",
  "\u2086": "6",
  "\u2087": "7",
  "\u2088": "8",
  "\u2089": "9",
};
function toCe(formula: string): string {
  return formula.replace(/[\u2080-\u2089]/g, (d) => CE_DIGITS[d] ?? d);
}

/** Esqueleto da equação para a frente do card (fórmulas sem coeficientes). */
function equationSkeleton(reaction: Reaction): string {
  const left = reaction.reagents.map((s) => s.formula).join(" + ");
  const right = reaction.products.map((s) => s.formula).join(" + ");
  return `${left} → ${right}`;
}

export function ReacaoEquilibradaGame({ onExit }: { onExit: () => void }) {
  const game = GAME_BY_ID[GAME_ID];
  const session = useGameSession(GAME_ID);
  const [sequence, setSequence] = useState({ generation: session.generation, step: 0 });

  const area = AREAS[game.area];
  const lastStep = REACTIONS.length - 1;

  /* Reinício da sessão (nova generation) recomeça pela primeira receita. */
  const step = sequence.generation === session.generation ? sequence.step : 0;
  const reaction = REACTIONS[step];

  const advance = () => {
    if (step >= lastStep) return;
    const next = step + 1;
    setSequence({ generation: session.generation, step: next });
    if (next === lastStep) session.setPhase(3);
  };

  return (
    <GameShell
      game={game}
      session={session}
      mission={session.phase === 1 ? "Bancada das três receitas" : reaction.mission}
      instruction={
        session.phase === 1
          ? "Vire os cards para conhecer as três reações. Os ajustes vêm na ordem: água, gás natural e etano."
          : session.phase === 2
            ? `Ajuste os coeficientes: ${reaction.title} (${step + 1} de ${REACTIONS.length}).`
            : "Última receita: feche a combustão do etano."
      }
      narration={session.phase === 1 ? undefined : reaction.context}
      onExit={onExit}
    >
      <Stage
        key={`${step}-${session.generation}`}
        session={session}
        reaction={reaction}
        step={step}
        areaColor={area.color}
        areaColorDark={area.colorDark}
        onPhase2={() => session.setPhase(2)}
        onAdvance={advance}
      />
    </GameShell>
  );
}

/* ------------------------------------------------------------------ Palco */

function Stage({
  session,
  reaction,
  step,
  areaColor,
  areaColorDark,
  onPhase2,
  onAdvance,
}: {
  session: ReturnType<typeof useGameSession>;
  reaction: Reaction;
  step: number;
  areaColor: string;
  areaColorDark: string;
  onPhase2: () => void;
  onAdvance: () => void;
}) {
  const species: Species[] = [...reaction.reagents, ...reaction.products];
  const [coefs, setCoefs] = useState<number[]>(() => species.map(() => 1));
  const [showVerdict, setShowVerdict] = useState(false);
  const [read, setRead] = useState<string[]>([]);

  const nReagents = reaction.reagents.length;
  const elements = elementsOf(reaction);
  const lastStep = step === REACTIONS.length - 1;

  const leftTotals: Record<string, number> = {};
  const rightTotals: Record<string, number> = {};
  species.forEach((sp, i) => {
    const target = i < nReagents ? leftTotals : rightTotals;
    for (const [el, count] of Object.entries(sp.atoms)) {
      target[el] = (target[el] ?? 0) + count * coefs[i];
    }
  });

  const allBalanced = elements.every((el) => (leftTotals[el] ?? 0) === (rightTotals[el] ?? 0));

  const bump = (i: number, delta: number) => {
    setCoefs((prev) => prev.map((c, idx) => (idx === i ? Math.max(1, Math.min(9, c + delta)) : c)));
  };

  const handleRead = (id: string) => {
    if (read.includes(id)) return;
    const next = [...read, id];
    setRead(next);
    const title = REACTIONS.find((r) => r.id === id)?.title ?? "";
    if (next.length === REACTIONS.length) {
      session.showSuccess(
        "Três receitas lidas. Os ajustes vêm na ordem: água, gás natural e etano.",
      );
    } else {
      session.showInfo(`Receita lida: ${title}.`);
    }
  };

  const handleWeigh = () => {
    if (!allBalanced) {
      session.showError(
        "A balança ainda torta: algum elemento difere entre reagentes e produtos. Ajuste e pese de novo.",
      );
      return;
    }
    if (lastStep) {
      session.finish({
        title: reaction.verdict.title,
        text: reaction.verdict.text,
        detail: reaction.verdict.detail,
        caseId: reaction.id,
      });
      return;
    }
    setShowVerdict(true);
    session.showSuccess("A balança fechou! Átomos conservados dos dois lados.");
  };

  /* ---------------------------------------------------- Fase 1 (Explorar) */
  if (session.phase === 1) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-soft">
            <FlaskConical className="size-4" aria-hidden />
            Cantina-laboratório · bancada de reações
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            A natureza escreveu três reações e exige a contagem exata de átomos. Vire os cards para
            conhecer cada receita; depois, os ajustes seguem a ordem: água, gás natural e etano.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {REACTIONS.map((r) => (
            <EvidenceCard
              key={r.id}
              data={{
                icon: r.icon,
                category: r.title,
                hook: equationSkeleton(r),
                evidence: `${r.context} Dica: ${r.hint}`,
              }}
              color={areaColor}
              onReveal={() => handleRead(r.id)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onPhase2}
          className="ludus-btn ludus-btn-xl text-white"
          style={{ background: areaColor, borderColor: areaColorDark }}
        >
          Começar os ajustes
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    );
  }

  /* ------------------------------------------- Veredito inline da receita */
  if (showVerdict) {
    return (
      <ReactionVerdict
        reaction={reaction}
        coefs={coefs}
        areaColor={areaColor}
        areaColorDark={areaColorDark}
        onAdvance={onAdvance}
      />
    );
  }

  /* ------------------------------------------------------ Fase 2 e 3 */
  return (
    <div className="flex flex-col gap-5">
      {/* Etapa da sequência */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="ludus-tile flex size-9 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: areaColor }}
          aria-hidden
        >
          <FlaskConical className="size-4" strokeWidth={2.4} />
        </span>
        <p className="font-display text-sm font-bold text-ink sm:text-base">
          Receita {step + 1} de {REACTIONS.length}
        </p>
        <span className="ludus-chip ml-auto border-natureza bg-natureza-soft text-natureza-dark">
          {reaction.title}
        </span>
      </div>

      {/* Equação com esteiras de coeficientes */}
      <div className="rounded-2xl border-2 border-border bg-surface p-4">
        <p className="mb-3 text-center font-display text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
          Toque nos números para ajustar os coeficientes
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-4">
          {species.map((sp, i) => (
            <span key={sp.formula + i} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="font-display text-2xl font-bold text-ink-faint">
                  {i === nReagents ? "→" : "+"}
                </span>
              )}
              <span className="flex flex-col items-center gap-1.5">
                <span className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => bump(i, -1)}
                    aria-label={`Diminuir coeficiente do ${sp.name}`}
                    className="flex size-9 items-center justify-center rounded-xl border-2 border-border bg-cloud text-ink-soft transition-colors hover:border-ink-faint"
                  >
                    <Minus className="size-4" strokeWidth={3} aria-hidden />
                  </button>
                  <span
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border-2 border-natureza bg-natureza-soft font-display text-xl font-bold text-natureza-dark"
                    aria-label={`Coeficiente do ${sp.name}: ${coefs[i]}`}
                  >
                    {coefs[i]}
                  </span>
                  <button
                    type="button"
                    onClick={() => bump(i, 1)}
                    aria-label={`Aumentar coeficiente do ${sp.name}`}
                    className="flex size-9 items-center justify-center rounded-xl border-2 border-border bg-cloud text-ink-soft transition-colors hover:border-ink-faint"
                  >
                    <Plus className="size-4" strokeWidth={3} aria-hidden />
                  </button>
                </span>
                <span className="font-display text-xl font-bold text-ink">{sp.formula}</span>
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Balança de átomos */}
      <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4">
        <p className="mb-3 font-display text-sm font-bold text-ink">
          Balança de átomos: reagentes e produtos
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {elements.map((el) => {
            const left = leftTotals[el] ?? 0;
            const right = rightTotals[el] ?? 0;
            const ok = left === right;
            return (
              <div
                key={el}
                className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 ${
                  ok ? "border-success bg-success-soft" : "border-hint bg-hint-soft"
                }`}
                aria-label={`${left === right ? "Equilibrado" : "Desequilibrado"}: elemento ${el} com ${left} átomos nos reagentes e ${right} nos produtos.`}
              >
                <span className="font-display text-lg font-bold text-ink">{el}</span>
                <span className="font-display text-lg font-bold text-ink-soft">
                  {left}
                  <span className="mx-1.5 text-ink-faint">·</span>
                  {right}
                </span>
                <span
                  className={`flex size-7 items-center justify-center rounded-full border-2 ${
                    ok
                      ? "border-success bg-surface text-success-dark"
                      : "border-hint-dark bg-surface text-hint-dark"
                  }`}
                  aria-hidden
                >
                  {ok ? <Check className="size-4" strokeWidth={3.5} /> : "≠"}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs font-semibold leading-relaxed text-ink-faint">
          Dica: {reaction.hint}
        </p>
      </div>

      {/* Botão pesar */}
      <button
        type="button"
        onClick={handleWeigh}
        className="ludus-btn ludus-btn-xl text-white"
        style={{ background: areaColor, borderColor: areaColorDark }}
      >
        Pesar na balança
        <ArrowRight className="size-5" aria-hidden />
      </button>
    </div>
  );
}

/* ------------------------------------------------- Veredito da receita */

function ReactionVerdict({
  reaction,
  coefs,
  areaColor,
  areaColorDark,
  onAdvance,
}: {
  reaction: Reaction;
  coefs: number[];
  areaColor: string;
  areaColorDark: string;
  onAdvance: () => void;
}) {
  const [detailOpen, setDetailOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const nReagents = reaction.reagents.length;
  const elements = elementsOf(reaction);
  const leftTotals: Record<string, number> = {};
  const rightTotals: Record<string, number> = {};
  [...reaction.reagents, ...reaction.products].forEach((sp, i) => {
    const target = i < nReagents ? leftTotals : rightTotals;
    for (const [el, count] of Object.entries(sp.atoms)) {
      target[el] = (target[el] ?? 0) + count * coefs[i];
    }
  });

  const ceLeft = reaction.reagents.map((sp, i) => `${coefs[i]}${toCe(sp.formula)}`).join(" + ");
  const ceRight = reaction.products
    .map((sp, i) => `${coefs[nReagents + i]}${toCe(sp.formula)}`)
    .join(" + ");
  const closedEquationTex = `\\(\\ce{${ceLeft} -> ${ceRight}}\\)`;

  const fullText = [
    reaction.verdict.title,
    stripLatex(reaction.verdict.text),
    stripLatex(reaction.verdict.detail.speech ?? reaction.verdict.detail.text),
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <div className="anim-bounce-in flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-success bg-success-soft p-4 sm:p-5">
        <p className="font-display text-sm font-bold text-success-dark">Equação fechada</p>
        <p className="mt-1 text-center font-display text-xl font-bold leading-relaxed text-ink">
          <MathText text={closedEquationTex} />
        </p>

        <div className="mt-4 border-t-2 border-dashed border-success/40 pt-4 text-center">
          <h3 className="font-display text-lg font-bold text-ink">{reaction.verdict.title}</h3>
          <div ref={textRef} className="mx-auto mt-1 max-w-2xl">
            <p className="text-sm leading-relaxed text-ink sm:text-base">
              <MathText text={reaction.verdict.text} />
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {elements.map((el) => (
            <p
              key={el}
              className="flex items-center justify-center gap-2 rounded-xl bg-surface px-3 py-2 font-display text-sm font-bold text-ink"
            >
              <Check className="size-4 text-success-dark" strokeWidth={3.5} aria-hidden />
              {el}: {leftTotals[el] ?? 0} = {rightTotals[el] ?? 0}
            </p>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setDetailOpen((v) => !v)}
            aria-expanded={detailOpen}
            className="ludus-btn ludus-btn-paper ludus-btn-sm"
          >
            <ChevronDown
              className={`size-4 transition-transform ${detailOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
            {reaction.verdict.detail.label}
          </button>
          <SpeakerButton
            text={fullText}
            highlight={textRef}
            label="Ouvir veredito"
            className="ludus-btn ludus-btn-natureza ludus-btn-sm border-transparent text-white"
          />
        </div>

        {detailOpen && (
          <p className="anim-fade-up mt-3 rounded-2xl border-2 border-border bg-surface p-4 text-left text-sm leading-relaxed text-ink-soft sm:text-base">
            <MathText text={reaction.verdict.detail.text} />
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onAdvance}
        className="ludus-btn ludus-btn-xl text-white"
        style={{ background: areaColor, borderColor: areaColorDark }}
      >
        Próxima receita
        <ArrowRight className="size-5" aria-hidden />
      </button>
    </div>
  );
}
