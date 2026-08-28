const produto = require("../index")

test("O preço inicial deve ser 100", () => {
    expect(produto.preco).toBe(100)
})

test("O Setter deve permitir alterar o preço", () => {

    produto.preco = 250

    expect(produto.preco).toBe(250)

})

test("O Setter deve aceitar preço igual a zero", () => {

    produto.preco = 0

    expect(produto.preco).toBe(0)

})

test("O Setter não deve aceitar preço negativo", () => {

    produto.preco = 100

    produto.preco = -50

    expect(produto.preco).toBe(100)

})

test("O preço não deve estar disponível como atributo público comum", () => {
    expect(Object.keys(produto)).not.toContain("#preco")
})