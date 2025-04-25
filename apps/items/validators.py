import phonenumbers
from phonenumbers.phonenumberutil import NumberParseException
from rest_framework.exceptions import ValidationError

def validate_kg_phone_number(value):
    if not value.startswith("+996"):
        raise ValidationError("Номер должен начинаться с +996.")
    try:
        parsed_number = phonenumbers.parse(value, "KG")
        if not phonenumbers.is_valid_number(parsed_number):
            raise ValidationError("Невалидный номер телефона.")
    except NumberParseException:
        raise ValidationError("Невозможно обработать номер телефона.")
    return value