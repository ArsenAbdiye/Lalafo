# Generated by Django 5.2 on 2025-05-22 17:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_rename_is_social_burgercategory_is_facebook_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='burgercategory',
            name='is_social',
            field=models.BooleanField(default=False),
        ),
    ]
