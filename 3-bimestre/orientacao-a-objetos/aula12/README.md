# 🎯 AULA 12 — CLASSES: VARIÁVEL / MÉTODO ESTÁTICO

## 🎯 Objetivos da Aula

- Criar métodos estáticos utilizando `static`.
- Diferenciar métodos de instância e métodos estáticos.
- Entender quando utilizar um método pertencente à classe.
- Acessar métodos estáticos diretamente pela classe.
- Utilizar métodos estáticos para operações relacionadas à própria classe.
- Combinar propriedades e métodos estáticos.

# 🧩 Relembrando métodos de instância

Até agora criamos métodos que pertencem às instâncias.

Exemplo:

```jsx
class Produto {

    constructor(nome, preco) {
        this.nome = nome
        this.preco = preco
    }

    aplicarDesconto(percentual) {
        this.preco -= this.preco * percentual
    }

}
```

Criamos um produto:

```jsx
const produto = new Produto("Mouse", 100)
```

E chamamos:

```jsx
produto.aplicarDesconto(10)
```

O método trabalha com os dados de **um produto específico**.

# 🧩 Método estático

Um método estático pertence à classe.

Utilizamos:

```jsx
static
```

Exemplo:

```jsx
class Calculadora {

    static somar(a, b) {
        return a + b
    }

}
```

Podemos executar:

```jsx
Calculadora.somar(10, 20)
```

Resultado:

```
30
```

Não precisamos criar uma instância:

```jsx
new Calculadora()
```

# 📌 Método de instância x método estático

Método de instância:

```jsx
const produto = new Produto("Mouse", 100)

produto.aplicarDesconto(10)
```

Método estático:

```jsx
Calculadora.somar(10, 20)
```

A principal diferença é:

```
Método de instância
        ↓
objeto.metodo()

Método estático
        ↓
Classe.metodo()
```

# 📌 Exemplo 1 — Calculadora

```jsx
class Calculadora {

    static somar(a, b) {
        return a + b
    }

    static subtrair(a, b) {
        return a - b
    }

    static multiplicar(a, b) {
        return a * b
    }

}
```

Uso:

```jsx
console.log(Calculadora.somar(10, 5))
console.log(Calculadora.subtrair(10, 5))
console.log(Calculadora.multiplicar(10, 5))
```

Resultado:

```
15
5
50
```

Não existe necessidade de criar:

```jsx
const calculadora = new Calculadora()
```

As operações pertencem à própria classe.

# 🧠 Quando utilizar um método estático?

Uma boa situação é quando a operação:

- não depende de uma instância específica;
- não precisa acessar `this` da instância;
- representa uma operação relacionada à classe.

Por exemplo:

```jsx
Calculadora.somar(10, 20)
```

A soma não pertence a uma calculadora específica.

É uma operação relacionada ao conceito de calculadora.

# 📌 Exemplo 2 — Criando usuários

Imagine uma classe `Usuario`.

```jsx
class Usuario {

    constructor(nome, email) {
        this.nome = nome
        this.email = email
    }

    apresentar() {
        return `Usuário: ${this.nome}`
    }

}
```

`apresentar()` é um método de instância porque depende de:

```jsx
this.nome
```

Agora podemos criar um método estático:

```jsx
class Usuario {

    constructor(nome, email) {
        this.nome = nome
        this.email = email
    }

    apresentar() {
        return `Usuário: ${this.nome}`
    }

    static tipo() {
        return "Usuário do sistema"
    }

}
```

Uso:

```jsx
Usuario.tipo()
```

Resultado:

```
Usuário do sistema
```

# 📌 Exemplo 3 — Método estático com variável estática

Podemos combinar os dois recursos.

```jsx
class Usuario {

    static quantidade = 0

    constructor(nome) {

        this.nome = nome

        Usuario.quantidade++

    }

    static quantidadeUsuarios() {
        return Usuario.quantidade
    }

}
```

Agora:

```jsx
const usuario1 = new Usuario("Ana")
const usuario2 = new Usuario("Carlos")
const usuario3 = new Usuario("Maria")

console.log(Usuario.quantidadeUsuarios())
```

Resultado:

```
3
```

# 🧠 O que acontece nesse exemplo?

A propriedade:

```jsx
static quantidade = 0
```

pertence à classe.

Cada vez que uma instância é criada:

```jsx
Usuario.quantidade++
```

a quantidade aumenta.

O método:

```jsx
static quantidadeUsuarios()
```

permite consultar essa informação.

# 📌 Exemplo 4 — Método estático para criar objetos

Métodos estáticos também podem ser utilizados para criar instâncias.

```jsx
class Usuario {

    constructor(nome, email) {
        this.nome = nome
        this.email = email
    }

    static criarVisitante(nome) {
        return new Usuario(
            nome,
            "visitante@email.com"
        )
    }

}
```

Agora podemos fazer:

```jsx
const usuario = Usuario.criarVisitante("João")
```

O método estático cria uma nova instância.

# 🧠 Um método estático pode acessar `static`

Considere:

```jsx
class Produto {

    static categoria = "Eletrônicos"

    static mostrarCategoria() {
        return Produto.categoria
    }

}
```

Podemos fazer:

```jsx
console.log(Produto.mostrarCategoria())
```

Resultado:

```
Eletrônicos
```

# ⚠️ Erro comum: usar `this` como se fosse uma instância

Em métodos de instância:

```jsx
class Pessoa {

    constructor(nome) {
        this.nome = nome
    }

    apresentar() {
        return this.nome
    }

}
```

`this` representa a instância.

Em um método estático:

```jsx
class Pessoa {

    static apresentar() {
        return this
    }

}
```

o contexto de `this` é a própria classe.

Por isso, em métodos estáticos, é comum trabalhar com recursos estáticos da classe.

# 📌 Exemplo 5 — Método estático de validação

Uma aplicação pode utilizar uma classe para validar dados:

```jsx
class Usuario {

    constructor(nome, email) {
        this.nome = nome
        this.email = email
    }

    static emailValido(email) {
        return email.includes("@")
    }

}
```

Uso:

```jsx
Usuario.emailValido("joao@email.com")
```

Resultado:

```
true
```

E:

```jsx
Usuario.emailValido("joaoemail.com")
```

Resultado:

```
false
```

Não precisamos criar um usuário para validar o email.

# 🧩 Quando usar cada tipo?

### Método de instância

Use quando a ação depende de um objeto específico.

```jsx
produto.aplicarDesconto()
```

O método precisa conhecer:

```jsx
this.preco
```

### Método estático

Use quando a ação pertence à classe e não depende de um objeto específico.

```jsx
Usuario.emailValido(email)
```

Não precisamos de:

```jsx
usuario.email
```

para realizar a validação.

# 🧠 Comparação completa

```jsx
class Produto {

    static quantidade = 0

    constructor(nome, preco) {

        this.nome = nome
        this.preco = preco

        Produto.quantidade++

    }

    aplicarDesconto(percentual) {
        this.preco -= this.preco * percentual
    }

    static quantidadeProdutos() {
        return Produto.quantidade
    }

}
```

Temos:

```
Produto
│
├── static quantidade
│
├── static quantidadeProdutos()
│
├── this.nome
├── this.preco
│
└── aplicarDesconto()
```

# ⚠️ Erros comuns

### ❌ Chamar método estático através da instância

Errado:

```jsx
const usuario = new Usuario("João")

usuario.emailValido("teste@email.com")
```

Correto:

```jsx
Usuario.emailValido("teste@email.com")
```

### ❌ Criar uma instância sem necessidade

Se temos:

```jsx
static somar(a, b)
```

não precisamos fazer:

```jsx
const calculadora = new Calculadora()
```

Podemos utilizar diretamente:

```jsx
Calculadora.somar(10, 20)
```

### ❌ Utilizar um método estático para manipular dados específicos de uma instância

Se temos:

```jsx
produto.preco
```

e queremos alterar esse preço, provavelmente estamos trabalhando com um método de instância:

```jsx
produto.aplicarDesconto()
```

e não com um método estático.

Fim da aula!

_

# 🧩 Exercício Rápido

Você está desenvolvendo um sistema de cadastro de usuários.

Crie uma classe chamada:

```jsx
Usuario
```

A classe deverá possuir:

### Propriedade estática

```jsx
quantidade
```

Ela deverá começar com:

```
0
```

### Constructor

O `constructor` deverá receber:

```
nome
```

e armazenar esse valor na instância.

Cada novo usuário criado deverá aumentar:

```jsx
Usuario.quantidade
```

em `1`.

### Método estático

Crie:

```jsx
quantidadeUsuarios()
```

O método deverá retornar a quantidade atual de usuários criados.

## 📋 Regras

Ao executar:

```jsx
const usuario1 = new Usuario("Ana")
const usuario2 = new Usuario("Carlos")
const usuario3 = new Usuario("Maria")
```

deverá ser possível executar:

```jsx
Usuario.quantidadeUsuarios()
```

e obter:

```
3
```

Além disso:

```jsx
usuario1.nome
```

deverá retornar:

```
Ana
```