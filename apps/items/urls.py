from rest_framework import routers
from .views import *

items_router = routers.DefaultRouter()

items_router.register(r'info_pages', InfoPageViewset,basename='info_pages')
items_router.register(r'categorys', CategoryViewset,basename='categorys')
items_router.register(r'category_options', CategoryOptionsViewset,basename='category_options')
items_router.register(r'listing', ListingCreateViewset,basename='listing')