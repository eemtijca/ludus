"use client";

/**
 * MathText: renderiza um texto misto com trechos de TeX delimitados por
 * \( ... \). Os trechos matemáticos viram elementos do MathJax; o restante
 * permanece texto comum.
 */

import { MathJax } from "better-react-mathjax";

const SPLIT = /\\\((.+?)\\\)/g;

export function MathText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(SPLIT);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <MathJax key={i} inline dynamic hideUntilTypeset="first">
            {`\\(${part}\\)`}
          </MathJax>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}
