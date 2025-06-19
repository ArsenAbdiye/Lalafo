from django.contrib import admin
from .models import *
import nested_admin

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


class CategoryOptionsFieldsInline(nested_admin.NestedTabularInline):
    model = CategoryOptionsFields
    extra = 1


class CategoryOptionsInline(nested_admin.NestedStackedInline):
    model = CategoryOptions
    extra = 1
    inlines = [CategoryOptionsFieldsInline]


@admin.register(SubSubCategory)
class SubSubCategoryAdmin(nested_admin.NestedModelAdmin):
    inlines = [CategoryOptionsInline]
    list_display = ("id","subsub_category_name")


@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
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


@admin.register(WorkDays)
class WorkDaysAdmin(admin.ModelAdmin):
    pass


@admin.register(СategoryAdvertising)
class СategoryAdvertisingAdmin(admin.ModelAdmin):
    pass


@admin.register(Citys)
class CitysAdmin(admin.ModelAdmin):
    pass

@admin.register(ChosenFields)
class ChosenFieldsAdmin(admin.ModelAdmin):
    list_display = ['id']

@admin.register(AdCategoryFields)
class AdCategoryFieldsAdmin(admin.ModelAdmin):
    list_display = ['id','user','category']


