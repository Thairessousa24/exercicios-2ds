const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /entregas deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/entregas")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, cliente: "Ana", arranjo: "Buque Simples", valor: 60, situacao: "entregue" },
    { id: 2, cliente: "Bruno", arranjo: "Cesta Mista", valor: 95, situacao: "em rota" },
    { id: 3, cliente: "Carla", arranjo: "Coroa", valor: 250, situacao: "em rota" }
])
})

test("GET /entregas deve filtrar por situacao", async () => {
    const res = await request(app).get("/entregas?situacao=em rota")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", arranjo: "Cesta Mista", valor: 95, situacao: "em rota" },
    { id: 3, cliente: "Carla", arranjo: "Coroa", valor: 250, situacao: "em rota" }
])
})

test("GET /entregas deve filtrar por valorMin", async () => {
    const res = await request(app).get("/entregas?valorMin=250")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /entregas deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/entregas?situacao=em rota&valorMin=250")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /entregas/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/entregas/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", arranjo: "Cesta Mista", valor: 95, situacao: "em rota" })
})

test("GET /entregas/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/entregas/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Entrega nao encontrado" })
})

test("POST /entregas deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/entregas")
        .send({ cliente: "Diego", arranjo: "Buque Simples", valor: 60 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de entrega criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/entregas")
            .send({ cliente: "Diego", arranjo: "Buque Simples", valor: 60 })

        const res = await request(app).get("/entregas")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", arranjo: "Buque Simples", valor: 60, situacao: "agendada" })
    })

test("POST /entregas deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/entregas")
        .send({ arranjo: "Buque Simples", valor: 60 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /entregas deve responder 400 sem o arranjo", async () => {
    const res = await request(app)
        .post("/entregas")
        .send({ cliente: "Diego", valor: 60 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo arranjo e obrigatorio" })
})

test("POST /entregas deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/entregas")
            .send({ cliente: "Diego", arranjo: "Buque Simples", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /entregas deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/entregas")
        .send({ cliente: "Diego", arranjo: "Buque Simples", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/entregas")
        .send({ valor: 60 })

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/entregas").send({ valor: 60 })

    const res = await request(app).get("/entregas")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
