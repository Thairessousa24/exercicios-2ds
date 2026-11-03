# 🚀 PROJETO 7 — API DE LAVAGENS DA LAVA RAPIDO

# 🎯 PROBLEMA

A **Lava Rapido** cresceu e o controle de lavagens deixou de caber no caderno. A equipe foi contratada para construir a API que o aplicativo vai consumir.

Na reunião de alinhamento, a responsável contou dois problemas que o sistema antigo tinha:

> "Às vezes o registro entrava sem o nome do motorista, e ninguém sabia para quem era."
>
> "E quando dava erro, a tela mostrava uma mensagem gigante em inglês que ninguém entendia."

Por isso, dois requisitos não são negociáveis: **nenhum registro inválido pode entrar** e **todo erro tem que devolver uma mensagem clara, com o código HTTP certo**.

A API ainda não terá banco de dados — os lavagens ficam em memória, num array. O que importa nesta entrega é a **validação** e o **tratamento de erros**.

Seu trabalho é construir essa API.

> ⏱️ **Tempo:** este projeto é feito em **um dia de aula (60 minutos)**, com prazo de entrega estendido. Ele foi dimensionado para ser concluído em 60 a 100 minutos no total.

# 📋 PROJETO

Todas as rotas respondem em **JSON**, e a aplicação precisa ter o `express.json()` habilitado.

Os lavagens iniciais são:

```jsx
{ id: 1, motorista: "Ana", pacote: "Simples", valor: 35, situacao: "pronta" }
{ id: 2, motorista: "Bruno", pacote: "Completo", valor: 70, situacao: "lavando" }
{ id: 3, motorista: "Carla", pacote: "Premium", valor: 140, situacao: "lavando" }
```

### RF01 — Listagem com filtros opcionals

A rota `GET /lavagens` deve responder **200** com todos os lavagens.

Ela também deve aceitar dois filtros opcionais pela query string:

| Query | Resultado |
| --- | --- |
| `GET /lavagens` | todos os lavagens |
| `GET /lavagens?situacao=lavando` | só os lavagens com aquele `situacao` |
| `GET /lavagens?valorMin=140` | só os lavagens com `valor` maior ou igual ao informado |
| `GET /lavagens?situacao=lavando&valorMin=140` | os dois filtros aplicados juntos |

⚠️ Os filtros são opcionais: a rota tem que funcionar sem nenhum deles. E lembre-se de que tudo que vem da query chega como **texto**.

### RF02 — Busca por id

A rota `GET /lavagens/:id` deve responder **200** com o registro correspondente.

```
GET /lavagens/2

200
{ id: 2, motorista: "Bruno", pacote: "Completo", valor: 70, situacao: "lavando" }
```

Se o id não existir, a rota **não deve responder diretamente**: ela deve criar um erro com a mensagem `"Lavagem nao encontrado"` e o status **404**, e encaminhá-lo ao middleware de erro com `next(erro)`.

```
GET /lavagens/99

404
{ "erro": "Lavagem nao encontrado" }
```

⚠️ O id vem do caminho como texto. Compare com o array convertendo para número.

### RF03 — Criação com middleware de validação

A rota `POST /lavagens` deve usar um **middleware de validação** próprio, chamado `validarLavagem`, aplicado **somente nessa rota** (não com `app.use`).

O middleware deve recusar o registro nestes casos, sempre com status **400**:

| Situação | Mensagem no campo `erro` |
| --- | --- |
| `motorista` não foi enviado | `O campo motorista e obrigatorio` |
| `pacote` não foi enviado | `O campo pacote e obrigatorio` |
| `valor` não é um número | `O campo valor deve ser um numero` |
| `valor` é menor ou igual a zero | `O campo valor deve ser maior que zero` |

A ordem de verificação é a da tabela: se faltarem `motorista` e `pacote` ao mesmo tempo, a mensagem devolvida é a do `motorista`.

Se estiver tudo válido, o middleware segue para a rota, que deve responder **201**:

```
POST /lavagens
{ motorista: "Diego", pacote: "Simples", valor: 35 }

201
{ "mensagem": "Registro de lavagem criado" }
```

O registro criado deve ser **acrescentado ao array**, de forma que uma nova chamada a `GET /lavagens` já o inclua. O `id` deve ser o maior id existente **mais um**, e o `situacao` deve começar como `"na fila"`.

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
lava-rapido-lavagens
┣ index.js                     ← app, express.json() e montagem do router, rota 404 e middleware de erro
┣ middlewares
┃ ┗ validarLavagem.js      ← middleware de validacao
┣ routes
┃ ┗ lavagens.js              ← rotas de lavagens
┣ test
┃ ┗ lavagens.test.js
┣ package.json
┣ package-lock.json
┗ README.md
```

Regras de exportação:

```jsx
// middlewares/validarLavagem.js
module.exports = validarLavagem

// routes/lavagens.js
module.exports = router

// index.js
module.exports = app
```

O router deve ser montado sob o prefixo `/lavagens`, então os caminhos declarados dentro dele são `/` e `/:id`.

⚠️ **Não** chame `app.listen()` dentro do `index.js`.

### ⏱️ Ordem sugerida de ataque

| Momento | O que fazer |
| --- | --- |
| primeiros 15 min | `index.js` com `express.json()` + router com o `GET /` simples (RF01 sem filtros) |
| 15 a 35 min | filtros da query (RF01) e o `GET /:id` com o 404 (RF02) |
| 35 a 50 min | o middleware de validação e o POST (RF03) |
| últimos 10 min | rota inexistente e middleware de erro (RF04) |

O estudante deverá decidir como organizar as funções dentro dos arquivos.
