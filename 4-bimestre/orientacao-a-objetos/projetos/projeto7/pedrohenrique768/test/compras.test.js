const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /compras deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/compras")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, cliente: "Ana", material: "Caderno", valor: 22, status: "entregue" },
    { id: 2, cliente: "Bruno", material: "Caneta", valor: 4, status: "confirmada" },
    { id: 3, cliente: "Carla", material: "Mochila", valor: 130, status: "confirmada" }
])
})

test("GET /compras deve filtrar por status", async () => {
    const res = await request(app).get("/compras?status=confirmada")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", material: "Caneta", valor: 4, status: "confirmada" },
    { id: 3, cliente: "Carla", material: "Mochila", valor: 130, status: "confirmada" }
])
})

test("GET /compras/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/compras/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", material: "Caneta", valor: 4, status: "confirmada" })
})

test("GET /compras/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/compras/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Compra nao encontrado" })
})

test("POST /compras deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/compras")
        .send({ cliente: "Diego", material: "Caderno", valor: 22 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de compra criado" })
})

test("o registro criado deve entrar na listagem com id e status corretos", async () => {
        await request(app)
            .post("/compras")
            .send({ cliente: "Diego", material: "Caderno", valor: 22 })

        const res = await request(app).get("/compras")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", material: "Caderno", valor: 22, status: "orcamento" })
    })

test("POST /compras deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/compras")
        .send({ material: "Caderno", valor: 22 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /compras deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/compras")
            .send({ cliente: "Diego", material: "Caderno", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/compras").send({ valor: 22 })

    const res = await request(app).get("/compras")

    expect(res.body.length).toBe(3)
})
