from django.contrib import admin
from .models import *


@admin.register(InfoPages)
class InfoPagesAdmin(admin.ModelAdmin):
    pass


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'category_name', 'category_image')
    search_fields = ('category_name',)
    ordering = ('id',)


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'sub_category_name', 'parent_category')
    search_fields = ('sub_category_name',)
    list_filter = ('parent_category',)
    ordering = ('id',)


@admin.register(SubSubCategory)
class SubSubCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'subsub_category_name', 'parent_subcategory')
    search_fields = ('subsub_category_name',)
    list_filter = ('parent_subcategory',)
    ordering = ('id',)


@admin.register(CategoryOptions)
class CategoryOptionsAdmin(admin.ModelAdmin):
    list_display = ('option_title',)


@admin.register(CategoryOptionsFields)
class CategoryOptionsFieldsAdmin(admin.ModelAdmin):
    list_display = ('option_field', 'option')
    list_filter = ('option',)
    search_fields = ('option_field',)


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'description', 'category', 'price', 'currency', 'contact_name', 'phone_number', 'created_at', 'hide_phone')
    search_fields = ('description', 'contact_name', 'phone_number')
    list_filter = ('category', 'currency', 'hide_phone')


@admin.register(PhoneNumber)
class PhoneNumberAdmin(admin.ModelAdmin):
    pass

@admin.register(EmailAddress)
class EmailAddressAdmin(admin.ModelAdmin):
    pass

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    pass

