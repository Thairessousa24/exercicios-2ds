const fs = require("fs/promises")
const os = require("os")
const path = require("path")

const ARQUIVO = path.join(os.tmpdir(), "contatos-teste-aula16.json")

process.env.ARQUIVO_CONTATOS = ARQUIVO

const { listar, salvar, remover, limpar } = require("../index")

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

test("remover deve devolver true e tirar o contato da lista", async () => {
    expect(await remover(1)).toBe(true)

    expect(await listar()).toEqual([
        { id: 2, nome: "Bruno", telefone: "8888" }
    ])
})

test("remover deve gravar a remocao no arquivo", async () => {
    await remover(2)

    const conteudo = JSON.parse(await fs.readFile(ARQUIVO, "utf-8"))

    expect(conteudo.length).toBe(1)
})

test("remover deve devolver false para um id inexistente", async () => {
    expect(await remover(99)).toBe(false)

    expect((await listar()).length).toBe(2)
})

test("limpar deve apagar o arquivo e devolver true", async () => {
    expect(await limpar()).toBe(true)

    await expect(fs.readFile(ARQUIVO, "utf-8")).rejects.toThrow()
})

test("limpar deve devolver false quando o arquivo nao existe", async () => {
    await limpar()

    expect(await limpar()).toBe(false)
})

test("listar deve devolver array vazio depois de limpar", async () => {
    await limpar()

    expect(await listar()).toEqual([])
})
