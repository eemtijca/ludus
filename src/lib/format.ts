/**
 * Formatadores pt-BR compartilhados (moeda, número, porcentagem, data).
 * Centralizados para manter consistência entre os jogos e os HUDs.
 */

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number, digits = 0): string {
  return `${formatNumber(value * 100, digits)}%`;
}

/** Formato curto de data (ex.: 12 de mar. de 2026) para o painel. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

/** Interpolação linear entre dois valores. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Fixa um número dentro de [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
