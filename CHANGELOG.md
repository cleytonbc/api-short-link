#### 0.4.0 (07-06-2025)

##### Novas funcionalidades

*  Implementado OpenTelemetry para rastreamento e métricas. ([985b031](https://github.com/cleytonbc/api-short-link/commit/985b031))

##### Tarefas

*  Configurado pre-commit com verificação de lint, formatação de código e testes unitários ([ea763ca](https://github.com/cleytonbc/api-short-link/commit/ea763ca))
*  Configurado pre-push com teste de build e e2e ([ea763ca](https://github.com/cleytonbc/api-short-link/commit/ea763ca))

#### 0.3.1 (06-06-2025)

##### Corrigido

*  Retornando apenas a URL encurtada incluindo domínio (variável API_BASE_URL)  ([b376a4e](https://github.com/cleytonbc/api-short-link/commit/b376a4e))

#### 0.3.0 (06-06-2025)

##### Novas funcionalidades

*  Registrando horário dos acessos/cliques no link encurtado ([45df6f2](https://github.com/cleytonbc/api-short-link/commit/45df6f2))
*  Registrando IP e user Agent do dispositivo que acessou/clicou no link encurtado ([9746002](https://github.com/cleytonbc/api-short-link/commit/9746002))

#### 0.2.0 (04-06-2025)

##### Novas funcionalidades

*  Implementado endpoint para encurtar URL ([5096e27](https://github.com/cleytonbc/api-short-link/commit/5096e27))
*  Implementado acesso a URL encurtada pelo código, sendo redirecionado automaticamente para a URL de destino ([f031cbc](https://github.com/cleytonbc/api-short-link/commit/f031cbc))
*  Implementado endpoint para atualizar URL encurtada ([ba0a5a9](https://github.com/cleytonbc/api-short-link/commit/ba0a5a9))
*  Implementado endpoint para excluir URL encurtada ([08187c4](https://github.com/cleytonbc/api-short-link/commit/08187c4))
*  Implementado endpoint para listar URL encurtadas criada por um usuário ([0378fd6](https://github.com/cleytonbc/api-short-link/commit/0378fd6))

##### Tarefas

*  Aplicado lint e formatação nos arquivos  ([ab27407](https://github.com/cleytonbc/api-short-link/commit/ab27407))
*  Adicionado documentação utilizando swagger ([0049bc4](https://github.com/cleytonbc/api-short-link/commit/0049bc4))


#### 0.1.0 (03-06-2025)

##### Novas funcionalidades

*  Implementado endpoint para criação de usuário ([4414960](https://github.com/cleytonbc/api-short-link/commit/4414960))
*  Adicionado autenticação ([a5ebbcf](https://github.com/cleytonbc/api-short-link/commit/a5ebbcf))