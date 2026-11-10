# 🎯 Aula 9 — Testando API com Ferramentas

## 🎯 Objetivos da Aula

- Entender para que serve um **cliente HTTP**.
- Montar uma requisição com **método**, **caminho**, **headers** e **body**.
- Ler uma resposta: **status**, **headers** e **corpo**.
- Organizar requisições em uma **coleção**.
- Usar o **Bruno** no VS Code para enviar requisições e conferir as respostas.

# 🤔 Por que preciso de uma ferramenta?

Até agora testamos as rotas pelo navegador. Mas o navegador só consegue fazer **GET**.

Para testar uma rota `POST /produtos` que recebe JSON no corpo, o navegador não serve. É aí que entram o **Postman** e o **Insomnia**: programas feitos para montar qualquer requisição HTTP e ver a resposta crua.

| Navegador | Cliente HTTP |
| --- | --- |
| só GET | GET, POST, PUT, DELETE, ... |
| sem corpo na requisição | body em JSON, formulário, arquivo |
| headers automáticos | você define cada header |
| não guarda o que você testou | salva tudo em coleções |

📌 Postman e Insomnia fazem a mesma coisa, com telas parecidas, e são os nomes que você vai encontrar no mercado. Na prática desta aula vamos usar o **Bruno**, que é o mesmo tipo de ferramenta, mas funciona dentro do VS Code e não pede conta. O que você aprender em um serve nos outros.

# 🧩 Anatomia de uma requisição

Toda requisição tem quatro partes:

```
┌──────────────────────────────────────────────┐
│ MÉTODO   CAMINHO                             │
│ POST     http://localhost:3000/produtos      │
├──────────────────────────────────────────────┤
│ HEADERS                                      │
│ Content-Type: application/json                │
├──────────────────────────────────────────────┤
│ BODY                                          │
│ { "nome": "Teclado", "preco": 150 }           │
└──────────────────────────────────────────────┘
```

## 1️⃣ Método

É o botão/lista suspensa ao lado da URL. Escolha de acordo com a intenção:

| Método | Intenção |
| --- | --- |
| GET | buscar |
| POST | criar |
| PUT | atualizar |
| DELETE | remover |

## 2️⃣ Caminho (URL)

O endereço completo. Em desenvolvimento, aponta para a sua máquina:

```
http://localhost:3000/produtos
```

| Parte | O que é |
| --- | --- |
| `http://` | o protocolo |
| `localhost` | a sua própria máquina |
| `:3000` | a porta em que o servidor subiu |
| `/produtos` | o caminho da rota |

⚠️ A porta precisa ser a mesma do `app.listen()`. Se você mudou o `.env`, mude aqui também.

## 3️⃣ Headers

**Headers** são informações sobre a requisição — não o conteúdo dela. Ficam na aba *Headers*.

| Header | Para que serve |
| --- | --- |
| `Content-Type` | diz em que formato o corpo está |
| `Accept` | diz em que formato você quer a resposta |
| `Authorization` | envia o token de autenticação |

O que vamos usar neste bimestre:

```
Content-Type: application/json
```

📌 Sem esse header, o Express **não** entende o corpo e `req.body` vem `undefined` — é o erro número um de quem está começando. Postman, Insomnia e Bruno adicionam esse header automaticamente quando você escolhe o tipo de corpo "JSON", mas vale conferir.

## 4️⃣ Body

O **corpo** é o conteúdo que você envia. Fica na aba *Body*, com o tipo **JSON** selecionado:

```json
{
  "nome": "Teclado",
  "preco": 150
}
```

Regras do JSON que mais pegam gente:

- chaves **sempre** entre aspas duplas: `"nome"`, nunca `nome` ou `'nome'`;
- sem vírgula depois do último item;
- número sem aspas (`150`), texto com aspas (`"Teclado"`).

📌 GET e DELETE normalmente **não** têm corpo. POST e PUT quase sempre têm.

# 👀 Lendo a resposta

Depois de clicar em *Send*, a resposta aparece na parte de baixo:

```
┌──────────────────────────────────────────────┐
│ Status: 201 Created          Tempo: 12 ms    │
├──────────────────────────────────────────────┤
│ { "id": 3, "nome": "Teclado", "preco": 150 } │
└──────────────────────────────────────────────┘
```

O que olhar, em ordem:

1. **Status** — a primeira coisa. Diz se deu certo (2xx), se você errou (4xx) ou se o servidor quebrou (5xx).
2. **Body** — o conteúdo devolvido.
3. **Headers** — numa aba separada, para conferir o `Content-Type` da resposta.
4. **Tempo** — útil para notar rota lenta.

## 🔍 Diagnóstico pelo status

| Status | O que provavelmente aconteceu |
| --- | --- |
| 200 / 201 | deu certo |
| 400 | seu JSON está inválido ou falta um campo |
| 404 | o caminho está errado, ou o método não bate com a rota |
| 500 | a rota existe mas o código quebrou — olhe o terminal do servidor |
| *não conecta* | o servidor não está rodando, ou a porta está errada |

📌 O último caso não é um status: é a ferramenta dizendo que não achou ninguém atendendo. Confira se o servidor está rodando no terminal.

# 📁 Coleções

Testar uma rota e perder a requisição é desperdício. Uma **coleção** é uma pasta de requisições salvas, que você reutiliza e compartilha com o time.

```text
📁 API da Loja
├── 📁 Produtos
│   ├── GET    Listar produtos        /produtos
│   ├── POST   Criar produto          /produtos
│   ├── PUT    Atualizar produto      /produtos/1
│   └── DELETE Remover produto        /produtos/1
└── 📁 Clientes
    ├── GET    Listar clientes        /clientes
    └── POST   Criar cliente          /clientes
```

Boas práticas:

- **nome descritivo** em cada requisição ("Criar produto", não "nova requisição");
- **uma pasta por recurso** — espelhando a pasta `routes/` da aula 6;
- guarde também as requisições que dão **erro de propósito** (ex.: "Criar produto sem nome → 400"). São elas que provam que sua validação funciona.

# 🛠️ Mão na massa: testando com o Bruno

Agora vamos fazer tudo isso de verdade. O **Bruno** é um cliente HTTP gratuito e de código aberto, com extensão para o VS Code.

| Por que o Bruno nesta aula? | |
| --- | --- |
| Sem conta | instalou, já pode usar |
| Dentro do VS Code | a API e as requisições ficam na mesma janela |
| Funciona no Codespaces | o `localhost` é o mesmo em que sua API está rodando |
| Coleção em arquivos | fica na pasta do projeto e vai junto no `git push` |

## 1️⃣ Instalando a extensão

1. Abra a aba **Extensões** do VS Code (`Ctrl + Shift + X`).
2. Pesquise por **Bruno**.
3. Confira se o publicador é **bruno-api-client** e clique em **Install**.
4. O ícone do Bruno aparece na barra lateral esquerda.

## 2️⃣ Subindo uma API para testar

Precisamos de uma API rodando. Os exemplos das aulas 9 e 10 são para você acompanhar no seu computador, **fora do repositório**:

1. Crie uma pasta chamada `estudos-api`, fora da pasta do repositório.
2. Abra essa pasta no VS Code.
3. No terminal dessa pasta, instale o Express:

```bash
npm install express
```

⚠️ Na pasta `aula09` do repositório, crie **somente** os arquivos do Exercício Rápido. Os exemplos da aula não vão para lá.

Na pasta `estudos-api`, crie um arquivo chamado `loja.js` e digite o código abaixo. Ele é só um exemplo para treinar a ferramenta, e algumas partes você vai entender melhor na aula 10.

```jsx
const express = require("express")

const app = express()
app.use(express.json())

const produtos = [
    { nome: "Mouse", preco: 80 },
    { nome: "Monitor", preco: 900 }
]

app.get("/produtos", (req, res) => {
    res.json(produtos)
})

app.post("/produtos", (req, res) => {
    if (!req.body.nome) {
        return res.status(400).json({ erro: "O campo nome e obrigatorio" })
    }

    produtos.push(req.body)
    res.status(201).json(req.body)
})

app.listen(3000, () => {
    console.log("API da Loja em http://localhost:3000")
})
```

Suba o servidor e **deixe esse terminal aberto**:

```bash
node --watch loja.js
```

Deve aparecer `API da Loja em http://localhost:3000`.

## 3️⃣ Criando a coleção

1. Clique no ícone do **Bruno** na barra lateral.
2. Clique em **Create Collection**.
3. Em **Collection Name**, escreva `API da Loja`.
4. Em **Location**, escolha a pasta `estudos-api`.
5. Confirme em **Create Collection**.

A coleção aparece na lateral, e uma pasta com os arquivos dela é criada dentro de `estudos-api`.

## 4️⃣ Sua primeira requisição: GET

1. Clique com o botão direito na coleção e escolha **New Request**.
2. Em **Request Type**, deixe **HTTP**.
3. Dê o nome `Listar produtos`.
4. Deixe o método **GET** e digite a URL `http://localhost:3000/produtos`.
5. Confirme a criação.
6. Clique na seta ao lado da URL ou aperte `Ctrl + Enter`.

O resultado esperado é o status **200** e este corpo:

```json
[
  { "nome": "Mouse", "preco": 80 },
  { "nome": "Monitor", "preco": 900 }
]
```

## 5️⃣ Enviando dados: POST

1. Crie outra requisição chamada `Criar produto`, com o método **POST** e a URL `http://localhost:3000/produtos`.
2. Abra a aba **Body** e troque **No Body** por **JSON**.
3. Cole o corpo:

```json
{
  "nome": "Teclado",
  "preco": 150
}
```

4. Salve com `Ctrl + S` e envie com `Ctrl + Enter`.

O resultado esperado é o status **201** com o produto criado. Execute de novo a requisição `Listar produtos`: agora ela devolve três itens.

📌 Sempre que alterar uma requisição, salve com `Ctrl + S`. É assim que a mudança fica na coleção.

📌 PUT e DELETE funcionam da mesma forma: basta trocar o método. A `loja.js` não tem essas rotas, para o código ficar curto.

## 6️⃣ Errando de propósito

Testar só o caminho feliz não basta. Provoque cada erro abaixo e veja a resposta:

| O que fazer | Status | O que aparece |
| --- | --- | --- |
| POST com o corpo `{ "preco": 150 }` | 400 | `{ "erro": "O campo nome e obrigatorio" }` |
| POST com o corpo `{ nome: 'Teclado' }` | 400 | uma página HTML com `SyntaxError` |
| GET em `/produto` (sem o `s`) | 404 | uma página HTML com `Cannot GET /produto` |
| PUT em `/produtos` | 404 | uma página HTML com `Cannot PUT /produtos` |
| Parar o servidor (`Ctrl + C`) e enviar | não tem | erro de conexão, sem status |

Salve a primeira como `Criar produto sem nome`. Ela vai para a coleção porque prova que a validação funciona. Depois, suba o servidor de novo.

## 7️⃣ Rodando a coleção inteira

1. Clique com o botão direito na coleção e escolha **Run Collection**.
2. Confirme em **Run Collection**.

Todas as requisições rodam em sequência, e dá para conferir o status de cada uma.

# 🗂️ Descrevendo a coleção em código

Uma coleção é, no fundo, uma **lista de requisições** — e cada requisição é um objeto com método, caminho e corpo.

```jsx
const colecao = [
    { nome: "Listar produtos", metodo: "GET", caminho: "/produtos" },
    { nome: "Criar produto", metodo: "POST", caminho: "/produtos",
      body: { nome: "Teclado", preco: 150 } }
]
```

É essa ideia que as ferramentas salvam em arquivo quando você guarda ou exporta uma coleção — e é o que você vai montar no exercício desta aula, junto com a API que responde a ela.

# 📖 Conceitos importantes

| Conceito | Significado |
| --- | --- |
| Cliente HTTP | programa para montar requisições e ver respostas |
| Método | a intenção da requisição (GET, POST, ...) |
| Header | informação sobre a requisição |
| `Content-Type` | formato do corpo enviado |
| Body | conteúdo enviado na requisição |
| Status | código que resume o resultado |
| Coleção | conjunto de requisições salvas |
| Bruno | cliente HTTP usado nesta aula, dentro do VS Code |
| `localhost` | a sua própria máquina |

# ⚠️ Erros comuns

### ❌ Enviar JSON sem o `Content-Type`

O Express ignora o corpo e `req.body` fica `undefined`. Selecione o tipo **JSON** na aba Body — a ferramenta coloca o header por você.

### ❌ JSON com aspas simples ou chave sem aspas

```json
{ nome: 'Teclado' }
```

Correto:

```json
{ "nome": "Teclado" }
```

### ❌ Testar POST pelo navegador

Não existe. Digitar a URL no navegador sempre gera um GET.

### ❌ Esquecer de subir o servidor

A ferramenta diz que não conseguiu conectar. Não é bug na requisição — é servidor desligado.

### ❌ Usar a porta errada

Se o `.env` diz `PORT=4000`, a URL precisa ser `localhost:4000`. Com a porta errada, o resultado é o mesmo de servidor desligado.

### ❌ Subir dois servidores na mesma porta

Se a mensagem do servidor aparecer e o terminal voltar na mesma hora, a porta provavelmente já está ocupada por outro servidor. Pare o que está rodando com `Ctrl + C` no outro terminal e tente de novo. Sem isso, você testa a API antiga sem perceber.

### ❌ Alterar a requisição e não salvar

Salve com `Ctrl + S`, ou a alteração não fica guardada na coleção.

Fim da aula!

_

# 🧩 Exercício Rápido

### 💬 Coleção e API de Tarefas

⚠️ Este exercício tem duas partes, e as duas são obrigatórias: criar a API no `index.js` e **testá-la no Bruno**, na parte final. Não use outra ferramenta.

Crie um arquivo chamado `index.js` que exporte **duas** coisas: a aplicação Express e a descrição da coleção de requisições.

**1. A aplicação (`app`)**, com um array de duas tarefas:

```jsx
{ id: 1, titulo: "Estudar Express", feita: false }
{ id: 2, titulo: "Instalar o Bruno", feita: true }
```

E estas três rotas:

| Método | Caminho | Status | Resposta |
| --- | --- | --- | --- |
| GET | `/tarefas` | 200 | o array completo |
| GET | `/tarefas/pendentes` | 200 | só as tarefas com `feita` igual a `false` |
| POST | `/tarefas` | 201 | o JSON `{ "mensagem": "Tarefa criada" }` |

**2. A coleção (`colecao`)** — um **array** com um objeto por requisição, descrevendo as três rotas acima **nesta ordem**. Cada objeto deve ter:

- `nome` — o nome descritivo da requisição
- `metodo` — `"GET"` ou `"POST"`
- `caminho` — o caminho da rota

O terceiro objeto (o POST) deve ter também:

- `body` — o objeto `{ titulo: "Nova tarefa", feita: false }`
- `headers` — o objeto `{ "Content-Type": "application/json" }`

Os nomes devem ser, na ordem: `"Listar tarefas"`, `"Listar pendentes"` e `"Criar tarefa"`.

No final, exporte os dois com:

```jsx
module.exports = { app, colecao }
```

📌 **Não** chame `app.listen()`.

# 🧪 Segunda parte: testando sua API no Bruno

Depois de passar no `npm test`, faça esta parte **no Bruno**. Ela é obrigatória, mesmo sem entrar na correção automática.

**1.** Pare o servidor da `loja.js` com `Ctrl + C`, porque os dois usam a porta 3000.

**2.** Crie o arquivo `servidor.js`. As chaves em `{ app }` existem porque o `index.js` exporta dois itens:

```jsx
const { app } = require("./index")

const porta = Number(process.env.PORT) || 3000

app.listen(porta, () => {
    console.log(`Servidor na porta ${porta}`)
})
```

**3.** Suba o servidor:

```bash
node --watch servidor.js
```

**4.** Crie a coleção `API de Tarefas`, com **Location** na pasta `aula09` e as mesmas requisições da sua `colecao`. Comece cada URL com `http://localhost:3000`:

| Nome | Método | URL | Body | Status esperado |
| --- | --- | --- | --- | --- |
| Listar tarefas | GET | `/tarefas` | — | 200 |
| Listar pendentes | GET | `/tarefas/pendentes` | — | 200 |
| Criar tarefa | POST | `/tarefas` | `{ "titulo": "Nova tarefa", "feita": false }` | 201 |

**5.** Rode a coleção inteira com **Run Collection** e confira se cada status bate com a tabela.
