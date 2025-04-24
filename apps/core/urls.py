from rest_framework import routers
from .views import *

core_router = routers.DefaultRouter()


core_router.register(r'site_logo', SiteLogoViewset,basename='site_logo')
core_router.register(r'header_burger_links', BurgerLinksViewset,basename='header_burger_links')
core_router.register(r'footer_links', FooterSiteLinksViewset,basename='footer_links')
core_router.register(r'footer_copyright', FooterCopyrightViewset,basename='footer_copyright')
core_router.register(r'advertisments', AdvertismentsViewset,basename='advertisments')