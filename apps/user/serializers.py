from rest_framework import serializers
from .models import CustomUser

import phonenumbers
from phonenumbers import geocoder, carrier, NumberParseException

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('phone','username','usernickname','password')
        read_only_fields = ('username','usernickname')

    def validate_phone(self,value):
        if not value.startswith("+996"):
            raise serializers.ValidationError("Номер должен начинаться с +996.")
        try:
            parsed_number = phonenumbers.parse(value, "KG")
            if not phonenumbers.is_valid_number(parsed_number):
                raise serializers.ValidationError("Невалидный номер телефона.")
            
        except NumberParseException:
            raise serializers.ValidationError("Невозможно обработать номер телефона.")

        return value

    def create(self, validated_data):
        phone = validated_data['phone']
        user = CustomUser(username=phone,phone=phone)
        user.set_password(validated_data.get('password'))
        user.save()
        user.usernickname = f"account{user.id}"
        user.save()
        return user

