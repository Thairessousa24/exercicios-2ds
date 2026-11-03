const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /orcamentos deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/orcamentos")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, cliente: "Ana", item: "Parafuso", valor: 2, status: "aprovado" },
    { id: 2, cliente: "Bruno", item: "Martelo", valor: 45, status: "enviado" },
    { id: 3, cliente: "Carla", item: "Furadeira", valor: 320, status: "enviado" }
])
})

test("GET /orcamentos deve filtrar por status", async () => {
    const res = await request(app).get("/orcamentos?status=enviado")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", item: "Martelo", valor: 45, status: "enviado" },
    { id: 3, cliente: "Carla", item: "Furadeira", valor: 320, status: "enviado" }
])
})

test("GET /orcamentos deve filtrar por valorMin", async () => {
    const res = await request(app).get("/orcamentos?valorMin=320")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /orcamentos deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/orcamentos?status=enviado&valorMin=320")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /orcamentos/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/orcamentos/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", item: "Martelo", valor: 45, status: "enviado" })
})

test("GET /orcamentos/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/orcamentos/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Orcamento nao encontrado" })
})

test("POST /orcamentos deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/orcamentos")
        .send({ cliente: "Diego", item: "Parafuso", valor: 2 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de orcamento criado" })
})

test("o registro criado deve entrar na listagem com id e status corretos", async () => {
        await request(app)
            .post("/orcamentos")
            .send({ cliente: "Diego", item: "Parafuso", valor: 2 })

        const res = await request(app).get("/orcamentos")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", item: "Parafuso", valor: 2, status: "rascunho" })
    })

test("POST /orcamentos deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/orcamentos")
        .send({ item: "Parafuso", valor: 2 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /orcamentos deve responder 400 sem o item", async () => {
    const res = await request(app)
        .post("/orcamentos")
        .send({ cliente: "Diego", valor: 2 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo item e obrigatorio" })
})

test("POST /orcamentos deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/orcamentos")
            .send({ cliente: "Diego", item: "Parafuso", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /orcamentos deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/orcamentos")
        .send({ cliente: "Diego", item: "Parafuso", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/orcamentos")
        .send({ valor: 2 })

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/orcamentos").send({ valor: 2 })

    const res = await request(app).get("/orcamentos")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
