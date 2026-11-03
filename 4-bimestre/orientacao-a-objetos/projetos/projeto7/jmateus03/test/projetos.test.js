const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /projetos deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/projetos")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, cliente: "Ana", movel: "Banco", valor: 180, situacao: "entregue" },
    { id: 2, cliente: "Bruno", movel: "Estante", valor: 450, situacao: "producao" },
    { id: 3, cliente: "Carla", movel: "Mesa", valor: 700, situacao: "producao" }
])
})

test("GET /projetos deve filtrar por situacao", async () => {
    const res = await request(app).get("/projetos?situacao=producao")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", movel: "Estante", valor: 450, situacao: "producao" },
    { id: 3, cliente: "Carla", movel: "Mesa", valor: 700, situacao: "producao" }
])
})

test("GET /projetos deve filtrar por valorMin", async () => {
    const res = await request(app).get("/projetos?valorMin=700")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /projetos deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/projetos?situacao=producao&valorMin=700")

    expect(res.body.map(r => r.id)).toEqual([3])
})

test("GET /projetos/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/projetos/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, cliente: "Bruno", movel: "Estante", valor: 450, situacao: "producao" })
})

test("GET /projetos/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/projetos/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Projeto nao encontrado" })
})

test("POST /projetos deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/projetos")
        .send({ cliente: "Diego", movel: "Banco", valor: 180 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de projeto criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/projetos")
            .send({ cliente: "Diego", movel: "Banco", valor: 180 })

        const res = await request(app).get("/projetos")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, cliente: "Diego", movel: "Banco", valor: 180, situacao: "orcado" })
    })

test("POST /projetos deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/projetos")
        .send({ movel: "Banco", valor: 180 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /projetos deve responder 400 sem o movel", async () => {
    const res = await request(app)
        .post("/projetos")
        .send({ cliente: "Diego", valor: 180 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo movel e obrigatorio" })
})

test("POST /projetos deve responder 400 quando o valor nao e numero", async () => {
        const res = await request(app)
            .post("/projetos")
            .send({ cliente: "Diego", movel: "Banco", valor: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
    })

test("POST /projetos deve responder 400 quando o valor nao e maior que zero", async () => {
    const res = await request(app)
        .post("/projetos")
        .send({ cliente: "Diego", movel: "Banco", valor: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/projetos")
        .send({ valor: 180 })

    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/projetos").send({ valor: 180 })

    const res = await request(app).get("/projetos")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})

test("GET /projetos/resumo deve responder 200 com o total e a soma", async () => {
    const res = await request(app).get("/projetos/resumo")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ total: 3, valorTotal: 1330 })
})

test("a rota /resumo deve estar declarada antes de /:id", async () => {
    const res = await request(app).get("/projetos/resumo")

    expect(res.body.total).toBe(3)
})
