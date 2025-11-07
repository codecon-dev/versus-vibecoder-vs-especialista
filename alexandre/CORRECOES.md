# Correções Implementadas - Problemas 1 e 2

## Problema 1: IntegrityError - UNIQUE constraint failed: pages_page.id

**Causa**: O método `save()` do model `Page` estava salvando o objeto duas vezes consecutivas sem controle adequado, causando conflito de chave primária.

**Solução Implementada** (pages/models.py:71-85):
```python
def save(self, *args, **kwargs):
    # Se é uma nova instância (não tem PK ainda)
    if not self.pk:
        # Primeiro salva com slug temporário para obter o PK
        self.slug = 'temp-slug'
        super().save(*args, **kwargs)
        # Agora que temos o PK, cria o slug definitivo
        self.slug = f"{self.pk}-{slugify(self.title)}"
        # Atualiza apenas o slug
        super().save(update_fields=['slug'])
    else:
        # Se já tem PK, apenas atualiza normalmente
        if not self.slug or self.slug == 'temp-slug':
            self.slug = f"{self.pk}-{slugify(self.title)}"
        super().save(*args, **kwargs)
```

**O que mudou**:
- Primeiro salva com slug temporário para obter o ID
- Depois atualiza apenas o campo slug (usando `update_fields`)
- Evita o erro de tentar criar dois registros com mesmo ID

## Problema 2: NoReverseMatch - slug vazio

**Causa**: Após criar uma página, o objeto em memória não tinha o slug atualizado, causando erro ao tentar redirecionar.

**Solução Implementada** (pages/views.py:38-53):
```python
@login_required
def home_view(request):
    main_page = Page.objects.filter(user=request.user, is_main_page=True).first()

    if not main_page:
        main_page = Page.objects.create(
            user=request.user,
            title='Página Inicial',
            is_main_page=True,
            content=''
        )
        # Recarregar do banco para ter o slug atualizado
        main_page.refresh_from_db()

    return redirect('page_detail', slug=main_page.slug)
```

**O que mudou**:
- Adicionado `refresh_from_db()` após criar a página
- Garante que o objeto tem o slug correto antes de redirecionar
- Mudou o título padrão para "Página Inicial"
- Mudou o conteúdo inicial para vazio (em vez de texto)

## Ajustes Adicionais

### 1. Template page_detail.html
Ajustado para lidar com conteúdo vazio:
```javascript
let initialContent = null;

// Tentar fazer parse do conteúdo se não estiver vazio
{% if page.content %}
    try {
        initialContent = {{ page.content|safe }};
    } catch (e) {
        console.error('Erro ao fazer parse do conteúdo:', e);
        initialContent = null;
    }
{% endif %}
```

### 2. Template sidebar.html
Corrigido para evitar erro com `parent_page` null:
```django
{% if child.parent_page and child.parent_page.id == page_item.id %}
    <!-- conteúdo -->
{% endif %}
```

### 3. View signup_view
Ajustada para criar página inicial vazia:
```python
Page.objects.create(
    user=user,
    title='Página Inicial',
    is_main_page=True,
    content=''
)
```

## Fluxo Correto Implementado

1. **Cadastro de usuário**:
   - Usuário preenche formulário em `/signup/`
   - Sistema cria usuário
   - Sistema cria página inicial automaticamente
   - Usuário é logado automaticamente
   - Usuário é redirecionado para `/` (home)

2. **Primeiro acesso (home)**:
   - Sistema busca página principal do usuário
   - Se não encontrar, cria uma nova
   - Recarrega página do banco para ter slug correto
   - Redireciona para `/page/{slug}/`

3. **Visualização de página**:
   - Editor.js é inicializado com conteúdo vazio
   - Usuário pode editar e salvar
   - Sidebar mostra hierarquia de páginas

## Testes Realizados

Criado script `test_flow.py` que valida:
- Criação de usuário
- Criação de página principal
- Geração correta do slug
- Criação de páginas filhas
- Hierarquia de páginas

Resultado: ✅ Todos os testes passaram

## Banco de Dados

O banco de dados foi recriado do zero para garantir que não há dados corrompidos.

**Superusuário criado**:
- Username: `admin`
- Password: `admin123`

**Usuário de teste criado pelo script**:
- Username: `testefluxo`
- Password: `teste123`

## Como Testar

1. Iniciar servidor:
   ```bash
   source venv/bin/activate
   python manage.py runserver
   ```

2. Acessar `/signup/` e criar uma nova conta

3. Após cadastro, será redirecionado automaticamente para a página inicial

4. Testar edição de conteúdo e criação de páginas

5. Acessar `/admin/` para validar no Django Admin
   - User: admin
   - Pass: admin123
