class Funcionario {
    static quantidade = 0

    #salario

    constructor(nome, cargo, salario) {
        this.nome = nome
        this.cargo = cargo
        this.#salario = salario

        Funcionario.quantidade++
    }

    get salario() {
        return this.#salario
    }

    set salario(novoSalario) {
        if (novoSalario >= 0) {
            this.#salario = novoSalario
        }
    }

    apresentar() {
        return `${this.nome} - ${this.cargo}`
    }

    static quantidadeFuncionarios() {
        return Funcionario.quantidade
    }
}

module.exports = Funcionario