from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, ValidationError


class OwnerCheckMixin:
    def perform_create(self, serializer):
        ad = serializer.validated_data.get('ad')
        if not ad:
            raise ValidationError({"error": "Ad обязателен"})

        if ad.user != self.request.user:
            raise PermissionDenied("Вы не можете добавить данные к чужому объявлению.")

        serializer.save()
    def perform_update(self, serializer):
        ad = serializer.validated_data.get('ad')
        if not ad:
            raise ValidationError({"error": "Ad обязателен"})

        if ad.user != self.request.user:
            raise PermissionDenied("Вы не можете изменить чужое объявление.")

        serializer.save()
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.ad.user != request.user:
            return Response({"error": "Это не ваше поле"}, status=status.HTTP_403_FORBIDDEN)

        return super().destroy(request, *args, **kwargs)