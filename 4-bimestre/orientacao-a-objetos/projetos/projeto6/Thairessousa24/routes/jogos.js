const express = require('express')
const router = express.Router()

const jogos = [
  { id: 1, titulo: 'Celeste', genero: 'plataforma', preco: 40, disponivel: true },
  { id: 2, titulo: 'Hollow Knight', genero: 'metroidvania', preco: 50, disponivel: true },
  { id: 3, titulo: 'Hades', genero: 'roguelike', preco: 70, disponivel: false }
]

router.get('/', (req, res) => {
  res.status(200).json(jogos)
})

router.get('/disponiveis', (req, res) => {
  res.status(200).json(jogos.filter(jogo => jogo.disponivel === true))
})

router.get('/total', (req, res) => {
  res.status(200).json({ total: jogos.length })
})

router.post('/', (req, res) => {
  res.status(201).json({
    mensagem: 'Cadastro de jogo realizado'
  })
})

module.exports = router