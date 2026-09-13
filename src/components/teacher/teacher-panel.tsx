"use client";

/**
 * TeacherPanel: modo professor, guia pedagógico.
 *
 * - Como usar em sala (roteiro sugerido de 50 min)
 * - Fichas dos jogos: BNCC, objetivo, habilidades e duração
 * - Link compartilhável por jogo (deep link #/jogo/<id>)
 * - Painel de acompanhamento local (progresso do dispositivo)
 * - Notas sobre DUA/AEE e privacidade (nada sai do dispositivo)
 */

import { useState } from "react";
import { GAMES, AREAS, AREA_ORDER, LEVEL_LABEL, type GameMeta } from "@/lib/catalog";
import { useProgress, isGameCompleted } from "@/lib/progress";
import { GameIcon } from "@/components/game-shell/game-icon";
import {
  GraduationCap,
  Target,
  ListChecks,
  BookMarked,
  Link2,
  Check,
  ClipboardList,
  Timer,
  Volume2,
  Keyboard,
  ShieldCheck,
} from "lucide-react";

const LESSON_STEPS = [
  {
    icon: Timer,
    title: "Antes (5 min)",
    text: "Projete o hub e deixe o estudante escolher a área. Recursos DUA ficam na barra superior: alto contraste e texto amplo para quem precisa.",
  },
  {
    icon: ClipboardList,
    title: "Durante (35 min)",
    text: "Cada jogo pede de 8 a 12 minutos e tem 3 casos. O ideal é 1 caso por sessão para AEE: conclua, celebre o selo e pare: repetir vale mais que avançar.",
  },
  {
    icon: Volume2,
    title: "Voz e leitura",
    text: "Todo texto tem botão “Ouvir”. Estudantes com dislexia ou baixa leitura podem ouvir a instrução e as evidências com o realce amarelo acompanhando.",
  },
  {
    icon: Keyboard,
    title: "Teclado e ponteiro",
    text: "Toda a jornada funciona por teclado (Tab/Enter) e alvos ≥48px. O erro nunca pune: pode tentar quantas vezes quiser.",
  },
];

export function TeacherPanel() {
  const progress = useProgress((s) => s.progress);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyLink = async (game: GameMeta) => {
    const url = `${window.location.origin}${window.location.pathname}#/jogo/${game.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard bloqueado: link segue visível no title */
    }
    setCopiedId(game.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Cabeçalho */}
      <header className="rounded-3xl border-2 border-border bg-surface p-6 shadow-[0_5px_0_#e9e2d2] sm:p-8">
        <div className="flex items-center gap-4">
          <span
            className="flex size-14 items-center justify-center rounded-2xl text-white"
            style={{ background: "#3c3a4e" }}
            aria-hidden
          >
            <GraduationCap className="size-7" strokeWidth={2.2} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Modo Professor</h1>
            <p className="text-sm font-semibold text-ink-soft">
              Guia pedagógico dos jogos: BNCC, roteiro de uso e acompanhamento.
            </p>
          </div>
        </div>

        {/* Roteiro de uso */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {LESSON_STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 rounded-2xl bg-cloud/70 p-4">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface text-ink shadow-[0_3px_0_#e9e2d2]"
                aria-hidden
              >
                <Icon className="size-5" strokeWidth={2.2} />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-ink">{title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border-2 border-linguagens/30 bg-linguagens-soft p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-linguagens-dark" aria-hidden />
          <p className="text-sm leading-relaxed text-ink-soft">
            <strong className="text-ink">Privacidade por desenho:</strong> todo o progresso fica no
            próprio dispositivo (localStorage), sem conta, sem servidor e sem dado pessoal. Para
            acompanhar um estudante específico, use o mesmo dispositivo da sessão: ou peça que ele
            mostre a tela de Progresso.
          </p>
        </div>
      </header>

      {/* Fichas por área */}
      <div className="mt-8 flex flex-col gap-8">
        {AREA_ORDER.map((areaId) => {
          const area = AREAS[areaId];
          const games = GAMES.filter((g) => g.area === areaId);
          return (
            <section key={areaId} aria-labelledby={`tea-${areaId}`}>
              <div className="flex items-center gap-3">
                <span
                  className="flex size-11 items-center justify-center rounded-2xl text-white"
                  style={{ background: area.color }}
                  aria-hidden
                >
                  <GameIcon name={area.icon} className="size-6" strokeWidth={2.2} />
                </span>
                <h2 id={`tea-${areaId}`} className="font-display text-xl font-bold text-ink">
                  {area.name}
                </h2>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                {games.map((game) => {
                  const p = progress[game.id];
                  return (
                    <article
                      key={game.id}
                      className="flex flex-col gap-3 rounded-3xl border-2 border-border bg-surface p-5 shadow-[0_5px_0_#e9e2d2]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-lg font-bold text-ink">{game.title}</h3>
                        <span
                          className="ludus-chip"
                          style={{ color: area.colorDark, background: area.colorSoft }}
                        >
                          Nível {game.level}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-sm leading-relaxed text-ink-soft">
                        <Target className="mt-0.5 size-4 shrink-0" aria-hidden />
                        <p>{game.objective}</p>
                      </div>

                      <div className="flex items-start gap-2 text-sm leading-relaxed text-ink-soft">
                        <ListChecks className="mt-0.5 size-4 shrink-0" aria-hidden />
                        <ul className="flex flex-col gap-1">
                          {game.skills.map((skill) => (
                            <li key={skill}>{skill}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-border pt-3">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] font-bold text-ink-faint">
                          <BookMarked className="size-3.5" aria-hidden />
                          {game.bncc.join(" · ")}
                        </span>
                        <span className="text-xs font-bold text-ink-soft">
                          ~{game.minutes} min ·{" "}
                          {isGameCompleted(p) ? "concluído" : LEVEL_LABEL[game.level]}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyLink(game)}
                        className="ludus-btn ludus-btn-paper ludus-btn-sm w-full"
                        aria-label={`Copiar link direto do jogo ${game.title}`}
                      >
                        {copiedId === game.id ? (
                          <>
                            <Check
                              className="size-4 text-success-dark"
                              strokeWidth={3}
                              aria-hidden
                            />
                            Link copiado!
                          </>
                        ) : (
                          <>
                            <Link2 className="size-4" aria-hidden />
                            Copiar link do jogo
                          </>
                        )}
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
