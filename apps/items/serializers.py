from rest_framework import serializers
from .models import *

import phonenumbers
from phonenumbers import NumberParseException

class InfoPagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoPages
        fields = ['page_title','page_text','id']


class SubSubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubSubCategory
        fields = ['id', 'subsub_category_name', 'subsub_category_image']


class SubCategorySerializer(serializers.ModelSerializer):
    subsubcategories = SubSubCategorySerializer(many=True,read_only=True)
    class Meta:
        model = SubCategory
        fields = ['id', 'sub_category_name', 'sub_category_image','subsubcategories']


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True,read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'category_name', 'category_image','subcategories']


class CategoryOptionsFieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryOptionsFields
        fields = ['id', 'option_field']


class CategoryOptionsSerializer(serializers.ModelSerializer):
    category_option = CategoryOptionsFieldsSerializer(many=True, read_only=True)

    class Meta:
        model = CategoryOptions
        fields = ['id', 'option_title', 'category_option']


class ListingSerializer(serializers.ModelSerializer):
    favorites_count = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = ['listing_image', 'description', 'category', 'price',
                'currency', 'contact_name', 'phone_number', 'hide_phone',
                'created_at', 'option_fields','user','favorites_count']



    def get_favorites_count(self, obj):
        return obj.favorited_by.count()
    
    def validate_phone_number(self,value):
        if not value.startswith("+996"):
            raise serializers.ValidationError("Номер должен начинаться с +996.")
        try:
            parsed_number = phonenumbers.parse(value, "KG")
            if not phonenumbers.is_valid_number(parsed_number):
                raise serializers.ValidationError("Невалидный номер телефона.")
            
        except NumberParseException:
            raise serializers.ValidationError("Невозможно обработать номер телефона.")

        return value
    
    def validate_contact_name(self,value):
        if len(value) < 3 :
            raise serializers.ValidationError("Имя минимум 3 символа ")
        return value
    

class FavoritSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorit
        fields = ['listing']