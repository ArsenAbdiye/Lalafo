# Generated by Django 5.2 on 2025-04-17 09:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category_name', models.CharField(max_length=50, verbose_name='Название категории')),
                ('category_image', models.ImageField(upload_to='category_image', verbose_name='Картинка категории')),
            ],
            options={
                'verbose_name': 'Категория',
                'verbose_name_plural': 'Категория',
            },
        ),
        migrations.CreateModel(
            name='SubCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sub_category_name', models.CharField(max_length=50, verbose_name='Название категории')),
                ('sub_category_image', models.ImageField(null=True, upload_to='category_image', verbose_name='Картинка категории')),
                ('parent_category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subcategories', to='items.category', verbose_name='Родительская категория')),
            ],
            options={
                'verbose_name': 'Категория',
                'verbose_name_plural': 'Категория',
            },
        ),
        migrations.CreateModel(
            name='SubSubCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subsub_category_name', models.CharField(max_length=50, verbose_name='Название категории')),
                ('subsub_category_image', models.ImageField(null=True, upload_to='category_image', verbose_name='Картинка категории')),
                ('parent_subcategory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subsubcategories', to='items.subcategory', verbose_name='Родительская подкатегория')),
            ],
            options={
                'verbose_name': 'Категория',
                'verbose_name_plural': 'Категория',
            },
        ),
    ]
