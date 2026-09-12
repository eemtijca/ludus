/**
 * Reação Equilibrada — conteúdo das 3 reações (reescrita profunda).
 *
 * Cada reação: contexto (onde a reação acontece na vida real), espécies
 * com contagem explícita de átomos, coeficientes-resultado e dica de
 * estratégia de balanceamento.
 */

export interface Species {
  /** Fórmula com subscritos unicode (ex.: “H₂O”). */
  formula: string;
  /** Nome popular. */
  name: string;
  /** Átomos por unidade da espécie. */
  atoms: Record<string, number>;
}

export interface Reaction {
  id: string;
  mission: string;
  icon: string;
  title: string;
  context: string;
  hint: string;
  reagents: Species[];
  products: Species[];
  /** Coeficientes corretos na ordem [reagentes..., produtos...]. */
  answer: number[];
  verdict: {
    title: string;
    text: string;
    detail: { label: string; text: string };
  };
}

export const REACTIONS: Reaction[] = [
  {
    id: "sintese-agua",
    mission: "Bancada da síntese da água",
    icon: "gota",
    title: "Síntese da água",
    context:
      "Hidrogênio queima em oxigênio e vira água — a reação que move foguetes e, numa escala menor, explicou por que o dirigível Hindenburg virou história. A bancada pede a receita exata: quantos H₂ para cada O₂?",
    hint: "Comece pelo hidrogênio: ele aparece em dois lugares. Iguale o H primeiro e o O se ajusta sozinho.",
    reagents: [
      { formula: "H₂", name: "hidrogênio", atoms: { H: 2 } },
      { formula: "O₂", name: "oxigênio", atoms: { O: 2 } },
    ],
    products: [{ formula: "H₂O", name: "água", atoms: { H: 2, O: 1 } }],
    answer: [2, 1, 2],
    verdict: {
      title: "Reação fechada em 2 · 1 · 2",
      text: "2H₂ + O₂ → 2H₂O: quatro hidrogênios de cada lado, dois oxigênios de cada lado. A balança fecha e Lavoisier sorri — nada foi criado, nada sumiu, tudo se rearranjou.",
      detail: {
        label: "Ver a contagem átomo a átomo",
        text: "Esquerda: 2 × H₂ = 4 H · 1 × O₂ = 2 O. Direita: 2 × H₂O = 4 H · 2 O. A conservação da massa é a régua invisível de toda equação química: mudam as ligações, nunca a contagem.",
      },
    },
  },
  {
    id: "fogao-gas",
    mission: "Bancada do fogão a gás",
    icon: "frasco",
    title: "Fogão a gás (metano)",
    context:
      "A chama azul do fogão de casa é metano (CH₄) unido a o oxigênio do ar, virando gás carbônico e vapor de água. A mesma reação esquenta o almoço e preocupa o clima — a receita precisa fechar.",
    hint: "Acerte o carbono primeiro: um C no metano, um C no CO₂. Depois siga o hidrogênio e feche o oxigênio por último.",
    reagents: [
      { formula: "CH₄", name: "metano", atoms: { C: 1, H: 4 } },
      { formula: "O₂", name: "oxigênio", atoms: { O: 2 } },
    ],
    products: [
      { formula: "CO₂", name: "gás carbônico", atoms: { C: 1, O: 2 } },
      { formula: "H₂O", name: "água", atoms: { H: 2, O: 1 } },
    ],
    answer: [1, 2, 1, 2],
    verdict: {
      title: "Chama azul balanceada",
      text: "CH₄ + 2O₂ → CO₂ + 2H₂O: o carbono fecha em 1·1, o hidrogênio em 4·4 e o oxigênio em 4·4. Cada jantar cozinhado escreve esta equação no ar — agora você sabe ler.",
      detail: {
        label: "Ver a contagem átomo a átomo",
        text: "Esquerda: 1 × CH₄ = 1 C · 4 H · 2 × O₂ = 4 O. Direita: 1 × CO₂ = 1 C · 2 O · 2 × H₂O = 4 H · 2 O. Fechamento: C 1·1, H 4·4, O 4·4. Estratégia clássica: C primeiro, H depois, O por último — ele é o mais espalhado.",
      },
    },
  },
  {
    id: "motor-etano",
    mission: "Bancada do motor a etano",
    icon: "bequer",
    title: "Motor e etano",
    context:
      "Etano (C₂H₆) queima dentro dos motores junto com o etanol das bombas. A combustão completa pede bastante oxigênio — o maior coeficiente da coleção (7) mora nesta receita.",
    hint: "Use o menor número inteiro possível: comece com 1 etano, veja o que sobra grande e escale tudo de uma vez.",
    reagents: [
      { formula: "C₂H₆", name: "etano", atoms: { C: 2, H: 6 } },
      { formula: "O₂", name: "oxigênio", atoms: { O: 2 } },
    ],
    products: [
      { formula: "CO₂", name: "gás carbônico", atoms: { C: 1, O: 2 } },
      { formula: "H₂O", name: "água", atoms: { H: 2, O: 1 } },
    ],
    answer: [2, 7, 4, 6],
    verdict: {
      title: "Reação fechada em 2 · 7 · 4 · 6",
      text: "2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O: carbono 4·4, hidrogênio 12·12, oxigênio 14·14. A proporção mínima pedida pela conservação — nem um átomo de sobra, nem um de falta.",
      detail: {
        label: "Ver a contagem átomo a átomo",
        text: "Esquerda: 2 × C₂H₆ = 4 C · 12 H · 7 × O₂ = 14 O. Direita: 4 × CO₂ = 4 C · 8 O · 6 × H₂O = 12 H · 6 O. Fechamento: C 4·4, H 12·12, O 14·14. Quando um lado vem com 7, multiplicar tudo por 2 até virar inteiro é o truque dos químicos.",
      },
    },
  },
];

/** Todos os elementos presentes numa reação (ordem de aparição). */
export function elementsOf(reaction: Reaction): string[] {
  const order: string[] = [];
  for (const sp of [...reaction.reagents, ...reaction.products]) {
    for (const el of Object.keys(sp.atoms)) {
      if (!order.includes(el)) order.push(el);
    }
  }
  return order;
}
