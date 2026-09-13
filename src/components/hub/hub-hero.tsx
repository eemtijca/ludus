"use client";

/**
 * HubHero: abertura do hub com identidade, promessa e progresso geral.
 * O progresso é dinâmico (derivado do catálogo), então a coleção pode
 * crescer sem alterar o texto. Decoração em SVG inline, sem imagens.
 */

import { Dices, HeartHandshake, TimerOff, Volume2, Sparkles, Star, Zap } from "lucide-react";
import { GAMES } from "@/lib/catalog";
import { countCompleted, useProgress } from "@/lib/progress";

const PILLS = [
  { icon: TimerOff, label: "Sem cronômetro" },
  { icon: Volume2, label: "Cada tela tem voz" },
  { icon: HeartHandshake, label: "Pode repetir à vontade" },
];

export function HubHero() {
  const progress = useProgress((s) => s.progress);
  const completed = countCompleted(progress);
  const pct = Math.round((completed / GAMES.length) * 100);

  return (
    <section
      className="hub-hero relative overflow-hidden rounded-3xl border-2 p-6 pb-8 sm:p-10 sm:pb-10"
      aria-labelledby="hub-title"
    >
      {/* Decoração: peças de jogo flutuando. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Sparkles
          className="absolute right-[12%] top-[18%] size-8 text-white/25 anim-float"
          style={{ animationDelay: "0ms" }}
        />
        <Star
          className="absolute right-[30%] top-[64%] size-6 text-hint/70 anim-float"
          style={{ animationDelay: "600ms" }}
        />
        <Zap
          className="absolute bottom-[20%] left-[6%] size-7 text-matematica/80 anim-float"
          style={{ animationDelay: "1200ms" }}
        />
        <Dices
          className="absolute left-[38%] top-[10%] size-10 rotate-12 text-white/15 anim-float"
          style={{ animationDelay: "300ms" }}
        />
        <div className="absolute -right-16 -top-24 size-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-28 -left-10 size-56 rounded-full bg-black/10" />
      </div>

      <div className="relative flex flex-col gap-6 text-white sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="font-display text-[0.74rem] font-bold uppercase tracking-[0.18em] text-white/90">
            Sala de Recursos · DUA · AEE
          </p>
          <h1
            id="hub-title"
            className="mt-2 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl"
          >
            Jogos de investigação,
            <br />
            <span className="text-hint">no ritmo que for o seu.</span>
          </h1>
          <p className="mt-4 max-w-md text-base font-semibold leading-relaxed text-white/95 sm:text-lg">
            Casos curtos de sala de aula, resolvidos por toque, teclado ou voz, no tempo que você
            precisar.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {PILLS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/40 bg-white/15 px-3.5 py-2 font-display text-[0.74rem] font-bold backdrop-blur"
              >
                <Icon className="size-4" strokeWidth={2.4} aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Progresso geral */}
        <div className="w-full max-w-xs rounded-3xl border-2 border-white/40 bg-surface p-5 text-ink shadow-[0_6px_0_rgba(0,60,32,0.5)] sm:w-auto">
          <div className="flex items-center gap-3">
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-success text-white"
              aria-hidden
            >
              <Dices className="size-6" strokeWidth={2.4} />
            </span>
            <div>
              <p className="font-display text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
                Sua coleção
              </p>
              <p className="font-display text-2xl font-extrabold leading-tight text-ink">
                {completed}
                <span className="text-ink-soft"> / {GAMES.length}</span>
              </p>
            </div>
          </div>
          <div
            className="ludus-track mt-3"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progresso geral: ${pct}%`}
          >
            <i style={{ width: `${Math.max(pct, 2)}%` }} />
          </div>
          <p className="mt-2 text-xs font-bold text-ink-soft">
            {completed === 0
              ? "Escolha um jogo abaixo para começar."
              : completed === GAMES.length
                ? "Coleção completa! Pode revisar qualquer caso."
                : `${pct}% da coleção explorada.`}
          </p>
        </div>
      </div>
    </section>
  );
}
