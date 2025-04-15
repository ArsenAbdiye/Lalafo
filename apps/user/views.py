from .serializers import RegisterSerializer

from rest_framework import mixins, viewsets
from rest_framework.response import Response

from .models import CustomUser

class RegisterView(mixins.CreateModelMixin , viewsets.GenericViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def create(self,request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(self.get_serializer(instance).data)