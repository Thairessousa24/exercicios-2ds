class Usuario {

    #nome

    constructor(nome) {
        this.#nome = nome
    }

    get nome() {
        return this.#nome
    }

}

const usuario = new Usuario("John")

module.exports = usuario