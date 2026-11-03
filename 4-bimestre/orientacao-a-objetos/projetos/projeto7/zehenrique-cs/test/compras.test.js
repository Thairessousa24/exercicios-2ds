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
    { id: 1, cliente: "Ana", produto: "Arroz", valor: 28, status: "entregue" },
    { id: 2, cliente: "Bruno", produto: "Leite", valor: 6, status: "fechada" },
    { id: 3, cliente: "Carla", produto: "Cafe", valor: 18, status: "fechada" }
])
})

test("GET /compras deve filtrar por status", async () => {
    const res = await request(app).get("/compras?status=fechada")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", produto: "Leite", valor: 6, status: "fechada" },
    { id: 3, cliente: "Carla", produto: "Cafe", valor: 18, status: "fechada" }
])
})

test("GET /compras deve filtrar por valorMin", async () => {
    const res = await request(app).get("/compras?valorMin=18")

    expect(res.body.map(r => r.id)).toEqual([1, 3])
})

test("GET /compras deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/compras?status=fechada&valorMin=18")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /compras/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/compras/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", produto: "Leite", valor: 6, status: "fechada" })
})

test("GET /compras/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/compras/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Compra nao encontrado" })
})

test("POST /compras deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/compras")
        .send({ cliente: "Diego", produto: "Arroz", valor: 28 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de compra criado" })
})

test("o registro criado deve entrar na listagem com id e status corretos", async () => {
        await request(app)
            .post("/compras")
            .send({ cliente: "Diego", produto: "Arroz", valor: 28 })

        const res = await request(app).get("/compras")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", produto: "Arroz", valor: 28, status: "aberta" })
    })

test("POST /compras deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/compras")
        .send({ produto: "Arroz", valor: 28 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /compras deve responder 400 sem o produto", async () => {
    const res = await request(app)
        .post("/compras")
        .send({ cliente: "Diego", valor: 28 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo produto e obrigatorio" })
})

test("POST /compras deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/compras")
            .send({ cliente: "Diego", produto: "Arroz", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /compras deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/compras")
        .send({ cliente: "Diego", produto: "Arroz", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/compras")
        .send({ valor: 28 })

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/compras").send({ valor: 28 })

    const res = await request(app).get("/compras")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})

test("GET /compras/resumo deve responder 200 com o total e a soma", async () => {
    const res = await request(app).get("/compras/resumo")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ total: 3, valorTotal: 52 })
})

test("a rota /resumo deve estar declarada antes de /:id", async () => {
    const res = await request(app).get("/compras/resumo")

    expect(res.body.total).toBe(3)
})
