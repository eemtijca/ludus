"use client";

/**
 * A11yProvider — preferências de acessibilidade (DUA) da aplicação.
 *
 * Implementado como external store + useSyncExternalStore:
 * - Lê localStorage uma única vez no client (sem setState em efeito);
 * - Mantém SSR/hydration consistentes (snapshot do servidor é o padrão);
 * - Aplica classes em <html> (alto contraste, texto amplo, menos movimento)
 *   e controla os efeitos sonoros.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { setSoundEnabled } from "@/lib/sound";

export interface A11yPreferences {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  soundEffects: boolean;
}

const DEFAULT_PREFS: A11yPreferences = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  soundEffects: true,
};

const STORAGE_KEY = "ludus:a11y:v1";

interface A11yContextValue extends A11yPreferences {
  toggle: (key: keyof A11yPreferences) => void;
  set: (key: keyof A11yPreferences, value: boolean) => void;
}

/* ------------------------------------------------------- External Store */

type Listener = () => void;
const listeners = new Set<Listener>();
let snapshot: A11yPreferences = DEFAULT_PREFS;
let hydrated = false;

function readPrefs(): A11yPreferences {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<A11yPreferences>;
    return {
      highContrast: !!parsed.highContrast,
      largeText: !!parsed.largeText,
      reducedMotion: !!parsed.reducedMotion,
      soundEffects: parsed.soundEffects !== false,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function applyPrefs(prefs: A11yPreferences): void {
  const root = document.documentElement;
  root.classList.toggle("a11y-contrast", prefs.highContrast);
  root.classList.toggle("a11y-text-large", prefs.largeText);
  root.classList.toggle("a11y-reduced-motion", prefs.reducedMotion);
  setSoundEnabled(prefs.soundEffects);
}

function persist(prefs: A11yPreferences): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* armazenamento bloqueado: preferência vale só nesta sessão */
  }
}

function hydrate(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  snapshot = readPrefs();
  applyPrefs(snapshot);
}

function emit(): void {
  for (const listener of listeners) listener();
}

function update(key: keyof A11yPreferences, value: boolean): void {
  snapshot = { ...snapshot, [key]: value };
  applyPrefs(snapshot);
  persist(snapshot);
  emit();
}

function subscribe(listener: Listener): () => void {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): A11yPreferences {
  return snapshot;
}

function getServerSnapshot(): A11yPreferences {
  return DEFAULT_PREFS;
}

/* -------------------------------------------------------------- Context */

const A11yContext = createContext<A11yContextValue>({
  ...DEFAULT_PREFS,
  toggle: () => undefined,
  set: () => undefined,
});

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const set = useCallback((key: keyof A11yPreferences, value: boolean) => {
    update(key, value);
  }, []);

  const toggle = useCallback((key: keyof A11yPreferences) => {
    update(key, !snapshot[key]);
  }, []);

  const value = useMemo(
    () => ({ ...prefs, toggle, set }),
    [prefs, toggle, set],
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y(): A11yContextValue {
  return useContext(A11yContext);
}
