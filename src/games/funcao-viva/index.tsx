"use client";

/**
 * Função Viva — palco do jogo.
 *
 * Fase 1 · Explorar: escolher a pista — entrega (reta) ou cantina (parábola).
 * Fase 2 · Testar: simulador vivo com controles e gráfico SVG (curva +
 *   marcador + linha-alvo), tabela de valores.
 * Fase 3 · Decidir: desafio de leitura gráfica — acertar o ponto-alvo
 *   (interseção com reta-alvo no modo linear; vértice no modo quadrático).
 */

import { useMemo, useState } from "react";
import { ArrowRight, LineChart } from "lucide-react";
import { GameShell } from "@/components/game-shell/game-shell";
import { OptionTile } from "@/components/game-shell/option-tile";
import { useGameSession } from "@/games/_shared/use-game-session";
import { GAME_BY_ID, AREAS } from "@/lib/catalog";
import { formatCurrency, clamp } from "@/lib/format";

const GAME_ID = "funcao-viva";

type Mode = "entrega" | "lanche";

/* ------------------------------------------------------------- Parâmetros */

const LINEAR = {
  /** Taxa base da corrida (R$). */
  base: 4,
  /** Preço por km default (R$). */
  slope: 3.5,
  /** Alvo do desafio: custo exato da corrida (R$). */
  target: 40,
};

const QUAD = { a: -2, b: 40, c: -72 };

function linearFare(slope: number, distance: number): number {
  return LINEAR.slope === 0 ? 0 : slope * distance + LINEAR.base;
}

function quadProfit(q: number): number {
  return QUAD.a * q * q + QUAD.b * q + QUAD.c;
}

export function FuncaoVivaGame({ onExit }: { onExit: () => void }) {
  const game = GAME_BY_ID[GAME_ID];
  const session = useGameSession(GAME_ID);

  const area = AREAS[game.area];

  return (
    <GameShell
      game={game}
      session={session}
      mission="Bancada de funções: entregas e cantina"
      instruction={
        session.phase === 1
          ? "Escolha a pista de teste: a reta das entregas ou a curva da cantina."
          : session.phase === 2
            ? "Mova os controles e observe a curva, o marcador e a tabela reagirem."
            : "Desafio final: posicione o marcador no ponto pedido e confirme."
      }
      narration="Simulador de funções do 1º e do 2º grau. Sem cronômetro, com repetição livre."
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
  const [mode, setMode] = useState<Mode | null>(null);
  const [slope, setSlope] = useState(LINEAR.slope);
  const [distance, setDistance] = useState(6);
  const [quantity, setQuantity] = useState(10);

  const targetDistance = useMemo(
    () =>
      clamp(
        Math.round((LINEAR.target - LINEAR.base) / Math.max(slope, 0.5)),
        1,
        15,
      ),
    [slope],
  );
  const vertexQ = -QUAD.b / (2 * QUAD.a);

  /* ---------------------------------------------------- Fase 1 · Explorar */
  if (session.phase === 1) {
    return (
      <div className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <OptionTile
            icon="maleta"
            title="Entrega reta"
            subtitle="Preço por km + taxa base — função do 1º grau"
            color={areaColor}
            colorDark={areaColorDark}
            onPick={() => {
              setMode("entrega");
              session.showSuccess("Pista da reta escolhida. Ajuste e observe.");
              return true;
            }}
          />
          <OptionTile
            icon="grafico"
            title="Lanche parábola"
            subtitle="Lucro que sobe, topo e cai — função do 2º grau"
            color={areaColor}
            colorDark={areaColorDark}
            onPick={() => {
              setMode("lanche");
              session.showSuccess(
                "Pista da parábola escolhida. Ajuste e observe.",
              );
              return true;
            }}
          />
        </div>
        {mode && (
          <button
            type="button"
            onClick={() => session.setPhase(2)}
            className="ludus-btn ludus-btn-xl anim-bounce-in text-white"
            style={{ background: areaColor, borderColor: areaColorDark }}
          >
            Testar valores na pista
            <ArrowRight className="size-5" aria-hidden />
          </button>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------ Fase 2 · Testar */
  if (session.phase === 2) {
    return (
      <div className="flex flex-col gap-5">
        {mode === "entrega" ? (
          <LinearSim
            slope={slope}
            distance={distance}
            onSlope={setSlope}
            onDistance={setDistance}
            color={areaColor}
          />
        ) : (
          <QuadraticSim
            quantity={quantity}
            onQuantity={setQuantity}
            color={areaColor}
          />
        )}

        <button
          type="button"
          onClick={() => session.setPhase(3)}
          className="ludus-btn ludus-btn-xl text-white"
          style={{ background: areaColor, borderColor: areaColorDark }}
        >
          Marcar ponto e avançar
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------- Fase 3 · Decidir */
  const confirmChallenge = () => {
    if (mode === "entrega") {
      const fare = linearFare(slope, distance);
      if (Math.abs(distance - targetDistance) <= 1) {
        session.finish({
          title: "Reta lida como um mapa",
          text: `Você posicionou o marcador em ${distance} km — exatamente onde a reta cruza a linha dos ${formatCurrency(LINEAR.target)} (${slope.toFixed(1).replace(".", ",")}·d + 4). Ler interseção no gráfico é resolver a equação sem papel.`,
          detail: {
            label: "Ver a álgebra escondida no gráfico",
            text: `Equação da reta: f(d) = ${String(slope).replace(".", ",")}d + 4. Procurar f(d) = 40 é resolver 40 = ${String(slope).replace(".", ",")}d + 4 → d = 36 ÷ ${String(slope).replace(".", ",")} ≈ ${targetDistance} km. O gráfico mostra a mesma conta — só que desenhada.`,
          },
          caseId: "entrega",
        });
        return true;
      }
      session.showError(
        `A ${distance} km a corrida custa ${formatCurrency(fare)} — ainda fora da linha-alvo de ${formatCurrency(LINEAR.target)}. Siga a curva até o cruzamento.`,
      );
      return false;
    }
    if (Math.abs(quantity - vertexQ) <= 1) {
      session.finish({
        title: "Topo do lucro alcançado",
        text: `Com ${quantity} lanches o lucro chega ao máximo de ${formatCurrency(quadProfit(quantity))} — o vértice da parábola. Passou disso, o lucro cai: preço baixo demais paga a conta do pão.`,
        detail: {
          label: "Ver a álgebra escondida no gráfico",
          text: `Função do lucro: L(q) = -2q² + 40q - 72. O vértice fica em q = -b/2a = -40 ÷ (2·-2) = 10. A tabela mostra: em 9 dá R$ 189, em 10 dá R$ 192 (máximo), em 11 dá R$ 189 — simetria perfeita ao redor do topo.`,
        },
        caseId: "lanche",
      });
      return true;
    }
    session.showError(
      `Com ${quantity} lanches o lucro é ${formatCurrency(quadProfit(quantity))} — ainda fora do topo. Procure o ponto mais alto da curva.`,
    );
    return false;
  };

  return (
    <div className="flex flex-col gap-5">
      {mode === "entrega" ? (
        <>
          <div className="rounded-2xl border-2 border-matematica bg-matematica-soft p-4 text-sm font-semibold leading-relaxed text-ink">
            Desafio: a partir de quantos km a corrida custa exatamente{" "}
            {formatCurrency(LINEAR.target)}? Mova a distância até o marcador
            tocar a linha-alvo.
          </div>
          <LinearSim
            slope={slope}
            distance={distance}
            onSlope={setSlope}
            onDistance={setDistance}
            color={areaColor}
            showTarget
          />
        </>
      ) : (
        <>
          <div className="rounded-2xl border-2 border-matematica bg-matematica-soft p-4 text-sm font-semibold leading-relaxed text-ink">
            Desafio: qual quantidade de lanches maximiza o lucro? Mova até o
            topo da curva.
          </div>
          <QuadraticSim
            quantity={quantity}
            onQuantity={setQuantity}
            color={areaColor}
          />
        </>
      )}
      <button
        type="button"
        onClick={confirmChallenge}
        className="ludus-btn ludus-btn-xl text-white"
        style={{ background: areaColor, borderColor: areaColorDark }}
      >
        Confirmar o ponto
        <ArrowRight className="size-5" aria-hidden />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------ Simuladores */

function LinearSim({
  slope,
  distance,
  onSlope,
  onDistance,
  color,
  showTarget,
}: {
  slope: number;
  distance: number;
  onSlope: (v: number) => void;
  onDistance: (v: number) => void;
  color: string;
  showTarget?: boolean;
}) {
  const fare = linearFare(slope, distance);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Preço por km" value={formatCurrency(slope)} />
        <Stat label="Distância" value={`${distance} km`} />
        <Stat
          label="Corrida"
          value={formatCurrency(fare)}
          highlight={showTarget && Math.abs(fare - LINEAR.target) < 0.01}
        />
      </div>

      <FunctionGraph
        color={color}
        fn={(x) => slope * x + LINEAR.base}
        xMin={0}
        xMax={15}
        yMin={0}
        yMax={Math.max(60, slope * 15 + LINEAR.base)}
        markerX={distance}
        targetY={showTarget ? LINEAR.target : undefined}
        xLabel="km"
        yLabel="R$"
        yFmt={(v) => formatCurrency(v)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Slider
          label="Preço por km"
          value={slope}
          min={2}
          max={8}
          step={0.5}
          suffix="R$/km"
          onChange={onSlope}
        />
        <Slider
          label="Distância da entrega"
          value={distance}
          min={1}
          max={15}
          step={1}
          suffix=" km"
          onChange={(v) => onDistance(Math.round(v))}
        />
      </div>

      <details className="rounded-2xl border-2 border-dashed border-border bg-cloud/50 p-4">
        <summary className="cursor-pointer font-display text-sm font-bold text-matematica-dark">
          Ver tabela de valores
        </summary>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-ink-soft">
              <th className="pb-2 pr-4 font-bold">Distância</th>
              <th className="pb-2 font-bold">Corrida</th>
            </tr>
          </thead>
          <tbody className="font-semibold text-ink">
            {[2, 6, 10, distance].map((d, i) => (
              <tr
                key={i}
                className={d === distance ? "text-matematica-dark" : ""}
              >
                <td className="py-1 pr-4">{d} km</td>
                <td className="py-1">{formatCurrency(linearFare(slope, d))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs font-semibold text-ink-faint">
          Taxa base fixa de {formatCurrency(LINEAR.base)} somada ao preço por
          km: f(d) = {String(slope).replace(".", ",")}d + 4.
        </p>
      </details>
    </div>
  );
}

function QuadraticSim({
  quantity,
  onQuantity,
  color,
}: {
  quantity: number;
  onQuantity: (v: number) => void;
  color: string;
}) {
  const profit = quadProfit(quantity);
  const L = (q: number) => quadProfit(q);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Lanches vendidos" value={`${quantity}`} />
        <Stat label="Lucro do dia" value={formatCurrency(profit)} />
        <Stat label="Expressão" value="L(q) = -2q² + 40q - 72" small />
      </div>

      <FunctionGraph
        color={color}
        fn={(q) => L(q)}
        xMin={0}
        xMax={20}
        yMin={-80}
        yMax={200}
        markerX={quantity}
        xLabel="lanches"
        yLabel="R$"
        yFmt={(v) => formatCurrency(v)}
      />

      <Slider
        label="Quantidade de lanches"
        value={quantity}
        min={0}
        max={20}
        step={1}
        suffix=" lanches"
        onChange={(v) => onQuantity(Math.round(v))}
      />

      <details className="rounded-2xl border-2 border-dashed border-border bg-cloud/50 p-4">
        <summary className="cursor-pointer font-display text-sm font-bold text-matematica-dark">
          Ver tabela de valores
        </summary>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left text-ink-soft">
              <th className="pb-2 pr-4 font-bold">Lanches</th>
              <th className="pb-2 font-bold">Lucro</th>
            </tr>
          </thead>
          <tbody className="font-semibold text-ink">
            {[2, 9, 10, 11, 18, quantity].map((q, i) => (
              <tr
                key={i}
                className={q === quantity ? "text-matematica-dark" : ""}
              >
                <td className="py-1 pr-4">{q}</td>
                <td className="py-1">{formatCurrency(L(q))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs font-semibold text-ink-faint">
          O lucro sobe até perto de 10 lanches e depois cai: o vértice da
          parábola divide a subida da descida.
        </p>
      </details>
    </div>
  );
}

/* ------------------------------------------------------------ Componentes */

function Stat({
  label,
  value,
  highlight,
  small,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border-2 p-4 ${
        highlight ? "border-success bg-success-soft" : "border-border bg-white"
      }`}
    >
      <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
        {label}
      </p>
      <p
        className={`mt-1 font-display font-bold ${small ? "text-base" : "text-xl"} ${
          highlight ? "text-success-dark" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Slider({
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
  const id = `fn-slider-${label.replace(/\s/g, "-")}`;
  return (
    <div className="rounded-2xl border-2 border-border bg-white p-4">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="font-display text-sm font-bold text-ink">
          {label}
        </label>
        <output
          htmlFor={id}
          className="font-display text-lg font-bold text-matematica-dark"
        >
          {String(value).replace(".", ",")}
          {suffix}
        </output>
      </div>
      <input
        id={id}
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

function FunctionGraph({
  color,
  fn,
  xMin,
  xMax,
  yMin,
  yMax,
  markerX,
  targetY,
  xLabel,
  yLabel,
  yFmt,
}: {
  color: string;
  fn: (x: number) => number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  markerX: number;
  targetY?: number;
  xLabel: string;
  yLabel: string;
  yFmt: (v: number) => string;
}) {
  const W = 340;
  const H = 200;
  const PAD = 40;

  const px = (x: number) => PAD + ((x - xMin) / (xMax - xMin)) * (W - PAD - 12);
  const py = (v: number) =>
    H - PAD - ((v - yMin) / (yMax - yMin)) * (H - PAD - 12);

  const N = 60;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = xMin + ((xMax - xMin) * i) / N;
    const v = fn(x);
    if (v >= yMin - 30 && v <= yMax + 60) {
      pts.push(`${px(x).toFixed(1)},${clamp(py(v), -50, H - 10).toFixed(1)}`);
    }
  }

  const markerY = fn(markerX);
  const markerOnTarget =
    targetY !== undefined && Math.abs(markerY - targetY) < 0.75;

  return (
    <figure className="rounded-2xl border-2 border-border bg-white p-4">
      <figcaption className="mb-1 flex items-center gap-2 font-display text-sm font-bold text-ink">
        <LineChart className="size-4 text-matematica-dark" aria-hidden />
        Gráfico da função
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Gráfico de ${yLabel} por ${xLabel} com marcador em ${markerX}.`}
      >
        {/* grade */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={PAD}
            x2={W - 12}
            y1={PAD + t * (H - PAD - 12)}
            y2={PAD + t * (H - PAD - 12)}
            stroke="#f4f1ea"
            strokeWidth="1.5"
          />
        ))}
        {/* eixo x */}
        <line
          x1={PAD}
          y1={py(0)}
          x2={W - 12}
          y2={py(0)}
          stroke="#e9e2d2"
          strokeWidth="2"
        />
        {/* eixo y */}
        <line
          x1={PAD}
          y1={12}
          x2={PAD}
          y2={H - 12}
          stroke="#e9e2d2"
          strokeWidth="2"
        />

        {/* linha-alvo */}
        {targetY !== undefined && (
          <>
            <line
              x1={PAD}
              x2={W - 12}
              y1={py(targetY)}
              y2={py(targetY)}
              stroke="#ffc800"
              strokeWidth="3"
              strokeDasharray="8 6"
            />
            <text
              x={PAD + 6}
              y={py(targetY) - 6}
              fontSize="9.5"
              fontWeight="800"
              fill="#b98f00"
            >
              alvo: {yFmt(targetY)}
            </text>
          </>
        )}

        {/* curva */}
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* marcador */}
        <line
          x1={px(markerX)}
          x2={px(markerX)}
          y1={py(0)}
          y2={py(markerY)}
          stroke="#8783a0"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <circle
          cx={px(markerX)}
          cy={py(markerY)}
          r="8"
          fill={markerOnTarget ? "#58cc02" : color}
          stroke="#fff"
          strokeWidth="3"
          className="anim-pop"
        />
        <text
          x={clamp(px(markerX) + 10, PAD, W - 70)}
          y={clamp(py(markerY) - 10, 16, H - 16)}
          fontSize="10"
          fontWeight="800"
          fill={markerOnTarget ? "#46a302" : "#3c3a4e"}
        >
          {yFmt(markerY)}
        </text>

        {/* rótulos dos eixos */}
        <text
          x={W - 34}
          y={py(0) + 14}
          fontSize="9"
          fill="#8783a0"
          fontWeight="700"
        >
          {xMax} {xLabel}
        </text>
        <text x={6} y={20} fontSize="9" fill="#8783a0" fontWeight="700">
          {yLabel}
        </text>
      </svg>
    </figure>
  );
}
