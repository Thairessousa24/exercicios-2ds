const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");

test("Título do formulário", () => {
  expect(html).toContain("<h1>Formulário de Inscrição</h1>");
});

test("Formulário criado", () => {
  expect(html).toContain("<form>");
});

test("Inputs obrigatórios", () => {
  expect(html).toContain('type="text"');
  expect(html).toContain('type="email"');
  expect(html).toContain('type="password"');
});

test("Select presente", () => {
  expect(html).toContain("<select>");
  expect(html).toContain("HTML");
  expect(html).toContain("CSS");
  expect(html).toContain("JavaScript");
});

test("Textarea presente", () => {
  expect(html).toContain("<textarea>");
});

test("Botão de envio", () => {
  expect(html).toContain('type="submit"');
  expect(html).toContain('value="Cadastrar"');
});