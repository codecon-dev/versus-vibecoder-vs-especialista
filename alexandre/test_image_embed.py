"""
Script para testar Image e Embed do Editor.js
"""
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'notion_clone.settings')
django.setup()

from django.contrib.auth.models import User
from pages.models import Page

print("=" * 70)
print("TESTE DE IMAGE E EMBED DO EDITOR.JS")
print("=" * 70)

# Buscar usuário de teste
user = User.objects.filter(username='testefluxo').first()

if not user:
    print("\n✗ Usuário de teste não encontrado. Criando...")
    user = User.objects.create_user(username='testefluxo', password='teste123')
    print(f"✓ Usuário criado: {user.username}")
else:
    print(f"\n✓ Usuário encontrado: {user.username}")

# Buscar página de teste ou criar nova
test_page = Page.objects.filter(user=user, title='Teste Image e Embed').first()

if not test_page:
    print("\n✓ Criando página de teste...")
    test_page = Page.objects.create(
        user=user,
        title='Teste Image e Embed',
        is_main_page=False,
        parent_page=Page.objects.filter(user=user, is_main_page=True).first(),
        content=''
    )
    test_page.refresh_from_db()
else:
    print(f"\n✓ Página de teste encontrada: {test_page.title}")

print(f"  - ID: {test_page.id}")
print(f"  - Slug: {test_page.slug}")

# Criar conteúdo de teste com Image e Embed
test_content = {
    "time": 1699000000000,
    "blocks": [
        {
            "id": "header1",
            "type": "header",
            "data": {
                "text": "Teste de Imagem e Embed",
                "level": 1
            }
        },
        {
            "id": "para1",
            "type": "paragraph",
            "data": {
                "text": "Este é um teste para validar que os plugins de Image e Embed estão funcionando corretamente."
            }
        },
        {
            "id": "header2",
            "type": "header",
            "data": {
                "text": "Teste de Imagem",
                "level": 2
            }
        },
        {
            "id": "image1",
            "type": "image",
            "data": {
                "url": "https://picsum.photos/800/400",
                "caption": "Imagem de teste do Lorem Picsum",
                "withBorder": False,
                "withBackground": False,
                "stretched": False
            }
        },
        {
            "id": "para2",
            "type": "paragraph",
            "data": {
                "text": "A imagem acima deve ser carregada do serviço Lorem Picsum (800x400)."
            }
        },
        {
            "id": "header3",
            "type": "header",
            "data": {
                "text": "Teste de Embed - YouTube",
                "level": 2
            }
        },
        {
            "id": "embed1",
            "type": "embed",
            "data": {
                "service": "youtube",
                "source": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "embed": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                "width": 580,
                "height": 320,
                "caption": "Vídeo do YouTube"
            }
        },
        {
            "id": "para3",
            "type": "paragraph",
            "data": {
                "text": "O vídeo acima deve ser exibido como embed do YouTube."
            }
        },
        {
            "id": "header4",
            "type": "header",
            "data": {
                "text": "Teste de Embed - Vimeo",
                "level": 2
            }
        },
        {
            "id": "embed2",
            "type": "embed",
            "data": {
                "service": "vimeo",
                "source": "https://vimeo.com/1084537",
                "embed": "https://player.vimeo.com/video/1084537",
                "width": 580,
                "height": 320,
                "caption": "Vídeo do Vimeo"
            }
        },
        {
            "id": "para4",
            "type": "paragraph",
            "data": {
                "text": "O vídeo acima deve ser exibido como embed do Vimeo."
            }
        },
        {
            "id": "list1",
            "type": "list",
            "data": {
                "style": "unordered",
                "items": [
                    "✓ Imagem deve carregar",
                    "✓ Embed do YouTube deve funcionar",
                    "✓ Embed do Vimeo deve funcionar",
                    "✓ Conteúdo deve persistir ao salvar"
                ]
            }
        }
    ],
    "version": "2.28.2"
}

print("\n" + "=" * 70)
print("SALVANDO CONTEÚDO DE TESTE")
print("=" * 70)

# Salvar conteúdo
test_page.content = json.dumps(test_content)
test_page.save()

print(f"\n✓ Conteúdo salvo com sucesso!")
print(f"  - Número total de blocos: {len(test_content['blocks'])}")
print(f"  - Blocos de imagem: 1")
print(f"  - Blocos de embed: 2 (YouTube + Vimeo)")

# Recarregar e validar
test_page.refresh_from_db()

print("\n" + "=" * 70)
print("VALIDANDO CONTEÚDO SALVO")
print("=" * 70)

if test_page.content:
    try:
        loaded_data = json.loads(test_page.content)
        print(f"\n✓ Conteúdo recuperado com sucesso!")
        print(f"  - Versão: {loaded_data.get('version', 'N/A')}")
        print(f"  - Número de blocos: {len(loaded_data.get('blocks', []))}")

        # Contar tipos de blocos
        block_types = {}
        for block in loaded_data.get('blocks', []):
            block_type = block['type']
            block_types[block_type] = block_types.get(block_type, 0) + 1

        print("\n  Tipos de blocos:")
        for block_type, count in block_types.items():
            print(f"    - {block_type}: {count}")

        # Validar bloco de imagem
        print("\n" + "=" * 70)
        print("VALIDANDO BLOCO DE IMAGEM")
        print("=" * 70)

        image_blocks = [b for b in loaded_data.get('blocks', []) if b['type'] == 'image']
        if image_blocks:
            img = image_blocks[0]
            print(f"\n✓ Bloco de imagem encontrado!")
            print(f"  - URL: {img['data']['url']}")
            print(f"  - Caption: {img['data'].get('caption', 'N/A')}")
            print(f"  - With Border: {img['data'].get('withBorder', False)}")
            print(f"  - With Background: {img['data'].get('withBackground', False)}")
        else:
            print("\n✗ Nenhum bloco de imagem encontrado!")

        # Validar blocos de embed
        print("\n" + "=" * 70)
        print("VALIDANDO BLOCOS DE EMBED")
        print("=" * 70)

        embed_blocks = [b for b in loaded_data.get('blocks', []) if b['type'] == 'embed']
        if embed_blocks:
            print(f"\n✓ {len(embed_blocks)} bloco(s) de embed encontrado(s)!")
            for i, embed in enumerate(embed_blocks, 1):
                print(f"\n  Embed {i}:")
                print(f"    - Serviço: {embed['data']['service']}")
                print(f"    - Source: {embed['data']['source']}")
                print(f"    - Embed URL: {embed['data']['embed']}")
                print(f"    - Dimensões: {embed['data'].get('width', 'N/A')}x{embed['data'].get('height', 'N/A')}")
                print(f"    - Caption: {embed['data'].get('caption', 'N/A')}")
        else:
            print("\n✗ Nenhum bloco de embed encontrado!")

        print("\n" + "=" * 70)
        print("✅ TESTE CONCLUÍDO COM SUCESSO!")
        print("=" * 70)

    except json.JSONDecodeError as e:
        print(f"\n✗ Erro ao fazer parse do JSON: {e}")
else:
    print("\n✗ Conteúdo vazio após salvar")

print("\n" + "=" * 70)
print("INSTRUÇÕES PARA TESTE NO NAVEGADOR")
print("=" * 70)

print(f"""
1. Inicie o servidor:
   python manage.py runserver

2. Acesse:
   http://127.0.0.1:8000/login/
   User: testefluxo
   Pass: teste123

3. Navegue até a página: {test_page.slug}
   URL: http://127.0.0.1:8000/page/{test_page.slug}/

4. Verifique se:
   ✓ A imagem do Lorem Picsum está visível
   ✓ O vídeo do YouTube está embedado
   ✓ O vídeo do Vimeo está embedado
   ✓ Todos os blocos são exibidos corretamente

5. Teste adicionar nova imagem:
   - Digite / e escolha "Image"
   - Cole URL: https://picsum.photos/600/300
   - Salve com Ctrl+S

6. Teste adicionar novo embed:
   - Digite / e escolha "Embed"
   - Cole URL do YouTube: https://www.youtube.com/watch?v=ScMzIvxBSi4
   - Salve com Ctrl+S

URLs de teste para Image:
  - https://picsum.photos/800/400
  - https://picsum.photos/600/300
  - https://via.placeholder.com/500x250

URLs de teste para Embed (YouTube):
  - https://www.youtube.com/watch?v=dQw4w9WgXcQ
  - https://www.youtube.com/watch?v=ScMzIvxBSi4
  - https://youtu.be/dQw4w9WgXcQ

URLs de teste para Embed (Vimeo):
  - https://vimeo.com/1084537
  - https://vimeo.com/148751763
""")

print("=" * 70)
