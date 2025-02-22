from rest_framework.permissions import BasePermission


class IsAuthenticatedForWrite(BasePermission):
    """
    Custom permission to only allow authenticated users to create, update, or delete jobs.
    """

    def has_permission(self, request, view):
        if request.method in ["GET"]:
            # Allow GET requests for everyone
            return True
        # Allow write permissions only to authenticated users
        return request.user and request.user.is_authenticated
