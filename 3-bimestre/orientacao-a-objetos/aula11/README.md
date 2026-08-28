# 🎯 AULA 11 — CLASSES: VARIÁVEL / MÉTODO ESTÁTICO

## 🎯 Objetivos da Aula

- Compreender o conceito de membros estáticos em classes JavaScript.
- Diferenciar propriedades de instância e propriedades estáticas.
- Aprender a criar variáveis estáticas utilizando `static`.
- Entender quando uma informação deve pertencer à classe e não a cada instância.
- Acessar propriedades estáticas diretamente pela classe.

## 🧩 O que é um recurso estático?

Até agora, trabalhamos principalmente com informações que pertencem a cada **instância**.

Por exemplo:

```jsx
class Produto {

    constructor(nome, preco) {
        this.nome = nome
        this.preco = preco
    }

}
```

Podemos criar:

```jsx
const produto1 = new Produto("Mouse", 80)
const produto2 = new Produto("Teclado", 150)
```

Cada produto possui seus próprios:

```
nome
preco
```

Isso faz sentido porque cada produto é diferente.

Mas existem informações que **não pertencem a um produto específico**.

Elas pertencem à própria classe.

É nesse cenário que utilizamos `static`.

# 📌 Instância x Classe

Podemos pensar em:

```
Produto
   │
   ├── produto1
   ├── produto2
   └── produto3
```

Cada instância possui seus próprios dados:

```
produto1 → nome, preço
produto2 → nome, preço
produto3 → nome, preço
```

Mas podemos ter uma informação que pertence ao próprio modelo `Produto`:

```
Produto
   │
   └── quantidade máxima permitida
```

Essa informação não precisa ser repetida em cada produto.

# 🧩 Variável de instância

Antes de entender `static`, vamos relembrar uma propriedade normal:

```jsx
class Produto {

    constructor(nome) {
        this.nome = nome
    }

}
```

Aqui:

```jsx
this.nome
```

pertence à instância.

Então:

```jsx
const produto1 = new Produto("Mouse")
const produto2 = new Produto("Teclado")
```

temos:

```
produto1.nome → Mouse
produto2.nome → Teclado
```

Cada objeto possui seu próprio valor.

# 🧩 Variável estática

Uma propriedade estática pertence à **classe**, e não às instâncias.

Utilizamos:

```jsx
static
```

Exemplo:

```jsx
class Produto {

    static categoria = "Eletrônicos"

}
```

Agora podemos acessar:

```jsx
console.log(Produto.categoria)
```

Resultado:

```
Eletrônicos
```

# ⚠️ Não acessamos uma propriedade estática pela instância

Se fizermos:

```jsx
const produto = new Produto()

console.log(produto.categoria)
```

o resultado será:

```
undefined
```

Porque `categoria` pertence à classe:

```jsx
Produto.categoria
```

e não ao objeto:

```jsx
produto.categoria
```

# 📌 Exemplo 1 — Contador de instâncias

Uma situação interessante para utilizar uma variável estática é controlar quantos objetos foram criados.

```jsx
class Usuario {

    static quantidade = 0

    constructor(nome) {

        this.nome = nome

        Usuario.quantidade++

    }

}
```

Agora:

```jsx
const usuario1 = new Usuario("Ana")
const usuario2 = new Usuario("Carlos")
const usuario3 = new Usuario("Maria")

console.log(Usuario.quantidade)
```

Resultado:

```
3
```

Observe que:

```jsx
Usuario.quantidade
```

pertence à classe.

# 🧠 Por que não usar `this.quantidade`?

Se fizéssemos:

```jsx
class Usuario {

    constructor(nome) {

        this.nome = nome
        this.quantidade++

    }

}
```

estaríamos tentando trabalhar com uma propriedade da própria instância.

Mas nosso objetivo é ter **um único contador compartilhado pela classe**.

Por isso utilizamos:

```jsx
Usuario.quantidade
```

# 📌 Exemplo 2 — Identificador automático

Podemos utilizar uma variável estática para gerar IDs.

```jsx
class Usuario {

    static proximoId = 1

    constructor(nome) {

        this.id = Usuario.proximoId
        this.nome = nome

        Usuario.proximoId++

    }

}
```

Agora:

```jsx
const usuario1 = new Usuario("Ana")
const usuario2 = new Usuario("Carlos")
const usuario3 = new Usuario("Maria")
```

Teremos:

```
usuario1.id → 1
usuario2.id → 2
usuario3.id → 3
```

A variável:

```jsx
Usuario.proximoId
```

é compartilhada pela classe.

# 🧠 Instância x Static

| Tipo | Pertence a | Acesso |
| --- | --- | --- |
| `this.nome` | Instância | `produto.nome` |
| `static categoria` | Classe | `Produto.categoria` |
| `this.id` | Instância | `usuario.id` |
| `static proximoId` | Classe | `Usuario.proximoId` |

# ⚠️ Erros comuns

### ❌ Tentar acessar `static` pela instância

```jsx
produto.categoria
```

Quando a propriedade foi declarada como:

```jsx
static categoria = "Eletrônicos"
```

O correto é:

```jsx
Produto.categoria
```

### ❌ Utilizar `this` para acessar uma propriedade estática

Dentro de uma instância, isto:

```jsx
this.quantidade
```

não representa a propriedade estática da classe.

Utilize:

```jsx
NomeDaClasse.quantidade
```

Por exemplo:

```jsx
Usuario.quantidade
```

# 💬 Dica extra

Faça esta pergunta:

> **"Essa informação pertence a cada objeto ou à classe como um todo?"**
> 

Se pertence a cada objeto:

```jsx
this.valor
```

Se pertence à classe:

```jsx
static valor
```

Fim da aula!

_