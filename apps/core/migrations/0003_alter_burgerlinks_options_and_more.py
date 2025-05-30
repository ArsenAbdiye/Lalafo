# Generated by Django 5.2 on 2025-04-16 16:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_advertisments_footercopyright_footersitelinks_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='burgerlinks',
            options={'verbose_name': 'Ссылка бургера', 'verbose_name_plural': 'Ссылки бургера'},
        ),
        migrations.AlterModelOptions(
            name='footercopyright',
            options={'verbose_name': 'Копирайт', 'verbose_name_plural': 'Копирайт'},
        ),
        migrations.AlterModelOptions(
            name='sitelogo',
            options={'verbose_name': 'Лого сайта', 'verbose_name_plural': 'Лого сайта'},
        ),
        migrations.RemoveField(
            model_name='burgerlinks',
            name='is_social',
        ),
        migrations.RemoveField(
            model_name='footersitelinks',
            name='is_social',
        ),
        migrations.AlterField(
            model_name='burgerlinks',
            name='category',
            field=models.ForeignKey(blank=True, default=1, on_delete=django.db.models.deletion.CASCADE, related_name='link', to='core.burgercategory'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='footersitelinks',
            name='category',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='link', to='core.footersitelinkscategory'),
        ),
    ]
