from rest_framework import serializers
from .models import CustomUser


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('phone','username','usernickname','password')
        read_only_fields = ('username','usernickname')
    def create(self, validated_data):
        phone = validated_data['phone']

        user = CustomUser(username=phone,phone=phone)
        user.set_password(validated_data.get('password'))
        user.save()
        user.usernickname = f"account{user.id}"
        user.save()
        return user

