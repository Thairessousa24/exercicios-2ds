
const projeto = {
  nome: "aula01",

  scripts: ["test", "start", "dev"],

  rodar(script) {
    return `Executando: npm run ${script}`
  },

  temScript(script) {
    return this.scripts.includes(script)
  }
}

module.exports = projeto