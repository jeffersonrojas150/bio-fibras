from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    ProductoListView, 
    ProductoDetailView, 
    CategoriaListView, 
    ProductosPorCategoriaView, 
    UserProfileView, 
    RegisterView,
    FavoritoViewSet
    )

router = routers.DefaultRouter()
router.register(r'favoritos', FavoritoViewSet, basename='favoritos')

urlpatterns = [
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/perfil/', UserProfileView.as_view(), name='perfil-usuario'),
    path('auth/registro/', RegisterView.as_view(), name='registro-usuario'),

    path('productos/', ProductoListView.as_view(), name='lista-productos'),
    path('productos/<slug:slug>/', ProductoDetailView.as_view(), name='detalle-producto'),
    path('categorias/', CategoriaListView.as_view(), name='lista-categorias'),
    path('categorias/<slug:slug>/productos/', ProductosPorCategoriaView.as_view(), name='productos-por-categoria'),

    path('', include(router.urls)),
]