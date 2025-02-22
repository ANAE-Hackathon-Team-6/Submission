from django.urls import path, include

from base.sockets.views import UploadFileAPIView
from .views.users import Me
from .views.activities import ActivityAPIView
from .views.views import (
    UserListCreate,
    UserDetail,
)

user_patterns = [
    path("", UserListCreate.as_view(), name="user-list-create"),
    path("<int:pk>/", UserDetail.as_view(), name="user-detail"),
    path("me/", Me.as_view(), name="me"),
]

files_patterns = [
    path("upload/", UploadFileAPIView.as_view(), name="upload-file"),
]


activity_patterns = [
    path("", ActivityAPIView.as_view(), name="activities"),
    path("<int:activity_id>/", ActivityAPIView.as_view(), name="activity_detail"),
]

urlpatterns = [
    path("users/", include((user_patterns, "users"))),
    path("files/", include((files_patterns, "files"))),
    path("activities/", include((activity_patterns, "activities"))),
]
