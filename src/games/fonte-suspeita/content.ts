/**
 * Fonte Suspeita — conteúdo dos 3 casos (reescrita profunda).
 *
 * Cada caso traz: o boato como ele chega (contexto), 3 cartas de evidência
 * (autoria, tempo, prova), uma pergunta de cruzamento com dica pedagógica,
 * e uma decisão editorial com consequências reais.
 */

export interface FonteSuspeitaCase {
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

export const CASES: FonteSuspeitaCase[] = [
  {
    id: "bolsa-cortada",
    mission: "O boato das bolsas",
    context: {
      channel: "Canal do Grêmio · mensagem da manhã",
      meta: "encaminhada 14 vezes",
      message:
        "🚨 URGENTE: TODAS as bolsas do programa foram CORTADAS. Repasse para todo mundo ANTES QUE APAGUEM!!",
      annotation:
        "A mensagem chegou sem autor, sem link e com uma foto anexada.",
    },
    cards: [
      {
        icon: "usuario",
        category: "Autoria",
        hook: "Conta nova, sem rosto",
        evidence:
          "A conta que lançou o pânico tem seis dias de vida. Sem nome real, sem foto, sem histórico — publicou só essa notícia e nunca mais postou nada.",
      },
      {
        icon: "calendario",
        category: "Tempo",
        hook: "Foto velha como nova",
        evidence:
          "A foto anexada é real… e é de 2019. Sete anos antes do suposto corte, numa fila de outra escola. Reaproveitada para parecer atual.",
      },
      {
        icon: "elo",
        category: "Prova",
        hook: "Nenhum documento",
        evidence:
          "Nenhum decreto, nenhum link oficial, nenhum número de portaria. A única fonte citada é a expressão “fontes confiáveis”.",
      },
    ],
    crossQuestion:
      "As três cartas estão viradas. Qual evidência derruba a notícia de vez?",
    crossOptions: [
      {
        icon: "busca",
        title: "Autoria anônima",
        subtitle: "Conta sem nome e sem histórico",
      },
      {
        icon: "calendario",
        title: "Foto de 2019",
        subtitle: "Imagem velha reaproveitada",
      },
      {
        icon: "elo",
        title: "Falta de decreto",
        subtitle: "Nenhum documento oficial existe",
      },
    ],
    crossCorrect: 2,
    crossHint:
      "Todas as pistas são ruins — mas qual delas, sozinha, já derruba a matéria? Sem documento público, não existe notícia de corte.",
    crossWrong: [
      "A autoria anônima é suspeita, mas uma fonte nova pode, um dia, confirmar o que diz. O que falta aqui é documento.",
      "A foto de 2019 é grave — mas notícia pode trocar de foto e continuar. O corte em si é o que não tem sustentação.",
    ],
    decisionPrompt: "Agora a decisão é sua, editoria do canal:",
    decisions: [
      {
        id: "publicar",
        icon: "compartilhar",
        title: "Publicar agora",
        subtitle: "Alcance na hora · risco na hora",
      },
      {
        id: "segurar",
        icon: "escudo",
        title: "Segurar e checar",
        subtitle: "Nada sobe sem fonte confirmada",
      },
      {
        id: "alerta",
        icon: "alerta",
        title: "Publicar com alerta",
        subtitle: "Divulga marcando “não confirmado”",
      },
    ],
    expected: "segurar",
    verdict: {
      title: "Notícia retida — e o canal agradece",
      text: "Sem autoria confiável e sem nenhum documento, a notícia não tinha onde ficar de pé. Ao segurar o post, o canal protegeu a escola de um susto coletivo — e manteve a própria credibilidade para quando a notícia for de verdade.",
      detail: {
        label: "Ver o bastidor da checagem",
        text: "Conta com seis dias de vida, foto de 2019 de outra escola e zero documentos oficiais: esse é o manual completo da desinformação. Uma hora depois, o grêmio confirmou com a secretaria: as bolsas continuavam normais.",
      },
    },
  },
  {
    id: "agua-da-escola",
    mission: "O susto da água",
    context: {
      channel: "Grupo da turma · 7h12 da manhã",
      meta: "“encaminha pra todos os grupos!!”",
      message:
        "NÃO BEBAM A ÁGUA DA ESCOLA HOJE. A caixa d’água está CONTAMINADA. Vídeo dentro. 😱",
      annotation: "O vídeo mostra uma água escura saindo de uma torneira.",
    },
    cards: [
      {
        icon: "usuario",
        category: "Autoria",
        hook: "Perfil de humor",
        evidence:
          "Quem postou primeiro foi um perfil de piadas com 12 mil seguidores. Em três anos, nunca publicou uma única notícia — só memes.",
      },
      {
        icon: "calendario",
        category: "Tempo",
        hook: "Vídeo de outra época",
        evidence:
          "O vídeo é de 2021 e foi gravado em outra cidade: o uniforme dos alunos que passa no fundo não é o daqui.",
      },
      {
        icon: "elo",
        category: "Prova",
        hook: "Laudo oficial de hoje",
        evidence:
          "A prefeitura publicou hoje o laudo da água da escola, em PDF, com data e assinatura do laboratório: dentro do padrão de potabilidade.",
      },
    ],
    crossQuestion: "Qual evidência deve pesar mais na decisão?",
    crossOptions: [
      {
        icon: "busca",
        title: "Perfil de piadas",
        subtitle: "Grande alcance, zero jornalismo",
      },
      {
        icon: "calendario",
        title: "Vídeo de 2021",
        subtitle: "Outra cidade, outra escola",
      },
      {
        icon: "elo",
        title: "Laudo de hoje",
        subtitle: "PDF oficial, assinado, desta escola",
      },
    ],
    crossCorrect: 2,
    crossHint:
      "Qual das três fontes qualquer pessoa pode verificar sozinha, com data, assinatura e número de protocolo?",
    crossWrong: [
      "O perfil de piadas alcança muita gente — mas alcance não é credibilidade. Procure o documento que pode ser verificado.",
      "O vídeo antigo desmente o susto, mas sozinho não garante que a água de hoje está boa. Falta a prova positiva.",
    ],
    decisionPrompt: "O boato já está correndo. O que o canal faz?",
    decisions: [
      {
        id: "publicar",
        icon: "compartilhar",
        title: "Publicar o alerta",
        subtitle: "Reforça o pânico sem contexto",
      },
      {
        id: "segurar",
        icon: "escudo",
        title: "Segurar tudo",
        subtitle: "Não posta nada sobre o assunto",
      },
      {
        id: "alerta",
        icon: "alerta",
        title: "Publicar com alerta e laudo",
        subtitle: "Desmente já com link verificável",
      },
    ],
    expected: "alerta",
    verdict: {
      title: "Pânico evitado, informação entregue",
      text: "Publicar o desmentido com o link do laudo foi a jogada certa: a escola inteira ficou informada e tranquila antes do primeiro intervalo. Silêncio deixaria o boato correr solto; gritar “contaminada!” espalharia medo sem base.",
      detail: {
        label: "Ver o bastidor da checagem",
        text: "Laudo da prefeitura em PDF, datado de hoje, com resultado “dentro do padrão”: é a diferença entre uma informação que se sustenta e um vídeo que só assusta. Desmentir rápido e com fonte é o antídoto do boato.",
      },
    },
  },
  {
    id: "vaga-relampago",
    mission: "A vaga rápida demais",
    context: {
      channel: "Direct para vários alunos · ontem à noite",
      meta: "link encurtado + timer na tela",
      message:
        "🔥 VAGA RELÂMPAGO! Auxiliar administrativo, R$ 3.500. SÓ HOJE. Taxa de inscrição de R$ 19,90 via Pix. Garanta sua vaga!",
      annotation: "O link abre um site com contagem regressiva rodando.",
    },
    cards: [
      {
        icon: "usuario",
        category: "Autoria",
        hook: "Site sem CNPJ",
        evidence:
          "O domínio “vagas-ja-99.com” foi criado há duas semanas. Sem CNPJ, sem endereço, sem telefone — só um formulário pedindo dados e Pix.",
      },
      {
        icon: "calendario",
        category: "Tempo",
        hook: "Pressão fabricada",
        evidence:
          "O contador de “4h59m” reinicia toda vez que a página é recarregada. Urgência falsa é a isca clássica para o clique sem pensamento.",
      },
      {
        icon: "elo",
        category: "Prova",
        hook: "Taxa sem edital",
        evidence:
          "Não existe edital, número de processo ou empresa nomeada. Vaga séria nunca cobra nada para inscrever — cobrar taxa já é golpe.",
      },
    ],
    crossQuestion: "O que denuncia o golpe com mais força?",
    crossOptions: [
      {
        icon: "busca",
        title: "Site estranho",
        subtitle: "Domínio novo, sem CNPJ",
      },
      {
        icon: "calendario",
        title: "Pressão de prazo",
        subtitle: "Timer falso na tela",
      },
      {
        icon: "elo",
        title: "Cobrança de taxa",
        subtitle: "R$ 19,90 antes da entrevista",
      },
    ],
    crossCorrect: 2,
    crossHint:
      "Site novo e urgência falsa são suspeitos — mas qual desses, sozinho, já configura golpe?",
    crossWrong: [
      "O site sem CNPJ é um alerta sério, mas empresas novas existem. O que nenhum processo seletivo legítimo faz é cobrar antes.",
      "A pressão do timer é manipulation pura — mas é só isca. O golpe se consuma na cobrança.",
    ],
    decisionPrompt:
      "Vários colegas já estão preenchendo o formulário. E agora?",
    decisions: [
      {
        id: "publicar",
        icon: "compartilhar",
        title: "Divulgar a vaga",
        subtitle: "Mais gente na fila do golpe",
      },
      {
        id: "segurar",
        icon: "escudo",
        title: "Segurar e denunciar",
        subtitle: "Alerta a turma e bloqueia o site",
      },
      {
        id: "alerta",
        icon: "alerta",
        title: "Publicar com ressalva",
        subtitle: "O link continua circulando",
      },
    ],
    expected: "segurar",
    verdict: {
      title: "Golpe interrompido antes do prejuízo",
      text: "Você segurou o post, avisou a turma no grupo e denunciou o site. Ninguém pagou os R$ 19,90 — e ninguém entregou CPF e dados bancários a criminosos. Vaga de verdade aparece com edital, CNPJ e processo seletivo.",
      detail: {
        label: "Ver o bastidor da checagem",
        text: "Domínio de duas semanas, contador que reinicia e taxa por Pix sem edital: o trio clássico do golpe de vaga. Denunciar no próprio canal evita que a próxima turma caia na mesma isca.",
      },
    },
  },
];
