from rest_framework import serializers
from .models import CustomUser
from apps.items.validators import validate_kg_phone_number
import requests
from django.contrib.auth import authenticate
from django.contrib.auth import password_validation
from django.contrib.auth import get_user_model


class RegisterWithPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('phone', 'username', 'usernickname', 'password')
        read_only_fields = ('username', 'usernickname')

    def validate_phone(self, value):
        return validate_kg_phone_number(value)

    def create(self, validated_data):
        phone = validated_data['phone']
        user = CustomUser(username=phone, phone=phone)
        user.set_password(validated_data.get('password'))
        user.save()
        user.usernickname = f"account{user.id}"
        user.save()
        return user
    

class RegisterWithGoogleSerializer(serializers.ModelSerializer):
    google_token = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('google_token',)

    def create(self, validated_data):
        google_token = validated_data['google_token']
        return self._create_user_with_google(google_token)

    def _create_user_with_google(self, google_token):
        url = 'https://www.googleapis.com/oauth2/v3/tokeninfo'
        response = requests.get(url, params={'id_token': google_token})

        if response.status_code != 200:
            raise serializers.ValidationError("Invalid Google token")

        google_data = response.json()

        user, created = CustomUser.objects.get_or_create(
            email=google_data['email'],
            defaults={
                'username': google_data['name'],
                'usernickname': google_data['name'],
                'is_google_user': True,
            }
        )

        if created:
            user.set_unusable_password()  
            user.save()

        return user
    

class GoogleLoginSerializer(serializers.Serializer):
    google_token = serializers.CharField()


class RegisterWithCodeSerializer(serializers.Serializer):
    code  = serializers.CharField()


class UserOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['user_image','usernickname','user_discription']




class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        if "@" in username:
            try:
                user_obj = CustomUser.objects.get(email=username)
                username = user_obj.phone
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError("Пользователь с таким email не найден.")

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Неверный логин или пароль.")
        data['user'] = user
        return data
    

class UpdatePhoneEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['phone', 'email']

    def validate_phone(self, value):
        value = validate_kg_phone_number(value)
        user = self.instance

        if CustomUser.objects.exclude(id=user.id).filter(phone=value).exists():
            raise serializers.ValidationError("Этот номер уже используется другим пользователем.")
        return value

    def validate_email(self, value):
        user = self.instance
        if value and CustomUser.objects.exclude(id=user.id).filter(email=value).exists():
            raise serializers.ValidationError("Этот email уже используется другим пользователем.")
        return value


    def update(self, instance, validated_data):
        phone = validated_data.get('phone')
        email = validated_data.get('email')

        if phone:
            instance.phone = phone
            instance.username = phone  

        if email:
            instance.email = email


        instance.save()
        return instance
    

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    new_password_confirm = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Текущий пароль указан неверно.")
        return value

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError("Новые пароли не совпадают.")
        password_validation.validate_password(data['new_password'], self.context['request'].user)
        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
    

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email не найден.")
        return value