from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    """
    Solo permite acceso a usuarios con is_staff=True o is_superuser=True.
    """
    message = "No tienes permisos de administrador para realizar esta acción."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.is_staff or request.user.is_superuser)
        )