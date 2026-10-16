const handler = require("./index.js")

function testar(url) {
  const res = {
    statusCode: 0,
    headers: {},
    corpo: "",
    setHeader(nome, valor) {
      this.headers[nome] = valor
    },
    end(texto) {
      this.corpo = texto
    }
  }

  handler({ url }, res)

  console.log(url, res.statusCode, res.corpo)
}

testar("/")
testar("/status")
testar("/outra-rota")