"use client";

/**
 * O Circuito Falhou: palco do jogo.
 *
 * Fase 1 (Explorar): escolher o caso da bancada (sintoma e breve).
 * Fase 2 (Testar): bancada com chave, associação e lâmpada em toggles,
 *   diagrama SVG com fluxo de corrente e medidor de amperes.
 * Fase 3 (Decidir): diagnóstico, escolhendo a explicação correta.
 */

import { useState } from "react";
import { ArrowRight, Zap } from "lucide-react";
import { GameShell } from "@/components/game-shell/game-shell";
import { OptionTile } from "@/components/game-shell/option-tile";
import { EvidenceCard, type EvidenceCardData } from "@/components/game-shell/evidence-card";
import { useGameSession } from "@/games/_shared/use-game-session";
import { GAME_BY_ID, AREAS } from "@/lib/catalog";
import { CASES, type CircuitCase } from "./content";
import { formatNumber } from "@/lib/format";

const GAME_ID = "circuito-falhou";

interface BenchState {
  switchClosed: boolean;
  parallel: boolean;
  lampIn: boolean;
}

export function CircuitoFalhouGame({ onExit }: { onExit: () => void }) {
  const game = GAME_BY_ID[GAME_ID];
  const [caseIndex, setCaseIndex] = useState(0);
  const session = useGameSession(GAME_ID);

  const nextVariant = {
    label: "Abrir outra bancada",
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
          ? "Escolha o defeito que chegou à bancada hoje."
          : session.phase === 2
            ? "Acione chave, associação e lâmpada até o circuito funcionar, depois meça."
            : "Diagnóstico final: explique o defeito desta bancada."
      }
      narration={CASES[caseIndex].brief}
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
  caso: CircuitCase;
  areaColor: string;
  areaColorDark: string;
  onPhase2: () => void;
  onPhase3: () => void;
}) {
  const [bench, setBench] = useState<BenchState>({
    switchClosed: false,
    parallel: false,
    lampIn: caso.id === "curto-perigoso" ? false : true,
  });
  const [read, setRead] = useState<string[]>([]);

  /* Corrente pela Lei de Ohm conforme o estado da bancada. */
  const current = (() => {
    if (!bench.switchClosed) return 0;
    if (!bench.lampIn) return caso.voltage / caso.wireResistance; // fio direto (curto)
    const r = bench.parallel ? caso.lampResistance / 2 : caso.lampResistance;
    return caso.voltage / r;
  })();

  /* Estado exibido: aberto (sem caminho), curto (fio direto) ou ok. */
  const currentState: "off" | "ok" | "danger" = !bench.switchClosed
    ? "off"
    : !bench.lampIn
      ? "danger"
      : "ok";

  /* ---------------------------------------------------- Fase 1 (Explorar) */
  if (session.phase === 1) {
    const cards: EvidenceCardData[] = CASES.map((c) => ({
      icon: c.icon,
      category: c.title,
      hook: c.symptom,
      evidence: c.brief,
    }));
    const allRead = read.length === CASES.length;

    const handleRead = (c: CircuitCase) => {
      if (read.includes(c.id)) return;
      const next = [...read, c.id];
      setRead(next);
      if (next.length === CASES.length) {
        session.showSuccess("As três bancadas estão na mesa. Teste a bancada da rodada.");
      } else if (c.id === caso.id) {
        session.showSuccess(`Bancada aberta: ${c.title}. ${c.symptom}`);
      } else {
        session.showInfo(`Prontuário lido: ${c.title}. Chega na próxima rodada.`);
      }
    };

    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-soft">
            <Zap className="size-4" aria-hidden />
            Laboratório de física · bancadas de manutenção
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Três avarias chegaram hoje: um celular mudo, um quarto no escuro e um fio esquentando.
            Vire os três prontuários para conhecer as bancadas e depois teste a da rodada.
          </p>
        </div>
        <div>
          <p className="mb-3 font-display text-sm font-bold text-ink-soft">
            Bancadas examinadas · {read.length}/{CASES.length}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {CASES.map((c, i) => (
              <EvidenceCard
                key={c.id}
                data={cards[i]}
                color={c.id === caso.id ? areaColorDark : areaColor}
                onReveal={() => handleRead(c)}
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
            Testar “{caso.title}”
            <ArrowRight className="size-5" aria-hidden />
          </button>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------ Fase 2 (Testar) */
  if (session.phase === 2) {
    const toggle = (key: keyof BenchState) => {
      const next = { ...bench, [key]: !bench[key] };
      setBench(next);
      if (key === "switchClosed" && next.switchClosed && !next.lampIn) {
        session.showError(
          "Cuidado: chave fechada sem lâmpada no caminho é fio direto nos polos, corrente de curto.",
        );
      } else if (key === "lampIn" && !next.lampIn && next.switchClosed) {
        session.showError("A lâmpada saiu do caminho: a corrente passou a circular só pelo fio.");
      } else {
        session.showInfo(
          next.switchClosed
            ? "Chave fechada: o caminho está completo."
            : "Chave aberta: o caminho está interrompido.",
        );
      }
    };

    return (
      <div className="flex flex-col gap-5">
        <CircuitDiagram voltage={caso.voltage} bench={bench} currentState={currentState} />

        {/* Medidor */}
        <div
          className={`rounded-2xl border-2 p-4 ${
            currentState === "danger"
              ? "border-danger bg-danger-soft"
              : currentState === "ok"
                ? "border-success bg-success-soft"
                : "border-border bg-cloud/60"
          }`}
        >
          <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
            Medidor de corrente (amperímetro em série)
          </p>
          <p
            className={`font-display text-2xl font-bold ${
              currentState === "danger"
                ? "text-danger-dark"
                : currentState === "ok"
                  ? "text-success-dark"
                  : "text-ink-faint"
            }`}
          >
            {formatNumber(current, 2)} A
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug text-ink-soft">
            {currentState === "off" && "Circuito aberto: sem caminho completo, a corrente é zero."}
            {currentState === "danger" &&
              "Corrente altíssima: sem resistência relevante no caminho, o fio esquenta. Risco real."}
            {currentState === "ok" &&
              `Funcionando: ${caso.voltage} V sobre ${
                bench.parallel
                  ? `${caso.lampResistance / 2} Ω no conjunto (paralelo)`
                  : `${caso.lampResistance} Ω`
              } = ${formatNumber(current, 2)} A${
                bench.parallel
                  ? `, e cada lâmpada recebe ${formatNumber(caso.voltage / caso.lampResistance, 2)} A no seu ramo.`
                  : "."
              }`}
          </p>
        </div>

        {/* Controles da bancada */}
        <div className="grid gap-3 sm:grid-cols-3">
          <BenchToggle
            label="Chave"
            icon="tomada"
            hint="Fecha ou abre o caminho"
            active={bench.switchClosed}
            color={areaColor}
            onToggle={() => toggle("switchClosed")}
          />
          <BenchToggle
            label="Associação em paralelo"
            icon="embaralhar"
            hint="Ramificação independente para cada lâmpada"
            active={bench.parallel}
            color={areaColor}
            onToggle={() => toggle("parallel")}
          />
          <BenchToggle
            label="Lâmpada no circuito"
            icon="lampada"
            hint="Insere a resistência no caminho"
            active={bench.lampIn}
            color={areaColor}
            onToggle={() => toggle("lampIn")}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            if (currentState === "ok") {
              onPhase3();
            } else if (currentState === "off") {
              session.showError(
                "Ainda nada circulando: complete o caminho da corrente antes de medir.",
              );
            } else {
              session.showError(
                "Corrente de curto: insira a lâmpada para dar resistência ao caminho.",
              );
            }
          }}
          className="ludus-btn ludus-btn-xl text-white"
          style={{ background: areaColor, borderColor: areaColorDark }}
        >
          Medir e explicar
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------- Fase 3 (Decidir) */
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-natureza bg-natureza-soft p-4 text-sm font-semibold leading-relaxed text-ink">
        Bancada consertada com {formatNumber(current, 2)} A circulando. Agora o laudo técnico:{" "}
        <strong>por que o defeito acontecia?</strong>
      </div>
      <div className="flex flex-col gap-3">
        {caso.diagnoses.map((d) => (
          <OptionTile
            key={d.id}
            icon={d.icon}
            title={d.title}
            subtitle={d.subtitle}
            color={areaColor}
            colorDark={areaColorDark}
            onPick={() => {
              if (d.correct) {
                session.finish({
                  title: caso.verdict.title,
                  text: caso.verdict.text,
                  detail: caso.verdict.detail,
                  caseId: caso.id,
                });
                return true;
              }
              session.showError(d.feedback);
              return false;
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Componentes */

function CircuitDiagram({
  voltage,
  bench,
  currentState,
}: {
  voltage: number;
  bench: BenchState;
  currentState: "off" | "ok" | "danger";
}) {
  const flowing = bench.switchClosed;
  const wireStroke = flowing
    ? currentState === "danger"
      ? "var(--danger)"
      : "var(--success)"
    : "#b9b2a0";
  const wireWidth = flowing ? 5 : 4;
  const glow = currentState === "ok";
  const labelFill = "var(--ink-soft)";
  const softFill = "var(--cloud)";

  return (
    <figure className="rounded-2xl border-2 border-border bg-surface p-4">
      <figcaption className="mb-1 font-display text-sm font-bold text-ink">
        Diagrama da bancada · fonte {voltage} V
      </figcaption>
      <svg
        viewBox="0 0 360 224"
        className="w-full"
        role="img"
        aria-label={`Diagrama do circuito: fonte de ${voltage} volts, ${bench.switchClosed ? "chave fechada" : "chave aberta"}, ${bench.parallel ? "associação em paralelo com dois ramos" : "caminho único"}, ${bench.lampIn ? "lâmpada inserida" : "sem lâmpada, fio direto"}.`}
      >
        <defs>
          <radialGradient id="lamp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffc800" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#ffc800" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffc800" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Fios do caminho principal, com vãos para a bateria e a lâmpada. */}
        <path
          d="M60 60 H300 V140 H206 M154 140 H60 V124 M60 76 V60"
          fill="none"
          style={{ stroke: wireStroke, strokeWidth: wireWidth, transition: "stroke 200ms ease" }}
          strokeLinecap="round"
        />

        {/* Fluxo animado da corrente. */}
        {flowing && (
          <>
            <path
              d="M60 60 H300 V140 H60 Z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="10 14"
              strokeLinecap="round"
              className="flow-dash"
            />
            {bench.parallel && (
              <path
                d="M110 140 V190 H250 V140"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeDasharray="10 14"
                strokeLinecap="round"
                className="flow-dash"
              />
            )}
          </>
        )}

        {/* Bateria */}
        <g>
          <rect x="48" y="76" width="24" height="48" rx="6" style={{ fill: "var(--ink)" }} />
          <line x1="72" y1="88" x2="82" y2="88" style={{ stroke: "var(--ink)" }} strokeWidth="4" />
          <line
            x1="72"
            y1="112"
            x2="82"
            y2="112"
            style={{ stroke: "var(--ink)" }}
            strokeWidth="2"
          />
          <text
            x="26"
            y="104"
            fontSize="10"
            fontWeight="800"
            style={{ fill: labelFill }}
            textAnchor="middle"
          >
            {voltage}V
          </text>
        </g>

        {/* Chave (interruptor) */}
        <g>
          <circle
            cx="140"
            cy="60"
            r="6"
            style={{ fill: bench.switchClosed ? "var(--success)" : "#b9b2a0" }}
          />
          <circle
            cx="190"
            cy="60"
            r="6"
            style={{ fill: bench.switchClosed ? "var(--success)" : "#b9b2a0" }}
          />
          <line
            x1="140"
            y1="60"
            x2="188"
            y2={bench.switchClosed ? "60" : "34"}
            style={{ stroke: bench.switchClosed ? "var(--success)" : "#8783a0" }}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <text
            x="165"
            y="30"
            fontSize="10"
            fontWeight="800"
            style={{ fill: labelFill }}
            textAnchor="middle"
          >
            {bench.switchClosed ? "chave fechada" : "chave aberta"}
          </text>
        </g>

        {/* Lâmpada principal no trilho inferior (ou fio direto) */}
        {bench.lampIn ? (
          <g>
            {glow && <circle cx="180" cy="140" r="46" fill="url(#lamp-glow)" />}
            <circle
              cx="180"
              cy="140"
              r="26"
              style={{
                fill: glow ? "#ffc800" : softFill,
                stroke: glow ? "#dda500" : "#b9b2a0",
              }}
              strokeWidth="4"
            />
            <path
              d="M170 140 h20 M175 148 h10 M175 132 h10"
              stroke="#8783a0"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text
              x="180"
              y="102"
              fontSize="10"
              fontWeight="800"
              style={{ fill: labelFill }}
              textAnchor="middle"
            >
              {glow ? "acesa" : "apagada"}
            </text>
          </g>
        ) : (
          <g>
            <path
              d="M154 140 H206"
              fill="none"
              style={{ stroke: "var(--danger)" }}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <text
              x="180"
              y="102"
              fontSize="10"
              fontWeight="800"
              style={{ fill: "var(--danger)" }}
              textAnchor="middle"
            >
              fio direto (curto)
            </text>
          </g>
        )}

        {/* Ramo paralelo: segunda lâmpada entre os mesmos trilhos */}
        {bench.parallel && (
          <g>
            <path
              d="M110 140 V190 H250 V140"
              fill="none"
              style={{
                stroke: wireStroke,
                strokeWidth: wireWidth,
                transition: "stroke 200ms ease",
              }}
              strokeLinecap="round"
            />
            {glow && bench.switchClosed && (
              <circle cx="180" cy="190" r="30" fill="url(#lamp-glow)" />
            )}
            <circle
              cx="180"
              cy="190"
              r="16"
              style={{
                fill: glow && bench.switchClosed ? "#ffc800" : softFill,
                stroke: glow && bench.switchClosed ? "#dda500" : "#b9b2a0",
              }}
              strokeWidth="3.5"
            />
            <path
              d="M174 190 h12 M177 196 h6 M177 184 h6"
              stroke="#8783a0"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <text
              x="180"
              y="219"
              fontSize="10"
              fontWeight="800"
              style={{ fill: labelFill }}
              textAnchor="middle"
            >
              ramo paralelo
            </text>
          </g>
        )}
      </svg>
    </figure>
  );
}

function BenchToggle({
  label,
  icon,
  hint,
  active,
  color,
  onToggle,
}: {
  label: string;
  icon: string;
  hint: string;
  active: boolean;
  color: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`ludus-card flex flex-col items-center gap-2 p-4 text-center ${
        active ? "border-success" : ""
      }`}
      style={active ? { boxShadow: "0 5px 0 #46a302" } : undefined}
    >
      <span
        className="ludus-tile flex size-12 items-center justify-center rounded-2xl text-white"
        style={{ background: active ? "var(--success)" : color, opacity: active ? 1 : 0.75 }}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon === "tomada" && (
            <>
              <path d="M9 2v6M15 2v6" />
              <path d="M6 8h12v4a6 6 0 0 1-12 0z" />
              <path d="M12 18v4" />
            </>
          )}
          {icon === "embaralhar" && (
            <>
              <path d="M2 18h4l10-12h6" />
              <path d="M18 4l4 4-4 4" />
              <path d="M2 6h4l3 3.5" />
              <path d="M12.5 14.5L16 18h6" />
              <path d="M18 14l4 4-4 4" />
            </>
          )}
          {icon === "lampada" && (
            <>
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z" />
            </>
          )}
        </svg>
      </span>
      <span className="font-display text-sm font-bold text-ink">{label}</span>
      <span className="text-[0.7rem] font-semibold leading-snug text-ink-soft">{hint}</span>
      <span
        className={`ludus-chip ${active ? "border-success text-success-dark" : "text-ink-faint"}`}
        style={active ? { background: "var(--success-soft)" } : { background: "var(--cloud)" }}
      >
        {active ? "Ativo" : "Inativo"}
      </span>
    </button>
  );
}
