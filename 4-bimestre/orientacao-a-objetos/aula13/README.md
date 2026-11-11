# 🎯 Aula 13 — Escrevendo Arquivos com o Módulo fs

## 🎯 Objetivos da Aula

- Entender por que os dados em memória **se perdem**.
- Gravar dados em arquivo com **`fs/promises`**.
- Usar **`async`** e **`await`**.
- Gravar uma lista no formato **JSON**.

# 💡 Por que esta aula é importante?

Faça um teste com a `loja.js` da aula 10: cadastre um produto pelo Bruno e reinicie o servidor. O produto some.

Isso acontece porque o array fica na **memória** do programa. Quando o programa para, a memória é apagada. Para o dado continuar existindo, ele precisa ser gravado em um **arquivo**.

| Memória (array) | Arquivo |
| --- | --- |
| some quando o servidor reinicia | continua salvo |
| só existe enquanto o programa roda | fica no disco |

Nas próximas aulas vamos guardar dados em arquivo, um passo de cada vez:

| Aula | Assunto |
| --- | --- |
| **13** | escrever no arquivo |
| 14 | ler o arquivo |
| 15 | alterar um registro |
| 16 | excluir um registro |

No **projeto 8**, você vai usar tudo isso em uma API.

# 🗂️ Onde fazer os exemplos

Os exemplos das aulas 13 a 16 são para você acompanhar no seu computador, **fora do repositório**:

1. Crie uma pasta chamada `estudos-fs`, fora da pasta do repositório.
2. Abra essa pasta no VS Code.
3. Crie nela os arquivos dos exemplos e rode com `node` no terminal.

Use essa mesma pasta nas aulas 13, 14, 15 e 16. Os arquivos de uma aula continuam sendo usados na seguinte.

⚠️ Na pasta `aula13` do repositório, crie **somente** o `index.js` do Exercício Rápido. Os exemplos da aula não vão para lá.

# 🧩 O módulo fs

**fs** vem de *file system* (sistema de arquivos). Ele já vem com o Node, então não precisa instalar:

```jsx
const fs = require("fs/promises")
```

# ⏳ async e await

Gravar em arquivo **demora** um pouco. Por isso, a função precisa **esperar** a gravação terminar:

| Palavra | Onde fica | O que faz |
| --- | --- | --- |
| `async` | antes de `function` | avisa que a função vai esperar algo |
| `await` | antes da operação demorada | espera ela terminar antes de seguir |

⚠️ O `await` só funciona dentro de uma função `async`.

# ✍️ Gravando um texto

Crie um arquivo `gravar.js`:

```jsx
const fs = require("fs/promises")

async function gravarMensagem() {
    await fs.writeFile("mensagem.txt", "Ola, mundo!")
    console.log("Arquivo gravado")
}

gravarMensagem()
```

Rode com `node gravar.js` e abra o arquivo `mensagem.txt` que apareceu na pasta.

**Leia assim:** o `writeFile` cria o arquivo `mensagem.txt` e escreve o texto dentro dele.

# 🧪 Mais exemplos com texto

Crie cada exemplo em um arquivo novo, rode com `node` e abra o arquivo gravado para ver o resultado.

## 📌 Exemplo 1 — Várias linhas

O `\n` quebra a linha. Crie o arquivo `compras.js`:

```jsx
const fs = require("fs/promises")

async function gravarCompras() {
    await fs.writeFile("compras.txt", "Arroz\nFeijao\nMacarrao")
    console.log("Lista gravada")
}

gravarCompras()
```

Rode com `node compras.js`. O arquivo `compras.txt` fica assim:

```
Arroz
Feijao
Macarrao
```

## 📌 Exemplo 2 — Texto com variáveis

Use a crase (`` ` ``) e o `${}` para montar o texto com valores de variáveis. Crie o arquivo `boletim.js`:

```jsx
const fs = require("fs/promises")

async function gravarBoletim() {
    const nome = "Ana"
    const nota = 9

    await fs.writeFile("boletim.txt", `Aluno: ${nome}\nNota: ${nota}`)
    console.log("Boletim gravado")
}

gravarBoletim()
```

Rode com `node boletim.js`. O arquivo `boletim.txt` fica assim:

```
Aluno: Ana
Nota: 9
```

## 📌 Exemplo 3 — Gravando duas vezes no mesmo arquivo

O `writeFile` **substitui** o arquivo inteiro. Veja o que acontece ao gravar duas vezes. Crie o arquivo `substituir.js`:

```jsx
const fs = require("fs/promises")

async function gravarDuasVezes() {
    await fs.writeFile("recado.txt", "Primeiro recado")
    await fs.writeFile("recado.txt", "Segundo recado")
    console.log("Recado gravado")
}

gravarDuasVezes()
```

Rode com `node substituir.js`. O arquivo `recado.txt` tem só:

```
Segundo recado
```

**Leia assim:** a segunda gravação apagou a primeira.

## 📌 Exemplo 4 — Acrescentando no final

Para **acrescentar** sem apagar o que já existe, use o `appendFile`. Crie o arquivo `registro.js`:

```jsx
const fs = require("fs/promises")

async function registrarAcesso() {
    await fs.appendFile("registro.txt", "Novo acesso\n")
    console.log("Acesso registrado")
}

registrarAcesso()
```

Rode `node registro.js` três vezes. O arquivo `registro.txt` fica assim:

```
Novo acesso
Novo acesso
Novo acesso
```

| Função | O que faz com o conteúdo antigo |
| --- | --- |
| `writeFile` | apaga e grava o novo |
| `appendFile` | mantém e acrescenta no final |

# 📦 Gravando uma lista em JSON

O `writeFile` só grava **texto**. Para gravar uma lista, primeiro transforme em texto com o `JSON.stringify`:

```jsx
const produtos = [
    { id: 1, nome: "Mouse", preco: 80 },
    { id: 2, nome: "Monitor", preco: 900 }
]

await fs.writeFile("produtos.json", JSON.stringify(produtos, null, 2))
```

📌 Este trecho é só para mostrar a ideia. Lembre que o `await` precisa estar dentro de uma função `async`. Na próxima seção ele vai para dentro de uma função.

O `2` deixa o arquivo organizado, com dois espaços de recuo:

```json
[
  {
    "id": 1,
    "nome": "Mouse",
    "preco": 80
  }
]
```

O `JSON.stringify(produtos, null, 2)` recebe três valores:

| Posição | No exemplo | Significado |
| --- | --- | --- |
| 1ª | `produtos` | o que vai virar texto |
| 2ª | `null` | quais campos gravar; `null` grava **todos** |
| 3ª | `2` | quantos espaços de recuo usar |

**Leia assim:** transforme `produtos` em texto, com todos os campos e dois espaços de recuo.

📌 Use sempre o `null, 2`. O `null` está ali só porque o `2` precisa ficar na terceira posição. Com o recuo, você consegue abrir o arquivo e entender o que está gravado.

# 🗂️ Criando uma função gravar

Agora vamos colocar a gravação em uma **função** e usá-la em outro arquivo. Ao final, sua pasta de estudos vai ter estes arquivos:

```
estudos-fs
┣ produtos.js      ← tem a função gravar
┣ teste.js         ← usa a função gravar
┗ produtos.json    ← criado quando você rodar o teste
```

**Passo 1.** Na pasta `estudos-fs`, crie o arquivo `produtos.js`:

```jsx
const fs = require("fs/promises")

async function gravar(produtos) {
    await fs.writeFile("produtos.json", JSON.stringify(produtos, null, 2))
}

module.exports = { gravar }
```

**Leia assim:**

- `gravar` recebe a lista, transforma em texto e grava no arquivo `produtos.json`.
- `module.exports` deixa a função disponível para outros arquivos.

**Passo 2.** Na mesma pasta, crie o arquivo `teste.js`:

```jsx
const { gravar } = require("./produtos")

async function testar() {
    await gravar([
        { id: 1, nome: "Mouse", preco: 80 },
        { id: 2, nome: "Monitor", preco: 900 }
    ])

    console.log("Produtos gravados!")
}

testar()
```

**Leia assim:** o `require("./produtos")` pega a função `gravar` do outro arquivo. A função `testar` grava a lista e, quando termina, mostra a mensagem.

**Passo 3.** No terminal, dentro da pasta `estudos-fs`, rode:

```bash
node teste.js
```

Deve aparecer `Produtos gravados!`.

**Passo 4.** Abra o arquivo `produtos.json`, que apareceu na pasta. Ele deve ter os dois produtos, organizados com recuo.

# 🔧 Escolhendo o arquivo com `process.env`

Hoje a função grava sempre no mesmo arquivo, `produtos.json`. Isso causa um problema quando o código é testado.

**Por que isso é um problema?** O `npm test` também chama a função `gravar`. Se ela gravar sempre no `produtos.json`, o teste **apaga os seus produtos**, porque o `writeFile` substitui o arquivo inteiro (lembre do exemplo 3). Por isso, o teste precisa gravar em **outro arquivo**, só dele.

A solução é deixar o nome do arquivo **mudar sem mexer no código**, usando o `process.env`, como fizemos com a porta na aula 2.

Troque o `produtos.js` por este:

```jsx
const fs = require("fs/promises")

const ARQUIVO = process.env.ARQUIVO_PRODUTOS || "produtos.json"

async function gravar(produtos) {
    await fs.writeFile(ARQUIVO, JSON.stringify(produtos, null, 2))
}

module.exports = { gravar }
```

**Leia assim:** se existir a variável `ARQUIVO_PRODUTOS`, grave no arquivo que ela indicar. Se não existir, grave no `produtos.json`.

Veja funcionando. Rode o teste do jeito normal:

```bash
node teste.js
```

O resultado é gravado no `produtos.json`, como antes. Agora rode informando outro arquivo:

```bash
ARQUIVO_PRODUTOS=copia.json node teste.js
```

Apareceu um arquivo novo, `copia.json`, e o `produtos.json` não foi alterado. O código é o mesmo; só mudou a variável.

📌 É exatamente isso que o teste do exercício faz: ele coloca um arquivo temporário na variável, grava, confere e apaga. Seus arquivos ficam intactos.

# 📋 Resumo

| Código | O que faz |
| --- | --- |
| `require("fs/promises")` | carrega o módulo de arquivos |
| `fs.writeFile(arquivo, texto)` | grava o texto, substituindo o que havia |
| `fs.appendFile(arquivo, texto)` | acrescenta o texto no final |
| `JSON.stringify(lista, null, 2)` | transforma a lista em texto organizado |
| `async` / `await` | espera a gravação terminar |
| `process.env.NOME \|\| "padrao.json"` | usa o arquivo da variável ou, se ela não existir, o padrão |

# ⚠️ Erros comuns

- **Esquecer o `await`:** a função segue sem esperar a gravação terminar.
- **Usar `await` fora de uma função `async`:** dá erro de sintaxe.
- **Gravar a lista sem o `JSON.stringify`:** o Node dá o erro `ERR_INVALID_ARG_TYPE`, porque o `writeFile` só aceita texto.

Fim da aula!

_

# 🧩 Exercício Rápido

### 💬 Gravando contatos em arquivo

Crie um arquivo chamado `index.js` que grave uma lista de contatos em um arquivo JSON.

O nome do arquivo deve vir de **`process.env.ARQUIVO_CONTATOS`**, como na seção **Escolhendo o arquivo com `process.env`**. Use esta linha no começo do arquivo:

```jsx
const ARQUIVO = process.env.ARQUIVO_CONTATOS || "contatos.json"
```

**Leia assim:** use o arquivo que estiver na variável `ARQUIVO_CONTATOS`. Se ela não existir, use `contatos.json`.

Crie a função **`gravar(contatos)`**, que deve ser `async` e:

- receber uma lista de contatos;
- gravar a lista inteira no arquivo com `JSON.stringify(contatos, null, 2)`;
- substituir o que houver no arquivo.

No final, exporte a função com:

```jsx
module.exports = { gravar }
```

📌 Dentro da função, grave no `ARQUIVO`, e não direto em `"contatos.json"`. Assim o teste consegue usar um arquivo temporário e não apaga os seus contatos.
