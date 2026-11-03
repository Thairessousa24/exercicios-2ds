# 🚀 PROJETO 7 — API DE TROCAS DA LIVRARIA USADOS

# 🎯 PROBLEMA

A **Livraria Usados** cresceu e o controle de trocas deixou de caber no caderno. A equipe foi contratada para construir a API que o aplicativo vai consumir.

Na reunião de alinhamento, a responsável contou dois problemas que o sistema antigo tinha:

> "Às vezes o registro entrava sem o nome do cliente, e ninguém sabia para quem era."
>
> "E quando dava erro, a tela mostrava uma mensagem gigante em inglês que ninguém entendia."

Por isso, dois requisitos não são negociáveis: **nenhum registro inválido pode entrar** e **todo erro tem que devolver uma mensagem clara, com o código HTTP certo**.

A API ainda não terá banco de dados — os trocas ficam em memória, num array. O que importa nesta entrega é a **validação** e o **tratamento de erros**.

Seu trabalho é construir essa API.

> ⏱️ **Tempo:** este projeto é feito em **um dia de aula (60 minutos)**, com prazo de entrega estendido. Ele foi dimensionado para ser concluído em 60 a 100 minutos no total.

# 📋 PROJETO

Todas as rotas respondem em **JSON**, e a aplicação precisa ter o `express.json()` habilitado.

Os trocas iniciais são:

```jsx
{ id: 1, cliente: "Ana", exemplar: "1984", credito: 15, situacao: "concluida" }
{ id: 2, cliente: "Bruno", exemplar: "O Hobbit", credito: 12, situacao: "aprovada" }
{ id: 3, cliente: "Carla", exemplar: "Sapiens", credito: 8, situacao: "aprovada" }
```

### RF01 — Listagem com filtros opcionals

A rota `GET /trocas` deve responder **200** com todos os trocas.

Ela também deve aceitar dois filtros opcionais pela query string:

| Query | Resultado |
| --- | --- |
| `GET /trocas` | todos os trocas |
| `GET /trocas?situacao=aprovada` | só os trocas com aquele `situacao` |
| `GET /trocas?creditoMin=12` | só os trocas com `credito` maior ou igual ao informado |
| `GET /trocas?situacao=aprovada&creditoMin=12` | os dois filtros aplicados juntos |

⚠️ Os filtros são opcionais: a rota tem que funcionar sem nenhum deles. E lembre-se de que tudo que vem da query chega como **texto**.

### RF02 — Busca por id

A rota `GET /trocas/:id` deve responder **200** com o registro correspondente.

```
GET /trocas/2

200
{ id: 2, cliente: "Bruno", exemplar: "O Hobbit", credito: 12, situacao: "aprovada" }
```

Se o id não existir, a rota **não deve responder diretamente**: ela deve criar um erro com a mensagem `"Troca nao encontrado"` e o status **404**, e encaminhá-lo ao middleware de erro com `next(erro)`.

```
GET /trocas/99

404
{ "erro": "Troca nao encontrado" }
```

⚠️ O id vem do caminho como texto. Compare com o array convertendo para número.

### RF03 — Criação com middleware de validação

A rota `POST /trocas` deve usar um **middleware de validação** próprio, chamado `validarTroca`, aplicado **somente nessa rota** (não com `app.use`).

O middleware deve recusar o registro nestes casos, sempre com status **400**:

| Situação | Mensagem no campo `erro` |
| --- | --- |
| `cliente` não foi enviado | `O campo cliente e obrigatorio` |
| `exemplar` não foi enviado | `O campo exemplar e obrigatorio` |
| `credito` não é um número | `O campo credito deve ser um numero` |
| `credito` é menor ou igual a zero | `O campo credito deve ser maior que zero` |

A ordem de verificação é a da tabela: se faltarem `cliente` e `exemplar` ao mesmo tempo, a mensagem devolvida é a do `cliente`.

Se estiver tudo válido, o middleware segue para a rota, que deve responder **201**:

```
POST /trocas
{ cliente: "Diego", exemplar: "1984", credito: 15 }

201
{ "mensagem": "Registro de troca criado" }
```

O registro criado deve ser **acrescentado ao array**, de forma que uma nova chamada a `GET /trocas` já o inclua. O `id` deve ser o maior id existente **mais um**, e o `situacao` deve começar como `"avaliando"`.

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

### RF05 — Resumo

A rota `GET /trocas/resumo` deve responder **200** com a quantidade de registros e a soma do campo `credito`:

```
GET /trocas/resumo

200
{ "total": 3, "creditoTotal": 35 }
```

⚠️ Atenção à ordem de declaração: `/resumo` precisa ser declarada **antes** de `/:id`. Se vier depois, o Express entende `resumo` como se fosse um id e a rota nunca é alcançada.

# 📁 ESTRUTURA DO PROJETO

O projeto deverá possuir, no mínimo:

```
livraria-usados-trocas
┣ index.js                     ← app, express.json() e montagem do router, rota 404 e middleware de erro
┣ middlewares
┃ ┗ validarTroca.js        ← middleware de validacao
┣ routes
┃ ┗ trocas.js                ← rotas de trocas
┣ test
┃ ┗ trocas.test.js
┣ package.json
┣ package-lock.json
┗ README.md
```

Regras de exportação:

```jsx
// middlewares/validarTroca.js
module.exports = validarTroca

// routes/trocas.js
module.exports = router

// index.js
module.exports = app
```

O router deve ser montado sob o prefixo `/trocas`, então os caminhos declarados dentro dele são `/` e `/:id`.

⚠️ **Não** chame `app.listen()` dentro do `index.js`.

### ⏱️ Ordem sugerida de ataque

| Momento | O que fazer |
| --- | --- |
| primeiros 15 min | `index.js` com `express.json()` + router com o `GET /` simples (RF01 sem filtros) |
| 15 a 35 min | filtros da query (RF01) e o `GET /:id` com o 404 (RF02) |
| 35 a 50 min | o middleware de validação e o POST (RF03) |
| últimos 10 min | rota inexistente e middleware de erro (RF04) |

O estudante deverá decidir como organizar as funções dentro dos arquivos.
