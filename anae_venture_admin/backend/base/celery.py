from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.base")


app = Celery("base")

app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks(["base.sockets.tasks"])
