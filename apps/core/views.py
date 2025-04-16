from rest_framework import viewsets,mixins
from rest_framework import status
from drf_spectacular.utils import extend_schema

from .serializers import *
from .models import *

@extend_schema(tags=['Header'])
class SiteLogoViewset(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = SiteLogo.objects.all()
    serializer_class = SiteLogoSerializer


@extend_schema(tags=['Header'])
class BurgerLinksViewset(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = BurgerCategory.objects.all()
    serializer_class = BurgerCategorySerializer


class AdvertismentsViewset(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Advertisments.objects.all()
    serializer_class = AdvertismentsSerializer

@extend_schema(tags=['Footer'])
class FooterSiteLinksViewset(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = FooterSiteLinksCategory.objects.all()
    serializer_class = FooterSiteLinksCategorySerializer

@extend_schema(tags=['Footer'])
class FooterCopyrightViewset(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = FooterCopyright.objects.all()
    serializer_class = FooterCopyrightSerializer