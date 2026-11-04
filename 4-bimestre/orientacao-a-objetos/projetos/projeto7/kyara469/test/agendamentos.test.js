const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /agendamentos deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/agendamentos")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, tutor: "Ana", servico: "Banho", valor: 45, situacao: "cancelado" },
    { id: 2, tutor: "Bruno", servico: "Tosa", valor: 60, situacao: "atendido" },
    { id: 3, tutor: "Carla", servico: "Consulta", valor: 120, situacao: "atendido" }
])
})

test("GET /agendamentos deve filtrar por situacao", async () => {
    const res = await request(app).get("/agendamentos?situacao=atendido")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, tutor: "Bruno", servico: "Tosa", valor: 60, situacao: "atendido" },
    { id: 3, tutor: "Carla", servico: "Consulta", valor: 120, situacao: "atendido" }
])
})

test("GET /agendamentos deve filtrar por valorMin", async () => {
    const res = await request(app).get("/agendamentos?valorMin=120")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /agendamentos deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/agendamentos?situacao=atendido&valorMin=120")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /agendamentos/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/agendamentos/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, tutor: "Bruno", servico: "Tosa", valor: 60, situacao: "atendido" })
})

test("GET /agendamentos/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/agendamentos/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Agendamento nao encontrado" })
})

test("POST /agendamentos deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/agendamentos")
        .send({ tutor: "Diego", servico: "Banho", valor: 45 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de agendamento criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/agendamentos")
            .send({ tutor: "Diego", servico: "Banho", valor: 45 })

        const res = await request(app).get("/agendamentos")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, tutor: "Diego", servico: "Banho", valor: 45, situacao: "marcado" })
    })

test("POST /agendamentos deve responder 400 sem o tutor", async () => {
    const res = await request(app)
        .post("/agendamentos")
        .send({ servico: "Banho", valor: 45 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo tutor e obrigatorio" })
})

test("POST /agendamentos deve responder 400 sem o servico", async () => {
    const res = await request(app)
        .post("/agendamentos")
        .send({ tutor: "Diego", valor: 45 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo servico e obrigatorio" })
})

test("POST /agendamentos deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/agendamentos")
            .send({ tutor: "Diego", servico: "Banho", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /agendamentos deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/agendamentos")
        .send({ tutor: "Diego", servico: "Banho", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/agendamentos")
        .send({ valor: 45 })

    expect(res.body).toEqual({ erro: "O campo tutor e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/agendamentos").send({ valor: 45 })

    const res = await request(app).get("/agendamentos")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
