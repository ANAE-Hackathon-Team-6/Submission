from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.documentation import include_docs_urls
from drf_spectacular.views import SpectacularAPIView
from base.views.views import LogOut

urlpatterns = [
    path("docs/", include_docs_urls(title="My API Docs")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("admin/", admin.site.urls),
    path("api/", include("base.urls")),
    path("api-auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api-auth/logout", LogOut.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]


# Properly append the static URL patterns for serving media files in development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
