const fs = require("fs/promises")
const os = require("os")
const path = require("path")

const ARQUIVO = path.join(os.tmpdir(), "contatos-teste-aula14.json")

process.env.ARQUIVO_CONTATOS = ARQUIVO

const { listar, salvar, buscarPorNome } = require("../index")

beforeEach(async () => {
    await fs.rm(ARQUIVO, { force: true })
})

afterAll(async () => {
    await fs.rm(ARQUIVO, { force: true })
})

test("listar deve devolver um array vazio quando o arquivo nao existe", async () => {
    expect(await listar()).toEqual([])
})

test("salvar deve devolver o contato salvo", async () => {
    const contato = await salvar({ nome: "Ana", telefone: "9999" })

    expect(contato).toEqual({ nome: "Ana", telefone: "9999" })
})

test("salvar deve gravar o contato no arquivo", async () => {
    await salvar({ nome: "Ana", telefone: "9999" })

    const conteudo = await fs.readFile(ARQUIVO, "utf-8")

    expect(JSON.parse(conteudo)).toEqual([{ nome: "Ana", telefone: "9999" }])
})

test("o arquivo gravado deve estar indentado com dois espacos", async () => {
    await salvar({ nome: "Ana", telefone: "9999" })

    const conteudo = await fs.readFile(ARQUIVO, "utf-8")

    expect(conteudo).toContain("\n  ")
})

test("listar deve devolver os contatos gravados, na ordem", async () => {
    await salvar({ nome: "Ana", telefone: "9999" })
    await salvar({ nome: "Bruno", telefone: "8888" })

    expect(await listar()).toEqual([
        { nome: "Ana", telefone: "9999" },
        { nome: "Bruno", telefone: "8888" }
    ])
})

test("os dados devem persistir entre chamadas diferentes", async () => {
    await salvar({ nome: "Ana", telefone: "9999" })

    const lista = await listar()

    expect(lista.length).toBe(1)
})

test("buscarPorNome deve encontrar o contato certo", async () => {
    await salvar({ nome: "Ana", telefone: "9999" })
    await salvar({ nome: "Bruno", telefone: "8888" })

    expect(await buscarPorNome("Bruno")).toEqual({
        nome: "Bruno",
        telefone: "8888"
    })
})

test("buscarPorNome deve devolver null quando nao encontra", async () => {
    await salvar({ nome: "Ana", telefone: "9999" })

    expect(await buscarPorNome("Carla")).toBe(null)
})
