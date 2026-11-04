# 🎯 Aula 10 — Manipulando Erros, Middleware e Dados na Requisição

## 🎯 Objetivos da Aula

- Ler dados da requisição com **`req.params`**, **`req.query`** e **`req.body`**.
- Entender o que é um **middleware**.
- Criar um **middleware de erro**.
- Responder com os status corretos: **400**, **404** e **500**.
- Testar cada mudança no **Bruno**.

> Na aula 9 você criou a `loja.js` e aprendeu a testá-la no Bruno. Hoje vamos continuar essa API: ela vai buscar um produto, filtrar a lista, recusar dados errados e responder todo erro de um jeito organizado.

# 🚀 Preparando a API

Pare o servidor da aula 9 com `Ctrl + C`. Depois, entre na pasta da aula 10, instale as dependências e copie a `loja.js`:

```bash
cd 4-bimestre/orientacao-a-objetos/aula10
npm install
cp ../aula09/loja.js loja.js
```

Agora dê um `id` para cada produto. Vamos precisar dele para buscar um produto específico:

```jsx
const produtos = [
    { id: 1, nome: "Mouse", preco: 80 },
    { id: 2, nome: "Monitor", preco: 900 }
]
```

Suba o servidor e deixe o terminal aberto:

```bash
node --watch loja.js
```

📌 O `--watch` reinicia o servidor sempre que você salva o arquivo. No Bruno, continue usando a coleção `API da Loja`.

# 📥 Parte 1 — Recebendo dados

Quem usa a API pode mandar dados por três lugares:

| No código | Onde o dado vem | Para que serve | Exemplo |
| --- | --- | --- | --- |
| `req.params` | no caminho da URL | dizer **qual** item você quer | `/produtos/1` |
| `req.query` | depois do `?` na URL | filtrar, de forma **opcional** | `/produtos?precoMax=100` |
| `req.body` | no corpo da requisição | **enviar** um registro | `{ "nome": "Teclado" }` |

## 1️⃣ req.params: buscando um produto

Adicione esta rota na `loja.js`, depois da rota `GET /produtos`:

```jsx
app.get("/produtos/:id", (req, res) => {
    const id = Number(req.params.id)
    const produto = produtos.find(p => p.id === id)

    if (!produto) {
        return res.status(404).json({ erro: "Produto nao encontrado" })
    }

    res.json(produto)
})
```

O que cada parte faz:

- `:id` é a parte variável do caminho. Em `/produtos/1`, o `req.params.id` é `"1"`.
- `Number(...)` converte o texto em número, porque tudo que vem da URL chega como **texto**.
- `find` procura o produto e devolve `undefined` quando não acha.
- `return` encerra a função, para ela não tentar responder duas vezes.

**Teste no Bruno:**

| Requisição | Status | Resposta |
| --- | --- | --- |
| GET `http://localhost:3000/produtos/1` | 200 | o Mouse |
| GET `http://localhost:3000/produtos/99` | 404 | `{ "erro": "Produto nao encontrado" }` |

📌 Se preferir, escreva `/produtos/:id` na URL e preencha o `id` na aba **Params → Path**. O resultado é o mesmo.

## 2️⃣ req.query: filtrando a lista

Troque a rota `GET /produtos` por esta:

```jsx
app.get("/produtos", (req, res) => {
    const precoMax = Number(req.query.precoMax)

    if (!precoMax) {
        return res.json(produtos)
    }

    res.json(produtos.filter(p => p.preco <= precoMax))
})
```

Se ninguém mandar o `precoMax`, a rota devolve a lista completa. É isso que torna o filtro opcional.

Para mandar mais de um dado, separe com `&`: em `/produtos?precoMax=100&nome=Mouse`, o `req.query` tem o `precoMax` e o `nome`.

**Teste no Bruno:**

| Requisição | Status | Resposta |
| --- | --- | --- |
| GET `http://localhost:3000/produtos` | 200 | todos os produtos |
| GET `http://localhost:3000/produtos?precoMax=100` | 200 | só o Mouse |

📌 Você pode escrever o filtro na URL ou preencher a aba **Params → Query**.

## 3️⃣ req.body: você já usou

A rota `POST /produtos` da aula 9 já lê o `req.body`. Quem permite isso é esta linha, que vem antes das rotas:

```jsx
app.use(express.json())
```

Sem ela, o Express não lê o JSON enviado na aba **Body**, e o `req.body` fica `undefined`.

# 🧩 Parte 2 — Middleware

**Middleware** é uma função que roda **antes** da rota. Pense em um porteiro: ele confere quem chegou e decide se a pessoa pode entrar.

```
requisição → middleware → rota → resposta
```

O middleware tem dois caminhos:

| O que ele faz | Resultado |
| --- | --- |
| chama `next()` | está tudo certo, e a requisição segue para a rota |
| responde com `res.status(...)` | achou um problema, e a requisição para ali |

⚠️ Sem `next()` e sem resposta, o cliente fica esperando para sempre.

O `express.json()` também é um middleware. Por isso ele vem antes das rotas: o Express segue a ordem em que o código foi escrito.

## 4️⃣ Criando um middleware de validação

Hoje a validação está dentro da rota `POST /produtos`. Vamos separar: o middleware **valida** e a rota **cria**.

Adicione esta função antes das rotas:

```jsx
function validarProduto(req, res, next) {
    if (!req.body.nome) {
        return res.status(400).json({ erro: "O campo nome e obrigatorio" })
    }

    if (typeof req.body.preco !== "number") {
        return res.status(400).json({ erro: "O campo preco deve ser um numero" })
    }

    next()
}
```

Agora troque a rota `POST /produtos`. Repare no `validarProduto` antes da função da rota:

```jsx
app.post("/produtos", validarProduto, (req, res) => {
    produtos.push(req.body)
    res.status(201).json(req.body)
})
```

**Teste no Bruno**, sempre com POST em `http://localhost:3000/produtos`:

| Body | Status | Resposta |
| --- | --- | --- |
| `{ "nome": "Teclado", "preco": 150 }` | 201 | o produto criado |
| `{ "preco": 150 }` | 400 | `{ "erro": "O campo nome e obrigatorio" }` |
| `{ "nome": "Teclado", "preco": "caro" }` | 400 | `{ "erro": "O campo preco deve ser um numero" }` |

# 🚨 Parte 3 — Tratando erros em um só lugar

Teste GET em `http://localhost:3000/qualquer-coisa`. A resposta é uma página HTML, e não JSON. Em uma API, todo erro deve seguir o mesmo formato.

## 5️⃣ Rota inexistente e middleware de erro

Adicione estes dois blocos **depois de todas as rotas** e antes do `app.listen`:

```jsx
// rota nao encontrada
app.use((req, res) => {
    res.status(404).json({ erro: "Rota nao encontrada" })
})

// middleware de erro: sempre o ultimo
app.use((erro, req, res, next) => {
    res.status(erro.status || 500).json({ erro: erro.message })
})
```

O segundo bloco é o **middleware de erro**. O Express o reconhece porque ele tem **quatro** parâmetros, e o primeiro é o erro. O `erro.status || 500` usa o status do erro e, se não houver um, responde 500.

## 6️⃣ Enviando o erro com `next(erro)`

Agora a rota de busca não precisa mais responder o erro sozinha. Ela cria o erro e entrega ao middleware:

```jsx
app.get("/produtos/:id", (req, res, next) => {
    const id = Number(req.params.id)
    const produto = produtos.find(p => p.id === id)

    if (!produto) {
        const erro = new Error("Produto nao encontrado")
        erro.status = 404
        return next(erro)
    }

    res.json(produto)
})
```

| Chamada | O que acontece |
| --- | --- |
| `next()` | segue para o próximo passo |
| `next(erro)` | pula direto para o middleware de erro |

**Teste no Bruno:**

| Requisição | Status | Resposta |
| --- | --- | --- |
| GET `/produtos/99` | 404 | `{ "erro": "Produto nao encontrado" }` |
| GET `/qualquer-coisa` | 404 | `{ "erro": "Rota nao encontrada" }` |
| POST `/produtos` com o corpo `{ "nome": "Teclado", }` | 400 | um JSON com a mensagem do erro |

O último caso é o JSON quebrado da aula 9. Antes ele devolvia uma página HTML; agora quem responde é o seu middleware de erro.

## 🧯 E o try/catch?

Quando um trecho de código pode quebrar, envolva com `try/catch` e entregue o erro com `next(erro)`:

```jsx
app.get("/exemplo", (req, res, next) => {
    try {
        const dados = JSON.parse("texto que nao e JSON")
        res.json(dados)
    } catch (erro) {
        next(erro)
    }
})
```

Esse erro não tem `status`, então o middleware responde **500**. Vamos usar o `try/catch` de novo quando trabalharmos com arquivos.

# ✅ Como ficou a loja.js

Compare com o seu arquivo:

```jsx
const express = require("express")

const app = express()
app.use(express.json())

const produtos = [
    { id: 1, nome: "Mouse", preco: 80 },
    { id: 2, nome: "Monitor", preco: 900 }
]

function validarProduto(req, res, next) {
    if (!req.body.nome) {
        return res.status(400).json({ erro: "O campo nome e obrigatorio" })
    }

    if (typeof req.body.preco !== "number") {
        return res.status(400).json({ erro: "O campo preco deve ser um numero" })
    }

    next()
}

app.get("/produtos", (req, res) => {
    const precoMax = Number(req.query.precoMax)

    if (!precoMax) {
        return res.json(produtos)
    }

    res.json(produtos.filter(p => p.preco <= precoMax))
})

app.get("/produtos/:id", (req, res, next) => {
    const id = Number(req.params.id)
    const produto = produtos.find(p => p.id === id)

    if (!produto) {
        const erro = new Error("Produto nao encontrado")
        erro.status = 404
        return next(erro)
    }

    res.json(produto)
})

app.post("/produtos", validarProduto, (req, res) => {
    produtos.push(req.body)
    res.status(201).json(req.body)
})

// rota nao encontrada
app.use((req, res) => {
    res.status(404).json({ erro: "Rota nao encontrada" })
})

// middleware de erro: sempre o ultimo
app.use((erro, req, res, next) => {
    res.status(erro.status || 500).json({ erro: erro.message })
})

app.listen(3000, () => {
    console.log("API da Loja em http://localhost:3000")
})
```

# 📋 Resumo dos status

| Status | Quando usar | Exemplo |
| --- | --- | --- |
| 200 | a busca deu certo | listou os produtos |
| 201 | criou um registro | cadastrou um produto |
| **400** | o cliente mandou dado inválido | faltou o campo `nome` |
| **404** | não existe o que foi pedido | o id 99 não existe |
| **500** | o servidor quebrou | erro não previsto no código |

> **Regra de ouro: 4xx é culpa de quem pediu, 5xx é culpa de quem respondeu.** Se faltou um campo obrigatório, é 400, nunca 500.

# 📖 Conceitos importantes

| Conceito | Significado |
| --- | --- |
| `req.params` | dado que vem no caminho da URL |
| `req.query` | dado opcional que vem depois do `?` |
| `req.body` | dado que vem no corpo da requisição |
| `express.json()` | middleware que permite ler o `req.body` |
| Middleware | função que roda antes da rota |
| `next()` | segue para o próximo passo |
| `next(erro)` | pula para o middleware de erro |
| Middleware de erro | middleware com 4 parâmetros, registrado por último |

# ⚠️ Erros comuns

### ❌ Comparar o id sem converter

```jsx
produtos.find(p => p.id === req.params.id)           // "1" === 1 e falso
produtos.find(p => p.id === Number(req.params.id))   // ✅
```

### ❌ Esquecer o `next()` no middleware

O cliente fica esperando e a resposta nunca chega.

### ❌ Colocar `express.json()` depois das rotas

As rotas rodam antes dele, e o `req.body` fica `undefined`.

### ❌ Middleware de erro com 3 parâmetros

```jsx
app.use((req, res, next) => { ... })        // ❌ middleware comum
app.use((erro, req, res, next) => { ... })  // ✅ middleware de erro
```

### ❌ Registrar o middleware de erro antes das rotas

Ele nunca é chamado. Deixe sempre como o **último** `app.use`.

### ❌ Responder 500 para erro do cliente

Faltou um campo obrigatório? É **400**. O 500 faria parecer que o problema está no servidor.

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
