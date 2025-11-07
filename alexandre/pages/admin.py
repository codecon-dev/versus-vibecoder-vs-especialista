from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Page


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    """Admin para gerenciar páginas"""
    list_display = ['title', 'user', 'is_main_page', 'parent_page', 'created_at', 'updated_at']
    list_filter = ['is_main_page', 'user', 'created_at']
    search_fields = ['title', 'content', 'user__username']
    readonly_fields = ['created_at', 'updated_at', 'slug']

    fieldsets = (
        ('Informações Básicas', {
            'fields': ('title', 'slug', 'user')
        }),
        ('Hierarquia', {
            'fields': ('is_main_page', 'parent_page')
        }),
        ('Conteúdo', {
            'fields': ('content',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user', 'parent_page')


# Customizar o User Admin para facilitar a gestão
class CustomUserAdmin(BaseUserAdmin):
    """Admin customizado para User"""
    list_display = ['username', 'email', 'is_staff', 'is_superuser', 'date_joined']

    def get_inline_instances(self, request, obj=None):
        return []


# Re-registrar User com o admin customizado
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

# Customizar títulos do admin
admin.site.site_header = "Notion Clone - Administração"
admin.site.site_title = "Notion Clone Admin"
admin.site.index_title = "Bem-vindo ao painel de administração"
