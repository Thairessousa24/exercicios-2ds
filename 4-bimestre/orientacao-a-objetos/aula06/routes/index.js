const express = require("express")

const alunosRouter = require("./alunos")

const router = express.Router()


router.get("/", (req, res) => {
    res.status(200).json({
        mensagem: "API da Escola"
    })
})


router.use("/alunos", alunosRouter)

module.exports = router