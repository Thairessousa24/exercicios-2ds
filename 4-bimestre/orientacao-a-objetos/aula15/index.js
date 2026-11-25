
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

// Atualizar um contato
async function atualizar(id, dados) {
    const contatos = await listar()

    const indice = contatos.findIndex(c => c.id === id)

    if (indice === -1) {
        return null
    }

    contatos[indice] = { ...contatos[indice], ...dados }

    await gravar(contatos)

    return contatos[indice]
}

module.exports = { listar, salvar, atualizar }