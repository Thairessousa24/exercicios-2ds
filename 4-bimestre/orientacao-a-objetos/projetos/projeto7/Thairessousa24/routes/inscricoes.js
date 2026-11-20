
const express = require("express")
const validarInscricao = require("../middlewares/validarInscricao")

const router = express.Router()


let inscricoes = [
    { id: 1, aluno: "Ana", curso: "Violao Iniciante", meses: 6, situacao: "trancada" },
    { id: 2, aluno: "Bruno", curso: "Teclado Basico", meses: 3, situacao: "ativa" },
    { id: 3, aluno: "Carla", curso: "Bateria Avancada", meses: 12, situacao: "ativa" }
]

router.get("/", (req, res) => {
    let resultado = inscricoes

    const { situacao, mesesMin } = req.query

    if (situacao) {
        resultado = resultado.filter(
            inscricao => inscricao.situacao === situacao
        )
    }

    if (mesesMin !== undefined) {
        resultado = resultado.filter(
            inscricao => inscricao.meses >= Number(mesesMin)
        )
    }

    res.status(200).json(resultado)
})


router.get("/:id", (req, res, next) => {
    const id = Number(req.params.id)

    const inscricao = inscricoes.find(
        inscricao => inscricao.id === id
    )

    if (!inscricao) {
        const erro = new Error("Inscricao nao encontrado")
        erro.status = 404

        return next(erro)
    }

    res.status(200).json(inscricao)
})


router.post("/", validarInscricao, (req, res) => {
    const { aluno, curso, meses } = req.body

    const maiorId = Math.max(
        ...inscricoes.map(inscricao => inscricao.id)
    )

    const novaInscricao = {
        id: maiorId + 1,
        aluno,
        curso,
        meses: Number(meses),
        situacao: "pendente"
    }

    inscricoes.push(novaInscricao)

    res.status(201).json({
        mensagem: "Registro de inscricao criado"
    })
})

module.exports = router
