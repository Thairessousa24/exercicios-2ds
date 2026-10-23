const express = require('express')
const router = express.Router()

const assinantes = [
  { id: 1, nome: 'Ana', plano: 'mensal' },
  { id: 2, nome: 'Bruno', plano: 'anual' }
]

router.get('/', (req, res) => {
  res.status(200).json(assinantes)
})

router.get('/total', (req, res) => {
  res.status(200).json({ total: assinantes.length })
})

module.exports = router