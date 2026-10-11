# AGENTS.md

Ludus: aplicação web de 20 jogos de investigação para o ensino médio, com cinco níveis por área da BNCC e três casos por jogo. Recurso de apoio ao Atendimento Educacional Especializado (AEE), com os princípios do Desenho Universal para a Aprendizagem (DUA). Não há contas, banco de dados nem servidor de aplicação: todo o estado fica no `localStorage`. Next.js 16 com App Router e saída `standalone`, React 19, TypeScript, Tailwind CSS 4 e componentes shadcn/ui. Código, comentários, documentação, testes e commits são em português.

## Diretrizes do repositório

- Leia o `CONTRIBUTING.md` antes de qualquer mudança: ele reúne o fluxo de issues, etiquetas, branches, commits, pull requests, padrões de código, acessibilidade e testes.
- O `next.config.ts` define `typescript.ignoreBuildErrors: true` e `reactStrictMode: false`; rode `pnpm run tsc` e `pnpm run lint` em toda mudança.
- Commits seguem Conventional Commits em português, no imperativo, com escopo opcional: `fix(jogo): corrige ...`. Branches usam `tipo/descricao-curta`, inclusive as criadas por agentes de IA; a autoria assistida fica no rodapé `Assisted-by` do commit.
- O gerenciador é pnpm, com `pnpm-lock.yaml`; não use bun, yarn nem npm nos comandos.
- Nomes de domínio em português (`jogos`, `fases`, `selos`), termos de infraestrutura em inglês quando consagrados (`build`, `standalone`).
- A suíte de fumaça do Playwright roda primariamente em contêiner: `pnpm run test:e2e:docker`.

## Padrões de código

- `src/lib/catalog.ts` é a fonte única de verdade: área, nível, códigos BNCC, habilidades, ícone e duração de cada jogo. `src/games/registry.ts` mapeia o identificador ao componente.
- Cada jogo tem `content.ts` (casos) e `index.tsx` (palco) e usa `useGameSession` e `GameShell`. As fases são fixas (Explorar, Testar e Decidir) e os selos são `lente`, `chave` e `selo-final`.
- `investigation-types.ts` define o contrato dos casos e `investigation-game.tsx` compõe os palcos: dossiê, tarefas de hipótese, laboratório opcional e decisão. Cada pasta mantém conteúdo e ponto de entrada próprios. `src/games/cases.ts` reúne os casos para as fichas do professor e a verificação estrutural, sem duplicar metadados do catálogo.
- Cada jogo deve ter exatamente três casos, com foco cognitivo progressivo. Fontes e dados fictícios devem ser identificados; códigos BNCC devem ser conferidos no documento oficial. Apoio não reduz selos, e selos não certificam domínio.
- O progresso fica no store Zustand persistido em `ludus:progress:v1` e só acumula: selos nunca expiram.
- `completedCaseIds` é opcional e acumulativo. Registros antigos conservam selos, contagem e último caso; não inventar casos concluídos para preencher a nova coleção.
- As preferências de acessibilidade ficam em `a11y-provider.tsx` e viram classes no elemento `html` (`a11y-contrast`, `a11y-text-large` e `a11y-reduced-motion`).
- Componentes e utilitários usam kebab-case; as classes próprias usam o prefixo `ludus-`; os tokens de cor e tipografia ficam em `src/app/globals.css`.
- Voz, som e conversão de TeX ficam em `src/lib/speech.ts`, `src/lib/sound.ts` e `src/lib/tex.ts`; o MathJax é servido localmente de `public/mathjax`.

## Comandos

Pré-requisitos: Node 20 ou superior e, para a suíte em contêiner, Docker. Não há variáveis de ambiente obrigatórias nem banco.

- `pnpm install`; `pnpm run dev` em `http://localhost:3000`; `pnpm run build`; `pnpm start`.
- Verificação antes do pull request: `pnpm run lint`, `pnpm run tsc` e `pnpm run test:e2e:docker`.
- A suíte em contêiner usa a imagem oficial e espera o aplicativo no ar; `pnpm run test:e2e` e `pnpm run test:e2e:install` são a alternativa local.
- Os scripts Node em `scripts/` tornam dev, build, start e contêiner portáveis. No Windows, o Playwright usa `host.docker.internal`; no Linux, mantém o script Bash e a rede host.
- O CI separa `qualidade.yml` (lint, tipos e build) e `testes.yml` (ponta a ponta no Chromium em contêiner).
- Etiquetas: `pnpm run etiquetas:sync` cria ou atualiza as etiquetas do GitHub conforme `.github/labels.json`.
- Capturas do README: `pnpm run capturas:readme` ou `pnpm run capturas:readme:docker`, com o aplicativo no ar. Os PNGs ficam em `docs/imagens/` e não são editados à mão.

## Ferramentas externas

- GitHub: opere issues, pull requests, execuções de workflow e releases pelo GitHub CLI (`gh`), não pela interface web. Confirme a sessão com `gh auth status` e, se necessário, autentique com `gh auth login`. Exemplos: `gh issue create`, `gh pr create`, `gh pr checks --watch`, `gh run watch` e `gh release create`. Nunca inclua segredos ou dados de estudantes.
- Playwright: rode a suíte na imagem oficial da Microsoft, com o aplicativo no ar, usando `pnpm run test:e2e:docker` (ou `pnpm run test:e2e:docker:chromium`). O script `tests/playwright-container.sh` aceita `PLAYWRIGHT_IMAGE`, `PLAYWRIGHT_DOCKER_NETWORK` e `PLAYWRIGHT_DOCKER_USER`. Mantenha a versão da imagem igual à do `@playwright/test`. A instalação local é alternativa.

## Fluxo de issues e pull requests

- Aplique etiquetas em toda issue e todo pull request: uma de tipo e, fora do tipo `docs`, uma de área. Use `gh issue create --label "bug" --label "area: acessibilidade"` e `gh pr edit <número> --add-label "area: jogos"`. O catálogo fica em `.github/labels.json` e é sincronizado com `pnpm run etiquetas:sync`. Pull requests do Dependabot recebem `dependencies` e dispensam as demais.
- Faça apenas commits atômicos: uma mudança lógica completa por commit, sem trabalho em andamento nem correção de revisão. Use `git commit --fixup` durante o desenvolvimento e `git rebase -i --autosquash` antes de publicar.
- Organize todos os commits do assunto em uma única branch e um único pull request. Abra o pull request somente quando estiver finalizado, com título em Conventional Commits, verificações locais, documentação e CHANGELOG prontos. Não use `gh pr create --fill`.
- Todo pull request precisa da aprovação de um mantenedor do `.github/CODEOWNERS` antes do merge; quem abriu pode mesclar depois da aprovação. Agentes não mesclam sem essa aprovação.
- Se o CI falhar ou surgir algo novo depois de aberto, converta para rascunho com `gh pr ready --undo`, faça os commits e só marque como pronto com `gh pr ready` quando tudo estiver verde.
- Nunca peça revisão com o pull request em rascunho nem abra pull request incompleto.
- Commits com geração relevante por IA levam o rodapé `Assisted-by: ferramenta:modelo`; a autoria e a responsabilidade são humanas.

## Arquitetura

- Rotas reais: `/` (hub), `/jogo/<id>`, `/progresso` e `/professores`; as páginas de jogo são pré-renderizadas por `generateStaticParams` e um identificador desconhecido cai na tela de jogo não encontrado.
- `src/components/app-shell/app-root.tsx` é a casca compartilhada; a navegação fica na barra inferior no celular e no cabeçalho a partir de `sm`, e some dentro do jogo.
- Para adicionar um jogo: registrar os metadados em `catalog.ts`, criar `content.ts` e `index.tsx` e mapear em `registry.ts`. Hub, progresso, modo professor e acessibilidade cobrem o jogo automaticamente.
- A aplicação tem uma única rota de API, `GET /api`, com nome, status e horário.

## Armadilhas

- O build ignora erros de tipo e o modo estrito do React está desligado; a verificação real é `pnpm run tsc` e o lint.
- `pnpm start` exige `pnpm run build` antes, porque executa o standalone.
- O Prettier ignora `src/components/ui` e `public/mathjax`; não reformate esses diretórios à mão.
- `next-auth`, `next-intl` e `z-ai-web-dev-sdk` estão declarados no `package.json` sem uso no código: não há autenticação, tradução nem serviço externo.
- O estado é local ao navegador: não há sincronização entre dispositivos nem coleta de dados pessoais.
- A leitura em voz depende das vozes pt-BR do sistema e do navegador; todo áudio precisa de alternativa visual e de alternativa por teclado.
