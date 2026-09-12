/**
 * Orçamento no Limite — conteúdo das 3 missões (reescrita profunda).
 *
 * Cada missão: contexto financeiro real, parâmetros do simulador
 * (renda, preço, taxa padrão, prazo, rendimento da poupança) e
 * vereditos distintos para parcelar dentro do limite vs. guardar.
 */

export interface BudgetMission {
  id: string;
  mission: string;
  icon: string;
  title: string;
  hook: string;
  brief: string;
  /** Renda mensal disponível (R$). */
  income: number;
  /** Preço do produto à vista (R$). */
  price: number;
  /** Taxa de juros mensal padrão da loja (%). */
  defaultRate: number;
  /** Prazo padrão (meses). */
  defaultTerm: number;
  /** Rendimento mensal da poupança (%), para o caminho "guardar". */
  savingsYield: number;
  /** Meta do caminho "guardar" (R$). */
  savingsGoal?: string;
  verdictInstallment: string;
  verdictSave: string;
  detail: { label: string; text: string };
}

export const MISSIONS: BudgetMission[] = [
  {
    id: "mesada",
    mission: "O celular que cabe (ou não) no orçamento",
    icon: "usuario",
    title: "Mesada curta",
    hook: "Celular de R$ 1.200 em 12 vezes",
    brief:
      "Você ajuda no mercado da família e recebe R$ 1.200 por mês. A moradia e a comida já levam R$ 750 — sobra R$ 450 para tudo o resto. O celular dos sonhos custa R$ 1.200 e a loja oferece 12 parcelas com 2,5% de juros ao mês.",
    income: 1200,
    price: 1200,
    defaultRate: 2.5,
    defaultTerm: 12,
    savingsYield: 0.8,
    verdictInstallment:
      "A parcela coube no limite de 30% da renda — o compromisso não engole o mês. Mas lembre: juros compostos fizeram o celular ficar mais caro que o preço de etiqueta.",
    verdictSave:
      "Guardar e comprar à vista: sem juros, com a poupança ainda rendendo uma pequena gorjeta no caminho. Paciência também é matemática financeira.",
    detail: {
      label: "Ver a matemática da loja",
      text: "Juros compostos: cada mês rende juros sobre juros. M = C × (1 + i)ⁿ. Compare o total a prazo com o preço de etiqueta — a diferença é o custo da pressa. E o limite de 30% da renda existe para sobrar dinheiro para imprevistos.",
    },
  },
  {
    id: "loja",
    mission: "A armadilha das 10 parcelas",
    icon: "moedas",
    title: "Tênis parcelado",
    hook: "R$ 800 à vista ou 10 parcelas com juros",
    brief:
      "O tênis da moda custa R$ 800 à vista — mas a vitrine grita “10x sem dor”. Só que essa loja cobra 1,5% de juros ao mês no parcelamento. Você tem R$ 1.200 de renda e a poupança rende 0,8% ao mês. Vale abrir mão do dinheiro guardado?",
    income: 1200,
    price: 800,
    defaultRate: 1.5,
    defaultTerm: 10,
    savingsYield: 0.8,
    verdictInstallment:
      "Parcela dentro do limite de 30% da renda: cabe no bolso. Agora compare no simulador quanto o tênis custou no total — aquele “sem dor” tem taxa de anestesia.",
    verdictSave:
      "Guardar por alguns meses e pagar à vista: o mesmo tênis, mais barato, com a poupança trabalhando a seu favor. Quem espera pelo dinheiro, paga menos.",
    detail: {
      label: "Ver a matemática da loja",
      text: "“Sem dor” na vitrine rima com “com juros” no contrato. Teste no simulador: aumente a taxa e veja a curva subir. Juros compostos são pacientes — eles crescem devagar no começo e aceleram no fim.",
    },
  },
  {
    id: "reserva",
    mission: "A reserva que vira notebook",
    icon: "cofre",
    title: "Reserva para a prova",
    hook: "Meta de R$ 2.500 em 12 meses",
    brief:
      "O curso técnico exige um notebook de R$ 2.500 e a prova de certificação é daqui a um ano. Juntando R$ 200 por mês na poupança (0,8% ao mês), a meta é alcançável sem parcelar nada. A loja oferece o parcelado a 0% de taxa — será que vale?",
    income: 1200,
    price: 2500,
    defaultRate: 0,
    defaultTerm: 12,
    savingsYield: 0.8,
    savingsGoal: "R$ 2.500 em 12 meses",
    verdictInstallment:
      "Com taxa zero e parcela dentro do limite, o parcelamento aqui é uma ferramenta honesta: o total final é o preço de etiqueta. Simulador confirma — nem toda parcela é vilã.",
    verdictSave:
      "Guardar e comprar depois: sem dívida, com rendimento da poupança somando no caminho. A meta de 12 meses fecha com folga — e a certificação espera por você.",
    detail: {
      label: "Ver a matemática da loja",
      text: "Parcela com taxa 0% custa o preço de etiqueta dividido no tempo — sem pegadinha. Guardar rende 0,8% ao mês sobre o saldo acumulado. Mova o prazo no simulador e compare os dois caminhos com calma.",
    },
  },
];

/** Juros compostos: montante a partir de capital, taxa mensal (%) e prazo. */
export function compoundAmount(
  capital: number,
  ratePct: number,
  months: number,
): number {
  return capital * Math.pow(1 + ratePct / 100, months);
}

/** Saldo acumulado guardando mensalmente com rendimento (% a.m.). */
export function savingsTotal(
  monthly: number,
  yieldPct: number,
  months: number,
): number {
  const i = yieldPct / 100;
  if (i === 0) return monthly * months;
  return monthly * ((Math.pow(1 + i, months) - 1) / i);
}
