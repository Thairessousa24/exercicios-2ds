const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /sessoes deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/sessoes")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, cliente: "Ana", arte: "Minimalista", horas: 2, situacao: "concluida" },
    { id: 2, cliente: "Bruno", arte: "Geometrica", horas: 4, situacao: "confirmada" },
    { id: 3, cliente: "Carla", arte: "Realista", horas: 8, situacao: "confirmada" }
])
})

test("GET /sessoes deve filtrar por situacao", async () => {
    const res = await request(app).get("/sessoes?situacao=confirmada")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", arte: "Geometrica", horas: 4, situacao: "confirmada" },
    { id: 3, cliente: "Carla", arte: "Realista", horas: 8, situacao: "confirmada" }
])
})

test("GET /sessoes deve filtrar por horasMin", async () => {
    const res = await request(app).get("/sessoes?horasMin=8")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /sessoes deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/sessoes?situacao=confirmada&horasMin=8")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /sessoes/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/sessoes/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", arte: "Geometrica", horas: 4, situacao: "confirmada" })
})

test("GET /sessoes/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/sessoes/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Sessao nao encontrado" })
})

test("POST /sessoes deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/sessoes")
        .send({ cliente: "Diego", arte: "Minimalista", horas: 2 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de sessao criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/sessoes")
            .send({ cliente: "Diego", arte: "Minimalista", horas: 2 })

        const res = await request(app).get("/sessoes")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", arte: "Minimalista", horas: 2, situacao: "orcada" })
    })

test("POST /sessoes deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/sessoes")
        .send({ arte: "Minimalista", horas: 2 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /sessoes deve responder 400 sem o arte", async () => {
    const res = await request(app)
        .post("/sessoes")
        .send({ cliente: "Diego", horas: 2 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo arte e obrigatorio" })
})

test("POST /sessoes deve responder 400 quando o horas nao e numero", async () => {
        const res = await request(app)
            .post("/sessoes")
            .send({ cliente: "Diego", arte: "Minimalista", horas: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo horas deve ser um numero" })
    })

test("POST /sessoes deve responder 400 quando o horas nao e maior que zero", async () => {
    const res = await request(app)
        .post("/sessoes")
        .send({ cliente: "Diego", arte: "Minimalista", horas: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo horas deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/sessoes")
        .send({ horas: 2 })

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/sessoes").send({ horas: 2 })

    const res = await request(app).get("/sessoes")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
