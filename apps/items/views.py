from rest_framework import viewsets,mixins
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework import permissions
from rest_framework.response import Response

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


@extend_schema(tags=['Listing'])
class ListingCreateViewset(mixins.CreateModelMixin,mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated,]
    parser_classes = (FormParser, MultiPartParser)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@extend_schema(tags=['Listing'])
class FavoritAddViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Favorit.objects.all()
    serializer_class = FavoritSerializer
    permission_classes = [permissions.IsAuthenticated,]

    def create(self, request):
        user = request.user
        listing_id = request.data.get('listing')

        if not listing_id:
            return Response({'detail': 'listing ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            listing = Listing.objects.get(pk=listing_id)
        except Listing.DoesNotExist:
            return Response({'detail': 'Объявление не найдено.'}, status=status.HTTP_404_NOT_FOUND)

        favorite = Favorit.objects.filter(user=user, listing=listing).first()

        if favorite:
            favorite.delete()
            return Response({'detail': 'Удалено из избранного.'}, status=status.HTTP_200_OK)

        Favorit.objects.create(user=user, listing=listing)
        return Response({'detail': 'Добавлено в избранное.'}, status=status.HTTP_201_CREATED)