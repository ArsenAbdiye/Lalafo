from django.contrib import admin
from .models import *



@admin.register(BurgerCategory)
class BurgerCategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(BurgerLinks)
class BurgerLinksAdmin(admin.ModelAdmin):
    pass

@admin.register(HeaderLogo)
class HeaderLogoAdmin(admin.ModelAdmin):
    pass