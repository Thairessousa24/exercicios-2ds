const fs = require("fs/promises")
const os = require("os")
const path = require("path")

const ARQUIVO = path.join(os.tmpdir(), "clinica-consultas-teste.json")

process.env.ARQUIVO_CONSULTAS = ARQUIVO

const { listar, salvar, atualizar, remover } = require("../repositorio")

const REG_1 = { id: 1, paciente: "Ana", exame: "Hemograma", valor: 60, situacao: "agendada" }
const REG_2 = { id: 2, paciente: "Bruno", exame: "Raio-X", valor: 150, situacao: "realizada" }

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

    expect(await atualizar(1, { situacao: "cancelada" })).toEqual({ id: 1, paciente: "Ana", exame: "Hemograma", valor: 60, situacao: "cancelada" })
})

test("atualizar deve preservar os campos nao enviados", async () => {
    await semear()
    await atualizar(2, { situacao: "cancelada" })

    const lista = await listar()

    expect(lista[1]).toEqual({ ...REG_2, situacao: "cancelada" })
})

test("atualizar deve gravar a alteracao no arquivo", async () => {
    await semear()
    await atualizar(1, { valor: 67 })

    const conteudo = JSON.parse(await fs.readFile(ARQUIVO, "utf-8"))

    expect(conteudo[0].valor).toBe(67)
})

test("atualizar deve devolver null para um id inexistente", async () => {
    await semear()

    expect(await atualizar(99, { situacao: "cancelada" })).toBe(null)
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
