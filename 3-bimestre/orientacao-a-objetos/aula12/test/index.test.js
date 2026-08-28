const { Usuario, usuario1, usuario2, usuario3 } = require("../index")

test("A primeira instância deve possuir o nome Ana", () => {
    expect(usuario1.nome).toBe("Ana")
})

test("A segunda instância deve possuir o nome Carlos", () => {
    expect(usuario2.nome).toBe("Carlos")
})

test("A terceira instância deve possuir o nome Maria", () => {
    expect(usuario3.nome).toBe("Maria")
})

test("A quantidade de usuários deve ser 3", () => {
    expect(Usuario.quantidade).toBe(3)
})

test("O método estático deve retornar a quantidade de usuários", () => {
    expect(Usuario.quantidadeUsuarios()).toBe(3)
})

test("O método quantidadeUsuarios deve ser um método estático", () => {
    expect(typeof Usuario.quantidadeUsuarios).toBe("function")
})

test("A quantidade deve ser compartilhada entre as instâncias", () => {
    expect(usuario1.quantidade).toBeUndefined()
    expect(usuario2.quantidade).toBeUndefined()
    expect(usuario3.quantidade).toBeUndefined()
})