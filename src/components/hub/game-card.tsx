"use client";

/**
 * GameCard: cartão de jogo do hub.
 * Mostra área (ícone + cor), nível, título, gancho, tags, selos e status.
 * O check de concluído sobrepõe o ícone mantendo os topos alinhados.
 */

import { Check, Play, Medal, ScanSearch, KeyRound } from "lucide-react";
import Link from "next/link";
import { AREAS, LEVEL_LABEL, type GameMeta } from "@/lib/catalog";
import { AREA_BG, AREA_CHIP } from "@/lib/area-styles";
import { isGameCompleted, type GameProgress } from "@/lib/progress";
import { GameIcon } from "@/components/game-shell/game-icon";
import { hrefFor } from "@/lib/router";
import { cn } from "@/lib/utils";

export function GameCard({ game, progress }: { game: GameMeta; progress?: GameProgress }) {
  const area = AREAS[game.area];
  const done = isGameCompleted(progress);
  const badges = progress?.badges.length ?? 0;

  return (
    <Link
      href={hrefFor({ view: "game", gameId: game.id })}
      className="ludus-card group flex flex-col p-5"
      aria-label={`Jogar ${game.title}. ${area.shortName}, ${LEVEL_LABEL[game.level]}.${
        done ? " Jogo já concluído." : ""
      }`}
    >
      {/* Topo: ícone (com check de concluído) + nível */}
      <div className="flex items-start justify-between gap-3">
        <span className="relative" aria-hidden>
          <span
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-2xl text-white transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105 sm:size-16",
              AREA_BG[game.area],
            )}
          >
            <GameIcon name={game.icon} className="size-7 sm:size-8" strokeWidth={2.2} />
          </span>
          {done && (
            <span className="anim-pop absolute -right-1.5 -bottom-1.5 flex size-7 items-center justify-center rounded-full border-[3px] border-white bg-success text-white">
              <Check className="size-3.5" strokeWidth={4} />
            </span>
          )}
        </span>

        <span className={cn("ludus-chip mt-1", AREA_CHIP[game.area])}>Nível {game.level}</span>
      </div>

      {/* Corpo */}
      <h3 className="mt-4 font-display text-xl font-bold leading-tight text-ink">{game.title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">{game.tagline}</p>

      {/* Tags + BNCC */}
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

      {/* Rodapé: selos + CTA */}
      <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-border pt-3">
        <div className="flex items-center gap-1" aria-label={`${badges} de 3 selos conquistados`}>
          {[ScanSearch, KeyRound, Medal].map((Icon, i) => (
            <span
              key={i}
              className={[
                "flex size-7 items-center justify-center rounded-full border-2",
                i < badges
                  ? "border-success bg-success-soft text-success-dark"
                  : "border-dashed border-border bg-surface text-ink-faint",
              ].join(" ")}
              aria-hidden
            >
              <Icon className="size-3.5" strokeWidth={2.6} />
            </span>
          ))}
        </div>

        <span
          className={cn(
            "inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 border-transparent px-3.5 font-display text-[0.8rem] font-bold text-white transition-transform group-hover:translate-x-0.5",
            AREA_BG[game.area],
          )}
        >
          <Play className="size-4" strokeWidth={2.6} aria-hidden />
          {done ? "Revisar" : "Jogar"}
        </span>
      </div>
    </Link>
  );
}
