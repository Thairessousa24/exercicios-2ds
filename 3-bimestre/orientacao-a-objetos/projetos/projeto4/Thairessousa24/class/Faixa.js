class Faixa {
    #titulo
    #duracaoEmSegundos

    constructor(titulo, duracaoEmSegundos) {
        this.#titulo = titulo
        this.#duracaoEmSegundos = duracaoEmSegundos
    }

    get titulo() {
        return this.#titulo
    }

    get duracaoEmSegundos() {
        return this.#duracaoEmSegundos
    }

    descricao() {
        return "Faixa cadastrada no catálogo"
    }
}

module.exports = Faixa