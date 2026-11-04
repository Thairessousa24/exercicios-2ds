const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /matriculas deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/matriculas")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, aluno: "Ana", aula: "Spinning", meses: 3, situacao: "encerrada" },
    { id: 2, aluno: "Bruno", aula: "Funcional", meses: 12, situacao: "ativa" },
    { id: 3, aluno: "Carla", aula: "Pilates", meses: 6, situacao: "ativa" }
])
})

test("GET /matriculas deve filtrar por situacao", async () => {
    const res = await request(app).get("/matriculas?situacao=ativa")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, aluno: "Bruno", aula: "Funcional", meses: 12, situacao: "ativa" },
    { id: 3, aluno: "Carla", aula: "Pilates", meses: 6, situacao: "ativa" }
])
})

test("GET /matriculas deve filtrar por mesesMin", async () => {
    const res = await request(app).get("/matriculas?mesesMin=12")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /matriculas deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/matriculas?situacao=ativa&mesesMin=12")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /matriculas/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/matriculas/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, aluno: "Bruno", aula: "Funcional", meses: 12, situacao: "ativa" })
})

test("GET /matriculas/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/matriculas/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Matricula nao encontrado" })
})

test("POST /matriculas deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/matriculas")
        .send({ aluno: "Diego", aula: "Spinning", meses: 3 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de matricula criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/matriculas")
            .send({ aluno: "Diego", aula: "Spinning", meses: 3 })

        const res = await request(app).get("/matriculas")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, aluno: "Diego", aula: "Spinning", meses: 3, situacao: "pendente" })
    })

test("POST /matriculas deve responder 400 sem o aluno", async () => {
    const res = await request(app)
        .post("/matriculas")
        .send({ aula: "Spinning", meses: 3 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo aluno e obrigatorio" })
})

test("POST /matriculas deve responder 400 sem o aula", async () => {
    const res = await request(app)
        .post("/matriculas")
        .send({ aluno: "Diego", meses: 3 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo aula e obrigatorio" })
})

test("POST /matriculas deve responder 400 quando o meses nao e numero", async () => {
        const res = await request(app)
            .post("/matriculas")
            .send({ aluno: "Diego", aula: "Spinning", meses: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo meses deve ser um numero" })
    })

test("POST /matriculas deve responder 400 quando o meses nao e maior que zero", async () => {
    const res = await request(app)
        .post("/matriculas")
        .send({ aluno: "Diego", aula: "Spinning", meses: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo meses deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/matriculas")
        .send({ meses: 3 })

    expect(res.body).toEqual({ erro: "O campo aluno e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/matriculas").send({ meses: 3 })

    const res = await request(app).get("/matriculas")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
