const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /alugueis deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/alugueis")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, assinante: "Ana", jogo: "Celeste", dias: 5, situacao: "finalizado" },
    { id: 2, assinante: "Bruno", jogo: "Hollow Knight", dias: 10, situacao: "ativo" },
    { id: 3, assinante: "Carla", jogo: "Hades", dias: 3, situacao: "ativo" }
])
})

test("GET /alugueis deve filtrar por situacao", async () => {
    const res = await request(app).get("/alugueis?situacao=ativo")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, assinante: "Bruno", jogo: "Hollow Knight", dias: 10, situacao: "ativo" },
    { id: 3, assinante: "Carla", jogo: "Hades", dias: 3, situacao: "ativo" }
])
})

test("GET /alugueis deve filtrar por diasMin", async () => {
    const res = await request(app).get("/alugueis?diasMin=10")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /alugueis deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/alugueis?situacao=ativo&diasMin=10")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /alugueis/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/alugueis/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, assinante: "Bruno", jogo: "Hollow Knight", dias: 10, situacao: "ativo" })
})

test("GET /alugueis/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/alugueis/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Aluguel nao encontrado" })
})

test("POST /alugueis deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/alugueis")
        .send({ assinante: "Diego", jogo: "Celeste", dias: 5 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de aluguel criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/alugueis")
            .send({ assinante: "Diego", jogo: "Celeste", dias: 5 })

        const res = await request(app).get("/alugueis")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, assinante: "Diego", jogo: "Celeste", dias: 5, situacao: "reservado" })
    })

test("POST /alugueis deve responder 400 sem o assinante", async () => {
    const res = await request(app)
        .post("/alugueis")
        .send({ jogo: "Celeste", dias: 5 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo assinante e obrigatorio" })
})

test("POST /alugueis deve responder 400 sem o jogo", async () => {
    const res = await request(app)
        .post("/alugueis")
        .send({ assinante: "Diego", dias: 5 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo jogo e obrigatorio" })
})

test("POST /alugueis deve responder 400 quando o dias nao e numero", async () => {
        const res = await request(app)
            .post("/alugueis")
            .send({ assinante: "Diego", jogo: "Celeste", dias: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo dias deve ser um numero" })
    })

test("POST /alugueis deve responder 400 quando o dias nao e maior que zero", async () => {
    const res = await request(app)
        .post("/alugueis")
        .send({ assinante: "Diego", jogo: "Celeste", dias: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo dias deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/alugueis")
        .send({ dias: 5 })

    expect(res.body).toEqual({ erro: "O campo assinante e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/alugueis").send({ dias: 5 })

    const res = await request(app).get("/alugueis")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
