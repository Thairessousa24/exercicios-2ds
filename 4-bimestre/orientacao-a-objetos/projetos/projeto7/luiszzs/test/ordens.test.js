const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /ordens deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/ordens")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, motorista: "Ana", servico: "Troca de Oleo", valor: 180, situacao: "concluida" },
    { id: 2, motorista: "Bruno", servico: "Alinhamento", valor: 120, situacao: "executando" },
    { id: 3, motorista: "Carla", servico: "Revisao", valor: 400, situacao: "executando" }
])
})

test("GET /ordens deve filtrar por situacao", async () => {
    const res = await request(app).get("/ordens?situacao=executando")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, motorista: "Bruno", servico: "Alinhamento", valor: 120, situacao: "executando" },
    { id: 3, motorista: "Carla", servico: "Revisao", valor: 400, situacao: "executando" }
])
})

test("GET /ordens deve filtrar por valorMin", async () => {
    const res = await request(app).get("/ordens?valorMin=400")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /ordens deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/ordens?situacao=executando&valorMin=400")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /ordens/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/ordens/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, motorista: "Bruno", servico: "Alinhamento", valor: 120, situacao: "executando" })
})

test("GET /ordens/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/ordens/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Ordem nao encontrado" })
})

test("POST /ordens deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/ordens")
        .send({ motorista: "Diego", servico: "Troca de Oleo", valor: 180 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de ordem criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/ordens")
            .send({ motorista: "Diego", servico: "Troca de Oleo", valor: 180 })

        const res = await request(app).get("/ordens")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, motorista: "Diego", servico: "Troca de Oleo", valor: 180, situacao: "aberta" })
    })

test("POST /ordens deve responder 400 sem o motorista", async () => {
    const res = await request(app)
        .post("/ordens")
        .send({ servico: "Troca de Oleo", valor: 180 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo motorista e obrigatorio" })
})

test("POST /ordens deve responder 400 sem o servico", async () => {
    const res = await request(app)
        .post("/ordens")
        .send({ motorista: "Diego", valor: 180 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo servico e obrigatorio" })
})

test("POST /ordens deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/ordens")
            .send({ motorista: "Diego", servico: "Troca de Oleo", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /ordens deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/ordens")
        .send({ motorista: "Diego", servico: "Troca de Oleo", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/ordens")
        .send({ valor: 180 })

    expect(res.body).toEqual({ erro: "O campo motorista e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/ordens").send({ valor: 180 })

    const res = await request(app).get("/ordens")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})

test("GET /ordens/resumo deve responder 200 com o total e a soma", async () => {
    const res = await request(app).get("/ordens/resumo")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ total: 3, valorTotal: 700 })
})

test("a rota /resumo deve estar declarada antes de /:id", async () => {
    const res = await request(app).get("/ordens/resumo")

    expect(res.body.total).toBe(3)
})
