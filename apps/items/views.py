from rest_framework import viewsets,mixins
from rest_framework import status
from drf_spectacular.utils import extend_schema

from .serializers import *
from .models import *

@extend_schema(tags=['Info page'])
class InfoPageViewset(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = InfoPages.objects.all()
    serializer_class = InfoPagesSerializer
