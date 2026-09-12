"use client";

/**
 * GameCard — cartão de jogo do hub.
 * Área (cor + ícone), nível, título, gancho, tags, selos e status.
 * Status "concluído" vira check sobreposto ao ícone (padrão Duolingo),
 * mantendo o topo dos cartões alinhados na grade.
 */

import { Check, Play, Medal, ScanSearch, KeyRound } from "lucide-react";
import { AREAS, LEVEL_LABEL, type GameMeta } from "@/lib/catalog";
import { isGameCompleted, type GameProgress } from "@/lib/progress";
import { GameIcon } from "@/components/game-shell/game-icon";
import { hrefFor } from "@/lib/router";

export function GameCard({
  game,
  progress,
}: {
  game: GameMeta;
  progress?: GameProgress;
}) {
  const area = AREAS[game.area];
  const done = isGameCompleted(progress);
  const badges = progress?.badges.length ?? 0;

  return (
    <a
      href={hrefFor({ view: "game", gameId: game.id })}
      className="ludus-card group flex flex-col p-5"
      aria-label={`Jogar ${game.title}. ${area.shortName}, ${LEVEL_LABEL[game.level]}.${
        done ? " Jogo já concluído." : ""
      }`}
    >
      {/* topo: ícone (com check de concluído) + nível */}
      <div className="flex items-start justify-between gap-3">
        <span className="relative" aria-hidden>
          <span
            className="flex size-14 items-center justify-center rounded-2xl text-white transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105 sm:size-16"
            style={{ background: area.color }}
          >
            <GameIcon
              name={game.icon}
              className="size-7 sm:size-8"
              strokeWidth={2.2}
            />
          </span>
          {done && (
            <span className="absolute -bottom-1.5 -right-1.5 flex size-7 items-center justify-center rounded-full border-[3px] border-white bg-success text-white anim-pop">
              <Check className="size-3.5" strokeWidth={4} />
            </span>
          )}
        </span>

        <span
          className="ludus-chip mt-1"
          style={{ color: area.colorDark, background: area.colorSoft }}
        >
          Nível {game.level}
        </span>
      </div>

      {/* corpo */}
      <h3 className="mt-4 font-display text-xl font-bold leading-tight text-ink">
        {game.title}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">
        {game.tagline}
      </p>

      {/* tags + BNCC */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {game.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-cloud px-2.5 py-1 text-[0.68rem] font-bold text-ink-soft"
          >
            {tag}
          </span>
        ))}
        <span className="rounded-full bg-cloud px-2.5 py-1 font-mono text-[0.62rem] font-bold text-ink-faint">
          {game.bncc[0]}
        </span>
      </div>

      {/* rodapé: selos + CTA */}
      <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-border pt-3">
        <div
          className="flex items-center gap-1"
          aria-label={`${badges} de 3 selos conquistados`}
        >
          {[ScanSearch, KeyRound, Medal].map((Icon, i) => (
            <span
              key={i}
              className={[
                "flex size-7 items-center justify-center rounded-full border-2",
                i < badges
                  ? "border-success bg-success-soft text-success-dark"
                  : "border-dashed border-border bg-white text-ink-faint",
              ].join(" ")}
              aria-hidden
            >
              <Icon className="size-3.5" strokeWidth={2.6} />
            </span>
          ))}
        </div>

        <span
          className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 px-3.5 font-display text-[0.8rem] font-bold text-white transition-transform group-hover:translate-x-0.5"
          style={{ background: area.color, borderColor: area.colorDark }}
        >
          <Play className="size-4" strokeWidth={2.6} aria-hidden />
          {done ? "Revisar" : "Jogar"}
        </span>
      </div>
    </a>
  );
}
