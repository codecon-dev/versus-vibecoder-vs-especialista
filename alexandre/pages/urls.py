from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('page/<slug:slug>/', views.page_detail_view, name='page_detail'),
    path('api/page/save/', views.page_save_view, name='page_save'),
    path('api/page/create/', views.page_create_view, name='page_create'),
]
