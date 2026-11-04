const request = require("supertest")

let app

beforeEach(() => {
    jest.resetModules()
    app = require("../index")
})

test("GET /emprestimos deve responder 200 com os 3 registros", async () => {
    const res = await request(app).get("/emprestimos")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 1, leitor: "Ana", livro: "Dom Casmurro", dias: 7, situacao: "devolvido" },
    { id: 2, leitor: "Bruno", livro: "O Cortico", dias: 14, situacao: "retirado" },
    { id: 3, leitor: "Carla", livro: "Memorias Postumas", dias: 10, situacao: "retirado" }
])
})

test("GET /emprestimos deve filtrar por situacao", async () => {
    const res = await request(app).get("/emprestimos?situacao=retirado")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([
    { id: 2, leitor: "Bruno", livro: "O Cortico", dias: 14, situacao: "retirado" },
    { id: 3, leitor: "Carla", livro: "Memorias Postumas", dias: 10, situacao: "retirado" }
])
})

test("GET /emprestimos deve filtrar por diasMin", async () => {
    const res = await request(app).get("/emprestimos?diasMin=14")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /emprestimos deve aplicar os dois filtros juntos", async () => {
    const res = await request(app).get("/emprestimos?situacao=retirado&diasMin=14")

    expect(res.body.map(r => r.id)).toEqual([2])
})

test("GET /emprestimos/:id deve responder 200 com o registro do id", async () => {
    const res = await request(app).get("/emprestimos/2")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ id: 2, leitor: "Bruno", livro: "O Cortico", dias: 14, situacao: "retirado" })
})

test("GET /emprestimos/:id deve responder 404 para um id inexistente", async () => {
    const res = await request(app).get("/emprestimos/99")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Emprestimo nao encontrado" })
})

test("POST /emprestimos deve responder 201 com dados validos", async () => {
    const res = await request(app)
        .post("/emprestimos")
        .send({ leitor: "Diego", livro: "Dom Casmurro", dias: 7 })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Registro de emprestimo criado" })
})

test("o registro criado deve entrar na listagem com id e situacao corretos", async () => {
        await request(app)
            .post("/emprestimos")
            .send({ leitor: "Diego", livro: "Dom Casmurro", dias: 7 })

        const res = await request(app).get("/emprestimos")

        expect(res.body.length).toBe(4)
        expect(res.body[3]).toEqual({ id: 4, leitor: "Diego", livro: "Dom Casmurro", dias: 7, situacao: "reservado" })
    })

test("POST /emprestimos deve responder 400 sem o leitor", async () => {
    const res = await request(app)
        .post("/emprestimos")
        .send({ livro: "Dom Casmurro", dias: 7 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo leitor e obrigatorio" })
})

test("POST /emprestimos deve responder 400 sem o livro", async () => {
    const res = await request(app)
        .post("/emprestimos")
        .send({ leitor: "Diego", dias: 7 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo livro e obrigatorio" })
})

test("POST /emprestimos deve responder 400 quando o dias nao e numero", async () => {
        const res = await request(app)
            .post("/emprestimos")
            .send({ leitor: "Diego", livro: "Dom Casmurro", dias: "muitos" })

        expect(res.status).toBe(400)
        expect(res.body).toEqual({ erro: "O campo dias deve ser um numero" })
    })

test("POST /emprestimos deve responder 400 quando o dias nao e maior que zero", async () => {
    const res = await request(app)
        .post("/emprestimos")
        .send({ leitor: "Diego", livro: "Dom Casmurro", dias: 0 })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ erro: "O campo dias deve ser maior que zero" })
})

test("a validacao deve seguir a ordem do README", async () => {
    const res = await request(app)
        .post("/emprestimos")
        .send({ dias: 7 })

    expect(res.body).toEqual({ erro: "O campo leitor e obrigatorio" })
})

test("um registro recusado nao deve entrar na listagem", async () => {
    await request(app).post("/emprestimos").send({ dias: 7 })

    const res = await request(app).get("/emprestimos")

    expect(res.body.length).toBe(3)
})

test("uma rota inexistente deve responder 404", async () => {
    const res = await request(app).get("/qualquer-coisa")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ erro: "Rota nao encontrada" })
})
