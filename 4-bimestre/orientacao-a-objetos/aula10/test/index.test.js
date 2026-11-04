const request = require("supertest")
const app = require("../index")

test("GET /pedidos deve responder 200 com os dois pedidos", async () => {
    const res = await request(app).get("/pedidos")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
        { id: 1, cliente: "Ana", valor: 100 },
        { id: 2, cliente: "Bruno", valor: 250 }
    ])
})

test("GET /pedidos deve filtrar pela query valorMin", async () => {
    const res = await request(app).get("/pedidos?valorMin=200")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([{ id: 2, cliente: "Bruno", valor: 250 }])
})

test("GET /pedidos/:id deve responder 200 com o pedido do id", async () => {
    const res = await request(app).get("/pedidos/1")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 1, cliente: "Ana", valor: 100 })
})

test("GET /pedidos/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/pedidos/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Pedido nao encontrado" })
})

test("POST /pedidos deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ cliente: "Carla", valor: 300 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Pedido criado" })
})

test("POST /pedidos deve responder 400 quando falta o cliente", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ valor: 300 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo cliente e obrigatorio" })
})

test("POST /pedidos deve responder 400 quando o valor nao e numero", async () => {
    const res = await request(app)
        .post("/pedidos")
        .send({ cliente: "Carla", valor: "trezentos" })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo valor deve ser um numero" })
})
