const fs = require("fs/promises")
const os = require("os")
const path = require("path")

const ARQUIVO = path.join(os.tmpdir(), "eletronica-pedidos-teste.json")

process.env.ARQUIVO_PEDIDOS = ARQUIVO

const { listar, salvar, atualizar, remover, contar } = require("../repositorio")

const REG_1 = { id: 1, cliente: "Ana", componente: "Resistor", valor: 1, status: "aberto" }
const REG_2 = { id: 2, cliente: "Bruno", componente: "Arduino Uno", valor: 120, status: "separado" }

beforeEach(async () => {
    await fs.rm(ARQUIVO, { force: true })
})

afterAll(async () => {
    await fs.rm(ARQUIVO, { force: true })
})

async function semear() {
    await salvar({ ...REG_1 })
    await salvar({ ...REG_2 })
}

// RF - repositorio: leitura e gravacao
test("listar deve devolver array vazio quando o arquivo nao existe", async () => {
    expect(await listar()).toEqual([])
})

test("salvar deve devolver o registro salvo", async () => {
    expect(await salvar({ ...REG_1 })).toEqual(REG_1)
})

test("salvar deve gravar o registro no arquivo", async () => {
    await salvar({ ...REG_1 })

    const conteudo = await fs.readFile(ARQUIVO, "utf-8")

    expect(JSON.parse(conteudo)).toEqual([REG_1])
})

test("o arquivo gravado deve estar indentado com dois espacos", async () => {
    await salvar({ ...REG_1 })

    expect(await fs.readFile(ARQUIVO, "utf-8")).toContain("\n  ")
})

test("os registros devem persistir na ordem de insercao", async () => {
    await semear()

    expect(await listar()).toEqual([REG_1, REG_2])
})

// RF - repositorio: atualizar
test("atualizar deve devolver o registro com o campo alterado", async () => {
    await semear()

    expect(await atualizar(1, { status: "enviado" })).toEqual({ id: 1, cliente: "Ana", componente: "Resistor", valor: 1, status: "enviado" })
})

test("atualizar deve preservar os campos nao enviados", async () => {
    await semear()
    await atualizar(2, { status: "enviado" })

    const lista = await listar()

    expect(lista[1]).toEqual({ ...REG_2, status: "enviado" })
})

test("atualizar deve gravar a alteracao no arquivo", async () => {
    await semear()
    await atualizar(1, { valor: 8 })

    const conteudo = JSON.parse(await fs.readFile(ARQUIVO, "utf-8"))

    expect(conteudo[0].valor).toBe(8)
})

test("atualizar deve devolver null para um id inexistente", async () => {
    await semear()

    expect(await atualizar(99, { status: "enviado" })).toBe(null)
})

// RF - repositorio: remover
test("remover deve devolver true e tirar o registro do arquivo", async () => {
    await semear()

    expect(await remover(1)).toBe(true)
    expect(await listar()).toEqual([REG_2])
})

test("remover deve devolver false para um id inexistente", async () => {
    await semear()

    expect(await remover(99)).toBe(false)
    expect((await listar()).length).toBe(2)
})

// RF - contagem
test("contar deve devolver 0 quando o arquivo nao existe", async () => {
    expect(await contar()).toBe(0)
})

test("contar deve devolver a quantidade de registros", async () => {
    await semear()

    expect(await contar()).toBe(2)
})
