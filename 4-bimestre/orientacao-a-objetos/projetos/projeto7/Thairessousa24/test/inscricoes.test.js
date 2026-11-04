const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /inscricoes deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/inscricoes")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, aluno: "Ana", curso: "Violao Iniciante", meses: 6, situacao: "trancada" },
    { id: 2, aluno: "Bruno", curso: "Teclado Basico", meses: 3, situacao: "ativa" },
    { id: 3, aluno: "Carla", curso: "Bateria Avancada", meses: 12, situacao: "ativa" }
])
})

test("GET /inscricoes deve filtrar por situacao", async () => {
    const res = await request(app).get("/inscricoes?situacao=ativa")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, aluno: "Bruno", curso: "Teclado Basico", meses: 3, situacao: "ativa" },
    { id: 3, aluno: "Carla", curso: "Bateria Avancada", meses: 12, situacao: "ativa" }
])
})

test("GET /inscricoes deve filtrar por mesesMin", async () => {
    const res = await request(app).get("/inscricoes?mesesMin=12")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /inscricoes deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/inscricoes?situacao=ativa&mesesMin=12")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /inscricoes/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/inscricoes/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, aluno: "Bruno", curso: "Teclado Basico", meses: 3, situacao: "ativa" })
})

test("GET /inscricoes/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/inscricoes/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Inscricao nao encontrado" })
})

test("POST /inscricoes deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/inscricoes")
        .send({ aluno: "Diego", curso: "Violao Iniciante", meses: 6 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de inscricao criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/inscricoes")
            .send({ aluno: "Diego", curso: "Violao Iniciante", meses: 6 })

        const res = await request(app).get("/inscricoes")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, aluno: "Diego", curso: "Violao Iniciante", meses: 6, situacao: "pendente" })
    })

test("POST /inscricoes deve responder 400 sem o aluno", async () => {
    const res = await request(app)
        .post("/inscricoes")
        .send({ curso: "Violao Iniciante", meses: 6 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo aluno e obrigatorio" })
})

test("POST /inscricoes deve responder 400 sem o curso", async () => {
    const res = await request(app)
        .post("/inscricoes")
        .send({ aluno: "Diego", meses: 6 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo curso e obrigatorio" })
})

test("POST /inscricoes deve responder 400 quando o meses nao e numero", async () => {
        const res = await request(app)
            .post("/inscricoes")
            .send({ aluno: "Diego", curso: "Violao Iniciante", meses: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo meses deve ser um numero" })
    })

test("POST /inscricoes deve responder 400 quando o meses nao e maior que zero", async () => {
    const res = await request(app)
        .post("/inscricoes")
        .send({ aluno: "Diego", curso: "Violao Iniciante", meses: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo meses deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/inscricoes")
        .send({ meses: 6 })

    expect(res.body).toEqual({ erro: "O campo aluno e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/inscricoes").send({ meses: 6 })

    const res = await request(app).get("/inscricoes")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
