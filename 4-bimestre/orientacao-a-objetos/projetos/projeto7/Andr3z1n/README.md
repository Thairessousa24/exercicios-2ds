# 🚀 PROJETO 7 — API DE RESERVAS DA BRINQUEDOTECA

# 🎯 PROBLEMA

A **Brinquedoteca** cresceu e o controle de reservas deixou de caber no caderno. A equipe foi contratada para construir a API que o aplicativo vai consumir.

Na reunião de alinhamento, a responsável contou dois problemas que o sistema antigo tinha:

> "Às vezes o registro entrava sem o nome do responsavel, e ninguém sabia para quem era."
>
> "E quando dava erro, a tela mostrava uma mensagem gigante em inglês que ninguém entendia."

Por isso, dois requisitos não são negociáveis: **nenhum registro inválido pode entrar** e **todo erro tem que devolver uma mensagem clara, com o código HTTP certo**.

A API ainda não terá banco de dados — os reservas ficam em memória, num array. O que importa nesta entrega é a **validação** e o **tratamento de erros**.

Seu trabalho é construir essa API.

> ⏱️ **Tempo:** este projeto é feito em **um dia de aula (60 minutos)**, com prazo de entrega estendido. Ele foi dimensionado para ser concluído em 60 a 100 minutos no total.

# 📋 PROJETO

Todas as rotas respondem em **JSON**, e a aplicação precisa ter o `express.json()` habilitado.

Os reservas iniciais são:

```jsx
{ id: 1, responsavel: "Ana", brinquedo: "Quebra-Cabeca", dias: 3, situacao: "devolvida" }
{ id: 2, responsavel: "Bruno", brinquedo: "Jogo de Tabuleiro", dias: 7, situacao: "ativa" }
{ id: 3, responsavel: "Carla", brinquedo: "Blocos", dias: 5, situacao: "ativa" }
```

### RF01 — Listagem com filtros opcionals

A rota `GET /reservas` deve responder **200** com todos os reservas.

Ela também deve aceitar dois filtros opcionais pela query string:

| Query | Resultado |
| --- | --- |
| `GET /reservas` | todos os reservas |
| `GET /reservas?situacao=ativa` | só os reservas com aquele `situacao` |
| `GET /reservas?diasMin=7` | só os reservas com `dias` maior ou igual ao informado |
| `GET /reservas?situacao=ativa&diasMin=7` | os dois filtros aplicados juntos |

⚠️ Os filtros são opcionais: a rota tem que funcionar sem nenhum deles. E lembre-se de que tudo que vem da query chega como **texto**.

### RF02 — Busca por id

A rota `GET /reservas/:id` deve responder **200** com o registro correspondente.

```
GET /reservas/2

200
{ id: 2, responsavel: "Bruno", brinquedo: "Jogo de Tabuleiro", dias: 7, situacao: "ativa" }
```

Se o id não existir, a rota **não deve responder diretamente**: ela deve criar um erro com a mensagem `"Reserva nao encontrado"` e o status **404**, e encaminhá-lo ao middleware de erro com `next(erro)`.

```
GET /reservas/99

404
{ "erro": "Reserva nao encontrado" }
```

⚠️ O id vem do caminho como texto. Compare com o array convertendo para número.

### RF03 — Criação com middleware de validação

A rota `POST /reservas` deve usar um **middleware de validação** próprio, chamado `validarReserva`, aplicado **somente nessa rota** (não com `app.use`).

O middleware deve recusar o registro nestes casos, sempre com status **400**:

| Situação | Mensagem no campo `erro` |
| --- | --- |
| `responsavel` não foi enviado | `O campo responsavel e obrigatorio` |
| `brinquedo` não foi enviado | `O campo brinquedo e obrigatorio` |
| `dias` não é um número | `O campo dias deve ser um numero` |
| `dias` é menor ou igual a zero | `O campo dias deve ser maior que zero` |

A ordem de verificação é a da tabela: se faltarem `responsavel` e `brinquedo` ao mesmo tempo, a mensagem devolvida é a do `responsavel`.

Se estiver tudo válido, o middleware segue para a rota, que deve responder **201**:

```
POST /reservas
{ responsavel: "Diego", brinquedo: "Quebra-Cabeca", dias: 3 }

201
{ "mensagem": "Registro de reserva criado" }
```

O registro criado deve ser **acrescentado ao array**, de forma que uma nova chamada a `GET /reservas` já o inclua. O `id` deve ser o maior id existente **mais um**, e o `situacao` deve começar como `"solicitada"`.

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
brinquedoteca-reservas
┣ index.js                     ← app, express.json() e montagem do router, rota 404 e middleware de erro
┣ middlewares
┃ ┗ validarReserva.js      ← middleware de validacao
┣ routes
┃ ┗ reservas.js              ← rotas de reservas
┣ test
┃ ┗ reservas.test.js
┣ package.json
┣ package-lock.json
┗ README.md
```

Regras de exportação:

```jsx
// middlewares/validarReserva.js
module.exports = validarReserva

// routes/reservas.js
module.exports = router

// index.js
module.exports = app
```

O router deve ser montado sob o prefixo `/reservas`, então os caminhos declarados dentro dele são `/` e `/:id`.

⚠️ **Não** chame `app.listen()` dentro do `index.js`.

### ⏱️ Ordem sugerida de ataque

| Momento | O que fazer |
| --- | --- |
| primeiros 15 min | `index.js` com `express.json()` + router com o `GET /` simples (RF01 sem filtros) |
| 15 a 35 min | filtros da query (RF01) e o `GET /:id` com o 404 (RF02) |
| 35 a 50 min | o middleware de validação e o POST (RF03) |
| últimos 10 min | rota inexistente e middleware de erro (RF04) |

O estudante deverá decidir como organizar as funções dentro dos arquivos.
