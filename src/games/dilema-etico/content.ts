/**
 * Dilema Ético: conteúdo do jogo.
 *
 * As 3 peças da semana (contrato, família, lei) e 3 turnos de escolha
 * com efeitos em dinheiro, tempo e saúde e consequência narrada.
 */

export interface EthicPiece {
  icon: string;
  category: string;
  hook: string;
  evidence: string;
}

export const PIECES: EthicPiece[] = [
  {
    icon: "maleta",
    category: "O contrato",
    hook: "App de entregas, pagamento por corrida",
    evidence:
      "Sem vínculo formal, sem folga garantida e sem seguro contra acidente. O app paga por entrega concluída: mais corrida, mais dinheiro, menos sono, menos estudo. O convite para trabalhar de manhã e de noite chegou pelo celular; aceitar é um toque.",
  },
  {
    icon: "usuarios",
    category: "A casa",
    hook: "R$ 200 fazem falta esta semana",
    evidence:
      "Em casa, a conta de luz vence sexta e a mãe já avisou: faltam R$ 200 para fechar o mês. Seu trabalho tem ajudado na compra do mercado, e o meio-irmão menor conta com a sua parte na internet do mês que vem.",
  },
  {
    icon: "escudo",
    category: "A lei",
    hook: "Limite de idade tem regra",
    evidence:
      "O Estatuto da Criança e do Adolescente limita o trabalho de menores de idade: nada noturno, nada que prejudique os estudos e nada em atividade de risco. Trabalho de adolescente é aprendizado com proteção, não sobrevivência sem rede.",
  },
];

export interface TurnChoice {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  effect: { money: number; time: number; health: number };
  consequence: string;
}

export const TURNS: TurnChoice[] = [
  {
    id: "aceitar",
    icon: "moedas",
    title: "Aceitar tudo",
    subtitle: "Virar o app de manhã e de noite",
    effect: { money: 20, time: -15, health: -20 },
    consequence:
      "O caixa engordou, o corpo pagou: duas janelas de corrida por dia comem o sono e o estudo. O dinheiro de hoje compra o mês e rouba a semana.",
  },
  {
    id: "negociar",
    icon: "aperto",
    title: "Negociar limites",
    subtitle: "Corridas só depois da escola, sem noturno",
    effect: { money: 10, time: -5, health: -5 },
    consequence:
      "Meio-termo com a realidade: corridas no horário seguro, um combinado com a casa sobre o que falta e a semana respira: apertada, mas respira.",
  },
  {
    id: "recusar",
    icon: "book_open",
    title: "Recusar e estudar",
    subtitle: "Focar na escola nesta semana",
    effect: { money: -5, time: 10, health: 5 },
    consequence:
      "O app ficou quieto, os cadernos abriram: a nota de recuperação agradece e o sono volta ao horário. A casa sente a falta dos R$ 5, e conversa sobre isso no domingo.",
  },
];

export const REFLECTION = {
  prompt:
    "A semana fechou. Olhando os três números: dinheiro, tempo e saúde: o que esta simulação ensina sobre trabalho na adolescência?",
  options: [
    {
      id: "equilibrio",
      icon: "certo",
      title: "Trabalho decente equilibra as três contas",
      subtitle: "Renda sem comer o estudo e a saúde, e dentro da lei",
      correct: true,
      feedback: "",
    },
    {
      id: "dinheiro",
      icon: "moedas",
      title: "Dinheiro resolve tudo",
      subtitle: "O resto se recupera depois",
      correct: false,
      feedback:
        "As barras contam outra história: saúde e tempo derrubados não se recuperam com o dinheiro que os derrubou: cada turno aceito cobra juros.",
    },
    {
      id: "leifacil",
      icon: "alerta",
      title: "A lei é só burocracia",
      subtitle: "Se o app permite, está tudo bem",
      correct: false,
      feedback:
        "A lei existe porque o desequilíbrio é real: o limite de idade protege exatamente o que as barras mostram: estudo, sono e desenvolvimento.",
    },
  ],
  verdict: {
    title: "Semana vivida, preço à mostra",
    text: "Você fechou a semana com dinheiro no bolso, tempo no cronograma e saúde no verde: o tripé que o trabalho decente pede. A simulação deixa o dilema no ar: cada escolha da adolescência paga em alguma moeda, e as três valem ouro.",
    detail: {
      label: "Ver o debate por trás do jogo",
      text: "O Estatuto da Criança e do Adolescente define o trabalho protegido no art. 67: proibido o noturno, o perigoso, o insalubre e o que prejudica a frequência à escola. Trabalho-educação equilibra as três barras; trabalho-sobrevivência costuma derrubar duas para levantar uma. Discutir isso com os números na tela é o objetivo da simulação.",
    },
  },
};
