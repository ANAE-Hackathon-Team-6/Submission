# Generated by Django 5.1.1 on 2025-02-21 22:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_activity_sub_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='field',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
