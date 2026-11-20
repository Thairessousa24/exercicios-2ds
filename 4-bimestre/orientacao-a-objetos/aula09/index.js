const express = require("express")

const app = express()
app.use(express.json())

const tarefas = [
    { id: 1, titulo: "Estudar Express", feita: false },
    { id: 2, titulo: "Instalar o Bruno", feita: true }
]

app.get("/tarefas", (req, res) => {
    res.status(200).json(tarefas)
})

app.get("/tarefas/pendentes", (req, res) => {
    res.status(200).json(tarefas.filter(tarefa => tarefa.feita === false))
})

app.post("/tarefas", (req, res) => {
    res.status(201).json({ mensagem: "Tarefa criada" })
})

const colecao = [
    {
        nome: "Listar tarefas",
        metodo: "GET",
        caminho: "/tarefas"
    },
    {
        nome: "Listar pendentes",
        metodo: "GET",
        caminho: "/tarefas/pendentes"
    },
    {
        nome: "Criar tarefa",
        metodo: "POST",
        caminho: "/tarefas",
        body: { titulo: "Nova tarefa", feita: false },
        headers: { "Content-Type": "application/json" }
    }
]

module.exports = { app, colecao }