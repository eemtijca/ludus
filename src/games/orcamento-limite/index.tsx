"use client";

/**
 * Orçamento no Limite: palco do jogo.
 *
 * Fase 1 (Explorar): escolher a missão financeira.
 * Fase 2 (Testar): simulador com taxa e prazo em controles grandes,
 *   curva de juros compostos em SVG e medidor de comprometimento (30%).
 * Fase 3 (Decidir): parcelar (se couber no limite) ou guardar.
 */

import { useMemo, useState } from "react";
import { ArrowRight, TrendingUp, Wallet } from "lucide-react";
import { GameShell } from "@/components/game-shell/game-shell";
import { OptionTile } from "@/components/game-shell/option-tile";
import { EvidenceCard, type EvidenceCardData } from "@/components/game-shell/evidence-card";
import { useGameSession } from "@/games/_shared/use-game-session";
import { GAME_BY_ID, AREAS } from "@/lib/catalog";
import { MISSIONS, compoundAmount, type BudgetMission } from "./content";
import { formatCurrency } from "@/lib/format";
import { clamp } from "@/lib/format";

const GAME_ID = "orcamento-limite";

export function OrcamentoLimiteGame({ onExit }: { onExit: () => void }) {
  const game = GAME_BY_ID[GAME_ID];
  const [missionIndex, setMissionIndex] = useState(0);
  const session = useGameSession(GAME_ID);

  const nextVariant = {
    label: "Nova missão do balcão",
    onPick: () => setMissionIndex((i) => (i + 1) % MISSIONS.length),
  };

  const area = AREAS[game.area];

  return (
    <GameShell
      game={game}
      session={session}
      mission={MISSIONS[missionIndex].mission}
      instruction={
        session.phase === 1
          ? "Escolha uma das missões do balcão para simular."
          : session.phase === 2
            ? "Mova taxa e prazo e observe a curva e o medidor reagirem."
            : "Hora da verdade no caixa: parcelar ou guardar?"
      }
      narration={MISSIONS[missionIndex].brief}
      nextVariant={nextVariant}
      onExit={onExit}
    >
      <Stage
        key={`${missionIndex}-${session.generation}`}
        session={session}
        missao={MISSIONS[missionIndex]}
        areaColor={area.color}
        areaColorDark={area.colorDark}
        onPhase2={() => session.setPhase(2)}
        onPhase3={() => session.setPhase(3)}
      />
    </GameShell>
  );
}

/* ------------------------------------------------------------------ Palco */

function Stage({
  session,
  missao,
  areaColor,
  areaColorDark,
  onPhase2,
  onPhase3,
}: {
  session: ReturnType<typeof useGameSession>;
  missao: BudgetMission;
  areaColor: string;
  areaColorDark: string;
  onPhase2: () => void;
  onPhase3: () => void;
}) {
  const [rate, setRate] = useState(missao.defaultRate);
  const [term, setTerm] = useState(missao.defaultTerm);

  const calc = useMemo(() => {
    const total = compoundAmount(missao.price, rate, term);
    const installment = total / term;
    const limit = missao.income * 0.3;
    const commitment = installment / missao.income;
    const savings = missao.price / Math.max(1, term);
    return { total, installment, limit, commitment, savings };
  }, [missao, rate, term]);

  /* ---------------------------------------------------- Fase 1 (Explorar) */
  if (session.phase === 1) {
    const cards: EvidenceCardData[] = MISSIONS.map((m) => ({
      icon: m.icon,
      category: m.title,
      hook: m.hook,
      evidence: m.brief,
    }));

    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-soft">
            <Wallet className="size-4" aria-hidden />
            Balcão da loja · simulador financeiro
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Regra de ouro do caixa:{" "}
            <strong className="text-ink">parcela acima de 30% da renda</strong> é aperto garantido
            no fim do mês. Cada missão tem números reais para mexer.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {MISSIONS.map((m, i) => (
            <EvidenceCard
              key={m.id}
              data={cards[i]}
              color={m.id === missao.id ? "var(--matematica-dark)" : "var(--matematica)"}
              onReveal={() => {
                if (m.id === missao.id) {
                  session.showSuccess(
                    `Missão da vez: ${m.title}. Renda de ${formatCurrency(m.income)}.`,
                  );
                } else {
                  session.showInfo(`Brief lido: ${m.hook}. Esta missão chega na próxima rodada.`);
                }
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onPhase2}
          className="ludus-btn ludus-btn-xl text-white"
          style={{ background: "var(--matematica)", borderColor: "var(--matematica-dark)" }}
        >
          Simular “{missao.title}”
          <ArrowRight className="size-5" aria-hidden />
        </button>
        <p className="text-center text-xs font-semibold text-ink-faint">
          Dica: leia os briefs, porque os números voltam no caixa. As outras missões entram nas
          próximas rodadas.
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------ Fase 2 (Testar) */
  if (session.phase === 2) {
    const overLimit = calc.installment > calc.limit;
    const width = clamp(calc.commitment * 100, 0, 100);

    return (
      <div className="flex flex-col gap-5">
        {/* Painel de números */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Preço de etiqueta" value={formatCurrency(missao.price)} />
          <Stat
            label={`Total a prazo (${term}x)`}
            value={formatCurrency(calc.total)}
            highlight={calc.total > missao.price * 1.02}
          />
          <Stat
            label="Parcela mensal"
            value={formatCurrency(calc.installment)}
            highlight={overLimit}
          />
        </div>

        {/* Medidor de comprometimento */}
        <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-sm font-bold text-ink">Comprometimento da renda</p>
            <p className="font-display text-sm font-bold text-ink-soft">
              limite saudável: {formatCurrency(calc.limit)} (30%)
            </p>
          </div>
          <div
            className="ludus-track mt-2 h-[22px]"
            role="progressbar"
            aria-valuenow={Math.round(width)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Comprometimento da renda mensal"
          >
            <i
              style={{
                width: `${width}%`,
                background: overLimit ? "#ff4b4b" : "var(--success)",
                transition: "width 200ms ease-out",
              }}
            />
          </div>
          <p
            className={`mt-2 text-sm font-bold ${overLimit ? "text-danger-dark" : "text-success-dark"}`}
          >
            {overLimit
              ? `Parcela de ${formatCurrency(calc.installment)} estoura o limite: aperto no fim do mês.`
              : `Parcela de ${formatCurrency(calc.installment)} dentro do limite. Respiro garantido.`}
          </p>
        </div>

        {/* Curva de juros */}
        <GrowthChart price={missao.price} rate={rate} term={term} color="var(--matematica)" />

        {/* Controles */}
        <div className="grid gap-4 sm:grid-cols-2">
          <SliderControl
            label="Taxa de juros ao mês"
            value={rate}
            min={0}
            max={8}
            step={0.5}
            suffix="%"
            onChange={setRate}
          />
          <SliderControl
            label="Prazo do parcelamento"
            value={term}
            min={1}
            max={24}
            step={1}
            suffix={term === 1 ? " mês" : " meses"}
            onChange={(v) => setTerm(Math.round(v))}
          />
        </div>

        <button
          type="button"
          onClick={onPhase3}
          className="ludus-btn ludus-btn-xl text-white"
          style={{ background: "var(--matematica)", borderColor: "var(--matematica-dark)" }}
        >
          Levar os números ao caixa
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------- Fase 3 (Decidir) */
  const overLimit = calc.installment > calc.limit;
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4 text-sm leading-relaxed text-ink-soft">
        <strong className="text-ink">Situação no caixa:</strong> parcela de{" "}
        {formatCurrency(calc.installment)} ({(calc.commitment * 100).toFixed(1)}% da renda) · total
        a prazo {formatCurrency(calc.total)} · guardando {formatCurrency(calc.savings)}/mês você
        compra à vista em {term} {term === 1 ? "mês" : "meses"}.
      </div>
      <div className="flex flex-col gap-3">
        <OptionTile
          icon="cedula"
          title="Parcelar na loja"
          subtitle={`Parcela de ${formatCurrency(calc.installment)} por ${term} ${term === 1 ? "mês" : "meses"}`}
          color="var(--matematica)"
          colorDark={areaColorDark}
          onPick={() => {
            if (overLimit) {
              session.showError(
                `A parcela de ${formatCurrency(calc.installment)} estoura o limite de ${formatCurrency(calc.limit)}. Volte ao simulador ou guarde o dinheiro.`,
              );
              return false;
            }
            session.finish({
              title: "Caixa fechado dentro do limite",
              text: missao.verdictInstallment,
              detail: missao.detail,
              caseId: missao.id,
            });
            return true;
          }}
        />
        <OptionTile
          icon="cofre"
          title="Guardar e comprar à vista"
          subtitle={`Reserva de ${formatCurrency(calc.savings)}/mês · sem juros`}
          color="var(--matematica)"
          colorDark={areaColorDark}
          onPick={() => {
            session.finish({
              title: "Reserva venceu os juros",
              text: missao.verdictSave,
              detail: missao.detail,
              caseId: `${missao.id}-save`,
            });
            return true;
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Componentes */

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border-2 p-4 ${
        highlight ? "border-danger bg-danger-soft" : "border-border bg-surface"
      }`}
    >
      <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
        {label}
      </p>
      <p
        className={`mt-1 font-display text-xl font-bold ${
          highlight ? "text-danger-dark" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-border bg-surface p-4">
      <div className="flex items-baseline justify-between">
        <label className="font-display text-sm font-bold text-ink" htmlFor={`slider-${label}`}>
          {label}
        </label>
        <output
          className="font-display text-lg font-bold text-matematica-dark"
          htmlFor={`slider-${label}`}
        >
          {String(value).replace(".", ",")}
          {suffix}
        </output>
      </div>
      <input
        id={`slider-${label}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-2 h-11 w-full accent-matematica"
        aria-label={label}
      />
    </div>
  );
}

function GrowthChart({
  price,
  rate,
  term,
  color,
}: {
  price: number;
  rate: number;
  term: number;
  color: string;
}) {
  const W = 320;
  const H = 150;
  const PAD = 26;

  const months = Array.from({ length: term + 1 }, (_, m) => m);
  const values = months.map((m) => compoundAmount(price, rate, m));
  const maxV = Math.max(...values, price * 1.05);
  const minV = Math.min(...values, price);

  const x = (m: number) => PAD + (m / Math.max(term, 1)) * (W - PAD * 2);
  const y = (v: number) => H - PAD - ((v - minV) / Math.max(maxV - minV, 1e-6)) * (H - PAD * 2);

  const points = months.map((m) => `${x(m).toFixed(1)},${y(values[m]).toFixed(1)}`).join(" ");
  const flatPoints = months.map((m) => `${x(m).toFixed(1)},${y(price).toFixed(1)}`).join(" ");

  return (
    <figure className="rounded-2xl border-2 border-border bg-surface p-4">
      <figcaption className="mb-1 flex items-center gap-2 font-display text-sm font-bold text-ink">
        <TrendingUp className="size-4 text-matematica-dark" aria-hidden />
        Curva dos juros compostos
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Gráfico do total a prazo crescendo de ${formatCurrency(price)} até ${formatCurrency(values[term])} em ${term} meses com taxa de ${String(rate).replace(".", ",")} por cento ao mês.`}
      >
        {/* eixos */}
        <line
          x1={PAD}
          y1={H - PAD}
          x2={W - PAD + 6}
          y2={H - PAD}
          stroke="#e9e2d2"
          strokeWidth="2"
        />
        <line x1={PAD} y1={PAD - 6} x2={PAD} y2={H - PAD} stroke="#e9e2d2" strokeWidth="2" />
        {/* linha do preço à vista */}
        <polyline
          points={flatPoints}
          fill="none"
          stroke="#9693ab"
          strokeWidth="2.5"
          strokeDasharray="6 5"
          strokeLinecap="round"
        />
        {/* curva composta */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ stroke: color }}
        />
        {/* ponto final */}
        <circle
          cx={x(term)}
          cy={y(values[term])}
          r="6"
          fill={color}
          stroke="#fff"
          strokeWidth="2.5"
          style={{ fill: color }}
        />
        {/* Rótulos */}
        <text x={PAD} y={H - 8} fontSize="9" fill="#8783a0" fontWeight="700">
          0 meses
        </text>
        <text x={W - PAD - 14} y={H - 8} fontSize="9" fill="#8783a0" fontWeight="700">
          {term} meses
        </text>
        <text
          x={PAD + 4}
          y={y(price) + 13}
          fontSize="9"
          fill="#8783a0"
          fontWeight="700"
          stroke="#ffffff"
          strokeWidth="2.5"
          paintOrder="stroke"
        >
          à vista {formatCurrency(price)}
        </text>
        <text
          x={Math.max(x(term) - 10, PAD + 60)}
          y={Math.max(y(values[term]) - 14, 14)}
          textAnchor="end"
          fontSize="10"
          fill={color}
          fontWeight="800"
          stroke="#ffffff"
          strokeWidth="3"
          paintOrder="stroke"
          style={{ fill: color }}
        >
          {formatCurrency(values[term])}
        </text>
      </svg>
      <p className="mt-1 text-center text-[0.7rem] font-semibold text-ink-faint">
        Linha tracejada: preço à vista · curva: total financiado
      </p>
    </figure>
  );
}
