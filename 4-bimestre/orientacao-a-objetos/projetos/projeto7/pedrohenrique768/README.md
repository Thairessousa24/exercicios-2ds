# 🚀 PROJETO 7 — API DE COMPRAS DA PAPELARIA

# 🎯 PROBLEMA

A **Papelaria** cresceu e o controle de compras deixou de caber no caderno. A equipe foi contratada para construir a API que o aplicativo vai consumir.

Na reunião de alinhamento, a responsável contou dois problemas que o sistema antigo tinha:

> "Às vezes o registro entrava sem o nome do cliente, e ninguém sabia para quem era."
>
> "E quando dava erro, a tela mostrava uma mensagem gigante em inglês que ninguém entendia."

Por isso, dois requisitos não são negociáveis: **nenhum registro inválido pode entrar** e **todo erro tem que devolver uma mensagem clara, com o código HTTP certo**.

A API ainda não terá banco de dados — os compras ficam em memória, num array. O que importa nesta entrega é a **validação** e o **tratamento de erros**.

Seu trabalho é construir essa API.

> ⏱️ **Tempo:** este projeto é feito em **um dia de aula (60 minutos)**, com prazo de entrega estendido. Ele foi dimensionado para ser concluído em 60 a 100 minutos no total.

# 💡 A IDEIA DO PROJETO

Uma API recebe dados de fora. E dados de fora podem vir errados.

Se o programa aceitar qualquer coisa, o erro aparece depois, num lugar difícil de achar.

Por isso a API confere os dados **na entrada**. Se estiverem errados, ela recusa na hora e explica o motivo.

Essa conferência pode ficar numa função separada, que roda **antes** da rota. Essa função se chama **middleware**.

O middleware tem duas saídas:

- se os dados estão certos, ele chama `next()` e a rota continua;
- se estão errados, ele responde o erro e a rota nem roda.

Os dados chegam de três lugares diferentes:

| Lugar | Exemplo |
| --- | --- |
| no caminho | `GET /compras/2` → o `2` |
| depois do `?` | `GET /compras?status=confirmada` |
| no corpo | o JSON enviado no POST |

# 📋 PROJETO

Todas as rotas respondem em **JSON**, e a aplicação precisa ter o `express.json()` habilitado.

Os compras iniciais são:

```jsx
{ id: 1, cliente: "Ana", material: "Caderno", valor: 22, status: "entregue" }
{ id: 2, cliente: "Bruno", material: "Caneta", valor: 4, status: "confirmada" }
{ id: 3, cliente: "Carla", material: "Mochila", valor: 130, status: "confirmada" }
```

### RF01 — Listagem com filtro opcional

A rota `GET /compras` deve responder **200** com todos os compras.

Ela também deve aceitar um filtro opcional pela query string:

| Query | Resultado |
| --- | --- |
| `GET /compras` | todos os compras |
| `GET /compras?status=confirmada` | só os compras com aquele `status` |

⚠️ Os filtros são opcionais: a rota tem que funcionar sem nenhum deles. E lembre-se de que tudo que vem da query chega como **texto**.

### RF02 — Busca por id

A rota `GET /compras/:id` deve responder **200** com o registro correspondente.

```
GET /compras/2

200
{ id: 2, cliente: "Bruno", material: "Caneta", valor: 4, status: "confirmada" }
```

Se o id não existir, a rota deve responder **404** com o JSON `{ "erro": "Compra nao encontrado" }`.

```
GET /compras/99

404
{ "erro": "Compra nao encontrado" }
```

⚠️ O id vem do caminho como texto. Compare com o array convertendo para número.

### RF03 — Criação com middleware de validação

A rota `POST /compras` deve usar um **middleware de validação** próprio, chamado `validarCompra`, aplicado **somente nessa rota** (não com `app.use`).

O middleware deve recusar o registro nestes casos, sempre com status **400**:

| Situação | Mensagem no campo `erro` |
| --- | --- |
| `cliente` não foi enviado | `O campo cliente e obrigatorio` |
| `valor` não é um número | `O campo valor deve ser um numero` |

A ordem de verificação é a da tabela: se faltarem `cliente` e `material` ao mesmo tempo, a mensagem devolvida é a do `cliente`.

Se estiver tudo válido, o middleware segue para a rota, que deve responder **201**:

```
POST /compras
{ cliente: "Diego", material: "Caderno", valor: 22 }

201
{ "mensagem": "Registro de compra criado" }
```

O registro criado deve ser **acrescentado ao array**, de forma que uma nova chamada a `GET /compras` já o inclua. O `id` deve ser o maior id existente **mais um**, e o `status` deve começar como `"orcamento"`.

# 🪜 POR ONDE COMEÇAR

Faça nesta ordem. Termine um passo antes de ir para o próximo.

1. Na raiz do projeto, crie o arquivo `index.js`.
2. Nele, crie o `app` com `express()`.
3. Logo depois, escreva `app.use(express.json())`. Sem essa linha o corpo do POST não chega.
4. Crie a pasta `routes` e, dentro dela, o arquivo `compras.js`.
5. Nesse arquivo, crie um `router` com `express.Router()`.
6. Copie o array de compras para dentro desse arquivo.
7. Crie a rota `GET /` que responde o array todo.
8. Agora acrescente o filtro: se `req.query.status` existir, responda só os que combinam.
9. Crie a rota `GET /:id`. Converta o id com `Number(...)` e procure no array.
10. Se não achar, responda 404 com a mensagem do RF02.
11. Crie a pasta `middlewares` e, dentro dela, o arquivo `validarCompra.js`.
12. Nesse arquivo, crie a função `validarCompra(req, res, next)`.
13. Dentro dela, confira as duas regras do RF03. Se alguma falhar, responda 400.
14. Se passar nas duas, chame `next()`.
15. Volte ao arquivo de rotas e crie a rota `POST /`, passando o middleware antes da função.
16. No `index.js`, monte o router com `app.use("/compras", ...)` e exporte o `app`.
17. Rode `npm test` e conserte o que estiver vermelho, um teste por vez.

# 💬 DICAS

Dica: `app.use(express.json())` vem antes das rotas, sempre.

Dica: use `req.query.status` para ler o filtro da URL.

Dica: use `req.params.id` para ler o id do caminho.

Dica: use `Number(req.params.id)` para transformar o id em número antes de comparar.

Dica: use `array.find(...)` para procurar um item e `array.filter(...)` para filtrar vários.

Dica: o `find` devolve `undefined` quando não acha nada.

Dica: use `res.status(404).json({ erro: "..." })` para responder um erro.

Dica: coloque `return` antes de `res.status(...)` dentro de um `if`, para o código não continuar.

Dica: o middleware recebe três coisas: `(req, res, next)`.

Dica: use `req.body` para ler o que veio no corpo do POST.

Dica: use `typeof valor !== "number"` para saber se algo não é número.

Dica: no final do middleware válido, chame `next()` sem argumento nenhum.

# 📁 ESTRUTURA DO PROJETO

O projeto deverá possuir, no mínimo:

```
papelaria-compras
┣ index.js                     ← app, express.json() e montagem do router
┣ middlewares
┃ ┗ validarCompra.js       ← middleware de validacao
┣ routes
┃ ┗ compras.js               ← rotas de compras
┣ test
┃ ┗ compras.test.js
┣ package.json
┣ package-lock.json
┗ README.md
```

Regras de exportação:

```jsx
// middlewares/validarCompra.js
module.exports = validarCompra

// routes/compras.js
module.exports = router

// index.js
module.exports = app
```

O router deve ser montado sob o prefixo `/compras`, então os caminhos declarados dentro dele são `/` e `/:id`.

⚠️ **Não** chame `app.listen()` dentro do `index.js`.

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
| RF01 | GET | `/compras` | — | 200 |
| RF01 | GET | `/compras` | **Params → Query**: um filtro da tabela do RF01 | 200 |
| RF02 | GET | `/compras/:id` | **Params → Path**: `id` = `2` | 200 |
| RF02 | GET | `/compras/:id` | **Params → Path**: `id` = `99` | 404 |
| RF03 | POST | `/compras` | **Body**: o exemplo válido do RF03 | 201 |
| RF03 | POST | `/compras` | **Body**: uma requisição para cada erro da tabela do RF03 | 400 |
| RF04 | GET | `/qualquer-coisa` | — | 404 |

⚠️ No Body, o JSON precisa de aspas duplas nas chaves. O exemplo do RF03 está resumido, então escreva `{ "campo": "valor" }`, e não `{ campo: "valor" }`.

Nas requisições de erro, confira também a mensagem no campo `erro`.

**5.** Reinicie o servidor, rode tudo com **Run Collection** e confira se cada status bate com a tabela.
