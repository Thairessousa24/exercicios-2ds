const Rock = require("./Rock")
const Pop = require("./Pop")
const Eletronica = require("./Eletronica")

class FaixaFactory {
    static criar(tipo, titulo, duracaoEmSegundos) {
        switch (tipo) {
            case "rock":
                return new Rock(titulo, duracaoEmSegundos)

            case "pop":
                return new Pop(titulo, duracaoEmSegundos)

            case "eletronica":
                return new Eletronica(titulo, duracaoEmSegundos)

            default:
                throw new Error("Tipo de faixa inválido")
        }
    }
}

module.exports = FaixaFactory