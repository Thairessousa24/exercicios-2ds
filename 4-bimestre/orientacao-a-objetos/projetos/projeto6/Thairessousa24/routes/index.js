const express = require('express')
const router = express.Router()

const jogosRouter = require('./jogos')
const assinantesRouter = require('./assinantes')

router.get('/', (req, res) => {
  res.status(200).json({
    mensagem: 'API de Locadora'
  })
})

router.use('/jogos', jogosRouter)
router.use('/assinantes', assinantesRouter)

module.exports = router