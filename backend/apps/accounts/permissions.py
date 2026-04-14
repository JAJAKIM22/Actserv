from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin

class IsOwnerOrAdmin(BasePermission):
    """Used on file views — admin sees all, user sees own + shared."""
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin:
            return True
        # obj is a StoredFile instance
        return obj.owner == request.user or request.user in obj.shared_with.all()