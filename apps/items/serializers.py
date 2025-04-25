from rest_framework import serializers
from .models import *
from apps.items.validators import validate_kg_phone_number


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


class FavoritSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorit
        fields = ['listing']

    
class PhoneNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneNumber
        fields = ['id', 'number','listing']

    def validate_number(self, value):
        return validate_kg_phone_number(value)
    

class EmailAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailAddress
        fields = ['id', 'email','listing']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'address','listing']


class SocialNetworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialNetwork
        fields = ['id', 'social_network_name', 'social_network_link','listing']


class ListingSerializer(serializers.ModelSerializer):
    phone_numbers = PhoneNumberSerializer(many=True)
    emails = EmailAddressSerializer(many=True)
    addresses = AddressSerializer(many=True)
    social_network = SocialNetworkSerializer(many=True)
    favorites_count = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = ['listing_image', 'description', 'category', 'price',
                'currency', 'contact_name', 'phone_number', 'hide_phone',
                'created_at', 'option_fields','user','favorites_count',
                'phone_numbers','emails','addresses','social_network','id']


    def get_favorites_count(self, obj):
        return obj.favorited_by.count()
    
    def validate_phone_number(self, value):
        return validate_kg_phone_number(value)
    
    def validate_contact_name(self,value):
        if len(value) < 3 :
            raise serializers.ValidationError("Имя минимум 3 символа ")
        return value
 