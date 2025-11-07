Este projeto é um clone do do notions que deve ser feito em 2 horas aproximadamente. O desafio é que ele seja desenvolvido em até 5 promptos.

# descrição geral

O contexto base do projeto é: Criar um clone do Notion de uma maneira simples e rápida mas que contenha as seguintes características:

1 - O sistema deve ter um sistema de login, pode ser um login simplificado, ou seja, imagino que um usuário e senha normal usando o sistema de auth do próprio djanto

2 - O usuário quando logar ele vai iniciar na sua tela principal e partir dela que ele vai criar todo seu conteúdo, e sub-páginas.

3 - O sistema deve permitir que o usuário use um comando / para poder invocar funcionalidades rápidas como: 
    - criar um h1
    - criar um h2
    - criar um h3
    - criar uma lista de bullets
    - criar uma lista numerada
    - fazer uma citação
    - adicionar uma imagem
    - adicionar um embed de video
    - adicionar uma nova página

4 - o sistema deve permitir que ao criar uma nova página automaticamente uma nova entrada no bando de dados seja criada dinamicamente

5- o sistema precisa ter um controle de hierarquia de páginas, para sempre poder entender qual é a pagina mãe e as filhas de modo a poder nagegar facilmente entre elas.


# UX - Definições de Interface e usabilidade

- Pensando do lado do usuário, a primeira tela que ele terá acesso será a de auto cadastro. Ele deve pedir somente o email e a senha. Não precisa de validação de conta nem nada.

- Ao criar a conta e/ou ao logar, o usuário terá acessos ao sidebar que mostra a lista de página mãe e filhas por onde pode navegar entre elas.

- Quando acessa a primeira vez, a primeira página vem vazia, e instrui o usuário que se digitar / ele verá as principais opções.

- Quando ele digitar / deve aparecer um popup trazendo as opções que ele pode executar. Que serão:
/h1
/h2
/h3
/texto
/lista-topicos
/lista-numerada
/citacao
/imagem
/video
/pagina

- O sistema não precisa ter menu superior, é basicamente o menu lateral e a parte central onde haverá a área editável.

- A área central imagino usar um editor WYSIWYG de Markdown, então a cada comando /, por baixo dos panos a interface cria um markdown, mas automaticamente já mostra o conteúdo de maneira visível.

- quando o usuário faz um /pagina, o sistema cria uma nova página dinamicamente

- na parte superior da página sempre tem um botão de salvar, e um lugar para editar o título da página.

# Arquitetura

- Backend em Django, quero poder usar o django admin para gerenciar o que for necessário como administrador do sistema

- USar django Templates, HTML e CSS para construção do frontend serverside rendering.

- Banco de dados será SQLIte para facilitar o desenvolvimento rápido e com estrutura simplificada.

# Estrutura de dados

- USar o django Auth como base para autenticação.

- Haverá basicamente 2 entidades, a usuário (nativa do django) e a página.

- Um usuário pode ser somente de 2 tipos, administrador, que tem acessos ao Django admin, e usuário que tem acesso a aplicação.

- Página tem a seguinte estrutura
    - id: PK nativa do Model do Django
    - user: FK de usuário: para identificar a qual usuário pertence
    - isMainPage:  um boolean que determina se é a página raiz do usuário
    - page: uma FK de uma outra página para determinar se ela é filha de alguém. Esta hierarquia é feita para poder criar o menu lateral e navegabilidade entre as páginas e a sidebar.
    - title: titulo da página
    - slug: um slug da página que deve ser uma concatenação da self.pk + o slugfy do titulo da própria página
    - created_at:  datetime de criaçãpo
    - updated_at: datetime de atualização
    - content: o markdown do conteúdo completo da página

# Fluxos e definições importantes

- O usuário ao logar sempre vai cair na sua home, que é a sua isMainPage. 

- O usuário deverá sempre salvar a página para persistir os dados no banco de dados. 

- Quando o usuário criar um conteúdo com uma /pagina, um modal pergunta o titulo da nova página, ao usuário persistir o titulo o sistema cria a nova página, via endpoint/view no django, e como callback ele já persiste no markdown a url para a página filha. Este endpoint/view ja cria a página, determina que a página mãe e a origem de onde ela foi criada.

- o sistema inicialmente só aceita imagens por url externas, para não ter que lidar com processo de persistir arquivos inicialmente

- o sistema inicialmente só aceita videos do youtube e cria embeds automaticamente.

- a cada salvar das páginas o sistema já recarrega a página e atualiza o sidebar. Deve haver na estrutura de templates um template chamado "sidebar.html" que deve ser incluido no base.html que traga a estrutura de todas as páginas filhas em estrutura hierarquica deste cliente

- um usuário só pode ver as próprias páginas.


