from django.db import models

from apps.items.utils import directory_path

class SiteLogo(models.Model):
    header_logo = models.ImageField('Лого сайта', upload_to=directory_path)
    
    class Meta:
        verbose_name = 'Лого сайта'
        verbose_name_plural = 'Лого сайта'

    def __srt__(self):
        return f'Лого сайта {self.id}'


class BurgerCategory(models.Model):
    category_text = models.CharField(max_length=30,verbose_name='Текст бургер категории')

    class Meta:
        verbose_name = 'Категория бургера'
        verbose_name_plural = 'Категории бургера'


    def __str__(self):
        return self.category_text
    

class BurgerLinks(models.Model):
    link_text = models.CharField( max_length=30, verbose_name='Текст ссылок')
    url_link = models.URLField(verbose_name='Ссылка',null=True)
    category = models.ForeignKey(BurgerCategory, on_delete=models.CASCADE, related_name='link',blank=True)

    class Meta:
        verbose_name = 'Ссылка бургера'
        verbose_name_plural = 'Ссылки бургера'
    
    def __str__(self):
        return self.link_text
    

class Advertisments(models.Model):
    advertisment_image = models.ImageField('Реклама',upload_to=directory_path)
    advertisment_url = models.URLField(verbose_name='Ссылка рекламы')
    order = models.PositiveIntegerField("Порядок", default=1)

    class Meta:
        verbose_name = "Реклама"
        verbose_name_plural = "Рекламы"
        ordering = ("order",)

    def __str__(self):
        return  'реклама ' + str(self.order)


class FooterCopyright(models.Model):
    copyright = models.CharField(max_length=50,verbose_name='Копирайт')

    class Meta:
        verbose_name = "Копирайт"
        verbose_name_plural = "Копирайт"
    
    def __str__(self):
        return  self.copyright
    
    
class FooterSiteLinksCategory(models.Model):
    footer_category = models.CharField(max_length=20,verbose_name='Категория футера')

    class Meta:
        verbose_name = "Категория футера"  
        verbose_name_plural = "Категории футера"

    def __str__(self):
        return  self.footer_category
    

class FooterSiteLinks(models.Model):
    footer_link_text = models.CharField(max_length=20,verbose_name='Текст ссылка в футере')
    footer_link_url = models.URLField(verbose_name='Ссылка текста в футере')
    category = models.ForeignKey(FooterSiteLinksCategory, on_delete=models.CASCADE, related_name='link',blank=True)

    class Meta:
        verbose_name = "Ссылка футера"    
        verbose_name_plural = "Ссылки футера"
    
    def __str__(self):
        return  self.footer_link_text