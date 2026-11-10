# 🚀 PROJETO 7 — API DE HORARIOS DA BARBEARIA

# 🎯 PROBLEMA

A **Barbearia** cresceu e o controle de horarios deixou de caber no caderno. A equipe foi contratada para construir a API que o aplicativo vai consumir.

Na reunião de alinhamento, a responsável contou dois problemas que o sistema antigo tinha:

> "Às vezes o registro entrava sem o nome do cliente, e ninguém sabia para quem era."
>
> "E quando dava erro, a tela mostrava uma mensagem gigante em inglês que ninguém entendia."

Por isso, dois requisitos não são negociáveis: **nenhum registro inválido pode entrar** e **todo erro tem que devolver uma mensagem clara, com o código HTTP certo**.

A API ainda não terá banco de dados — os horarios ficam em memória, num array. O que importa nesta entrega é a **validação** e o **tratamento de erros**.

Seu trabalho é construir essa API.

> ⏱️ **Tempo:** este projeto é feito em **um dia de aula (60 minutos)**, com prazo de entrega estendido. Ele foi dimensionado para ser concluído em 60 a 100 minutos no total.

# 📋 PROJETO

Todas as rotas respondem em **JSON**, e a aplicação precisa ter o `express.json()` habilitado.

Os horarios iniciais são:

```jsx
{ id: 1, cliente: "Ana", corte: "Social", valor: 35, situacao: "faltou" }
{ id: 2, cliente: "Bruno", corte: "Degrade", valor: 45, situacao: "atendido" }
{ id: 3, cliente: "Carla", corte: "Navalhado", valor: 55, situacao: "atendido" }
```

### RF01 — Listagem com filtros opcionals

A rota `GET /horarios` deve responder **200** com todos os horarios.

Ela também deve aceitar dois filtros opcionais pela query string:

| Query | Resultado |
| --- | --- |
| `GET /horarios` | todos os horarios |
| `GET /horarios?situacao=atendido` | só os horarios com aquele `situacao` |
| `GET /horarios?valorMin=55` | só os horarios com `valor` maior ou igual ao informado |
| `GET /horarios?situacao=atendido&valorMin=55` | os dois filtros aplicados juntos |

⚠️ Os filtros são opcionais: a rota tem que funcionar sem nenhum deles. E lembre-se de que tudo que vem da query chega como **texto**.

### RF02 — Busca por id

A rota `GET /horarios/:id` deve responder **200** com o registro correspondente.

```
GET /horarios/2

200
{ id: 2, cliente: "Bruno", corte: "Degrade", valor: 45, situacao: "atendido" }
```

Se o id não existir, a rota **não deve responder diretamente**: ela deve criar um erro com a mensagem `"Horario nao encontrado"` e o status **404**, e encaminhá-lo ao middleware de erro com `next(erro)`.

```
GET /horarios/99

404
{ "erro": "Horario nao encontrado" }
```

⚠️ O id vem do caminho como texto. Compare com o array convertendo para número.

### RF03 — Criação com middleware de validação

A rota `POST /horarios` deve usar um **middleware de validação** próprio, chamado `validarHorario`, aplicado **somente nessa rota** (não com `app.use`).

O middleware deve recusar o registro nestes casos, sempre com status **400**:

| Situação | Mensagem no campo `erro` |
| --- | --- |
| `cliente` não foi enviado | `O campo cliente e obrigatorio` |
| `corte` não foi enviado | `O campo corte e obrigatorio` |
| `valor` não é um número | `O campo valor deve ser um numero` |
| `valor` é menor ou igual a zero | `O campo valor deve ser maior que zero` |

A ordem de verificação é a da tabela: se faltarem `cliente` e `corte` ao mesmo tempo, a mensagem devolvida é a do `cliente`.

Se estiver tudo válido, o middleware segue para a rota, que deve responder **201**:

```
POST /horarios
{ cliente: "Diego", corte: "Social", valor: 35 }

201
{ "mensagem": "Registro de horario criado" }
```

O registro criado deve ser **acrescentado ao array**, de forma que uma nova chamada a `GET /horarios` já o inclua. O `id` deve ser o maior id existente **mais um**, e o `situacao` deve começar como `"marcado"`.

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
barbearia-horarios
┣ index.js                     ← app, express.json() e montagem do router, rota 404 e middleware de erro
┣ middlewares
┃ ┗ validarHorario.js      ← middleware de validacao
┣ routes
┃ ┗ horarios.js              ← rotas de horarios
┣ test
┃ ┗ horarios.test.js
┣ package.json
┣ package-lock.json
┗ README.md
```

Regras de exportação:

```jsx
// middlewares/validarHorario.js
module.exports = validarHorario

// routes/horarios.js
module.exports = router

// index.js
module.exports = app
```

O router deve ser montado sob o prefixo `/horarios`, então os caminhos declarados dentro dele são `/` e `/:id`.

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
| RF01 | GET | `/horarios` | — | 200 |
| RF01 | GET | `/horarios` | **Params → Query**: um filtro da tabela do RF01 | 200 |
| RF02 | GET | `/horarios/:id` | **Params → Path**: `id` = `2` | 200 |
| RF02 | GET | `/horarios/:id` | **Params → Path**: `id` = `99` | 404 |
| RF03 | POST | `/horarios` | **Body**: o exemplo válido do RF03 | 201 |
| RF03 | POST | `/horarios` | **Body**: uma requisição para cada erro da tabela do RF03 | 400 |
| RF04 | GET | `/qualquer-coisa` | — | 404 |

⚠️ No Body, o JSON precisa de aspas duplas nas chaves. O exemplo do RF03 está resumido, então escreva `{ "campo": "valor" }`, e não `{ campo: "valor" }`.

Nas requisições de erro, confira também a mensagem no campo `erro`.

**5.** Reinicie o servidor, rode tudo com **Run Collection** e confira se cada status bate com a tabela.
