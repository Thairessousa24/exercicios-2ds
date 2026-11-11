# 📘 Aula 6: Comunicação Remota, Mentorias e Desenvolvimento Contínuo

## 🎯 Objetivos da aula

- Diferenciar comunicação **síncrona** de **assíncrona**.
- Escrever uma mensagem de trabalho clara e completa.
- Compreender o papel da **mentoria** e como pedir e dar **feedback**.
- Montar um **plano de desenvolvimento contínuo** individual.

# 💬 Comunicação síncrona e assíncrona

| | Síncrona | Assíncrona |
| --- | --- | --- |
| O que é | todos ao mesmo tempo | cada um no seu tempo |
| Exemplos | reunião, chamada, conversa na sala | mensagem, e-mail, comentário no PR, documento |
| Boa para | decidir junto, resolver conflito, alinhar algo confuso | informar, registrar, pedir revisão, perguntar |
| Custo | o tempo de **todos** ao mesmo tempo | o tempo de cada um, quando puder |

Uma reunião de 30 minutos com 5 pessoas custa **2h30 de equipe**. Nem toda informação merece esse preço.

> **Regra prática: se a mensagem não precisa de debate, ela não precisa de reunião.**

## ✍️ Escrever bem é a habilidade central do trabalho remoto

Na comunicação assíncrona, cada ida e volta pode custar horas. Uma mensagem incompleta trava quem ia te ajudar.

### ❌ Mensagem que trava o time

```
alguém aí? tá dando erro
```

Quem lê não sabe o que aconteceu, onde, nem o que você já tentou. São necessárias três respostas só para começar a ajudar.

### ✅ Mensagem que resolve

```
Travei na rota POST /pedidos.

O que acontece: retorna 500 em vez de 201.
Onde: routes/pedidos.js, linha 14.
Erro: "Cannot read properties of undefined (reading 'nome')"
O que já tentei: conferi o body no Insomnia (está certo) e
                 adicionei um console.log no req.body — vem undefined.
Minha suspeita: falta o express.json() no app.
Preciso de: alguém confirmar se é isso antes de eu mexer no app.js.
```

A estrutura é sempre a mesma — e vale para qualquer pedido de ajuda:

```
1. O que eu quero fazer
2. O que está acontecendo
3. Onde (arquivo, tela, rota)
4. O que eu já tentei
5. O que eu preciso de você
```

📌 O item **4** é o que separa pedido de ajuda de pedido para alguém fazer no seu lugar.

## 📆 Daily por texto

A **daily** é o alinhamento curto do time. Na versão assíncrona, cada pessoa escreve três linhas, no mesmo horário combinado:

```
ONTEM:  terminei a rota GET /produtos e os testes dela
HOJE:   começo a validação do POST
TRAVADO: não, mas vou precisar do modelo de erro que a Ana definiu
```

Em 30 segundos de escrita, o time inteiro sabe onde cada um está — sem reunião.

## 🤝 Combinados de resposta

Trabalho remoto sem combinado gera dois problemas opostos: quem fica ansioso esperando resposta e quem se sente obrigado a responder na hora.

A solução é o time **acordar as regras** e escrevê-las na documentação:

| Combinado | Exemplo de acordo |
| --- | --- |
| Tempo de resposta | mensagens do grupo até o fim do dia; urgência por chamada |
| Horário de trabalho | ninguém precisa responder depois das 22h |
| Canal de cada assunto | dúvida de código no PR; combinado de equipe no grupo |
| O que é urgente | só "o sistema está fora do ar" é urgente |

📌 Esses combinados são parte da documentação do time (aula 5). Sem estarem escritos, cada um presume uma regra diferente.

# 🧑‍🏫 Mentorias

**Mentoria** é uma relação em que alguém com mais experiência ajuda outra pessoa a se desenvolver. Não é aula e não é fazer no lugar do outro.

| Mentoria é | Mentoria não é |
| --- | --- |
| orientar o caminho | entregar a resposta |
| fazer perguntas | dar ordens |
| compartilhar experiência (inclusive erros) | mostrar superioridade |
| contínua | evento único |

## 🙋 Como aproveitar uma mentoria

1. **Chegue com pergunta preparada.** "Como eu melhoro?" rende pouco; "revisei esta função três vezes e ainda acho confusa — como você organizaria?" rende muito.
2. **Mostre o que já tentou.** Dá ao mentor o ponto de partida certo.
3. **Anote.** Mentoria sem anotação se perde até a semana seguinte.
4. **Volte com o resultado.** "Apliquei o que você sugeriu, e aconteceu isto" é o que mantém a relação viva.

## 💬 Feedback

**Feedback** é informação sobre o efeito de um comportamento. Serve para a pessoa decidir o que manter e o que mudar.

### Como dar feedback

Use a estrutura **situação → comportamento → impacto**:

```
SITUAÇÃO:     Na entrega de ontem,
COMPORTAMENTO: você subiu o código sem rodar os testes,
IMPACTO:       e o time passou 40 minutos procurando um erro
               que o teste apontaria em 5 segundos.
```

Compare com "você é desorganizado": a primeira versão é verificável e dá o que fazer; a segunda é um rótulo e só gera defesa.

| Feedback útil | Feedback inútil |
| --- | --- |
| sobre comportamento | sobre a pessoa |
| específico, com situação | genérico |
| logo depois do fato | guardado por semanas |
| em particular, quando é crítica | em público, quando é crítica |
| aponta o impacto | só o incômodo de quem fala |

### Como receber feedback

1. **Ouça inteiro antes de responder.** O impulso de explicar é natural — segure.
2. **Pergunte por exemplo concreto** se não ficou claro.
3. **Separe o fato da sua identidade.** "Esse código ficou confuso" não é "você é um programador ruim".
4. **Agradeça.** Dar feedback honesto é desconfortável para quem dá também.
5. **Escolha uma coisa para mudar.** Feedback sem ação é conversa.

### Elogio também é feedback

E com a mesma regra da especificidade:

> ❌ "Mandou bem!"
>
> ✅ "Sua mensagem no PR explicou o motivo da mudança — eu revisei em 2 minutos em vez de 20."

A segunda versão ensina o que repetir.

# 🌱 Desenvolvimento contínuo

**Desenvolvimento contínuo** é a prática de aprender de forma constante e planejada, em vez de só quando a necessidade aparece.

## 📝 Plano de Desenvolvimento Individual (PDI)

Um PDI responde quatro perguntas:

```
1. Onde eu estou?      (minha situação hoje, honesta)
2. Onde quero chegar?  (objetivo concreto, com prazo)
3. O que me falta?     (a lacuna entre os dois)
4. O que vou fazer?    (ações com data)
```

Exemplo preenchido:

```markdown
## PDI — Bruno — 4º bimestre

ONDE ESTOU
Consigo criar rotas em Express, mas me perco quando preciso
tratar erro e acabo deixando tudo num try/catch gigante.

ONDE QUERO CHEGAR
Até o fim do bimestre, escrever um middleware de erro sozinho,
sem consultar o material da aula.

O QUE ME FALTA
Entender a ordem em que o Express executa os middlewares.

O QUE VOU FAZER
- [ ] Reler a aula 10 e refazer os exemplos .......... semana 1
- [ ] Aplicar middleware de erro no Projeto 7 ........ semana 2
- [ ] Pedir revisão desse trecho para a Ana .......... semana 2
- [ ] Explicar o conceito para alguém do time ........ semana 3
```

📌 O último item não é enfeite: **explicar é o teste real de que você entendeu**. Se você não consegue explicar, você decorou.

## 🎯 Objetivo bom x objetivo vago

| Vago | Bom |
| --- | --- |
| "quero melhorar em back-end" | "quero escrever um CRUD completo com fs sem consultar material" |
| "quero ser mais organizado" | "quero abrir PR com descrição em todas as entregas do bimestre" |
| "quero aprender mais" | "quero terminar a aula 14 e refazer os 3 exemplos" |

Um objetivo é bom quando dá para responder **sim ou não** se você o cumpriu.

# 📖 Conceitos importantes

| Conceito | Significado |
| --- | --- |
| Comunicação síncrona | todos ao mesmo tempo |
| Comunicação assíncrona | cada um no seu tempo |
| Daily | alinhamento curto e frequente do time |
| Combinado de resposta | acordo do time sobre prazos e canais |
| Mentoria | orientação de alguém mais experiente |
| Feedback | informação sobre o efeito de um comportamento |
| PDI | plano de desenvolvimento individual |

# ⚠️ Erros comuns

### ❌ "Oi, posso te fazer uma pergunta?" e nada mais

A pessoa responde "pode" e espera. Mande a pergunta completa de uma vez — em trabalho assíncrono, isso economiza horas.

### ❌ Reunião para informar

Informação cabe em mensagem. Reunião é para o que precisa de debate.

### ❌ Feedback sobre a pessoa, não sobre o comportamento

"Você é relaxado" não dá o que fazer. "O PR subiu sem teste" dá.

### ❌ PDI que não cabe na realidade

Dez objetivos num bimestre viram zero. Escolha um ou dois.

### ❌ Guardar feedback para o fim do bimestre

Feedback de dois meses atrás não muda nada — o trabalho já foi entregue.

Fim da aula!

_

# 🧩 Atividade Rápida

Individual ou em dupla, **usando o GitHub Copilot**, crie um formulário que obriga a escrever um bom pedido de ajuda e use para destravar **um problema real**.

> ⏱️ 15 minutos — 5 para construir, 10 de uso real.

**1. Construa (5 min)**

Exemplo de prompt:

```
Crie uma página HTML com JavaScript puro com um formulário de pedido de
ajuda com 5 campos: o que quero fazer, o que está acontecendo, onde, o
que já tentei e o que preciso de você. Não deixe enviar se algum campo
estiver vazio ou se "o que já tentei" tiver menos de 20 caracteres. Ao
enviar, mostre a mensagem formatada e um botão para copiar.
```

Confira: tente enviar só `"gente, não tá funcionando aqui, me ajuda"`. O sistema precisa **bloquear**.

**2. Use de verdade (10 min)**

- Escreva no formulário um pedido de ajuda **real** sobre algo que te travou nas atividades anteriores (ou em outra disciplina).
- Envie para um colega pelo chat da turma. Ele tenta ajudar **sem fazer nenhuma pergunta de volta**.
- Ele te devolve um feedback sobre o pedido no formato *situação → comportamento → impacto*.

**3. Responda**

- O colega precisou perguntar algo? Se sim, o que faltava no pedido?
- Qual foi o feedback recebido e **uma coisa** que você vai mudar no próximo pedido?
