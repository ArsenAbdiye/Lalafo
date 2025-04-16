from rest_framework import serializers
from .models import *


class SiteLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteLogo
        fields = ['header_logo']


class BurgerLinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = BurgerLinks
        fields = ['link_text', 'url_link']


class BurgerCategorySerializer(serializers.ModelSerializer):
    link = BurgerLinksSerializer(many=True,read_only=True)
    class Meta:
        model = BurgerCategory
        fields = ['category_text','link']


class AdvertismentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisments
        fields = ['advertisment_image','advertisment_url','order']


class FooterCopyrightSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterCopyright
        fields = ['copyright']


class FooterSiteLinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterSiteLinks
        fields = ['footer_link_text', 'footer_link_url']


class FooterSiteLinksCategorySerializer(serializers.ModelSerializer):
    link = FooterSiteLinksSerializer(many=True,read_only=True)
    class Meta:
        model = FooterSiteLinksCategory
        fields = ['footer_category','link']
