const fs = require("fs/promises")

const ARQUIVO = process.env.ARQUIVO_CONTATOS || "contatos.json"

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

async function salvar(contato) {
    const contatos = await listar()
    contatos.push(contato)
    await fs.writeFile(ARQUIVO, JSON.stringify(contatos, null, 2))
    return contato
}

async function buscarPorNome(nome) {
    const contatos = await listar()
    return contatos.find(contato => contato.nome === nome) || null
}

module.exports = { listar, salvar, buscarPorNome }