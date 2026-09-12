# 🎲 Ludus · Jogos do Ensino Médio

**Doze jogos de investigação das quatro áreas do ensino médio** — reconstruídos
com engenharia e carinho para a Sala de Recursos da **EEMTI José Cláudio de
Araújo**. Cada jogo é uma investigação curta, resolvida por toque, teclado ou
voz, no tempo que o estudante precisar.

> Recurso de apoio ao **Atendimento Educacional Especializado (AEE)**, construído
> segundo o **Desenho Universal para a Aprendizagem (DUA)**: sem cronômetro, com
> leitura em voz alta, repetição livre e ritmo próprio.

---

## ✨ O que tem dentro

| Área           | Nível | Jogo                  | BNCC       | O desafio                                                                 |
| -------------- | ----- | --------------------- | ---------- | ------------------------------------------------------------------------- |
| **Linguagens** | 1     | Fonte Suspeita        | EM13LGG102 | Virar 3 evidências, cruzar pistas e decidir o que sobe no canal do grêmio |
|                | 2     | Revisor Crítico       | EM13LGG104 | Encontrar o reparo de coesão/registro e publicar a versão final           |
|                | 3     | Tese e Antítese       | EM13LGG303 | Montar tese forte + prova, responder à objeção e fechar a síntese         |
| **Matemática** | 1     | Orçamento no Limite   | EM13MAT303 | Simular juros compostos ao vivo e decidir entre parcelar e guardar        |
|                | 2     | Função Viva           | EM13MAT302 | Explorar reta e parábola com gráfico vivo; caçar interseção e vértice     |
|                | 3     | Risco Provável        | EM13MAT312 | Montar a urna, simular 100+ sorteios e comparar teoria × frequência       |
| **Natureza**   | 1     | O Circuito Falhou     | EM13CNT306 | Bancada elétrica viva: chave, associação, curto e Lei de Ohm              |
|                | 2     | Reação Equilibrada    | EM13CNT104 | Balancear equações com balança de átomos em tempo real                    |
|                | 3     | Dilema do Gene        | EM13CNT205 | Escolher ambiente e pressão; ver a seleção agir nas gerações              |
| **Humanas**    | 1     | Fonte Histórica       | EM13CHS101 | Criticar fontes (data, autor, intenção) antes de publicar no mural        |
|                | 2     | Território em Disputa | EM13CHS206 | Alocar projetos no mapa e enfrentar a chuva de março                      |
|                | 3     | Dilema Ético          | EM13CHS502 | Viver 3 turnos de escolhas e ver o preço em dinheiro, tempo e saúde       |

Cada jogo tem **3 casos completos** com linguagem reescrita em profundidade —
contexto, dramaturgia leve e feedback pedagógico que explica o _porquê_.

### Estrutura de uma partida

Toda partida segue a mesma gramática de 3 fases (rotina previsível = segurança
cognitiva):

```
Explorar  →  Testar  →  Decidir
(Lente)      (Chave)    (Selo Final)
```

- **Fases e selos** — selos nunca expiram, nunca diminuem: progresso só soma.
- **Veredito** — tela de conclusão com confete, bastidor pedagógico e ações
  ("jogar de novo" / "outro caso" / "outros jogos").
- **Painel de progresso** — coleção de selos, % por área, próximas recomendações.
- **Modo professor** — fichas BNCC, roteiro de uso em sala e links diretos por jogo.

### Acessibilidade (DUA/AEE) — não é extra, é fundação

- 🔊 **Voz em toda parte** — Web Speech API em pt-BR: instruções, evidências e
  vereditos podem ser ouvidos, com realce amarelo acompanhando a leitura.
- 🖤 **Alto contraste** — tema preto/amarelo de alta visibilidade.
- 🔤 **Texto amplo** — base tipográfica +18% com entrelinha maior.
- 🌀 **Menos movimento** — desliga animações (além do `prefers-reduced-motion`).
- ⌨️ **Teclado completo** — toda a jornada por Tab/Enter com foco visível.
- 👆 **Alvos ≥ 48px** — botões grandes e generosos (verificado via DOM).
- 🎨 **Dupla codificação** — nunca só cor: sempre ícone + texto + cor.
- ⏱️ **Sem cronômetro, sem punição** — o erro ensina; tentar de novo é grátis.
- 🔒 **Privacidade por desenho** — progresso no `localStorage` do dispositivo;
  sem contas, sem servidores, sem dado pessoal.

---

## 🚀 Como rodar

Requisitos: **Node.js 20+** (ou **Bun 1.1+**).

```bash
# instalar dependências
npm install        # ou: bun install

# desenvolvimento (http://localhost:3000)
npm run dev        # ou: bun run dev

# produção
npm run build
npm run start      # ou: bun run start
```

> Não usa banco de dados: todo o estado é local ao navegador.
> Funciona em qualquer hospedagem Node (Vercel, Railway, servidor da escola).

---

## 🧱 Stack e arquitetura

| Camada      | Escolha                                                                             |
| ----------- | ----------------------------------------------------------------------------------- |
| Framework   | **Next.js 16** (App Router, React 19)                                               |
| Linguagem   | **TypeScript 5** (strict)                                                           |
| Estilo      | **Tailwind CSS 4** + design system próprio (`ludus-*`)                              |
| Componentes | shadcn/ui (base) + componentes de jogo autorais                                     |
| Animação    | CSS keyframes + `cubic-bezier(0.34, 1.56, 0.64, 1)` (juice com mola)                |
| Estado      | **Zustand** (progresso) + external store (`useSyncExternalStore`) para preferências |
| Ícones      | Lucide (registro central por nome)                                                  |
| Fontes      | **Baloo 2** (display) + **Nunito** (corpo), self-hosted via `next/font`             |

### Mapa do código

```
src/
├── app/                        # layout (fontes/metadata) + page (casca + hash router)
├── lib/
│   ├── catalog.ts              # 12 jogos: área, nível, BNCC, habilidades, objetivos
│   ├── speech.ts               # motor TTS pt-BR (voz preferida + realce)
│   ├── sound.ts                # efeitos sonoros sintetizados (Web Audio, sem arquivos)
│   ├── progress.ts             # store de progresso (zustand + localStorage)
│   ├── router.ts               # hash router (#/jogo/<id>, #/progresso, #/professores)
│   └── format.ts               # formatadores pt-BR (moeda, número, data)
├── components/
│   ├── a11y/                   # provider de preferências DUA (external store)
│   ├── app-shell/              # header, footer
│   ├── hub/                    # hero, cards, busca + filtros
│   ├── game-shell/             # moldura de partida: HUD, fases, selos, feedback,
│   │                           #   veredito com confete, cartas de evidência, opções
│   ├── progress/               # painel de progresso
│   └── teacher/                # modo professor
└── games/
    ├── _shared/use-game-session.ts   # motor de partida (fases/selos/feedback/veredito)
    └── <12 pastas>/                  # cada jogo: content.ts (dados) + index.tsx (palco)
```

### O padrão de jogo

Cada jogo é apenas **conteúdo + palco** — toda a mecânica compartilhada
(fases, selos, feedback, veredito, progresso) vem do hook `useGameSession` e do
componente `GameShell`:

```tsx
const session = useGameSession("fonte-suspeita");

<GameShell game={meta} session={session} mission={…} instruction={…}>
  <Stage session={session} caso={caso} … />   {/* só o palco muda por jogo */}
</GameShell>
```

**Como adicionar um jogo:**

1. Registre os metadados em `src/lib/catalog.ts` (área, nível, BNCC, ícones).
2. Crie `src/games/meu-jogo/content.ts` com os casos e `index.tsx` com o palco
   (as três fases), usando `useGameSession`.
3. Adicione ao mapa em `src/games/registry.ts`.
4. Pronto: hub, progresso, professor e acessibilidade já o cobrem.

---

## 📐 Decisões de design

- **Lúdico premium** (referências Duolingo/Kahoot/Khan): botões 3D com sombra
  "chunky" que afundam ao pressionar, cantos 16–20px, cores vivas por área,
  tipografia arredondada.
- **Juice com parcimônia** — pulso no acerto, shake no erro, confete só no
  veredito; tudo desligável (reduced motion).
- **Sons sintetizados** — arpejos curtos via Web Audio API: zero assets, zero
  rede, zero dependência de arquivo externo.
- **Rota única com hash** — deep links `#/jogo/<id>` funcionam em qualquer
  hospedagem sem configuração de servidor.

---

## 📄 Licença e créditos

- **Licença MIT** — veja [LICENSE](./LICENSE).
- **Créditos**: Sala de Recursos · EEMTI José Cláudio de Araújo · 2026.
- Reconstrução completa (arquitetura, design e conteúdo) do projeto
  _Jogos Interdisciplinares_, preservando seus princípios pedagógicos DUA/AEE
  e sua coleção de mecânicas.
