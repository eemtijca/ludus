# Como contribuir

Este documento reúne as orientações para quem for propor correções, novos jogos, textos ou mídias no projeto. Leia antes de abrir uma contribuição.

## Sobre o projeto

O repositório mantém doze jogos digitais de curta duração usados na Sala de Recursos da EEMTI José Cláudio de Araújo. Cada jogo retoma um conceito trabalhado em sala e propõe uma situação simples, resolvida por toque ou clique.

O material segue os princípios do Desenho Universal para a Aprendizagem (D.U.A.) e do Atendimento Educacional Especializado (A.E.E.). Não há cronômetro, as atividades podem ser repetidas sem limite e cada tela tem apoio de áudio.

## Princípios do projeto

- Funciona aberto direto do disco, sem servidor e sem etapa de compilação.
- Usa apenas HTML, CSS e JavaScript. Sem frameworks e sem dependências de execução.
- Os textos são acessíveis, em português, e as mídias têm nomes legíveis.

## Como contribuir

### Relatar um problema

Descreva o que aconteceu, em qual jogo e em qual navegador. Se possível, informe os passos para reproduzir e o comportamento esperado.

### Propor uma melhoria

Explique o objetivo pedagógico da mudança e a quem ela atende. Mudanças de texto e de acessibilidade são bem-vindas.

### Enviar uma alteração

1. Crie um ramo a partir de `main`.
2. Faça a alteração seguindo os padrões deste documento.
3. Rode `npm run validate` e corrija o que for apontado.
4. Abra a solicitação de incorporação com uma descrição curta do que mudou e por quê.

## Ambiente e comandos

É necessário Node.js 18 ou superior. Opcionalmente, Python 3 para servir o site localmente.

```bash
npm install        # instala as ferramentas de desenvolvimento
npm run format     # formata HTML, CSS, JS e Markdown
npm run validate   # confere formatação, HTML e sintaxe do JS
npm run serve      # sobe o site em http://localhost:8765
```

As ferramentas de desenvolvimento não afetam a publicação. O site continua estático.

## Estrutura do projeto

```
.
├── index.html            Página inicial com a lista de jogos
├── README.md
├── CONTRIBUTING.md       Este documento
├── LICENSE
├── package.json
├── .htmlvalidate.json    Configuração do validador de HTML
├── assets/
│   ├── css/style.css     Estilo compartilhado
│   ├── js/script.js      Funções compartilhadas (objeto AEE)
│   ├── imagens/          Ilustrações usadas nos jogos
│   └── audio/            Recados em áudio
└── jogos/
    ├── <nome>.html       Página de cada jogo
    └── <nome>.js         Regra de cada jogo
```

Cada jogo tem um HTML e um JS com o mesmo nome. As páginas usam caminhos relativos.

## Padrões de código

- Todo o código, os comentários e os identificadores ficam em português.
- Nomes de arquivos, classes, identificadores e funções usam a forma mais descritiva possível.
- Comentários explicam decisões, não repetem o código. Escreva apenas onde a intenção não for óbvia.
- Não use estilos nem scripts embutidos nas páginas. O estilo fica em `assets/css/style.css` e o comportamento em arquivos `.js`.
- As páginas de jogo dependem de `../assets/js/script.js` antes do próprio script.
- Não introduza dependências de execução. O projeto deve continuar abrindo sem rede.
- Mantenha o suporte a toque, teclado e leitor de tela.

## Guia de tom e escrita

Os textos precisam ser compreensíveis para estudantes com diferentes níveis de leitura, sem parecerem frios nem infantis.

### Voz

Institucional e sóbria. A escola fala de forma direta e respeitosa.

- Frases curtas e afirmativas.
- Tratamento por imperativo neutro: "Toque a placa e depois a sala."
- Sem primeira pessoa, sem exclamação, sem gírias.
- Sem emoção exagerada nem elogio vazio. O retorno diz o que aconteceu.

### Terminologia

| Use            | Evite                    |
| -------------- | ------------------------ |
| estudante      | aluno, criança, menino   |
| recado         | fala, mensagem, narração |
| placa          | cartaz, sinal            |
| toque          | clique, aperte           |
| sem cronômetro | sem tempo, sem pressa    |

Os nomes de componentes curriculares seguem a forma usada na escola.

### Pontuação

- Sem travessão. Use vírgula ou ponto.
- Uma ideia por frase.
- Ponto final em todas as mensagens de retorno.

### O que evitar

- Travessão e reticências decorativas.
- Conectivos de preenchimento: "além disso", "vale destacar", "de forma geral".
- Listas de três itens por simetria.
- Início de documento com "Este documento...".
- Referências a ferramentas de geração de texto ou de voz.
- Repetir a mesma mensagem genérica em jogos diferentes.

### Mensagens de retorno

Cada mensagem descreve o que o estudante fez, e não apenas aprova.

- Acerto: "Correto. A fila foi organizada sem empurrão."
- Erro: "Esta placa não pede silêncio. Observe as demais."
- Conclusão: "Correto. O ciclo da água retorna ao início."

## Como adicionar um jogo

1. Crie `jogos/meu-jogo.html` copiando a estrutura de um jogo existente.
2. Crie `jogos/meu-jogo.js` e chame `AEE.montarTela` com título, bimestre, etiquetas, áudio e instrução.
3. Use `AEE.certo`, `AEE.errado` e `AEE.concluir` para as mensagens de retorno.
4. Coloque a imagem em `assets/imagens/` e o áudio em `assets/audio/`.
5. Adicione um cartão em `index.html` apontando para a nova página.
6. Atualize a tabela de jogos no `README.md`.
7. Rode `npm run validate`.

## Como adicionar ou trocar mídia

- Nomes de imagens e áudios são descritivos, em português e sem numeração.
- Imagens ficam em `assets/imagens/` e áudios em `assets/audio/`.
- Prefira imagens leves e com fundo neutro, no mesmo estilo das existentes.
- Não remova mídia sem confirmar que nenhum jogo a utiliza.

## Licença

Ao contribuir, você concorda em licenciar sua contribuição sob a licença MIT deste repositório.
