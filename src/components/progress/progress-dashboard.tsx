"use client";

/**
 * ProgressDashboard — painel de progresso do estudante.
 *
 * - Visão geral: X/12 jogos, Y/36 selos, barra geral
 * - Trilha por área com mini-cartões e selos
 * - Próximas recomendações (primeiros jogos não concluídos de cada área)
 * - Zerar progresso (com confirmação — nunca automático)
 */

import { useState } from "react";
import { GAMES, AREAS, AREA_ORDER, LEVEL_LABEL } from "@/lib/catalog";
import {
  useProgress,
  isGameCompleted,
  totalBadges,
  TOTAL_BADGES,
  countCompleted,
} from "@/lib/progress";
import { GameIcon } from "@/components/game-shell/game-icon";
import {
  Medal,
  ScanSearch,
  KeyRound,
  Trophy,
  Trash2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { hrefFor } from "@/lib/router";
import { formatDate } from "@/lib/format";

export function ProgressDashboard() {
  const progress = useProgress((s) => s.progress);
  const resetAll = useProgress((s) => s.resetAll);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const completed = countCompleted(progress);
  const badges = totalBadges(progress);
  const pct = Math.round((completed / GAMES.length) * 100);

  const recommendations = AREA_ORDER.map((areaId) => ({
    area: AREAS[areaId],
    game: GAMES.find(
      (g) => g.area === areaId && !isGameCompleted(progress[g.id]),
    ),
  })).filter((r) => r.game);

  const handleReset = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    resetAll();
    setConfirmingReset(false);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Seu progresso
          </h1>
          <p className="mt-1 text-sm font-semibold text-ink-soft sm:text-base">
            Progresso só soma: selos nunca expiram e casos podem ser revisitados
            sempre.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className={`ludus-btn ludus-btn-sm ${confirmingReset ? "ludus-btn-danger" : "ludus-btn-paper"}`}
          aria-live="polite"
        >
          <Trash2 className="size-4" aria-hidden />
          {confirmingReset ? "Toque de novo para confirmar" : "Zerar progresso"}
        </button>
      </header>

      {/* Visão geral */}
      <section
        className="mt-6 grid gap-4 sm:grid-cols-3"
        aria-label="Resumo geral"
      >
        <BigStat
          icon={<Trophy className="size-6" strokeWidth={2.2} aria-hidden />}
          label="Jogos concluídos"
          value={`${completed}/${GAMES.length}`}
          pct={pct}
          color="#58cc02"
        />
        <BigStat
          icon={<Medal className="size-6" strokeWidth={2.2} aria-hidden />}
          label="Selos na coleção"
          value={`${badges}/${TOTAL_BADGES}`}
          pct={Math.round((badges / TOTAL_BADGES) * 100)}
          color="#ffc800"
        />
        <BigStat
          icon={<Sparkles className="size-6" strokeWidth={2.2} aria-hidden />}
          label="Áreas exploradas"
          value={`${
            AREA_ORDER.filter((a) =>
              GAMES.filter((g) => g.area === a).every((g) =>
                isGameCompleted(progress[g.id]),
              ),
            ).length
          }/${AREA_ORDER.length}`}
          pct={
            (AREA_ORDER.filter((a) =>
              GAMES.filter((g) => g.area === a).every((g) =>
                isGameCompleted(progress[g.id]),
              ),
            ).length /
              AREA_ORDER.length) *
            100
          }
          color="#a560e8"
        />
      </section>

      {/* Recomendações */}
      {recommendations.length > 0 && (
        <section className="mt-8" aria-labelledby="reco-title">
          <h2
            id="reco-title"
            className="font-display text-xl font-bold text-ink sm:text-2xl"
          >
            Próximas investigações
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map(({ area, game }) => (
              <a
                key={game!.id}
                href={hrefFor({ view: "game", gameId: game!.id })}
                className="ludus-card flex items-center gap-3 p-4"
              >
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-white"
                  style={{ background: area.color }}
                  aria-hidden
                >
                  <GameIcon
                    name={game!.icon}
                    className="size-6"
                    strokeWidth={2.2}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm font-bold text-ink">
                    {game!.title}
                  </span>
                  <span className="block text-xs font-semibold text-ink-faint">
                    {area.shortName} · Nível {game!.level}
                  </span>
                </span>
                <ArrowRight
                  className="size-5 shrink-0 text-ink-faint"
                  aria-hidden
                />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Trilha por área */}
      <section
        className="mt-8 flex flex-col gap-6"
        aria-label="Trilha por área"
      >
        {AREA_ORDER.map((areaId) => {
          const area = AREAS[areaId];
          const games = GAMES.filter((g) => g.area === areaId);
          const done = games.filter((g) =>
            isGameCompleted(progress[g.id]),
          ).length;
          const areaPct = Math.round((done / games.length) * 100);
          return (
            <div
              key={areaId}
              className="rounded-3xl border-2 border-border bg-white p-5 shadow-[0_5px_0_#e9e2d2]"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="flex size-12 items-center justify-center rounded-2xl text-white"
                  style={{ background: area.color }}
                  aria-hidden
                >
                  <GameIcon
                    name={area.icon}
                    className="size-6"
                    strokeWidth={2.2}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-bold text-ink">
                    {area.name}
                  </h3>
                  <div className="ludus-track mt-2 max-w-md">
                    <i
                      style={{
                        width: `${Math.max(areaPct, 2)}%`,
                        background: area.color,
                      }}
                    />
                  </div>
                </div>
                <span
                  className="ludus-chip"
                  style={{ color: area.colorDark, background: area.colorSoft }}
                >
                  {done}/{games.length}
                </span>
              </div>

              <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                {games.map((game) => {
                  const p = progress[game.id];
                  const gameDone = isGameCompleted(p);
                  const count = p?.completions ?? 0;
                  return (
                    <li key={game.id}>
                      <a
                        href={hrefFor({ view: "game", gameId: game.id })}
                        className="flex items-center gap-3 rounded-2xl border-2 border-border bg-cloud/40 p-3 transition-colors hover:border-ink-faint"
                      >
                        <span
                          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
                          style={{
                            background: gameDone ? "#58cc02" : "#ece7db",
                            color: gameDone ? "#fff" : "#8783a0",
                          }}
                          aria-hidden
                        >
                          {gameDone ? (
                            <Trophy className="size-5" strokeWidth={2.4} />
                          ) : (
                            <GameIcon
                              name={game.icon}
                              className="size-5"
                              strokeWidth={2.2}
                            />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-sm font-bold text-ink">
                            {game.title}
                          </span>
                          <span className="block text-xs font-semibold text-ink-faint">
                            {gameDone
                              ? `${count} ${count === 1 ? "partida" : "partidas"}${
                                  p?.lastCompletedAt
                                    ? ` · ${formatDate(p.lastCompletedAt)}`
                                    : ""
                                }`
                              : "A explorar"}
                          </span>
                        </span>
                        <span className="flex items-center gap-0.5" aria-hidden>
                          {([ScanSearch, KeyRound, Medal] as const).map(
                            (Icon, i) => (
                              <Icon
                                key={i}
                                className={
                                  i < (p?.badges.length ?? 0)
                                    ? "size-4 text-success-dark"
                                    : "size-4 text-ink-faint/40"
                                }
                                strokeWidth={2.4}
                              />
                            ),
                          )}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function BigStat({
  icon,
  label,
  value,
  pct,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="rounded-3xl border-2 border-border bg-white p-5 shadow-[0_5px_0_#e9e2d2]">
      <div className="flex items-center gap-3">
        <span
          className="flex size-11 items-center justify-center rounded-2xl text-white"
          style={{ background: color }}
          aria-hidden
        >
          {icon}
        </span>
        <div>
          <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
            {label}
          </p>
          <p className="font-display text-2xl font-extrabold text-ink">
            {value}
          </p>
        </div>
      </div>
      <div className="ludus-track mt-3">
        <i style={{ width: `${Math.max(pct, 2)}%`, background: color }} />
      </div>
    </div>
  );
}
