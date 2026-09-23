const Faixa = require("./Faixa")

class Rock extends Faixa {
    constructor(titulo, duracaoEmSegundos) {
        super(titulo, duracaoEmSegundos)
        this.registros = []
    }

    descricao() {
        return "Faixa de rock publicada"
    }

    adicionarRegistro(registro) {
        this.registros.push(registro)
    }
}

module.exports = Rock