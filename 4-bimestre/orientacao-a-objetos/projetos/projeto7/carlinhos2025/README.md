# 🚀 PROJETO 7 — API DE ORDENS DA LAVANDERIA

# 📋 PROJETO

Todas as rotas respondem em JSON.

No `index.js`, use `app.use(express.json())` antes das rotas.

Este é o array de ordens:

```jsx
{ id: 1, cliente: "Ana", servico: "Lavagem Simples", pecas: 5, situacao: "pronta" }
{ id: 2, cliente: "Bruno", servico: "Lavagem a Seco", pecas: 2, situacao: "lavando" }
{ id: 3, cliente: "Carla", servico: "Passadoria", pecas: 8, situacao: "lavando" }
```

### RF01 — Listar

| Método | Caminho | Status | Resposta |
| --- | --- | --- | --- |
| GET | `/ordens` | 200 | o array completo |
| GET | `/ordens?situacao=lavando` | 200 | só os que têm esse `situacao` |

O filtro é opcional. Sem ele, responda o array completo.

### RF02 — Criar

| Método | Caminho | Status | Resposta |
| --- | --- | --- | --- |
| POST | `/ordens` | 201 | o JSON `{ "mensagem": "Registro de ordem criado" }` |
| POST | `/ordens` | 400 | o JSON `{ "erro": "O campo cliente e obrigatorio" }` |

O 400 acontece quando o `cliente` não vem no corpo.

# 🧩 EXEMPLO DE ESTRUTURA

Este exemplo usa outro assunto. Serve só para mostrar o formato.

```jsx
const express = require("express")

const app = express()

app.use(express.json())

const cidades = [{ id: 1, nome: "Recife", regiao: "nordeste" }]

app.get("/cidades", (req, res) => {
    if (req.query.regiao) {
        return res.json(cidades.filter(c => c.regiao === req.query.regiao))
    }

    res.json(cidades)
})

app.post("/cidades", (req, res) => {
    if (!req.body.nome) {
        return res.status(400).json({ erro: "O campo nome e obrigatorio" })
    }

    res.status(201).json({ mensagem: "Registro de cidade criado" })
})

module.exports = app
```

# 📁 ESTRUTURA DO PROJETO

```
lavanderia-ordens
┣ index.js
┣ test
┃ ┗ ordens.test.js
┣ package.json
┣ package-lock.json
┗ README.md
```

```jsx
// index.js
module.exports = app
```

Não use `app.listen()`.
