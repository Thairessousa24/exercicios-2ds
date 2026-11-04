const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /ingressos deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/ingressos")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, cliente: "Ana", sessao: "Duna", valor: 12, situacao: "utilizado" },
    { id: 2, cliente: "Bruno", sessao: "Interestelar", valor: 32, situacao: "pago" },
    { id: 3, cliente: "Carla", sessao: "Matrix", valor: 22, situacao: "pago" }
])
})

test("GET /ingressos deve filtrar por situacao", async () => {
    const res = await request(app).get("/ingressos?situacao=pago")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", sessao: "Interestelar", valor: 32, situacao: "pago" },
    { id: 3, cliente: "Carla", sessao: "Matrix", valor: 22, situacao: "pago" }
])
})

test("GET /ingressos deve filtrar por valorMin", async () => {
    const res = await request(app).get("/ingressos?valorMin=32")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /ingressos deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/ingressos?situacao=pago&valorMin=32")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /ingressos/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/ingressos/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", sessao: "Interestelar", valor: 32, situacao: "pago" })
})

test("GET /ingressos/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/ingressos/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Ingresso nao encontrado" })
})

test("POST /ingressos deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/ingressos")
        .send({ cliente: "Diego", sessao: "Duna", valor: 12 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de ingresso criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/ingressos")
            .send({ cliente: "Diego", sessao: "Duna", valor: 12 })

        const res = await request(app).get("/ingressos")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", sessao: "Duna", valor: 12, situacao: "reservado" })
    })

test("POST /ingressos deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/ingressos")
        .send({ sessao: "Duna", valor: 12 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /ingressos deve responder 400 sem o sessao", async () => {
    const res = await request(app)
        .post("/ingressos")
        .send({ cliente: "Diego", valor: 12 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo sessao e obrigatorio" })
})

test("POST /ingressos deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/ingressos")
            .send({ cliente: "Diego", sessao: "Duna", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /ingressos deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/ingressos")
        .send({ cliente: "Diego", sessao: "Duna", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/ingressos")
        .send({ valor: 12 })

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/ingressos").send({ valor: 12 })

    const res = await request(app).get("/ingressos")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})

test("GET /ingressos/resumo deve responder 200 com o total e a soma", async () => {
    const res = await request(app).get("/ingressos/resumo")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ total: 3, valorTotal: 66 })
})

test("a rota /resumo deve estar declarada antes de /:id", async () => {
    const res = await request(app).get("/ingressos/resumo")

    expect(res.body.total).toBe(3)
})
