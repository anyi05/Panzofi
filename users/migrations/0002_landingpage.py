# Generated by Django 5.1.5 on 2025-01-30 02:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='LandingPage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='landing_page/images/')),
                ('logo', models.ImageField(blank=True, null=True, upload_to='landing_page/logos/')),
            ],
        ),
    ]
