"use client";

/**
 * GameShell: moldura comum de uma partida.
 *
 * Composição:
 *  1. Cabeçalho: voltar, identidade do jogo (ícone, título, área, nível)
 *  2. Barra de missão (texto da missão atual)
 *  3. HUD: trilha de fases + selos da partida
 *  4. Palco (children), trocado pelo veredito quando a partida termina
 *  5. Banner de feedback imediato (acerto, erro ou informação)
 *  6. Linha de acessibilidade: contraste, texto amplo, som, movimento, recomeçar
 *
 * O botão de voz fica na caixa de instrução: lê missão, instrução e
 * narração, alternando entre "Ouvir" e "Parar".
 */

import { ArrowLeft, Contrast, Type, Volume2, Wind, RotateCcw, Compass } from "lucide-react";
import { AREAS, LEVEL_LABEL, type GameMeta } from "@/lib/catalog";
import { AREA_BG, AREA_BG_DARK, AREA_BG_SOFT, AREA_BTN, AREA_CHIP } from "@/lib/area-styles";
import type { GameSession } from "@/games/_shared/use-game-session";
import { PhaseStepper } from "./phase-stepper";
import { BadgeTray } from "./badge-tray";
import { FeedbackBanner } from "./feedback-banner";
import { VerdictCard } from "./verdict-card";
import { GameIcon, areaIconName } from "./game-icon";
import { SpeakerButton } from "./speaker-button";
import { useA11y } from "@/components/a11y/a11y-provider";
import { stopSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";

export interface GameShellProps {
  game: GameMeta;
  session: GameSession;
  /** Frase curta da missão atual (muda por caso e fase). */
  mission: string;
  /** Instrução visível da fase atual, com botão Ouvir. */
  instruction: string;
  /** Transcrição extra lida junto com a instrução. */
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

  const handleExit = () => {
    stopSpeech();
    onExit();
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-4 pb-10 sm:px-6 sm:pt-6">
      {/* Cabeçalho */}
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
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl text-white sm:size-14",
              AREA_BG[game.area],
            )}
            aria-hidden
          >
            <GameIcon name={game.icon} className="size-6 sm:size-7" strokeWidth={2.2} />
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

        <span className={cn("ludus-chip hidden sm:inline-flex", AREA_CHIP[game.area])}>
          <GameIcon name={areaIconName(area.id)} className="size-3.5" />
          {area.shortName}
        </span>
      </header>

      {/* Missão */}
      <section
        className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-border bg-surface p-4"
        aria-label="Missão da partida"
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl text-white",
            AREA_BG_DARK[game.area],
          )}
          aria-hidden
        >
          <Compass className="size-5" strokeWidth={2.4} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
            Missão
          </p>
          <p className="truncate font-display text-base font-bold text-ink sm:text-lg">{mission}</p>
        </div>
      </section>

      {/* HUD */}
      <section className="mt-3 flex flex-col gap-3" aria-label="Progresso da partida">
        <PhaseStepper phase={session.phase} area={game.area} />
        <div className="flex items-center justify-between gap-3">
          <div className="ludus-track flex-1" aria-hidden>
            <i style={{ width: `${(session.phase / 3) * 100}%` }} />
          </div>
          <BadgeTray badges={session.badges} />
        </div>
        <p className="sr-only" role="status">
          Fase {session.phase} de 3: {["Explorar", "Testar", "Decidir"][session.phase - 1]}. Selos
          conquistados: {session.badges.length} de 3.
        </p>
      </section>

      {/* Palco */}
      <main className="mt-4" aria-live="polite">
        {session.verdict ? (
          <VerdictCard
            verdict={session.verdict}
            badges={session.badges}
            area={game.area}
            gameTitle={game.title}
            onReplay={session.restart}
            onNextVariant={nextVariant}
            onExit={handleExit}
          />
        ) : (
          <div className="ludus-panel p-4 sm:p-6">
            {/* Instrução da fase + único botão de voz da tela */}
            <div
              id="game-instruction"
              className={cn(
                "instruction-box mb-4 flex flex-col gap-3 rounded-2xl border-2 border-transparent p-4 sm:flex-row sm:items-center",
                AREA_BG_SOFT[game.area],
              )}
            >
              <p className="flex-1 font-display text-base font-bold leading-snug text-ink sm:text-lg">
                {instruction}
              </p>
              <SpeakerButton
                className={cn(
                  "ludus-btn ludus-btn-sm shrink-0 border-transparent text-white",
                  AREA_BTN[game.area],
                )}
                text={[mission, instruction, narration].filter(Boolean).join(". ")}
                label="Ouvir"
                highlightId="game-instruction"
              />
            </div>

            {children}
          </div>
        )}
      </main>

      {/* Feedback */}
      <div className="mt-3">
        <FeedbackBanner feedback={session.feedback} />
      </div>

      {/* Acessibilidade */}
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
          ? "border-success bg-success-soft text-success-dark"
          : "border-border bg-surface text-ink-soft hover:border-ink-faint",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}
