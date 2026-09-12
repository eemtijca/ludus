"use client";

/**
 * Reação Equilibrada — palco do jogo.
 *
 * Fase 1 · Explorar: escolher a receita da bancada (contexto real).
 * Fase 2 · Testar: esteiras de coeficientes + BALANÇA VIVA de átomos
 *   (contagem por elemento em reagentes × produtos, verde quando fecha).
 * Fase 3 · Decidir: pesar na balança → veredito com conservação da massa.
 */

import { useState } from "react";
import { ArrowRight, FlaskConical, Minus, Plus, Check } from "lucide-react";
import { GameShell } from "@/components/game-shell/game-shell";
import { OptionTile } from "@/components/game-shell/option-tile";
import { useGameSession } from "@/games/_shared/use-game-session";
import { GAME_BY_ID, AREAS } from "@/lib/catalog";
import { REACTIONS, elementsOf, type Reaction, type Species } from "./content";

const GAME_ID = "reacao-equilibrada";

export function ReacaoEquilibradaGame({ onExit }: { onExit: () => void }) {
  const game = GAME_BY_ID[GAME_ID];
  const [reactionIndex, setReactionIndex] = useState(0);
  const session = useGameSession(GAME_ID);

  const nextVariant = {
    label: "Abrir outra receita",
    onPick: () => setReactionIndex((i) => (i + 1) % REACTIONS.length),
  };

  const area = AREAS[game.area];

  return (
    <GameShell
      game={game}
      session={session}
      mission={REACTIONS[reactionIndex].mission}
      instruction={
        session.phase === 1
          ? "Escolha a reação que chega à bancada de hoje."
          : session.phase === 2
            ? "Ajuste os coeficientes até a balança de átomos fechar dos dois lados."
            : "A balança fechou. Pese a reação e registre o resultado."
      }
      narration={REACTIONS[reactionIndex].context}
      nextVariant={nextVariant}
      onExit={onExit}
    >
      <Stage
        key={`${reactionIndex}-${session.generation}`}
        session={session}
        reaction={REACTIONS[reactionIndex]}
        areaColor={area.color}
        areaColorDark={area.colorDark}
        onPhase2={() => session.setPhase(2)}
      />
    </GameShell>
  );
}

/* ------------------------------------------------------------------ Palco */

function Stage({
  session,
  reaction,
  areaColor,
  areaColorDark,
  onPhase2,
}: {
  session: ReturnType<typeof useGameSession>;
  reaction: Reaction;
  areaColor: string;
  areaColorDark: string;
  onPhase2: () => void;
}) {
  const species: Species[] = [...reaction.reagents, ...reaction.products];
  const [coefs, setCoefs] = useState<number[]>(() => species.map(() => 1));

  const nReagents = reaction.reagents.length;
  const elements = elementsOf(reaction);

  const leftTotals: Record<string, number> = {};
  const rightTotals: Record<string, number> = {};
  species.forEach((sp, i) => {
    const target = i < nReagents ? leftTotals : rightTotals;
    for (const [el, count] of Object.entries(sp.atoms)) {
      target[el] = (target[el] ?? 0) + count * coefs[i];
    }
  });

  const allBalanced = elements.every(
    (el) => (leftTotals[el] ?? 0) === (rightTotals[el] ?? 0),
  );

  const bump = (i: number, delta: number) => {
    setCoefs((prev) =>
      prev.map((c, idx) =>
        idx === i ? Math.max(1, Math.min(9, c + delta)) : c,
      ),
    );
  };

  /* ---------------------------------------------------- Fase 1 · Explorar */
  if (session.phase === 1) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-soft">
            <FlaskConical className="size-4" aria-hidden />
            Cantina-laboratório · bancada de reações
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Três receitas aguardam ajuste: a mesma natureza que escreveu as
            reações exige a contagem exata de átomos. Escolha a sua.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {REACTIONS.map((r, i) => (
            <OptionTile
              key={r.id}
              icon={r.icon}
              title={r.title}
              subtitle={`${r.reagents.map((s) => s.name).join(" + ")} viram ${r.products.map((s) => s.name).join(" + ")}`}
              color={r.id === reaction.id ? areaColorDark : areaColor}
              colorDark={areaColorDark}
              correct={r.id === reaction.id}
              onPick={() => {
                if (r.id !== reaction.id) {
                  session.showInfo(
                    `Receita lida: ${r.title}. Ela chega na próxima rodada — a da vez é ${reaction.title}.`,
                  );
                  return false;
                }
                session.showSuccess(`Bancada aberta: ${r.title}.`);
                return true;
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onPhase2}
          className="ludus-btn ludus-btn-xl text-white"
          style={{ background: areaColor, borderColor: areaColorDark }}
        >
          Ajustar “{reaction.title}”
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    );
  }

  /* ------------------------------------------------------ Fase 2 · Testar */
  if (session.phase === 2) {
    return (
      <div className="flex flex-col gap-5">
        {/* Equação com esteiras de coeficientes */}
        <div className="rounded-2xl border-2 border-border bg-white p-4">
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
                  <span className="font-display text-xl font-bold text-ink">
                    {sp.formula}
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Balança de átomos */}
        <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4">
          <p className="mb-3 font-display text-sm font-bold text-ink">
            Balança de átomos · reagentes × produtos
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
                    ok
                      ? "border-success bg-success-soft"
                      : "border-hint bg-hint-soft"
                  }`}
                  aria-label={`${left === right ? "Equilibrado" : "Desequilibrado"}: elemento ${el} com ${left} átomos nos reagentes e ${right} nos produtos.`}
                >
                  <span className="font-display text-lg font-bold text-ink">
                    {el}
                  </span>
                  <span className="font-display text-lg font-bold text-ink-soft">
                    {left}
                    <span className="mx-1.5 text-ink-faint">·</span>
                    {right}
                  </span>
                  <span
                    className={`flex size-7 items-center justify-center rounded-full border-2 ${
                      ok
                        ? "border-success bg-white text-success-dark"
                        : "border-hint-dark bg-white text-hint-dark"
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
          onClick={() => {
            if (allBalanced) {
              session.setPhase(3);
              session.showSuccess(
                "A balança fechou! Átomos conservados dos dois lados.",
              );
            } else {
              session.showError(
                "A balança ainda torta: algum elemento difere entre reagentes e produtos. Ajuste e pese de novo.",
              );
            }
          }}
          className="ludus-btn ludus-btn-xl text-white"
          style={{ background: areaColor, borderColor: areaColorDark }}
        >
          Pesar na balança
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------- Fase 3 · Decidir */
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border-2 border-success bg-success-soft p-4">
        <p className="font-display text-sm font-bold text-success-dark">
          Equação fechada
        </p>
        <p className="mt-1 text-center font-display text-xl font-bold leading-relaxed text-ink">
          {coefs
            .slice(0, nReagents)
            .map((c, i) => `${c}${reaction.reagents[i].formula}`)
            .join(" + ")}
          {" → "}
          {coefs
            .slice(nReagents)
            .map((c, i) => `${c}${reaction.products[i].formula}`)
            .join(" + ")}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {elements.map((el) => (
            <p
              key={el}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 font-display text-sm font-bold text-ink"
            >
              <Check
                className="size-4 text-success-dark"
                strokeWidth={3.5}
                aria-hidden
              />
              {el}: {leftTotals[el] ?? 0} = {rightTotals[el] ?? 0}
            </p>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          session.finish({
            title: reaction.verdict.title,
            text: reaction.verdict.text,
            detail: reaction.verdict.detail,
            caseId: reaction.id,
          })
        }
        className="ludus-btn ludus-btn-xl text-white"
        style={{ background: areaColor, borderColor: areaColorDark }}
      >
        <Check className="size-5" strokeWidth={3} aria-hidden />
        Registrar a reação
      </button>
    </div>
  );
}
