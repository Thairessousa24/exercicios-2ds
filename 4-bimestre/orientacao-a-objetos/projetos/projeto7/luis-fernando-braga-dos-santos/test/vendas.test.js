const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /vendas deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/vendas")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, cliente: "Ana", produto: "Dipirona", valor: 12, status: "entregue" },
    { id: 2, cliente: "Bruno", produto: "Protetor Solar", valor: 48, status: "paga" },
    { id: 3, cliente: "Carla", produto: "Termometro", valor: 65, status: "paga" }
])
})

test("GET /vendas deve filtrar por status", async () => {
    const res = await request(app).get("/vendas?status=paga")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", produto: "Protetor Solar", valor: 48, status: "paga" },
    { id: 3, cliente: "Carla", produto: "Termometro", valor: 65, status: "paga" }
])
})

test("GET /vendas deve filtrar por valorMin", async () => {
    const res = await request(app).get("/vendas?valorMin=65")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /vendas deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/vendas?status=paga&valorMin=65")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /vendas/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/vendas/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", produto: "Protetor Solar", valor: 48, status: "paga" })
})

test("GET /vendas/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/vendas/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Venda nao encontrado" })
})

test("POST /vendas deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/vendas")
        .send({ cliente: "Diego", produto: "Dipirona", valor: 12 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de venda criado" })
})

test("o registro criado deve entrar na listagem com id e status corretos", async () => {
        await request(app)
            .post("/vendas")
            .send({ cliente: "Diego", produto: "Dipirona", valor: 12 })

        const res = await request(app).get("/vendas")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", produto: "Dipirona", valor: 12, status: "aberta" })
    })

test("POST /vendas deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/vendas")
        .send({ produto: "Dipirona", valor: 12 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /vendas deve responder 400 sem o produto", async () => {
    const res = await request(app)
        .post("/vendas")
        .send({ cliente: "Diego", valor: 12 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo produto e obrigatorio" })
})

test("POST /vendas deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/vendas")
            .send({ cliente: "Diego", produto: "Dipirona", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /vendas deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/vendas")
        .send({ cliente: "Diego", produto: "Dipirona", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/vendas")
        .send({ valor: 12 })

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/vendas").send({ valor: 12 })

    const res = await request(app).get("/vendas")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
