"use client";

/**
 * BadgeTray — os três selos da partida: Lente, Chave e Selo Final.
 * Selos nunca diminuem. Ao serem conquistados, pulsam e tocam.
 */

import { Medal, ScanSearch, KeyRound } from "lucide-react";
import type { BadgeId } from "@/lib/progress";

const BADGES: {
  id: BadgeId;
  label: string;
  hint: string;
  Icon: typeof Medal;
}[] = [
  {
    id: "lente",
    label: "Lente",
    hint: "Exploração completa",
    Icon: ScanSearch,
  },
  { id: "chave", label: "Chave", hint: "Análise desvendada", Icon: KeyRound },
  {
    id: "selo-final",
    label: "Selo Final",
    hint: "Decisão de mestre",
    Icon: Medal,
  },
];

export function BadgeTray({ badges }: { badges: BadgeId[] }) {
  return (
    <ul className="flex items-center gap-2" aria-label="Selos da partida">
      {BADGES.map(({ id, label, hint, Icon }) => {
        const earned = badges.includes(id);
        return (
          <li key={id}>
            <div
              className={[
                "flex min-h-11 items-center gap-1.5 rounded-full border-2 px-3 py-1.5 font-display text-[0.74rem] font-bold transition-colors sm:px-4",
                earned
                  ? "border-success bg-success-soft text-success-dark anim-pop"
                  : "border-dashed border-border bg-white text-ink-faint",
              ].join(" ")}
              title={hint}
            >
              <Icon className="size-4" strokeWidth={2.4} aria-hidden />
              <span className="hidden sm:inline">{label}</span>
              <span className="sr-only">
                {earned ? "conquistado" : "a conquistar"}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
