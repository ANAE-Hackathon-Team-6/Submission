from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):

    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("user", "User"),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="user")


class Activity(models.Model):
    id = models.AutoField(primary_key=True)
    code_pro = models.CharField(max_length=255)
    wilaya = models.CharField(max_length=255)
    field = models.TextField(max_length=255, null=True, blank=True)
    activity = models.TextField()
    sub_category = models.CharField(max_length=255, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activities")
    meta_ai = models.JSONField(default=dict)
    """{
    is_valid: bool 
    is_rundandant: bool
    is_rundandant_among_history: bool 
    most_similar:  string []
    ai_explanation: string
    redundant_activities: int[]
    redundant_activities_among_history:  int[]
    is_processed_by_human: bool
    description_refined: string
    activity__name_refined: string
    }
    """

    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Job(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="jobs")
    file = models.FileField(upload_to="jobs/")
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Notification(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    message = models.TextField()
    status = models.CharField(
        max_length=50,
        choices=[("read", "Read"), ("unread", "Unread")],
        default="unread",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
