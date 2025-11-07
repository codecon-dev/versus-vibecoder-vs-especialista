from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Page
import json


def signup_view(request):
    """View para cadastro de novos usuários"""
    if request.user.is_authenticated:
        return redirect('home')

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Criar página principal automaticamente
            Page.objects.create(
                user=user,
                title='Página Inicial',
                is_main_page=True,
                content=''
            )
            login(request, user)
            messages.success(request, 'Conta criada com sucesso!')
            return redirect('home')
    else:
        form = UserCreationForm()

    return render(request, 'pages/signup.html', {'form': form})


@login_required
def home_view(request):
    """View principal - redireciona para a página principal do usuário"""
    main_page = Page.objects.filter(user=request.user, is_main_page=True).first()

    if not main_page:
        # Criar página principal se não existir
        main_page = Page.objects.create(
            user=request.user,
            title='Página Inicial',
            is_main_page=True,
            content=''
        )
        # Recarregar do banco para ter o slug atualizado
        main_page.refresh_from_db()

    return redirect('page_detail', slug=main_page.slug)


@login_required
def page_detail_view(request, slug):
    """View para exibir uma página específica"""
    page = get_object_or_404(Page, slug=slug, user=request.user)

    # Buscar todas as páginas do usuário para o sidebar
    all_pages = Page.objects.filter(user=request.user).select_related('parent_page')

    context = {
        'page': page,
        'all_pages': all_pages,
    }

    return render(request, 'pages/page_detail.html', context)


@login_required
@require_POST
def page_save_view(request):
    """View para salvar conteúdo da página via AJAX"""
    try:
        data = json.loads(request.body)
        page_id = data.get('page_id')
        title = data.get('title', 'Sem título')
        content = data.get('content', '')

        page = get_object_or_404(Page, id=page_id, user=request.user)
        page.title = title
        page.content = content
        page.save()

        return JsonResponse({
            'success': True,
            'message': 'Página salva com sucesso!',
            'slug': page.slug
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=400)


@login_required
@require_POST
def page_create_view(request):
    """View para criar uma nova página filha via AJAX"""
    try:
        data = json.loads(request.body)
        parent_page_id = data.get('parent_page_id')
        title = data.get('title', 'Nova Página')

        parent_page = get_object_or_404(Page, id=parent_page_id, user=request.user)

        new_page = Page.objects.create(
            user=request.user,
            title=title,
            parent_page=parent_page,
            is_main_page=False,
            content=''
        )

        return JsonResponse({
            'success': True,
            'message': 'Página criada com sucesso!',
            'page_id': new_page.id,
            'page_slug': new_page.slug,
            'page_url': f'/page/{new_page.slug}/'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=400)
