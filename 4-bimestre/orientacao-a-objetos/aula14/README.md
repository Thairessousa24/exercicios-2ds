# 🎯 Aula 14 — Lendo Arquivos com o Módulo fs

## 🎯 Objetivos da Aula

- Ler um arquivo com **`readFile`**.
- Transformar o texto lido em lista com **`JSON.parse`**.
- Tratar o arquivo que **ainda não existe**.
- Salvar um novo registro sem perder os anteriores.

# 💡 Por que esta aula é importante?

Na aula 13 você gravou dados em arquivo. Mas guardar só ajuda se der para **ler de volta**: é isso que a rota `GET` vai fazer para mostrar os produtos.

Ler também é necessário para **acrescentar** um item. Como o `writeFile` substitui o arquivo inteiro, gravar só o produto novo apagaria os antigos. Por isso, primeiro lemos a lista, depois acrescentamos e só então gravamos.

| Aula | Assunto |
| --- | --- |
| 13 | escrever no arquivo |
| **14** | ler o arquivo |
| 15 | alterar um registro |
| 16 | excluir um registro |

# 🗂️ Onde fazer os exemplos

Continue na pasta `estudos-fs`, fora do repositório, que você criou na aula 13. Se ainda não tem, crie agora e abra no VS Code.

⚠️ Na pasta `aula14` do repositório, crie **somente** o `index.js` do Exercício Rápido. Os exemplos da aula não vão para lá.

# 🚀 Preparando os arquivos

Para ler um arquivo, primeiro ele precisa existir. Confira se a sua pasta `estudos-fs` tem estes dois arquivos. Se você fez a aula 13 nela, eles já estão lá. Se não, crie pelo VS Code, com o conteúdo abaixo:

**`mensagem.txt`**

```
Ola, mundo!
```

**`produtos.json`**

```json
[
  { "id": 1, "nome": "Mouse", "preco": 80 },
  { "id": 2, "nome": "Monitor", "preco": 900 }
]
```

Em cada exemplo, crie o arquivo `.js` indicado na pasta `estudos-fs` e rode com `node`.

# 📖 Lendo um arquivo

Crie o arquivo `ler.js`:

```jsx
const fs = require("fs/promises")

async function lerMensagem() {
    const conteudo = await fs.readFile("mensagem.txt", "utf-8")
    console.log(conteudo)
}

lerMensagem()
```

Rode com `node ler.js`. Deve aparecer:

```
Ola, mundo!
```

**Leia assim:** o `readFile` abre o arquivo `mensagem.txt` e devolve o texto que está dentro dele.

O `"utf-8"` faz o Node devolver **texto**. Apague o `, "utf-8"` e rode de novo: aparece um `Buffer`, que são os bytes crus do arquivo.

```
<Buffer 4f 6c 61 2c 20 6d 75 6e 64 6f 21>
```

Depois, coloque o `"utf-8"` de volta.

# 🔄 De texto para lista

O `readFile` sempre devolve **texto**, mesmo quando o arquivo é um JSON. Para virar lista, use o `JSON.parse`. Crie o arquivo `ler-produtos.js`:

```jsx
const fs = require("fs/promises")

async function lerProdutos() {
    const conteudo = await fs.readFile("produtos.json", "utf-8")
    console.log(typeof conteudo)

    const produtos = JSON.parse(conteudo)
    console.log(produtos.length)
    console.log(produtos[0].nome)
}

lerProdutos()
```

Rode com `node ler-produtos.js`. Deve aparecer:

```
string
2
Mouse
```

**Leia assim:** o que veio do arquivo é um texto (`string`). Depois do `JSON.parse`, virou uma lista com 2 produtos, e o primeiro é o Mouse.

É o caminho contrário da aula 13:

| Função | Transforma |
| --- | --- |
| `JSON.stringify` | lista → texto (para gravar) |
| `JSON.parse` | texto → lista (depois de ler) |

# 🚧 E se o arquivo não existir?

Na primeira vez que o programa roda, o arquivo ainda não foi criado, e o `readFile` dá o erro `ENOENT` (arquivo não encontrado). Para isso não quebrar o programa, usamos `try/catch`. Crie o arquivo `inexistente.js`:

```jsx
const fs = require("fs/promises")

async function listar() {
    try {
        const conteudo = await fs.readFile("nao-existe.json", "utf-8")
        return JSON.parse(conteudo)
    } catch (erro) {
        return []
    }
}

async function testar() {
    const lista = await listar()
    console.log(lista)
}

testar()
```

Rode com `node inexistente.js`. Como o arquivo `nao-existe.json` não existe, aparece uma lista vazia, sem erro:

```
[]
```

**Leia assim:** tente ler o arquivo e devolver a lista. Se der erro, devolva uma lista vazia.

O `try` tenta executar o código. Se algo der errado, o `catch` roda no lugar dele, e o programa não quebra.

# ➕ Salvando um novo registro

Para acrescentar um produto, siga sempre os **três passos**:

```
1. LER a lista do arquivo
2. ACRESCENTAR o produto
3. GRAVAR a lista inteira
```

**Passo 1.** Troque o `produtos.js` da aula 13 por este, que junta a função `gravar` com as funções de hoje:

```jsx
const fs = require("fs/promises")

const ARQUIVO = process.env.ARQUIVO_PRODUTOS || "produtos.json"

async function listar() {
    try {
        const conteudo = await fs.readFile(ARQUIVO, "utf-8")
        return JSON.parse(conteudo)
    } catch (erro) {
        return []
    }
}

async function gravar(produtos) {
    await fs.writeFile(ARQUIVO, JSON.stringify(produtos, null, 2))
}

async function salvar(produto) {
    const produtos = await listar()
    produtos.push(produto)
    await gravar(produtos)
    return produto
}

module.exports = { listar, salvar }
```

**Leia assim:** o `salvar` lê a lista, acrescenta o produto no final e grava tudo de volta.

**Passo 2.** Troque o `teste.js` da aula 13 por este:

```jsx
const { listar, salvar } = require("./produtos")

async function testar() {
    await salvar({ id: 3, nome: "Teclado", preco: 150 })

    const produtos = await listar()
    console.log(produtos.length, "produtos no arquivo")
}

testar()
```

**Passo 3.** Rode `node teste.js` duas vezes:

```
3 produtos no arquivo
4 produtos no arquivo
```

Abra o `produtos.json`: o Mouse e o Monitor continuam lá, e os novos foram acrescentados no final.

📌 Para voltar ao início, deixe o `produtos.json` de novo com os dois produtos da preparação.

# 🔌 Usando em uma API

Agora vamos usar o `produtos.js` em rotas. Primeiro, instale o Express na pasta `estudos-fs`:

```bash
npm install express
```

Crie o arquivo `api.js`:

```jsx
const express = require("express")
const { listar, salvar } = require("./produtos")

const app = express()
app.use(express.json())

app.get("/produtos", async (req, res) => {
    res.json(await listar())
})

app.post("/produtos", async (req, res) => {
    res.status(201).json(await salvar(req.body))
})

app.listen(3000, () => {
    console.log("API em http://localhost:3000")
})
```

Rode com `node api.js` e deixe o terminal aberto.

📌 A função da rota também precisa do `async`, para poder usar o `await`.

📌 **Lembrete:** teste no **Bruno**, como na aula 9:

1. GET em `http://localhost:3000/produtos` mostra os produtos do arquivo.
2. POST em `http://localhost:3000/produtos` com o body `{ "id": 5, "nome": "Webcam", "preco": 200 }` cadastra um produto.
3. Pare o servidor com `Ctrl + C`, rode `node api.js` de novo e faça o GET: a Webcam continua lá, porque agora está no arquivo.

# ⚠️ Erros comuns

- **Esquecer o `"utf-8"`:** vem um `Buffer` em vez de texto.
- **Esquecer o `JSON.parse`:** você recebe texto, e não uma lista, então o `push` não funciona.
- **Não tratar o arquivo que não existe:** o programa quebra na primeira vez que roda.

Fim da aula!

_

# 🧩 Exercício Rápido

### 💬 Lendo e salvando contatos

Crie um arquivo chamado `index.js` que use `fs/promises` para guardar contatos em um arquivo JSON.

O caminho do arquivo deve vir de **`process.env.ARQUIVO_CONTATOS`**, com `"contatos.json"` como valor padrão quando a variável não existir.

Exporte **três** funções:

**1. `listar()`** — função `async` que:

- lê o arquivo e devolve o array de contatos;
- devolve um **array vazio** (`[]`) se o arquivo não existir.

**2. `salvar(contato)`** — função `async` que:

- lê a lista atual;
- acrescenta o `contato` no **final**;
- grava o arquivo com `JSON.stringify(lista, null, 2)`;
- devolve o contato salvo.

**3. `buscarPorNome(nome)`** — função `async` que:

- lê a lista e devolve o contato cujo `nome` é igual ao recebido (use o `find`, como na aula 10);
- devolve `null` se não encontrar nenhum.

No final, exporte as três com:

```jsx
module.exports = { listar, salvar, buscarPorNome }
```

📌 O teste define a variável `ARQUIVO_CONTATOS` apontando para um arquivo temporário, então **não** escreva o nome do arquivo direto no código das funções. Leia sempre do `process.env`.
