const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /visitas deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/visitas")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, visitante: "Ana", exposicao: "Fosseis", pessoas: 30, situacao: "cancelada" },
    { id: 2, visitante: "Bruno", exposicao: "Arte Moderna", pessoas: 12, situacao: "realizada" },
    { id: 3, visitante: "Carla", exposicao: "Cidade Antiga", pessoas: 45, situacao: "realizada" }
])
})

test("GET /visitas deve filtrar por situacao", async () => {
    const res = await request(app).get("/visitas?situacao=realizada")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, visitante: "Bruno", exposicao: "Arte Moderna", pessoas: 12, situacao: "realizada" },
    { id: 3, visitante: "Carla", exposicao: "Cidade Antiga", pessoas: 45, situacao: "realizada" }
])
})

test("GET /visitas deve filtrar por pessoasMin", async () => {
    const res = await request(app).get("/visitas?pessoasMin=45")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /visitas deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/visitas?situacao=realizada&pessoasMin=45")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /visitas/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/visitas/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, visitante: "Bruno", exposicao: "Arte Moderna", pessoas: 12, situacao: "realizada" })
})

test("GET /visitas/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/visitas/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Visita nao encontrado" })
})

test("POST /visitas deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/visitas")
        .send({ visitante: "Diego", exposicao: "Fosseis", pessoas: 30 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de visita criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/visitas")
            .send({ visitante: "Diego", exposicao: "Fosseis", pessoas: 30 })

        const res = await request(app).get("/visitas")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, visitante: "Diego", exposicao: "Fosseis", pessoas: 30, situacao: "agendada" })
    })

test("POST /visitas deve responder 400 sem o visitante", async () => {
    const res = await request(app)
        .post("/visitas")
        .send({ exposicao: "Fosseis", pessoas: 30 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo visitante e obrigatorio" })
})

test("POST /visitas deve responder 400 sem o exposicao", async () => {
    const res = await request(app)
        .post("/visitas")
        .send({ visitante: "Diego", pessoas: 30 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo exposicao e obrigatorio" })
})

test("POST /visitas deve responder 400 quando o pessoas nao e numero", async () => {
        const res = await request(app)
            .post("/visitas")
            .send({ visitante: "Diego", exposicao: "Fosseis", pessoas: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo pessoas deve ser um numero" })
    })

test("POST /visitas deve responder 400 quando o pessoas nao e maior que zero", async () => {
    const res = await request(app)
        .post("/visitas")
        .send({ visitante: "Diego", exposicao: "Fosseis", pessoas: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo pessoas deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/visitas")
        .send({ pessoas: 30 })

    expect(res.body).toEqual({ erro: "O campo visitante e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/visitas").send({ pessoas: 30 })

    const res = await request(app).get("/visitas")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
