
function handler(req, res) {
  if (req.url === "/") {
    res.statusCode = 200
    res.end("API no ar")
    return
  }

  if (req.url === "/status") {
    const porta = Number(process.env.PORT) || 3000

    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.end(
      JSON.stringify({
        status: "online",
        porta: porta
      })
    )
    return
  }

  res.statusCode = 404
  res.end("Rota nao encontrada")
}

module.exports = handler