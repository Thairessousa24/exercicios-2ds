const request = require("supertest")
const { app, colecao } = require("../index")

test("A colecao deve ter tres requisicoes", () => {
    expect(colecao.length).toBe(3)
})

test("A primeira requisicao da colecao deve listar as tarefas", () => {
    expect(colecao[0].nome).toBe("Listar tarefas")
    expect(colecao[0].metodo).toBe("GET")
    expect(colecao[0].caminho).toBe("/tarefas")
})

test("A segunda requisicao da colecao deve listar as pendentes", () => {
    expect(colecao[1].nome).toBe("Listar pendentes")
    expect(colecao[1].metodo).toBe("GET")
    expect(colecao[1].caminho).toBe("/tarefas/pendentes")
})

test("A terceira requisicao da colecao deve criar uma tarefa", () => {
    expect(colecao[2].nome).toBe("Criar tarefa")
    expect(colecao[2].metodo).toBe("POST")
    expect(colecao[2].caminho).toBe("/tarefas")
})

test("A requisicao de POST deve ter body e o header Content-Type", () => {
    expect(colecao[2].body).toEqual({ titulo: "Nova tarefa", feita: false })
    expect(colecao[2].headers["Content-Type"]).toBe("application/json")
})

test("As rotas GET da colecao devem responder 200 na API", async () => {
    for (const req of colecao.filter(r => r.metodo === "GET")) {
        const res = await request(app).get(req.caminho)
        expect(res.status).toBe(200)
    }
})

test("GET /tarefas deve devolver as duas tarefas", async () => {
    const res = await request(app).get("/tarefas")

    expect(res.body).toEqual([
        { id: 1, titulo: "Estudar Express", feita: false },
        { id: 2, titulo: "Instalar o Bruno", feita: true }
    ])
})

test("GET /tarefas/pendentes deve devolver so a tarefa nao feita", async () => {
    const res = await request(app).get("/tarefas/pendentes")

    expect(res.body).toEqual([
        { id: 1, titulo: "Estudar Express", feita: false }
    ])
})

test("POST /tarefas deve responder 201", async () => {
    const res = await request(app).post("/tarefas")

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ mensagem: "Tarefa criada" })
})
