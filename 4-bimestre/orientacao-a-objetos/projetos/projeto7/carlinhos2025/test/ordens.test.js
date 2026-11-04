const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /ordens deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/ordens")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, cliente: "Ana", servico: "Lavagem Simples", pecas: 5, situacao: "pronta" },
    { id: 2, cliente: "Bruno", servico: "Lavagem a Seco", pecas: 2, situacao: "lavando" },
    { id: 3, cliente: "Carla", servico: "Passadoria", pecas: 8, situacao: "lavando" }
])
})

test("GET /ordens deve filtrar por situacao", async () => {
    const res = await request(app).get("/ordens?situacao=lavando")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, cliente: "Bruno", servico: "Lavagem a Seco", pecas: 2, situacao: "lavando" },
    { id: 3, cliente: "Carla", servico: "Passadoria", pecas: 8, situacao: "lavando" }
])
})

test("POST /ordens deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/ordens")
        .send({ cliente: "Diego", servico: "Lavagem Simples", pecas: 5 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de ordem criado" })
})

test("POST /ordens deve responder 400 sem o cliente", async () => {
    const res = await request(app)
        .post("/ordens")
        .send({ servico: "Lavagem Simples", pecas: 5 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/ordens").send({ pecas: 5 })

    const res = await request(app).get("/ordens")

    expect(res.body.length).toBe(3)
})
