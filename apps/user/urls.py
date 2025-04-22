from rest_framework import routers

from apps.user.views import *

user_router = routers.DefaultRouter()

user_router.register(r"registry", RegisterView, basename="registry")
user_router.register(r"usernickname_change", UserChangeNameViewSet, basename="usernickname_change")