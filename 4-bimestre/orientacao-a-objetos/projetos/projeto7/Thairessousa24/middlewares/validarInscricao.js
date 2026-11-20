
function validarInscricao(req, res, next) {
    const { aluno, curso, meses } = req.body

    if (!aluno) {
        return res.status(400).json({
            erro: "O campo aluno e obrigatorio"
        })
    }

    if (!curso) {
        return res.status(400).json({
            erro: "O campo curso e obrigatorio"
        })
    }

    if (
        meses === undefined ||
        meses === null ||
        meses === "" ||
        typeof meses === "boolean" ||
        (typeof meses !== "number" && typeof meses !== "string") ||
        Number.isNaN(Number(meses))
    ) {
        return res.status(400).json({
            erro: "O campo meses deve ser um numero"
        })
    }

    if (Number(meses) <= 0) {
        return res.status(400).json({
            erro: "O campo meses deve ser maior que zero"
        })
    }

    next()
}

module.exports = validarInscricao
