from rest_framework import routers
from .views import *

items_router = routers.DefaultRouter()

items_router.register(r'info_pages', InfoPageViewset,basename='info_pages')
items_router.register(r'categorys', CategoryViewset,basename='categorys')
items_router.register(r'category_options', CategoryOptionsViewset,basename='category_options')
items_router.register(r'listing_create', ListingCreateViewset,basename='listing_create')
items_router.register(r'favorit_add', FavoritAddViewSet,basename='favorit_add')
items_router.register(r'phone_number', PhoneNumberViewSet,basename='phone_number')
items_router.register(r'adress', AddressViewSet,basename='adress')
items_router.register(r'email', EmailAddressViewSet,basename='email')
items_router.register(r'social_netrwork', SocialNetworkViewSet,basename='social_netrwork')
items_router.register(r'get_lisitngs', ListingGetViewSet,basename='get_lisitngs')


