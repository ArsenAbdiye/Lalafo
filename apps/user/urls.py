from rest_framework import routers

from apps.user.views import RegisterView

user_router = routers.DefaultRouter()

user_router.register(r"registry", RegisterView, basename="registry")