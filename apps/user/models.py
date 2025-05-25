from datetime import timedelta
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from apps.items.utils import directory_path


class CustomUser(AbstractUser):
    user_image = models.ImageField('Изображение пользователя', upload_to=directory_path,null=True,blank=True)
    user_discription = RichTextField('Описание пользователя',null=True,blank=True)
    is_vip = models.BooleanField(default=False)
    is_pro = models.BooleanField(default=False)
    usernickname = models.CharField(max_length=50, null=True, verbose_name='логин')
    username = models.CharField(max_length=50, unique=True, verbose_name='Имя')
    phone = models.CharField(max_length=15, null=True, unique=True, verbose_name='Телефон')
    email = models.EmailField(unique=True, null=True, verbose_name='Email')
    
    is_google_user = models.BooleanField(default=False, verbose_name="Зарегистрирован через Google")

    REQUIRED_FIELDS = []  

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def __str__(self):
        return f"{self.usernickname}"

    def set_unusable_password(self):
        self.set_password(None)


class EmailVerificationCode(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=10)
