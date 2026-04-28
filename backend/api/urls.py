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
    CrearPreferenciaPagoView,
    MercadoPagoWebhookView,
    # Vistas admin
    AdminDashboardView,
    AdminProductoListCreateView,
    AdminProductoDetailView,
    AdminImagenProductoView,
    AdminImagenProductoDeleteView,
    AdminCategoriaListCreateView,
    AdminCategoriaDetailView,
    AdminOrdenListView,
    AdminOrdenDetailView,
    AdminUsuarioListView,
    AdminLoginView,

)

router = routers.DefaultRouter()
router.register(r'favoritos', FavoritoViewSet, basename='favoritos')
router.register(r'carrito', CarritoViewSet, basename='carrito')
router.register(r'direcciones', DireccionViewSet, basename='direcciones')

urlpatterns = [
    # ---- AUTH ----
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/perfil/', UserProfileView.as_view(), name='perfil-usuario'),
    path('auth/registro/', RegisterView.as_view(), name='registro-usuario'),
    path('auth/password-reset-request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('auth/password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),

    # ---- CONTACTO ----
    path('contacto/', ContactFormView.as_view(), name='contacto'),

    # ---- PRODUCTOS ----
    path('productos/destacados/', ProductosDestacadosView.as_view(), name='productos-destacados'),
    path('productos/ofertas/', ProductosEnOfertaView.as_view(), name='productos-en-oferta'),
    path('productos/', ProductoListView.as_view(), name='lista-productos'),
    path('productos/<slug:slug>/', ProductoDetailView.as_view(), name='detalle-producto'),

    # ---- CATEGORÍAS ----
    path('categorias/', CategoriaListView.as_view(), name='lista-categorias'),
    path('categorias/<slug:slug>/productos/', ProductosPorCategoriaView.as_view(), name='productos-por-categoria'),

    # ---- ÓRDENES ----
    path('ordenes/', OrdenListCreateView.as_view(), name='listar-crear-ordenes'),
    path('ordenes/<int:pk>/', OrdenDetailView.as_view(), name='detalle-orden'),

    # ---- PAGOS ----
    path('pagos/crear-preferencia/', CrearPreferenciaPagoView.as_view(), name='crear-preferencia-pago'),
    path('pagos/webhook', MercadoPagoWebhookView.as_view(), name='mercado-pago-webhook'),

    # ---- ADMIN ----
    path('admin-api/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),

    path('admin-api/productos/', AdminProductoListCreateView.as_view(), name='admin-productos'),
    path('admin-api/productos/<int:pk>/', AdminProductoDetailView.as_view(), name='admin-producto-detail'),
    path('admin-api/productos/<int:producto_id>/imagenes/', AdminImagenProductoView.as_view(), name='admin-producto-imagenes'),
    path('admin-api/productos/<int:producto_id>/imagenes/<int:pk>/', AdminImagenProductoDeleteView.as_view(), name='admin-producto-imagen-delete'),

    path('admin-api/categorias/', AdminCategoriaListCreateView.as_view(), name='admin-categorias'),
    path('admin-api/categorias/<int:pk>/', AdminCategoriaDetailView.as_view(), name='admin-categoria-detail'),

    path('admin-api/ordenes/', AdminOrdenListView.as_view(), name='admin-ordenes'),
    path('admin-api/ordenes/<int:pk>/', AdminOrdenDetailView.as_view(), name='admin-orden-detail'),

    path('admin-api/login/', AdminLoginView.as_view(), name='admin-login'),

    path('admin-api/usuarios/', AdminUsuarioListView.as_view(), name='admin-usuarios'),

    # ---- ROUTER (favoritos, carrito, direcciones) ----
    path('', include(router.urls)),
]