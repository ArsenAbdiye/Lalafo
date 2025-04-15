from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    usernickname = models.CharField(max_length=50,null=True, verbose_name='логин')
    username = models.CharField(max_length=50, unique=True, verbose_name='Имя')
    phone = models.CharField(max_length=15,null=True, unique=True, verbose_name='Телефон')
    email = models.EmailField(unique=True,null=True, verbose_name='Email')

    REQUIRED_FIELDS = []
    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def __str__(self):
        return f"{self.usernickname}"