from django.urls import path, path
from . import consumers

websocket_urlpatterns = [
    path(r"processor/", consumers.FileConsumer.as_asgi()),
]
