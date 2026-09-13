/**
 * Efeitos sonoros sintetizados (Web Audio API), sem arquivos externos.
 * - Disparados apenas por gesto do usuário (política de autoplay).
 * - Respeitam a preferência de som desligado; o som nunca é o único
 *   canal de informação (princípio DUA).
 */

"use client";

let ctx: AudioContext | null = null;
let enabled = true;

function audioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function setSoundEnabled(value: boolean): void {
  enabled = value;
}

export function isSoundEnabled(): boolean {
  return enabled;
}

interface ToneSpec {
  freq: number;
  start: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
}

function playTones(tones: ToneSpec[]): void {
  if (!enabled) return;
  const ac = audioCtx();
  if (!ac) return;
  try {
    for (const t of tones) {
      const osc = ac.createOscillator();
      const vol = ac.createGain();
      const start = ac.currentTime + t.start;
      const end = start + t.duration;
      const peak = t.gain ?? 0.12;

      osc.type = t.type ?? "triangle";
      osc.frequency.setValueAtTime(t.freq, start);

      vol.gain.setValueAtTime(0.0001, start);
      vol.gain.exponentialRampToValueAtTime(peak, start + 0.015);
      vol.gain.exponentialRampToValueAtTime(0.0001, end);

      osc.connect(vol);
      vol.connect(ac.destination);
      osc.start(start);
      osc.stop(end + 0.02);
    }
  } catch {
    /* silêncio é aceitável */
  }
}

/** Acerto: arpejo ascendente curto. */
export function playCorrect(): void {
  playTones([
    { freq: 523.25, start: 0, duration: 0.12, gain: 0.1 },
    { freq: 659.25, start: 0.08, duration: 0.12, gain: 0.1 },
    { freq: 783.99, start: 0.16, duration: 0.18, gain: 0.12 },
  ]);
}

/** Erro: dois tons descendentes curtos. */
export function playError(): void {
  playTones([
    { freq: 311.13, start: 0, duration: 0.12, gain: 0.08, type: "sine" },
    { freq: 233.08, start: 0.1, duration: 0.16, gain: 0.08, type: "sine" },
  ]);
}

/** Selo: brilho de moeda. */
export function playBadge(): void {
  playTones([
    { freq: 987.77, start: 0, duration: 0.09, gain: 0.09, type: "sine" },
    { freq: 1318.51, start: 0.07, duration: 0.14, gain: 0.09, type: "sine" },
  ]);
}

/** Conclusão da partida: fanfarra curta. */
export function playVictory(): void {
  playTones([
    { freq: 523.25, start: 0, duration: 0.12, gain: 0.1 },
    { freq: 659.25, start: 0.1, duration: 0.12, gain: 0.1 },
    { freq: 783.99, start: 0.2, duration: 0.12, gain: 0.11 },
    { freq: 1046.5, start: 0.3, duration: 0.28, gain: 0.13 },
  ]);
}

/** Clique curto de peça selecionada. */
export function playTick(): void {
  playTones([{ freq: 660, start: 0, duration: 0.05, gain: 0.05, type: "sine" }]);
}
