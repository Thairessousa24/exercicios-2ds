# 🎯 Aula 15 — Alterando Arquivos com o Módulo fs

## 🎯 Objetivos da Aula

- Alterar um dado que está gravado em um arquivo.
- Encontrar a posição de um registro com **`findIndex`**.
- Trocar só os campos que mudaram, sem perder os outros.

# 💡 Por que esta aula é importante?

Dados mudam: um contato troca de telefone, um pedido passa de "recebido" para "pronto". No **projeto 8**, é assim que a cozinha vai mudar o status de um pedido.

| Aula | Assunto |
| --- | --- |
| 13 | escrever no arquivo |
| 14 | ler o arquivo |
| **15** | alterar um registro |
| 16 | excluir um registro |

# 🗂️ Onde fazer os exemplos

Continue na pasta `estudos-fs`, fora do repositório.

⚠️ Na pasta `aula15` do repositório, crie **somente** o `index.js` do Exercício Rápido. Os exemplos da aula não vão para lá.

# 🔁 A ideia: ler, mudar e gravar

Não dá para mudar só um pedaço do arquivo. Para alterar, fazemos três passos, usando o que você já viu nas aulas 13 e 14:

```
1. LER o arquivo        (readFile + JSON.parse)
2. MUDAR na lista
3. GRAVAR o arquivo     (JSON.stringify + writeFile)
```

# 🚀 Passo 1 — Criando os dados

Na pasta `estudos-fs`, crie o arquivo `contatos.json`:

```json
[
  { "id": 1, "nome": "Ana", "telefone": "9999" },
  { "id": 2, "nome": "Bruno", "telefone": "8888" }
]
```

# ✏️ Passo 2 — Alterando um contato

Crie o arquivo `alterar.js`:

```jsx
const fs = require("fs/promises")

async function alterarTelefone() {
    // 1. LER o arquivo
    const conteudo = await fs.readFile("contatos.json", "utf-8")
    const contatos = JSON.parse(conteudo)

    // 2. MUDAR o contato
    contatos[1].telefone = "7777"

    // 3. GRAVAR o arquivo
    await fs.writeFile("contatos.json", JSON.stringify(contatos, null, 2))
    console.log("Telefone alterado")
}

alterarTelefone()
```

Rode com `node alterar.js`. Deve aparecer:

```
Telefone alterado
```

Abra o `contatos.json`: o telefone do Bruno agora é `7777`.

**Leia assim:** leia a lista do arquivo, troque o telefone do contato da posição `1` (o Bruno, porque a contagem começa no `0`) e grave a lista de volta.

# 🔍 Passo 3 — Encontrando a posição

No passo 2, escrevemos a posição `1` direto. Mas, normalmente, sabemos o `id` do contato, e não a posição dele. O `findIndex` descobre a posição. Crie o arquivo `posicao.js`:

```jsx
const fs = require("fs/promises")

async function mostrarPosicao() {
    const conteudo = await fs.readFile("contatos.json", "utf-8")
    const contatos = JSON.parse(conteudo)

    console.log(contatos.findIndex(c => c.id === 2))
    console.log(contatos.findIndex(c => c.id === 99))
}

mostrarPosicao()
```

Rode com `node posicao.js`. Deve aparecer:

```
1
-1
```

**Leia assim:** o contato de `id` 2 está na posição `1`. Não existe contato de `id` 99, então o resultado é `-1`.

# 🧠 Passo 4 — Trocando só o que mudou

Para trocar alguns campos sem perder os outros, use os três pontos `...` (*spread*). Crie o arquivo `juntar.js`:

```jsx
const antigo = { id: 2, nome: "Bruno", telefone: "8888" }
const dados = { telefone: "5555" }

const novo = { ...antigo, ...dados }

console.log(novo)
```

Rode com `node juntar.js`. Deve aparecer:

```
{ id: 2, nome: 'Bruno', telefone: '5555' }
```

**Leia assim:** copie tudo do contato antigo e, por cima, coloque o que foi enviado. Só o `telefone` mudou; o `id` e o `nome` continuam.

# 🧩 Passo 5 — Juntando tudo na função atualizar

Agora juntamos os passos em uma função que recebe o `id` e os dados novos. Crie o arquivo `atualizar.js`:

```jsx
const fs = require("fs/promises")

async function atualizar(id, dados) {
    // 1. LER o arquivo
    const conteudo = await fs.readFile("contatos.json", "utf-8")
    const contatos = JSON.parse(conteudo)

    // 2. MUDAR o contato
    const indice = contatos.findIndex(c => c.id === id)

    if (indice === -1) {
        return null
    }

    contatos[indice] = { ...contatos[indice], ...dados }

    // 3. GRAVAR o arquivo
    await fs.writeFile("contatos.json", JSON.stringify(contatos, null, 2))
    return contatos[indice]
}

async function testar() {
    console.log(await atualizar(1, { telefone: "1234" }))
    console.log(await atualizar(99, { telefone: "0000" }))
}

testar()
```

Rode com `node atualizar.js`. Deve aparecer:

```
{ id: 1, nome: 'Ana', telefone: '1234' }
null
```

Abra o `contatos.json`: o telefone da Ana agora é `1234`.

**Leia assim:**

1. leia a lista do arquivo;
2. procure a posição do contato pelo `id`. Se não achar (`-1`), devolva `null`;
3. junte o contato com os dados novos;
4. grave a lista e devolva o contato alterado.

# 📋 Resumo

| Código | O que faz |
| --- | --- |
| `lista.findIndex(c => c.id === id)` | devolve a posição do item, ou `-1` |
| `{ ...antigo, ...dados }` | junta os dados; o que foi enviado vence |
| `lista[indice] = ...` | troca o item naquela posição |
| `return null` | avisa que o registro não existe |

# ⚠️ Erros comuns

- **Esquecer de gravar:** a lista muda só na memória, e o arquivo continua igual.
- **Trocar o objeto inteiro:** `contatos[indice] = dados` apaga o `id` e o `nome`. Use `{ ...contatos[indice], ...dados }`.
- **Não tratar o `-1`:** se o contato não existir, devolva `null` antes de tentar mudar.

Fim da aula!

_

# 🧩 Exercício Rápido

### 💬 Alterando contatos

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

**Passo 2.** Abaixo desse código, crie a função **`atualizar(id, dados)`**, que deve ser `async`. Siga esta ordem:

1. leia a lista com `await listar()`;
2. encontre a posição do contato com o `findIndex`, comparando o `id`;
3. se a posição for `-1`, devolva `null`;
4. na posição encontrada, junte o contato com os `dados`, usando `{ ...contato, ...dados }`;
5. grave a lista com `await gravar(...)`;
6. devolva o contato atualizado.

💡 É quase igual à função `atualizar` do passo 5. A diferença é que aqui você usa o `listar()` para ler e o `gravar()` para gravar, que já estão prontos no código do passo 1.

**Passo 3.** No final, exporte as funções:

```jsx
module.exports = { listar, salvar, atualizar }
```
