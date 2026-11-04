const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /colheitas deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/colheitas")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, voluntario: "Ana", cultivo: "Alface", quilos: 5, situacao: "distribuida" },
    { id: 2, voluntario: "Bruno", cultivo: "Tomate", quilos: 12, situacao: "colhida" },
    { id: 3, voluntario: "Carla", cultivo: "Cenoura", quilos: 8, situacao: "colhida" }
])
})

test("GET /colheitas deve filtrar por situacao", async () => {
    const res = await request(app).get("/colheitas?situacao=colhida")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, voluntario: "Bruno", cultivo: "Tomate", quilos: 12, situacao: "colhida" },
    { id: 3, voluntario: "Carla", cultivo: "Cenoura", quilos: 8, situacao: "colhida" }
])
})

test("GET /colheitas deve filtrar por quilosMin", async () => {
    const res = await request(app).get("/colheitas?quilosMin=12")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /colheitas deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/colheitas?situacao=colhida&quilosMin=12")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /colheitas/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/colheitas/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, voluntario: "Bruno", cultivo: "Tomate", quilos: 12, situacao: "colhida" })
})

test("GET /colheitas/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/colheitas/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Colheita nao encontrado" })
})

test("POST /colheitas deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/colheitas")
        .send({ voluntario: "Diego", cultivo: "Alface", quilos: 5 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de colheita criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/colheitas")
            .send({ voluntario: "Diego", cultivo: "Alface", quilos: 5 })

        const res = await request(app).get("/colheitas")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, voluntario: "Diego", cultivo: "Alface", quilos: 5, situacao: "prevista" })
    })

test("POST /colheitas deve responder 400 sem o voluntario", async () => {
    const res = await request(app)
        .post("/colheitas")
        .send({ cultivo: "Alface", quilos: 5 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo voluntario e obrigatorio" })
})

test("POST /colheitas deve responder 400 sem o cultivo", async () => {
    const res = await request(app)
        .post("/colheitas")
        .send({ voluntario: "Diego", quilos: 5 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cultivo e obrigatorio" })
})

test("POST /colheitas deve responder 400 quando o quilos nao e numero", async () => {
        const res = await request(app)
            .post("/colheitas")
            .send({ voluntario: "Diego", cultivo: "Alface", quilos: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo quilos deve ser um numero" })
    })

test("POST /colheitas deve responder 400 quando o quilos nao e maior que zero", async () => {
    const res = await request(app)
        .post("/colheitas")
        .send({ voluntario: "Diego", cultivo: "Alface", quilos: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo quilos deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/colheitas")
        .send({ quilos: 5 })

    expect(res.body).toEqual({ erro: "O campo voluntario e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/colheitas").send({ quilos: 5 })

    const res = await request(app).get("/colheitas")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
