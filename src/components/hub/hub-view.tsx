"use client";

/**
 * HubView: página inicial, com hero e navegador de jogos.
 */

import { HubHero } from "./hub-hero";
import { GamesBrowser } from "./games-browser";

export function HubView() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <HubHero />
      <div className="mt-8 sm:mt-12">
        <GamesBrowser />
      </div>
    </div>
  );
}
