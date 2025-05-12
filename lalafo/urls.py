"""
URL configuration for lalafo project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include  
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView 
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from apps.user.urls import user_router
from apps.core.urls import core_router
from apps.items.urls import items_router

router = routers.DefaultRouter()
router.registry.extend(user_router.registry)
router.registry.extend(core_router.registry)
router.registry.extend(items_router.registry)
from apps.user.views import vk_login_view
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'), 
    path('api/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/', include(router.urls)),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('vk/login/', vk_login_view, name='vk_login'),
]
