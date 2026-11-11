# 🚀 PROJETO 7 — API DE INSCRICOES DA ESCOLA MUSICA

# 🎯 PROBLEMA

A **Escola Musica** cresceu e o controle de inscricoes deixou de caber no caderno. A equipe foi contratada para construir a API que o aplicativo vai consumir.

Na reunião de alinhamento, a responsável contou dois problemas que o sistema antigo tinha:

> "Às vezes o registro entrava sem o nome do aluno, e ninguém sabia para quem era."
>
> "E quando dava erro, a tela mostrava uma mensagem gigante em inglês que ninguém entendia."

Por isso, dois requisitos não são negociáveis: **nenhum registro inválido pode entrar** e **todo erro tem que devolver uma mensagem clara, com o código HTTP certo**.

A API ainda não terá banco de dados — os inscricoes ficam em memória, num array. O que importa nesta entrega é a **validação** e o **tratamento de erros**.

Seu trabalho é construir essa API.

> ⏱️ **Tempo:** este projeto é feito em **um dia de aula (60 minutos)**, com prazo de entrega estendido. Ele foi dimensionado para ser concluído em 60 a 100 minutos no total.

# 📋 PROJETO

Todas as rotas respondem em **JSON**, e a aplicação precisa ter o `express.json()` habilitado.

Os inscricoes iniciais são:

```jsx
{ id: 1, aluno: "Ana", curso: "Violao Iniciante", meses: 6, situacao: "trancada" }
{ id: 2, aluno: "Bruno", curso: "Teclado Basico", meses: 3, situacao: "ativa" }
{ id: 3, aluno: "Carla", curso: "Bateria Avancada", meses: 12, situacao: "ativa" }
```

### RF01 — Listagem com filtros opcionals

A rota `GET /inscricoes` deve responder **200** com todos os inscricoes.

Ela também deve aceitar dois filtros opcionais pela query string:

| Query | Resultado |
| --- | --- |
| `GET /inscricoes` | todos os inscricoes |
| `GET /inscricoes?situacao=ativa` | só os inscricoes com aquele `situacao` |
| `GET /inscricoes?mesesMin=12` | só os inscricoes com `meses` maior ou igual ao informado |
| `GET /inscricoes?situacao=ativa&mesesMin=12` | os dois filtros aplicados juntos |

⚠️ Os filtros são opcionais: a rota tem que funcionar sem nenhum deles. E lembre-se de que tudo que vem da query chega como **texto**.

### RF02 — Busca por id

A rota `GET /inscricoes/:id` deve responder **200** com o registro correspondente.

```
GET /inscricoes/2

200
{ id: 2, aluno: "Bruno", curso: "Teclado Basico", meses: 3, situacao: "ativa" }
```

Se o id não existir, a rota **não deve responder diretamente**: ela deve criar um erro com a mensagem `"Inscricao nao encontrado"` e o status **404**, e encaminhá-lo ao middleware de erro com `next(erro)`.

```
GET /inscricoes/99

404
{ "erro": "Inscricao nao encontrado" }
```

⚠️ O id vem do caminho como texto. Compare com o array convertendo para número.

### RF03 — Criação com middleware de validação

A rota `POST /inscricoes` deve usar um **middleware de validação** próprio, chamado `validarInscricao`, aplicado **somente nessa rota** (não com `app.use`).

O middleware deve recusar o registro nestes casos, sempre com status **400**:

| Situação | Mensagem no campo `erro` |
| --- | --- |
| `aluno` não foi enviado | `O campo aluno e obrigatorio` |
| `curso` não foi enviado | `O campo curso e obrigatorio` |
| `meses` não é um número | `O campo meses deve ser um numero` |
| `meses` é menor ou igual a zero | `O campo meses deve ser maior que zero` |

A ordem de verificação é a da tabela: se faltarem `aluno` e `curso` ao mesmo tempo, a mensagem devolvida é a do `aluno`.

Se estiver tudo válido, o middleware segue para a rota, que deve responder **201**:

```
POST /inscricoes
{ aluno: "Diego", curso: "Violao Iniciante", meses: 6 }

201
{ "mensagem": "Registro de inscricao criado" }
```

O registro criado deve ser **acrescentado ao array**, de forma que uma nova chamada a `GET /inscricoes` já o inclua. O `id` deve ser o maior id existente **mais um**, e o `situacao` deve começar como `"pendente"`.

### RF04 — Rota inexistente e middleware de erro

Depois de todas as rotas, a aplicação deve registrar:

**1. Um tratamento para caminho inexistente**, respondendo **404**:

```
GET /qualquer-coisa

404
{ "erro": "Rota nao encontrada" }
```

**2. Um middleware de erro**, com os **quatro** parâmetros `(erro, req, res, next)`, que responde:

- com o status de `erro.status`, ou **500** quando o erro não trouxer status;
- com o corpo `{ "erro": <mensagem do erro> }`.

📌 Lembre-se da regra da aula 10: **4xx é culpa de quem pediu, 5xx é culpa de quem respondeu.** Campo obrigatório faltando é 400, nunca 500.

# 📁 ESTRUTURA DO PROJETO

O projeto deverá possuir, no mínimo:

```
escola-musica-inscricoes
┣ index.js                     ← app, express.json() e montagem do router, rota 404 e middleware de erro
┣ middlewares
┃ ┗ validarInscricao.js    ← middleware de validacao
┣ routes
┃ ┗ inscricoes.js            ← rotas de inscricoes
┣ test
┃ ┗ inscricoes.test.js
┣ package.json
┣ package-lock.json
┗ README.md
```

Regras de exportação:

```jsx
// middlewares/validarInscricao.js
module.exports = validarInscricao

// routes/inscricoes.js
module.exports = router

// index.js
module.exports = app
```

O router deve ser montado sob o prefixo `/inscricoes`, então os caminhos declarados dentro dele são `/` e `/:id`.

⚠️ **Não** chame `app.listen()` dentro do `index.js`.

### ⏱️ Ordem sugerida de ataque

| Momento | O que fazer |
| --- | --- |
| primeiros 15 min | `index.js` com `express.json()` + router com o `GET /` simples (RF01 sem filtros) |
| 15 a 35 min | filtros da query (RF01) e o `GET /:id` com o 404 (RF02) |
| 35 a 50 min | o middleware de validação e o POST (RF03) |
| últimos 10 min | rota inexistente e middleware de erro (RF04) |

O estudante deverá decidir como organizar as funções dentro dos arquivos.

# 🧪 TESTANDO NO BRUNO

Antes de entregar, teste sua API no **Bruno**, como um cliente de verdade faria. Se ainda não instalou a extensão, siga a seção **Mão na massa** da aula 9.

📌 Esta parte é para você conferir sua API. Ela não é cobrada na entrega nem muda a correção automática.

**1.** Crie o arquivo `servidor.js` na pasta do projeto. Ele é um arquivo a mais, e o `index.js` continua sem `app.listen()`:

```jsx
const app = require("./index")

const porta = Number(process.env.PORT) || 3000

app.listen(porta, () => {
    console.log(`Servidor na porta ${porta}`)
})
```

**2.** Suba o servidor e deixe o terminal aberto:

```bash
node --watch servidor.js
```

**3.** Crie uma coleção no Bruno, com **Location** na pasta do projeto.

**4.** Crie uma requisição para cada linha abaixo, usando `http://localhost:3000` no começo da URL. Envie cada uma e confira se o status é o esperado.

| Requisito | Método | URL | Dado enviado | Status |
| --- | --- | --- | --- | --- |
| RF01 | GET | `/inscricoes` | — | 200 |
| RF01 | GET | `/inscricoes` | **Params → Query**: um filtro da tabela do RF01 | 200 |
| RF02 | GET | `/inscricoes/:id` | **Params → Path**: `id` = `2` | 200 |
| RF02 | GET | `/inscricoes/:id` | **Params → Path**: `id` = `99` | 404 |
| RF03 | POST | `/inscricoes` | **Body**: o exemplo válido do RF03 | 201 |
| RF03 | POST | `/inscricoes` | **Body**: uma requisição para cada erro da tabela do RF03 | 400 |
| RF04 | GET | `/qualquer-coisa` | — | 404 |

⚠️ No Body, o JSON precisa de aspas duplas nas chaves. O exemplo do RF03 está resumido, então escreva `{ "campo": "valor" }`, e não `{ campo: "valor" }`.

Nas requisições de erro, confira também a mensagem no campo `erro`.

**5.** Reinicie o servidor, rode tudo com **Run Collection** e confira se cada status bate com a tabela.
