
const fs = require("fs/promises")

const ARQUIVO = process.env.ARQUIVO_TRABALHOS || "trabalhos.json"

async function listar() {
    try {
        const conteudo = await fs.readFile(ARQUIVO, "utf-8")
        return JSON.parse(conteudo)
    } catch (erro) {
        if (erro.code === "ENOENT") {
            return []
        }
        throw erro
    }
}

async function gravar(lista) {
    await fs.writeFile(
        ARQUIVO,
        JSON.stringify(lista, null, 2),
        "utf-8"
    )
}

async function salvar(trabalho) {
    const lista = await listar()

    lista.push(trabalho)

    await gravar(lista)

    return trabalho
}

async function atualizar(id, dados) {
    const lista = await listar()

    const indice = lista.findIndex(
        trabalho => trabalho.id === id
    );

    if (indice === -1) {
        return null
    }

    lista[indice] = {
        ...lista[indice],
        ...dados,
        id: lista[indice].id
    };

    await gravar(lista)

    return lista[indice]
}

async function remover(id) {
    const lista = await listar()

    const indice = lista.findIndex(
        trabalho => trabalho.id === id
    );

    if (indice === -1) {
        return false
    }

    lista.splice(indice, 1)

    await gravar(lista)

    return true
}

module.exports = {
    listar,
    salvar,
    atualizar,
    remover
}