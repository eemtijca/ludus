# Contribuindo

Guia de desenvolvimento do Ludus: como preparar o ambiente, abrir issues, propor mudanças, escrever código, testar e documentar. Dúvidas e propostas podem ser abertas como issue; o guia do projeto está no [README.md](README.md). Para vulnerabilidades, siga [SECURITY.md](SECURITY.md), e para a convivência, o [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Antes de começar

- Abra uma issue antes de trabalhar em funcionalidades, jogos novos, mudanças estruturais e correções grandes. Ajustes pequenos e evidentes podem seguir direto para um pull request.
- Procure issues abertas e fechadas antes de criar uma nova. Havendo uma equivalente, comente para assumir a tarefa e evitar trabalho duplicado.
- Aplique as etiquetas de tipo e de área em toda issue e todo pull request, conforme a seção [Etiquetas](#etiquetas).
- Descreva o contexto com clareza: passos de reprodução, comportamento observado, comportamento esperado e versão ou commit afetado.
- Mantenha a conversa pública nas issues e nos pull requests. Canais privados ficam reservados para vulnerabilidades e assuntos de conduta.
- Nunca inclua segredos ou dados reais de estudantes em issues, comandos, commits, capturas ou logs.
- Vulnerabilidades seguem [SECURITY.md](SECURITY.md), nunca uma issue pública.

## Ambiente de desenvolvimento

Pré-requisitos: Node 20 ou superior e, para a suíte em contêiner, Docker. Não há variáveis de ambiente obrigatórias nem banco de dados.

```bash
pnpm install
pnpm run dev      # http://localhost:3000
```

Build de produção:

```bash
pnpm run build
pnpm start
```

Comandos úteis na raiz:

| Comando                   | Efeito                                           |
| ------------------------- | ------------------------------------------------ |
| `pnpm run dev`             | Servidor de desenvolvimento na porta 3000.       |
| `pnpm run build`           | Build de produção e cópia da saída standalone.   |
| `pnpm start`               | Executa o build de produção com Node.            |
| `pnpm run lint`            | Análise estática com o ESLint.                   |
| `pnpm run tsc`             | Checagem de tipos (o build não a executa).       |
| `pnpm run test:e2e:docker` | Suíte de fumaça na imagem oficial do Playwright. |
| `pnpm run test:e2e`        | Alternativa local, sobe o servidor sozinho.      |
| `pnpm run etiquetas:sync`  | Sincroniza as etiquetas do GitHub com o catálogo. |

## Fluxo de contribuição e pull requests

### GitHub CLI

Opere issues, pull requests, execuções de workflow e releases pelo GitHub CLI (`gh`), não pela interface web. Antes de operar, confirme a sessão com `gh auth status` (ou `gh status`) e, se não houver conexão, autentique com `gh auth login`.

Comandos do dia a dia:

- `gh issue create`, `gh issue list` e `gh issue view` para issues.
- `gh pr create`, `gh pr view` e `gh pr checks --watch` para pull requests.
- `gh pr edit <número> --add-label <etiqueta>` para corrigir etiquetas.
- `gh run list`, `gh run watch` e `gh run view --log-failed` para workflows.
- `gh release create` e `gh release view` para releases.

Nunca inclua segredos ou dados de estudantes em comandos, títulos, corpos ou comentários.

### Issues

Abra uma issue quando:

- encontrar um comportamento incorreto que não consegue corrigir;
- propor um jogo, uma funcionalidade ou uma melhoria de escopo;
- discutir uma decisão estrutural ou pedagógica;
- apontar falha ou lacuna de documentação.

Antes de abrir, procure issues abertas e fechadas com termos relacionados. Os modelos disponíveis são Bug, Melhoria, Tarefa e os contatos para segurança, documentação e contribuição; escolha o mais adequado e preencha os campos obrigatórios.

Uma boa issue contém:

- o problema e o resultado esperado;
- passos de reprodução numerados, com o menor exemplo possível;
- ambiente envolvido (navegador, dispositivo, versão ou commit);
- contexto adicional, sem dados reais nem segredos.

As etiquetas de tipo, área, prioridade e triagem estão descritas na seção [Etiquetas](#etiquetas).

A triagem acontece em até 7 dias. Uma issue pode ser fechada sem correção quando estiver fora do escopo, duplicada ou sem informação; nesse caso o motivo é explicado e a porta fica aberta para uma proposta mais precisa. Se a issue aberta for resolvida por conta própria, comente o desfecho e feche.

Relacione a issue ao pull request com `Closes #123` quando a mudança encerrar o assunto, ou `Refs #123` quando apenas caminhar na direção dele. A ligação com `Closes` só funciona no pull request que aponta para a branch padrão.

### Etiquetas

Toda issue e todo pull request recebe ao menos uma etiqueta de tipo e uma de área. A prioridade é definida na triagem, e a etiqueta `triagem` sai quando o tipo, a área e a prioridade estiverem confirmados. Pull requests do Dependabot recebem `dependencies` automaticamente e dispensam as demais.

| Grupo      | Etiquetas                                                                                     | Uso                                                |
| ---------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Tipo       | `bug`, `enhancement`, `documentation`, `refactor`, `testes`, `ci`, `desempenho`, `manutencao` | Natureza da mudança.                               |
| Área       | `area: jogos`, `area: progresso`, `area: acessibilidade`, `area: professor`, `area: plataforma` | Parte do sistema afetada.                         |
| Prioridade | `prioridade: alta`, `prioridade: media`, `prioridade: baixa`                                  | Urgência definida na triagem.                      |
| Triagem    | `triagem`                                                                                     | Aguardando confirmação de tipo, área e prioridade. |

O catálogo fica em [.github/labels.json](../.github/labels.json) e é aplicado com `pnpm run etiquetas:sync`, que cria ou atualiza as etiquetas pelo GitHub CLI. O workflow `etiquetas.yml` aplica `area:` pelos caminhos alterados e o tipo pelo prefixo do título, e o check `validar` reprova pull requests sem etiqueta obrigatória ou com título fora do padrão Conventional Commits. Pull requests do tipo `docs` dispensam etiqueta de área.

Antes de criar uma etiqueta nova, confirme que ela tem público, dono e regra automatizada no mesmo pull request, seja pelo catálogo, pelo mapeamento de caminhos ou pelo título. Etiqueta sem automação tende a não ser aplicada.

Para aplicar:

```bash
gh issue create --label "bug" --label "area: acessibilidade"
gh pr create --label "refactor" --label "area: jogos"
gh pr edit 123 --add-label "prioridade: alta"
gh pr view 123 --json labels
```

### Branches

Parta da `main` atualizada e use `tipo/descricao-curta`, em minúsculas, com hífens e sem acento:

- `feat/` para funcionalidades novas e jogos novos.
- `fix/` para correções.
- `hotfix/` para correções urgentes.
- `docs/`, `test/`, `refactor/`, `perf/`, `chore/` e `ci/` para os demais casos.
- `release/` para linhas de manutenção, como `release/1.x`, criadas apenas quando houver uma linha antiga a suportar.

Branches criadas por agentes de IA seguem esta mesma convenção de tipo, conforme a [Conventional Branch](https://conventional-branch.github.io/). A autoria assistida fica registrada no rodapé `Assisted-by` do commit e no corpo do pull request.

### Commits

Siga o [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/), em português, no imperativo e descrevendo o efeito da mudança, com escopo entre parênteses quando ajudar a localizar a área.

```text
<tipo>(<escopo opcional>): <descrição>

[corpo opcional]

[rodapé opcional]
```

Tipos usados:

| Tipo       | Uso                                        |
| ---------- | ------------------------------------------ |
| `feat`     | Funcionalidade, jogo ou conteúdo novo.     |
| `fix`      | Correção de comportamento.                 |
| `docs`     | Documentação.                              |
| `test`     | Testes.                                    |
| `refactor` | Mudança interna sem alterar comportamento. |
| `perf`     | Desempenho.                                |
| `chore`    | Manutenção e dependências.                 |
| `ci`       | Workflows e automação.                     |
| `build`    | Build e empacotamento.                     |
| `revert`   | Reversão de commit anterior.               |

Escopos comuns: `plataforma`, `hub`, `jogo`, `progresso`, `professor`, `a11y`, `docs`, `test`, `ci`.

Regras:

- Cada commit é atômico: contém uma única mudança lógica, completa e autossuficiente. O código compila e as verificações passam em cada commit.
- Não misture contextos no mesmo commit, como formatação, refatoração e mudança de comportamento. Se o commit cabe em mais de um tipo, divida.
- O histórico exposto não contém trabalho em andamento nem correção de revisão. Durante o desenvolvimento, use `git commit --fixup <commit>` e limpe a branch com `git rebase -i --autosquash` antes de publicar.
- Todos os commits do mesmo assunto ficam em uma única branch e um único pull request.
- Prefira mudanças pequenas e revisáveis, na linha do [Google Engineering Practices](https://google.github.io/eng-practices/review/developer/small-cls.html): cerca de 100 linhas é um tamanho razoável e 1000 é grande demais. Se o assunto não fechar em um pull request único, combine a divisão antes de começar.
- Use o corpo para explicar o porquê quando a descrição não bastar.
- Use rodapé para referências: `Closes #123`, `Refs #123`.
- Mudança incompatível usa `!` depois do tipo ou escopo, ou o rodapé `BREAKING CHANGE:`.
- Commits com geração relevante por ferramenta de IA levam o rodapé `Assisted-by: ferramenta:modelo`. A responsabilidade pela mudança é de quem envia.
- Evite commits de trabalho em andamento na `main`; o histórico da `main` vem de pull requests.

Exemplos do histórico:

```text
feat(plataforma): reforça acessibilidade, jogos e roteamento
feat(ui): reformula identidade visual, mobile-first e acessibilidade
refactor: reorganiza o projeto e padroniza o código em pt-BR
```

### Pull requests

Um pull request resolve um assunto e reúne todos os commits dele. Se a mudança misturar refatoração e comportamento, separe em pull requests menores. Refatorações grandes andam em pull request próprio, sem misturar com correção ou funcionalidade. Se o trabalho virar dois assuntos independentes, combine a divisão e abra pull requests separados.

Abra o pull request somente quando o trabalho estiver finalizado: verificações locais passando, título em Conventional Commits, documentação e CHANGELOG atualizados, etiquetas definidas e revisão do próprio diff feita. Não use `gh pr create --fill`, porque o corpo deve vir do template.

Se o CI falhar ou surgir algo novo depois da abertura, converta o pull request para rascunho com `gh pr ready --undo`, faça os commits atômicos e rode as verificações de novo. Marque como pronto com `gh pr ready` somente com tudo verde. Enquanto o pull request estiver em rascunho, não peça revisão. Depois que a revisão começar, prefira commits novos que respondem ao feedback; se precisar reescrever a história, use `git push --force-with-lease` e explique o motivo na conversa.

A descrição deve conter:

- o problema e o resultado esperado;
- o que mudou e por quê;
- as etiquetas aplicadas;
- como validar: comandos executados e, quando aplicável, capturas ou passos de interface;
- riscos, incluindo mudanças que afetam o progresso salvo no dispositivo;
- a issue relacionada, com `Closes #123` quando aplicável.

Antes de abrir, rode as verificações locais:

```bash
pnpm run lint
pnpm run tsc
pnpm run test:e2e:docker   # imagem oficial, com o aplicativo no ar
```

Preencha o checklist do template de pull request. Ao alterar comportamento, atualize o README e o CHANGELOG.md.

### Revisão e integração contínua

Toda mudança passa por revisão e pelos workflows do GitHub Actions:

| Workflow        | Etapas                                                                    |
| --------------- | ------------------------------------------------------------------------- |
| `qualidade.yml` | `pnpm install --frozen-lockfile`, `lint`, `tsc` e `build` em pull requests.                       |
| `etiquetas.yml` | Aplica etiquetas de área e de tipo e valida o título e as etiquetas em pull requests fora de rascunho. |
| `testes.yml`    | Sobe o aplicativo e roda a suíte do Playwright no Chromium, em contêiner. |

A `main` é protegida por rulesets: pull request obrigatório, checks verdes, conversas resolvidas e squash como único método. Todo pull request precisa da aprovação de um mantenedor do [CODEOWNERS](.github/CODEOWNERS); depois da aprovação, quem abriu pode mesclar. A autoaprovação não existe no GitHub; donos da organização podem mesclar com o bypass da regra de revisão, mas continuam sujeitos aos checks de qualidade.

Corrija as falhas antes de pedir nova revisão. Pull requests sem CI verde não são mesclados. O check `validar` volta a rodar quando o título ou as etiquetas mudam; se faltar etiqueta, aplique com `gh pr edit --add-label`. Evite force-push depois que a revisão começar; se precisar reescrever a história, explique o motivo na conversa.

### Estratégia de merge

Mescle por squash, em um único commit por pull request. Apague a branch após o merge. Não faça force-push em `main` nem reescreva o histórico já mesclado.

## Padrões de código

- Código e comentários em português, curtos e diretos.
- `src/lib/catalog.ts` é a fonte única de verdade dos jogos; `src/games/registry.ts` mapeia o identificador ao componente. Nunca duplique metadados fora do catálogo.
- Cada jogo tem `content.ts` com os casos e `index.tsx` com o palco, usando `useGameSession` e `GameShell`. As fases são Explorar, Testar e Decidir, e os selos são `lente`, `chave` e `selo-final`.
- A coleção possui cinco jogos por área, níveis 1 a 5, e três casos por jogo. O contrato está em `src/games/_shared/investigation-types.ts`. O palco compartilhado oferece tarefas de seleção, seleção múltipla, ordenação e cálculo, além de laboratórios definidos por cada conteúdo.
- O índice `src/games/cases.ts` deve refletir o catálogo e o registro. A progressão de casos deve mudar a operação cognitiva, não apenas os números. Incluir concepção alternativa, explicação, pista e situação de transferência. Conferir unidades, cálculos e limitações dos modelos.
- Fontes curriculares devem ser oficiais, com referência no documento de pesquisa correspondente. Dados didáticos são fictícios e devem ser rotulados. Não apresentar os cinco níveis como escala oficial da BNCC ou de avaliações externas.
- Componentes e utilitários usam kebab-case; classes próprias usam o prefixo `ludus-`; tokens de cor e tipografia ficam em `src/app/globals.css`.
- O progresso usa o store Zustand com a chave `ludus:progress:v1` e nunca regride.

### Convenção editorial

- Documentação e textos de interface usam português brasileiro, tom técnico e impessoal, sem travessão, meia-risca, setas ou símbolos decorativos. Use dois-pontos, vírgula, parênteses, `...` e aspas retas.
- Evite segunda pessoa na documentação e nos textos institucionais.
- No conteúdo didático dos jogos, a narração em segunda pessoa é intencional, as citações podem usar aspas e as setas ficam restritas à notação matemática e química.

### Acessibilidade e DUA

Acessibilidade é requisito do produto, não enfeite:

- Sem cronômetro, sem punição e sem caminho único: o erro nunca bloqueia e o progresso só soma.
- Todo áudio tem alternativa visual e todo controle funciona por teclado, com alvos de toque confortáveis.
- Respeite as preferências de `a11y-provider.tsx` (alto contraste, texto amplo e movimento reduzido) e a leitura em voz de `src/lib/speech.ts`.
- Novos jogos passam pelos mesmos componentes de moldura, feedback e veredito, herdando os recursos de acessibilidade.
- A resolução com apoio permite avançar após o erro e explica a resposta de referência. Selos registram participação. A justificativa livre pode ser escrita, oral ou discutida; a aplicação não a avalia automaticamente nem a persiste.

### Contribuições assistidas por IA

Ferramentas de IA são bem-vindas como apoio, mas a responsabilidade pela mudança é de quem envia, e a autoria dos commits é humana. Revise o resultado linha a linha, garanta que ele segue as convenções do repositório, rode as verificações locais e nunca cole segredos ou dados reais em ferramentas externas, issues ou commits. Commits com geração relevante levam o rodapé `Assisted-by: ferramenta:modelo`, e o template de pull request tem a seção "Uso de IA". Agentes seguem o [AGENTS.md](AGENTS.md), com as mesmas obrigações de etiquetas, commits atômicos, um único pull request e ciclo de rascunho.

## Testes e qualidade

A suíte do Playwright cobre o hub, uma partida completa de fumaça, o progresso, o modo professor, a acessibilidade e a API de saúde.
Também cobre as 20 rotas de jogos, os 60 casos, integridade dos conteúdos, progressão dos cinco níveis, preservação de registros anteriores, pistas e apoio, filtros combinados, falha de cópia de link, teclado e responsividade.

```bash
pnpm run test:e2e:docker            # todos os projetos, na imagem oficial
pnpm run test:e2e:docker:chromium   # apenas o Chromium
pnpm run test:e2e                   # alternativa local, sobe o servidor
pnpm run capturas:readme            # capturas do README em docs/imagens
```

As capturas do README ficam em `docs/imagens/` e são geradas por `tests/e2e/imagens.spec.ts`, com o aplicativo no ar: `pnpm run capturas:readme` no host ou `pnpm run capturas:readme:docker` na imagem oficial. Os PNGs são versionados e não devem ser editados à mão. A captura de progresso parte do estado semeado determinístico de `tests/e2e/helpers/progresso.ts`, montado com identificadores reais do catálogo e dos casos; as demais capturas seguem com estado limpo.

Regras:

- Cada spec cria o próprio estado e limpa o que alterar no `localStorage`.
- As preferências de acessibilidade são restauradas ao final de cada teste.
- Ao corrigir um bug, adicione um caso que falharia antes da correção.
- O `next.config.ts` ignora erros de tipo no build; `pnpm run tsc` é obrigatório no fluxo local e no CI.

## Documentação

O [README.md](README.md) é a fonte principal: mantenha a stack, os scripts, a arquitetura e o catálogo de jogos atualizados ao adicionar ou mudar um jogo. Mudanças estruturais relevantes podem ganhar uma nota curta em `docs/`, seguindo o formato das existentes.

## Releases e changelog

As mudanças relevantes são registradas em [CHANGELOG.md](CHANGELOG.md), no formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), com versionamento semântico. Mova as entradas da seção Não publicado para a versão correspondente ao publicar.

Enquanto a primeira versão pública não é lançada, a versão do projeto permanece fixada em `0.1.0` e as mudanças ficam na seção Não publicado. A primeira release será a `v1.0.0`; a partir dela, o versionamento semântico passa a reger as versões.

O fluxo de releases e a política de suporte estão em [docs/releases.md](docs/releases.md).

Crie releases pelo GitHub CLI:

```bash
gh release create vX.Y.Z --generate-notes
```

## Suporte e dúvidas

Use as issues para dúvidas, sugestões e problemas. A triagem acontece em até 7 dias. Para vulnerabilidades, siga [SECURITY.md](SECURITY.md); para conduta, o [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
