# Generated by Django 5.2 on 2025-05-20 15:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0032_citys_ad_option_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='ad',
            name='city',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='city', to='items.citys', verbose_name='city'),
            preserve_default=False,
        ),
    ]
