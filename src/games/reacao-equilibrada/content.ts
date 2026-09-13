/**
 * Reação Equilibrada: conteúdo das reações.
 *
 * Cada reação traz contexto (onde a reação acontece), espécies com
 * contagem explícita de átomos, coeficientes corretos e dica de
 * estratégia de balanceamento.
 */

export interface Species {
  /** Fórmula com subscritos unicode (ex.: H₂O). */
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
    detail: { label: string; text: string; speech?: string };
  };
}

export const REACTIONS: Reaction[] = [
  {
    id: "sintese-agua",
    mission: "Bancada da síntese da água",
    icon: "gota",
    title: "Síntese da água",
    context:
      "Hidrogênio queima em oxigênio e vira água: a reação que move foguetes e que também explicou o fim do dirigível Hindenburg, sustentado por hidrogênio. A bancada pede a receita exata: quantos H₂ para cada O₂?",
    hint: "Comece pelo hidrogênio: ele aparece em dois lugares. Iguale o H primeiro e o O se ajusta sozinho.",
    reagents: [
      { formula: "H₂", name: "hidrogênio", atoms: { H: 2 } },
      { formula: "O₂", name: "oxigênio", atoms: { O: 2 } },
    ],
    products: [{ formula: "H₂O", name: "água", atoms: { H: 2, O: 1 } }],
    answer: [2, 1, 2],
    verdict: {
      title: "Reação fechada em 2, 1 e 2",
      text: "\\(\\ce{2H2 + O2 -> 2H2O}\\): quatro hidrogênios de cada lado, dois oxigênios de cada lado. A balança fecha e Lavoisier sorri. Nada foi criado, nada sumiu, tudo se rearranjou.",
      detail: {
        label: "Ver a contagem átomo a átomo",
        text: "Esquerda: \\(2 \\times \\ce{H2} = 4\\) H e \\(1 \\times \\ce{O2} = 2\\) O. Direita: \\(2 \\times \\ce{H2O} = 4\\) H e \\(2\\) O. A conservação da massa é a régua invisível de toda equação química: mudam as ligações, nunca a contagem.",
        speech:
          "No lado esquerdo, duas moléculas de hidrogênio dão quatro hidrogênios e uma molécula de oxigênio dá dois oxigênios. No lado direito, duas moléculas de água trazem quatro hidrogênios e dois oxigênios. A conservação da massa é a régua invisível de toda equação química: mudam as ligações, nunca a contagem.",
      },
    },
  },
  {
    id: "fogao-gas",
    mission: "Bancada do fogão a gás natural",
    icon: "frasco",
    title: "Chama do gás natural",
    context:
      "A chama azul do fogão encanado é a combustão do metano (CH₄), componente principal do gás natural, com o oxigênio do ar, virando gás carbônico e vapor de água. A mesma reação esquenta o almoço e preocupa o clima. A receita precisa fechar.",
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
      text: "\\(\\ce{CH4 + 2O2 -> CO2 + 2H2O}\\): o carbono fecha em 1 e 1, o hidrogênio em 4 e 4, o oxigênio em 4 e 4. Cada jantar cozinhado escreve esta equação no ar, e agora você sabe ler.",
      detail: {
        label: "Ver a contagem átomo a átomo",
        text: "Esquerda: \\(1 \\times \\ce{CH4} = 1\\) C e \\(4\\) H; \\(2 \\times \\ce{O2} = 4\\) O. Direita: \\(1 \\times \\ce{CO2} = 1\\) C e \\(2\\) O; \\(2 \\times \\ce{H2O} = 4\\) H e \\(2\\) O. Fechamento: C 1 e 1, H 4 e 4, O 4 e 4. Estratégia clássica: C primeiro, H depois, O por último, porque ele é o mais espalhado.",
        speech:
          "No lado esquerdo, um metano dá um carbono e quatro hidrogênios, e dois oxigênios dão quatro oxigênios. No lado direito, um gás carbônico traz um carbono e dois oxigênios, e duas águas trazem quatro hidrogênios e dois oxigênios. Fechamento: carbono um para um, hidrogênio quatro para quatro, oxigênio quatro para quatro. Estratégia clássica: carbono primeiro, hidrogênio depois, oxigênio por último, porque ele é o mais espalhado.",
      },
    },
  },
  {
    id: "motor-etano",
    mission: "Bancada do etano da petroquímica",
    icon: "bequer",
    title: "Combustão do etano",
    context:
      "O etano (C₂H₆) é o segundo componente do gás natural: sai das unidades de processamento e vira matéria-prima do eteno, base de plásticos como o polietileno. Sua combustão completa pede bastante oxigênio, e o maior coeficiente da coleção (7) mora nesta receita.",
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
      title: "Reação fechada em 2, 7, 4 e 6",
      text: "\\(\\ce{2C2H6 + 7O2 -> 4CO2 + 6H2O}\\): carbono 4 e 4, hidrogênio 12 e 12, oxigênio 14 e 14. A proporção mínima pedida pela conservação: nem um átomo de sobra, nem um de falta.",
      detail: {
        label: "Ver a contagem átomo a átomo",
        text: "Esquerda: \\(2 \\times \\ce{C2H6} = 4\\) C e \\(12\\) H; \\(7 \\times \\ce{O2} = 14\\) O. Direita: \\(4 \\times \\ce{CO2} = 4\\) C e \\(8\\) O; \\(6 \\times \\ce{H2O} = 12\\) H e \\(6\\) O. Fechamento: C 4 e 4, H 12 e 12, O 14 e 14. Quando um lado vem com 7, multiplicar tudo por 2 até virar inteiro é o truque dos químicos.",
        speech:
          "No lado esquerdo, dois etanos dão quatro carbonos e doze hidrogênios, e sete oxigênios dão catorze oxigênios. No lado direito, quatro gás carbônico trazem quatro carbonos e oito oxigênios, e seis águas trazem doze hidrogênios e seis oxigênios. Fechamento: carbono quatro para quatro, hidrogênio doze para doze, oxigênio catorze para catorze. Quando um coeficiente vem com sete, multiplicar tudo por dois até virar inteiro é o truque dos químicos.",
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
