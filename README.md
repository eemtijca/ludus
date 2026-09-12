# Jogos interdisciplinares

Conjunto de doze jogos digitais de curta duração, elaborados para a Sala de Recursos da EEMTI José Cláudio de Araújo. Cada jogo retoma um conceito trabalhado em sala e propõe uma situação simples, resolvida por toque ou clique.

O material segue os princípios do Desenho Universal para a Aprendizagem (D.U.A.) e do Atendimento Educacional Especializado (A.E.E.): não há cronômetro, as atividades podem ser repetidas sem limite e cada tela tem apoio de áudio.

## Como usar

Abra o arquivo `index.html` em um navegador atualizado (Chrome, Edge ou Firefox). O botão **Ouvir** reproduz o recado da tela. O botão **De novo** reinicia a atividade.

O conteúdo também pode ser publicado em um servidor estático ou no GitHub Pages, sem ajustes.

## Jogos

| Nº  | Título               | Componentes curriculares    |
| --- | -------------------- | --------------------------- |
| 01  | Placa de silêncio    | Português, Arte             |
| 02  | Fila com respeito    | Sociologia, Educação Física |
| 03  | Chamar para a roda   | Sociologia                  |
| 04  | Espere o verde       | Sociologia, Geografia       |
| 05  | Ciclo da água        | Física, Geografia           |
| 06  | Toque para contar    | Matemática                  |
| 07  | Pagar na feira       | Matemática                  |
| 08  | Cesta da feira       | Biologia                    |
| 09  | Manhã, tarde e noite | Geografia                   |
| 10  | O que é do sertão    | Biologia, Geografia         |
| 11  | Lixo na lixeira      | Sociologia                  |
| 12  | Dividir é justo      | Filosofia, Matemática       |

## Estrutura de pastas

```
.
├── index.html            Página inicial com a lista de jogos
├── README.md
├── CONTRIBUTING.md       Orientações para contribuir
├── LICENSE
├── package.json          Ferramentas de formatação e verificação
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

Cada jogo tem um HTML e um JS com o mesmo nome. As páginas usam caminhos relativos, de modo que o projeto funciona aberto direto do disco, sem servidor.

## Como adicionar um jogo

1. Crie `jogos/meu-jogo.html` copiando a estrutura de um jogo existente.
2. Crie `jogos/meu-jogo.js` e chame `AEE.montarTela` com título, bimestre, etiquetas, áudio e instrução.
3. Coloque a imagem em `assets/imagens/` e o áudio em `assets/audio/`, com nomes em português.
4. Adicione um cartão em `index.html` apontando para a nova página.

As mensagens de acerto, erro e conclusão usam `AEE.certo`, `AEE.errado` e `AEE.concluir`.

## Desenvolvimento

O projeto não tem etapa de compilação. As ferramentas abaixo servem apenas para padronizar e conferir os arquivos.

```bash
npm install        # instala as ferramentas de desenvolvimento
npm run format     # formata HTML, CSS, JS e Markdown
npm run validate   # confere formatação, HTML e sintaxe do JS
npm run serve      # sobe o site em http://localhost:8765
```

Antes de enviar qualquer alteração, consulte o `CONTRIBUTING.md`.

## Créditos

EEMTI José Cláudio de Araújo · Sala de Recursos · 2026.

O projeto é distribuído sob a licença MIT. Consulte o arquivo `LICENSE`.
