const Faixa = require("./Faixa")

class Eletronica extends Faixa {
    constructor(titulo, duracaoEmSegundos) {
        super(titulo, duracaoEmSegundos)
    }

    descricao() {
        return "Faixa eletrônica publicada"
    }
}

module.exports = Eletronica