# 🚀 PROJETO 8 — INGRESSOS DA CINEMA EM ARQUIVO

# 📋 PROJETO

Os dados ficam em um arquivo JSON, não em um array. Neste projeto você faz só o arquivo `repositorio.js`.

O caminho do arquivo vem de `process.env.ARQUIVO_INGRESSOS`.

O valor padrão é `"ingressos.json"`.

### RF01 — Repositório

Crie o arquivo `repositorio.js`.

Use `require("fs/promises")`.

Ele exporta duas funções `async`:

| Função | O que faz |
| --- | --- |
| `listar()` | devolve o array do arquivo; devolve `[]` se o arquivo não existir |
| `salvar(registro)` | acrescenta no final, grava o arquivo e devolve o registro |

Grave com `JSON.stringify(lista, null, 2)`.

### RF02 — Alterar e remover

O `repositorio.js` também exporta estas duas funções `async`:

| Função | O que faz |
| --- | --- |
| `atualizar(id, dados)` | junta os `dados` no registro daquele `id`, grava e devolve o registro alterado; devolve `null` se o `id` não existir |
| `remover(id)` | tira o registro daquele `id` e grava; devolve `true` se tirou e `false` se o `id` não existia |

No `atualizar`, os campos que não foram enviados continuam iguais.

```
atualizar(1, { situacao: "utilizado" })

// { id: 1, cliente: "Ana", sessao: "Duna", valor: 12, situacao: "utilizado" }
```

💡 O `atualizar` é o da aula 15, e o `remover` é o da aula 16.

# 🧩 EXEMPLO DE ESTRUTURA

Este exemplo usa outro assunto. Serve só para mostrar o formato.

```jsx
// exemplo-repositorio.js
const fs = require("fs/promises")

const ARQUIVO = process.env.ARQUIVO_CIDADES || "cidades.json"

async function listar() {
    try {
        return JSON.parse(await fs.readFile(ARQUIVO, "utf-8"))
    } catch (erro) {
        return []
    }
}

async function salvar(cidade) {
    const cidades = await listar()

    cidades.push(cidade)

    await fs.writeFile(ARQUIVO, JSON.stringify(cidades, null, 2))

    return cidade
}

async function atualizar(id, dados) {
    const cidades = await listar()
    const indice = cidades.findIndex(c => c.id === id)

    if (indice === -1) {
        return null
    }

    cidades[indice] = { ...cidades[indice], ...dados }

    await fs.writeFile(ARQUIVO, JSON.stringify(cidades, null, 2))

    return cidades[indice]
}

async function remover(id) {
    const cidades = await listar()
    const restantes = cidades.filter(c => c.id !== id)

    if (restantes.length === cidades.length) {
        return false
    }

    await fs.writeFile(ARQUIVO, JSON.stringify(restantes, null, 2))

    return true
}

module.exports = { listar, salvar, atualizar, remover }
```

# 📁 ESTRUTURA DO PROJETO

```
cinema-ingressos
┣ repositorio.js
┣ test
┃ ┗ ingressos.test.js
┣ package.json
┣ package-lock.json
┗ README.md
```

```jsx
// repositorio.js
module.exports = { listar, salvar, atualizar, remover }
```
