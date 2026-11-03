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
    { id: 1, responsavel: "Ana", brinquedo: "Quebra-Cabeca", dias: 3, situacao: "devolvida" },
    { id: 2, responsavel: "Bruno", brinquedo: "Jogo de Tabuleiro", dias: 7, situacao: "ativa" },
    { id: 3, responsavel: "Carla", brinquedo: "Blocos", dias: 5, situacao: "ativa" }
])
})

test("GET /reservas deve filtrar por situacao", async () => {
    const res = await request(app).get("/reservas?situacao=ativa")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, responsavel: "Bruno", brinquedo: "Jogo de Tabuleiro", dias: 7, situacao: "ativa" },
    { id: 3, responsavel: "Carla", brinquedo: "Blocos", dias: 5, situacao: "ativa" }
])
})

test("GET /reservas deve filtrar por diasMin", async () => {
    const res = await request(app).get("/reservas?diasMin=7")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /reservas deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/reservas?situacao=ativa&diasMin=7")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /reservas/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/reservas/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, responsavel: "Bruno", brinquedo: "Jogo de Tabuleiro", dias: 7, situacao: "ativa" })
})

test("GET /reservas/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/reservas/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Reserva nao encontrado" })
})

test("POST /reservas deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/reservas")
        .send({ responsavel: "Diego", brinquedo: "Quebra-Cabeca", dias: 3 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de reserva criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/reservas")
            .send({ responsavel: "Diego", brinquedo: "Quebra-Cabeca", dias: 3 })

        const res = await request(app).get("/reservas")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, responsavel: "Diego", brinquedo: "Quebra-Cabeca", dias: 3, situacao: "solicitada" })
    })

test("POST /reservas deve responder 400 sem o responsavel", async () => {
    const res = await request(app)
        .post("/reservas")
        .send({ brinquedo: "Quebra-Cabeca", dias: 3 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo responsavel e obrigatorio" })
})

test("POST /reservas deve responder 400 sem o brinquedo", async () => {
    const res = await request(app)
        .post("/reservas")
        .send({ responsavel: "Diego", dias: 3 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo brinquedo e obrigatorio" })
})

test("POST /reservas deve responder 400 quando o dias nao e numero", async () => {
        const res = await request(app)
            .post("/reservas")
            .send({ responsavel: "Diego", brinquedo: "Quebra-Cabeca", dias: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo dias deve ser um numero" })
    })

test("POST /reservas deve responder 400 quando o dias nao e maior que zero", async () => {
    const res = await request(app)
        .post("/reservas")
        .send({ responsavel: "Diego", brinquedo: "Quebra-Cabeca", dias: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo dias deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/reservas")
        .send({ dias: 3 })

    expect(res.body).toEqual({ erro: "O campo responsavel e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/reservas").send({ dias: 3 })

    const res = await request(app).get("/reservas")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
