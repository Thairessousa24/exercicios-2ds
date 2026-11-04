const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /trocas deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/trocas")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, cliente: "Ana", exemplar: "1984", credito: 15, situacao: "concluida" },
    { id: 2, cliente: "Bruno", exemplar: "O Hobbit", credito: 12, situacao: "aprovada" },
    { id: 3, cliente: "Carla", exemplar: "Sapiens", credito: 8, situacao: "aprovada" }
])
})

test("GET /trocas deve filtrar por situacao", async () => {
    const res = await request(app).get("/trocas?situacao=aprovada")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", exemplar: "O Hobbit", credito: 12, situacao: "aprovada" },
    { id: 3, cliente: "Carla", exemplar: "Sapiens", credito: 8, situacao: "aprovada" }
])
})

test("GET /trocas deve filtrar por creditoMin", async () => {
    const res = await request(app).get("/trocas?creditoMin=12")

    expect(res.body.map(r => r.id)).toEqual([1, 2])
})

test("GET /trocas deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/trocas?situacao=aprovada&creditoMin=12")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /trocas/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/trocas/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", exemplar: "O Hobbit", credito: 12, situacao: "aprovada" })
})

test("GET /trocas/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/trocas/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Troca nao encontrado" })
})

test("POST /trocas deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/trocas")
        .send({ cliente: "Diego", exemplar: "1984", credito: 15 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de troca criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/trocas")
            .send({ cliente: "Diego", exemplar: "1984", credito: 15 })

        const res = await request(app).get("/trocas")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", exemplar: "1984", credito: 15, situacao: "avaliando" })
    })

test("POST /trocas deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/trocas")
        .send({ exemplar: "1984", credito: 15 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /trocas deve responder 400 sem o exemplar", async () => {
    const res = await request(app)
        .post("/trocas")
        .send({ cliente: "Diego", credito: 15 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo exemplar e obrigatorio" })
})

test("POST /trocas deve responder 400 quando o credito nao e numero", async () => {
        const res = await request(app)
            .post("/trocas")
            .send({ cliente: "Diego", exemplar: "1984", credito: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo credito deve ser um numero" })
    })

test("POST /trocas deve responder 400 quando o credito nao e maior que zero", async () => {
    const res = await request(app)
        .post("/trocas")
        .send({ cliente: "Diego", exemplar: "1984", credito: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo credito deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/trocas")
        .send({ credito: 15 })

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/trocas").send({ credito: 15 })

    const res = await request(app).get("/trocas")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})

test("GET /trocas/resumo deve responder 200 com o total e a soma", async () => {
    const res = await request(app).get("/trocas/resumo")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ total: 3, creditoTotal: 35 })
})

test("a rota /resumo deve estar declarada antes de /:id", async () => {
    const res = await request(app).get("/trocas/resumo")

    expect(res.body.total).toBe(3)
})
