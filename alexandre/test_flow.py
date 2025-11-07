"""
Script para testar o fluxo de criação de usuário e página
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'notion_clone.settings')
django.setup()

from django.contrib.auth.models import User
from pages.models import Page

# Criar usuário de teste
print("Criando usuário de teste...")
user = User.objects.create_user(username='testefluxo', password='teste123')
print(f"✓ Usuário criado: {user.username}")

# Criar página inicial
print("\nCriando página inicial...")
page = Page.objects.create(
    user=user,
    title='Página Inicial',
    is_main_page=True,
    content=''
)
print(f"✓ Página criada: {page.title}")
print(f"  - ID: {page.id}")
print(f"  - Slug: {page.slug}")
print(f"  - Is Main Page: {page.is_main_page}")
print(f"  - Parent Page: {page.parent_page}")

# Recarregar página do banco
page.refresh_from_db()
print(f"\n✓ Página após refresh_from_db():")
print(f"  - Slug: {page.slug}")

# Testar criação de página filha
print("\n\nCriando página filha...")
child_page = Page.objects.create(
    user=user,
    title='Minha Primeira Nota',
    parent_page=page,
    is_main_page=False,
    content='Conteúdo da primeira nota'
)
child_page.refresh_from_db()
print(f"✓ Página filha criada: {child_page.title}")
print(f"  - ID: {child_page.id}")
print(f"  - Slug: {child_page.slug}")
print(f"  - Parent Page: {child_page.parent_page.title}")

print("\n✅ Teste concluído com sucesso!")
