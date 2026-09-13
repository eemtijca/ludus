"use client";

/**
 * Dilema do Gene: palco do jogo.
 *
 * Fase 1 (Explorar): montar o cenário com ambiente (sol ou neve) e
 *   pressão (predador visual ou comida escassa).
 * Fase 2 (Testar): avançar gerações com a população visível de coelhos
 *   e barra de frequência dos pelos.
 * Fase 3 (Decidir): explicar o mecanismo observado. Com predador, a
 *   seleção muda as frequências; com comida escassa, a pressão é neutra
 *   à cor e o equilíbrio se mantém.
 */

import { useState } from "react";
import { ArrowRight, FastForward, Dna } from "lucide-react";
import { GameShell } from "@/components/game-shell/game-shell";
import { OptionTile } from "@/components/game-shell/option-tile";
import { useGameSession } from "@/games/_shared/use-game-session";
import { GAME_BY_ID, AREAS } from "@/lib/catalog";
import {
  ENVIRONMENTS,
  PRESSURES,
  survivalAdvantage,
  PUNNETT,
  VERDICT,
  VERDICT_NEUTRAL,
  type GeneOption,
} from "./content";
import { clamp, formatPercent } from "@/lib/format";

const GAME_ID = "gene-dilema";

const MAX_POP = 12;

export function GeneDilemaGame({ onExit }: { onExit: () => void }) {
  const game = GAME_BY_ID[GAME_ID];
  const session = useGameSession(GAME_ID);

  const area = AREAS[game.area];

  return (
    <GameShell
      game={game}
      session={session}
      mission="O quintal dos coelhos: quem sobrevive ao ambiente?"
      instruction={
        session.phase === 1
          ? "Monte o cenário: escolha 1 ambiente e 1 pressão para o quintal."
          : session.phase === 2
            ? "Avance as gerações e observe a frequência das cores mudar."
            : "Explique o que aconteceu com o quintal."
      }
      narration="Herança dominante e seleção natural, passo a passo. Sem cronômetro, sem sorte: só estatística."
      nextVariant={null}
      onExit={onExit}
    >
      <Stage
        key={session.generation}
        session={session}
        areaColor={`var(--${game.area})`}
        areaColorDark={`var(--${game.area}-dark)`}
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
  const [environment, setEnvironment] = useState<string | null>(null);
  const [pressure, setPressure] = useState<string | null>(null);
  const [generation, setGeneration] = useState(0);
  const [population, setPopulation] = useState<("A" | "a")[]>(() =>
    Array.from({ length: MAX_POP }, () => (Math.random() < 0.5 ? "A" : "a")),
  );

  const envReady = environment !== null && pressure !== null;

  /* ---------------------------------------------------- Fase 1 (Explorar) */
  if (session.phase === 1) {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-soft">
            <Dna className="size-4" aria-hidden />
            Laboratório de biologia · quintal observacional
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Doze coelhos, metade marrom (Aa) e metade branca (aa), começam no quintal. O que
            acontece com as cores depende de DUAS escolhas: o palco e a pressão.
          </p>
        </div>

        <Group label="1 · Escolha o ambiente (o fundo do quintal)">
          {ENVIRONMENTS.map((env) => (
            <OptionTile
              key={env.id}
              icon={env.icon}
              title={env.title}
              subtitle={env.hook}
              color={areaColor}
              colorDark={areaColorDark}
              correct={environment === env.id}
              onPick={() => {
                setEnvironment(env.id);
                session.showSuccess(`Ambiente: ${env.title}. Agora escolha a pressão.`);
                return true;
              }}
            />
          ))}
        </Group>

        <Group label="2 · Escolha a pressão (quem desafia os coelhos)">
          {PRESSURES.map((p) => (
            <OptionTile
              key={p.id}
              icon={p.icon}
              title={p.title}
              subtitle={p.hook}
              color={areaColor}
              colorDark={areaColorDark}
              correct={pressure === p.id}
              onPick={() => {
                setPressure(p.id);
                session.showSuccess(`Pressão: ${p.title}. O cenário está pronto.`);
                return true;
              }}
            />
          ))}
        </Group>

        {envReady && (
          <button
            type="button"
            onClick={() => session.setPhase(2)}
            className="ludus-btn ludus-btn-xl anim-bounce-in text-white"
            style={{ background: areaColor, borderColor: areaColorDark }}
          >
            Soltar os coelhos no quintal
            <ArrowRight className="size-5" aria-hidden />
          </button>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------ Fase 2 (Testar) */
  if (session.phase === 2) {
    const adv = survivalAdvantage(environment ?? "sol", pressure ?? "lobo");
    const browns = population.filter((g) => g === "A").length;
    const whites = population.length - browns;
    const freq = browns / Math.max(population.length, 1);

    const advance = () => {
      const nextGen: ("A" | "a")[] = [];
      for (let i = 0; i < MAX_POP; i++) {
        // Nascimento: 50% Aa (marrom), 50% aa (branco): cruzamento Aa × aa
        const born: "A" | "a" = Math.random() < 0.5 ? "A" : "a";
        // Sobrevivência: vantagem do fenótipo no cenário escolhido
        const chance = born === "A" ? adv.brown : adv.white;
        if (Math.random() < chance) nextGen.push(born);
      }
      const stabilized =
        nextGen.length < 4
          ? [
              ...nextGen,
              ...Array.from({ length: 4 - nextGen.length }, (): "A" | "a" =>
                Math.random() < 0.5 ? "A" : "a",
              ),
            ]
          : nextGen;
      setPopulation(stabilized);
      setGeneration((g) => g + 1);
      session.showInfo(
        `Geração ${generation + 1}: ${stabilized.filter((g) => g === "A").length} marrons e ${stabilized.length - stabilized.filter((g) => g === "A").length} brancos no quintal.`,
      );
    };

    const done = generation >= 3;

    return (
      <div className="flex flex-col gap-5">
        {/* O quintal */}
        <div
          className={`rounded-2xl border-2 p-4 ${environment === "neve" ? "scene-neve" : "scene-sol"}`}
        >
          <p className="mb-3 font-display text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-soft">
            Geração {generation} · {pressure === "lobo" ? "predador à solta" : "comida escassa"}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {population.map((gene, i) => (
              <RabbitAvatar key={`${generation}-${i}`} gene={gene} delay={i * 40} />
            ))}
          </div>
        </div>

        {/* Frequência */}
        <div className="rounded-2xl border-2 border-border bg-surface p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-sm font-bold text-ink">
              Frequência do pelo marrom (Aa)
            </p>
            <p className="font-display text-sm font-bold text-ink-soft">
              {browns}A · {whites}a
            </p>
          </div>
          <div className="ludus-track mt-2 h-[22px]">
            <i
              style={{
                width: `${clamp(freq * 100, 2, 100)}%`,
                background: "#a5713c",
                transition: "width 600ms ease-out",
              }}
            />
          </div>
          <p className="mt-2 text-xs font-semibold text-ink-faint">
            Marrom: {formatPercent(freq)} da população · Branco: {formatPercent(1 - freq)} ·
            nascimento sempre 50/50 (Aa × aa)
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={advance}
            disabled={done}
            className="ludus-btn ludus-btn-natureza flex-1"
          >
            <FastForward className="size-5" aria-hidden />
            {done ? "3 gerações vividas" : `Avançar para a geração ${generation + 1}`}
          </button>
          {done && (
            <button
              type="button"
              onClick={() => session.setPhase(3)}
              className="ludus-btn ludus-btn-xl anim-bounce-in flex-1 text-white"
              style={{ background: areaColor, borderColor: areaColorDark }}
            >
              Explicar a seleção
              <ArrowRight className="size-5" aria-hidden />
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------- Fase 3 (Decidir) */
  const predador = pressure === "lobo";
  const verdict = predador ? VERDICT : VERDICT_NEUTRAL;
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-2 border-natureza bg-natureza-soft p-4 text-sm font-semibold leading-relaxed text-ink">
        {predador
          ? `Três gerações se passaram no seu quintal (${environment === "neve" ? "neve" : "sol e terra seca"}, com predador de vista). O que explica a mudança das cores?`
          : `Três gerações se passaram no seu quintal (${environment === "neve" ? "neve" : "sol e terra seca"}, com comida escassa). As cores seguiram por perto do 50/50. Por quê?`}
      </div>
      <div className="flex flex-col gap-3">
        <OptionTile
          icon="certo"
          title={
            predador
              ? "Seleção do ambiente sobre a variação existente"
              : "Pressão neutra à cor mantém o equilíbrio"
          }
          subtitle={
            predador
              ? "Quem já combinava escapou mais e deixou mais filhotes"
              : "A comida dura cobra dos dois igualmente: o 50/50 de nascimento manda"
          }
          color={areaColor}
          colorDark={areaColorDark}
          onPick={() => {
            session.finish({
              title: verdict.title,
              text: verdict.text,
              detail: {
                ...verdict.detail,
                text: `${verdict.detail.text}\n\nCruzamento: ${PUNNETT.cross}.`,
              },
              caseId: `${environment}-${pressure}`,
            });
            return true;
          }}
        />
        <OptionTile
          icon="alerta"
          title="Os coelhos se adaptaram por vontade"
          subtitle="Eles mudaram de cor para sobreviver"
          correct={false}
          color={areaColor}
          colorDark={areaColorDark}
          onPick={() => {
            session.showError(
              "Nenhum coelho mudou de cor: nascidos Aa ficam marrons, nascidos aa ficam brancos. A cor é sorteio de nascimento, não escolha. O que muda é quem sobrevive, e isso depende da pressão.",
            );
            return false;
          }}
        />
        <OptionTile
          icon="conversa"
          title="Foi tudo de uma vez, por uma mudança súbita"
          subtitle="Uma virada única decidiu as cores"
          correct={false}
          color={areaColor}
          colorDark={areaColorDark}
          onPick={() => {
            session.showError(
              predador
                ? "Não foi de uma vez: geração após geração, a pressão constante foi peneirando quem já existia. Veja a frequência mudar pouco a pouco."
                : "Não houve virada: sem pressão que distinga as cores, o 50/50 do nascimento se impõe geração após geração.",
            );
            return false;
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Componentes */

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-display text-base font-bold text-ink">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function RabbitAvatar({ gene, delay }: { gene: "A" | "a"; delay: number }) {
  const brown = gene === "A";
  const body = brown ? "#a5713c" : "#f2f2f2";
  const outline = brown ? "#7d5125" : "#c2c2c2";
  return (
    <span
      className="anim-bounce-in inline-flex"
      style={{ animationDelay: `${delay}ms` }}
      role="img"
      aria-label={brown ? "Coelho marrom" : "Coelho branco"}
    >
      <svg viewBox="0 0 48 48" width="52" height="52">
        {/* orelhas */}
        <ellipse
          cx="18"
          cy="14"
          rx="4.5"
          ry="11"
          fill={body}
          stroke={outline}
          strokeWidth="2"
          transform="rotate(-12 18 14)"
        />
        <ellipse
          cx="30"
          cy="14"
          rx="4.5"
          ry="11"
          fill={body}
          stroke={outline}
          strokeWidth="2"
          transform="rotate(12 30 14)"
        />
        <ellipse cx="18" cy="15" rx="2" ry="6.5" fill="#e8b4c8" transform="rotate(-12 18 15)" />
        <ellipse cx="30" cy="15" rx="2" ry="6.5" fill="#e8b4c8" transform="rotate(12 30 15)" />
        {/* cabeça */}
        <circle cx="24" cy="28" r="11" fill={body} stroke={outline} strokeWidth="2" />
        {/* olhos */}
        <circle cx="20" cy="26" r="1.8" fill="#3c3a4e" />
        <circle cx="28" cy="26" r="1.8" fill="#3c3a4e" />
        {/* nariz e dentes */}
        <path d="M22.5 31 h3 l-1.5 2 z" fill="#e8758a" />
        <rect
          x="22"
          y="33.2"
          width="4"
          height="3"
          rx="1"
          fill="#ffffff"
          stroke={outline}
          strokeWidth="1"
        />
        {/* bigodes */}
        <path
          d="M16 30 l-5 -2 M16 32 l-5 2 M32 30 l5 -2 M32 32 l5 2"
          stroke={outline}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
