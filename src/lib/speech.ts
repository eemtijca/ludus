/**
 * Motor de leitura em voz alta (Web Speech API, pt-BR).
 * - Escolhe a melhor voz disponível (Google/Microsoft/Luciana/Felipe...).
 * - Destaca o elemento sendo lido (classe .reading-aloud).
 * - Tolerante a navegadores sem suporte e a bloqueios de permissão.
 */

"use client";

type SpeakOptions = {
  /** Elemento que recebe o realce durante a leitura. */
  highlight?: HTMLElement | null;
  /** Velocidade 0.5–1.3. Padrão 0.95 (calmo, didático). */
  rate?: number;
  /** Chamado ao terminar (natural, cancelado ou com erro). */
  onEnd?: () => void;
};

const PREFERRED_VOICE =
  /google|luciana|felipe|daniel|helo[íi]sa|francisca|natalia|thal[íi]a/i;
const FALLBACK_VOICE = /^pt/i;

let cachedVoices: SpeechSynthesisVoice[] = [];
let listenersBound = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;

function speechApi(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  if (!("speechSynthesis" in window)) return null;
  try {
    return window.speechSynthesis;
  } catch {
    return null;
  }
}

function loadVoices(): SpeechSynthesisVoice[] {
  const api = speechApi();
  if (!api) return [];
  try {
    cachedVoices = api.getVoices();
  } catch {
    cachedVoices = [];
  }
  return cachedVoices;
}

function ensureListeners(): void {
  if (listenersBound || typeof window === "undefined") return;
  const api = speechApi();
  if (!api) return;
  listenersBound = true;
  loadVoices();
  try {
    if ("onvoiceschanged" in api) {
      api.onvoiceschanged = () => loadVoices();
    }
  } catch {
    /* noop */
  }
}

export function availableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  ensureListeners();
  if (cachedVoices.length === 0) loadVoices();
  return cachedVoices;
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = availableVoices();
  if (voices.length === 0) return null;
  const br = voices.filter((v) => v.lang === "pt-BR");
  const pool =
    br.length > 0 ? br : voices.filter((v) => FALLBACK_VOICE.test(v.lang));
  if (pool.length === 0) return null;
  return pool.find((v) => PREFERRED_VOICE.test(v.name)) ?? pool[0];
}

function clearHighlight(): void {
  if (typeof document === "undefined") return;
  document
    .querySelectorAll(".reading-aloud")
    .forEach((el) => el.classList.remove("reading-aloud"));
}

/** Interrompe qualquer leitura em andamento. */
export function stopSpeech(): void {
  const api = speechApi();
  if (!api) return;
  currentUtterance = null;
  try {
    api.cancel();
  } catch {
    /* noop */
  }
  clearHighlight();
}

/** Verifica se existe alguma leitura em andamento. */
export function isSpeaking(): boolean {
  const api = speechApi();
  if (!api) return false;
  try {
    return api.speaking || api.pending;
  } catch {
    return false;
  }
}

/** Lê um texto em voz alta, cancelando leituras anteriores. */
export function speak(text: string, options: SpeakOptions = {}): void {
  const api = speechApi();
  if (!api || !text) return;

  stopSpeech();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = options.rate ?? 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voice = pickVoice();
  if (voice) utterance.voice = voice;

  const el = options.highlight ?? null;
  const finish = () => {
    if (el) el.classList.remove("reading-aloud");
    if (currentUtterance === utterance) currentUtterance = null;
    options.onEnd?.();
  };

  if (el) {
    el.classList.add("reading-aloud");
    utterance.onend = finish;
    utterance.onerror = finish;
  } else {
    utterance.onend = finish;
    utterance.onerror = finish;
  }

  currentUtterance = utterance;
  try {
    api.speak(utterance);
  } catch {
    finish();
  }
}

/** Lê uma lista de trechos em sequência (ex.: instrução + transcrição). */
export function speakSequence(
  parts: string[],
  options: SpeakOptions = {},
): void {
  speak(parts.filter(Boolean).join(". "), options);
}

/** Interrompe antes de desmontar telas (evita voz órfã). */
export function cleanupSpeech(): void {
  stopSpeech();
}
