from django.contrib import admin
from .models import *

@admin.register(SiteLogo)
class SiteLogoAdmin(admin.ModelAdmin):
    list_display = ['id', 'header_logo']
    readonly_fields = ['id']


class BurgerLinksInline(admin.TabularInline):
    model = BurgerLinks
    extra = 1


@admin.register(BurgerCategory)
class BurgerCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'category_text']
    inlines = [BurgerLinksInline]


@admin.register(BurgerLinks)
class BurgerLinksAdmin(admin.ModelAdmin):
    list_display = ['id', 'link_text', 'url_link', 'category']
    list_filter = ['category']
    search_fields = ['link_text']


@admin.register(Advertisments)
class AdvertismentsAdmin(admin.ModelAdmin):
    list_display = ['id', 'advertisment_image', 'advertisment_url', 'order']
    list_editable = ['order']
    ordering = ['order']


@admin.register(FooterCopyright)
class FooterCopyrightAdmin(admin.ModelAdmin):
    list_display = ['id', 'copyright']


class FooterSiteLinksInline(admin.TabularInline):
    model = FooterSiteLinks
    extra = 1


@admin.register(FooterSiteLinksCategory)
class FooterSiteLinksCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'footer_category']
    inlines = [FooterSiteLinksInline]


@admin.register(FooterSiteLinks)
class FooterSiteLinksAdmin(admin.ModelAdmin):
    list_display = ['id', 'footer_link_text', 'footer_link_url', 'category']
    list_filter = ['category']
    search_fields = ['footer_link_text']
