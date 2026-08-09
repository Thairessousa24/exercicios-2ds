class Funcionario {
    constructor(nome, cargo, salario) {
        this.nome = nome
        this.cargo = cargo
        this.salario = salario
    }
}

const funcionario = new Funcionario(
    "João",
    "Desenvolvedor",
    5000
)

module.exports = funcionario