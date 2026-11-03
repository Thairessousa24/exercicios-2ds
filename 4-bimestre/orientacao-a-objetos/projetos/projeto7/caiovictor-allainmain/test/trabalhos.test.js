const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /trabalhos deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/trabalhos")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, cliente: "Ana", impresso: "Cartao de Visita", valor: 120, status: "entregue" },
    { id: 2, cliente: "Bruno", impresso: "Banner", valor: 200, status: "producao" },
    { id: 3, cliente: "Carla", impresso: "Adesivo", valor: 80, status: "producao" }
])
})

test("GET /trabalhos deve filtrar por status", async () => {
    const res = await request(app).get("/trabalhos?status=producao")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", impresso: "Banner", valor: 200, status: "producao" },
    { id: 3, cliente: "Carla", impresso: "Adesivo", valor: 80, status: "producao" }
])
})

test("GET /trabalhos deve filtrar por valorMin", async () => {
    const res = await request(app).get("/trabalhos?valorMin=200")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /trabalhos deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/trabalhos?status=producao&valorMin=200")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /trabalhos/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/trabalhos/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", impresso: "Banner", valor: 200, status: "producao" })
})

test("GET /trabalhos/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/trabalhos/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Trabalho nao encontrado" })
})

test("POST /trabalhos deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/trabalhos")
        .send({ cliente: "Diego", impresso: "Cartao de Visita", valor: 120 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de trabalho criado" })
})

test("o registro criado deve entrar na listagem com id e status corretos", async () => {
        await request(app)
            .post("/trabalhos")
            .send({ cliente: "Diego", impresso: "Cartao de Visita", valor: 120 })

        const res = await request(app).get("/trabalhos")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", impresso: "Cartao de Visita", valor: 120, status: "orcado" })
    })

test("POST /trabalhos deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/trabalhos")
        .send({ impresso: "Cartao de Visita", valor: 120 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /trabalhos deve responder 400 sem o impresso", async () => {
    const res = await request(app)
        .post("/trabalhos")
        .send({ cliente: "Diego", valor: 120 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo impresso e obrigatorio" })
})

test("POST /trabalhos deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/trabalhos")
            .send({ cliente: "Diego", impresso: "Cartao de Visita", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /trabalhos deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/trabalhos")
        .send({ cliente: "Diego", impresso: "Cartao de Visita", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/trabalhos")
        .send({ valor: 120 })

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/trabalhos").send({ valor: 120 })

    const res = await request(app).get("/trabalhos")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
