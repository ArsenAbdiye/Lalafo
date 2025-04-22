from rest_framework import viewsets,mixins
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework.parsers import FormParser, MultiPartParser

from .serializers import *
from .models import *

@extend_schema(tags=['Info page'])
class InfoPageViewset(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = InfoPages.objects.all()
    serializer_class = InfoPagesSerializer


@extend_schema(tags=['Category'])
class CategoryViewset(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@extend_schema(tags=['Category'])
class CategoryOptionsViewset(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = CategoryOptions.objects.all()
    serializer_class = CategoryOptionsSerializer


@extend_schema(
    tags=['Listing'],
    request=ListingSerializer,
)
class ListingCreateViewset(mixins.CreateModelMixin,mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    parser_classes = (FormParser, MultiPartParser)