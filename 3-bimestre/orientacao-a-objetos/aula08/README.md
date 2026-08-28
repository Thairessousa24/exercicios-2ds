# 🎯 Aula 8 — Classes: Encapsulamento

# 🎯 Objetivos da Aula

- Compreender o conceito de **encapsulamento**.
- Entender por que nem todos os dados de um objeto devem ser acessados diretamente.
- Conhecer propriedades privadas em classes JavaScript.
- Utilizar `#` para criar atributos privados.
- Criar métodos públicos para controlar o acesso aos dados internos.
- Diferenciar acesso público de acesso privado.

# 🧩 O que é Encapsulamento?

**Encapsulamento** é o princípio de esconder detalhes internos de um objeto e controlar a forma como esses dados podem ser acessados ou modificados.

Em vez de permitir que qualquer parte do programa altere diretamente um dado importante, a própria classe controla essa alteração.

# 📌 Exemplo: Conta Bancária

Imagine uma conta bancária:

```jsx
class Conta {
    constructor(titular, saldo) {
        this.titular = titular
        this.saldo = saldo
    }

}
```

Agora seria possível fazer:

```jsx
const conta = new Conta("João", 1000)

conta.saldo = -50000
```

Isso representa um problema.

O código externo conseguiu modificar diretamente o saldo para um valor inválido.

Precisamos controlar esse acesso.

# 🔐 Dados privados

JavaScript permite criar propriedades privadas utilizando `#`.

Exemplo:

```jsx
class Conta {

    #saldo

    constructor(titular, saldo) {
        this.titular = titular
        this.#saldo = saldo
    }

}
```

Agora `#saldo` pertence internamente à classe.

Ele não pode ser acessado diretamente de fora.

# 📌 Exemplo 1 — Tentando acessar uma propriedade privada

```jsx
class Conta {

    #saldo

    constructor(saldo) {
        this.#saldo = saldo
    }

}

const conta = new Conta(1000)

console.log(conta.#saldo)
```

Esse código gera erro.

O atributo privado só pode ser utilizado dentro da própria classe.

# 🧠 Por que isso é importante?

Observe:

```jsx
conta.#saldo
```

Não podemos acessar diretamente.

Mas podemos criar uma ação:

```jsx
consultarSaldo()
```

Assim, a classe decide como o dado será disponibilizado.

# 📌 Exemplo 2 — Encapsulando o saldo

```jsx
class Conta {

    #saldo

    constructor(titular, saldo) {
        this.titular = titular
        this.#saldo = saldo
    }

    consultarSaldo() {
        return this.#saldo
    }

}
```

Agora:

```jsx
const conta = new Conta("João", 1000)

console.log(conta.consultarSaldo())
```

Resultado:

```
1000
```

O saldo continua privado.

# 📌 Exemplo 3 — Controlando alterações

Podemos criar uma action para realizar um depósito:

```jsx
class Conta {

    #saldo

    constructor(titular, saldo) {
        this.titular = titular
        this.#saldo = saldo
    }

    depositar(valor) {
        this.#saldo = this.#saldo + valor
    }

    consultarSaldo() {
        return this.#saldo
    }

}
```

Agora o código externo não altera diretamente o saldo.

Ele solicita uma operação:

```jsx
conta.depositar(500)
```

# ⚠️ Criando regras

O encapsulamento permite que a classe controle as alterações.

Por exemplo, não queremos permitir depósitos negativos.

```jsx
class Conta {

    #saldo

    constructor(saldo) {
        this.#saldo = saldo
    }

    depositar(valor) {

        if (valor > 0) {
            this.#saldo = this.#saldo + valor
        }

    }

    consultarSaldo() {
        return this.#saldo
    }

}
```

Agora a própria classe controla a regra.

# 📌 Público x Privado

Podemos visualizar assim:

```
                 CONTA
        ┌─────────────────────┐
        │                     │
        │  #saldo             │
        │  Dado privado       │
        │                     │
        │  depositar()        │ ← Público
        │  consultarSaldo()   │ ← Público
        │                     │
        └─────────────────────┘
                  ↑
                  │
          acesso controlado
```

O código externo não precisa conhecer como o saldo é armazenado internamente.

# 🧠 Encapsulamento na prática

Sem encapsulamento:

```jsx
conta.saldo = -1000
```

Com encapsulamento:

```jsx
conta.depositar(500)
```

A diferença é importante.

No segundo caso, a classe pode decidir:

- se o valor é válido;
- como o saldo será alterado;
- quais regras devem ser respeitadas.

# 📌 Exemplo 4 — Conta completa

```jsx
class Conta {

    #saldo

    constructor(titular, saldoInicial) {
        this.titular = titular
        this.#saldo = saldoInicial
    }

    depositar(valor) {

        if (valor <= 0) {
            return false
        }

        this.#saldo += valor

        return true
    }

    sacar(valor) {

        if (valor <= 0 || valor > this.#saldo) {
            return false
        }

        this.#saldo -= valor

        return true
    }

    consultarSaldo() {
        return this.#saldo
    }

}
```

Uso:

```jsx
const conta = new Conta("Maria", 1000)

conta.depositar(500)
conta.sacar(200)

console.log(conta.consultarSaldo())
```

Resultado:

```
1300
```

# ⚠️ Erros comuns

### ❌ Tentar acessar atributo privado diretamente

```jsx
conta.#saldo
```

Isso não é permitido fora da classe.

### ❌ Criar um atributo privado e nunca utilizá-lo

```jsx
class Conta {

    #saldo

}
```

O encapsulamento deve existir para proteger algum estado ou regra importante.

### ❌ Achar que encapsulamento significa esconder tudo

Não.

Algumas informações podem continuar públicas:

```jsx
conta.titular
```

Enquanto informações sensíveis podem ser privadas:

```jsx
conta.#saldo
```

O objetivo é **controlar o acesso**, não simplesmente esconder todos os atributos.

Fim da aula!

_

# 🧩 Exercício Rápido

Você está desenvolvendo um sistema para um **cofre digital**.

O cofre possui um código secreto que não pode ser acessado diretamente por outras partes do programa.

Crie uma classe chamada `Cofre`.

Ela deverá possuir uma propriedade privada `#codigo`.

O `constructor` deverá receber o código.

Crie também uma action `verificarCodigo(codigo)` .

Ela deverá retornar `true` quando o código informado for igual ao código armazenado.:

Caso contrário, deverá retornar `false`.

## 📋 Regras

O código deverá:

- ser armazenado utilizando uma propriedade privada;
- não ficar disponível diretamente fora da classe;
- ser verificado através do método `verificarCodigo()`;
- retornar `true` para o código correto;
- retornar `false` para um código incorreto.