const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /consultas deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/consultas")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, paciente: "Ana", exame: "Hemograma", valor: 60, situacao: "cancelada" },
    { id: 2, paciente: "Bruno", exame: "Raio-X", valor: 150, situacao: "realizada" },
    { id: 3, paciente: "Carla", exame: "Ressonancia", valor: 800, situacao: "realizada" }
])
})

test("GET /consultas deve filtrar por situacao", async () => {
    const res = await request(app).get("/consultas?situacao=realizada")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, paciente: "Bruno", exame: "Raio-X", valor: 150, situacao: "realizada" },
    { id: 3, paciente: "Carla", exame: "Ressonancia", valor: 800, situacao: "realizada" }
])
})

test("GET /consultas deve filtrar por valorMin", async () => {
    const res = await request(app).get("/consultas?valorMin=800")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /consultas deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/consultas?situacao=realizada&valorMin=800")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /consultas/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/consultas/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, paciente: "Bruno", exame: "Raio-X", valor: 150, situacao: "realizada" })
})

test("GET /consultas/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/consultas/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Consulta nao encontrado" })
})

test("POST /consultas deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/consultas")
        .send({ paciente: "Diego", exame: "Hemograma", valor: 60 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de consulta criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/consultas")
            .send({ paciente: "Diego", exame: "Hemograma", valor: 60 })

        const res = await request(app).get("/consultas")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, paciente: "Diego", exame: "Hemograma", valor: 60, situacao: "agendada" })
    })

test("POST /consultas deve responder 400 sem o paciente", async () => {
    const res = await request(app)
        .post("/consultas")
        .send({ exame: "Hemograma", valor: 60 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo paciente e obrigatorio" })
})

test("POST /consultas deve responder 400 sem o exame", async () => {
    const res = await request(app)
        .post("/consultas")
        .send({ paciente: "Diego", valor: 60 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo exame e obrigatorio" })
})

test("POST /consultas deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/consultas")
            .send({ paciente: "Diego", exame: "Hemograma", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /consultas deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/consultas")
        .send({ paciente: "Diego", exame: "Hemograma", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/consultas")
        .send({ valor: 60 })

    expect(res.body).toEqual({ erro: "O campo paciente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/consultas").send({ valor: 60 })

    const res = await request(app).get("/consultas")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
