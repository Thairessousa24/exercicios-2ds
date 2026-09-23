const Faixa = require("./Faixa")

class Pop extends Faixa {
    constructor(titulo, duracaoEmSegundos) {
        super(titulo, duracaoEmSegundos)
    }

    descricao() {
        return "Faixa de pop publicada"
    }
}

module.exports = Pop