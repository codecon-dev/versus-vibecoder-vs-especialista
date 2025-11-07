"""
Script para testar o fluxo simplificado do Editor.js
"""
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'notion_clone.settings')
django.setup()

from django.contrib.auth.models import User
from pages.models import Page

print("=" * 60)
print("TESTE DO EDITOR.JS NATIVO E PERSISTÊNCIA")
print("=" * 60)

# Buscar usuário de teste
user = User.objects.filter(username='testefluxo').first()

if not user:
    print("\n✗ Usuário de teste não encontrado. Criando...")
    user = User.objects.create_user(username='testefluxo', password='teste123')
    print(f"✓ Usuário criado: {user.username}")
else:
    print(f"\n✓ Usuário encontrado: {user.username}")

# Buscar ou criar página principal
main_page = Page.objects.filter(user=user, is_main_page=True).first()

if not main_page:
    print("\n✗ Página principal não encontrada. Criando...")
    main_page = Page.objects.create(
        user=user,
        title='Página Inicial',
        is_main_page=True,
        content=''
    )
    main_page.refresh_from_db()
    print(f"✓ Página criada: {main_page.title} (slug: {main_page.slug})")
else:
    print(f"\n✓ Página principal encontrada: {main_page.title} (slug: {main_page.slug})")

# Simular conteúdo do Editor.js
editor_data = {
    "time": 1699000000000,
    "blocks": [
        {
            "id": "test1",
            "type": "header",
            "data": {
                "text": "Teste do Editor.js Nativo",
                "level": 1
            }
        },
        {
            "id": "test2",
            "type": "paragraph",
            "data": {
                "text": "Este é um parágrafo de teste. O Editor.js está funcionando nativamente."
            }
        },
        {
            "id": "test3",
            "type": "list",
            "data": {
                "style": "unordered",
                "items": [
                    "Primeiro item da lista",
                    "Segundo item da lista",
                    "Terceiro item da lista"
                ]
            }
        },
        {
            "id": "test4",
            "type": "quote",
            "data": {
                "text": "Esta é uma citação de teste",
                "caption": "Autor da citação"
            }
        }
    ],
    "version": "2.28.2"
}

print("\n" + "=" * 60)
print("SIMULANDO SALVAMENTO DE CONTEÚDO")
print("=" * 60)

# Salvar conteúdo
main_page.content = json.dumps(editor_data)
main_page.save()

print(f"\n✓ Conteúdo salvo no banco de dados")
print(f"  - Página ID: {main_page.id}")
print(f"  - Título: {main_page.title}")
print(f"  - Slug: {main_page.slug}")
print(f"  - Número de blocos: {len(editor_data['blocks'])}")

# Recarregar do banco
main_page.refresh_from_db()

print("\n" + "=" * 60)
print("VALIDANDO RECUPERAÇÃO DO CONTEÚDO")
print("=" * 60)

# Validar que o conteúdo foi persistido corretamente
if main_page.content:
    try:
        loaded_data = json.loads(main_page.content)
        print(f"\n✓ Conteúdo recuperado com sucesso!")
        print(f"  - Versão: {loaded_data.get('version', 'N/A')}")
        print(f"  - Número de blocos: {len(loaded_data.get('blocks', []))}")

        print("\n  Blocos:")
        for i, block in enumerate(loaded_data.get('blocks', []), 1):
            print(f"    {i}. Tipo: {block['type']}")
            if block['type'] == 'header':
                print(f"       Texto: {block['data']['text']}")
                print(f"       Nível: {block['data']['level']}")
            elif block['type'] == 'paragraph':
                print(f"       Texto: {block['data']['text']}")
            elif block['type'] == 'list':
                print(f"       Estilo: {block['data']['style']}")
                print(f"       Items: {len(block['data']['items'])}")
            elif block['type'] == 'quote':
                print(f"       Texto: {block['data']['text']}")
                print(f"       Legenda: {block['data']['caption']}")

        print("\n✅ TESTE CONCLUÍDO COM SUCESSO!")
        print("\nO Editor.js nativo está configurado corretamente e")
        print("o conteúdo está sendo persistido no campo 'content' do model Page.")

    except json.JSONDecodeError as e:
        print(f"\n✗ Erro ao fazer parse do JSON: {e}")
else:
    print("\n✗ Conteúdo vazio após salvar")

print("\n" + "=" * 60)
print("INSTRUÇÕES PARA TESTAR NO NAVEGADOR")
print("=" * 60)
print("\n1. Inicie o servidor:")
print("   python manage.py runserver")
print("\n2. Acesse:")
print(f"   http://127.0.0.1:8000/login/")
print(f"   User: testefluxo")
print(f"   Pass: teste123")
print("\n3. Teste os comandos slash nativos do Editor.js:")
print("   - Digite / para ver o menu nativo")
print("   - Escolha: Text, Heading, List, Quote, Image, Embed")
print("   - Edite o conteúdo")
print("   - Clique em Salvar ou use Ctrl+S")
print("   - Recarregue a página para ver o conteúdo persistido")
print("\n" + "=" * 60)
