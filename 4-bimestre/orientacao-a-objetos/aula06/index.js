const express = require("express")

const rotas = require("./routes")

const app = express()

app.use("/api", rotas)

module.exports = app