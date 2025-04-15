from django.db import models


class HeaderLogo(models.Model):
    header_logo = models.ImageField('Лого хедера', upload_to='header_logo')
    
    class Meta:
        verbose_name = 'Лого хедера'
        verbose_name_plural = 'Логи хедера'

    def __srt__(self):
        return f'Лого хедера {self.id}'


class BurgerCategory(models.Model):
    category_text = models.CharField(max_length=30,verbose_name='Текст категории')

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'


    def __str__(self):
        return self.category_text

class BurgerLinks(models.Model):
    link_text = models.CharField( max_length=30, verbose_name='Текст ссылок')
    url_link = models.URLField(verbose_name='Ссылка')
    category = models.ForeignKey(BurgerCategory, on_delete=models.CASCADE, related_name='link',blank=True,null=True)

    class Meta:
        verbose_name = 'Ссылка'
        verbose_name_plural = 'Ссылки'
    
    def __str__(self):
        return self.link_text