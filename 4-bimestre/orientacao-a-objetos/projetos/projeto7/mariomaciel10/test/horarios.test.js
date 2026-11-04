const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /horarios deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/horarios")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, cliente: "Ana", corte: "Social", valor: 35, situacao: "faltou" },
    { id: 2, cliente: "Bruno", corte: "Degrade", valor: 45, situacao: "atendido" },
    { id: 3, cliente: "Carla", corte: "Navalhado", valor: 55, situacao: "atendido" }
])
})

test("GET /horarios deve filtrar por situacao", async () => {
    const res = await request(app).get("/horarios?situacao=atendido")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", corte: "Degrade", valor: 45, situacao: "atendido" },
    { id: 3, cliente: "Carla", corte: "Navalhado", valor: 55, situacao: "atendido" }
])
})

test("GET /horarios deve filtrar por valorMin", async () => {
    const res = await request(app).get("/horarios?valorMin=55")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /horarios deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/horarios?situacao=atendido&valorMin=55")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /horarios/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/horarios/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", corte: "Degrade", valor: 45, situacao: "atendido" })
})

test("GET /horarios/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/horarios/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Horario nao encontrado" })
})

test("POST /horarios deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/horarios")
        .send({ cliente: "Diego", corte: "Social", valor: 35 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de horario criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/horarios")
            .send({ cliente: "Diego", corte: "Social", valor: 35 })

        const res = await request(app).get("/horarios")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", corte: "Social", valor: 35, situacao: "marcado" })
    })

test("POST /horarios deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/horarios")
        .send({ corte: "Social", valor: 35 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /horarios deve responder 400 sem o corte", async () => {
    const res = await request(app)
        .post("/horarios")
        .send({ cliente: "Diego", valor: 35 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo corte e obrigatorio" })
})

test("POST /horarios deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/horarios")
            .send({ cliente: "Diego", corte: "Social", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /horarios deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/horarios")
        .send({ cliente: "Diego", corte: "Social", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/horarios")
        .send({ valor: 35 })

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/horarios").send({ valor: 35 })

    const res = await request(app).get("/horarios")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
