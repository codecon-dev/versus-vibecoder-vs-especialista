# ✅ CHECKLIST - Notion Clone

## 📋 Execute estes passos na ordem:

### 1️⃣ Configurar Supabase Database
```
Status: ⏳ PENDENTE
```

**Ação necessária:**
- [ ] Acessar https://supabase.com/dashboard
- [ ] Ir em **SQL Editor** > **New Query**
- [ ] Copiar conteúdo do arquivo `supabase-setup.sql`
- [ ] Colar e executar (Run / Ctrl+Enter)
- [ ] Verificar mensagem de sucesso

**Arquivo:** `supabase-setup.sql` (já criado)

---

### 2️⃣ Habilitar Email Authentication
```
Status: ⏳ PENDENTE
```

**Ação necessária:**
- [ ] No Supabase Dashboard, ir em **Authentication**
- [ ] Clicar em **Providers**
- [ ] Ativar toggle do **Email** provider
- [ ] Salvar configurações

---

### 3️⃣ Verificar servidor Next.js
```
Status: ✅ RODANDO (background)
```

O servidor já está rodando em: **http://localhost:3000**

Se precisar reiniciar:
```bash
npm run dev
```

---

### 4️⃣ Testar a aplicação
```
Status: ⏳ AGUARDANDO PASSOS 1 e 2
```

**Como testar:**
1. [ ] Acessar http://localhost:3000
2. [ ] Criar conta com email e senha
3. [ ] Fazer login
4. [ ] Clicar em "+ Novo Documento"
5. [ ] Escrever algo no título e conteúdo
6. [ ] Aguardar 2 segundos
7. [ ] Ver "✓ Salvo" aparecer
8. [ ] Criar outro documento
9. [ ] Navegar entre documentos na sidebar
10. [ ] Testar logout

---

## 🎯 Resultado Esperado

Após completar os passos 1 e 2, você deverá ter:

✅ Tela de login funcionando  
✅ Cadastro de novos usuários  
✅ Dashboard com sidebar  
✅ Criação de documentos  
✅ Editor de texto funcionando  
✅ Auto-save automático  
✅ Navegação entre documentos  

---

## ⚠️ Se algo der errado:

### Erro ao criar documento
**Causa:** SQL não foi executado ou RLS não configurado  
**Solução:** Execute o passo 1️⃣ novamente

### Erro ao fazer login
**Causa:** Email provider não habilitado  
**Solução:** Execute o passo 2️⃣

### Página em branco
**Causa:** Servidor não está rodando  
**Solução:** Execute `npm run dev`

### Erro "Failed to fetch"
**Causa:** Credenciais do Supabase incorretas  
**Solução:** Verifique `.env.local`

---

## 📱 Arquivos de Ajuda Criados

- 📖 **README.md** - Documentação completa
- 🚀 **QUICKSTART.md** - Guia rápido
- 📝 **RESUMO-5-PROMPTS.md** - O que foi feito
- ✅ **CHECKLIST.md** - Este arquivo
- 🗄️ **supabase-setup.sql** - Script SQL

---

## 🎉 Quando estiver tudo OK:

Você terá um clone funcional do Notion criado em **apenas 5 prompts**!

**Features principais:**
- ✅ Sistema de login
- ✅ Múltiplos documentos
- ✅ Editor de texto
- ✅ Auto-save
- ✅ Segurança (RLS)

---

**Boa sorte no desafio CODECON!** 🚀

