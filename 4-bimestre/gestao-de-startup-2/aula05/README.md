# 📘 Aula 5: Documentação Colaborativa e Gerenciamento de Prioridades

## 🎯 Objetivos da aula

- Entender por que uma equipe precisa de **documentação** e o que vale documentar.
- Conhecer os formatos mais usados: **README**, **wiki** e **ADR**.
- Compreender o conceito de **documentação viva**.
- Priorizar um backlog com **MoSCoW**, **matriz esforço × impacto** e **RICE simplificado**.

# 📄 Por que documentar?

Toda equipe já viveu uma destas cenas:

> "Como é que a gente roda esse projeto mesmo?"
>
> "Por que decidimos usar isso e não aquilo?"
>
> "O Pedro sabia, mas ele saiu do grupo."

Documentação existe para resolver exatamente isso. Ela transforma o que está **na cabeça de uma pessoa** em algo que está **disponível para o time**.

> **Documentação não é escrever tudo. É escrever o que custaria caro descobrir de novo.**

## 🚲 O que vale documentar (e o que não)

| Vale documentar | Não vale documentar |
| --- | --- |
| como rodar o projeto | o que o código já diz com clareza |
| por que uma decisão foi tomada | a tarefa de hoje |
| combinados do time | detalhe que muda toda semana |
| o que já foi tentado e não deu certo | o que ninguém nunca vai ler |

📌 Critério prático: se alguém novo entrasse na equipe amanhã, o que ele **precisaria** ler para trabalhar? Isso é a documentação.

# 🗂️ Formatos de documentação

## 📘 README

O arquivo da porta de entrada. Fica na raiz do projeto e responde o básico:

```markdown
# Nome do Projeto

O que é, em uma frase.

## Como rodar
1. npm install
2. npm start

## Estrutura de pastas
- routes/ ... rotas da API
- test/ .... testes automatizados

## Equipe
- Ana — backend
- Bruno — documentação
```

📌 Vocês já usam README em todos os exercícios de Orientação a Objetos. É o mesmo arquivo, com a mesma função.

## 📚 Wiki

Um conjunto de páginas ligadas entre si, para o que não cabe num arquivo só: manual de uso, glossário, processos, tutoriais. O GitHub oferece uma aba *Wiki* em cada repositório.

| README | Wiki |
| --- | --- |
| uma página, o essencial | muitas páginas, o detalhe |
| lido por quem chega | consultado por quem já está |
| curto, sempre atualizado | extenso, organizado por assunto |

## 🧾 ADR — Registro de Decisão de Arquitetura

Um **ADR** (*Architecture Decision Record*) é um documento curto que registra **uma decisão** e o **motivo** dela. É o antídoto para o "por que a gente fez assim?".

Modelo com quatro campos:

```markdown
# ADR 003 — Guardar os dados em arquivo JSON

Data: 2026-10-20
Status: aceita

## Contexto
Precisamos que os pedidos continuem salvos depois de
reiniciar o servidor. Ainda não estudamos banco de dados.

## Decisão
Vamos usar um arquivo JSON com o módulo fs.

## Consequências
+ Funciona com o que já sabemos.
+ Simples de inspecionar e corrigir à mão.
− Não funciona bem com muitos acessos ao mesmo tempo.
− Precisará ser trocado quando aprendermos banco de dados.
```

📌 ADR nunca é apagado ou reescrito. Se a decisão mudar, cria-se um **novo** ADR que marca o anterior como *substituída*. O histórico é o que dá valor.

## 🌱 Documentação viva

**Documentação viva** é a que é atualizada junto com o trabalho, e não no fim do projeto.

Como se consegue isso:

- a tarefa só está **pronta** quando o documento foi atualizado;
- o documento fica **no mesmo repositório** do código, não numa pasta separada que ninguém abre;
- a atualização entra no mesmo PR da mudança.

| Documentação viva | Documentação morta |
| --- | --- |
| atualizada junto com a mudança | escrita uma vez e esquecida |
| mora com o código | mora num drive perdido |
| o time confia nela | o time desconfia e pergunta no grupo |

⚠️ Documentação errada é **pior** que documentação ausente: quem não tem documento pergunta; quem tem documento desatualizado segue a informação errada.

# 🎯 Gerenciamento de prioridades

## 📋 Backlog

**Backlog** é a lista de tudo que a equipe **pode** fazer, em ordem de importância.

Duas regras:

1. O backlog é **ordenado** — não existe empate no topo.
2. O que está no backlog **não é compromisso**, é possibilidade.

Backlog curto de exemplo:

```
[ ] Corrigir erro 500 ao cadastrar pedido sem nome
[ ] Criar tela de listagem de pedidos
[ ] Adicionar busca por nome
[ ] Trocar as cores do sistema
[ ] Exportar relatório em PDF
```

Como decidir a ordem? É aí que entram as três técnicas a seguir.

## 🅰️ MoSCoW

Classifica cada item em quatro categorias:

| Sigla | Categoria | Significado |
| --- | --- | --- |
| **M**o | *Must have* | sem isso a entrega não existe |
| **S** | *Should have* | importante, mas a entrega sobrevive sem |
| **Co** | *Could have* | seria bom se sobrar tempo |
| **W** | *Won't have* | decidido que **não** entra agora |

Aplicando ao backlog acima:

| Item | MoSCoW |
| --- | --- |
| Corrigir erro 500 | **Must** |
| Tela de listagem | **Must** |
| Busca por nome | **Should** |
| Trocar as cores | **Could** |
| Relatório em PDF | **Won't** (fica para depois) |

📌 A categoria mais valiosa é a **Won't**: escrever o que **não** será feito evita que o time tente fazer tudo e não termine nada.

## 📐 Matriz esforço × impacto

Cada item recebe duas notas — quanto dá de trabalho e quanto muda o resultado:

```
          ALTO IMPACTO
               │
   FAÇA JÁ     │   PLANEJE
  (pouco       │  (muito
   esforço)    │   esforço)
───────────────┼───────────────
   DEPOIS      │   DESCARTE
  (pouco       │  (muito
   esforço)    │   esforço)
               │
          BAIXO IMPACTO
```

| Quadrante | O que fazer |
| --- | --- |
| Alto impacto, pouco esforço | **faça já** — melhor relação custo/benefício |
| Alto impacto, muito esforço | **planeje** — vale, mas precisa ser fatiado |
| Baixo impacto, pouco esforço | **depois** — faça se sobrar tempo |
| Baixo impacto, muito esforço | **descarte** |

Corrigir o erro 500 é pouco esforço e alto impacto: faça já. O relatório em PDF é muito esforço e baixo impacto: descarte.

## 🔢 RICE simplificado

O **RICE** dá uma nota numérica a cada item, para comparar coisas diferentes:

```
        Alcance × Impacto
RICE = ────────────────────
             Esforço
```

| Letra | Significado | Como medir na nossa escala |
| --- | --- | --- |
| **R**each (alcance) | quantas pessoas são afetadas | número de usuários |
| **I**mpact (impacto) | quanto melhora para elas | 1 = pouco, 2 = médio, 3 = muito |
| **E**ffort (esforço) | quanto custa fazer | horas ou dias de trabalho |

> Nota: o RICE completo tem também a **C**onfiança. Na versão simplificada deixamos esse fator de fora.

### 🧮 Comparando dois itens

| Item | Alcance | Impacto | Esforço | RICE |
| --- | --- | --- | --- | --- |
| Corrigir erro 500 | 200 | 3 | 2 | (200 × 3) ÷ 2 = **300** |
| Relatório em PDF | 15 | 2 | 8 | (15 × 2) ÷ 8 = **3,75** |

A diferença não é de opinião, é de **80 vezes**. Fica difícil alguém defender o PDF primeiro.

## 🧭 Qual técnica usar?

| Técnica | Quando usar | Vantagem |
| --- | --- | --- |
| MoSCoW | prazo fixo e escopo a cortar | rápida e fácil de explicar |
| Esforço × impacto | muitos itens parecidos | visual, boa para fazer em grupo |
| RICE | dois itens em que o time empacou | o número desempata |

# 📖 Conceitos importantes

| Conceito | Significado |
| --- | --- |
| README | página de entrada do projeto |
| Wiki | conjunto de páginas de documentação detalhada |
| ADR | registro de uma decisão e do motivo dela |
| Documentação viva | documentação atualizada junto com o trabalho |
| Backlog | lista ordenada do que pode ser feito |
| MoSCoW | Must / Should / Could / Won't |
| RICE | (alcance × impacto) ÷ esforço |

# ⚠️ Erros comuns

### ❌ Deixar a documentação para o fim do projeto

No fim ninguém lembra do motivo das decisões — justamente a parte que mais importa.

### ❌ Documentar o óbvio e esquecer o decisivo

Escrever "este arquivo tem as rotas" (o nome `routes/` já diz) e não escrever por que os dados vão para arquivo em vez de banco.

### ❌ Backlog com tudo em prioridade máxima

Se tudo é urgente, nada é prioridade e o time escolhe pela tarefa mais confortável.

### ❌ Usar RICE com números inventados para justificar o que já se queria fazer

A técnica serve para descobrir a resposta, não para enfeitar uma decisão já tomada.

Fim da aula!

_

# 🧩 Atividade Rápida

Individual ou em dupla, **usando o GitHub Copilot**, crie um priorizador e use para decidir **o que o app das aulas 1 e 2 faz a seguir**.

> ⏱️ 15 minutos — 5 para construir, 10 para priorizar.

**1. Construa (5 min)**

Exemplo de prompt:

```
Crie uma página HTML com JavaScript puro para cadastrar itens de backlog
com: título, MoSCoW (Must, Should, Could, Won't), alcance, impacto (1 a 3)
e esforço (horas). Salve no localStorage e mostre uma tabela ordenada
pelo RICE = (alcance × impacto) ÷ esforço, do maior para o menor.
```

Confira: com os dois itens do exemplo da aula, o RICE precisa dar **300** e **3,75**.

**2. Priorize (10 min)**

- Cadastre **5 itens** de backlog do app, incluindo a decisão da aula 2. Pelo menos um deve ser **Won't**.
- Para o **alcance**, use os números que você coletou no NPS e no funil.
- Escreva o **ADR** da decisão sobre o **primeiro item** da lista, com contexto, decisão, consequências e status.

**3. Responda**

- Quais os 3 primeiros itens e o RICE de cada um?
- A ordem do RICE mudou alguma coisa que você tinha planejado?
