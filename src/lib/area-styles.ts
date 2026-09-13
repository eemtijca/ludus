import type { AreaId } from "./catalog";

/**
 * Classes utilitárias por área BNCC. As strings são literais para que o
 * Tailwind as detecte na compilação. Usar estas classes (em vez de estilos
 * inline) mantém o tema de alto contraste funcional em toda a interface.
 */

export const AREA_BG: Record<AreaId, string> = {
  linguagens: "bg-linguagens",
  matematica: "bg-matematica",
  natureza: "bg-natureza",
  humanas: "bg-humanas",
};

export const AREA_BG_DARK: Record<AreaId, string> = {
  linguagens: "bg-linguagens-dark",
  matematica: "bg-matematica-dark",
  natureza: "bg-natureza-dark",
  humanas: "bg-humanas-dark",
};

export const AREA_BG_SOFT: Record<AreaId, string> = {
  linguagens: "bg-linguagens-soft",
  matematica: "bg-matematica-soft",
  natureza: "bg-natureza-soft",
  humanas: "bg-humanas-soft",
};

export const AREA_BORDER: Record<AreaId, string> = {
  linguagens: "border-linguagens",
  matematica: "border-matematica",
  natureza: "border-natureza",
  humanas: "border-humanas",
};

export const AREA_TEXT_DARK: Record<AreaId, string> = {
  linguagens: "text-linguagens-dark",
  matematica: "text-matematica-dark",
  natureza: "text-natureza-dark",
  humanas: "text-humanas-dark",
};

/** Botão primário na cor da área. */
export const AREA_BTN: Record<AreaId, string> = {
  linguagens: "ludus-btn-linguagens",
  matematica: "ludus-btn-matematica",
  natureza: "ludus-btn-natureza",
  humanas: "ludus-btn-humanas",
};

/** Par (cor do texto, fundo suave) para chips da área. */
export const AREA_CHIP: Record<AreaId, string> = {
  linguagens: "text-linguagens-dark bg-linguagens-soft",
  matematica: "text-matematica-dark bg-matematica-soft",
  natureza: "text-natureza-dark bg-natureza-soft",
  humanas: "text-humanas-dark bg-humanas-soft",
};
