# Generated by Django 5.2 on 2025-06-03 15:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('items', '0036_ad_option'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ad',
            name='option',
        ),
        migrations.AddField(
            model_name='ad',
            name='options',
            field=models.ManyToManyField(blank=True, to='items.categoryoptions', verbose_name='Опции категорий'),
        ),
    ]
