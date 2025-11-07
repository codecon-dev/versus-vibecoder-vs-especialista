from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class Page(models.Model):
    """
    Model para representar páginas do clone do Notion.
    Cada página pertence a um usuário e pode ter uma hierarquia (página mãe/filhas).
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='pages',
        verbose_name='Usuário'
    )

    is_main_page = models.BooleanField(
        default=False,
        verbose_name='É Página Principal?',
        help_text='Define se esta é a página raiz do usuário'
    )

    parent_page = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name='Página Mãe',
        help_text='Página mãe na hierarquia (null se for página principal)'
    )

    title = models.CharField(
        max_length=255,
        verbose_name='Título',
        default='Sem título'
    )

    slug = models.SlugField(
        max_length=300,
        unique=True,
        blank=True,
        verbose_name='Slug'
    )

    content = models.TextField(
        blank=True,
        verbose_name='Conteúdo',
        help_text='Conteúdo em Markdown da página'
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Criado em'
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Atualizado em'
    )

    class Meta:
        verbose_name = 'Página'
        verbose_name_plural = 'Páginas'
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} ({self.user.username})"

    def save(self, *args, **kwargs):
        # Se é uma nova instância (não tem PK ainda)
        if not self.pk:
            # Primeiro salva sem o slug para obter o PK
            self.slug = 'temp-slug'  # Slug temporário
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

    def get_hierarchy_level(self):
        """Retorna o nível hierárquico da página (0 = raiz)"""
        level = 0
        page = self
        while page.parent_page:
            level += 1
            page = page.parent_page
        return level

    def get_children_recursive(self):
        """Retorna todas as páginas filhas recursivamente"""
        children = []
        for child in self.children.all():
            children.append(child)
            children.extend(child.get_children_recursive())
        return children
