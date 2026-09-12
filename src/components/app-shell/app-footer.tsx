/**
 * AppFooter — rodapé fixo na base: crédito institucional + princípios DUA/AEE.
 */

export function AppFooter() {
  return (
    <footer className="mt-auto border-t-2 border-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-center sm:px-6">
        <p className="font-display text-sm font-bold text-ink">
          Ludus · Jogos do Ensino Médio
        </p>
        <p className="text-xs font-semibold leading-relaxed text-ink-soft">
          Sala de Recursos · EEMTI José Cláudio de Araújo · 2026
        </p>
        <p className="max-w-xl text-[0.72rem] leading-relaxed text-ink-faint">
          Recurso de apoio ao Atendimento Educacional Especializado (AEE),
          construído segundo o Desenho Universal para a Aprendizagem (DUA): sem
          cronômetro, com voz, repetição livre e ritmo próprio.
        </p>
      </div>
    </footer>
  );
}
