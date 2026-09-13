/**
 * Fonte Histórica: conteúdo dos casos.
 *
 * Cada caso traz um post candidato ao mural, 3 peças documentais
 * (com autoria, data e intenção explícitas), pergunta de cruzamento
 * e decisão editorial.
 */

export interface HistoricCase {
  id: string;
  mission: string;
  context: {
    channel: string;
    meta: string;
    message: string;
    annotation: string;
  };
  cards: {
    icon: string;
    category: string;
    hook: string;
    evidence: string;
  }[];
  crossQuestion: string;
  crossOptions: { icon: string; title: string; subtitle?: string }[];
  crossCorrect: number;
  crossHint: string;
  crossWrong: string[];
  decisionPrompt: string;
  decisions: {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
  }[];
  expected: string;
  verdict: {
    title: string;
    text: string;
    detail: { label: string; text: string };
  };
}

export const CASES: HistoricCase[] = [
  {
    id: "seca-ceara",
    mission: "O post da seca",
    context: {
      channel: "Mural da escola · história do Brasil",
      meta: "agendado para publicar às 17h",
      message: "“A seca que castiga o Ceará hoje: veja a foto da tragédia acontecendo agora.”",
      annotation: "O post vem com uma foto em preto e branco anexada.",
    },
    cards: [
      {
        icon: "busca",
        category: "Peça 1 · A foto",
        hook: "Sem data, sem autor",
        evidence:
          "Fotografia em preto e branco, sem legenda, sem data e sem crédito de acervo. Pode ser qualquer seca, em qualquer década, de qualquer lugar do sertão.",
      },
      {
        icon: "historia",
        category: "Peça 2 · A legenda de acervo",
        hook: "Museu, 1911",
        evidence:
          "A mesma imagem aparece no acervo digital de um museu cearense, catalogada como “retirantes na seca, 1911”. Autor identificado, datação segura: 115 anos antes do post.",
      },
      {
        icon: "elo",
        category: "Peça 3 · O boletim",
        hook: "Órgão oficial, hoje",
        evidence:
          "Boletim hidrológico da fundação estadual, publicado nesta manhã: reservatórios da região em 62% da capacidade, situação de atenção com seca em queda, dados e assinatura técnica.",
      },
    ],
    crossQuestion: "Qual peça permite datar e verificar o fato por conta própria?",
    crossOptions: [
      { icon: "busca", title: "A foto solta", subtitle: "Sem data nem autor" },
      { icon: "historia", title: "A legenda de 1911", subtitle: "Acervo com autoria e datação" },
      { icon: "elo", title: "O boletim de hoje", subtitle: "Dado oficial atual e assinado" },
    ],
    crossCorrect: 1,
    crossHint:
      "Para DATAR a foto, o que importa é a informação sobre a própria foto, e não sobre o clima de hoje.",
    crossWrong: [
      "A foto solta é justamente o problema: sem data e sem autor, ela não prova nem desmente nada sozinha.",
      "O boletim de hoje mede o presente: ele ajuda o texto, mas não diz nada sobre quando a foto foi tirada.",
    ],
    decisionPrompt: "O que o mural publica?",
    decisions: [
      {
        id: "publicar",
        icon: "compartilhar",
        title: "Publicar direto",
        subtitle: "Foto de 1911 como se fosse de hoje",
      },
      {
        id: "checar",
        icon: "escudo",
        title: "Segurar e checar",
        subtitle: "Trocar a imagem e datar o texto",
      },
      {
        id: "alerta",
        icon: "alerta",
        title: "Publicar com contexto",
        subtitle: "Foto antiga declarada como histórica",
      },
    ],
    expected: "checar",
    verdict: {
      title: "Mural protegido do falso presente",
      text: "Segurar foi a decisão certa: uma foto de 1911 vestida de “acontecendo agora” é desinformação histórica. O post voltou para a bancada para trocar a imagem por uma atual: ou declarar a de 1911 como registro de arquivo, com data e autor no crédito.",
      detail: {
        label: "Ver o bastidor do historiador",
        text: "Toda fonte responde três perguntas: QUEM produziu, QUANDO e PARA QUÊ. A foto solta responde zero das três. A legenda do acervo responde as três e revela que o post queria emprestar a dramaticidade de 1911 à seca de hoje. Dramatizar com fonte mal datada é a receita clássica do falso histórico.",
      },
    },
  },
  {
    id: "auxilio-cancelado",
    mission: "O post do auxílio",
    context: {
      channel: "Grupo da escola · 12h40",
      meta: "encaminhado 31 vezes em 20 minutos",
      message:
        "“URGENTE: auxílio-transporte dos alunos CANCELADO a partir de segunda. Encaminhe para todo mundo!”",
      annotation: "O post traz um print de tela sem identificação.",
    },
    cards: [
      {
        icon: "busca",
        category: "Peça 1 · O print",
        hook: "Sem autor, sem número",
        evidence:
          "Print de uma suposta notícia: sem veículo, sem data, sem URL, sem número de portaria. Texto em caixa alta com três pontos de exclamação: o uniforme típico do pânico.",
      },
      {
        icon: "documento",
        category: "Peça 2 · A portaria",
        hook: "Número, data e texto integral",
        evidence:
          "Portaria nº 47/2026 da secretaria, publicada no Diário Oficial de ontem: reajusta o valor do auxílio em 6% e mantém o pagamento. Número rastreável, texto integral disponível, assinatura identificada.",
      },
      {
        icon: "conversa",
        category: "Peça 3 · O áudio",
        hook: "“Me disseram que…”",
        evidence:
          "Áudio de 40 segundos encaminhado no grupo: uma voz diz que “me disseram que ia cancelar”. Sem fonte, sem nome, sem responsável: cadeia de rumor clássica.",
      },
    ],
    crossQuestion: "Qual peça tem lastro documental rastreável?",
    crossOptions: [
      { icon: "busca", title: "O print", subtitle: "Notícia sem veículo nem data" },
      {
        icon: "documento",
        title: "A portaria nº 47",
        subtitle: "Diário Oficial, número e assinatura",
      },
      { icon: "conversa", title: "O áudio", subtitle: "“Me disseram que…”" },
    ],
    crossCorrect: 1,
    crossHint:
      "Lastro é o que pode ser CONFERIDO por qualquer pessoa: número de documento, data de publicação e assinatura responsável.",
    crossWrong: [
      "O print não revela nem de onde veio: sem veículo e sem data, é um bilhete anônimo disfarçado de notícia.",
      "O áudio é a definição de rumor em estado puro: “me disseram” não é fonte, é vizinho de fila.",
    ],
    decisionPrompt: "O pânico já começou nos grupos. O mural decide:",
    decisions: [
      {
        id: "publicar",
        icon: "compartilhar",
        title: "Publicar o aviso de cancelamento",
        subtitle: "Espalha o alarme falso",
      },
      {
        id: "checar",
        icon: "escudo",
        title: "Segurar e checar",
        subtitle: "Conferir a portaria e corrigir o grupo",
      },
      {
        id: "alerta",
        icon: "alerta",
        title: "Publicar com alerta",
        subtitle: "Avisar que “há rumores” sem confirmar nada",
      },
    ],
    expected: "checar",
    verdict: {
      title: "Rumor cortado no talo",
      text: "Você segurou o post, abriu a portaria nº 47 no Diário Oficial e corrigiu o grupo: o auxílio não só continua: foi reajustado em 6%. Um número rastreável vale mais que mil “me disseram”.",
      detail: {
        label: "Ver o bastidor do historiador",
        text: "Documento oficial público é o padrão-ouro do lastro: qualquer um pode conferir, a qualquer momento, sem depender de intermediário. Quando um boato e uma portaria brigam, a portaria ganha; e o trabalho da fonte é justamente encontrar essa briga antes de publicar.",
      },
    },
  },
  {
    id: "usina-xingu",
    mission: "O post da usina",
    context: {
      channel: "Mural da escola · meio ambiente",
      meta: "peça de debate sobre energia",
      message: "“A usina do Xingu não afetou ninguém: veja o vídeo oficial da empresa.”",
      annotation: "O vídeo tem produção impecável, com drones, trilha e narração calma.",
    },
    cards: [
      {
        icon: "fabrica",
        category: "Peça 1 · O vídeo da empresa",
        hook: "Interesse na própria causa",
        evidence:
          "Vídeo institucional produzido pela construtora: imagens aéreas, famílias sorrindo em casas novas e zero dados sobre territórios alagados. Quem financia a câmera escolhe o enquadramento.",
      },
      {
        icon: "usuarios",
        category: "Peça 2 · O depoimento",
        hook: "Voz de quem mora lá",
        evidence:
          "Depoimento gravado no local, com localidade e data explícitas: uma liderança ribeirinha relata a cheia que sumiu com a pesca do vilarejo e lista famílias realocadas. Fonte primária com rosto, lugar e data.",
      },
      {
        icon: "mapa",
        category: "Peça 3 · O relatório",
        hook: "Mapa com áreas afetadas",
        evidence:
          "Relatório do órgão ambiental com mapa do complexo: trechos de rio interligados e áreas de reserva com impacto estimado. Dado técnico de quem não vende energia nem assina o abaixo-assinado.",
      },
    ],
    crossQuestion: "Qual peça traz o outro lado que o vídeo oficial omite?",
    crossOptions: [
      {
        icon: "fabrica",
        title: "O vídeo da empresa",
        subtitle: "Produção própria, interesse próprio",
      },
      {
        icon: "usuarios",
        title: "O depoimento ribeirinho",
        subtitle: "Fonte primária com local e data",
      },
      { icon: "mapa", title: "O relatório com mapa", subtitle: "Dado técnico independente" },
    ],
    crossCorrect: 1,
    crossHint: "“Outro lado” é a voz diretamente atingida: quem mora onde a água mudou de lugar.",
    crossWrong: [
      "O vídeo da empresa é exatamente o lado ÚNICO que já está no post: falta quem vive o outro lado da barragem.",
      "O relatório técnico é peça valiosa, mas voz afetada é diferente de laudo: o depoimento é quem sente o impacto na pele.",
    ],
    decisionPrompt: "O mural quer uma peça honesta sobre a usina. Você decide:",
    decisions: [
      {
        id: "publicar",
        icon: "compartilhar",
        title: "Publicar só o vídeo oficial",
        subtitle: "Um lado, produção caprichada",
      },
      {
        id: "checar",
        icon: "escudo",
        title: "Segurar e esperar mais fontes",
        subtitle: "Nada sobe sem o outro lado",
      },
      {
        id: "alerta",
        icon: "alerta",
        title: "Publicar com os dois lados",
        subtitle: "Vídeo + depoimento + relatório no mesmo post",
      },
    ],
    expected: "alerta",
    verdict: {
      title: "Os dois lados no mesmo mural",
      text: "Publicar vídeo + depoimento + relatório transformou propaganda em debate honesto: a escola viu a versão da empresa E a voz de quem vive o rio. Um lado só é cartão de visita; dois lados é jornalismo.",
      detail: {
        label: "Ver o bastidor do historiador",
        text: "Toda fonte tem intenção: a empresa quer vender, o ribeirinho quer ser ouvido, o órgão quer regular. O método histórico não pergunta “quem está certo?”, pergunta “quem fala, de onde e por quê?”. Quando as versões não fecham, o mural ganha debate em vez de cartão de visita.",
      },
    },
  },
];
