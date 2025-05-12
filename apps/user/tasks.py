from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_reset_password_email(email, password):
    subject = "Ваш новый пароль"
    message = f"Ваш новый пароль: {password}"
    from_email = settings.EMAIL_HOST_USER
    try:
        send_mail(subject, message, from_email, [email])
        return "Письмо успешно отправлено"
    except Exception as e:
        return f"Ошибка: {str(e)}"
