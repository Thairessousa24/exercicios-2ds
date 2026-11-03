# 🎯 Aula 9 — Testando API com Postman ou Insomnia

## 🎯 Objetivos da Aula

- Entender para que serve um **cliente HTTP**.
- Montar uma requisição com **método**, **caminho**, **headers** e **body**.
- Ler uma resposta: **status**, **headers** e **corpo**.
- Organizar requisições em uma **coleção**.

# 🤔 Por que preciso de uma ferramenta?

Até agora testamos as rotas pelo navegador. Mas o navegador só consegue fazer **GET**.

Para testar uma rota `POST /produtos` que recebe JSON no corpo, o navegador não serve. É aí que entram o **Postman** e o **Insomnia**: programas feitos para montar qualquer requisição HTTP e ver a resposta crua.

| Navegador | Cliente HTTP |
| --- | --- |
| só GET | GET, POST, PUT, DELETE, ... |
| sem corpo na requisição | body em JSON, formulário, arquivo |
| headers automáticos | você define cada header |
| não guarda o que você testou | salva tudo em coleções |

📌 Postman e Insomnia fazem a mesma coisa, com telas parecidas. O que você aprender em um serve no outro — use o que preferir.

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

📌 Sem esse header, o Express **não** entende o corpo e `req.body` vem vazio — é o erro número um de quem está começando. Tanto o Postman quanto o Insomnia adicionam esse header automaticamente quando você escolhe o tipo de corpo "JSON", mas vale conferir.

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

📌 O último caso não é um status: é a ferramenta dizendo que não achou ninguém atendendo. Confira se o `npm run dev` está de pé.

# 📁 Coleções

Testar uma rota e perder a requisição é desperdício. Uma **coleção** é uma pasta de requisições salvas, que você reutiliza e compartilha com o time.

```text
📁 API da Loja
├── 📁 Produtos
│   ├── GET    Listar produtos        /produtos
│   ├── GET    Total de produtos      /produtos/total
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

## 🔧 Variáveis de ambiente na ferramenta

As duas ferramentas permitem criar variáveis, como o `.env` da aula 2. Em vez de repetir o endereço em 12 requisições:

```
http://localhost:3000/produtos
```

você cria a variável `base_url` e escreve:

```
{{base_url}}/produtos
```

Assim, mudar a porta ou publicar a API exige alterar **um** valor, não as 12 requisições.

# 🗂️ Descrevendo a coleção em código

Uma coleção é, no fundo, uma **lista de requisições** — e cada requisição é um objeto com método, caminho e corpo.

```jsx
const colecao = [
    { nome: "Listar produtos", metodo: "GET", caminho: "/produtos" },
    { nome: "Criar produto", metodo: "POST", caminho: "/produtos",
      body: { nome: "Teclado", preco: 150 } }
]
```

Isso é exatamente o que as ferramentas salvam em arquivo quando você exporta uma coleção — e é o que você vai montar no exercício desta aula, junto com a API que responde a ela.

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
| `localhost` | a sua própria máquina |

# ⚠️ Erros comuns

### ❌ Enviar JSON sem o `Content-Type`

O Express ignora o corpo e `req.body` fica vazio. Selecione o tipo **JSON** na aba Body — a ferramenta coloca o header por você.

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

Fim da aula!

_

# 🧩 Exercício Rápido

### 💬 Coleção e API de Tarefas

Crie um arquivo chamado `index.js` que exporte **duas** coisas: a aplicação Express e a descrição da coleção de requisições.

**1. A aplicação (`app`)**, com um array de duas tarefas:

```jsx
{ id: 1, titulo: "Estudar Express", feita: false }
{ id: 2, titulo: "Instalar o Insomnia", feita: true }
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
