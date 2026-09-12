/**
 * Dilema do Gene — conteúdo (reescrita profunda).
 *
 * Ambientes e pressões combináveis + genética do cruzamento Aa × aa
 * com tabela de Punnett para o bastidor do veredito.
 */

export interface GeneOption {
  id: string;
  icon: string;
  title: string;
  hook: string;
  evidence: string;
}

export const ENVIRONMENTS: GeneOption[] = [
  {
    id: "sol",
    icon: "sol",
    title: "Sol e terra seca",
    hook: "Fundo marrom da caatinga",
    evidence:
      "Terra clara e quente, sol a pino. Nesse fundo, o pelo marrom desaparece — o branco, ao contrário, acende como farol de aviso para qualquer predador.",
  },
  {
    id: "neve",
    icon: "neve",
    title: "Neve e frio",
    hook: "Fundo branco da neve",
    evidence:
      "Campo coberto de neve. Aqui a lógica espelha: o pelo branco sumiu no cenário, e é o marrom que acende como farol para o predador.",
  },
];

export const PRESSURES: GeneOption[] = [
  {
    id: "lobo",
    icon: "pata",
    title: "Predador de vista",
    hook: "Caça quem destoa do fundo",
    evidence:
      "Um predador visual ronda o quintal: enxerga primeiro quem contrasta. A camuflagem decide quem escapa — e quem deixa descendentes.",
  },
  {
    id: "comida",
    icon: "trigo",
    title: "Comida dura e escassa",
    hook: "Só o mais eficiente se alimenta",
    evidence:
      "Capim duro, pouca sombra e comida esparsa: quem aproveia melhor cada refeição engorda para o inverno; quem não aproveia, definha.",
  },
];

/** Vantagem de sobrevivência do marron em cada combinação (0–1). */
export function survivalAdvantage(
  environment: string,
  pressure: string,
): { brown: number; white: number } {
  if (pressure === "lobo") {
    // Sol: marrom camufla (0.85) · Neve: branco camufla
    return environment === "sol"
      ? { brown: 0.85, white: 0.35 }
      : { brown: 0.35, white: 0.85 };
  }
  // Comida dura: pressão neutra à cor — vantagem leve e igual para os dois
  return { brown: 0.6, white: 0.6 };
}

export const PUNNETT = {
  cross: "Aa × aa",
  table: [
    ["Aa (marrom)", "aa (branco)"],
    ["Aa (marrom)", "aa (branco)"],
  ],
  explanation:
    "Cruzando Aa × aa, cada filhote tem 50% de chance de nascer Aa (marrom dominante) e 50% de aa (branco recessivo). A cor não escolhe o ambiente — o ambiente é que favorece quem já nasceu combinando.",
};

export const VERDICT = {
  title: "O ambiente deu a nota, o gene deu a cor",
  text: "Nenhum coelho mudou de cor: quem já combinava com o fundo escapou mais, deixou mais filhotes e, geração após geração, a frequência das cores mudou sozinha. Seleção natural é isso — não esforço, só estatística com consequência.",
  detail: {
    label: "Ver a genética por trás da simulação",
    text: "Cruzamento Aa × aa (Punnett): 50% Aa (marrom) · 50% aa (branco). A cada geração, os sobreviventes reproduzem mantendo a proporção de nascimento — mas a pressão do ambiente filtra quem chega lá. Em três gerações, o quintal mudou de cor sem que um único coelho “quisesse” isso.",
  },
};
