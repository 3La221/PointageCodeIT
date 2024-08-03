from rest_framework.permissions import BasePermission

class IsCompanyAdmin(BasePermission):
    def has_permission(self, request, view):
        
        return bool (hasattr(request.user,'company_admin') or request.user.is_superuser)


