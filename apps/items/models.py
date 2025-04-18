from django.db import models
from ckeditor.fields import RichTextField


class InfoPages(models.Model):
    page_title = models.CharField('Заголовок страницы', max_length=100)
    page_text = RichTextField('Текст страницы')

    class Meta:
        verbose_name = "Инфо страница"
        verbose_name_plural = "Инфо страницы"
    def __str__(self):
        return self.page_title
    

class Category(models.Model):
    category_name = models.CharField(max_length=50,verbose_name='Название категории')
    category_image = models.ImageField('Картинка категории', upload_to='category_image')

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категория"

    def __str__(self):  
        return self.category_name
    

class SubCategory(models.Model):
    sub_category_name = models.CharField(max_length=50,verbose_name='Название подкатегории')
    sub_category_image = models.ImageField('Картинка категории', upload_to='category_image', null=True,blank=True)
    parent_category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories', verbose_name='Родительская категория')
    class Meta:
        verbose_name = "Подкатегория"
        verbose_name_plural = "Подкатегории"

    def __str__(self):  
        return self.sub_category_name
    

class SubSubCategory(models.Model):
    subsub_category_name = models.CharField(max_length=50,verbose_name='Название под-подкатегории')
    subsub_category_image = models.ImageField('Картинка категории', upload_to='category_image', null=True,blank=True)
    parent_subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name='subsubcategories', verbose_name='Родительская подкатегория')

    class Meta:
        verbose_name = "Под-подкатегория"
        verbose_name_plural = "Под-подкатегории"

    def __str__(self):  
        return self.subsub_category_name
    


class CategoryOptions(models.Model):
    option_title = models.CharField(max_length=50,verbose_name="Зголовок опции")
    subsub_category = models.ForeignKey(SubSubCategory, on_delete=models.CASCADE, related_name='subsubcategories', verbose_name='под-подкатегории')
    self_completion = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Опция категории"
        verbose_name_plural = "Опции категории"

    def __str__(self):  
        return self.option_title
    

class CategoryOptionsFields(models.Model):
    option_field = models.CharField(max_length=50,verbose_name='Поле опции')
    option = models.ForeignKey(CategoryOptions, on_delete=models.CASCADE, related_name='category_option', verbose_name='Опция')

    class Meta:
        verbose_name = "Поля категории"
        verbose_name_plural = "Поля категории"

    def __str__(self):  
        return self.option_field
    

class Listing(models.Model):
    listing_image = models.FileField(upload_to='listing_images/')
    description = models.TextField(max_length=6000, verbose_name="Описание")
    category = models.IntegerField(verbose_name="Id категории")
    price = models.DecimalField(max_digits=12, decimal_places=2,verbose_name="Цена")
    currency = models.CharField(max_length=3, choices=[('KGS', 'KGS'), ('USD', 'USD')], default='KGS', verbose_name="Валюта")
    contact_name = models.CharField(max_length=100, verbose_name="Имя")
    phone_number = models.CharField(max_length=20, verbose_name="Телефон",blank=True,null=True)
    hide_phone = models.BooleanField(default=False, verbose_name="Скрыть номер")
    created_at = models.DateTimeField(auto_now_add=True)
    option_fields = models.JSONField(default=dict, verbose_name="Поля опций")