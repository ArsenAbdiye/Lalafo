from django.contrib import admin
from .models import *


@admin.register(InfoPages)
class InfoPagesAdmin(admin.ModelAdmin):
    pass