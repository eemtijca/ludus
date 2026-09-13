/**
 * O Circuito Falhou: conteúdo dos casos de bancada.
 *
 * Cada caso traz sintoma relatado, parâmetros elétricos, configuração
 * que resolve, hipóteses de diagnóstico (uma correta) e explicação
 * completa do defeito para o veredito.
 */

export interface CircuitCase {
  id: string;
  mission: string;
  icon: string;
  title: string;
  symptom: string;
  brief: string;
  /** Tensão da fonte (V). */
  voltage: number;
  /** Resistência da lâmpada (Ω). */
  lampResistance: number;
  /** Resistência do fio direto (curto). */
  wireResistance: number;
  /** Configuração exigida para a lâmpada acender. */
  required: { switchClosed: boolean; parallel: boolean; lampIn: boolean };
  /** Hipóteses de diagnóstico (fase 3). */
  diagnoses: {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    correct: boolean;
    feedback: string;
  }[];
  verdict: {
    title: string;
    text: string;
    detail: { label: string; text: string; speech?: string };
  };
}

export const CASES: CircuitCase[] = [
  {
    id: "celular-nao-carrega",
    mission: "Bancada 1: o celular que não carrega",
    icon: "tomada",
    title: "Celular não carrega",
    symptom: "O carregador está na tomada, mas o celular nem pisca.",
    brief:
      "Fonte de 9 V e lâmpada de 20 Ω representando o circuito de carga. A bancada chega com o caminho interrompido: em algum ponto, o circuito está aberto.",
    voltage: 9,
    lampResistance: 20,
    wireResistance: 1,
    required: { switchClosed: true, parallel: false, lampIn: true },
    diagnoses: [
      {
        id: "aberto",
        icon: "certo",
        title: "Circuito aberto",
        subtitle: "A chave interrompia o caminho da corrente",
        correct: true,
        feedback: "",
      },
      {
        id: "curto",
        icon: "alerta",
        title: "Curto-circuito",
        subtitle: "A corrente passava direto, sem resistência",
        correct: false,
        feedback:
          "Curto derruba o disjuntor e esquenta o fio. Aqui o sintoma é o oposto: nada acontece, nada circula.",
      },
      {
        id: "paralelo",
        icon: "embaralhar",
        title: "Lâmpadas em série",
        subtitle: "As duas queimaram juntas",
        correct: false,
        feedback:
          "Só existe uma lâmpada nesta bancada: o problema do celular é o caminho, não a associação.",
      },
    ],
    verdict: {
      title: "Luz acesa, celular carregando",
      text: "Fechar a chave completou o caminho: 9 V sobre 20 Ω deixaram 0,45 A circulando e a lâmpada acesa. Circuito aberto é a avaria mais silenciosa que existe: sem caminho, não há corrente, e o celular fica mudo na tomada.",
      detail: {
        label: "Ver a conta da bancada",
        text: "Lei de Ohm: \\(I = \\frac{U}{R} = \\frac{9}{20} = 0{,}45\\) A. Com a chave aberta, R na prática é infinito e \\(I = 0\\): a lâmpada nem pisca. Todo carregador quebrado “sem motivo” merece uma olhada no caminho: cabo rompido é uma chave aberta disfarçada.",
        speech:
          "Lei de Ohm: I é igual a U dividido por R, nove dividido por vinte, que dá zero vírgula quarenta e cinco ampères. Com a chave aberta, a resistência na prática é infinita e a corrente é zero: a lâmpada nem pisca. Todo carregador quebrado sem motivo merece uma olhada no caminho: cabo rompido é uma chave aberta disfarçada.",
      },
    },
  },
  {
    id: "quarto-duas-lampadas",
    mission: "Bancada 2: o quarto que apaga inteiro",
    icon: "lampada",
    title: "Quarto com 2 lâmpadas",
    symptom: "Uma lâmpada queimou e o quarto ficou no escuro total.",
    brief:
      "Fonte de 12 V e duas lâmpadas de 10 Ω cada. Ligadas em série, quando uma falha as duas apagam. A bancada testa a associação que mantém o quarto aceso mesmo se uma lâmpada morrer.",
    voltage: 12,
    lampResistance: 10,
    wireResistance: 1,
    required: { switchClosed: true, parallel: true, lampIn: true },
    diagnoses: [
      {
        id: "serie",
        icon: "certo",
        title: "Associação em série",
        subtitle: "Um único caminho: uma falha apaga tudo",
        correct: true,
        feedback: "",
      },
      {
        id: "aberto",
        icon: "alerta",
        title: "Chave aberta",
        subtitle: "O interruptor estava desligado",
        correct: false,
        feedback:
          "Se a chave estivesse aberta, o quarto nunca teria acendido. O quarto funcionava, até uma lâmpada falhar.",
      },
      {
        id: "curto",
        icon: "alerta",
        title: "Curto-circuito",
        subtitle: "Fio direto nos polos da fonte",
        correct: false,
        feedback:
          "Curto esquenta fio e derrete isolação, e não é o sintoma de “apagou com uma lâmpada queimada”.",
      },
    ],
    verdict: {
      title: "Quarto aceso, falha isolada",
      text: "Em paralelo, cada lâmpada ganha seu próprio caminho com os 12 V inteiros: uma falha, a outra continua. Em série, a mesma corrente atravessa as duas, e uma lâmpada queimada abre o único caminho do circuito inteiro.",
      detail: {
        label: "Ver a conta da bancada",
        text: "Em série: \\(R_{eq} = 10 + 10 = 20\\ \\Omega\\), logo \\(I = \\frac{12}{20} = 0{,}6\\) A, com lâmpadas fracas e dependentes. Em paralelo: \\(R_{eq} = \\frac{10 \\cdot 10}{10 + 10} = 5\\ \\Omega\\), corrente total de \\(\\frac{12}{5} = 2{,}4\\) A e, em cada ramo, \\(\\frac{12}{10} = 1{,}2\\) A: brilho pleno e independência total.",
        speech:
          "Em série, a resistência equivalente é dez mais dez, vinte ohms, e a corrente é doze dividido por vinte, zero vírgula seis ampères, com lâmpadas fracas e dependentes. Em paralelo, a resistência equivalente é dez vezes dez dividido por vinte, cinco ohms. A corrente total é doze dividido por cinco, dois vírgula quatro ampères, e cada ramo recebe doze dividido por dez, um vírgula dois ampères: brilho pleno e independência total.",
      },
    },
  },
  {
    id: "curto-perigoso",
    mission: "Bancada 3: o fio que esquenta",
    icon: "alerta",
    title: "Curto perigoso",
    symptom: "O fio esquenta, a lâmpada nem aparece no circuito, e nada acende.",
    brief:
      "Fonte de 9 V com um fio ligado direto entre os polos (1 Ω), lâmpada de 20 Ω fora do caminho. Sem resistência relevante, a corrente dispara: essa é a bancada do perigo.",
    voltage: 9,
    lampResistance: 20,
    wireResistance: 1,
    required: { switchClosed: true, parallel: false, lampIn: true },
    diagnoses: [
      {
        id: "curto",
        icon: "certo",
        title: "Curto-circuito",
        subtitle: "Fio direto: quase zero resistência, corrente disparada",
        correct: true,
        feedback: "",
      },
      {
        id: "aberto",
        icon: "alerta",
        title: "Circuito aberto",
        subtitle: "Caminho interrompido em algum ponto",
        correct: false,
        feedback:
          "Circuito aberto significa corrente zero e fio frio. Este fio esquenta justamente porque a corrente é gigante.",
      },
      {
        id: "serie",
        icon: "embaralhar",
        title: "Lâmpadas em série",
        subtitle: "A associação errada derrubou o brilho",
        correct: false,
        feedback:
          "Não há associação nenhuma aqui: a lâmpada foi atropelada por um fio que liga polo a polo.",
      },
    ],
    verdict: {
      title: "Curto domado, bancada segura",
      text: "Colocar a lâmpada de 20 Ω no caminho derrubou a corrente de 9 A para 0,45 A: vinte vezes menos. Curto-circuito é o fio direto entre os polos. Quase sem resistência, a corrente explode e o calor vem junto. É assim que incêndio elétrico começa.",
      detail: {
        label: "Ver a conta da bancada",
        text: "Fio direto: \\(I = \\frac{U}{R_{fio}} = \\frac{9}{1} = 9\\) A, corrente de tormenta num fio fino, com calor garantido. Com a lâmpada: \\(I = \\frac{9}{20} = 0{,}45\\) A. Disjuntores e fusíveis existem exatamente para sentir esse pico e cortar o caminho antes do fio derreter.",
        speech:
          "Fio direto: a corrente é nove dividido por um, nove ampères, uma corrente de tormenta num fio fino, com calor garantido. Com a lâmpada, a corrente cai para nove dividido por vinte, zero vírgula quarenta e cinco ampères. Disjuntores e fusíveis existem exatamente para sentir esse pico e cortar o caminho antes do fio derreter.",
      },
    },
  },
];
