# 🚀 Guia Rápido - Notion Clone

## Passos para rodar o projeto

### 1️⃣ Configurar o Supabase (IMPORTANTE!)

Antes de iniciar o projeto, execute no **Supabase SQL Editor**:

```sql
-- Cole todo o conteúdo do arquivo supabase-setup.sql
```

**Como fazer:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto (pbkxaeozwvakentamwgk)
3. Vá em **SQL Editor** (ícone de código no menu lateral)
4. Clique em **New Query**
5. Copie TODO o conteúdo de `supabase-setup.sql`
6. Cole na query
7. Clique em **Run** (ou pressione Ctrl+Enter)

### 2️⃣ Habilitar Email Authentication

1. No Supabase Dashboard, vá em **Authentication** (ícone de cadeado)
2. Clique em **Providers**
3. Encontre **Email** e ative o toggle
4. Salve as configurações

### 3️⃣ Rodar o projeto

```bash
npm run dev
```

### 4️⃣ Acessar

Abra: **http://localhost:3000**

---

## 🎯 Testando

1. **Criar conta**: Digite um email e senha na tela de login
2. **Criar documento**: Clique em "+ Novo Documento"
3. **Editar**: Clique no documento criado e comece a escrever
4. **Auto-save**: Escreva algo e aguarde 2 segundos - verá "✓ Salvo"

---

## ⚠️ Problemas Comuns

### Erro: "Failed to fetch" ou erro de autenticação
- ✅ Certifique-se de que executou o script SQL no Supabase
- ✅ Verifique se habilitou Email Authentication
- ✅ Confirme que o arquivo `.env.local` existe com as credenciais corretas

### Erro: "Permission denied" ao criar/editar documento
- ✅ Confirme que as políticas RLS foram criadas corretamente
- ✅ Re-execute o script SQL completo

### Página em branco
- ✅ Verifique o console do navegador (F12) para erros
- ✅ Certifique-se de que `npm run dev` está rodando sem erros

---

## 📊 Credenciais Supabase

Já configuradas em `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://pbkxaeozwvakentamwgk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

✅ Tudo pronto para usar!

