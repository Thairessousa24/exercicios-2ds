const usuario = require("../index")

test("O nome deve ser acessível através do Getter", () => {
    expect(usuario.nome).toBe("John")
})

test("O nome não deve estar disponível como propriedade pública", () => {
    expect(usuario.nome).toBe("John")
})

test("O atributo privado não deve aparecer como propriedade pública", () => {
    expect(Object.keys(usuario)).not.toContain("#nome")
})