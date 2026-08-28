# 🎯 AULA 9 — CLASSES: GETTER

# 🎯 Objetivos da Aula

- Compreender o conceito de **Getter** em classes JavaScript.
- Entender como criar métodos de acesso para propriedades privadas.
- Aprender a utilizar a palavra-chave `get`.
- Diferenciar um método tradicional de um Getter.
- Utilizar Getter para disponibilizar informações de forma controlada.
- Relacionar Getter com o conceito de encapsulamento estudado na aula anterior.

## 🧩 O que é um Getter?

Na aula anterior aprendemos que podemos utilizar propriedades privadas para proteger informações internas de uma classe.

Por exemplo:

```jsx
class Conta {

    #saldo

    constructor(saldo) {
        this.#saldo = saldo
    }

}
```

O problema é que não podemos acessar diretamente:

```jsx
conta.#saldo
```

Mas podemos precisar **consultar** esse valor.

Uma solução seria criar um método:

```jsx
consultarSaldo() {
    return this.#saldo
}
```

O **Getter** permite fazer esse acesso de uma maneira mais natural.

# 📌 Método tradicional x Getter

Com um método:

```jsx
class Conta {

    #saldo

    constructor(saldo) {
        this.#saldo = saldo
    }

    consultarSaldo() {
        return this.#saldo
    }

}
```

Utilizamos:

```jsx
conta.consultarSaldo()
```

Com um Getter:

```jsx
class Conta {

    #saldo

    constructor(saldo) {
        this.#saldo = saldo
    }

    get saldo() {
        return this.#saldo
    }

}
```

Utilizamos:

```jsx
conta.saldo
```

Perceba que **não utilizamos `()`**.

# 🧠 Sintaxe do Getter

A estrutura básica é:

```jsx
get nomeDaPropriedade() {
    return valor
}
```

Exemplo:

```jsx
get saldo() {
    return this.#saldo
}
```

O `get` transforma o método em uma propriedade de leitura.

# 📌 Exemplo 1 — Getter simples

```jsx
class Pessoa {

    #nome

    constructor(nome) {
        this.#nome = nome
    }

    get nome() {
        return this.#nome
    }

}

const pessoa = new Pessoa("João")

console.log(pessoa.nome)
```

Resultado:

```jsx
João
```

Embora `nome` seja implementado como um método dentro da classe, ele é utilizado como uma propriedade:

```jsx
pessoa.nome
```

e não:

```jsx
pessoa.nome()
```

# 🔐 Getter e encapsulamento

O Getter não elimina o encapsulamento.

Pelo contrário, ele permite **controlar como uma informação privada será disponibilizada**.

```jsx
class Conta {

    #saldo

    constructor(saldo) {
        this.#saldo = saldo
    }

    get saldo() {
        return this.#saldo
    }

}
```

O código externo pode consultar:

```jsx
conta.saldo
```

Mas não possui acesso direto ao:

```jsx
#saldo
```

# 📌 Exemplo 2 — Getter com cálculo

O Getter também pode retornar um valor calculado.

```jsx
class Produto {

    #preco

    constructor(preco) {
        this.#preco = preco
    }

    get precoComDesconto() {
        return this.#preco * 0.9
    }

}

const produto = new Produto(100)

console.log(produto.precoComDesconto)
```

Resultado:

```jsx
90
```

Nesse caso, `precoComDesconto` não é armazenado diretamente.

O valor é calculado quando o Getter é acessado.

# 📌 Exemplo 3 — Getter utilizando outros atributos

```jsx
class Aluno {

    constructor(nome, nota1, nota2) {
        this.nome = nome
        this.nota1 = nota1
        this.nota2 = nota2
    }

    get media() {
        return (this.nota1 + this.nota2) / 2
    }

}

const aluno = new Aluno("Maria", 8, 10)

console.log(aluno.media)
```

Resultado:

```
9
```

Observe que não precisamos armazenar `media`.

Ela é calculada quando necessário.

# 🧩 Getter como propriedade de leitura

Podemos pensar no Getter como uma **porta de leitura** para os dados da classe.

```
          CLASSE
┌─────────────────────────┐
│                         │
│  #saldo                 │
│  dado privado           │
│                         │
│  get saldo()            │
│          ↓              │
└──────────┼──────────────┘
           │
           ↓
      conta.saldo
```

O código externo não acessa diretamente o atributo privado.

Ele utiliza o Getter.

# ⚠️ Erros comuns

### ❌ Utilizar `()` ao chamar um Getter

Errado:

```jsx
conta.saldo()
```

Correto:

```jsx
conta.saldo
```

### ❌ Tentar acessar o atributo privado

Errado:

```jsx
conta.#saldo
```

O atributo continua privado.

### ❌ Criar um Getter que retorna o próprio Getter

Evite:

```jsx
get saldo() {
    return this.saldo
}
```

Isso gera uma chamada recursiva.

O correto seria retornar o atributo privado:

```jsx
get saldo() {
    return this.#saldo
}
```

Fim da aula!

_

# 🧩 Exercício Rápido

### 💬 Desafio

Você está desenvolvendo um sistema de usuários.

Crie uma classe chamada:

```jsx
Usuario
```

Ela deverá possuir uma propriedade privada:

```jsx
#nome
```

O `constructor` deverá receber o nome do usuário.

Crie um Getter:

```jsx
nome
```

que permita consultar o nome do usuário.

## 📋 Regras

O sistema deverá permitir:

```jsx
const usuario = new Usuario("John")

console.log(usuario.nome)
```

Resultado:

```jsx
John
```

O nome deverá ser armazenado em uma propriedade privada.

O acesso deverá ocorrer através do Getter.