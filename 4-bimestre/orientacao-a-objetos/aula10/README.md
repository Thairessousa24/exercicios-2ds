# 🎯 Aula 10 — Manipulando Erros, Middleware e Dados na Requisição

## 🎯 Objetivos da Aula

- Receber dados na API com **`req.params`**, **`req.query`** e **`req.body`**.
- Recusar dados errados com um **middleware**.
- Responder erros de forma clara e com o **status** certo.

# 💡 Por que esta aula é importante?

Até agora, nossa API só funciona quando tudo dá certo. No mundo real, as pessoas pedem produtos que não existem e enviam dados errados. Uma API profissional precisa saber lidar com isso:

| O que acontece | API sem cuidado | API desta aula |
| --- | --- | --- |
| Pedem um produto que não existe | resposta confusa | `404` com uma mensagem clara |
| Enviam um produto sem nome | salva o dado errado | `400` e não salva |
| Acessam um caminho errado | página HTML | `404` em JSON |

Tudo o que você aprender aqui será usado no **projeto 7**.

# 🚀 Preparando a API

Vamos continuar a `loja.js` da aula 9. Pare o servidor antigo com `Ctrl + C` e rode:

```bash
cd 4-bimestre/orientacao-a-objetos/aula10
npm install
cp ../aula09/loja.js loja.js
node --watch loja.js
```

Na `loja.js`, dê um `id` para cada produto:

```jsx
const produtos = [
    { id: 1, nome: "Mouse", preco: 80 },
    { id: 2, nome: "Monitor", preco: 900 }
]
```

📌 A cada mudança, salve o arquivo e teste no Bruno, usando a URL `http://localhost:3000`.

# 📥 Parte 1 — Recebendo dados

A API pode receber dados de três lugares:

| No código | Para que serve | Exemplo |
| --- | --- | --- |
| `req.params` | dizer **qual** item você quer | `/produtos/1` |
| `req.query` | **filtrar** a lista | `/produtos?precoMax=100` |
| `req.body` | **enviar** um registro | `{ "nome": "Teclado" }` |

No Bruno, `params` e `query` vão na URL, e `body` vai na aba **Body**. A aba **Params** também mostra esses dados da URL, em **Path** e **Query**.

## 1️⃣ Buscando um produto com `req.params`

Adicione esta rota depois da rota `GET /produtos`:

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

**Leia assim:** pegue o `id` da URL, procure o produto e, se não achar, responda 404.

⚠️ O que vem na URL é sempre texto. Por isso usamos `Number(...)`.

**Teste no Bruno:** GET `/produtos/1` responde **200** com o Mouse, e GET `/produtos/99` responde **404**.

## 2️⃣ Filtrando com `req.query`

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

**Leia assim:** se não veio `precoMax`, devolva tudo. Se veio, devolva só os produtos até esse preço.

**Teste no Bruno:** GET `/produtos` mostra tudo, e GET `/produtos?precoMax=100` mostra só o Mouse.

📌 Para enviar mais de um filtro, separe com `&`: `/produtos?precoMax=100&nome=Mouse`.

## 3️⃣ Recebendo o corpo com `req.body`

Você já usou o `req.body` no POST da aula 9. Ele só funciona porque a linha `app.use(express.json())` vem **antes** das rotas.

# 🧩 Parte 2 — Middleware

**Middleware** é uma função que roda **antes** da rota. Ele funciona como um porteiro:

- se estiver tudo certo, chama `next()` e a requisição segue para a rota;
- se houver um problema, responde com o erro e a requisição para ali.

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

**Leia assim:** sem `nome`, responda 400. Se o `preco` não for número, responda 400. Se estiver tudo certo, siga em frente.

Agora troque a rota `POST /produtos` e coloque o `validarProduto` nela:

```jsx
app.post("/produtos", validarProduto, (req, res) => {
    produtos.push(req.body)
    res.status(201).json(req.body)
})
```

**Teste no Bruno**, com POST em `/produtos`:

| Body | Status |
| --- | --- |
| `{ "nome": "Teclado", "preco": 150 }` | 201 |
| `{ "preco": 150 }` | 400 |
| `{ "nome": "Teclado", "preco": "caro" }` | 400 |

# 🚨 Parte 3 — Tratando erros

Agora vamos tratar os erros em um só lugar. Adicione estes dois blocos **depois de todas as rotas** e antes do `app.listen`:

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

- O primeiro bloco responde quando o caminho não existe.
- O segundo responde quando alguma rota chama `next(erro)`. Ele precisa ter **quatro** parâmetros.

Agora troque a rota de busca. Em vez de responder o erro, ela cria o erro e chama `next(erro)`:

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

**Teste no Bruno:** GET `/produtos/99` e GET `/qualquer-coisa` respondem **404** com uma mensagem em JSON.

# 📋 Qual status usar?

| Status | Significado | Exemplo |
| --- | --- | --- |
| 200 | deu certo | listou os produtos |
| 201 | criou um registro | cadastrou um produto |
| **400** | o cliente enviou dado errado | faltou o campo `nome` |
| **404** | não existe | o id 99 não existe |
| **500** | o servidor quebrou | erro não previsto no código |

> **Regra de ouro: 4xx é culpa de quem pediu, 5xx é culpa de quem respondeu.**

# ⚠️ Erros comuns

- **Esquecer o `next()` no middleware:** a resposta nunca chega.
- **Esquecer o `Number()` no id:** o produto nunca é encontrado, porque `"1"` é diferente de `1`.
- **Colocar o middleware de erro antes das rotas:** ele nunca é chamado.

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

📌 Esta parte é prática e não muda a correção automática.

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

**3.** Crie a coleção `API de Pedidos`, com **Location** na pasta `aula10`, e as requisições abaixo. Comece cada URL com `http://localhost:3000`.

| Nome | Método | URL | Body | Status |
| --- | --- | --- | --- | --- |
| Listar pedidos | GET | `/pedidos` | — | 200 |
| Filtrar pedidos | GET | `/pedidos?valorMin=200` | — | 200 |
| Pedido inexistente | GET | `/pedidos/99` | — | 404 |
| Criar pedido | POST | `/pedidos` | `{ "cliente": "Carla", "valor": 300 }` | 201 |
| Criar sem cliente | POST | `/pedidos` | `{ "valor": 300 }` | 400 |

**4.** Rode tudo com **Run Collection** e confira se cada status bate com a tabela.
