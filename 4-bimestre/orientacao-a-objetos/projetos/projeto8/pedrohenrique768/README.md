# 🚀 PROJETO 8 — COMPRAS DA MERCADINHO COM PERSISTÊNCIA EM ARQUIVO

# 🎯 PROBLEMA

O sistema de compras da **Mercadinho** entrou em uso — e o primeiro problema sério apareceu na primeira semana.

A responsável ligou no sábado à noite:

> "Caiu a luz, o computador reiniciou, e os compras do dia desapareceram."

O motivo é o que estudamos na aula 13: os dados estavam num **array em memória**. Quando o processo do Node morre, a memória vai com ele.

A equipe ainda não vai usar banco de dados — isso é conteúdo do ano que vem. A solução desta entrega é gravar os compras em um **arquivo JSON**, usando o módulo `fs`. Não é a solução definitiva, mas resolve o problema de hoje com o que já sabemos.

Além disso, foram pedidas duas funções que faltavam: **alterar** um registro já existente e **excluir** um registro.

Seu trabalho é construir o **repositório**: o arquivo `repositorio.js`, que guarda os registros em um arquivo JSON e faz o CRUD completo. Neste projeto não há API nem Express, como nas aulas 15 e 16.

> ⏱️ **Tempo:** este projeto é feito em **um dia de aula (60 minutos)**, com prazo de entrega estendido. Ele foi dimensionado para ser concluído em 60 a 100 minutos no total.

# 💡 A IDEIA DO PROJETO

Um array vive na memória do programa. Quando o programa para, o array desaparece.

Um arquivo vive no disco. Ele continua lá depois de o programa parar.

Por isso, em vez de guardar os dados num array, vamos guardar num arquivo JSON.

Toda alteração em arquivo JSON segue **sempre os mesmos três passos**:

```
1. LER o arquivo inteiro        → vira um array
2. ALTERAR o array na memória   → push, filter...
3. GRAVAR o arquivo inteiro     → writeFile
```

Não existe "mudar só uma linha" do arquivo. Você lê tudo, muda e grava tudo de novo.

Outra coisa: ler arquivo demora. Por isso as funções usam `async` e `await`.

# 📋 PROJETO

### RF01 — Repositório: leitura e gravação

Crie o arquivo `repositorio.js`. Ele é responsável por **toda** a conversa com o arquivo.

O caminho do arquivo vem de **`process.env.ARQUIVO_COMPRAS`**, com `"compras.json"` como valor padrão.

O repositório deve exportar duas funções `async`:

| Função | Comportamento |
| --- | --- |
| `listar()` | devolve o array de compras; devolve `[]` se o arquivo ainda não existir |
| `salvar(compra)` | acrescenta o registro no final, grava o arquivo e devolve o registro salvo |

A gravação deve usar `JSON.stringify(lista, null, 2)`, para o arquivo ficar legível.

⚠️ `listar()` precisa funcionar na **primeira execução**, quando o arquivo ainda não existe. Sem tratamento, o `readFile` lança `ENOENT`.

Cada registro tem esta forma:

```jsx
{ id: 1, cliente: "Ana", produto: "Arroz", valor: 28, status: "aberta" }
```

### RF02 — Repositório: alteração e remoção

O repositório deve exportar também:

| Função | Comportamento |
| --- | --- |
| `atualizar(id, dados)` | mescla os `dados` no registro daquele `id`, grava e devolve o registro atualizado; devolve **`null`** se o id não existir |
| `remover(id)` | remove o registro daquele `id` e grava; devolve **`true`** se removeu e **`false`** se o id não existia |

⚠️ No `atualizar`, os campos **não enviados** precisam ser preservados. Enviar apenas `{ status: "cancelada" }` não pode apagar o `cliente`, o `produto` nem o `valor`.

```
atualizar(1, { status: "cancelada" })

// { id: 1, cliente: "Ana", produto: "Arroz", valor: 28, status: "cancelada" }
```

💡 **Você já fez quase tudo isso nas aulas:** o `listar` e o `salvar` são os da aula 14, o `atualizar` é o da aula 15 e o `remover` é o da aula 16. Reaproveite o código dos exercícios, trocando `contatos` pelos seus registros e `ARQUIVO_CONTATOS` por `ARQUIVO_COMPRAS`.

# 🪜 POR ONDE COMEÇAR

Faça nesta ordem. Termine um passo antes de ir para o próximo.

1. Na raiz do projeto, crie o arquivo `repositorio.js`.
2. No topo dele, escreva `const fs = require("fs/promises")`.
3. Logo abaixo, escreva `const ARQUIVO = process.env.ARQUIVO_COMPRAS || "compras.json"`.
4. Crie a função `async listar()`.
5. Dentro dela, use `try` para ler o arquivo e `JSON.parse`. No `catch`, devolva `[]`.
6. Crie a função `async salvar(registro)`.
7. Dentro dela: chame `listar()`, use `push` e grave com `writeFile`.
8. Crie a função `async atualizar(id, dados)`.
9. Dentro dela: chame `listar()`, encontre a posição com `findIndex`, devolva `null` se for `-1`, junte com `{ ...registro, ...dados }` e grave.
10. Crie a função `async remover(id)`.
11. Dentro dela: chame `listar()`, use `filter` com `!==`, compare os tamanhos e grave.
12. No final do arquivo, exporte as quatro funções.
13. Rode `npm test` e conserte o que estiver vermelho, um teste por vez.

# 💬 DICAS

Dica: `require("fs/promises")` é a versão do `fs` que funciona com `await`.

Dica: use `await fs.readFile(caminho, "utf-8")` para ler. Sem o `"utf-8"` vem Buffer.

Dica: o `readFile` devolve texto. Use `JSON.parse(...)` para virar array.

Dica: o `writeFile` só aceita texto. Use `JSON.stringify(lista, null, 2)`.

Dica: o `2` do `JSON.stringify` é a indentação. Não esqueça dele.

Dica: use `try` e `catch` no `listar`, para o caso de o arquivo não existir ainda.

Dica: toda função que usa `await` precisa de `async` antes do nome.

Dica: quem chama uma função `async` também precisa de `await`.

Dica: no `filter` da remoção, use `!==` — ficam os que **não** são o id removido.

Dica: compare o tamanho da lista antes e depois para saber se removeu algo.

Dica: no `atualizar`, use `{ ...registro, ...dados }` para não perder os campos que não foram enviados.

# 📁 ESTRUTURA DO PROJETO

O projeto deverá possuir, no mínimo:

```
mercadinho-compras
┣ repositorio.js               ← listar, salvar, atualizar, remover (fs)
┣ test
┃ ┗ compras.test.js
┣ package.json
┣ package-lock.json
┗ README.md
```

Regras de exportação:

```jsx
// repositorio.js
module.exports = { listar, salvar, atualizar, remover }
```

⚠️ **Não** escreva o nome do arquivo direto nas funções do repositório. Leia sempre de `process.env.ARQUIVO_COMPRAS`, porque o teste aponta essa variável para um arquivo temporário.
