# Changelog

Todas as mudanças relevantes deste projeto são registradas neste arquivo.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não publicado]

Versão de desenvolvimento fixada em 0.1.0. A primeira release será a `v1.0.0`; as mudanças desta seção preservam o progresso local existente.

### Adicionado

- README reestruturado no padrão de repositórios de referência, com selos, sumário, demonstração, como usar, deploy, FAQ, suporte e créditos.
- Scripts `capturas:readme` e `capturas:readme:docker` e spec renomeado para `tests/e2e/imagens.spec.ts`, gerando as capturas em `docs/imagens/`.
- Catálogo de etiquetas em `.github/labels.json` e script `npm run etiquetas:sync` para sincronizá-las pelo GitHub CLI.
- Workflow `etiquetas.yml`, que aplica etiquetas de área pelos caminhos e de tipo pelo título e valida título e etiquetas em pull requests.
- Templates de issue ampliados (Bug, Melhoria e Tarefa) e template de pull request com etiquetas, commits atômicos, ciclo de rascunho e uso de IA.
- Oito jogos, completando cinco níveis em cada área e 60 casos na coleção.
- Matriz de progressão, diagnóstico dos jogos anteriores e pesquisa com fontes oficiais e acadêmicas em `docs/`.
- Laboratórios com controles, comparação de cenários, gráficos e tabelas equivalentes.
- Acesso direto ao catálogo na abertura e comparação de cenários por teclado.
- Laboratório consultável na decisão, parâmetros preservados, restauração opcional e leitura dos resultados atuais.
- Tarefas de seleção múltipla, ordenação e cálculo, pistas, resolução com apoio e transferência.
- Registro acumulativo de casos, roteiro formativo e fichas do professor com progressão interna.
- Navegação por teclado com atalho ao conteúdo, gestão de foco por fase, telas de carregamento, erro e endereço não encontrado.
- Scripts portáveis de execução e validação em contêiner no Windows e no Linux.
- Suíte de fumaça do Playwright com specs de hub, partida, progresso, modo professor, acessibilidade e API de saúde.
- Workflows `qualidade.yml` e `testes.yml`, além do Dependabot.
- AGENTS.md, CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md e CHANGELOG.md.
- Templates de pull request e de issues (Bug e Melhoria) no padrão do GitHub.
- Devcontainer com Node 24, Docker e GitHub CLI.
- Imagem Docker da aplicação em estágios, com a saída `standalone`, healthcheck em `GET /api` e execução sem privilégios.
- Módulos Terraform para AWS, Azure e GCP em `infra/terraform`, com modo local apoiado nos emuladores do Floci e modo de produção sem banco, storage ou cache.
- Harness `infra/floci` com Compose dos emuladores e script de aplicação, verificação e destruição por nuvem.
- Workflow `infra.yml` para formatar, validar e aplicar o Terraform no Floci, e scripts npm `infra:fmt`, `infra:validar` e `infra:floci` com variantes por nuvem.
- Documento `docs/implantacao-nuvem.md` e etiqueta `area: infra` no catálogo de etiquetas.
- Diálogo Sobre no rodapé, com os desenvolvedores, o repositório, a instituição e a licença.

### Modificado

- Gerenciamento de dependências migrado de npm para pnpm, com o `packageManager` fixado, `pnpm-lock.yaml` versionado e `pnpm-workspace.yaml` autorizando os scripts de build.
- Capturas de evidência movidas de `docs/evidencias/` para `docs/imagens/`; o resumo de execução em JSON foi removido e os links do relatório atualizados.
- Guia de contribuição e AGENTS.md passam a exigir etiquetas em issues e pull requests, commits atômicos organizados em um único pull request e abertura somente com o trabalho finalizado.
- Recriados os 12 jogos anteriores com hipóteses, limites das evidências, decisões fundamentadas e três casos progressivos por jogo.
- Catálogo, filtros, cards, progresso, modo professor e leitura em voz atualizados para a coleção de 20 jogos.
- Selos descritos como registro de participação, incluindo resolução com apoio, sem atribuição automática de domínio.
- Contrastes dos tokens de área e estados de controles, texto amplo e movimento reduzido revistos.
- Gerenciamento de dependências consolidado em npm, com remoção anterior de Bun e `bun-types`.
- README atualizado para refletir scripts, suíte de testes e limitações.

### Corrigido

- Distinção entre montante com pagamento único e prestação em contrato com amortização.
- Generalizações indevidas de modelos didáticos, fontes oficiais, ausência de prova e conclusões de simulação.
- Mensagem de cópia de link exibida somente após sucesso, com endereço selecionável em caso de bloqueio.
- Estado do botão de voz após interrupção ou ausência de suporte.
- Cancelamento da leitura do feedback quando sua resposta muda, sem interromper a leitura pertencente a outro botão.
- Confirmação de exclusão de progresso com opção explícita de manter os registros.
- Fontes Baloo 2 e Nunito servidas de arquivos locais (subset latino, licenças OFL), eliminando a consulta ao Google Fonts no desenvolvimento e no build e a falha intermitente do `next/font/google` com o Turbopack ([vercel/next.js#99114](https://github.com/vercel/next.js/issues/99114)).
