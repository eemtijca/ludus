"use client";

/**
 * Provedor do MathJax v3, carregado localmente de /public/mathjax.
 * Renderiza expressões matemáticas (TeX) e fórmulas químicas (mhchem).
 */

import { MathJaxContext } from "better-react-mathjax";

const config = {
  loader: { load: ["[tex]/mhchem"] },
  tex: {
    inlineMath: [["\\(", "\\)"]],
    packages: { "[+]": ["mhchem"] },
  },
  options: {
    enableMenu: false,
  },
  startup: {
    typeset: false,
  },
};

export function MathJaxProvider({ children }: { children: React.ReactNode }) {
  return (
    <MathJaxContext src="/mathjax/tex-chtml.js" config={config} version={3}>
      {children}
    </MathJaxContext>
  );
}
