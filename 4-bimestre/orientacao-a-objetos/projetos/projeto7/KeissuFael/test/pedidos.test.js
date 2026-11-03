const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /pedidos deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/pedidos")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, cliente: "Ana", item: "X-Burguer", valor: 25, status: "entregue" },
    { id: 2, cliente: "Bruno", item: "X-Salada", valor: 28, status: "preparando" },
    { id: 3, cliente: "Carla", item: "Batata", valor: 15, status: "preparando" }
])
})

test("GET /pedidos deve filtrar por status", async () => {
    const res = await request(app).get("/pedidos?status=preparando")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", item: "X-Salada", valor: 28, status: "preparando" },
    { id: 3, cliente: "Carla", item: "Batata", valor: 15, status: "preparando" }
])
})

test("GET /pedidos deve filtrar por valorMin", async () => {
    const res = await request(app).get("/pedidos?valorMin=28")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /pedidos deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/pedidos?status=preparando&valorMin=28")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /pedidos/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/pedidos/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", item: "X-Salada", valor: 28, status: "preparando" })
})

test("GET /pedidos/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/pedidos/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Pedido nao encontrado" })
})

test("POST /pedidos deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ cliente: "Diego", item: "X-Burguer", valor: 25 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de pedido criado" })
})

test("o registro criado deve entrar na listagem com id e status corretos", async () => {
        await request(app)
            .post("/pedidos")
            .send({ cliente: "Diego", item: "X-Burguer", valor: 25 })

        const res = await request(app).get("/pedidos")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", item: "X-Burguer", valor: 25, status: "recebido" })
    })

test("POST /pedidos deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ item: "X-Burguer", valor: 25 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /pedidos deve responder 400 sem o item", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ cliente: "Diego", valor: 25 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo item e obrigatorio" })
})

test("POST /pedidos deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({ cliente: "Diego", item: "X-Burguer", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /pedidos deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ cliente: "Diego", item: "X-Burguer", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ valor: 25 })

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/pedidos").send({ valor: 25 })

    const res = await request(app).get("/pedidos")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})

test("GET /pedidos/resumo deve responder 200 com o total e a soma", async () => {
    const res = await request(app).get("/pedidos/resumo")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ total: 3, valorTotal: 68 })
})

test("a rota /resumo deve estar declarada antes de /:id", async () => {
    const res = await request(app).get("/pedidos/resumo")

    expect(res.body.total).toBe(3)
})
