# Notion Clone

Clone simplificado do Notion desenvolvido em Django com funcionalidades básicas de criação e edição de páginas hierárquicas.

## Características

- Sistema de autenticação (login/cadastro)
- Criação de páginas com hierarquia (páginas mãe e filhas)
- Editor WYSIWYG usando Editor.js
- Suporte a múltiplos tipos de conteúdo:
  - Cabeçalhos (H1, H2, H3)
  - Texto
  - Listas (bullets e numeradas)
  - Citações
  - Imagens (via URL externa)
  - Embeds de vídeo (YouTube, Vimeo)
  - Links para páginas filhas
- Sidebar com navegação hierárquica
- Django Admin para gerenciamento

## Tecnologias Utilizadas

- **Backend**: Django 5.2.8
- **Frontend**: Django Templates, Bootstrap 5, Editor.js
- **Banco de Dados**: SQLite
- **Python**: 3.11+

## Pré-requisitos

- Python 3.11 ou superior
- pip (gerenciador de pacotes Python)

## Instalação e Configuração

### 1. Clonar o repositório (ou usar o diretório atual)

```bash
cd /Users/xaero/work/oalexandre/notion-clone
```

### 2. Criar e ativar ambiente virtual

```bash
python3 -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
```

### 3. Instalar dependências

```bash
pip install -r requirements.txt
```

### 4. Executar migrações (se necessário)

As migrações já foram executadas, mas se precisar executar novamente:

```bash
python manage.py migrate
```

### 5. Criar superusuário (administrador)

```bash
python manage.py createsuperuser
```

Siga as instruções para criar seu usuário administrador.

**Nota**: Se você já limpou e recriou o banco de dados, pode criar rapidamente com:
```bash
DJANGO_SUPERUSER_PASSWORD=admin123 python manage.py createsuperuser --username admin --email admin@example.com --noinput
```
(Username: admin, Password: admin123)

### 6. Iniciar o servidor de desenvolvimento

```bash
python manage.py runserver
```

O servidor estará disponível em: `http://127.0.0.1:8000/`

## Uso

### Acesso à Aplicação

1. **Cadastro**: Acesse `http://127.0.0.1:8000/signup/` para criar uma nova conta
2. **Login**: Acesse `http://127.0.0.1:8000/login/` para fazer login
3. Após o login, você será redirecionado para sua página principal

### Funcionalidades do Editor

- **Salvar**: Clique no botão "Salvar" no canto superior direito ou use `Ctrl+S` (Windows/Linux) ou `Cmd+S` (Mac)
- **Comandos rápidos**: Digite `/` no editor para ver as opções disponíveis
- **Criar páginas filhas**: Use a função de criar nova página para adicionar subpáginas

### Django Admin

1. Acesse `http://127.0.0.1:8000/admin/`
2. Faça login com o superusuário criado
3. Gerencie usuários e páginas através do painel administrativo

## Estrutura do Projeto

```
notion-clone/
├── notion_clone/          # Configurações do projeto Django
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── pages/                 # App principal
│   ├── models.py         # Model Page
│   ├── views.py          # Views da aplicação
│   ├── admin.py          # Configuração do Django Admin
│   └── urls.py           # URLs do app
├── templates/            # Templates HTML
│   ├── base.html
│   ├── sidebar.html
│   └── pages/
│       ├── login.html
│       ├── signup.html
│       └── page_detail.html
├── static/               # Arquivos estáticos (CSS, JS)
├── venv/                 # Ambiente virtual Python
├── db.sqlite3           # Banco de dados SQLite
├── manage.py            # Script de gerenciamento Django
├── requirements.txt     # Dependências Python
└── README.md           # Este arquivo
```

## Models

### Page

- `user`: Usuário dono da página (FK)
- `is_main_page`: Boolean indicando se é página principal
- `parent_page`: FK para página mãe (null para páginas principais)
- `title`: Título da página
- `slug`: Slug único (gerado automaticamente: id-titulo)
- `content`: Conteúdo em formato JSON (Editor.js)
- `created_at`: Data de criação
- `updated_at`: Data de atualização

## Validação

### Testar a Aplicação

1. Crie um superusuário: `python manage.py createsuperuser`
2. Inicie o servidor: `python manage.py runserver`
3. Acesse o admin em `http://127.0.0.1:8000/admin/`
4. Faça login e verifique os models de Usuário e Página

### Criar Conta de Usuário Regular

1. Acesse `http://127.0.0.1:8000/signup/`
2. Crie uma conta
3. Você será automaticamente logado e redirecionado para sua página principal
4. Teste criar conteúdo e novas páginas

## Troubleshooting

### Erro de porta em uso

Se a porta 8000 estiver em uso, execute:

```bash
python manage.py runserver 8080
```

### Erro de dependências

Certifique-se de que o ambiente virtual está ativado:

```bash
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

### Erro de migrations

Execute novamente as migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Desenvolvimento Futuro

Possíveis melhorias:

- Upload de imagens local
- Compartilhamento de páginas entre usuários
- Pesquisa de conteúdo
- Histórico de versões
- Templates de página
- Exportação para Markdown/PDF
- Modo escuro

## Licença

Este é um projeto educacional desenvolvido como clone simplificado do Notion.
