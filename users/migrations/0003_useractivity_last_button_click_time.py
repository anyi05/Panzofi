# Generated by Django 5.1.5 on 2025-01-30 06:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_landingpage'),
    ]

    operations = [
        migrations.AddField(
            model_name='useractivity',
            name='last_button_click_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
