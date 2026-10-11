# Portabilidade

O release é o artefato: a tag `vX.Y.Z` e a imagem publicada no GHCR são a fonte da verdade, e a plataforma de deploy é um adaptador.

## Alvo de deploy

- O workflow `implantacao.yml` lê a variável `DEPLOY_TARGET` do repositório; vazia ou `vercel` publica na Vercel.
- Para trocar de plataforma, adicione o job do novo alvo e ajuste a variável, sem mexer em tags, changelog ou migrações.

## Artefato

- `publicacao.yml` publica `ghcr.io/<repo>:<versão>` e `:<major>.<minor>` em releases estáveis; `latest` só em versão estável.
- Os rótulos OCI registram versão, revisão e origem da imagem.

## Saída da Vercel

1. Provisionar a infraestrutura com os módulos Terraform existentes apontando `imagem_aplicacao` para a imagem do release.
2. Configurar as variáveis e o domínio no novo host e cortar o DNS.
3. Manter as agendas no GitHub Actions e desligar as equivalentes do provedor.
4. Conferir `/api` e os fluxos principais, mantendo os dois hosts por um período de rollback.
5. Definir `DEPLOY_TARGET` para o novo alvo e desativar o projeto na Vercel.

## Ensaio local

1. Gerar a imagem pela `publicacao.yml` (dispatch manual) ou com `docker build`.
2. Executar o contêiner e conferir `/api`.
3. Rodar `pnpm run infra:floci` para exercitar o Terraform nos emuladores.
