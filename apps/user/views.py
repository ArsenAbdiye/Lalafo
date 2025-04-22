from .serializers import *

from rest_framework import mixins, viewsets
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import permissions,status
from drf_spectacular.utils import extend_schema
from rest_framework.views import APIView

from .models import CustomUser


@extend_schema(tags=['User'])
class RegisterView(mixins.CreateModelMixin , viewsets.GenericViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def create(self,request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(self.get_serializer(instance).data)
    
@extend_schema(tags=['User'])
class UserChangeNameViewSet(ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(request=UserChageNameSerializer)
    def update(self, request, pk=None):
        serializer = UserChageNameSerializer(instance=request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Никнейм успешно изменён'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=UserChageNameSerializer)
    def partial_update(self, request, pk=None):
        return self.update(request, pk)