# 📘 PROJETO 4 — MANUAL DE OPERAÇÃO DA EQUIPE

## 🎯 PROBLEMA

Imagine que, na semana que vem, entra uma pessoa nova na equipe de vocês.

Ela pergunta:

> "Como vocês trabalham? Como decidem o que fazer primeiro? Se eu travar numa tarefa, o que eu faço?"

Hoje, as respostas existem — mas estão **na cabeça de cada um**, e cada um responderia diferente. É exatamente o problema que vimos na aula 5: conhecimento que não está escrito se perde quando alguém sai, e gera retrabalho quando alguém chega.

### O desafio da equipe

Vocês vão escrever o **Manual de Operação** da própria equipe: o documento que explica como esse time funciona, como prioriza e como se comunica.

No final, a equipe sai com:

- um manual de operação em formato de documentação viva;
- um ADR registrando uma decisão real que a equipe já tomou;
- um backlog priorizado por uma técnica da aula 5;
- os combinados de comunicação do time;
- um PDI por integrante.

> ⏱️ **Tempo:** este projeto é feito em **um dia de aula (60 minutos)**. O prazo é estendido, mas o trabalho cabe em 60 a 100 minutos. O manual é **enxuto e verdadeiro** — não é um regulamento de 20 páginas que ninguém vai ler.

# ⚠️ A REGRA PRINCIPAL

Este manual descreve como a equipe **realmente** trabalha, não como seria bonito trabalhar.

| ❌ Evitem | ✅ Escrevam |
| --- | --- |
| "a equipe se reúne diariamente às 8h" | "a gente se alinha no grupo do WhatsApp quando alguém trava" |
| "seguimos a metodologia Scrum" | "dividimos as tarefas no começo e cada um avisa quando termina" |
| "toda decisão é documentada" | "as decisões ficam no grupo; agora vamos passar as importantes para o repositório" |

📌 Manual que descreve uma equipe que não existe é documentação morta no dia em que nasce (aula 5). Se algo na equipe não funciona bem, **escrevam isso** e digam o que vão mudar.

# 👥 ORGANIZAÇÃO DA EQUIPE

Mantenham as equipes dos projetos anteriores. Sugestão para o trabalho acontecer em paralelo nos 60 minutos:

| Função | Responsabilidade |
| --- | --- |
| Processo | Etapa 1 — como trabalhamos |
| Decisões | Etapa 2 — o ADR |
| Prioridades | Etapa 3 — o backlog priorizado |
| Comunicação | Etapa 4 — os combinados |

A Etapa 5 (PDI) é **individual** — cada integrante escreve o seu.

# 🛠️ ETAPA 1 — COMO TRABALHAMOS

Escrevam a primeira parte do manual respondendo, em 3 a 5 linhas cada:

### Como as tarefas chegam até a equipe?

> Exemplo: "o professor passa o projeto; a gente lê junto e lista o que precisa ser feito."

### Como decidimos quem faz o quê?

> Exemplo: "cada um escolhe o que prefere; o que ninguém escolhe a gente divide no fim."

### Como sabemos que uma tarefa está pronta?

Esta é a mais importante. Definam a **Definição de Pronto** do time, em formato de checklist:

```
Uma tarefa está pronta quando:
- [ ] o código funciona
- [ ] o teste passa
- [ ] o documento foi atualizado
- [ ] alguém do time revisou
```

⚠️ Lembrem da aula 5: se a atualização da documentação não estiver na Definição de Pronto, a documentação **vai** ficar desatualizada.

### O que fazemos quando alguém trava?

> Exemplo: "manda no grupo com o que já tentou; se ninguém souber em 1 dia, chama o professor."

# 🧾 ETAPA 2 — O ADR

Escolham **uma decisão real** que a equipe já tomou neste ano — tecnológica ou de processo. Exemplos:

- por que escolhemos este tema de produto;
- por que usamos esta ferramenta e não outra;
- por que dividimos as tarefas desta forma;
- por que paramos de fazer algo que estávamos fazendo.

Escrevam o ADR com os **quatro campos** da aula 5:

```markdown
# ADR 001 — <título da decisão>

Data: <quando foi decidido>
Status: aceita

## Contexto
Qual era a situação. O que estava difícil ou em aberto.

## Decisão
O que a equipe decidiu fazer.

## Consequências
+ o que melhorou
+ o que melhorou
− o que piorou ou ficou limitado
− o que vai precisar ser revisto depois
```

⚠️ A seção de consequências precisa ter **no mínimo um item negativo**. Toda decisão tem um custo; um ADR só com vantagens é propaganda, não registro.

# 🎯 ETAPA 3 — BACKLOG PRIORIZADO

Listem **de 6 a 8 itens** de backlog do produto da equipe — coisas que ainda podem ser feitas.

Depois, escolham **uma** técnica da aula 5 e apliquem:

### Opção A — MoSCoW

| Item | Categoria |
| --- | --- |
| ... | Must / Should / Could / Won't |

⚠️ Obrigatório ter **pelo menos um `Won't have`**. Escrever o que **não** será feito é a parte mais valiosa da técnica.

### Opção B — Matriz esforço × impacto

Posicionem os itens nos quatro quadrantes e digam o que fazer com cada grupo.

```
          ALTO IMPACTO
   FAÇA JÁ     │   PLANEJE
───────────────┼───────────────
   DEPOIS      │   DESCARTE
          BAIXO IMPACTO
```

### E, obrigatoriamente, o desempate com RICE

Independente da técnica escolhida, peguem os **2 itens em que a equipe mais discordou** e calculem o RICE de cada um:

```
        Alcance × Impacto
RICE = ────────────────────
             Esforço
```

| Item | Alcance | Impacto (1-3) | Esforço | RICE |
| --- | --- | --- | --- | --- |
| | | | | |
| | | | | |

E respondam em uma linha:

> O número **confirmou** ou **mudou** a opinião do grupo?

📌 Lembrem do alerta da aula 5: o RICE serve para **descobrir** a resposta, não para enfeitar uma decisão que já estava tomada.

# 💬 ETAPA 4 — COMBINADOS DE COMUNICAÇÃO

Definam e escrevam **os combinados do time** (aula 6). Preencham no mínimo estes quatro:

| Combinado | O acordo da nossa equipe |
| --- | --- |
| Tempo de resposta esperado | |
| Horário em que ninguém precisa responder | |
| Qual canal para cada assunto | |
| O que conta como urgente | |

### Modelo de pedido de ajuda

Incluam no manual o modelo de 5 partes da aula 6, para o time usar quando alguém travar:

```
1. O que eu quero fazer
2. O que está acontecendo
3. Onde (arquivo, tela, rota)
4. O que eu já tentei
5. O que eu preciso de você
```

### Modelo de daily por texto

```
ONTEM:
HOJE:
TRAVADO:
```

# 🌱 ETAPA 5 — PDI DE CADA INTEGRANTE

**Individual.** Cada integrante escreve o seu, com as quatro perguntas da aula 6:

```markdown
## PDI — <seu nome> — 4º bimestre

ONDE ESTOU
(sua situação hoje, honesta)

ONDE QUERO CHEGAR
(UM objetivo concreto, com prazo até o fim do bimestre)

O QUE ME FALTA
(a lacuna entre os dois)

O QUE VOU FAZER
- [ ] ação ................... semana 1
- [ ] ação ................... semana 2
- [ ] explicar o conceito para alguém do time ... semana 3
```

Regras:

- **um único objetivo** por pessoa — dez objetivos num bimestre viram zero;
- o objetivo tem que permitir responder **sim ou não** se foi cumprido ("quero melhorar em back-end" não serve);
- **no máximo 4 ações**, cada uma com semana definida;
- a última ação é sempre **explicar o conceito para alguém** — é o teste real de que você entendeu.

# 🤝 ETAPA 6 — RODADA DE FEEDBACK

Em duplas dentro da equipe, **10 minutos**: cada pessoa dá um feedback à outra usando a estrutura da aula 6.

```
SITUAÇÃO:      quando aconteceu
COMPORTAMENTO: o que a pessoa fez
IMPACTO:       o efeito disso no time
```

Pode ser elogio — mas precisa ser **específico**. "Mandou bem" não ensina nada; "sua mensagem no PR explicou o motivo e eu revisei em 2 minutos" ensina o que repetir.

📌 Os feedbacks **não** entram no manual. Esta etapa é de prática, não de documentação.

# 🐙 ETAPA 7 — ENTREGA NO GITHUB

O manual mora **no repositório do produto** — como vimos na aula 5, documentação que mora longe do trabalho é documentação em que ninguém confia.

```
nome-do-produto/
├── README.md
└── docs/
    ├── manual-de-operacao.md   ← Etapas 1 e 4
    ├── adr/
    │   └── 001-<titulo>.md     ← Etapa 2
    ├── backlog.md              ← Etapa 3
    └── pdi/
        ├── <nome1>.md          ← Etapa 5, um por integrante
        ├── <nome2>.md
        └── ...
```

E acrescentem no `README.md` do produto um link para o manual, na seção de documentação.

# 🎯 ENTREGA DO PROJETO 4

| # | Entregável | Onde |
| --- | --- | --- |
| 1 | Como trabalhamos, com a Definição de Pronto em checklist | `manual-de-operacao.md` |
| 2 | ADR de uma decisão real, com no mínimo 1 consequência negativa | `adr/001-....md` |
| 3 | Backlog de 6 a 8 itens priorizado por MoSCoW **ou** esforço × impacto | `backlog.md` |
| 4 | RICE calculado nos 2 itens de maior discordância | `backlog.md` |
| 5 | Os 4 combinados de comunicação + os dois modelos (ajuda e daily) | `manual-de-operacao.md` |
| 6 | Um PDI por integrante, com 1 objetivo e até 4 ações | `pdi/<nome>.md` |
| 7 | Link do manual no README do produto | `README.md` |

# ✅ CRITÉRIOS DE AVALIAÇÃO

| Critério | O que é observado |
| --- | --- |
| Honestidade | o manual descreve a equipe real, não uma equipe ideal? |
| Definição de Pronto | é um checklist verificável, com documentação incluída? |
| ADR | tem contexto, decisão e consequências — inclusive negativas? |
| Priorização | a técnica foi aplicada de verdade, com `Won't have` ou descarte? |
| RICE | as contas aparecem e a conclusão foi registrada? |
| Combinados | são acordos concretos, não frases genéricas? |
| PDI | objetivo único, verificável, com ações datadas? |
| Documentação viva | está no repositório do produto e linkada no README? |

⚠️ Os dois erros que mais custam nota:

1. **Manual de equipe imaginária** — bonito, genérico e inútil. Preferimos "a gente ainda não faz isso bem, e vamos mudar X" a um processo inventado.
2. **PDI com objetivo vago** — "quero aprender mais" não dá para avaliar no fim do bimestre.

Bom manual! 📘
