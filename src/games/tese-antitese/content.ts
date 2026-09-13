/**
 * Tese e Antítese: conteúdo dos temas de debate.
 *
 * Estrutura: 2 teses (forte e fraca), 2 provas (forte e fraca), objeção
 * da banca com detalhe, 2 formas de responder (prova ou ataque) e
 * 3 sínteses candidatas (uma fecha o debate com honestidade).
 */

export interface DebateTheme {
  id: string;
  mission: string;
  theme: string;
  scenario: string;
  theses: {
    id: string;
    icon: string;
    title: string;
    hook: string;
    strong: boolean;
    evidence: string;
    weakReason?: string;
  }[];
  proofs: {
    id: string;
    icon: string;
    title: string;
    hook: string;
    strong: boolean;
    evidence: string;
    weakReason?: string;
  }[];
  objection: {
    title: string;
    detail: string;
    speaker: string;
  };
  responses: {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    correct: boolean;
    feedback: string;
  }[];
  syntheses: {
    id: string;
    title: string;
    subtitle: string;
    correct: boolean;
    feedback: string;
  }[];
  verdict: {
    title: string;
    text: string;
    detail: { label: string; text: string };
  };
}

export const THEMES: DebateTheme[] = [
  {
    id: "celular-intervalo",
    mission: "Debate: celular no intervalo",
    theme: "Celular no intervalo: liberar ou restringir?",
    scenario:
      "O grêmio levou ao debate da semana a pergunta que divide a escola inteira. A banca adversária está afiada, e você abre a defesa.",
    theses: [
      {
        id: "regras",
        icon: "certo",
        title: "Liberar com regras",
        hook: "Zonas sem tela + pesquisa liberada",
        strong: true,
        evidence:
          "Tese com recorte claro: liberar o uso no pátio para pesquisa rápida e garantir zonas sem tela (biblioteca e sala de leitura). Uma regra específica é defendível; “legalizar tudo” não.",
      },
      {
        id: "gosto",
        icon: "conversa",
        title: "Celular é legal",
        hook: "Gosto pessoal, sem recorte",
        strong: false,
        evidence: "Opinião pura, sem regra, sem recorte, sem prova.",
        weakReason:
          "“É legal” é gosto, não tese. Uma tese precisa dizer O QUE se defende e e COM que regra; opinião não segura banca nenhuma.",
      },
    ],
    proofs: [
      {
        id: "enquete",
        icon: "elo",
        title: "Enquete da turma",
        hook: "180 respostas, datadas",
        strong: true,
        evidence:
          "Enquete aplicada em outubro com 180 respostas de cinco turmas: 68% preferem regra clara com zonas de silêncio. Fonte, número e data: prova que sustenta pergunta dura.",
      },
      {
        id: "relato",
        icon: "busca",
        title: "Relato sem fonte",
        hook: "“Alguém disse por aí”",
        strong: false,
        evidence: "Relato vago, sem fonte nem data.",
        weakReason:
          "“Todo mundo acha” não é prova: sem número, sem data e sem fonte, a banca desmonta o argumento em uma réplica.",
      },
    ],
    objection: {
      title: "Liberar celular amplia o cyberbullying",
      detail:
        "A banca adversária apresenta os registros da coordenação pedagógica do ano passado: 14 ocorrências envolvendo telas no horário de aula. O risco é real e documentado.",
      speaker: "Banca adversária · Escola Irma",
    },
    responses: [
      {
        id: "prova",
        icon: "escudo",
        title: "Responder com a prova",
        subtitle: "Zonas sem tela + dados da enquete",
        correct: true,
        feedback: "",
      },
      {
        id: "ataque",
        icon: "alerta",
        title: "Atacar a pessoa",
        subtitle: "Desqualificar quem discorda",
        correct: false,
        feedback:
          "Ataque pessoal é a pior jogada de um debate: a plateia percebe, a banca aproveita e sua tese fica órfã. Volte à prova.",
      },
    ],
    syntheses: [
      {
        id: "sintese",
        title: "Regras respondem ao risco",
        subtitle: "Zonas sem tela + enquete + monitoramento das ocorrências",
        correct: true,
        feedback: "",
      },
      {
        id: "rendicao",
        title: "Concordar com tudo",
        subtitle: "Abandonar a tese para evitar conflito",
        correct: false,
        feedback:
          "Abandonar a tese joga fora a enquete e a regra proposta: síntese integra a objeção, não se rende a ela.",
      },
      {
        id: "teimosia",
        title: "Repetir a tese",
        subtitle: "Ignorar a objeção e recitar o placar",
        correct: false,
        feedback:
          "Repetir a tese sem responder à objeção mostra que você não ouviu a banca; a síntese costura os dois lados.",
      },
    ],
    verdict: {
      title: "Debate vencido com honestidade",
      text: "Você integrou a objeção em vez de negá-la: regra de zonas sem tela + monitoramento das ocorrências + prova datada da enquete. A plateia viu alguém que ouve, responde e fecha: o perfil que as bancas respeitam.",
      detail: {
        label: "Ver a anatomia do argumento",
        text: "TESE (recortada): liberar com regras. PROVA (verificável): enquete de 180 respostas. RESPOSTA À OBJEÇÃO: o risco existe, e por isso as zonas sem tela e o monitoramento. SÍNTESE: a regra responde ao risco com dados. Tese forte + prova forte + objeção acolhida = argumento de campeão.",
      },
    },
  },
  {
    id: "verba-festa",
    mission: "Debate: a verba da festa junina",
    theme: "Para onde vai a verba da festa: só festa, ou festa + laboratório?",
    scenario:
      "A diretoria liberou uma verba inédita e o conselho estudantil abre a palavra à escola. Cada centavo tem dono, e cada argumento, um preço.",
    theses: [
      {
        id: "divisao",
        icon: "certo",
        title: "30% ao laboratório",
        hook: "Festa mantém a tradição, ciência ganha chancela",
        strong: true,
        evidence:
          "Tese com número e destino: manter 70% da verba na festa (tradição preservada) e destinar 30% ao laboratório de ciências. Divisão clara é divisão defendível.",
      },
      {
        id: "festa",
        icon: "conversa",
        title: "Festa é boa demais",
        hook: "Gosto pessoal, sem número",
        strong: false,
        evidence: "Opinião sem número nem destino para a verba.",
        weakReason:
          "“É boa demais” não diz para onde vai o dinheiro: sem número, a banca pergunta o óbvio: quanto, para quê?",
      },
    ],
    proofs: [
      {
        id: "planilha",
        icon: "elo",
        title: "Planilha de custos aberta",
        hook: "Valores por item, na mesa",
        strong: true,
        evidence:
          "Planilha do tesoureiro com custos por item: som, decoração e barracas somam R$ 11 mil; o laboratório lista os equipamentos faltantes com preços de três fornecedores. Números abertos são à prova de vaia.",
      },
      {
        id: "achismo",
        icon: "busca",
        title: "Opinião sem número",
        hook: "“Todo mundo concorda”",
        strong: false,
        evidence: "Frase de corredor, sem planilha nem fonte.",
        weakReason:
          "Sem número não há debate financeiro: a planilha existe e está aberta; use-a ou a banca usará contra você.",
      },
    ],
    objection: {
      title: "A festa sustenta a cultura (e a arrecadação) da escola",
      detail:
        "A banca lembra que a quadrilha leva três turmas de ensaio, que a comunidade espera a festa há um ano e que a arrecadação do ano passado pagou os uniformes do time. Cortar a festa custa cultura, e moral.",
      speaker: "Banca adversária · Escola Irma",
    },
    responses: [
      {
        id: "prova",
        icon: "escudo",
        title: "Responder com a planilha",
        subtitle: "70% mantém a festa inteira",
        correct: true,
        feedback: "",
      },
      {
        id: "ataque",
        icon: "alerta",
        title: "Chamar a banca de ultrapassada",
        subtitle: "Desqualificar quem discorda",
        correct: false,
        feedback:
          "Chamou a banca de ultrapassada? Você trocou a planilha por uma briga, e quem briga perde. Responda com o número.",
      },
    ],
    syntheses: [
      {
        id: "sintese",
        title: "70/30 com números abertos",
        subtitle: "Festa inteira preservada + laboratório equipado",
        correct: true,
        feedback: "",
      },
      {
        id: "rendicao",
        title: "Cancelar o laboratório",
        subtitle: "Render à tradição e encerrar",
        correct: false,
        feedback:
          "Render-se joga fora a tese e a planilha: a proposta nunca foi acabar com a festa, foi dividir com número na mão.",
      },
      {
        id: "teimosia",
        title: "“Laboratório e só”",
        subtitle: "Ignorar o valor cultural da festa",
        correct: false,
        feedback:
          "Ignorar a tradição que a banca defendeu é não ouvir: a síntese mostra que os 70% preservam exatamente essa cultura.",
      },
    ],
    verdict: {
      title: "Conselho convencido pela divisão",
      text: "A divisão 70/30 venceu porque respeitou os dois lados com número na mão: a festa inteira preservada, o laboratório equipado e a planilha aberta para qualquer conselheiro conferir. Argumento com número vence opinião com entusiasmo.",
      detail: {
        label: "Ver a anatomia do argumento",
        text: "TESE: dividir 70/30. PROVA: planilha aberta (custos + cotações). RESPOSTA À OBJEÇÃO: a festa fica inteira com 70%. SÍNTESE: tradição mantida + ciência equipada, tudo auditável. Divisões claras transformam conflito em decisão.",
      },
    },
  },
  {
    id: "passe-prova",
    mission: "Debate: passe livre em dia de prova",
    theme: "Passe livre: para todos os dias, ou só em dia de prova?",
    scenario:
      "A prefeitura abriu consulta pública sobre o passe livre estudantil. A pergunta que decide a audiência pública: qual o recorte justo do benefício?",
    theses: [
      {
        id: "recorte",
        icon: "certo",
        title: "Passe livre em dia de prova",
        hook: "Só quando a presença decide",
        strong: true,
        evidence:
          "Tese com recorte mensurável: garantir a passagem nos dias de avaliação, quando a ausência custa nota e a evasão começa. Recorte justo é recorte que dá para auditar.",
      },
      {
        id: "onibus",
        icon: "conversa",
        title: "Ônibus é bom",
        hook: "Gosto pessoal, sem recorte",
        strong: false,
        evidence: "Frase de simpatia ao transporte, sem proposta.",
        weakReason:
          "“Ônibus é bom” é elogio, não tese: sem recorte, sem dia, sem regra; a audiência pública precisa de proposta, não de elogio.",
      },
    ],
    proofs: [
      {
        id: "abstencao",
        icon: "elo",
        title: "Dados de abstenção",
        hook: "Faltas por transporte em dia de prova",
        strong: true,
        evidence:
          "Levantamento da secretaria: nas últimas três avaliações, 11% das faltas tiveram transporte como causa declarada: o dobro das faltas em dia comum. Dado oficial, datado, assinado.",
      },
      {
        id: "boato",
        icon: "busca",
        title: "Conversa de corredor",
        hook: "“Meu primo perdeu a prova”",
        strong: false,
        evidence: "Relato isolado, sem fonte nem número.",
        weakReason:
          "O primo existe, mas um caso não é um dado: a audiência pública decide com estatística, não com parente.",
      },
    ],
    objection: {
      title: "O custo para a prefeitura é real",
      detail:
        "O secretário apresenta a conta: passe amplo custaria R$ 40 milhões por ano, cortando verba de manutenção das próprias linhas que os alunos usam. Benefício sem fonte de financiamento vira promessa furada.",
      speaker: "Secretaria de Mobilidade",
    },
    responses: [
      {
        id: "prova",
        icon: "escudo",
        title: "Responder com o recorte",
        subtitle: "Só dias de exame = custo proporcional",
        correct: true,
        feedback: "",
      },
      {
        id: "ataque",
        icon: "alerta",
        title: "Acusar o secretário de má fé",
        subtitle: "Desqualificar quem discorda",
        correct: false,
        feedback:
          "Acusar má fé sem prova transformou você no problema da sala. A pergunta é de recorte e custo: responda com o dado.",
      },
    ],
    syntheses: [
      {
        id: "sintese",
        title: "Recorte por exame + dado oficial",
        subtitle: "Custo pequeno, evasão combatida",
        correct: true,
        feedback: "",
      },
      {
        id: "rendicao",
        title: "Aceitar adiar indefinidamente",
        subtitle: "“Talvez ano que vem…”",
        correct: false,
        feedback:
          "Adiar joga fora o dado de abstenção que você mesmo apresentou: síntese propõe, não empurra.",
      },
      {
        id: "teimosia",
        title: "Passe amplo e imediato",
        subtitle: "Ignorar o custo apresentado",
        correct: false,
        feedback:
          "Ignorar os R$ 40 milhões é fingir que a objeção não existia: o recorte por dia de prova existe exatamente para caber no orçamento.",
      },
    ],
    verdict: {
      title: "Audiência pública convencida",
      text: "O recorte por dia de prova venceu o debate porque respondeu à conta do secretário: benefício barato, alvo exato (11% das faltas por transporte) e dado oficial na mesa. Quem recorta com precisão paga menos e protege mais.",
      detail: {
        label: "Ver a anatomia do argumento",
        text: "TESE: passe em dia de prova. PROVA: 11% das faltas por transporte (dado oficial). RESPOSTA À OBJEÇÃO: recorte reduz o custo para caber no orçamento. SÍNTESE: menor custo, evasão combatida onde dói. Recorte bom é tese que cabe na verba.",
      },
    },
  },
];
