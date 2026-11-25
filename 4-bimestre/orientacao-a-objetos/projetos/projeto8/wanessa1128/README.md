# 🚀 PROJETO 8 — ENCOMENDAS DA DOCERIA COM PERSISTÊNCIA EM ARQUIVO

# 🎯 PROBLEMA

O sistema de encomendas da **Doceria** entrou em uso — e o primeiro problema sério apareceu na primeira semana.

A responsável ligou no sábado à noite:

> "Caiu a luz, o computador reiniciou, e os encomendas do dia desapareceram."

O motivo é o que estudamos na aula 13: os dados estavam num **array em memória**. Quando o processo do Node morre, a memória vai com ele.

A equipe ainda não vai usar banco de dados — isso é conteúdo do ano que vem. A solução desta entrega é gravar os encomendas em um **arquivo JSON**, usando o módulo `fs`. Não é a solução definitiva, mas resolve o problema de hoje com o que já sabemos.

Além disso, foram pedidas duas funções que faltavam: **alterar** um registro já existente e **excluir** um registro.

Seu trabalho é construir o **repositório**: o arquivo `repositorio.js`, que guarda os registros em um arquivo JSON e faz o CRUD completo. Neste projeto não há API nem Express, como nas aulas 15 e 16.

> ⏱️ **Tempo:** este projeto é feito em **um dia de aula (60 minutos)**, com prazo de entrega estendido. Ele foi dimensionado para ser concluído em 60 a 100 minutos no total.

# 📋 PROJETO

### RF01 — Repositório: leitura e gravação

Crie o arquivo `repositorio.js`. Ele é responsável por **toda** a conversa com o arquivo.

O caminho do arquivo vem de **`process.env.ARQUIVO_ENCOMENDAS`**, com `"encomendas.json"` como valor padrão.

O repositório deve exportar duas funções `async`:

| Função | Comportamento |
| --- | --- |
| `listar()` | devolve o array de encomendas; devolve `[]` se o arquivo ainda não existir |
| `salvar(encomenda)` | acrescenta o registro no final, grava o arquivo e devolve o registro salvo |

A gravação deve usar `JSON.stringify(lista, null, 2)`, para o arquivo ficar legível.

⚠️ `listar()` precisa funcionar na **primeira execução**, quando o arquivo ainda não existe. Sem tratamento, o `readFile` lança `ENOENT`.

Cada registro tem esta forma:

```jsx
{ id: 1, cliente: "Ana", doce: "Brigadeiro", quantidade: 50, status: "recebida" }
```

### RF02 — Repositório: alteração e remoção

O repositório deve exportar também:

| Função | Comportamento |
| --- | --- |
| `atualizar(id, dados)` | mescla os `dados` no registro daquele `id`, grava e devolve o registro atualizado; devolve **`null`** se o id não existir |
| `remover(id)` | remove o registro daquele `id` e grava; devolve **`true`** se removeu e **`false`** se o id não existia |

⚠️ No `atualizar`, os campos **não enviados** precisam ser preservados. Enviar apenas `{ status: "entregue" }` não pode apagar o `cliente`, o `doce` nem o `quantidade`.

```
atualizar(1, { status: "entregue" })

// { id: 1, cliente: "Ana", doce: "Brigadeiro", quantidade: 50, status: "entregue" }
```

💡 **Você já fez quase tudo isso nas aulas:** o `listar` e o `salvar` são os da aula 14, o `atualizar` é o da aula 15 e o `remover` é o da aula 16. Reaproveite o código dos exercícios, trocando `contatos` pelos seus registros e `ARQUIVO_CONTATOS` por `ARQUIVO_ENCOMENDAS`.

# 📁 ESTRUTURA DO PROJETO

O projeto deverá possuir, no mínimo:

```
doceria-encomendas
┣ repositorio.js               ← listar, salvar, atualizar, remover (fs)
┣ test
┃ ┗ encomendas.test.js
┣ package.json
┣ package-lock.json
┗ README.md
```

Regras de exportação:

```jsx
// repositorio.js
module.exports = { listar, salvar, atualizar, remover }
```

⚠️ **Não** escreva o nome do arquivo direto nas funções do repositório. Leia sempre de `process.env.ARQUIVO_ENCOMENDAS`, porque o teste aponta essa variável para um arquivo temporário.

### ⏱️ Ordem sugerida de ataque

| Momento | O que fazer |
| --- | --- |
| primeiros 15 min | `listar` e `salvar` (RF01) |
| 15 a 35 min | `atualizar` (RF02) |
| 35 a 50 min | `remover` (RF02) |
| últimos 10 min | rodar o `npm test` e conferir que o arquivo JSON gerado está legível e com indentação |

O estudante deverá decidir como organizar as funções dentro do arquivo.
