class Produto {
    constructor(nome, preco, categoria) {
        this.nome = nome
        this.preco = preco
        this.categoria = categoria
    }
}

const notebook = new Produto("Notebook", 3500, "Eletrônicos")

module.exports = notebook