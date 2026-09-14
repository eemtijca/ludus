# Ludus

Aplicação web de jogos educacionais de investigação para o ensino médio, organizada por áreas do conhecimento da BNCC. O projeto é um recurso de apoio ao Atendimento Educacional Especializado (AEE) e segue os princípios do Desenho Universal para a Aprendizagem (DUA): atividades sem cronômetro, leitura em voz alta, repetição livre e ritmo próprio do estudante.

A coleção reúne 12 jogos, três por área (Linguagens, Matemática, Ciências da Natureza e Ciências Humanas), e cada jogo oferece três casos. Não há contas, banco de dados ou servidor de aplicação: todo o estado permanece no navegador do dispositivo.

## Requisitos

- Node.js 20 ou superior
- Bun 1.1 ou superior (opcional, utilizado pelo script de produção)

## Instalação e execução

```bash
# dependências
npm install

# desenvolvimento em http://localhost:3000
npm run dev

# build de produção
npm run build
npm run start
```

O build usa a saída `standalone` do Next.js e copia os arquivos estáticos e a pasta `public` para `.next/standalone`. O script `start` executa o servidor standalone com Bun. Sem Bun instalado, use:

```bash
NODE_ENV=production node .next/standalone/server.js
```

Não existem variáveis de ambiente obrigatórias nem banco de dados. Funciona em qualquer hospedagem Node.js, como Vercel, Railway ou um servidor local da escola.

## Scripts

| Script  | Comando                                  | Função                                    |
| ------- | ---------------------------------------- | ----------------------------------------- |
| `dev`   | `next dev -p 3000`                       | Servidor de desenvolvimento na porta 3000 |
| `build` | `next build` e cópia da saída standalone | Build de produção                         |
| `start` | `bun .next/standalone/server.js`         | Executa o build de produção               |
| `lint`  | `eslint .`                               | Análise estática do código                |

Observação: o projeto não possui suíte de testes automatizados. A verificação principal é o `lint`, complementada por `npx tsc --noEmit` para checagem de tipos.

## Stack

| Camada      | Tecnologia                                                    |
| ----------- | ------------------------------------------------------------- |
| Framework   | Next.js 16 com App Router e React 19                          |
| Linguagem   | TypeScript 5 em modo `strict`                                 |
| Estilo      | Tailwind CSS 4 e design system próprio                        |
| Componentes | shadcn/ui como base e componentes autorais de jogo            |
| Estado      | Zustand para progresso e external store para preferências     |
| Matemática  | MathJax 3 com mhchem, servido localmente em `public/mathjax`  |
| Ícones      | Lucide React com registro central por nome                    |
| Tipografia  | Baloo 2 (títulos) e Nunito (corpo) via `next/font`            |
| Voz         | Web Speech API em pt-BR                                       |
| Som         | Web Audio API com efeitos sintetizados, sem arquivos de áudio |

## Arquitetura

### Roteamento

A aplicação usa as rotas reais do App Router, com caminhos limpos e sem hash:

- `/` para o hub de jogos
- `/jogo/<id>` para uma partida
- `/progresso` para o painel do estudante
- `/professores` para o modo professor

As páginas de jogo são pré-renderizadas em tempo de build a partir do catálogo (`generateStaticParams`). Identificadores desconhecidos caem em uma tela de jogo não encontrado, renderizada sob demanda. A navegação client-side usa `next/link` e `next/navigation`, e a lógica de parsing e montagem de URLs está em `src/lib/router.ts`. O componente `src/components/app-shell/app-root.tsx` é compartilhado por todas as rotas.

### Catálogo e registro

`src/lib/catalog.ts` é a fonte única de verdade da coleção: área, nível, códigos BNCC, habilidades, ícone e duração estimada de cada jogo. `src/games/registry.ts` mapeia o identificador do catálogo ao componente React correspondente.

### Sessão de jogo

Cada jogo é composto por conteúdo (`content.ts`) e palco (`index.tsx`). A mecânica comum fica em dois lugares:

- `src/games/_shared/use-game-session.ts`: fases, selos, feedback imediato, veredito, sons, voz e reinício.
- `src/components/game-shell/game-shell.tsx`: moldura da partida, com cabeçalho, missão, indicador de fases, área do palco, banner de feedback e atalhos de acessibilidade.

As fases são fixas para toda a coleção: Explorar, Testar e Decidir. Os selos são `lente`, `chave` e `selo-final`, concedidos ao avançar de fase e ao concluir a partida.

### Progresso

`src/lib/progress.ts` mantém o progresso em um store Zustand persistido no `localStorage` sob a chave `ludus:progress:v1`. O registro inclui selos, número de partidas concluídas, data da última conclusão e o último caso jogado. Progresso apenas acumula: selos não expiram.

### Acessibilidade

As preferências ficam em `src/components/a11y/a11y-provider.tsx`, implementado como external store com `useSyncExternalStore`. As escolhas são aplicadas como classes no elemento `html`:

- `a11y-contrast`: tema preto e amarelo de alto contraste
- `a11y-text-large`: base tipográfica ampliada
- `a11y-reduced-motion`: desliga animações de décor

O motor de voz está em `src/lib/speech.ts` e os efeitos sonoros em `src/lib/sound.ts`. A conversão de TeX para fala está em `src/lib/tex.ts`.

### Estrutura de diretórios

```
src/
├── app/                    layout, metadata, rotas (/jogo/[gameId], /progresso, /professores) e estilos globais
├── lib/                    catálogo, roteador, progresso, voz, som, TeX e utilitários
├── components/
│   ├── a11y/               provider de preferências de acessibilidade
│   ├── app-shell/          cabeçalho, navegação inferior e rodapé
│   ├── hub/                hero, cards, busca e filtros
│   ├── game-shell/         moldura de partida, fases, selos, feedback e veredito
│   ├── mathjax/            provider do MathJax e texto misto com TeX
│   ├── progress/           painel de progresso
│   ├── teacher/            modo professor com fichas BNCC
│   └── ui/                 componentes base no padrão shadcn/ui
└── games/
    ├── _shared/            motor de partida compartilhado
    └── <jogo>/             content.ts com os casos e index.tsx com o palco
```

## Catálogo de jogos

| Área       | Nível | Jogo                  | BNCC       | Foco                                              |
| ---------- | ----- | --------------------- | ---------- | ------------------------------------------------- |
| Linguagens | 1     | Fonte Suspeita        | EM13LP39   | Checagem de informação e credibilidade da fonte   |
| Linguagens | 2     | Revisor Crítico       | EM13LP15   | Coesão, coerência e registro na revisão de texto  |
| Linguagens | 3     | Tese e Antítese       | EM13LGG303 | Argumentação, objeção e síntese                   |
| Matemática | 1     | Orçamento no Limite   | EM13MAT303 | Juros compostos e decisão de consumo              |
| Matemática | 2     | Função Viva           | EM13MAT302 | Funções do 1º e 2º grau com gráfico interativo    |
| Matemática | 3     | Risco Provável        | EM13MAT312 | Probabilidade teórica e frequência simulada       |
| Natureza   | 1     | O Circuito Falhou     | EM13CNT107 | Circuitos série e paralelo e Lei de Ohm           |
| Natureza   | 2     | Reação Equilibrada    | EM13CNT101 | Balanceamento de equações e conservação de átomos |
| Natureza   | 3     | Dilema do Gene        | EM13CNT205 | Herança dominante e seleção natural               |
| Humanas    | 1     | Fonte Histórica       | EM13CHS101 | Crítica de fontes históricas                      |
| Humanas    | 2     | Território em Disputa | EM13CHS206 | Uso do solo e risco hidrológico                   |
| Humanas    | 3     | Dilema Ético          | EM13CHS502 | Conflitos entre renda, saúde e legislação         |

## Design system

Os tokens de cor e tipografia ficam em `src/app/globals.css` e apontam para variáveis de runtime, o que permite trocar o tema sem reconstruir o CSS. Os principais grupos são:

- Superfícies e texto: `--ink`, `--ink-soft`, `--ink-faint`, `--surface`, `--paper`, `--cloud`, `--line`
- Cores semânticas: `--success`, `--danger`, `--hint`
- Cores de área: `--linguagens`, `--matematica`, `--natureza`, `--humanas` e variantes

Os componentes reutilizáveis usam prefixo `ludus-`:

- `ludus-btn`: botão com sombra inferior e variantes por área
- `ludus-card`: cartão clicável com borda e sombra
- `ludus-panel`: painel de conteúdo
- `ludus-chip`: etiqueta arredondada
- `ludus-track`: trilha de progresso
- `ludus-tile`: bloco de ícone sobre cor sólida, com tratamento específico no alto contraste

## Alto contraste e temas

O tema de alto contraste é aplicado pela classe `a11y-contrast` no elemento `html`. Nesse modo, a paleta preto e amarela redefine os tokens de runtime em `globals.css`, incluindo regras específicas para botões, cartões, gráficos SVG, ícones sobre cores sólidas e elementos antes baseados em `--ink`.

O modo escuro baseado em classe (`.dark`) existe no CSS, mas a interface do produto utiliza o tema claro e o tema de alto contraste.

## Como adicionar um jogo

1. Registre os metadados em `src/lib/catalog.ts` com área, nível, BNCC, ícone e habilidades.
2. Crie `src/games/<id>/content.ts` com os três casos e `src/games/<id>/index.tsx` com o palco, usando `useGameSession` e `GameShell`.
3. Adicione o componente ao mapa em `src/games/registry.ts`.
4. O hub, o progresso, o modo professor e os recursos de acessibilidade passam a cobrir o novo jogo automaticamente.

## API

Existe um único endpoint de verificação de saúde em `GET /api`, que responde com nome da aplicação, status e horário. Não há outras rotas de servidor.

## Limitações conhecidas

- Não há suíte de testes automatizados.
- `next.config.ts` define `typescript.ignoreBuildErrors: true` e `reactStrictMode: false`. Por isso, a checagem de tipos deve ser executada separadamente com `npx tsc --noEmit`.
- O estado é local ao navegador. Não há sincronização entre dispositivos.
- A leitura em voz alta depende da disponibilidade de vozes pt-BR no sistema operacional e no navegador.

## Licença e créditos

- Licença MIT. Consulte o arquivo [LICENSE](./LICENSE).
- Sala de Recursos da EEMTI José Cláudio de Araújo, 2026.
