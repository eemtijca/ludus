/**
 * catálogo de jogos — fonte única de verdade sobre os 12 jogos.
 * Cada entrada alimenta o hub, o shell do jogo, o painel de progresso
 * e o modo professor (códigos BNCC e habilidades).
 */

export type AreaId = "linguagens" | "matematica" | "natureza" | "humanas";

export type Level = 1 | 2 | 3;

export interface AreaMeta {
  id: AreaId;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  colorDark: string;
  colorSoft: string;
  description: string;
}

export interface GameMeta {
  id: string;
  title: string;
  tagline: string;
  description: string;
  area: AreaId;
  level: Level;
  bncc: string[];
  tags: string[];
  icon: string;
  minutes: number;
  skills: string[];
  objective: string;
}

export const AREAS: Record<AreaId, AreaMeta> = {
  linguagens: {
    id: "linguagens",
    name: "Linguagens e suas Tecnologias",
    shortName: "Linguagens",
    icon: "BookOpenText",
    color: "#a560e8",
    colorDark: "#8941d4",
    colorSoft: "#f3e9fd",
    description:
      "Língua portuguesa, mídia, argumentação e os textos que circulam na escola.",
  },
  matematica: {
    id: "matematica",
    name: "Matemática e suas Tecnologias",
    shortName: "Matemática",
    icon: "Calculator",
    color: "#14b8a6",
    colorDark: "#0d9488",
    colorSoft: "#e0f7f4",
    description:
      "Funções, probabilidade e as finanças da vida real — com simuladores vivos.",
  },
  natureza: {
    id: "natureza",
    name: "Ciências da Natureza e suas Tecnologias",
    shortName: "Natureza",
    icon: "FlaskConical",
    color: "#10b981",
    colorDark: "#0b8a61",
    colorSoft: "#e0f8ee",
    description:
      "Física, química e biologia em bancadas de experimento seguras e visíveis.",
  },
  humanas: {
    id: "humanas",
    name: "Ciências Humanas e Sociais Aplicadas",
    shortName: "Humanas",
    icon: "Globe2",
    color: "#ff9600",
    colorDark: "#db7e00",
    colorSoft: "#fff1da",
    description:
      "História, geografia, filosofia e as decisões que moldam a vida em comunidade.",
  },
};

export const AREA_ORDER: AreaId[] = [
  "linguagens",
  "matematica",
  "natureza",
  "humanas",
];

export const LEVEL_LABEL: Record<Level, string> = {
  1: "Nível 1 · Descoberta",
  2: "Nível 2 · Análise",
  3: "Nível 3 · Domínio",
};

export const GAMES: GameMeta[] = [
  // ---------------------------------------------------------------- Linguagens
  {
    id: "fonte-suspeita",
    title: "Fonte Suspeita",
    tagline: "Uma notícia bomba caiu no canal do grêmio. Segura ou espalha?",
    description:
      "Três cartas de evidência — autoria, tempo e prova — esperam ser viradas antes de qualquer publicação. Investigue o boato, cruze as pistas e decida o que fazer com o mural da escola.",
    area: "linguagens",
    level: 1,
    bncc: ["EM13LGG102"],
    tags: ["Língua Portuguesa", "Mídia", "Checagem"],
    icon: "Newspaper",
    minutes: 8,
    skills: [
      "Avaliar a intenção e a credibilidade da fonte",
      "Cruzar autoria, data e prova antes de compartilhar",
      "Decidir com responsabilidade em canais reais",
    ],
    objective:
      "Exercitar a checagem de informação em casos de desinformação escolar.",
  },
  {
    id: "revisor-critico",
    title: "Revisor Crítico",
    tagline: "O jornal da escola fecha hoje. O rascunho ainda engasga.",
    description:
      "Trechos com conectivos perdidos, registro errado e repetições. Leia com calma, encontre o reparo certo e publique a versão final no mural — com coesão e registro adequados.",
    area: "linguagens",
    level: 2,
    bncc: ["EM13LGG104"],
    tags: ["Língua Portuguesa", "Revisão", "Coesão"],
    icon: "PenLine",
    minutes: 8,
    skills: [
      "Identificar falhas de coesão e de registro",
      "Escolher o reparo que preserva o sentido",
      "Publicar texto revisado com clareza",
    ],
    objective:
      "Revisar textos verificando coesão, coerência e adequação ao registro formal.",
  },
  {
    id: "tese-antitese",
    title: "Tese e Antítese",
    tagline: "O clube de debate abre as portas. Monte o caso e vença.",
    description:
      "Escolha a tese que sustenta, anexe a prova que convence, responda à objeção sem atacar ninguém e feche a síntese. Um simulador de argumentação em três atos.",
    area: "linguagens",
    level: 3,
    bncc: ["EM13LGG303"],
    tags: ["Língua Portuguesa", "Argumentação", "Debate"],
    icon: "Scale",
    minutes: 10,
    skills: [
      "Distinguir tese forte de opinião fraca",
      "Selecionar prova com fonte e número",
      "Responder objeções com argumento, não com ataque",
    ],
    objective:
      "Estruturar argumentação sólida: tese, prova, resposta à objeção e síntese.",
  },
  // --------------------------------------------------------------- Matemática
  {
    id: "orcamento-limite",
    title: "Orçamento no Limite",
    tagline: "O balcão da loja sorri. A planilha não.",
    description:
      "Parcelar ou guardar? Mexa na taxa e no prazo, veja os juros compostos crescerem ao vivo e decida no caixa sem estourar o limite de 30% da renda.",
    area: "matematica",
    level: 1,
    bncc: ["EM13MAT303"],
    tags: ["Educação financeira", "Juros", "Porcentagem"],
    icon: "Wallet",
    minutes: 10,
    skills: [
      "Calcular juros compostos em compras parceladas",
      "Comparar parcela com o limite orçamentário",
      "Escolher entre parcelar e guardar com critério",
    ],
    objective:
      "Modelar juros compostos e decidir compras dentro de um orçamento seguro.",
  },
  {
    id: "funcao-viva",
    title: "Função Viva",
    tagline: "Toda reta conta uma história. Toda curva esconde um topo.",
    description:
      "Escolha entre a reta das entregas e a parábola da cantina, mova os controles, veja o gráfico respirar e cace o zero e o ponto de máximo como um detetive de coordenadas.",
    area: "matematica",
    level: 2,
    bncc: ["EM13MAT302"],
    tags: ["Funções", "Gráficos", "Modelagem"],
    icon: "TrendingUp",
    minutes: 10,
    skills: [
      "Interpretar função linear e quadrática em contexto",
      "Ler zero e vértice no gráfico ao vivo",
      "Relacionar tabela, expressão e curva",
    ],
    objective:
      "Explorar comportamento de funções do 1º e 2º grau com simulador interativo.",
  },
  {
    id: "risco-provavel",
    title: "Risco Provável",
    tagline: "A urna da rifa espera. A sorte, não; a matemática.",
    description:
      "Monte a urna com as bolas, escolha repor ou não, puxe a alavanca e compare o que a teoria manda com o que o acaso faz. No fim, decida se a rifa é justa.",
    area: "matematica",
    level: 3,
    bncc: ["EM13MAT312"],
    tags: ["Probabilidade", "Simulação", "Estatística"],
    icon: "Dices",
    minutes: 12,
    skills: [
      "Calcular probabilidade com e sem reposição",
      "Comparar frequência teórica e simulada",
      "Avaliar justiça em jogos de azar",
    ],
    objective:
      "Confrontar cálculo probabilístico com simulação de sorteios em urna.",
  },
  // ----------------------------------------------------------------- Natureza
  {
    id: "circuito-falhou",
    title: "O Circuito Falhou",
    tagline: "A bancada aponta o defeito. Você aponta a solução.",
    description:
      "Celular que não carrega, quarto que apaga inteiro, curto que esquenta o fio. Monte a bancada, acione chave e lâmpada, meça a corrente e explique cada defeito.",
    area: "natureza",
    level: 1,
    bncc: ["EM13CNT306"],
    tags: ["Física", "Circuitos", "Medição"],
    icon: "Zap",
    minutes: 8,
    skills: [
      "Prever comportamento de circuitos série e paralelo",
      "Ler corrente com a Lei de Ohm",
      "Explicar defeitos com evidência medida",
    ],
    objective:
      "Diagnosticar falhas em circuitos elétricos manipulando uma bancada virtual.",
  },
  {
    id: "reacao-equilibrada",
    title: "Reação Equilibrada",
    tagline: "A balança dos átomos não mente. Equilibre-a.",
    description:
      "Água, gás de cozinha e o etano do motor: três receitas químicas com números a ajustar. Conte os átomos de cada lado, iguale os coeficientes e feche a reação sem sobras.",
    area: "natureza",
    level: 2,
    bncc: ["EM13CNT104"],
    tags: ["Química", "Estequiometria", "Balanceamento"],
    icon: "FlaskConical",
    minutes: 10,
    skills: [
      "Contar átomos em reagentes e produtos",
      "Ajustar coeficientes até a balança fechar",
      "Aplicar a conservação da massa",
    ],
    objective: "Balancear equações químicas validando a conservação de átomos.",
  },
  {
    id: "gene-dilema",
    title: "Dilema do Gene",
    tagline: "O quintal tem coelhos. O ambiente tem planos.",
    description:
      "Escolha sol ou neve, lobo ou comida dura, e avance as gerações. Veja a frequência dos pelos mudar — não por vontade dos coelhos, mas por seleção do ambiente.",
    area: "natureza",
    level: 3,
    bncc: ["EM13CNT205"],
    tags: ["Biologia", "Genética", "Evolução"],
    icon: "Dna",
    minutes: 12,
    skills: [
      "Prever proporções em cruzamento Aa × aa",
      "Observar seleção natural agindo nas gerações",
      "Explicar mudança de frequência sem teleologia",
    ],
    objective:
      "Simular herança dominante e seleção natural em populações de coelhos.",
  },
  // ----------------------------------------------------------------- Humanas
  {
    id: "fonte-historica",
    title: "Fonte Histórica",
    tagline: "O mural da escola quer um post. A história pede método.",
    description:
      "Fotos de 1911, portarias com número, depoimentos ribeirinhos. Vire as peças, cruze data e autor, e decida o que sobe no mural — com lastro documental.",
    area: "humanas",
    level: 1,
    bncc: ["EM13CHS101"],
    tags: ["História", "Fontes", "Método"],
    icon: "ScrollText",
    minutes: 8,
    skills: [
      "Classificar fontes por data, autor e intenção",
      "Cruzar versões de um mesmo fato",
      "Decidir publicação com lastro documental",
    ],
    objective:
      "Aplicar crítica de fontes históricas em decisões de publicação escolar.",
  },
  {
    id: "territorio-disputa",
    title: "Território em Disputa",
    tagline: "Seis lotes, três projetos e uma chuva de março a caminho.",
    description:
      "Praça, galpão ou campo: aloque os projetos no mapa do bairro e deixe a chuva testar suas escolhas. Onde a água entra, o erro aparece — e a cidade aprende.",
    area: "humanas",
    level: 2,
    bncc: ["EM13CHS206"],
    tags: ["Geografia", "Território", "Planejamento"],
    icon: "Map",
    minutes: 10,
    skills: [
      "Relacionar relevo e uso do solo",
      "Alocar projetos respeitando riscos ambientais",
      "Justificar planejamento com evidências",
    ],
    objective:
      "Planejar o uso do território considerando áreas de risco hidrológico.",
  },
  {
    id: "dilema-etico",
    title: "Dilema Ético",
    tagline: "Uma semana, três turnos, escolhas com preço.",
    description:
      "Contrato sem folga, casa pedindo ajuda, lei limitando as horas. Viva três turnos, veja dinheiro, tempo e saúde se moverem — e descubra o custo real de cada decisão.",
    area: "humanas",
    level: 3,
    bncc: ["EM13CHS502"],
    tags: ["Filosofia", "Sociologia", "Trabalho"],
    icon: "Scale",
    minutes: 12,
    skills: [
      "Ponderar interesses em conflito (renda, saúde, lei)",
      "Antecipar consequências de escolhas",
      "Refletir sobre trabalho decente e juventude",
    ],
    objective:
      "Vivenciar dilemas éticos do mundo do trabalho acompanhando seus custos.",
  },
];

export const GAME_BY_ID: Record<string, GameMeta> = Object.fromEntries(
  GAMES.map((g) => [g.id, g]),
);

export function gamesByArea(area: AreaId): GameMeta[] {
  return GAMES.filter((g) => g.area === area);
}

export const LEVEL_ORDER: Level[] = [1, 2, 3];
