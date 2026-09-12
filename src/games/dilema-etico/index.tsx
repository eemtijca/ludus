"use client";

/**
 * Dilema Ético — palco do jogo.
 *
 * Fase 1 · Explorar: as 3 peças da semana (contrato, casa, lei).
 * Fase 2 · Testar: viver 3 turnos — cada escolha move as barras de
 *   dinheiro, tempo e saúde com consequência narrada.
 * Fase 3 · Decidir: reflexão final sobre trabalho na adolescência.
 */

import { useState } from "react";
import { ArrowRight, Wallet, Clock, HeartPulse } from "lucide-react";
import { GameShell } from "@/components/game-shell/game-shell";
import { EvidenceCard } from "@/components/game-shell/evidence-card";
import { OptionTile } from "@/components/game-shell/option-tile";
import { useGameSession } from "@/games/_shared/use-game-session";
import { GAME_BY_ID, AREAS } from "@/lib/catalog";
import { PIECES, TURNS, REFLECTION } from "./content";
import { clamp } from "@/lib/format";

const GAME_ID = "dilema-etico";

const INITIAL = { money: 40, time: 40, health: 40 };

export function DilemaEticoGame({ onExit }: { onExit: () => void }) {
  const game = GAME_BY_ID[GAME_ID];
  const session = useGameSession(GAME_ID);

  const area = AREAS[game.area];

  return (
    <GameShell
      game={game}
      session={session}
      mission="Uma semana, três turnos, escolhas com preço"
      instruction={
        session.phase === 1
          ? "Abra as três peças da semana antes de jogar os turnos."
          : session.phase === 2
            ? "Escolha o que fazer neste turno — as barras respondem na hora."
            : REFLECTION.prompt
      }
      narration="Simulação de decisão: trabalho, dinheiro e limites na adolescência."
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
  const [opened, setOpened] = useState<number[]>([]);
  const [stats, setStats] = useState({ ...INITIAL });
  const [turn, setTurn] = useState(1);
  const [history, setHistory] = useState<string[]>([]);

  const handleOpen = (index: number) => {
    if (opened.includes(index)) return;
    const next = [...opened, index];
    setOpened(next);
    if (next.length === 3) {
      session.showSuccess(
        "Peças abertas: contrato, casa e lei. Os turnos começam.",
      );
    }
  };

  const applyChoice = (choice: (typeof TURNS)[number]) => {
    setStats((prev) => ({
      money: clamp(prev.money + choice.effect.money, 0, 100),
      time: clamp(prev.time + choice.effect.time, 0, 100),
      health: clamp(prev.health + choice.effect.health, 0, 100),
    }));
    setHistory((h) => [...h, choice.id]);
    const nextTurn = turn + 1;
    if (nextTurn > 3) {
      session.showSuccess(`Semana fechada. ${choice.consequence}`);
      session.setPhase(3);
    } else {
      setTurn(nextTurn);
      session.showInfo(`Turno ${turn} fechado. ${choice.consequence}`);
    }
  };

  /* ---------------------------------------------------- Fase 1 · Explorar */
  if (session.phase === 1) {
    const allOpened = opened.length === 3;
    return (
      <div className="flex flex-col gap-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <LifeBar
            icon={<Wallet className="size-4" aria-hidden />}
            label="Dinheiro"
            value={stats.money}
            color="#ff9600"
          />
          <LifeBar
            icon={<Clock className="size-4" aria-hidden />}
            label="Tempo/Estudo"
            value={stats.time}
            color="#14b8a6"
          />
          <LifeBar
            icon={<HeartPulse className="size-4" aria-hidden />}
            label="Saúde/Sono"
            value={stats.health}
            color="#ff4b4b"
          />
        </div>

        <div>
          <p className="mb-3 font-display text-sm font-bold text-ink-soft">
            Peças da semana · {opened.length}/3 abertas
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {PIECES.map((piece, i) => (
              <EvidenceCard
                key={piece.category}
                data={piece}
                color={areaColor}
                onReveal={() => handleOpen(i)}
              />
            ))}
          </div>
        </div>

        {allOpened && (
          <button
            type="button"
            onClick={() => session.setPhase(2)}
            className="ludus-btn ludus-btn-xl anim-bounce-in text-white"
            style={{ background: areaColor, borderColor: areaColorDark }}
          >
            Jogar os turnos da semana
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
        <div className="grid gap-3 sm:grid-cols-3">
          <LifeBar
            icon={<Wallet className="size-4" aria-hidden />}
            label="Dinheiro"
            value={stats.money}
            color="#ff9600"
          />
          <LifeBar
            icon={<Clock className="size-4" aria-hidden />}
            label="Tempo/Estudo"
            value={stats.time}
            color="#14b8a6"
          />
          <LifeBar
            icon={<HeartPulse className="size-4" aria-hidden />}
            label="Saúde/Sono"
            value={stats.health}
            color="#ff4b4b"
          />
        </div>

        <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4">
          <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
            Turno {turn} de 3
          </p>
          <p className="mt-1 font-display text-lg font-bold text-ink">
            {turn === 1 &&
              "Segunda-feira, 6h: o app notifica — janela de corridas aberta."}
            {turn === 2 &&
              "Quarta à noite: a prova de recuperação é sexta de manhã."}
            {turn === 3 &&
              "Sexta: última corrida antes do fim de semana — e a conta da casa vence hoje."}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {TURNS.map((choice) => (
            <OptionTile
              key={choice.id}
              icon={choice.icon}
              title={choice.title}
              subtitle={choice.subtitle}
              color={areaColor}
              colorDark={areaColorDark}
              onPick={() => {
                applyChoice(choice);
                return true;
              }}
            />
          ))}
        </div>

        {history.length > 0 && (
          <p className="text-center text-xs font-semibold text-ink-faint">
            Histórico da semana: {history.length} escolha
            {history.length === 1 ? "" : "s"} registrada
            {history.length === 1 ? "" : "s"}.
          </p>
        )}
      </div>
    );
  }

  /* ----------------------------------------------------- Fase 3 · Decidir */
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <LifeBar
          icon={<Wallet className="size-4" aria-hidden />}
          label="Dinheiro"
          value={stats.money}
          color="#ff9600"
        />
        <LifeBar
          icon={<Clock className="size-4" aria-hidden />}
          label="Tempo/Estudo"
          value={stats.time}
          color="#14b8a6"
        />
        <LifeBar
          icon={<HeartPulse className="size-4" aria-hidden />}
          label="Saúde/Sono"
          value={stats.health}
          color="#ff4b4b"
        />
      </div>

      <p className="font-display text-lg font-bold leading-snug text-ink sm:text-xl">
        {REFLECTION.prompt}
      </p>

      <div className="flex flex-col gap-3">
        {REFLECTION.options.map((opt) => (
          <OptionTile
            key={opt.id}
            icon={opt.icon}
            title={opt.title}
            subtitle={opt.subtitle}
            color={areaColor}
            colorDark={areaColorDark}
            onPick={() => {
              if (opt.correct) {
                session.finish({
                  title: REFLECTION.verdict.title,
                  text: REFLECTION.verdict.text,
                  detail: REFLECTION.verdict.detail,
                  caseId: history.join("-") || "mistura",
                });
                return true;
              }
              session.showError(opt.feedback);
              return false;
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Componentes */

function LifeBar({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const status =
    value >= 60 ? "tranquilo" : value >= 30 ? "apertado" : "crítico";
  return (
    <div className="rounded-2xl border-2 border-border bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 font-display text-[0.72rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
          {icon}
          {label}
        </p>
        <p className="font-display text-lg font-bold" style={{ color }}>
          {value}
        </p>
      </div>
      <div className="ludus-track mt-2 h-[18px]">
        <i
          style={{
            width: `${clamp(value, 2, 100)}%`,
            background: color,
            transition: "width 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>
      <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-wide text-ink-faint">
        {status}
      </p>
    </div>
  );
}
