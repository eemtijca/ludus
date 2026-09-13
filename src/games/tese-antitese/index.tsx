"use client";

/**
 * Tese e Antítese: palco do jogo.
 *
 * Fase 1 (Explorar): montar o caso escolhendo 1 tese forte e 1 prova forte;
 *   peças fracas devolvem feedback pedagógico sem punição.
 * Fase 2 (Testar): a banca apresenta a objeção; responder com a prova
 *   em vez de ataque pessoal.
 * Fase 3 (Decidir): escolher a síntese que costura tese, prova e objeção.
 */

import { useState } from "react";
import { ArrowRight, Gavel, ShieldCheck } from "lucide-react";
import { GameShell } from "@/components/game-shell/game-shell";
import { OptionTile } from "@/components/game-shell/option-tile";
import { EvidenceCard, type EvidenceCardData } from "@/components/game-shell/evidence-card";
import { useGameSession } from "@/games/_shared/use-game-session";
import { GAME_BY_ID, AREAS } from "@/lib/catalog";
import { THEMES, type DebateTheme } from "./content";

const GAME_ID = "tese-antitese";

export function TeseAntiteseGame({ onExit }: { onExit: () => void }) {
  const game = GAME_BY_ID[GAME_ID];
  const [themeIndex, setThemeIndex] = useState(0);
  const session = useGameSession(GAME_ID);

  const nextVariant = {
    label: "Debater outro tema",
    onPick: () => setThemeIndex((i) => (i + 1) % THEMES.length),
  };

  const area = AREAS[game.area];

  return (
    <GameShell
      game={game}
      session={session}
      mission={THEMES[themeIndex].mission}
      instruction={
        session.phase === 1
          ? "Monte sua defesa: escolha 1 tese e 1 prova, porque as fortes seguram o debate."
          : session.phase === 2
            ? "A banca apresentou a objeção. Como você responde?"
            : "Feche o debate: escolha a síntese que costura tudo."
      }
      narration={THEMES[themeIndex].scenario}
      nextVariant={nextVariant}
      onExit={onExit}
    >
      <Stage
        key={`${themeIndex}-${session.generation}`}
        session={session}
        tema={THEMES[themeIndex]}
        areaColor={`var(--${game.area})`}
        areaColorDark={`var(--${game.area}-dark)`}
        onPhase2={() => session.setPhase(2)}
        onPhase3={() => session.setPhase(3)}
      />
    </GameShell>
  );
}

/* ------------------------------------------------------------------ Palco */

function Stage({
  session,
  tema,
  areaColor,
  areaColorDark,
  onPhase2,
  onPhase3,
}: {
  session: ReturnType<typeof useGameSession>;
  tema: DebateTheme;
  areaColor: string;
  areaColorDark: string;
  onPhase2: () => void;
  onPhase3: () => void;
}) {
  const [pickedThesis, setPickedThesis] = useState<string | null>(null);
  const [pickedProof, setPickedProof] = useState<string | null>(null);
  const [responded, setResponded] = useState(false);
  const [synthesis, setSynthesis] = useState<string | null>(null);

  /* ---------------------------------------------------- Fase 1 (Explorar) */
  if (session.phase === 1) {
    const complete =
      pickedThesis !== null &&
      pickedProof !== null &&
      tema.theses.find((t) => t.id === pickedThesis)?.strong &&
      tema.proofs.find((p) => p.id === pickedProof)?.strong;

    const thesisCards: EvidenceCardData[] = tema.theses.map((t) => ({
      icon: t.icon,
      category: `Tese · ${t.title}`,
      hook: t.hook,
      evidence: t.evidence,
    }));

    const proofCards: EvidenceCardData[] = tema.proofs.map((p) => ({
      icon: p.icon,
      category: `Prova · ${p.title}`,
      hook: p.hook,
      evidence: p.evidence,
    }));

    const handlePiece = (
      piece: { id: string; strong: boolean; weakReason?: string },
      kind: "tese" | "prova",
    ) => {
      if (piece.strong) {
        if (kind === "tese") setPickedThesis(piece.id);
        else setPickedProof(piece.id);
        session.showSuccess(
          kind === "tese" ? "Tese forte na mesa. Falta a prova." : "Prova forte anexada à tese.",
        );
      } else {
        session.showError(piece.weakReason ?? "Peça fraca: troque pela forte.");
      }
    };

    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border-2 border-border bg-cloud/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-soft">
            <Gavel className="size-4" aria-hidden />
            Clube de debate · tema da semana
          </div>
          <h2 className="mt-2 font-display text-lg font-bold leading-snug text-ink sm:text-xl">
            {tema.theme}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{tema.scenario}</p>
        </div>

        <div>
          <p className="mb-2 font-display text-sm font-bold text-ink-soft">Escolha sua tese</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {tema.theses.map((t, i) => (
              <EvidenceCard
                key={t.id}
                data={thesisCards[i]}
                color={pickedThesis === t.id && t.strong ? "var(--success)" : areaColor}
                onReveal={() => handlePiece(t, "tese")}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-display text-sm font-bold text-ink-soft">Anexe a prova</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {tema.proofs.map((p, i) => (
              <EvidenceCard
                key={p.id}
                data={proofCards[i]}
                color={pickedProof === p.id && p.strong ? "var(--success)" : areaColor}
                onReveal={() => handlePiece(p, "prova")}
              />
            ))}
          </div>
        </div>

        {complete && (
          <button
            type="button"
            onClick={onPhase2}
            className="ludus-btn ludus-btn-xl anim-bounce-in text-white"
            style={{ background: areaColor, borderColor: areaColorDark }}
          >
            Ouvir a objeção da banca
            <ArrowRight className="size-5" aria-hidden />
          </button>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------ Fase 2 (Testar) */
  if (session.phase === 2) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border-2 border-humanas/50 bg-humanas-soft p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-humanas-dark">
            {tema.objection.speaker}
          </p>
          <h2 className="mt-1 font-display text-lg font-bold leading-snug text-ink sm:text-xl">
            “{tema.objection.title}”
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{tema.objection.detail}</p>
        </div>

        <p className="font-display text-lg font-bold text-ink sm:text-xl">
          Como você responde à banca?
        </p>
        <div className="flex flex-col gap-3">
          {tema.responses.map((r) => (
            <OptionTile
              key={r.id}
              icon={r.icon}
              title={r.title}
              subtitle={r.subtitle}
              color={areaColor}
              colorDark={areaColorDark}
              disabled={responded}
              correct={responded && r.correct}
              onPick={() => {
                if (r.correct) {
                  setResponded(true);
                  session.showSuccess("Resposta honesta: a prova fala, você segura a banca.");
                  return true;
                }
                session.showError(r.feedback);
                return false;
              }}
            />
          ))}
        </div>

        {responded && (
          <button
            type="button"
            onClick={onPhase3}
            className="ludus-btn ludus-btn-xl anim-bounce-in text-white"
            style={{ background: areaColor, borderColor: areaColorDark }}
          >
            Montar a síntese
            <ArrowRight className="size-5" aria-hidden />
          </button>
        )}
      </div>
    );
  }

  /* ----------------------------------------------------- Fase 3 (Decidir) */
  const done = synthesis !== null;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-cloud/60 p-4 text-sm leading-relaxed text-ink-soft">
        <ShieldCheck className="size-5 shrink-0 text-success-dark" aria-hidden />
        <p>
          <strong className="text-ink">Sua mesa:</strong> tese forte + prova forte + objeção
          respondida. Agora escolha o fecho que costura tudo:
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {tema.syntheses.map((s) => (
          <OptionTile
            key={s.id}
            icon={s.correct ? "certo" : "alerta"}
            title={s.title}
            subtitle={s.subtitle}
            color={areaColor}
            colorDark={areaColorDark}
            disabled={done}
            correct={done && s.correct}
            onPick={() => {
              if (s.correct) {
                setSynthesis(s.id);
                session.finish({
                  title: tema.verdict.title,
                  text: tema.verdict.text,
                  detail: tema.verdict.detail,
                  caseId: tema.id,
                });
                return true;
              }
              session.showError(s.feedback);
              return false;
            }}
          />
        ))}
      </div>
    </div>
  );
}
