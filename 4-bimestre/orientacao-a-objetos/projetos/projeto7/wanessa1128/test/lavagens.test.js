const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /lavagens deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/lavagens")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, motorista: "Ana", pacote: "Simples", valor: 35, situacao: "pronta" },
    { id: 2, motorista: "Bruno", pacote: "Completo", valor: 70, situacao: "lavando" },
    { id: 3, motorista: "Carla", pacote: "Premium", valor: 140, situacao: "lavando" }
])
})

test("GET /lavagens deve filtrar por situacao", async () => {
    const res = await request(app).get("/lavagens?situacao=lavando")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, motorista: "Bruno", pacote: "Completo", valor: 70, situacao: "lavando" },
    { id: 3, motorista: "Carla", pacote: "Premium", valor: 140, situacao: "lavando" }
])
})

test("GET /lavagens deve filtrar por valorMin", async () => {
    const res = await request(app).get("/lavagens?valorMin=140")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /lavagens deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/lavagens?situacao=lavando&valorMin=140")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /lavagens/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/lavagens/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, motorista: "Bruno", pacote: "Completo", valor: 70, situacao: "lavando" })
})

test("GET /lavagens/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/lavagens/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Lavagem nao encontrado" })
})

test("POST /lavagens deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/lavagens")
        .send({ motorista: "Diego", pacote: "Simples", valor: 35 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de lavagem criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/lavagens")
            .send({ motorista: "Diego", pacote: "Simples", valor: 35 })

        const res = await request(app).get("/lavagens")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, motorista: "Diego", pacote: "Simples", valor: 35, situacao: "na fila" })
    })

test("POST /lavagens deve responder 400 sem o motorista", async () => {
    const res = await request(app)
        .post("/lavagens")
        .send({ pacote: "Simples", valor: 35 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo motorista e obrigatorio" })
})

test("POST /lavagens deve responder 400 sem o pacote", async () => {
    const res = await request(app)
        .post("/lavagens")
        .send({ motorista: "Diego", valor: 35 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo pacote e obrigatorio" })
})

test("POST /lavagens deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/lavagens")
            .send({ motorista: "Diego", pacote: "Simples", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /lavagens deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/lavagens")
        .send({ motorista: "Diego", pacote: "Simples", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/lavagens")
        .send({ valor: 35 })

    expect(res.body).toEqual({ erro: "O campo motorista e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/lavagens").send({ valor: 35 })

    const res = await request(app).get("/lavagens")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
