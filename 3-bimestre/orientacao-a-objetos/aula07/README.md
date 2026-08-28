# 🎯 Aula 7 — Classes: Abstração

## 🎯 Objetivos da Aula

- Compreender o conceito de **abstração** na Programação Orientada a Objetos.
- Identificar quais informações são realmente necessárias para representar um objeto.
- Diferenciar informações essenciais de detalhes internos de implementação.
- Criar classes que representem objetos de forma simplificada.
- Aplicar abstração na construção de classes JavaScript.

# 🧩 O que é Abstração?

A **abstração** consiste em representar um objeto utilizando apenas as características e comportamentos que são relevantes para o sistema.

Na programação, não precisamos representar todos os detalhes de algo do mundo real.

Por exemplo, imagine um sistema de biblioteca.

Um livro possui muitas características no mundo real: título autor, número de páginas, peso, altura e etc…

Mas um sistema de biblioteca pode precisar apenas de:

```jsx
titulo
autor
ano
disponivel
```

A classe está criando uma **representação simplificada** do livro.

Isso é abstração.

# 🧠 Abstração no mundo real

Imagine um carro.

Para dirigir um carro, você utiliza:

```
volante
pedais
câmbio
```

Você não precisa conhecer todos os detalhes internos do motor para acelerar o carro.

O motorista utiliza uma interface simplificada enquanto os detalhes internos permanecem escondidos.

Na programação acontece algo semelhante.

# 📌 Exemplo 1 — Sem abstração

Imagine que tentássemos representar absolutamente todas as características de um carro:

```jsx
const carro = {
    marca: "Toyota",
    modelo: "Corolla",
    cor: "Prata",
    quantidadeDeRodas: 4,
    peso: 1300,
    altura: 1.43,
    largura: 1.78,
    comprimento: 4.63,
    tipoMotor: "Combustão",
    quantidadeCilindros: 4,
    volumeMotor: 2.0,
    tipoCombustivel: "Gasolina",
    quantidadePortas: 4
}
```

Existe muita informação.

Mas será que um sistema de estacionamento precisa conhecer todas essas informações?

Provavelmente não.

# 📌 Exemplo 2 — Aplicando abstração

Se o objetivo for controlar um estacionamento, talvez seja suficiente:

```jsx
class Carro {

    constructor(placa, modelo, cor) {
        this.placa = placa
        this.modelo = modelo
        this.cor = cor
    }

}
```

Agora temos uma representação muito mais simples.

O sistema possui somente as informações relevantes para o seu objetivo.

# 🧩 Abstração depende do contexto

A mesma entidade pode possuir diferentes representações.

Por exemplo, um `Carro` em um sistema de estacionamento:

```jsx
class Carro {
    constructor(placa, modelo) {
        this.placa = placa
        this.modelo = modelo
    }

}
```

Já em um sistema de oficina mecânica:

```jsx
class Carro {
    constructor(placa, modelo, quilometragem, motor) {
        this.placa = placa
        this.modelo = modelo
        this.quilometragem = quilometragem
        this.motor = motor
    }

}
```

Não existe necessariamente uma única classe `Carro` correta.

A abstração depende **do problema que estamos tentando resolver**.

# 🧠 O que devemos abstrair?

Ao criar uma classe, devemos perguntar:

- O que é importante para o sistema?
- O que precisamos armazenar?
- O que o objeto precisa fazer?
- Quais ações ele precisa executar?
- O que pode ser ignorado?
- Quais detalhes não são necessários?

# 📌 Exemplo 3 — Sistema de banco

Um cliente de banco possui muitas informações.

Porém, para um determinado sistema, podemos trabalhar com:

```jsx
class Conta {
    constructor(numero, titular, saldo) {
        this.numero = numero
        this.titular = titular
        this.saldo = saldo
    }

}
```

Não precisamos representar todos os detalhes da pessoa para trabalhar com a conta.

# ⚠️ Erro comum

### ❌ Confundir abstração com apagar informações

Abstração não significa simplesmente remover informações.

Significa **selecionar aquilo que é relevante para o problema**.

Por exemplo:

```jsx
class Aluno {
    constructor(nome, matricula, curso) {
        this.nome = nome
        this.matricula = matricula
        this.curso = curso
    }

}
```

Se o sistema é responsável por controlar notas, talvez seja necessário adicionar outras informações.

A abstração depende dos requisitos do sistema.

# 📌 Abstração e Classes

As classes são uma ferramenta importante para implementar abstrações.

Podemos representar:

```
Mundo real
     ↓
Identificar informações importantes
     ↓
Identificar comportamentos importantes
     ↓
Criar uma classe
     ↓
Criar instâncias
```

Fim da aula!

_

# 🧩 Exercício Rápido

Você está desenvolvendo um sistema de vendas.

O sistema precisa representar produtos.

Para esse sistema, um produto precisa possuir apenas:

- nome;
- preço;
- categoria.

Crie uma classe chamada:

```jsx
Produto
```

O `constructor` deverá receber essas três informações.

Depois, crie uma instância com:

```
Nome: Notebook
Preço: 3500
Categoria: Eletrônicos
```

Exporte a instância.