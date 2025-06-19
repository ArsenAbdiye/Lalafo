import django_filters
from .models import Ad, Category, SubCategory, SubSubCategory

class AdFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte', label="Минимальная цена")
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte', label="Максимальная цена")

    category = django_filters.ModelChoiceFilter(
        field_name='category__parent_subcategory__parent_category',
        queryset=Category.objects.all(),
        label='Категория',
        required=False
    )

    subcategory = django_filters.ModelChoiceFilter(
        field_name='category__parent_subcategory',
        queryset=SubCategory.objects.all(),
        label='Подкатегория',
        required=False
    )

    subsub_category = django_filters.ModelChoiceFilter(
        field_name='category',
        queryset=SubSubCategory.objects.all(),
        label='Под-подкатегория',
        required=False
    )

    description = django_filters.CharFilter(field_name='description', lookup_expr='icontains', label='Описание', required=False)
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte', label="Создано после")
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte', label="Создано до")

    class Meta:
        model = Ad
        fields = [
            'min_price',
            'max_price',
            'category',
            'subcategory',
            'subsub_category',
            'description',
            'created_after',
            'created_before',
        ]
