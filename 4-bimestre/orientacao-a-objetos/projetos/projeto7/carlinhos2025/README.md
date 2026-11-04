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
┣ colecao                      ← coleção do Bruno (item de entrega)
┣ servidor.js                  ← sobe a API para testar no Bruno
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

# 🧪 TESTANDO NO BRUNO

Além de passar no `npm test`, sua API precisa ser testada no **Bruno**. Se ainda não instalou a extensão, siga a seção **Mão na massa** da aula 9.

⚠️ **A coleção do Bruno é item de entrega.** A correção automática reprova o projeto se a pasta `colecao` não for enviada, mesmo com o `npm test` passando. O conteúdo da coleção é conferido pelo professor.

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

**3.** Crie uma coleção com o nome `colecao`, com **Location** na pasta do projeto.

**4.** Crie uma requisição para cada linha abaixo, usando `http://localhost:3000` no começo da URL. Envie cada uma e confira se o status é o esperado.

| Requisito | Método | URL | Dado enviado | Status |
| --- | --- | --- | --- | --- |
| RF01 | GET | `/ordens` | — | 200 |
| RF01 | GET | `/ordens` | **Params → Query**: o filtro do RF01 | 200 |
| RF02 | POST | `/ordens` | **Body**: um registro com todos os campos | 201 |
| RF02 | POST | `/ordens` | **Body**: um registro sem o `cliente` | 400 |

⚠️ No Body, o JSON precisa de aspas duplas nas chaves: `{ "cliente": "Diego" }`.

**5.** Reinicie o servidor, rode tudo com **Run Collection** e confira se cada status bate com a tabela.

**6.** Envie a pasta `colecao` e o `servidor.js` no `git push`, junto com o restante do projeto. A coleção entregue precisa ter todas as requisições da tabela.
