"use client";

/**
 * SobreDialog: créditos do projeto, aberto pelo rodapé.
 * O estado fica local para o rodapé seguir como componente de servidor.
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DESENVOLVEDORES = [
  { nome: "Emanuel Lázaro", url: "https://github.com/emanuellcs" },
  { nome: "Prof. Josué Cavalcante", url: "https://github.com/wolf9611" },
];

const REPOSITORIO = "https://github.com/eemtijca/ludus";

export function SobreDialog() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="rounded-lg px-2 py-1 text-xs font-bold text-ink-soft underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        Sobre
      </button>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="border-2 border-border bg-surface sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-ink">
              Sobre o Ludus
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-ink-soft">
              Jogos de investigação para o ensino médio, em apoio ao Atendimento Educacional
              Especializado (AEE) e ao Desenho Universal para a Aprendizagem (DUA).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-ink-soft">
            <div className="space-y-1.5">
              <p className="font-bold text-ink">Desenvolvimento</p>
              <ul className="space-y-1">
                {DESENVOLVEDORES.map(({ nome, url }) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-ink underline underline-offset-4"
                    >
                      {nome}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p>
              <a
                href={REPOSITORIO}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ink underline underline-offset-4"
              >
                Repositório do projeto no GitHub
              </a>
            </p>
            <p className="text-xs leading-relaxed text-ink-faint">
              Código aberto sob a licença MIT. Sala de Recursos da EEMTI José Cláudio de Araújo.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
