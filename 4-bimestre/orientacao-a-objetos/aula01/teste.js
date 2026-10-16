const projeto = require("./index.js")

console.log(projeto.nome)
console.log(projeto.scripts)
console.log(projeto.rodar("dev"))
console.log(projeto.temScript("test"))
console.log(projeto.temScript("build"))