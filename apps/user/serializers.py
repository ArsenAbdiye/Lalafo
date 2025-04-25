from rest_framework import serializers
from .models import CustomUser
from apps.items.validators import validate_kg_phone_number

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('phone','username','usernickname','password')
        read_only_fields = ('username','usernickname')

    def validate_phone(self,value):
        return validate_kg_phone_number(value)

    def create(self, validated_data):
        phone = validated_data['phone']
        user = CustomUser(username=phone,phone=phone)
        user.set_password(validated_data.get('password'))
        user.save()
        user.usernickname = f"account{user.id}"
        user.save()
        return user

class UserChageNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['usernickname']
