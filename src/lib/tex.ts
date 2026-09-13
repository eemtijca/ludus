/**
 * Conversão de TeX para texto simples, usada como fallback quando um texto
 * com expressões precisa ser lido em voz alta ou exibido sem MathJax.
 * Não é um conversor completo: cobre o subconjunto empregado nos conteúdos.
 */

const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

function atomizeBraces(tex: string): string {
  // Remove chaves soltas mantendo o conteúdo: "x^{2}" vira "x^2".
  return tex.replace(/[{}]/g, "");
}

function texToPlain(tex: string): string {
  let out = tex;

  // \ce{...} (mhchem): mantém a fórmula e troca a seta de reação.
  out = out.replace(/\\ce\{([^}]*)\}/g, (_m, chem: string) =>
    String(chem).replace(/->|→/g, "→").replace(/\s+/g, " ").trim(),
  );
  // Subscritos simples: H_2 -> H2 (legível para leitura em voz alta).
  out = out.replace(/([A-Za-z])_(\{?\d\}?)/g, (_s, a: string, d: string) => a + atomizeBraces(d));

  // Frações: \frac{a}{b} -> a/b.
  out = out.replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, (_s, a: string, b: string) => `${a}/${b}`);

  // Expoentes: ^{2} ou ^2 -> ² quando dígito único.
  out = out.replace(/\^\{(\d)\}|\^(\d)/g, (_s, a?: string, b?: string) => {
    const d = a ?? b ?? "";
    return SUPERSCRIPTS[d] ?? `^${d}`;
  });
  out = out.replace(/\^\{([^{}]+)\}/g, " elevado a $1");

  // Símbolos com nome TeX.
  out = out
    .replace(/\\cdot|\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\approx/g, "≈")
    .replace(/\\neq?/g, "≠")
    .replace(/\\leq?/g, "≤")
    .replace(/\\geq?/g, "≥")
    .replace(/\\to|\\rightarrow/g, "→")
    .replace(/\\Omega/g, "Ω")
    .replace(
      /\\text\{([^{}]*)\}|\\mathrm\{([^{}]*)\}/g,
      (_s, a?: string, b?: string) => a ?? b ?? "",
    )
    .replace(/\\%/g, "%")
    .replace(/\\,/g, " ");

  return atomizeBraces(out)
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Remove delimitadores \( ... \) e converte o TeX para texto simples. */
export function stripLatex(text: string): string {
  if (!text) return text;
  return text.replace(/\\\((.+?)\\\)/g, (_m, tex: string) => texToPlain(tex));
}
