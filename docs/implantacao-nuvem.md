# Implantação em nuvem

O projeto pode ser implantado na AWS, no Azure ou no GCP com Terraform, além da Vercel. Cada nuvem tem um módulo raiz independente em `infra/terraform/<nuvem>`, com dois modos:

- `modo_local = true`: usa os emuladores do Floci, recursos mínimos e as imagens locais. Serve para testar o Terraform e a aplicação sem conta em nuvem.
- `modo_local = false`: caminho de produção, com serviços gerenciados de computação, registro de imagens e observabilidade.

O Ludus não tem banco, storage, cache nem variáveis de ambiente obrigatórias: todo o estado fica no `localStorage` do navegador e a aplicação é stateless. Por isso os módulos cuidam apenas de computação, rede, observabilidade e registro de imagens. A sonda de saúde é `GET /api`, que devolve nome, status e horário.

## Arquitetura por nuvem

| Camada | AWS | Azure | GCP |
| --- | --- | --- | --- |
| Computação | ECS Fargate atrás de ALB | App Service (produção) e Container Apps (modo local) | Cloud Run v2 |
| Registro de imagens | ECR | Azure Container Registry | Artifact Registry |
| Observabilidade | CloudWatch Logs e alarmes | Log Analytics e alerta de 5xx | Cloud Logging e alerta de 5xx |
| Rede | VPC com sub-redes públicas e privadas | sem VNet dedicada | sem VPC dedicada |
| Segredos | não há | não há | não há |

Como a aplicação não guarda dados no servidor, não existem migrações, backups nem cofres de segredos. O estado local do navegador não trafega para a nuvem.

## Pré-requisitos

- Terraform 1.11 ou superior.
- Docker com Compose.
- Emuladores Floci (`floci`, `floci-az` e `floci-gcp`).
- AWS CLI, Azure CLI e gcloud apenas para inspeção manual; os scripts usam `curl` e o próprio Terraform.
- Node 20 ou superior para construir a imagem da aplicação.

## Estrutura

```text
infra/
  floci/
    compose.floci.yml   # emuladores usados nos testes locais e no CI
    testar.sh           # ciclo completo por nuvem
  terraform/
    validar.sh          # init sem backend e validate nas três nuvens
    aws/
    azure/
    gcp/
```

Cada módulo tem `versions.tf`, `providers.tf`, `variables.tf`, `locals.tf`, os recursos separados por assunto, `outputs.tf` e os exemplos `terraform.tfvars.example`, `terraform.tfvars.local.example` e `backend.hcl.example` em cada nuvem. Os arquivos `.tfvars` reais não são versionados.

A imagem da aplicação é definida na raiz do repositório: o `Dockerfile` compila o Next.js em estágios e executa a saída `standalone` com o usuário `node` na porta 3000.

## Comandos

```bash
pnpm run infra:fmt        # formata todos os módulos
pnpm run infra:validar    # init sem backend e validate nas três nuvens
pnpm run infra:floci      # aplica e destrói nas três nuvens pelo Floci
pnpm run infra:floci:aws  # apenas AWS
pnpm run infra:floci:azure
pnpm run infra:floci:gcp
```

O script `infra/floci/testar.sh` constrói a imagem `ludus:local` quando necessário, sobe os emuladores quando as portas padrão não respondem, aplica o Terraform, confere `GET /api` e destrói os recursos. Use `MANTER=true` para preservar o ambiente após o teste.

## Modo de produção

1. Publique a imagem no registro da nuvem e informe `imagem_aplicacao`.
2. Copie `terraform.tfvars.example` para `terraform.tfvars` e ajuste os valores. Na AWS, informe também `certificado_arn`; o balanceador só encaminha HTTP na ausência do certificado no modo local.
3. Configure o backend remoto. Cada nuvem tem um exemplo em `backend.hcl.example`: na AWS com bucket versionado, criptografia e lockfile; no Azure com conta de armazenamento e autenticação do Entra ID; no GCP com bucket versionado.
4. Rode `terraform init` e `terraform plan` e revise o plano antes de aplicar. O repositório não aplica em produção por conta própria.

Sem banco e sem segredos, não há migrações nem rotação de credenciais: o primeiro deploy pode escalar direto para a quantidade desejada de réplicas.

## Limites do modo local

- A AWS não cria ECR e o Azure não cria ACR no modo local, porque o emulador mantém o registro de apoio inalcançável após a primeira operação e a exclusão do recurso não conclui.
- O ECS emulado roda a imagem local; o balanceador responde pelo IP do Floci com o cabeçalho `Host` do DNS do ALB.
- O Container Apps emulado exige `FLOCI_AZ_SERVICES_CONTAINER_APPS_MOCKED=false` e TLS, configuração já presente em `compose.floci.yml`. Cada teste usa um sufixo de revisão novo para forçar a revisão.
- O ingresso do Container Apps e do Cloud Run emulados usa um cliente HTTP que tenta upgrade h2c; o servidor do Next.js encerra o socket sem resposta e o proxy devolve `ContainerAppUnavailable` ou `Cloud Run runtime connection failed`. Por isso o teste confere `GET /api` nos contêineres criados pelos emuladores, e não pelos endereços de ingresso. O balanceador emulado da AWS repassa a requisição normalmente, então só lá o smoke usa o ingresso.
- O Cloud Run emulado responde pelo endereço do serviço com o cabeçalho `Host`; o Artifact Registry existe apenas em produção.
- O App Service não é emulado: o caminho de produção do Azure é validado por `terraform validate` e não pelo Floci.

## Segurança

- Nenhum segredo é versionado: a aplicação não exige credenciais e não persiste dados no servidor.
- O balanceador e o App Service só aceitam HTTPS em produção; a porta 80 redireciona para 443 na AWS.
- As tarefas ECS ficam em sub-redes privadas com grupos de segurança encadeados, sem portas de aplicação expostas.
- As roles seguem o menor privilégio, com escopo nos recursos criados pelo módulo.
- O domínio próprio é opcional. Sem ele, o TLS usa os endpoints gerenciados de cada plataforma. Na AWS o alias é criado no Route 53 quando `dominio` e `zona_hospedada_id` são informados, junto do `certificado_arn` validado. No Azure e no GCP o binding do hostname com certificado gerenciado acontece fora do Terraform; nesses dois provedores a variável `dominio` apenas compõe o `APP_URL` e deve ser preenchida depois do binding.
