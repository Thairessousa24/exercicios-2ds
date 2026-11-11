const fs = require("fs/promises")
const os = require("os")
const path = require("path")

const ARQUIVO = path.join(os.tmpdir(), "contatos-teste-aula13.json")

process.env.ARQUIVO_CONTATOS = ARQUIVO

const { gravar } = require("../index")

beforeEach(async () => {
    await fs.rm(ARQUIVO, { force: true })
})

afterAll(async () => {
    await fs.rm(ARQUIVO, { force: true })
})

test("gravar deve criar o arquivo com os contatos", async () => {
    await gravar([{ nome: "Ana", telefone: "9999" }])

    const conteudo = await fs.readFile(ARQUIVO, "utf-8")

    expect(JSON.parse(conteudo)).toEqual([{ nome: "Ana", telefone: "9999" }])
})

test("o arquivo gravado deve estar indentado com dois espacos", async () => {
    await gravar([{ nome: "Ana", telefone: "9999" }])

    const conteudo = await fs.readFile(ARQUIVO, "utf-8")

    expect(conteudo).toBe(JSON.stringify([{ nome: "Ana", telefone: "9999" }], null, 2))
})

test("gravar deve guardar todos os contatos, na ordem", async () => {
    await gravar([
        { nome: "Ana", telefone: "9999" },
        { nome: "Bruno", telefone: "8888" }
    ])

    const conteudo = JSON.parse(await fs.readFile(ARQUIVO, "utf-8"))

    expect(conteudo).toEqual([
        { nome: "Ana", telefone: "9999" },
        { nome: "Bruno", telefone: "8888" }
    ])
})

test("gravar deve substituir o conteudo anterior", async () => {
    await gravar([{ nome: "Ana", telefone: "9999" }])
    await gravar([{ nome: "Bruno", telefone: "8888" }])

    const conteudo = JSON.parse(await fs.readFile(ARQUIVO, "utf-8"))

    expect(conteudo).toEqual([{ nome: "Bruno", telefone: "8888" }])
})

test("gravar deve aceitar uma lista vazia", async () => {
    await gravar([])

    const conteudo = JSON.parse(await fs.readFile(ARQUIVO, "utf-8"))

    expect(conteudo).toEqual([])
})
