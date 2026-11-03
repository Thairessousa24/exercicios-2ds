const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /reservas deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/reservas")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, responsavel: "Ana", horario: "18h", valor: 80, situacao: "realizada" },
    { id: 2, responsavel: "Bruno", horario: "19h", valor: 80, situacao: "confirmada" },
    { id: 3, responsavel: "Carla", horario: "20h", valor: 90, situacao: "confirmada" }
])
})

test("GET /reservas deve filtrar por situacao", async () => {
    const res = await request(app).get("/reservas?situacao=confirmada")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, responsavel: "Bruno", horario: "19h", valor: 80, situacao: "confirmada" },
    { id: 3, responsavel: "Carla", horario: "20h", valor: 90, situacao: "confirmada" }
])
})

test("GET /reservas deve filtrar por valorMin", async () => {
    const res = await request(app).get("/reservas?valorMin=90")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /reservas deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/reservas?situacao=confirmada&valorMin=90")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /reservas/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/reservas/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, responsavel: "Bruno", horario: "19h", valor: 80, situacao: "confirmada" })
})

test("GET /reservas/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/reservas/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Reserva nao encontrado" })
})

test("POST /reservas deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/reservas")
        .send({ responsavel: "Diego", horario: "18h", valor: 80 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de reserva criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/reservas")
            .send({ responsavel: "Diego", horario: "18h", valor: 80 })

        const res = await request(app).get("/reservas")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, responsavel: "Diego", horario: "18h", valor: 80, situacao: "solicitada" })
    })

test("POST /reservas deve responder 400 sem o responsavel", async () => {
    const res = await request(app)
        .post("/reservas")
        .send({ horario: "18h", valor: 80 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo responsavel e obrigatorio" })
})

test("POST /reservas deve responder 400 sem o horario", async () => {
    const res = await request(app)
        .post("/reservas")
        .send({ responsavel: "Diego", valor: 80 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo horario e obrigatorio" })
})

test("POST /reservas deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/reservas")
            .send({ responsavel: "Diego", horario: "18h", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /reservas deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/reservas")
        .send({ responsavel: "Diego", horario: "18h", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/reservas")
        .send({ valor: 80 })

    expect(res.body).toEqual({ erro: "O campo responsavel e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/reservas").send({ valor: 80 })

    const res = await request(app).get("/reservas")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
