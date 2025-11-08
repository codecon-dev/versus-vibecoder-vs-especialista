# Notion Clone Minimalista

Clone minimalista do Notion desenvolvido em **5 prompts** para o desafio CODECON.

## 🚀 Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth + Database)

## 📋 Funcionalidades

### ✅ Sistema de Autenticação
- Login/Cadastro com Supabase Auth UI
- Logout funcional
- Row Level Security (RLS)

### ✅ Gerenciamento de Documentos
- Sidebar com navegação entre documentos
- Botão "+ Novo Documento"
- **🗑️ Deletar documentos** (hover para mostrar ícone)
- Seleção visual do documento ativo
- **📁 Hierarquia de páginas** (parent-child)
- **🎵 Menu sanfona** (expandir/colapsar subpáginas)
- **🗺️ Breadcrumbs de navegação** (caminho completo clicável)
- **➕ Botão "+Subpágina"** no documento

### ✅ Editor Avançado
- Campo de título e área de conteúdo
- Auto-save com debounce de 2 segundos
- **⌨️ Comando "/" com autocomplete de blocos**
- **🎨 8 tipos de blocos formatados:**
  - 📝 Título 1, 2 e 3
  - • Lista com marcadores
  - 1. Lista numerada
  - 💬 Citação
  - — Divisor
  - **📄 Subpágina (novo!)** - Cria subpágina inline

### ✅ Preview Markdown & Split View
- **⚡ 3 Modos de Visualização:**
  - ✏️ **Editar** - Modo tradicional (só editor)
  - ⚡ **Split** - Editor + Preview lado a lado (50/50)
  - 👁️ **Preview** - Só visualização
- **Preview ao vivo** - Atualiza instantaneamente enquanto digita
- Renderização completa de Markdown em HTML
- **10+ elementos suportados:**
  - Headers (H1, H2, H3)
  - Listas (marcadores e numeradas)
  - Citações (blockquote)
  - Divisores (hr)
  - Formatação inline (**negrito**, *itálico*, `código`)
- Estilos profissionais e legíveis
- Layout responsivo com scroll independente

### ✅ Navegação por Teclado
- ↑ / ↓ para navegar no menu de blocos
- Enter para selecionar
- Esc para fechar

## 🛠️ Instalação e Uso

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

Execute o script SQL no **Supabase SQL Editor**:

1. Acesse: https://supabase.com/dashboard
2. Vá em **SQL Editor** > **New Query**
3. Cole e execute o conteúdo do arquivo `supabase-setup.sql`

### 3. Habilitar Email Authentication

1. No Supabase Dashboard, vá em **Authentication** > **Providers**
2. Habilite **Email** provider
3. Configure as opções conforme necessário

### 4. Rodar o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📁 Estrutura do Projeto

```
/
├── app/
│   ├── page.tsx              # Página de login
│   ├── dashboard/page.tsx    # Dashboard (sidebar + editor)
│   ├── layout.tsx            # Layout principal
│   └── globals.css           # Estilos globais
├── lib/
│   └── supabase.ts           # Cliente Supabase
├── supabase-setup.sql        # Script SQL para configurar o banco
├── .env.local                # Credenciais do Supabase
└── README.md
```

## 🗄️ Banco de Dados

### Tabela: `documents`

| Campo        | Tipo      | Descrição                    |
|--------------|-----------|------------------------------|
| id           | UUID      | ID único do documento        |
| user_id      | UUID      | ID do usuário (FK)           |
| title        | TEXT      | Título do documento          |
| content      | TEXT      | Conteúdo do documento        |
| created_at   | TIMESTAMP | Data de criação              |
| updated_at   | TIMESTAMP | Data da última atualização   |

### Políticas RLS

- Usuários podem **visualizar** apenas seus próprios documentos
- Usuários podem **inserir** apenas seus próprios documentos
- Usuários podem **atualizar** apenas seus próprios documentos
- Usuários podem **deletar** apenas seus próprios documentos

## 🎯 Como Usar

1. **Criar conta**: Na tela de login, insira seu email e crie uma senha
2. **Fazer login**: Entre com suas credenciais
3. **Criar documento**: Clique em "+ Novo Documento" na sidebar
4. **Editar**: Clique em um documento para abrir o editor
5. **Escrever**: Digite o título e conteúdo - salva automaticamente a cada 2 segundos

## ⚡ Funcionalidades Implementadas

### Autenticação
- Login/Cadastro com Supabase Auth UI
- Proteção de rotas
- Logout

### Sidebar
- Lista de todos os documentos do usuário
- Ordenação por data de criação (mais recentes primeiro)
- Seleção de documento ativo
- Botão para criar novo documento
- Exibição do email do usuário logado

### Editor
- Campo de título (auto-resize)
- Área de texto para conteúdo
- Auto-save com debounce de 2 segundos
- Indicador visual de status: "Salvando..." / "✓ Salvo"
- Interface limpa e minimalista

## 🔒 Segurança

- **Row Level Security (RLS)** ativado
- Políticas que garantem isolamento de dados por usuário
- Auth token gerenciado pelo Supabase
- Middleware para proteção de rotas

## 📝 Status do Projeto

### ✅ Implementado (PROMPT 1-5) - COMPLETO!
- ✅ Sistema de autenticação completo
- ✅ Gerenciamento de documentos (criar, editar, deletar)
- ✅ Editor com comando "/" e blocos formatados
- ✅ Auto-save inteligente
- ✅ Row Level Security (RLS)
- ✅ Preview Markdown com renderização profissional
- ✅ Renderização de 10+ elementos Markdown
- ✅ Hierarquia completa de páginas (parent-child)
- ✅ Menu sanfona recursivo na sidebar
- ✅ Breadcrumbs de navegação clicáveis
- ✅ Comando /page para criar subpáginas
- ✅ Botão +Subpágina no documento
- ✅ **3 Modos de visualização (Editar/Split/Preview)**
- ✅ **Split view com preview ao vivo**
- ✅ **Feedback instantâneo enquanto digita**

### 🎯 Possíveis Melhorias Futuras (Além do Desafio)
- Busca de documentos
- Duplicar e exportar documentos
- Atalhos de teclado globais
- Modo escuro
- Sincronização realtime  

## 🎓 Desafio CODECON

Este projeto foi desenvolvido como parte do desafio CODECON, que consiste em criar um clone do Notion usando **apenas 5 prompts**.

### Prompts Utilizados:
1. ✅ **Setup + Autenticação + Sidebar + Editor + Auto-save**
   - Projeto Next.js completo
   - Supabase integrado
   - SQL com RLS
   - Login funcional
   - Editor básico
   
2. ✅ **Editor Melhorado + Deletar**
   - Comando "/" com autocomplete
   - 7 tipos de blocos formatados
   - Deletar documentos
   - Navegação por teclado
   
3. ✅ **Preview Markdown + Correções**
   - Correção do dropdown "/"
   - Toggle Edição/Preview
   - Parser Markdown
   - 10+ elementos renderizados
   - Estilos profissionais
   
4. ✅ **Hierarquia + Comando /page**
   - Campo parent_id (migration SQL)
   - Menu sanfona recursivo
   - Breadcrumbs navegáveis
   - Comando /page cria subpáginas
   - Botão +Subpágina
   - Indentação visual por nível
   
5. ✅ **Split View + Preview Live** (FINAL!)
   - 3 modos de visualização
   - Split view 50/50
   - Preview ao vivo instantâneo
   - Layout responsivo
   - Todas funcionalidades preservadas

---

Desenvolvido com ❤️ para o desafio CODECON

