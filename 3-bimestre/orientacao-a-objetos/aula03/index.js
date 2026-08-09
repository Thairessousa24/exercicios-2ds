class Animal {
    constructor(nome, especie) {
        this.nome = nome
        this.especie = especie
    }
}

const animal1 = new Animal("Rex", "Cachorro")
const animal2 = new Animal("Mimi", "Gato")

module.exports = [animal1, animal2]