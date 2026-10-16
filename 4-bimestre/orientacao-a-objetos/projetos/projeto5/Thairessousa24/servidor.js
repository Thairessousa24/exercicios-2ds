const http = require("node:http")
const handler = require("./index")
const { carregarConfig } = require("./config")

const { porta, servico } = carregarConfig()

http.createServer(handler).listen(porta, () => {
  console.log(`${servico} rodando na porta ${porta}`)
})