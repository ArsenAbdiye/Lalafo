# Generated by Django 5.2 on 2025-04-24 15:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0013_favorit'),
    ]

    operations = [
        migrations.CreateModel(
            name='SocialNetwork',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('social_network_name', models.CharField(max_length=30, verbose_name='Название социальной сети')),
                ('social_network_link', models.URLField(verbose_name='Ссылка социальной сети')),
            ],
            options={
                'verbose_name': 'Социальная сеть',
                'verbose_name_plural': 'Социальная сети',
            },
        ),
    ]
