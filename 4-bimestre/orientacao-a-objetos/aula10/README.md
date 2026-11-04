# 🎯 Aula 10 — Manipulando Erros, Middleware e Dados na Requisição

## 🎯 Objetivos da Aula

- Ler dados da requisição com **`req.body`**, **`req.params`** e **`req.query`**.
- Entender o que é um **middleware** e a ordem em que eles rodam.
- Criar um **middleware de erro** e usar `try/catch`.
- Responder com os status corretos: **400**, **404** e **500**.
- Enviar `params`, `query` e `body` pelo **Bruno** e testar os casos de erro.

> Até aqui nossas rotas sempre devolveram a mesma coisa. Agora elas vão **receber** dados — e lidar com o que acontece quando esses dados vêm errados.

# 📥 Os três lugares de onde vêm os dados

| Objeto | De onde vem | Exemplo de requisição |
| --- | --- | --- |
| `req.params` | de um pedaço do caminho | `GET /produtos/7` |
| `req.query` | depois do `?` na URL | `GET /produtos?preco=100` |
| `req.body` | do corpo da requisição | `POST /produtos` com JSON |

## 1️⃣ req.params — dados no caminho

Para capturar um pedaço variável do caminho, use `:` na declaração da rota:

```jsx
app.get("/produtos/:id", (req, res) => {
    res.json({ id: req.params.id })
})
```

Pedindo `GET /produtos/7`, o `req.params` é:

```jsx
{ id: "7" }
```

⚠️ **Sempre texto.** `req.params.id` é `"7"`, não `7`. Para comparar com número, converta:

```jsx
const id = Number(req.params.id)
```

## 📌 Exemplo 1 — Buscando um item pelo id

```jsx
const produtos = [
    { id: 1, nome: "Teclado", preco: 150 },
    { id: 2, nome: "Mouse", preco: 80 }
]

app.get("/produtos/:id", (req, res) => {
    const id = Number(req.params.id)
    const produto = produtos.find(p => p.id === id)

    if (!produto) {
        return res.status(404).json({ erro: "Produto nao encontrado" })
    }

    res.json(produto)
})
```

Duas coisas importantes:

- o `find` devolve `undefined` quando não acha — e aí a resposta é **404**;
- o `return` antes do `res.status(404)` impede que o código continue e tente responder duas vezes.

## 2️⃣ req.query — dados depois do `?`

A **query string** é a parte da URL depois do `?`, em pares `chave=valor` separados por `&`:

```
GET /produtos?preco=100&nome=teclado
```

```jsx
app.get("/produtos", (req, res) => {
    console.log(req.query)   // { preco: "100", nome: "teclado" }
})
```

Serve para **filtrar, ordenar e paginar** — coisas opcionais. Se o cliente não mandar nada, `req.query` é um objeto vazio.

## 📌 Exemplo 2 — Filtro opcional

```jsx
app.get("/produtos", (req, res) => {
    const precoMax = Number(req.query.precoMax)

    if (!precoMax) {
        return res.json(produtos)
    }

    res.json(produtos.filter(p => p.preco <= precoMax))
})
```

| Requisição | Resposta |
| --- | --- |
| `GET /produtos` | todos os produtos |
| `GET /produtos?precoMax=100` | só o Mouse |

📌 Diferença essencial: `params` é **obrigatório** (faz parte do caminho da rota); `query` é **opcional** (a rota funciona sem ele).

## 3️⃣ req.body — dados no corpo

Aqui vem a pegadinha: por padrão, o Express **não** lê o corpo da requisição. `req.body` é `undefined`.

Para habilitar, uma linha:

```jsx
app.use(express.json())
```

## 📌 Exemplo 3 — Recebendo JSON

```jsx
const express = require("express")

const app = express()

app.use(express.json())        // ← sem esta linha, req.body e undefined

app.post("/produtos", (req, res) => {
    const { nome, preco } = req.body

    res.status(201).json({ mensagem: `Produto ${nome} criado`, preco })
})
```

⚠️ O `app.use(express.json())` precisa vir **antes** das rotas. Veja por quê na próxima seção.

## 🔎 Onde cada dado aparece no Bruno

Na aula 9 você aprendeu a usar o Bruno. Cada um dos três lugares tem o seu campo na ferramenta:

| No código | No Bruno | Exemplo |
| --- | --- | --- |
| `req.params` | escreva `:id` na URL e preencha **Params → Path** | URL `http://localhost:3000/produtos/:id`, com `id` = `7` |
| `req.query` | aba **Params → Query** (a URL se atualiza sozinha) | `precoMax` = `100` |
| `req.body` | aba **Body**, com o tipo **JSON** | `{ "nome": "Teclado", "preco": 150 }` |

📌 Também dá para escrever direto na URL, como `/produtos/7` ou `/produtos?precoMax=100`. O resultado é o mesmo.

# 🧩 Middleware

**Middleware** é uma função que roda **no meio do caminho**, entre a requisição chegar e a rota responder.

```
requisição → middleware 1 → middleware 2 → rota → resposta
```

A assinatura tem **três** parâmetros:

```jsx
function meuMiddleware(req, res, next) {
    // faz algo
    next()
}
```

| Parâmetro | O que é |
| --- | --- |
| `req` | a requisição (pode ser modificada) |
| `res` | a resposta |
| `next` | função que passa para o próximo da fila |

📌 O `next()` é obrigatório. Sem ele, a requisição **para ali** e nunca chega à rota — o cliente fica esperando para sempre.

## 📌 Exemplo 4 — Middleware de log

```jsx
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})
```

Esse middleware roda em **toda** requisição, qualquer rota.

## 📌 Exemplo 5 — Middleware em uma rota só

Em vez de registrar com `app.use`, passe a função como segundo argumento:

```jsx
function validarProduto(req, res, next) {
    const { nome, preco } = req.body

    if (!nome) {
        return res.status(400).json({ erro: "O campo nome e obrigatorio" })
    }

    if (typeof preco !== "number") {
        return res.status(400).json({ erro: "O campo preco deve ser um numero" })
    }

    next()
}

app.post("/produtos", validarProduto, (req, res) => {
    res.status(201).json({ mensagem: "Produto criado" })
})
```

Agora a rota só roda se os dados estiverem válidos. Ela cuida de **criar**; o middleware cuida de **validar**. Cada função com uma responsabilidade.

Um middleware tem duas saídas possíveis:

| Saída | Significado |
| --- | --- |
| chama `next()` | está tudo bem, siga |
| responde (`res.status(...)`) | problema encontrado, pare aqui |

⚠️ Nunca as duas. Responder **e** chamar `next()` gera o erro `Cannot set headers after they are sent`.

## 🔢 A ordem importa

O Express executa na ordem em que você registrou. É por isso que:

```jsx
app.use(express.json())       // 1º — prepara o req.body
app.post("/produtos", ...)    // 2º — usa o req.body
```

Invertido, a rota rodaria antes do `express.json()` e `req.body` estaria `undefined`.

> **Middleware é uma fila, não um conjunto. Pense sempre em "quem roda antes".**

# 🚨 Tratamento de erros

## 🧯 try/catch

Quando o código dentro de uma rota pode quebrar, envolva em `try/catch`:

```jsx
app.get("/produtos/:id", (req, res) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            throw new Error("Id invalido")
        }

        res.json({ id })
    } catch (erro) {
        res.status(500).json({ erro: erro.message })
    }
})
```

Funciona — mas repetir esse `try/catch` em vinte rotas é repetir vinte vezes a mesma coisa.

## 🎯 Middleware de erro

O Express tem um tipo especial de middleware, com **quatro** parâmetros. O primeiro é o erro:

```jsx
function tratarErro(erro, req, res, next) {
    res.status(500).json({ erro: erro.message })
}
```

Duas regras:

1. **Quatro parâmetros.** É assim que o Express reconhece um middleware de erro. Com três, ele é tratado como middleware comum.
2. **Registrado por último**, depois de todas as rotas.

## 📌 Exemplo 6 — Estrutura completa

```jsx
const express = require("express")

const app = express()

app.use(express.json())

app.get("/produtos/:id", (req, res, next) => {
    try {
        const id = Number(req.params.id)

        if (Number.isNaN(id)) {
            const erro = new Error("Id invalido")
            erro.status = 400
            throw erro
        }

        const produto = produtos.find(p => p.id === id)

        if (!produto) {
            const erro = new Error("Produto nao encontrado")
            erro.status = 404
            throw erro
        }

        res.json(produto)
    } catch (erro) {
        next(erro)                      // ← manda para o middleware de erro
    }
})

// rota nao encontrada — depois de todas as rotas
app.use((req, res) => {
    res.status(404).json({ erro: "Rota nao encontrada" })
})

// middleware de erro — sempre o ultimo
app.use((erro, req, res, next) => {
    res.status(erro.status || 500).json({ erro: erro.message })
})

module.exports = app
```

O detalhe que faz tudo funcionar: **`next(erro)`**.

| Chamada | Efeito |
| --- | --- |
| `next()` | vai para o próximo middleware normal |
| `next(erro)` | **pula** direto para o middleware de erro |

E o `erro.status || 500` permite que cada erro escolha seu código, com 500 como padrão para o que não foi previsto.

## 📋 Resumo dos status

| Status | Quando usar | Exemplo |
| --- | --- | --- |
| 200 | busca deu certo | listou produtos |
| 201 | criou um registro | cadastrou produto |
| **400** | o cliente mandou dado inválido | faltou o campo `nome` |
| **404** | não existe o que foi pedido | id 99 não existe |
| **500** | o servidor quebrou | erro não previsto no código |

> **Regra de ouro: 4xx é culpa de quem pediu, 5xx é culpa de quem respondeu.** Se faltou um campo obrigatório, é 400 — nunca 500.

# 📖 Conceitos importantes

| Conceito | Significado |
| --- | --- |
| `req.params` | dados vindos do caminho (`/produtos/:id`) |
| `req.query` | dados vindos depois do `?` |
| `req.body` | dados vindos do corpo |
| `express.json()` | middleware que habilita o `req.body` |
| Middleware | função que roda antes da rota, com `(req, res, next)` |
| `next()` | passa para o próximo da fila |
| `next(erro)` | pula para o middleware de erro |
| Middleware de erro | middleware com 4 parâmetros, registrado por último |

# ⚠️ Erros comuns

### ❌ Esquecer o `express.json()`

```jsx
app.post("/produtos", (req, res) => {
    console.log(req.body.nome)   // TypeError: cannot read properties of undefined
})
```

Correto: `app.use(express.json())` **antes** das rotas.

### ❌ Esquecer o `next()` no middleware

```jsx
app.use((req, res, next) => {
    console.log("chegou")
    // sem next() — a requisicao morre aqui
})
```

### ❌ Middleware de erro com 3 parâmetros

```jsx
app.use((req, res, next) => { ... })        // ❌ middleware comum
app.use((erro, req, res, next) => { ... })  // ✅ middleware de erro
```

### ❌ Registrar o middleware de erro antes das rotas

Ele nunca é chamado. Sempre o **último** `app.use`.

### ❌ Comparar `params` sem converter

```jsx
produtos.find(p => p.id === req.params.id)   // "7" === 7 e falso
produtos.find(p => p.id === Number(req.params.id))   // ✅
```

### ❌ Responder 500 para erro do cliente

Faltou um campo obrigatório? É **400**. Usar 500 esconde que o problema está na requisição, e quem for consumir sua API vai procurar o bug no lugar errado.

Fim da aula!

_

# 🧩 Exercício Rápido

### 💬 API de Pedidos com validação

Crie um arquivo chamado `index.js` com uma aplicação Express que tenha o `express.json()` habilitado e um array de dois pedidos:

```jsx
{ id: 1, cliente: "Ana", valor: 100 }
{ id: 2, cliente: "Bruno", valor: 250 }
```

**Rotas:**

| Método | Caminho | Comportamento |
| --- | --- | --- |
| GET | `/pedidos` | 200 com todos os pedidos; se vier `?valorMin=<n>` na query, devolve só os pedidos com `valor` maior ou igual a `n` |
| GET | `/pedidos/:id` | 200 com o pedido do id; **404** com `{ "erro": "Pedido nao encontrado" }` se o id não existir |
| POST | `/pedidos` | **201** com `{ "mensagem": "Pedido criado" }`; **400** se os dados forem inválidos |

**Validação do POST** — crie um **middleware** chamado `validarPedido` e use-o só nessa rota:

- se `cliente` não vier no corpo, responda **400** com `{ "erro": "O campo cliente e obrigatorio" }`
- se `valor` não for um número, responda **400** com `{ "erro": "O campo valor deve ser um numero" }`
- se estiver tudo certo, chame `next()`

**Por último**, registre um **middleware de erro** com os quatro parâmetros `(erro, req, res, next)`, que responda com o status de `erro.status` (ou **500** se não houver) e o corpo `{ "erro": <mensagem do erro> }`.

Para a rota `GET /pedidos/:id`, lance o erro com `next(erro)` em vez de responder direto — definindo `erro.status = 404` e a mensagem `"Pedido nao encontrado"`. É o middleware de erro que vai responder.

No final, exporte a aplicação com `module.exports = app`.

📌 **Não** chame `app.listen()`. Lembre-se de converter o `req.params.id` com `Number(...)`.

# 🧪 Depois do `npm test`: testando sua API no Bruno

Validação e tratamento de erro só valem se forem testados com dados errados. É isso que vamos fazer agora.

📌 Esta parte é prática e não muda a correção automática. Se ainda não instalou o Bruno, siga a seção **Mão na massa** da aula 9.

**1.** Crie o arquivo `servidor.js`:

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

**3.** Crie a coleção `API de Pedidos`, com **Location** na pasta `aula10`.

**4.** Crie as requisições abaixo, começando cada URL com `http://localhost:3000`. Envie cada uma e confira se o status é o esperado. Nos erros, confira também a mensagem no campo `erro`.

| Nome | Método | URL | Dado enviado | Status |
| --- | --- | --- | --- | --- |
| Listar pedidos | GET | `/pedidos` | — | 200 |
| Filtrar pedidos | GET | `/pedidos` | Query: `valorMin` = `200` | 200 |
| Buscar pedido | GET | `/pedidos/:id` | Path: `id` = `1` | 200 |
| Pedido inexistente | GET | `/pedidos/:id` | Path: `id` = `99` | 404 |
| Criar pedido | POST | `/pedidos` | `{ "cliente": "Carla", "valor": 300 }` | 201 |
| Criar sem cliente | POST | `/pedidos` | `{ "valor": 300 }` | 400 |
| Criar com valor invalido | POST | `/pedidos` | `{ "cliente": "Carla", "valor": "trezentos" }` | 400 |
| JSON quebrado | POST | `/pedidos` | `{ "cliente": "Carla", }` | 400 |

**5.** Rode tudo com **Run Collection** e confira se cada status bate com a tabela.

💡 Repare no `JSON quebrado`: quem responde é o seu middleware de erro. O `express.json()` não consegue ler o corpo, chama `next(erro)` com `status` 400, e a resposta sai em JSON. Na API da aula 9, que não tem middleware de erro, o mesmo problema devolvia uma página HTML.
