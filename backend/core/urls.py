from django.contrib import admin
from django.urls import path, include, reverse_lazy
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect

def admin_index_redirect(request):
    return redirect(reverse_lazy('admin:app_list', kwargs={'app_label': 'api'}))

urlpatterns = [
    path('admin/', admin_index_redirect),

    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('i18n/', include('django.conf.urls.i18n')),
]
