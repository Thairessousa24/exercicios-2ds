
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

async function remover(id) {
    const contatos = await listar()

    const restantes = contatos.filter(c => c.id !== id)

    if (restantes.length === contatos.length) {
        return false
    }

    await gravar(restantes)
    return true
}

async function limpar() {
    try {
        await fs.unlink(ARQUIVO)
        return true
    } catch (erro) {
        return false
    }
}

module.exports = { listar, salvar, remover, limpar }