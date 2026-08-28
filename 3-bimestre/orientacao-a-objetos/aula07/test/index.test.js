const produto = require("../index")

test("O produto deve possuir o nome correto", () => {
    expect(produto.nome).toBe("Notebook")
})

test("O produto deve possuir o preço correto", () => {
    expect(produto.preco).toBe(3500)
})

test("O produto deve possuir a categoria correta", () => {
    expect(produto.categoria).toBe("Eletrônicos")
})

test("O produto deve ser uma instância da classe Produto", () => {
    expect(produto.constructor.name).toBe("Produto")
})