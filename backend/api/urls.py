from django.urls import path
from .views import ProductoListView, ProductoDetailView

urlpatterns = [
    path('productos/', ProductoListView.as_view(), name='lista-productos'),
    path('productos/<slug:slug>/', ProductoDetailView.as_view(), name='detalle-producto'),
]