## Pré-requisitos

* [Docker](https://www.docker.com/) 
* [Git](https://git-scm.com/)


## Tecnologias

- **Node.js**
- **NestJS**
- **Prisma**
- **PostgreSQL**
- **Docker & Docker Compose**
- **OpenTelemetry (OTEL)**


## Configuração

1. Clone o repositório:

```bash
git clone https://github.com/cleytonbc/api-short-link.git
cd api-short-link
```

2. Copie o arquivo de exemplo das variáveis de ambiente para o arquivo .env ou renomeie o .env.example para .env:

```bash
cp .env.example .env
```

3. Edite o `.env` com suas configurações desejadas (As variáveis de exemplo já são funcionais, apenas caso não haja conflitos de portas).

> Explicações sobre as varáveis [abaixo](#variáveis-de-ambiente)

4. Executando o Docker

4.1 Para produção:

```bash
docker compose up -d --build 
```
(dependendo da versão o comando pode ser docker-compose)

> Ao executar irá subir os containers do app, do postgres e já executa `npx prisma migrate deploy` para aplicar as migrations automaticamente

4.2 Para desenvolvimento:

```bash
docker compose -f docker-compose.dev.yml up --build -d
```


## Documentação


A API no docker roda por padrão na porta **3333**.

* API: [`http://localhost:3333`](http://localhost:3333)
* Documentação Swagger: [`http://localhost:3333/docs`](http://localhost:3333/docs)
* Arquivo JSON do Swagger: [`http://localhost:3333/docs-json`](http://localhost:3333/docs-json)

> Caso não esteja rodando no ambiente local, substitua localhost pelo IP ou hostname do servidor.
Se alterou a porta no docker-compose.yml, substitua a porta 3333 pela porta configurada.

### Endpoint`s
#### Autenticação
| Método | Rota             | Descrição                       | 
| ------ | ---------------- | ------------------------------- |
| POST   | `/auth/login`    | Efetuar login                   |
| POST   | `/auth/register` | Criar um novo usuário           |

#### health
| Método | Rota             | Descrição                       | 
| ------ | ---------------- | ------------------------------- |
| GET    | `/health`        | Checar se a API está online     |

#### Encurtador de URL
| Método | Rota             | Descrição                                                                                 | 
| ------ | ---------------- | ----------------------------------------------------------------------------------------- |
| POST   | `/shorten`       | Criar uma nova URL encurtada                                       |
| GET    | `/:code`         | Redirecionar para a URL original a partir do código encurtado                            |
| GET    | `/shorten`       | Listar todas as URLs encurtadas do usuário autenticado                                   |
| PUT    | `/shorten/:id`   | Atualizar uma URL encurtada                                                  |
| DELETE | `/shorten/:id`   | Excluir uma URL encurtada pelo ID                                            |

#### Analytics
| Método | Rota                        | Descrição                                                        | 
| ------ | --------------------------- | ---------------------------------------------------------------- |
| GET    | `/analytics/clicks-summary` | Obter resumo de cliques das URLs do usuário autenticado, com filtros | 

## Autenticação

A autenticação é feita via login com **usuário e senha**, retornando um **JWT**. Esse token deve ser enviado via `Authorization: Bearer <token>` nas requisições autenticadas.

## Testes

Foi adicionado testes unitários e testes de integração para garantir o correto funcionamento do sistema e ajudar encontrar/reduzir bugs. 

Para executar os testes:

* Só é possível caso esteja rodando o docker para desenvolvimento
```bash
Rodar testes unitários: docker exec api-short-link npm run test
Rodar testes de integração: docker exec api-short-link npm run test:e2e
Rodar os 2 na sequência:docker exec api-short-link npm run test:all
```

##  Variáveis de Ambiente

Essas variáveis são utilizadas para configurar o funcionamento da API.

---

### Autenticação

| Variável           | Descrição                                                   | Exemplo                     |
|--------------------|-------------------------------------------------------------|-----------------------------|
| `JWT_SECRET`       | Necessária para criptografar e manter seguro o token JWT    | `sua-chave-secreta`        |
| `JWT_EXPIRES_IN`   | Tempo de expiração do token JWT                             | `1h`, `2d`, `24h`           |

---

###  Banco de Dados

| Variável           | Descrição                                         | Exemplo                                                                 |
|--------------------|---------------------------------------------------|-------------------------------------------------------------------------|
| `DATABASE_URL`     | URL de conexão com o banco de dados PostgreSQL    | `postgresql://postgres:postgres@postgres_db:5432/short-link?schema=public` |

---

### Aplicação

| Variável           | Descrição                                                                 | Exemplo                 |
|--------------------|---------------------------------------------------------------------------|-------------------------|
| `PORT`             | Porta em que o app irá rodar. Padrão: `3000`.                              | `3000`                  |
|            | Caso diferente de 3000 deve ser alterado no docker compose                            |                  |
| `API_BASE_URL`     | Deverá ser informado o endereço que está rodando o app                                      | `http://localhost:3333` |
|      | é utilizado para o domínio do link encurtado                                    |  |

> **Importante**: o endereço da API_BASE_URL irá compor o link enviado para o usuário, importante que seja exato e acessível,
> exemplo caso informado http://localhost:3333 o link enviado será algo do tipo http://localhost:3333/aUhde_
---

### Observabilidade (OpenTelemetry)

| Variável                       | Descrição                                                                 | Exemplo                         |
|--------------------------------|---------------------------------------------------------------------------|---------------------------------|
| `APP_NAME`                     | Nome do serviço no OpenTelemetry                                          | `api-short-url`                 |
| `OTEL_ENABLED`                 | Habilita ou desabilita a observabilidade (`true` ou `false`)              | `false`                         |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Endereço do coletor OpenTelemetry                                        | `http://localhost:4317`         |
| `OTEL_AUTH_HEADER_KEY`        | Nome do cabeçalho para autenticação                                       | `Authorization`                 |
| `OTEL_AUTH_HEADER_VALUE`      | Valor do cabeçalho de autenticação, geralmente com `Bearer <token>`       | `Bearer seu-token-aqui`         |




## Deploy

O processo de deploy é automatizado via GitHub Actions e é executado a cada push na branch main.
Atualmente, o aplicativo está hospedado em uma máquina virtual de testes com recursos limitados, o que pode ocasionar algumas instabilidades.

ela está acessível via https://lnk.cbc.app.br

A documentação está disponível em https://lnk.cbc.app.br/docs


## Extra

Foi adicionado um endpoint para relatórios dos cliques, onde é possível ver a quantidade de cliques que uma URL encurtada, somente as criadas com usuário autenticado, o relatório trás o dia, a hora(sem os minutos) e a quantidade de clique.
Exemplo:
```
"shortCode": "NvUS0_"
"originalUrl": "http://www.google.com"
"clickDate": "2025-06-08T00:00:00.000Z"
"clickHour": 13
"clickCount": 2
```

Todos os endpoints que recebem dados de entrada estão sendo validados utilizando a biblioteca Zod.

Foi adicionada observabilidade com envio de métricas e rastreamento para o OpenTelemetry Collector. Os logs permanecem apenas no terminal da aplicação.

Foi configurado o GitHub Actions para executar lint, testes e deploy em uma máquina virtual (VM).

As versões foram tagueadas e foi criado um arquivo CHANGELOG.md contendo as informações das mudanças.

Foram adicionados hooks de pre-commit (executando lint, formatação e testes unitários) e de pre-push (verificação de build e testes de integração).

Foi adotado um fluxo de versionamento onde cada nova funcionalidade foi desenvolvida em uma branch feature/*. Após a finalização, foi criado um Pull Request para a branch main. As branches develop e release não foram utilizadas, considerando a finalidade do projeto.

Foram adicionadas melhorias no tratamento de exceções para evitar que o usuário visualize mensagens de erro indesejadas ou impróprias.

Recomenda-se que o Node.js seja >=18.19.1 

## Escalabilidade Horizontal: Pontos de Melhoria e Desafios

A arquitetura atual está bem dividida e modular, o que facilita uma futura migração para microsserviços. Embora atualmente o sistema contenha apenas o controle de usuários e o encurtamento de URLs, ambos poderiam ser escalados separadamente.

#### Pontos de melhoria
##### Cache com Redis

Utilizar o Redis para armazenar em cache o resultado de consultas, com expiração de 10 a 15 minutos, reduzindo a carga no banco de dados.
*Obs.: Exige uma alteração do contador de cliques, para ser gravado por evento, pois atualmente é atualizado ao consultar*

##### Balanceamento de carga
Utilizar um API Gateway ou Load Balancer para distribuir as requisições entre múltiplas instâncias da aplicação.

##### Fila de eventos para contagem de cliques
Ao invés de atualizar o contador diretamente, enviar o clique para uma fila (ex: Redis, RabbitMQ) e processar de forma assíncrona, evitando concorrência direta.

#####  Replicação de banco para leitura
Utilizar réplicas do PostgreSQL apenas para leitura, o que ajuda a reduzir o consumo na instância principal.

#####  Autoscaling com Kubernetes
Configurar o Kubernetes para escalar automaticamente as instâncias conforme a carga.

##### Rate Limiting:
O Throttler do NestJS, por padrão, armazena o estado em memória. Para múltiplas instâncias, ideal seria utilizar o Redis para garantir limitação global, ou se tiver um API Gateway, configurar diretamente nele.

#### Maiores desafios
##### Contador de cliques
Garantir a integridade do contador de cliques em cenários de alto volume de acesso ao mesmo link.

##### Limites do PostgreSQL
O banco pode enfrentar problemas de concorrência em conexões simultâneas em ambientes de alta escala.
