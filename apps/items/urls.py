from rest_framework import routers
from .views import *

items_router = routers.DefaultRouter()

items_router.register(r'info_pages', InfoPageViewset,basename='info_pages')
items_router.register(r'categorys', CategoryViewset,basename='categorys')
items_router.register(r'category_options', CategoryOptionsViewset,basename='category_options')
items_router.register(r'listing_create', ListingCreateViewset,basename='listing_create')
items_router.register(r'favorit_add', FavoritAddViewSet,basename='favorit_add')

items_router.register(r'social_networks', SocialNetworkViewSet, basename='social_networks')
items_router.register(r'phone_numbers', PhoneNumberViewSet, basename='phone_numbers')
items_router.register(r'email_addresses', EmailAddressViewSet, basename='email_addresses')
items_router.register(r'addresses', AddressViewSet, basename='addresses')