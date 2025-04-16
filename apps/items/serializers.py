from rest_framework import serializers
from .models import *

class InfoPagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoPages
        fields = ['page_title','page_text','id']