# 🎯 AULA 10 — CLASSES: SETTER

# 🎯 Objetivos da Aula

- Compreender o conceito de **Setter** em classes JavaScript.
- Aprender a utilizar a palavra-chave `set`.
- Alterar propriedades privadas de forma controlada.
- Aplicar regras de validação antes de alterar um atributo.
- Compreender a diferença entre Getter e Setter.
- Utilizar Getter e Setter juntos em uma classe.

# 🧩 O que é um Setter?

Na aula anterior aprendemos a utilizar **Getter** para consultar informações.

Agora precisamos resolver outro problema:

> Como alterar uma informação privada de maneira controlada?
> 

Imagine uma classe:

```jsx
class Produto {

    #preco

    constructor(preco) {
        this.#preco = preco
    }

}
```

O preço está protegido.

Não podemos fazer:

```jsx
produto.#preco = 500
```

Precisamos de uma forma controlada de alterar esse valor.

Para isso utilizamos o **Setter**.

# 📌 O que é um Setter?

O Setter é utilizado para **definir ou alterar o valor de uma propriedade**.

Sua estrutura é:

```jsx
set nomeDaPropriedade(valor) {
    // alteração
}
```

Diferentemente de um método tradicional, ele é utilizado sem `()`.

# 📌 Exemplo 1 — Setter simples

```jsx
class Pessoa {

    #nome

    constructor(nome) {
        this.#nome = nome
    }

    set nome(novoNome) {
        this.#nome = novoNome
    }

}
```

Agora podemos fazer:

```jsx
const pessoa = new Pessoa("João")

pessoa.nome = "Carlos"
```

O Setter será executado automaticamente.

# 🧠 O que acontece internamente?

Quando fazemos:

```jsx
pessoa.nome = "Carlos"
```

o JavaScript identifica que existe um Setter chamado `nome`:

```jsx
set nome(novoNome) {
    this.#nome = novoNome
}
```

Então `"Carlos"` é recebido pelo parâmetro `novoNome`.

# 📌 Getter + Setter

É muito comum utilizar os dois juntos.

```jsx
class Pessoa {

    #nome

    constructor(nome) {
        this.#nome = nome
    }

    get nome() {
        return this.#nome
    }

    set nome(novoNome) {
        this.#nome = novoNome
    }

}
```

Uso:

```jsx
const pessoa = new Pessoa("João")

console.log(pessoa.nome)

pessoa.nome = "Maria"

console.log(pessoa.nome)
```

Resultado:

```jsx
João
Maria
```

# 🔐 Setter e encapsulamento

O Setter permite controlar como um atributo privado pode ser alterado.

Isso é especialmente importante quando existem **regras de negócio**.

# 📌 Exemplo 2 — Validando idade

Imagine que uma idade não possa ser negativa.

```jsx
class Pessoa {

    #idade

    constructor(idade) {
        this.#idade = idade
    }

    get idade() {
        return this.#idade
    }

    set idade(novaIdade) {

        if (novaIdade >= 0) {
            this.#idade = novaIdade
        }

    }

}
```

Agora:

```jsx
const pessoa = new Pessoa(20)

pessoa.idade = 25
```

Funciona.

Mas:

```jsx
pessoa.idade = -10
```

não altera o valor.

# 🧩 Setter como uma barreira de segurança

Podemos imaginar:

```
       código externo
              │
              ↓
       pessoa.idade = -10
              │
              ↓
          SETTER
              │
        ┌─────┴─────┐
        │           │
     válido      inválido
        │           │
        ↓           ↓
     altera       rejeita
```

O Setter controla a entrada dos dados.

# 📌 Exemplo 3 — Validando preço

```jsx
class Produto {

    #preco

    constructor(preco) {
        this.#preco = preco
    }

    get preco() {
        return this.#preco
    }

    set preco(novoPreco) {

        if (novoPreco >= 0) {
            this.#preco = novoPreco
        }

    }

}
```

Agora:

```jsx
const produto = new Produto(100)

produto.preco = 150

console.log(produto.preco)
```

Resultado:

```
150
```

Mas:

```jsx
produto.preco = -50
```

não será aceito.

# 📌 Getter x Setter

| Recurso | Função | Exemplo |
| --- | --- | --- |
| Getter | Obtém um valor | `produto.preco` |
| Setter | Altera um valor | `produto.preco = 200` |
| `get` | Cria um Getter | `get preco()` |
| `set` | Cria um Setter | `set preco(valor)` |

Uma forma simples de lembrar:

> **Getter → pegar informação.**
> 

> **Setter → definir informação.**
> 

# ⚠️ Erros comuns

### ❌ Usar parênteses no Setter

Errado:

```jsx
produto.preco(200)
```

Correto:

```jsx
produto.preco = 200
```

---

### ❌ Alterar diretamente o atributo privado

Errado:

```jsx
produto.#preco = 200
```

A alteração deve ser controlada pelo Setter.

### ❌ Criar Setter sem validação quando existe uma regra

Se qualquer valor for permitido, o Setter pode simplesmente atribuir.

Mas quando existe uma regra de negócio, devemos validá-la:

```jsx
set preco(valor) {

    if (valor >= 0) {
        this.#preco = valor
    }

}
```

# 📌 Exemplo 4 — Getter e Setter com validação

```jsx
class Conta {

    #saldo

    constructor(saldo) {
        this.#saldo = saldo
    }

    get saldo() {
        return this.#saldo
    }

    set saldo(novoSaldo) {

        if (novoSaldo >= 0) {
            this.#saldo = novoSaldo
        }

    }

}
```

Uso:

```jsx
const conta = new Conta(1000)

console.log(conta.saldo)

conta.saldo = 1500

console.log(conta.saldo)
```

Resultado:

```
1000
1500
```

Tentativa inválida:

```jsx
conta.saldo = -500
```

O Setter impede que o saldo se torne negativo.

Fim da aula!

_

# 🧩 Exercício Rápido

Você está desenvolvendo um sistema de produtos para uma loja.

Crie uma classe:

```jsx
Produto
```

Ela deverá possuir uma propriedade privada:

```jsx
#preco
```

O `constructor` deverá receber o preço inicial.

Crie:

```jsx
get preco()
```

para consultar o preço.

E:

```jsx
set preco(novoPreco)
```

para alterar o preço.

## 📋 Regras

O preço:

- deve ser consultável através do Getter;
- pode ser alterado através do Setter;
- não pode assumir valores negativos;
- caso seja informado um valor negativo, o preço anterior deve ser mantido.

Crie uma instância inicialmente com:

```
100
```