const fs = require("fs/promises")
const os = require("os")
const path = require("path")

const ARQUIVO = path.join(os.tmpdir(), "contatos-teste-aula15.json")

process.env.ARQUIVO_CONTATOS = ARQUIVO

const { listar, salvar, atualizar } = require("../index")

beforeEach(async () => {
    await fs.rm(ARQUIVO, { force: true })

    await salvar({ id: 1, nome: "Ana", telefone: "9999" })
    await salvar({ id: 2, nome: "Bruno", telefone: "8888" })
})

afterAll(async () => {
    await fs.rm(ARQUIVO, { force: true })
})

test("listar deve devolver os contatos gravados", async () => {
    expect(await listar()).toEqual([
        { id: 1, nome: "Ana", telefone: "9999" },
        { id: 2, nome: "Bruno", telefone: "8888" }
    ])
})

test("atualizar deve devolver o contato com o campo alterado", async () => {
    const contato = await atualizar(1, { telefone: "7777" })

    expect(contato).toEqual({ id: 1, nome: "Ana", telefone: "7777" })
})

test("atualizar deve preservar os campos que nao foram enviados", async () => {
    await atualizar(2, { telefone: "1111" })

    const lista = await listar()

    expect(lista[1]).toEqual({ id: 2, nome: "Bruno", telefone: "1111" })
})

test("atualizar deve gravar a alteracao no arquivo", async () => {
    await atualizar(1, { nome: "Ana Paula" })

    const conteudo = JSON.parse(await fs.readFile(ARQUIVO, "utf-8"))

    expect(conteudo[0].nome).toBe("Ana Paula")
})

test("atualizar deve devolver null para um id inexistente", async () => {
    expect(await atualizar(99, { nome: "Ninguem" })).toBe(null)
})

test("atualizar nao deve mudar os outros contatos", async () => {
    await atualizar(1, { telefone: "7777" })

    const lista = await listar()

    expect(lista[1]).toEqual({ id: 2, nome: "Bruno", telefone: "8888" })
})
