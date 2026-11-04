const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /reparos deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/reparos")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, ciclista: "Ana", peca: "Pneu", valor: 90, situacao: "entregue" },
    { id: 2, ciclista: "Bruno", peca: "Corrente", valor: 65, situacao: "em bancada" },
    { id: 3, ciclista: "Carla", peca: "Guidao", valor: 150, situacao: "em bancada" }
])
})

test("GET /reparos deve filtrar por situacao", async () => {
    const res = await request(app).get("/reparos?situacao=em bancada")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, ciclista: "Bruno", peca: "Corrente", valor: 65, situacao: "em bancada" },
    { id: 3, ciclista: "Carla", peca: "Guidao", valor: 150, situacao: "em bancada" }
])
})

test("GET /reparos deve filtrar por valorMin", async () => {
    const res = await request(app).get("/reparos?valorMin=150")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /reparos deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/reparos?situacao=em bancada&valorMin=150")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /reparos/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/reparos/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, ciclista: "Bruno", peca: "Corrente", valor: 65, situacao: "em bancada" })
})

test("GET /reparos/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/reparos/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Reparo nao encontrado" })
})

test("POST /reparos deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/reparos")
        .send({ ciclista: "Diego", peca: "Pneu", valor: 90 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de reparo criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/reparos")
            .send({ ciclista: "Diego", peca: "Pneu", valor: 90 })

        const res = await request(app).get("/reparos")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, ciclista: "Diego", peca: "Pneu", valor: 90, situacao: "aberto" })
    })

test("POST /reparos deve responder 400 sem o ciclista", async () => {
    const res = await request(app)
        .post("/reparos")
        .send({ peca: "Pneu", valor: 90 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo ciclista e obrigatorio" })
})

test("POST /reparos deve responder 400 sem o peca", async () => {
    const res = await request(app)
        .post("/reparos")
        .send({ ciclista: "Diego", valor: 90 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo peca e obrigatorio" })
})

test("POST /reparos deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/reparos")
            .send({ ciclista: "Diego", peca: "Pneu", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /reparos deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/reparos")
        .send({ ciclista: "Diego", peca: "Pneu", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/reparos")
        .send({ valor: 90 })

    expect(res.body).toEqual({ erro: "O campo ciclista e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/reparos").send({ valor: 90 })

    const res = await request(app).get("/reparos")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
