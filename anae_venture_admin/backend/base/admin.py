from django.contrib import admin
from .models import User, Activity, Job, Notification

admin.site.register(User)
admin.site.register(Activity)
admin.site.register(Job)
admin.site.register(Notification)
