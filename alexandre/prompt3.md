Consegui criar um novo usuário e ao acessar o / depois de logar ele direcionou a mainPage do usuário.

Porém observei que houveram alguns problemas:

## problema 1

Primeiramente que ao carregar a página inicial do usuário ele mostra a página incial, porém no console ele apresenta o seguinte erro:

3-pagina-inicial/:217 Uncaught ReferenceError: List is not defined
    at initEditor (3-pagina-inicial/:217:24)

favicon.ico:1 
 GET http://127.0.0.1:8000/favicon.ico 404 (Not Found)
﻿


## problema 2

Ao tentar editar o titulo da página pelo input abaixo:
<input type="text" class="page-title-editor" id="page-title" value="Página Inicial" placeholder="Sem título">

E ao clicar em salvar no botão abaixo:
<button class="btn btn-primary save-btn" id="save-btn"><i class="bi bi-save"></i> Salvar</button>

Obtive o seguinte erro:

3-pagina-inicial/:298 Erro ao salvar: TypeError: Cannot read properties of undefined (reading 'save')
    at HTMLButtonElement.savePage (3-pagina-inicial/:274:41)
savePage @ 3-pagina-inicial/:298Understand this error

.


# Atividades a serem executadas

Criar um plano e executá-lo de modo a atingir os objetivos abaixo no projeto

1 - Corrigir os problemas 1 e 2 citados anteriormente
2 - Garantir que abrir a página inicial o editor esteja funcionando
3 - garantir que o popup apareça em tela quando o usuário digitar "/" na área do editor e traga as opções definidas no contexto.md
4 - Focar inicialmente em fazer funcionar os comands "/" baixo:
    /h1
    /h2
    /h3
    /texto
    /lista-topicos
    /lista-numerada
    /citacao
    /imagem
    /video
5 - garantir que o botão salvar esteja funcional.


Usar o context7 para validar a documentação do django e do bootstrapp e do editorjs. Caso não tenha acesso a documentaçõa do editorjs pode usar o link de sua documentação abaixo:
https://editorjs.io/base-concepts/