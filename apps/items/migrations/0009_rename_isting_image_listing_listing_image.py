# Generated by Django 5.2 on 2025-04-17 17:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0008_remove_listing_listing_image_listing_isting_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='listing',
            old_name='isting_image',
            new_name='listing_image',
        ),
    ]
