## Descrição

Descreva o problema, a solução e o motivo da mudança.

## Issue relacionada

Closes #

## Tipo de mudança

- [ ] Correção de bug
- [ ] Funcionalidade nova
- [ ] Novo jogo ou conteúdo didático
- [ ] Acessibilidade
- [ ] Refatoração ou manutenção
- [ ] Documentação
- [ ] Testes ou CI

## Etiquetas

Aplique ao menos uma etiqueta de tipo e uma de área com `gh pr edit --add-label`. Pull requests do Dependabot recebem `dependencies` e dispensam as demais.

- Tipo: `bug`, `enhancement`, `documentation`, `refactor`, `testes`, `ci`, `desempenho` ou `manutencao`
- Área: `area: jogos`, `area: progresso`, `area: acessibilidade`, `area: professor` ou `area: plataforma`

## Commits

- [ ] Cada commit é uma mudança lógica completa e revisável, sem trabalho em andamento.
- [ ] O histórico exposto passou por `git rebase -i --autosquash` e está limpo.
- [ ] Todos os commits do assunto estão neste único pull request.
- [ ] O título segue Conventional Commits, no formato `tipo(escopo): descrição`.

## Como validar

Informe os comandos executados e, quando aplicável, os passos de interface. Inclua capturas de antes e depois em mudanças visuais.

## Riscos e migrações

Descreva riscos, incluindo mudanças que afetam o progresso salvo no dispositivo. Use "Não se aplica" quando não houver.

## Impacto de versão

Aplique a etiqueta `versao:` correspondente ao impacto: `versao: maior` para mudança incompatível, `versao: menor` para funcionalidade nova compatível e `versao: correcao` para correção compatível. A partir da v1.0.0, o changelog é gerado a partir dos commits convencionais, então o título do pull request é a fonte da entrada.

## Acessibilidade

Descreva o que foi verificado quando a mudança afeta a interface, ou informe "Não se aplica".

## Uso de IA

Informe se houve apoio de ferramentas de IA e como o resultado foi revisado. A responsabilidade pela mudança é de quem envia. Commits com geração relevante levam o rodapé `Assisted-by: ferramenta:modelo`.

## Checklist

- [ ] Abri o pull request somente com o trabalho finalizado.
- [ ] Se precisei mexer depois da abertura, converti para rascunho com `gh pr ready --undo` e só marquei como pronto com tudo verde.
- [ ] Segui o padrão de branches e commits do [CONTRIBUTING.md](../CONTRIBUTING.md).
- [ ] Revisei o próprio diff antes de pedir revisão.
- [ ] Rodei `pnpm run lint` e `pnpm run tsc`.
- [ ] Rodei `pnpm run test:e2e:docker` quando a mudança afeta a interface.
- [ ] Verifiquei teclado, contraste, texto amplo e leitura em voz quando aplicável.
- [ ] Atualizei a documentação correspondente e o CHANGELOG.md.
- [ ] Não incluí segredos nem dados reais de estudantes.
