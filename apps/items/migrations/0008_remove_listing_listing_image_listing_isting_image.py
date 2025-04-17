# Generated by Django 5.2 on 2025-04-17 16:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0007_alter_listing_category'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='listing',
            name='listing_image',
        ),
        migrations.AddField(
            model_name='listing',
            name='isting_image',
            field=models.FileField(default=1, upload_to='listing_images/'),
            preserve_default=False,
        ),
    ]
