const fs = require("fs")
const html = fs.readFileSync("index.html", "utf8")

test("Estrutura básica HTML", () => {
  expect(html).toContain("<!DOCTYPE html>")
  expect(html).toContain('<html lang="pt-br">')
  expect(html).toContain("<head>")
  expect(html).toContain("<body>")
})

test("Título correto", () => {
  expect(html).toContain("<title>Conecta Jovem</title>")
  expect(html).toContain("<h1>Conecta Jovem</h1>")
})

test("Lista não ordenada de cursos", () => {
  expect(html).toContain("<ul>")
  expect(html).toContain("HTML")
  expect(html).toContain("CSS")
  expect(html).toContain("JavaScript")
})

test("Lista ordenada de inscrição", () => {
  expect(html).toContain("<ol>")
})

test("Imagem com atributos obrigatórios", () => {
  expect(html).toContain("<img")
  expect(html).toContain("src=")
  expect(html).toContain("alt=")
})

test("Link correto de inscrição", () => {
  expect(html).toContain('<a href="https://www.google.com">Inscreva-se agora</a>')
})

test("Organização com div e hr", () => {
  expect(html).toContain("<div>")
  expect(html).toContain("<hr>")
})