const app = require('./index')

const PORT = 3000

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`)
})