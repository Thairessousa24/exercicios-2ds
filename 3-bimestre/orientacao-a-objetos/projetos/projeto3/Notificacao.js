// CRIE SUA SOLUÇÃO ABAIXO ================
class Notificacao {
  constructor(mensagem) {
    this.mensagem = mensagem
  }

  enviar() {
    throw new Error("O método enviar() deve ser implementado.")
  }
}

class Email extends Notificacao {
  enviar() {
    return `E-mail enviado: ${this.mensagem}`
  }
}

class SMS extends Notificacao {
  enviar() {
    return `SMS enviado: ${this.mensagem}`
  }
}

class App extends Notificacao {
  enviar() {
    return `Notificação no aplicativo: ${this.mensagem}`
  }
}




// === FIM DO CÓDIGO =======================
// === NÃO FAZER NADA ABAIXO DESSA LINHA ===
module.exports = Notificacao
module.exports.Email = Email
module.exports.SMS = SMS
module.exports.App = App