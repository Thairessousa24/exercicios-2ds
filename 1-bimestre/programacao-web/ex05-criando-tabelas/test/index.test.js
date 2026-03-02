const fs = require("fs")
const html = fs.readFileSync("index.html","utf8")

test("Título principal", () => {
expect(html).toContain("<h1>Tabela de Produtos</h1>")
})

test("Tabela criada corretamente", () => {
expect(html).toContain("<table>")
expect(html).toContain("<tr>")
expect(html).toContain("<th>Produto</th>")
expect(html).toContain("<th>Preço</th>")
expect(html).toContain("<th>Estoque</th>")
})

test("Produtos inseridos", () => {
expect(html).toContain("Notebook")
expect(html).toContain("Mouse")
expect(html).toContain("Teclado")
})

test("Caption presente", () => {
expect(html).toContain("<caption>Lista de Produtos</caption>")
})