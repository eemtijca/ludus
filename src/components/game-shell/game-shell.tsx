"use client";

/**
 * GameShell — moldura completa de uma partida.
 *
 * Composição:
 *  1. Cabeçalho fixo: voltar, identidade do jogo (ícone, título, área, nível)
 *  2. Barra de missão com leitura em voz alta (Ouvir / Parar)
 *  3. HUD: trilha de fases + selos da partida
 *  4. Palco (children) — trocado pelo Veredito quando a partida termina
 *  5. Banner de feedback imediato (acerto/erro/info)
 *  6. Linha de acessibilidade: contraste, texto amplo, som, movimento, recomeçar
 *
 * Toda a parte "de jogo" (fases, selos, feedback) vem da useGameSession,
 * então cada jogo implementa apenas o seu palco e a sua lógica de conteúdo.
 */

import {
  ArrowLeft,
  Contrast,
  Type,
  Volume2,
  Wind,
  RotateCcw,
  Compass,
} from "lucide-react";
import { AREAS, LEVEL_LABEL, type GameMeta } from "@/lib/catalog";
import type { GameSession } from "@/games/_shared/use-game-session";
import { PhaseStepper } from "./phase-stepper";
import { BadgeTray } from "./badge-tray";
import { FeedbackBanner } from "./feedback-banner";
import { VerdictCard } from "./verdict-card";
import { GameIcon, areaIconName } from "./game-icon";
import { SpeakerButton } from "./speaker-button";
import { useA11y } from "@/components/a11y/a11y-provider";
import { stopSpeech, speak } from "@/lib/speech";

export interface GameShellProps {
  game: GameMeta;
  session: GameSession;
  /** Frase curta da missão atual (atualiza por caso/fase). */
  mission: string;
  /** Instrução visível da fase atual — grande, clara, com botão Ouvir. */
  instruction: string;
  /** Transcrição extra lida junto com a instrução (contexto da missão). */
  narration?: string;
  /** Próximo caso/variante (opcional). */
  nextVariant?: { label: string; onPick: () => void } | null;
  onExit: () => void;
  children: React.ReactNode;
}

export function GameShell({
  game,
  session,
  mission,
  instruction,
  narration,
  nextVariant,
  onExit,
  children,
}: GameShellProps) {
  const area = AREAS[game.area];
  const a11y = useA11y();

  const readInstruction = () => {
    const el = document.getElementById("game-instruction");
    const parts = [mission, instruction, narration].filter(Boolean) as string[];
    speak(parts.join(". "), { highlight: el });
  };

  const handleExit = () => {
    stopSpeech();
    onExit();
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
      {/* ---------------------------------------------------------- Cabeçalho */}
      <header className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleExit}
          className="ludus-btn ludus-btn-paper ludus-btn-sm"
          aria-label="Voltar para a lista de jogos"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">Jogos</span>
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-white sm:size-14"
            style={{ background: area.color, borderColor: area.colorDark }}
            aria-hidden
          >
            <GameIcon
              name={game.icon}
              className="size-6 sm:size-7"
              strokeWidth={2.2}
            />
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-bold leading-tight text-ink sm:text-2xl">
              {game.title}
            </h1>
            <p className="truncate text-xs font-semibold text-ink-soft sm:text-sm">
              {area.shortName} · {LEVEL_LABEL[game.level]}
            </p>
          </div>
        </div>

        <span
          className="ludus-chip hidden sm:inline-flex"
          style={{ color: area.colorDark, background: area.colorSoft }}
        >
          <GameIcon name={areaIconName(area.id)} className="size-3.5" />
          {area.shortName}
        </span>
      </header>

      {/* ------------------------------------------------------- Missão + voz */}
      <section
        className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-border bg-white p-4"
        aria-label="Missão da partida"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: area.colorDark }}
            aria-hidden
          >
            <Compass className="size-5" strokeWidth={2.4} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
              Missão
            </p>
            <p className="truncate font-display text-base font-bold text-ink sm:text-lg">
              {mission}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SpeakerButton
            text={[mission, instruction, narration].filter(Boolean).join(". ")}
            label="Ouvir"
          />
          <button
            type="button"
            onClick={() => stopSpeech()}
            className="ludus-btn ludus-btn-paper ludus-btn-sm"
            aria-label="Parar leitura em voz alta"
          >
            <Volume2 className="size-4" aria-hidden />
            <span className="hidden sm:inline">Parar voz</span>
          </button>
        </div>
      </section>

      {/* ---------------------------------------------------------------- HUD */}
      <section
        className="mt-3 flex flex-col gap-3"
        aria-label="Progresso da partida"
      >
        <PhaseStepper
          phase={session.phase}
          color={area.color}
          colorDark={area.colorDark}
        />
        <div className="flex items-center justify-between gap-3">
          <div className="ludus-track flex-1" aria-hidden>
            <i
              style={{
                width: `${(session.phase / 3) * 100}%`,
                background: area.color,
              }}
            />
          </div>
          <BadgeTray badges={session.badges} />
        </div>
        <p className="sr-only" role="status">
          Fase {session.phase} de 3:{" "}
          {["Explorar", "Testar", "Decidir"][session.phase - 1]}. Selos
          conquistados: {session.badges.length} de 3.
        </p>
      </section>

      {/* ----------------------------------------------------------- Palco */}
      <main className="mt-4" aria-live="polite">
        {session.verdict ? (
          <VerdictCard
            verdict={session.verdict}
            badges={session.badges}
            color={area.color}
            colorDark={area.colorDark}
            colorSoft={area.colorSoft}
            gameTitle={game.title}
            onReplay={session.restart}
            onNextVariant={nextVariant}
            onExit={handleExit}
          />
        ) : (
          <div className="rounded-3xl border-2 border-border bg-white p-4 shadow-[0_5px_0_#e9e2d2] sm:p-6">
            {/* Instrução da fase */}
            <div
              id="game-instruction"
              className="mb-4 flex items-start gap-3 rounded-2xl p-4 sm:items-center"
              style={{ background: area.colorSoft }}
            >
              <p className="flex-1 font-display text-base font-bold leading-snug text-ink sm:text-lg">
                {instruction}
              </p>
              <button
                type="button"
                onClick={readInstruction}
                className="ludus-btn ludus-btn-sm shrink-0 text-white"
                style={{ background: area.color, borderColor: area.colorDark }}
                aria-label="Ouvir a instrução da fase em voz alta"
              >
                <Volume2 className="size-4" aria-hidden />
                <span className="hidden md:inline">Ouvir</span>
              </button>
            </div>

            {children}
          </div>
        )}
      </main>

      {/* -------------------------------------------------------- Feedback */}
      <div className="mt-3">
        <FeedbackBanner feedback={session.feedback} />
      </div>

      {/* ----------------------------------------------- Acessibilidade DUA */}
      <section
        className="mt-5 flex flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-cloud/60 p-3"
        aria-label="Recursos de acessibilidade"
      >
        <span className="w-full text-center font-display text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-faint sm:w-auto sm:px-2">
          Recursos DUA
        </span>
        <A11yToggle
          icon={<Contrast className="size-4" aria-hidden />}
          label="Alto contraste"
          active={a11y.highContrast}
          onClick={() => a11y.toggle("highContrast")}
        />
        <A11yToggle
          icon={<Type className="size-4" aria-hidden />}
          label="Texto amplo"
          active={a11y.largeText}
          onClick={() => a11y.toggle("largeText")}
        />
        <A11yToggle
          icon={<Volume2 className="size-4" aria-hidden />}
          label="Sons"
          active={a11y.soundEffects}
          onClick={() => a11y.toggle("soundEffects")}
        />
        <A11yToggle
          icon={<Wind className="size-4" aria-hidden />}
          label="Menos movimento"
          active={a11y.reducedMotion}
          onClick={() => a11y.toggle("reducedMotion")}
        />
        <button
          type="button"
          onClick={session.restart}
          className="ludus-btn ludus-btn-danger ludus-btn-sm"
          aria-label="Recomeçar a partida do começo"
        >
          <RotateCcw className="size-4" aria-hidden />
          Recomeçar
        </button>
      </section>

      <footer className="mt-6 text-center text-xs font-semibold text-ink-faint">
        Sala de Recursos · EEMTI José Cláudio de Araújo · Recurso DUA/AEE
      </footer>
    </div>
  );
}

function A11yToggle({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 px-3 py-1.5 font-display text-[0.78rem] font-bold transition-colors",
        active
          ? "border-linguagens bg-linguagens-soft text-linguagens-dark"
          : "border-border bg-white text-ink-soft hover:border-ink-faint",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}
