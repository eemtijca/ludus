/**
 * Revisor Crítico — conteúdo dos 3 textos (reescrita profunda).
 *
 * Cada pauta traz trechos de um rascunho real (com os problemas no texto),
 * a pergunta de reparo com alternativas, o feedback por alternativa errada
 * e a versão final publicável (antes/depois).
 */

export interface RevisorText {
  id: string;
  mission: string;
  context: {
    journal: string;
    deadline: string;
    brief: string;
  };
  /** Rascunho com trechos problemáticos marcados. */
  draft: {
    lead: string;
    segments: { text: string; note: string; problem: string }[];
  };
  cards: {
    icon: string;
    category: string;
    hook: string;
    evidence: string;
  }[];
  repairQuestion: string;
  repairOptions: { icon: string; title: string; subtitle?: string }[];
  repairCorrect: number;
  repairHint: string;
  repairWrong: string[];
  published: string;
  verdict: {
    title: string;
    text: string;
    detail: { label: string; text: string };
  };
}

export const TEXTS: RevisorText[] = [
  {
    id: "queimadas",
    mission: "O fechamento da editoria de meio ambiente",
    context: {
      journal: "Jornal Mural · Boca do Sertão",
      deadline: "Edição fecha hoje ao meio-dia",
      brief:
        "Reportagem sobre o avanço das queimadas na região, com dados do monitoramento mensal do instituto estadual.",
    },
    draft: {
      lead: "O monitoramento mensal confirma: as queimadas voltaram a crescer na região.",
      segments: [
        {
          text: "…as queimadas aumentam na região. Mas é preciso fiscalizar as áreas de risco…",
          note: "Trecho 2 · conector em conflito",
          problem:
            "O “Mas” anuncia contraste, mas a frase CONCLUI o raciocínio — o leitor engasga na virada.",
        },
        {
          text: "…Ele disse que o relatório aponta o período seco. Ele, quem?",
          note: "Trecho 3 · sujeito solto",
          problem:
            "Dois “Ele” sem antecedente claro. Quem disse? O bom texto nunca deixa o leitor adivinhando.",
        },
      ],
    },
    cards: [
      {
        icon: "documento",
        category: "Trecho 1",
        hook: "O dado que abre a matéria",
        evidence:
          "“O monitoramento mensal confirma: as queimadas voltaram a crescer na região.” Lead limpo, com fonte atribuída.",
      },
      {
        icon: "elo",
        category: "Trecho 2",
        hook: "Conector em conflito",
        evidence:
          "“…as queimadas aumentam na região. Mas é preciso fiscalizar as áreas de risco.” O “Mas” promete oposição onde há conclusão — o certo seria um conector conclusivo.",
      },
      {
        icon: "usuario",
        category: "Trecho 3",
        hook: "Sujeito sumido",
        evidence:
          "“Ele disse que o relatório aponta o período seco.” Dois “Ele” sem dono. Sem antecedente, o texto perde credibilidade.",
      },
    ],
    repairQuestion: "Qual reparo publica a matéria sem engolir o leitor?",
    repairOptions: [
      {
        icon: "caneta",
        title: "Trocar “Mas” por “Portanto”",
        subtitle: "Conector conclusivo no lugar certo",
      },
      {
        icon: "busca",
        title: "Manter o “Mas”",
        subtitle: "Contraste onde não há oposição",
      },
      {
        icon: "lista",
        title: "Apagar a frase",
        subtitle: "Sobra o dado sem conclusão",
      },
    ],
    repairCorrect: 0,
    repairHint:
      "A frase FINALIZA o raciocínio. Que conectivo sinaliza conclusão em vez de oposição?",
    repairWrong: [
      "Manter o “Mas” deixa o contraste onde existe conclusão: o leitor freia sem motivo.",
      "Apagar a frase joga fora a conclusão inteira da matéria — o problema não é o conteúdo, é o conector.",
    ],
    published:
      "“As queimadas aumentam na região. Portanto, é preciso fiscalizar as áreas de risco.” — o relatório do instituto, citado na matéria, sustenta a conclusão.",
    verdict: {
      title: "Matéria publicada com coesão",
      text: "“Portanto” costurou o raciocínio sem emendas tortas: dado → conclusão. E o sujeito sumido ganhou nome na versão final. O mural recebeu um texto que flui do começo ao fim.",
      detail: {
        label: "Ver o antes e o depois",
        text: "ANTES: “…as queimadas aumentam. Mas é preciso fiscalizar. Ele disse que o relatório aponta o período seco.” DEPOIS: “As queimadas aumentam na região. Portanto, é preciso fiscalizar as áreas de risco. O técnico do instituto confirmou que o relatório aponta o período seco.”",
      },
    },
  },
  {
    id: "intercambio",
    mission: "O fechamento da editoria de intercâmbio",
    context: {
      journal: "Jornal Mural · Boca do Sertão",
      deadline: "Edição fecha hoje ao meio-dia",
      brief:
        "Comunicado sobre o intercâmbio aprovado pela diretoria: anúncio, inscrições e vagas.",
    },
    draft: {
      lead: "A diretora anunciou ontem, em comunicado oficial, o intercâmbio aprovado para o próximo semestre.",
      segments: [
        {
          text: "…A diretora anunciou o intercâmbio. Entretanto as inscrições abrem segunda-feira…",
          note: "Trecho 2 · briga onde há soma",
          problem:
            "“Entretanto” marca oposição, mas as duas informações se SOMAM: anúncio + inscrições.",
        },
        {
          text: "…A viagem será uma viagem com muitas vagas para a viagem…",
          note: "Trecho 3 · repetição pobre",
          problem:
            "“Viagem” três vezes em nove palavras. Retomada fraca cansa o leitor e engorda o texto à toa.",
        },
      ],
    },
    cards: [
      {
        icon: "documento",
        category: "Trecho 1",
        hook: "O anúncio oficial",
        evidence:
          "“A diretora anunciou ontem, em comunicado oficial, o intercâmbio aprovado.” Informação limpa, com fonte e data.",
      },
      {
        icon: "elo",
        category: "Trecho 2",
        hook: "Conector de briga à toa",
        evidence:
          "“Entretanto as inscrições abrem segunda.” As frases somam informações — “Entretanto” inventa uma oposição que não existe.",
      },
      {
        icon: "usuario",
        category: "Trecho 3",
        hook: "Retomada engordurada",
        evidence:
          "“A viagem será uma viagem com muitas vagas para a viagem.” Três repetições da mesma palavra onde uma retomada elegante resolveria.",
      },
    ],
    repairQuestion: "Qual reparo soma as ideias em vez de brigá-las?",
    repairOptions: [
      {
        icon: "caneta",
        title: "Trocar por “Além disso”",
        subtitle: "Conector aditivo para informações que somam",
      },
      {
        icon: "busca",
        title: "Manter o “Entretanto”",
        subtitle: "Oposição onde há acréscimo",
      },
      {
        icon: "lista",
        title: "Apagar a data",
        subtitle: "Informação útil jogada fora",
      },
    ],
    repairCorrect: 0,
    repairHint:
      "Anúncio e inscrições são boas notícias na mesma direção. Qual conectivo ACRESSENTA em vez de contrariar?",
    repairWrong: [
      "Manter “Entretanto” transforma um bom comunicado em uma discussão de família.",
      "Apagar a data das inscrições destrói a função prática do texto — o problema é o conector, não a informação.",
    ],
    published:
      "“A diretora anunciou o intercâmbio. Além disso, as inscrições abrem segunda-feira, com 18 vagas para o semestre.”",
    verdict: {
      title: "Comunicado publicado sem ruído",
      text: "“Além disso” somou o anúncio às inscrições; a data sobreviveu; e as três “viagens” viraram uma só, com número de vagas. Texto enxuto lê-se em um fôlego.",
      detail: {
        label: "Ver o antes e o depois",
        text: "ANTES: “Entretanto as inscrições abrem segunda. A viagem será uma viagem com muitas vagas para a viagem.” DEPOIS: “Além disso, as inscrições abrem segunda-feira, com 18 vagas para o semestre.”",
      },
    },
  },
  {
    id: "relatorio",
    mission: "O fechamento da editoria de ciências",
    context: {
      journal: "Jornal Mural · Boca do Sertão",
      deadline: "Edição fecha hoje ao meio-dia",
      brief:
        "Relatório final do clube de ciências para a feira: o que o grupo fez, por que e o que concluiu.",
    },
    draft: {
      lead: "Relatório do clube de ciências para a feira de conhecimento.",
      segments: [
        {
          text: "…Tipo assim, o grupo fez o trabalho…",
          note: "Trecho 1 · registro oral",
          problem:
            "“Tipo assim” é conversa de corredor. Relatório pede registro formal — a situação muda a linguagem.",
        },
        {
          text: "…A entrega atrasou porque o prazo era curto. O objetivo era cumprir a tarefa…",
          note: "Trecho 2 · causa no lugar do fim",
          problem:
            "“Porque” explica a causa do atraso, mas o texto queria a FINALIDADE do trabalho. Causa ≠ propósito.",
        },
        {
          text: "…Concluímos. Pronto.",
          note: "Trecho 3 · conclusão sem fecho",
          problem:
            "Conclusão que não retoma a pergunta inicial do relatório é porta fechada na cara do leitor.",
        },
      ],
    },
    cards: [
      {
        icon: "conversa",
        category: "Trecho 1",
        hook: "Papinho de corredor",
        evidence:
          "“Tipo assim, o grupo fez o trabalho.” Em relatório formal, o registro oral desmonta a seriedade do conteúdo.",
      },
      {
        icon: "elo",
        category: "Trecho 2",
        hook: "Causa trocada por fim",
        evidence:
          "“A entrega atrasou porque o prazo era curto.” O “porque” responde “por que atrasou”, mas o relatório precisa dizer “para que” o trabalho serviu.",
      },
      {
        icon: "lista",
        category: "Trecho 3",
        hook: "Conclusão muda",
        evidence:
          "“Concluímos.” E a resposta à pergunta inicial? Conclusão sem retomada deixa o relatório em aberto.",
      },
    ],
    repairQuestion: "Qual reparo deixa o relatório pronto para a feira?",
    repairOptions: [
      {
        icon: "caneta",
        title: "Ajustar registro e fecho",
        subtitle: "Formaliza o tom e retoma a tese",
      },
      {
        icon: "busca",
        title: "Manter o “tipo assim”",
        subtitle: " oral no texto formal",
      },
      {
        icon: "lista",
        title: "Apagar a conclusão",
        subtitle: "Relatório sem resposta final",
      },
    ],
    repairCorrect: 0,
    repairHint:
      "Relatório é gênero FORMAL: registro adequado + conclusão que responde à pergunta inicial.",
    repairWrong: [
      "Manter “tipo assim” num relatório formal é ir de chinelo para a feira de ciências.",
      "Apagar a conclusão transforma meses de trabalho em suspense — o leitor merece a resposta.",
    ],
    published:
      "“O grupo realizou o experimento para cumprir o cronograma da feira. Concluímos, como previsto na hipótese, que o período seco concentrou os resultados.”",
    verdict: {
      title: "Relatório aprovado para a feira",
      text: "Registro formal, finalidade declarada com “para” e conclusão que retoma a hipótese: o relatório agora responde à pergunta com que começou — e impressiona na feira.",
      detail: {
        label: "Ver o antes e o depois",
        text: "ANTES: “Tipo assim, o grupo fez o trabalho. A entrega atrasou porque o prazo era curto. Concluímos.” DEPOIS: “O grupo realizou o experimento para cumprir o cronograma da feira. Concluímos, como previsto na hipótese, que o período seco concentrou os resultados.”",
      },
    },
  },
];
