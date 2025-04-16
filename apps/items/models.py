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
        return self.name