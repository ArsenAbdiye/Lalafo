# Generated by Django 5.2 on 2025-04-14 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_alter_customuser_email_alter_customuser_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='usernickname',
            field=models.CharField(max_length=50, null=True, unique=True, verbose_name='логин'),
        ),
    ]
