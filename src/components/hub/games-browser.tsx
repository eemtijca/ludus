"use client";

/**
 * GamesBrowser — grade de jogos com busca e filtros.
 * Sem filtro ativo: agrupado por área (4 seções). Com filtro: grade única.
 * Busca cobre título, tagline, tags e códigos BNCC.
 */

import { useMemo, useState } from "react";
import { Search, X, Filter } from "lucide-react";
import {
  AREAS,
  AREA_ORDER,
  GAMES,
  LEVEL_LABEL,
  type AreaId,
  type Level,
} from "@/lib/catalog";
import { isGameCompleted, useProgress, type ProgressMap } from "@/lib/progress";
import { GameCard } from "./game-card";
import { GameIcon } from "@/components/game-shell/game-icon";

type StatusFilter = "todos" | "concluidos" | "novos";

interface Filters {
  query: string;
  area: AreaId | "todas";
  level: Level | 0;
  status: StatusFilter;
}

const AREA_FILTERS: { id: AreaId | "todas"; label: string }[] = [
  { id: "todas", label: "Todas as áreas" },
  { id: "linguagens", label: "Linguagens" },
  { id: "matematica", label: "Matemática" },
  { id: "natureza", label: "Natureza" },
  { id: "humanas", label: "Humanas" },
];

const LEVEL_FILTERS: { id: Level | 0; label: string }[] = [
  { id: 0, label: "Todos os níveis" },
  { id: 1, label: "Nível 1" },
  { id: 2, label: "Nível 2" },
  { id: 3, label: "Nível 3" },
];

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "novos", label: "A explorar" },
  { id: "concluidos", label: "Concluídos" },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesFilters(
  gameId: string,
  title: string,
  tagline: string,
  tags: string[],
  bncc: string[],
  filters: Filters,
  progress: ProgressMap,
): boolean {
  if (filters.area !== "todas") {
    const game = GAMES.find((g) => g.id === gameId);
    if (game?.area !== filters.area) return false;
  }
  const level = GAMES.find((g) => g.id === gameId)?.level ?? 0;
  if (filters.level !== 0 && level !== filters.level) return false;

  const done = isGameCompleted(progress[gameId]);
  if (filters.status === "concluidos" && !done) return false;
  if (filters.status === "novos" && done) return false;

  if (filters.query.trim()) {
    const q = normalize(filters.query.trim());
    const haystack = normalize(
      [
        title,
        tagline,
        ...tags,
        ...bncc,
        ...(GAMES.find((g) => g.id === gameId)?.tags ?? []),
      ].join(" "),
    );
    if (!haystack.includes(q)) return false;
  }
  return true;
}

function FilterChip({
  active,
  onClick,
  children,
  color,
  bg,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 px-4 py-1.5 font-display text-[0.78rem] font-bold transition-colors",
        active
          ? "text-white"
          : "border-border bg-white text-ink-soft hover:border-ink-faint hover:text-ink",
      ].join(" ")}
      style={active ? { background: color, borderColor: bg } : undefined}
    >
      {children}
    </button>
  );
}

export function GamesBrowser() {
  const progress = useProgress((s) => s.progress);
  const [filters, setFilters] = useState<Filters>({
    query: "",
    area: "todas",
    level: 0,
    status: "todos",
  });

  const hasActiveFilter =
    filters.query.trim() !== "" ||
    filters.area !== "todas" ||
    filters.level !== 0 ||
    filters.status !== "todos";

  const filtered = useMemo(
    () =>
      GAMES.filter((g) =>
        matchesFilters(
          g.id,
          g.title,
          g.tagline,
          g.tags,
          g.bncc,
          filters,
          progress,
        ),
      ),
    [filters, progress],
  );

  const clearFilters = () =>
    setFilters({ query: "", area: "todas", level: 0, status: "todos" });

  return (
    <section aria-labelledby="browser-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="browser-title"
          className="font-display text-2xl font-bold text-ink sm:text-3xl"
        >
          Escolha sua investigação
        </h2>
        <p className="text-sm font-semibold text-ink-soft">
          {filtered.length} {filtered.length === 1 ? "jogo" : "jogos"} na mesa
        </p>
      </div>

      {/* -------------------------------------------------- Busca + filtros */}
      <div className="mt-4 rounded-3xl border-2 border-border bg-cloud/70 p-4 sm:p-6">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-faint"
            aria-hidden
          />
          <input
            type="search"
            value={filters.query}
            onChange={(e) =>
              setFilters((f) => ({ ...f, query: e.target.value }))
            }
            placeholder="Buscar por título, tema ou código BNCC…"
            aria-label="Buscar jogos"
            className="min-h-[52px] w-full rounded-2xl border-2 border-border bg-white pl-12 pr-12 font-semibold text-ink placeholder:text-ink-faint focus:border-linguagens focus:outline-none focus:ring-4 focus:ring-linguagens/20"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, query: "" }))}
              aria-label="Limpar busca"
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-ink-soft hover:bg-cloud"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 shrink-0 text-ink-faint" aria-hidden />
            <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
              Área
            </span>
            <div className="flex flex-wrap gap-2">
              {AREA_FILTERS.map((f) => (
                <FilterChip
                  key={f.id}
                  active={filters.area === f.id}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, area: f.id }))
                  }
                  color={
                    f.id === "todas" ? "#3c3a4e" : AREAS[f.id as AreaId].color
                  }
                  bg={
                    f.id === "todas"
                      ? "#26242f"
                      : AREAS[f.id as AreaId].colorDark
                  }
                >
                  {f.id !== "todas" && (
                    <GameIcon
                      name={AREAS[f.id as AreaId].icon}
                      className="size-4"
                    />
                  )}
                  {f.label}
                </FilterChip>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
              Nível
            </span>
            {LEVEL_FILTERS.map((f) => (
              <FilterChip
                key={f.id}
                active={filters.level === f.id}
                onClick={() => setFilters((prev) => ({ ...prev, level: f.id }))}
                color="#14b8a6"
                bg="#0d9488"
              >
                {f.label}
              </FilterChip>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
              Status
            </span>
            {STATUS_FILTERS.map((f) => (
              <FilterChip
                key={f.id}
                active={filters.status === f.id}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, status: f.id }))
                }
                color="#ff9600"
                bg="#db7e00"
              >
                {f.label}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ Resultados */}
      {filtered.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-border bg-white p-10 text-center">
          <span
            className="flex size-16 items-center justify-center rounded-full bg-hint-soft text-hint-dark anim-wiggle"
            aria-hidden
          >
            <Search className="size-8" strokeWidth={2.2} />
          </span>
          <div>
            <p className="font-display text-lg font-bold text-ink">
              Nenhum jogo encontrado
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Tente outra palavra ou solte os filtros para ver a coleção
              inteira.
            </p>
          </div>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={clearFilters}
              className="ludus-btn ludus-btn-paper"
            >
              <X className="size-4" aria-hidden />
              Limpar filtros
            </button>
          )}
        </div>
      ) : hasActiveFilter ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} progress={progress[game.id]} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-8">
          {AREA_ORDER.map((areaId) => {
            const area = AREAS[areaId];
            const games = filtered.filter((g) => g.area === areaId);
            if (games.length === 0) return null;
            const done = games.filter((g) =>
              isGameCompleted(progress[g.id]),
            ).length;
            return (
              <section key={areaId} aria-labelledby={`area-${areaId}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="flex size-11 items-center justify-center rounded-2xl text-white"
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
                    <h3
                      id={`area-${areaId}`}
                      className="font-display text-xl font-bold text-ink"
                    >
                      {area.name}
                    </h3>
                    <p className="text-xs font-semibold text-ink-soft">
                      {area.description}
                    </p>
                  </div>
                  <span
                    className="ludus-chip"
                    style={{
                      color: area.colorDark,
                      background: area.colorSoft,
                    }}
                  >
                    {done}/{games.length} prontos
                  </span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {games.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      progress={progress[game.id]}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Legenda de níveis */}
      {!hasActiveFilter && (
        <p className="mt-6 text-center text-xs font-semibold text-ink-faint">
          Níveis: {LEVEL_LABEL[1]} · {LEVEL_LABEL[2]} · {LEVEL_LABEL[3]} — cada
          jogo tem três casos novos para investigar.
        </p>
      )}
    </section>
  );
}
