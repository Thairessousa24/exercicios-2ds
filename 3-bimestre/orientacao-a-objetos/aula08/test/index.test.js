const cofre = require("../index")

test("O código correto deve retornar true", () => {
    expect(cofre.verificarCodigo("1234")).toBe(true)
})

test("Um código incorreto deve retornar false", () => {
    expect(cofre.verificarCodigo("9999")).toBe(false)
})

test("Outro código incorreto deve retornar false", () => {
    expect(cofre.verificarCodigo("0000")).toBe(false)
})

test("O código não deve estar disponível como propriedade pública", () => {
    expect(cofre.codigo).toBeUndefined()
})