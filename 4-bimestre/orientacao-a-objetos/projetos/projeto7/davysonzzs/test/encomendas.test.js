const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /encomendas deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/encomendas")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, cliente: "Ana", doce: "Brigadeiro", quantidade: 50, status: "entregue" },
    { id: 2, cliente: "Bruno", doce: "Bolo de Pote", quantidade: 10, status: "produzindo" },
    { id: 3, cliente: "Carla", doce: "Torta", quantidade: 1, status: "produzindo" }
])
})

test("GET /encomendas deve filtrar por status", async () => {
    const res = await request(app).get("/encomendas?status=produzindo")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", doce: "Bolo de Pote", quantidade: 10, status: "produzindo" },
    { id: 3, cliente: "Carla", doce: "Torta", quantidade: 1, status: "produzindo" }
])
})

test("GET /encomendas deve filtrar por quantidadeMin", async () => {
    const res = await request(app).get("/encomendas?quantidadeMin=10")

    expect(res.body.map(r => r.id)).toEqual([1, 2])
})

test("GET /encomendas deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/encomendas?status=produzindo&quantidadeMin=10")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /encomendas/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/encomendas/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", doce: "Bolo de Pote", quantidade: 10, status: "produzindo" })
})

test("GET /encomendas/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/encomendas/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Encomenda nao encontrado" })
})

test("POST /encomendas deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/encomendas")
        .send({ cliente: "Diego", doce: "Brigadeiro", quantidade: 50 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de encomenda criado" })
})

test("o registro criado deve entrar na listagem com id e status corretos", async () => {
        await request(app)
            .post("/encomendas")
            .send({ cliente: "Diego", doce: "Brigadeiro", quantidade: 50 })

        const res = await request(app).get("/encomendas")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", doce: "Brigadeiro", quantidade: 50, status: "recebida" })
    })

test("POST /encomendas deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/encomendas")
        .send({ doce: "Brigadeiro", quantidade: 50 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /encomendas deve responder 400 sem o doce", async () => {
    const res = await request(app)
        .post("/encomendas")
        .send({ cliente: "Diego", quantidade: 50 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo doce e obrigatorio" })
})

test("POST /encomendas deve responder 400 quando o quantidade nao e numero", async () => {
        const res = await request(app)
            .post("/encomendas")
            .send({ cliente: "Diego", doce: "Brigadeiro", quantidade: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo quantidade deve ser um numero" })
    })

test("POST /encomendas deve responder 400 quando o quantidade nao e maior que zero", async () => {
    const res = await request(app)
        .post("/encomendas")
        .send({ cliente: "Diego", doce: "Brigadeiro", quantidade: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo quantidade deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/encomendas")
        .send({ quantidade: 50 })

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/encomendas").send({ quantidade: 50 })

    const res = await request(app).get("/encomendas")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})

test("GET /encomendas/resumo deve responder 200 com o total e a soma", async () => {
    const res = await request(app).get("/encomendas/resumo")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ total: 3, quantidadeTotal: 61 })
})

test("a rota /resumo deve estar declarada antes de /:id", async () => {
    const res = await request(app).get("/encomendas/resumo")

    expect(res.body.total).toBe(3)
})
