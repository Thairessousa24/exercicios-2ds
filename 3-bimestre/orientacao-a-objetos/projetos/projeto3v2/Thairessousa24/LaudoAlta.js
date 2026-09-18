class LaudoAlta {
    constructor(paciente) {
        this.paciente = paciente
    }

    emitir() {
        throw new Error("Método emitir() deve ser implementado.")
    }
}

class AltaMelhorada extends LaudoAlta {
    emitir() {
        return `Laudo de alta melhorada emitido para: ${this.paciente}`
    }
}

class AltaAPedido extends LaudoAlta {
    emitir() {
        return `Laudo de alta a pedido emitido para: ${this.paciente}`
    }
}

class AltaAdministrativa extends LaudoAlta {
    emitir() {
        return `Laudo de alta administrativa emitido para: ${this.paciente}`
    }
}

module.exports = LaudoAlta
module.exports.AltaMelhorada = AltaMelhorada
module.exports.AltaAPedido = AltaAPedido
module.exports.AltaAdministrativa = AltaAdministrativa