class Livro {
    constructor(titulo, autor, ano) {
        this.titulo = titulo
        this.autor = autor
        this.ano = ano
        this.disponivel = true
    }

    emprestar() {
        if (this.disponivel) {
            this.disponivel = false
        }
    }

    devolver() {
        if (!this.disponivel) {
            this.disponivel = true
        }
    }

    estaDisponivel() {
        return this.disponivel
    }
}

module.exports = Livro