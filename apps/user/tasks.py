from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from apps.user.models import CustomUser

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


@shared_task
def send_verification_email_task(user_id, code):
    try:
        user = CustomUser.objects.get(id=user_id)
        send_mail(
            subject='Код подтверждения регистрации',
            message=f'Ваш код подтверждения: {code}',
            from_email='noreply@example.com',
            recipient_list=[user.email],
        )
    except CustomUser.DoesNotExist:
        pass

@shared_task
def cleanup_expired_codes():
    from .models import EmailVerificationCode
    from django.utils import timezone
    from datetime import timedelta

    expiration_time = timezone.now() - timedelta(minutes=10)
    EmailVerificationCode.objects.filter(created_at__lt=expiration_time).delete()