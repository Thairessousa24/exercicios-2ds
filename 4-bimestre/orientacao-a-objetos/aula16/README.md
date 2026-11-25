# 🎯 Aula 16 — Excluindo Arquivos com o Módulo fs

## 🎯 Objetivos da Aula

- Remover um registro de um arquivo com **`filter`**.
- Saber se o registro foi removido.
- Apagar um arquivo inteiro com **`unlink`**.

# 💡 Por que esta aula é importante?

Toda aplicação precisa apagar dados: um pedido cancelado, um contato que não existe mais. No **projeto 8**, é assim que a API vai cancelar um pedido.

Com esta aula, você fecha as quatro operações básicas de qualquer sistema, o **CRUD**:

| Letra | Operação | Função | Aula |
| --- | --- | --- | --- |
| **C**reate | criar | `salvar` | 14 |
| **R**ead | ler | `listar` | 14 |
| **U**pdate | alterar | `atualizar` | 15 |
| **D**elete | excluir | `remover` | **16** |

# 🗂️ Onde fazer os exemplos

Continue na pasta `estudos-fs`, fora do repositório.

⚠️ Na pasta `aula16` do repositório, crie **somente** o `index.js` do Exercício Rápido. Os exemplos da aula não vão para lá.

# 🔁 A ideia: ler, mudar e gravar

Excluir segue os mesmos três passos da aula 15. Só muda o que fazemos no meio:

```
1. LER o arquivo        (readFile + JSON.parse)
2. MUDAR: tirar o registro da lista
3. GRAVAR o arquivo     (JSON.stringify + writeFile)
```

# 🚀 Passo 1 — Criando os dados

Na pasta `estudos-fs`, crie o arquivo `contatos.json`. Se ele já existir, troque o conteúdo por este:

```json
[
  { "id": 1, "nome": "Ana", "telefone": "9999" },
  { "id": 2, "nome": "Bruno", "telefone": "8888" },
  { "id": 3, "nome": "Carla", "telefone": "7777" }
]
```

# 🔍 Passo 2 — Entendendo o filter

O `filter` cria uma lista **nova**, só com os itens que passam no teste. Crie o arquivo `filtrar.js`:

```jsx
const contatos = [
    { id: 1, nome: "Ana" },
    { id: 2, nome: "Bruno" },
    { id: 3, nome: "Carla" }
]

const restantes = contatos.filter(c => c.id !== 2)

console.log(restantes)
```

Rode com `node filtrar.js`. Deve aparecer:

```
[ { id: 1, nome: 'Ana' }, { id: 3, nome: 'Carla' } ]
```

**Leia assim:** fique com todos os contatos cujo `id` é **diferente** (`!==`) de 2. O Bruno ficou de fora.

# 🗑️ Passo 3 — Removendo do arquivo

Agora usamos o `filter` com os três passos. Crie o arquivo `excluir.js`:

```jsx
const fs = require("fs/promises")

async function excluirBruno() {
    // 1. LER o arquivo
    const conteudo = await fs.readFile("contatos.json", "utf-8")
    const contatos = JSON.parse(conteudo)

    // 2. MUDAR: ficar com todos, menos o Bruno
    const restantes = contatos.filter(c => c.id !== 2)

    // 3. GRAVAR o arquivo
    await fs.writeFile("contatos.json", JSON.stringify(restantes, null, 2))
    console.log("Contato removido")
}

excluirBruno()
```

Rode com `node excluir.js`. Deve aparecer:

```
Contato removido
```

Abra o `contatos.json`: o Bruno sumiu, e ficaram a Ana e a Carla.

**Leia assim:** leia a lista do arquivo, fique com todos os contatos menos o de `id` 2 e grave a lista nova no lugar da antiga.

# 📏 Passo 4 — Sabendo se removeu

Se o `id` não existir, o `filter` não tira ninguém, e a lista nova fica do **mesmo tamanho**. É assim que sabemos se algo foi removido. Crie o arquivo `tamanhos.js`:

```jsx
const contatos = [
    { id: 1, nome: "Ana" },
    { id: 3, nome: "Carla" }
]

const semCarla = contatos.filter(c => c.id !== 3)
const semNinguem = contatos.filter(c => c.id !== 99)

console.log(contatos.length, semCarla.length)
console.log(contatos.length, semNinguem.length)
```

Rode com `node tamanhos.js`. Deve aparecer:

```
2 1
2 2
```

**Leia assim:** sem a Carla, a lista foi de 2 para 1, então algo foi removido. Com o id 99, que não existe, continuou 2, então nada foi removido.

# 🧩 Passo 5 — Juntando tudo na função remover

Agora juntamos os passos em uma função que recebe o `id`. Crie o arquivo `remover.js`:

```jsx
const fs = require("fs/promises")

async function remover(id) {
    // 1. LER o arquivo
    const conteudo = await fs.readFile("contatos.json", "utf-8")
    const contatos = JSON.parse(conteudo)

    // 2. MUDAR: ficar com todos, menos o do id
    const restantes = contatos.filter(c => c.id !== id)

    if (restantes.length === contatos.length) {
        return false
    }

    // 3. GRAVAR o arquivo
    await fs.writeFile("contatos.json", JSON.stringify(restantes, null, 2))
    return true
}

async function testar() {
    console.log(await remover(3))
    console.log(await remover(3))
}

testar()
```

Rode com `node remover.js`. Deve aparecer:

```
true
false
```

Abra o `contatos.json`: a Carla sumiu, e só a Ana ficou.

**Leia assim:**

1. leia a lista do arquivo;
2. fique com todos os contatos menos o do `id`;
3. se a lista continuou do mesmo tamanho, o contato não existia: devolva `false`;
4. se diminuiu, grave a lista e devolva `true`.

Na segunda chamada, a Carla já tinha saído, por isso veio `false`.

# 📄 Passo 6 — Apagando o arquivo inteiro

O `unlink` apaga o **arquivo** do disco, e não só um registro. Para não perder seus contatos, este exemplo usa um arquivo de rascunho. Crie o arquivo `apagar.js`:

```jsx
const fs = require("fs/promises")

async function limpar() {
    try {
        await fs.unlink("rascunho.txt")
        return true
    } catch (erro) {
        return false
    }
}

async function testar() {
    await fs.writeFile("rascunho.txt", "Arquivo temporario")
    console.log(await limpar())
    console.log(await limpar())
}

testar()
```

Rode com `node apagar.js`. Deve aparecer:

```
true
false
```

**Leia assim:** o programa cria o `rascunho.txt` e depois o apaga, então o primeiro resultado é `true`. Na segunda vez, o arquivo já não existe, e o `catch` devolve `false`.

⚠️ Sem o `try/catch`, o programa quebra com o erro `ENOENT` quando o arquivo não existe.

# 📋 Resumo

| Código | O que faz |
| --- | --- |
| `lista.filter(c => c.id !== id)` | cria uma lista nova sem aquele item |
| comparar os tamanhos | diz se algo foi removido |
| `fs.unlink(arquivo)` | apaga o arquivo do disco |
| `try/catch` no `unlink` | evita que o programa quebre se o arquivo não existir |

# ⚠️ Erros comuns

- **Usar `===` no `filter`:** a lista fica só com o contato que você queria remover. O certo é `!==`.
- **Esquecer de gravar:** a lista muda só na memória, e o arquivo continua igual.
- **Usar o `unlink` sem `try/catch`:** o programa quebra quando o arquivo não existe.

Fim da aula!

_

# 🧩 Exercício Rápido

### 💬 Excluindo contatos

Crie um arquivo chamado `index.js`. Cada contato tem a forma `{ id, nome, telefone }`.

**Passo 1.** Comece copiando este código. Ele é o mesmo da aula 14, então você só precisa entender o que ele faz:

```jsx
const fs = require("fs/promises")

const ARQUIVO = process.env.ARQUIVO_CONTATOS || "contatos.json"

async function listar() {
    try {
        const conteudo = await fs.readFile(ARQUIVO, "utf-8")
        return JSON.parse(conteudo)
    } catch (erro) {
        return []
    }
}

async function gravar(contatos) {
    await fs.writeFile(ARQUIVO, JSON.stringify(contatos, null, 2))
}

async function salvar(contato) {
    const contatos = await listar()
    contatos.push(contato)
    await gravar(contatos)
    return contato
}
```

**Passo 2.** Abaixo desse código, crie a função **`remover(id)`**, que deve ser `async`. Siga esta ordem:

1. leia a lista com `await listar()`;
2. com o `filter`, crie uma lista nova só com os contatos de `id` **diferente** (`!==`);
3. se as duas listas tiverem o mesmo tamanho, devolva `false`;
4. se não, grave a lista nova com `await gravar(...)` e devolva `true`.

💡 É quase igual à função `remover` do passo 5. A diferença é que aqui você usa o `listar()` para ler e o `gravar()` para gravar, que já estão prontos no código do passo 1.

**Passo 3.** Crie a função **`limpar()`**, que deve ser `async`:

1. dentro de um `try`, apague o arquivo com `await fs.unlink(ARQUIVO)` e devolva `true`;
2. no `catch`, devolva `false`.

💡 É a mesma função `limpar` do passo 6, trocando `"rascunho.txt"` por `ARQUIVO`.

**Passo 4.** No final, exporte as funções:

```jsx
module.exports = { listar, salvar, remover, limpar }
```
