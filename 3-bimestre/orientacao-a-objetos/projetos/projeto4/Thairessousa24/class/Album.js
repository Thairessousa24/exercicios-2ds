class Album {
    constructor(nome) {
        this.nome = nome
        this.membros = []
        this.categorias = []
    }

    adicionarMembro(membro) {
        this.membros.push(membro)
    }

    adicionarCategoria(categoria) {
        this.categorias.push(categoria)
    }
}

module.exports = Album