import django_filters
from .models import Ad, Category, SubCategory, SubSubCategory

class AdFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte', label="Минимальная цена")
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte', label="Максимальная цена")
    category = django_filters.ModelChoiceFilter(queryset=Category.objects.all(), label='Категория', required=False)
    subcategory = django_filters.ModelChoiceFilter(queryset=SubCategory.objects.all(), label='Подкатегория', required=False)
    subsub_category = django_filters.ModelChoiceFilter(queryset=SubSubCategory.objects.all(), label='Под-подкатегория', required=False)
    description = django_filters.CharFilter(field_name='description', lookup_expr='icontains', label='Описание', required=False)
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte', label="Создано после")
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte', label="Создано до")
    is_active = django_filters.BooleanFilter(field_name='is_deactivate', lookup_expr='exact', label="Активность", method="filter_is_active")

    def filter_is_active(self, queryset, name, value):
        if value is not None:
            return queryset.filter(is_deactivate=False)
        return queryset

    class Meta:
        model = Ad
        fields = ['min_price', 'max_price', 'category', 'created_after', 'created_before', 'is_active']
