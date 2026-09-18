const LaudoAlta = require("./LaudoAlta")

function criar(tipo, paciente) {
    switch (tipo) {
        case "altaMelhorada":
            return new LaudoAlta.AltaMelhorada(paciente)

        case "altaAPedido":
            return new LaudoAlta.AltaAPedido(paciente)

        case "altaAdministrativa":
            return new LaudoAlta.AltaAdministrativa(paciente)

        default:
            throw new Error("Tipo de laudo inválido")
    }
}

module.exports = {
    criar
}