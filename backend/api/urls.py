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
    ProductosDestacadosView, 
    ProductosEnOfertaView,
    FavoritoViewSet,
    CarritoViewSet,
    DireccionViewSet,
    OrdenListCreateView,
    OrdenDetailView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    ContactFormView,
)

router = routers.DefaultRouter()
router.register(r'favoritos', FavoritoViewSet, basename='favoritos')
router.register(r'carrito', CarritoViewSet, basename='carrito')
router.register(r'direcciones', DireccionViewSet, basename='direcciones')

urlpatterns = [
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/perfil/', UserProfileView.as_view(), name='perfil-usuario'),
    path('auth/registro/', RegisterView.as_view(), name='registro-usuario'),

    path('auth/password-reset-request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('auth/password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),

    path('contacto/', ContactFormView.as_view(), name='contacto'),
    
    path('productos/destacados/', ProductosDestacadosView.as_view(), name='productos-destacados'),
    path('productos/ofertas/', ProductosEnOfertaView.as_view(), name='productos-en-oferta'),
    path('productos/', ProductoListView.as_view(), name='lista-productos'),
    path('productos/<slug:slug>/', ProductoDetailView.as_view(), name='detalle-producto'),
    path('categorias/', CategoriaListView.as_view(), name='lista-categorias'),
    path('categorias/<slug:slug>/productos/', ProductosPorCategoriaView.as_view(), name='productos-por-categoria'),

    path('ordenes/', OrdenListCreateView.as_view(), name='listar-crear-ordenes'),
    path('ordenes/<int:pk>/', OrdenDetailView.as_view(), name='detalle-orden'),

    path('', include(router.urls)),
]