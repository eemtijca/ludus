"use client";

/**
 * Risco Provável — palco do jogo.
 *
 * Fase 1 · Explorar: montar a urna (bolas verdes/azuis/vermelhas) e
 *   escolher o regime: com ou sem reposição.
 * Fase 2 · Testar: puxar a alavanca — sorteios animados de 1 em 1 ou em
 *   lote de 100; barra compara frequência observada × chance teórica.
 * Fase 3 · Decidir: a rifa da turma é justa (chance aberta) ou armada?
 */

import { useMemo, useState } from "react";
import { ArrowRight, Dices, RefreshCw } from "lucide-react";
import { GameShell } from "@/components/game-shell/game-shell";
import { OptionTile } from "@/components/game-shell/option-tile";
import { useGameSession } from "@/games/_shared/use-game-session";
import { GAME_BY_ID, AREAS } from "@/lib/catalog";
import { clamp, formatPercent } from "@/lib/format";

const GAME_ID = "risco-provavel";

type BallColor = "verde" | "azul" | "vermelha";

const BALL_HEX: Record<BallColor, string> = {
  verde: "#58cc02",
  azul: "#1cb0f6",
  vermelha: "#ff4b4b",
};

/** Sorteia duas bolas na ordem verde → azul. */
function drawOnce(
  counts: Record<BallColor, number>,
  withReplacement: boolean,
): boolean {
  const bag: BallColor[] = [
    ...Array(counts.verde).fill("verde"),
    ...Array(counts.azul).fill("azul"),
    ...Array(counts.vermelha).fill("vermelha"),
  ];
  if (bag.length === 0) return false;
  const first = bag[Math.floor(Math.random() * bag.length)];
  if (withReplacement) {
    const second = bag[Math.floor(Math.random() * bag.length)];
    return first === "verde" && second === "azul";
  }
  const rest = [...bag];
  rest.splice(rest.indexOf(first), 1);
  if (rest.length === 0) return false;
  const second = rest[Math.floor(Math.random() * rest.length)];
  return first === "verde" && second === "azul";
}

export function RiscoProvavelGame({ onExit }: { onExit: () => void }) {
  const game = GAME_BY_ID[GAME_ID];
  const session = useGameSession(GAME_ID);

  const area = AREAS[game.area];

  return (
    <GameShell
      game={game}
      session={session}
      mission="A rifa da urna: sorte ou matemática?"
      instruction={
        session.phase === 1
          ? "Monte a urna: ajuste as bolas e escolha o regime de sorteio."
          : session.phase === 2
            ? "Puxe a alavanca e compare a frequência observada com a chance teórica."
            : "Decida o destino da rifa: chance aberta ou chance escondida?"
      }
      narration="Simulador de probabilidade com e sem reposição. A urna não engana — quem calcula, sabe."
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
  const [verdes, setVerdes] = useState(2);
  const [azuis, setAzuis] = useState(2);
  const [vermelhas, setVermelhas] = useState(2);
  const [replacement, setReplacement] = useState<boolean | null>(null);
  const [draws, setDraws] = useState(0);
  const [hits, setHits] = useState(0);
  const [lastPair, setLastPair] = useState<[BallColor, BallColor] | null>(null);

  const counts: Record<BallColor, number> = {
    verde: verdes,
    azul: azuis,
    vermelha: vermelhas,
  };
  const total = verdes + azuis + vermelhas;

  const theoretical = useMemo(() => {
    if (total === 0) return 0;
    const pV = verdes / total;
    const pA = replacement
      ? azuis / total
      : total > 1
        ? azuis / (total - 1)
        : 0;
    return pV * pA;
  }, [verdes, azuis, total, replacement]);

  /* ---------------------------------------------------- Fase 1 · Explorar */
  if (session.phase === 1) {
    const ready = replacement !== null;
    return (
      <div className="flex flex-col gap-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          {/* Urna visual */}
          <UrnView counts={counts} lastPair={lastPair} />

          {/* Controles */}
          <div className="flex flex-col gap-4">
            <p className="font-display text-sm font-bold text-ink-soft">
              Bolas na urna · {total} no total
            </p>
            <BallSlider
              label="Bolas verdes"
              value={verdes}
              color={BALL_HEX.verde}
              onChange={setVerdes}
            />
            <BallSlider
              label="Bolas azuis"
              value={azuis}
              color={BALL_HEX.azul}
              onChange={setAzuis}
            />
            <BallSlider
              label="Bolas vermelhas"
              value={vermelhas}
              color={BALL_HEX.vermelha}
              onChange={setVermelhas}
            />
            <div className="rounded-2xl border-2 border-dashed border-border bg-cloud/50 p-3 text-xs font-semibold leading-relaxed text-ink-soft">
              O sorteio premiado é{" "}
              <strong className="text-ink">verde e depois azul</strong>. Verde:{" "}
              {verdes}/{total} · Azul em seguida:{" "}
              {replacement
                ? `${azuis}/${total}`
                : `${azuis}/${Math.max(total - 1, 1)}`}{" "}
              — a conta muda se a primeira bola volta.
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <OptionTile
            icon="escudo"
            title="Sem reposição"
            subtitle="A bola sorteada fica fora"
            color={areaColor}
            colorDark={areaColorDark}
            correct={replacement === false}
            onPick={() => {
              setReplacement(false);
              session.showSuccess(
                "Sem reposição: a segunda saída sai de uma bola a menos.",
              );
              return true;
            }}
          />
          <OptionTile
            icon="embaralhar"
            title="Com reposição"
            subtitle="A bola volta antes do próximo sorteio"
            color={areaColor}
            colorDark={areaColorDark}
            correct={replacement === true}
            onPick={() => {
              setReplacement(true);
              session.showSuccess(
                "Com reposição: as duas saídas usam a urna cheia.",
              );
              return true;
            }}
          />
        </div>

        {ready && (
          <button
            type="button"
            onClick={() => session.setPhase(2)}
            className="ludus-btn ludus-btn-xl anim-bounce-in text-white"
            style={{ background: areaColor, borderColor: areaColorDark }}
          >
            Puxar a alavanca
            <ArrowRight className="size-5" aria-hidden />
          </button>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------ Fase 2 · Testar */
  if (session.phase === 2) {
    const withReplacement = replacement ?? false;
    const observed = draws > 0 ? hits / draws : 0;

    const simulate = (times: number) => {
      let newHits = hits;
      const pairs: [BallColor, BallColor][] = [];
      for (let i = 0; i < times; i++) {
        const bag: BallColor[] = [
          ...Array(verdes).fill("verde"),
          ...Array(azuis).fill("azul"),
          ...Array(vermelhas).fill("vermelha"),
        ];
        const first = bag[Math.floor(Math.random() * bag.length)];
        const rest = [...bag];
        if (!withReplacement) rest.splice(rest.indexOf(first), 1);
        const second = rest.length
          ? rest[Math.floor(Math.random() * rest.length)]
          : first;
        pairs.push([first, second]);
        if (first === "verde" && second === "azul") newHits += 1;
      }
      setDraws((d) => d + times);
      setHits(newHits);
      setLastPair(pairs[pairs.length - 1]);
      session.showInfo(
        times === 1
          ? `Sorteio único: ${pairs[0][0]} → ${pairs[0][1]}. ${pairs[0][0] === "verde" && pairs[0][1] === "azul" ? "Sucesso!" : "Não foi dessa vez."}`
          : `+${times} sorteios de uma vez. A frequência vai se aproximando da chance teórica.`,
      );
      if (draws + times >= 100) {
        session.showSuccess(
          "Cem sorteios no histórico: a lei dos grandes números dá as caras.",
        );
      }
    };

    return (
      <div className="flex flex-col gap-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <UrnView counts={counts} lastPair={lastPair} animated={draws > 0} />
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="Chance teórica" value={formatPercent(theoretical)} />
              <Stat
                label={`Frequência (${draws} sorteios)`}
                value={draws ? formatPercent(observed) : "—"}
              />
            </div>

            {/* barra comparativa */}
            <div className="rounded-2xl border-2 border-border bg-white p-4">
              <p className="font-display text-sm font-bold text-ink">
                Observado × teórico
              </p>
              <div className="relative mt-3 h-6 overflow-hidden rounded-full bg-cloud">
                <div
                  className="h-full rounded-full bg-matematica transition-[width] duration-500"
                  style={{ width: `${Math.max(observed * 100, 1)}%` }}
                />
                {/* marcador teórico */}
                <div
                  className="absolute top-0 h-full w-1 rounded-full bg-ink"
                  style={{ left: `${clamp(theoretical * 100, 1, 99)}%` }}
                  aria-hidden
                />
              </div>
              <p className="mt-2 flex items-center gap-2 text-xs font-bold text-ink-soft">
                <span
                  className="inline-block size-3 rounded-full bg-matematica"
                  aria-hidden
                />
                frequência observada
                <span
                  className="ml-2 inline-block h-3 w-1 rounded-full bg-ink"
                  aria-hidden
                />
                chance teórica
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => simulate(1)}
                className="ludus-btn ludus-btn-matematica flex-1"
              >
                <Dices className="size-5" aria-hidden />
                Sortear 1 vez
              </button>
              <button
                type="button"
                onClick={() => simulate(100)}
                className="ludus-btn ludus-btn-ink flex-1"
              >
                <RefreshCw className="size-5" aria-hidden />
                Sortear 100 vezes
              </button>
            </div>
            <p className="text-xs font-semibold leading-relaxed text-ink-faint">
              Histórico: {hits} sucesso{hits === 1 ? "" : "s"} em {draws}{" "}
              sorteio
              {draws === 1 ? "" : "s"} · último par:{" "}
              {lastPair ? `${lastPair[0]} → ${lastPair[1]}` : "—"}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => session.setPhase(3)}
          disabled={draws < 100}
          className="ludus-btn ludus-btn-xl text-white"
          style={{ background: areaColor, borderColor: areaColorDark }}
        >
          {draws < 100
            ? `Faltam ${100 - draws} sorteios para decidir`
            : "Decidir a rifa"}
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------- Fase 3 · Decidir */
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4 text-sm leading-relaxed text-ink-soft">
        A rifa da turma sorteia com a sua urna ({verdes}V · {azuis}A ·{" "}
        {vermelhas}M, {(replacement ?? false) ? "com" : "sem"} reposição).
        Chance real de ganhar:{" "}
        <strong className="text-ink">{formatPercent(theoretical)}</strong>. Você
        é quem comunica as regras no mural.
      </div>
      <div className="flex flex-col gap-3">
        <OptionTile
          icon="certo"
          title="Rifa justa"
          subtitle={`Divulgar a chance de ${formatPercent(theoretical)} na cartela`}
          color={areaColor}
          colorDark={areaColorDark}
          onPick={() => {
            session.finish({
              title: "Rifa honesta, chance na lata",
              text: `Você publicou a chance real de ${formatPercent(theoretical)} na cartela — e ainda explicou como calculou. Rifa transparente é jogo: rifa sem número é pegadinha.`,
              detail: {
                label: "Ver a conta completa",
                text: `Sem reposição: (${verdes}/${total}) × (${azuis}/${Math.max(total - 1, 1)}) = ${formatPercent(theoretical, 2)}. Com reposição seria (${verdes}/${total}) × (${azuis}/${total}). A frequência dos ${draws} sorteios convergiu para esse valor — a matemática sempre aparece no longo prazo.`,
              },
              caseId: "justa",
            });
            return true;
          }}
        />
        <OptionTile
          icon="alerta"
          title="Rifa armada"
          subtitle="Esconder a chance para vender mais cartelas"
          color={areaColor}
          colorDark={areaColorDark}
          onPick={() => {
            session.showError(
              "Esconder a chance transforma o jogo em armadilha: quem compra tem direito de saber o que compra. A urna deu o número — use-o.",
            );
            return false;
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Componentes */

function BallSlider({
  label,
  value,
  color,
  onChange,
}: {
  label: string;
  value: number;
  color: string;
  onChange: (v: number) => void;
}) {
  const id = `ball-${label.replace(/\s/g, "-")}`;
  return (
    <div className="rounded-2xl border-2 border-border bg-white p-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="flex items-center gap-2 font-display text-sm font-bold text-ink"
        >
          <span
            className="size-4 rounded-full border-2 border-black/10"
            style={{ background: color }}
            aria-hidden
          />
          {label}
        </label>
        <output
          htmlFor={id}
          className="font-display text-lg font-bold text-matematica-dark"
        >
          {value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="mt-1 h-11 w-full accent-matematica"
        aria-label={label}
      />
    </div>
  );
}

function UrnView({
  counts,
  lastPair,
  animated,
}: {
  counts: Record<BallColor, number>;
  lastPair: [BallColor, BallColor] | null;
  animated?: boolean;
}) {
  const balls: BallColor[] = [
    ...Array(counts.verde).fill("verde"),
    ...Array(counts.azul).fill("azul"),
    ...Array(counts.vermelha).fill("vermelha"),
  ];

  const positions = balls.map((_, i) => {
    const angle = (i / Math.max(balls.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 36 : 18;
    return {
      x: 90 + r * Math.cos(angle),
      y: 100 + r * Math.sin(angle) * 0.72,
    };
  });

  return (
    <figure className="flex flex-col items-center rounded-2xl border-2 border-border bg-white p-4">
      <figcaption className="mb-1 font-display text-sm font-bold text-ink">
        Urna da rifa
      </figcaption>
      <svg
        viewBox="0 0 180 170"
        className="w-full max-w-[240px]"
        role="img"
        aria-label={`Urna com ${balls.length} bolas: ${counts.verde} verdes, ${counts.azul} azuis e ${counts.vermelha} vermelhas.`}
      >
        {/* corpo da urna */}
        <path
          d="M32 30 L148 30 L136 155 Q90 168 44 155 Z"
          fill="#e0f7f4"
          stroke="#14b8a6"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <rect x="26" y="18" width="128" height="14" rx="7" fill="#14b8a6" />
        {/* bolas */}
        {balls.map((ball, i) => (
          <circle
            key={i}
            cx={positions[i].x}
            cy={positions[i].y}
            r="9.5"
            fill={BALL_HEX[ball]}
            stroke="#ffffff"
            strokeWidth="2"
            className={animated ? "anim-pop" : undefined}
            style={{ animationDelay: `${(i % 5) * 60}ms` }}
          />
        ))}
      </svg>
      {lastPair && (
        <p
          className="mt-1 flex items-center gap-2 text-xs font-bold text-ink-soft"
          aria-live="polite"
        >
          Saída:
          <span className="inline-flex items-center gap-1">
            <span
              className="size-3.5 rounded-full"
              style={{ background: BALL_HEX[lastPair[0]] }}
              aria-hidden
            />
            {lastPair[0]}
          </span>
          <span aria-hidden>→</span>
          <span className="inline-flex items-center gap-1">
            <span
              className="size-3.5 rounded-full"
              style={{ background: BALL_HEX[lastPair[1]] }}
              aria-hidden
            />
            {lastPair[1]}
          </span>
        </p>
      )}
    </figure>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-white p-4">
      <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
        {label}
      </p>
      <p className="mt-1 font-display text-xl font-bold text-ink">{value}</p>
    </div>
  );
}
