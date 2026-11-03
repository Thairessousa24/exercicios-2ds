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
    { id: 1, cliente: "Ana", sabor: "Chocolate", bolas: 2, status: "entregue" },
    { id: 2, cliente: "Bruno", sabor: "Morango", bolas: 1, status: "montando" },
    { id: 3, cliente: "Carla", sabor: "Limao", bolas: 3, status: "montando" }
])
})

test("GET /pedidos deve filtrar por status", async () => {
    const res = await request(app).get("/pedidos?status=montando")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", sabor: "Morango", bolas: 1, status: "montando" },
    { id: 3, cliente: "Carla", sabor: "Limao", bolas: 3, status: "montando" }
])
})

test("GET /pedidos deve filtrar por bolasMin", async () => {
    const res = await request(app).get("/pedidos?bolasMin=3")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /pedidos deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/pedidos?status=montando&bolasMin=3")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /pedidos/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/pedidos/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", sabor: "Morango", bolas: 1, status: "montando" })
})

test("GET /pedidos/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/pedidos/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Pedido nao encontrado" })
})

test("POST /pedidos deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ cliente: "Diego", sabor: "Chocolate", bolas: 2 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de pedido criado" })
})

test("o registro criado deve entrar na listagem com id e status corretos", async () => {
        await request(app)
            .post("/pedidos")
            .send({ cliente: "Diego", sabor: "Chocolate", bolas: 2 })

        const res = await request(app).get("/pedidos")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", sabor: "Chocolate", bolas: 2, status: "recebido" })
    })

test("POST /pedidos deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ sabor: "Chocolate", bolas: 2 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /pedidos deve responder 400 sem o sabor", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ cliente: "Diego", bolas: 2 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo sabor e obrigatorio" })
})

test("POST /pedidos deve responder 400 quando o bolas nao e numero", async () => {
        const res = await request(app)
            .post("/pedidos")
            .send({ cliente: "Diego", sabor: "Chocolate", bolas: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo bolas deve ser um numero" })
    })

test("POST /pedidos deve responder 400 quando o bolas nao e maior que zero", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ cliente: "Diego", sabor: "Chocolate", bolas: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo bolas deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ bolas: 2 })

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/pedidos").send({ bolas: 2 })

    const res = await request(app).get("/pedidos")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
