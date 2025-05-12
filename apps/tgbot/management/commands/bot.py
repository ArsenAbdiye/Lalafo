import django
from django.core.management.base import BaseCommand
import telebot
from telebot.types import InlineKeyboardButton, InlineKeyboardMarkup

django.setup()

from apps.items.models import SubSubCategory,Category,SubCategory,Ad,AdImage  
from lalafo import settings  

bot = telebot.TeleBot(settings.BOT_TOKEN)


def create_pagination_markup(current_page, total_pages, callback_prefix):
    markup = InlineKeyboardMarkup(row_width=2)
    buttons = []

    if current_page > 1:
        buttons.append(InlineKeyboardButton(
            "⬅️ Назад", 
            callback_data=f"{callback_prefix}_{current_page - 1}"
        ))
    if current_page < total_pages:
        buttons.append(InlineKeyboardButton(
            "➡️ Далее", 
            callback_data=f"{callback_prefix}_{current_page + 1}"
        ))

    if buttons:
        markup.add(*buttons)
    return markup


# Главное меню
def main_menu():
    markup = InlineKeyboardMarkup(row_width=2)
    markup.add(
        InlineKeyboardButton("📋 Последние объявления", callback_data="latest_ads_page_1"),
        InlineKeyboardButton("📂 Отфильтровать по категориям", callback_data="filter_categories"),
        InlineKeyboardButton("🔍 Поиск объявлений", callback_data="search_command")
    )
    return markup

@bot.callback_query_handler(func=lambda call: call.data == "search_command")
def handle_search_callback(call):
    msg = bot.send_message(call.message.chat.id, "🔍 Введите поисковый запрос:")
    bot.register_next_step_handler(msg, process_search_query)


@bot.message_handler(commands=['start'])
def start(message):
    bot.send_message(
        message.chat.id,
        "Добро пожаловать! Выберите, что хотите сделать:",
        reply_markup=main_menu()
    )


@bot.callback_query_handler(func=lambda call: call.data.startswith("latest_ads_page_"))
def handle_latest_ads(call):
    try:
        page = int(call.data.split("_")[-1])
    except (IndexError, ValueError):
        page = 1

    ads_per_page = 5
    ads = Ad.objects.all().order_by('-created_at')
    total_ads = ads.count()
    total_pages = (total_ads + ads_per_page - 1) // ads_per_page

    start = (page - 1) * ads_per_page
    end = start + ads_per_page
    ads_to_show = ads[start:end]

    for ad in ads_to_show:
        image = AdImage.objects.filter(ad=ad).first()
        ad_link = settings.AD_LINK_TEMPLATE.format(ad_id=ad.id)
        caption = (
            f"{ad.description}\n"
            f"Цена: {ad.price} {ad.currency}\n"
            f"<a href='{ad_link}'>🔗 Посмотреть на сайте</a>"
        )

        if image:
            with open(image.image.path, 'rb') as img_file:
                bot.send_photo(
                    call.message.chat.id, 
                    img_file, 
                    caption=caption,
                    parse_mode='HTML'
                )
        else:
            bot.send_message(
                call.message.chat.id, 
                caption,
                parse_mode='HTML'
            )

    pagination_markup = create_pagination_markup(
        current_page=page,
        total_pages=total_pages,
        callback_prefix="latest_ads_page"
    )
    
    if pagination_markup.keyboard:
        bot.send_message(call.message.chat.id, f"Страница {page} из {total_pages}", reply_markup=pagination_markup)


@bot.callback_query_handler(func=lambda call: call.data == "filter_categories")
def handle_filter_categories(call):
    categories = Category.objects.all()
    if not categories:
        bot.send_message(call.message.chat.id, "Категории не найдены.")
        return

    markup = InlineKeyboardMarkup(row_width=2)
    for category in categories:
        markup.add(InlineKeyboardButton(category.category_name, callback_data=f"cat_{category.id}"))

    bot.send_message(call.message.chat.id, "Выберите категорию:", reply_markup=markup)


@bot.callback_query_handler(func=lambda call: call.data.startswith("cat_"))
def handle_subcategories(call):
    cat_id = int(call.data.split('_')[1])
    subcategories = SubCategory.objects.filter(parent_category_id=cat_id)
    if not subcategories:
        bot.send_message(call.message.chat.id, "Подкатегории не найдены.")
        return

    markup = InlineKeyboardMarkup(row_width=2)
    for subcat in subcategories:
        markup.add(InlineKeyboardButton(subcat.sub_category_name, callback_data=f"subcat_{subcat.id}"))

    bot.send_message(call.message.chat.id, "Выберите подкатегорию:", reply_markup=markup)


@bot.callback_query_handler(func=lambda call: call.data.startswith("subcat_"))
def handle_subsubcategories(call):
    subcat_id = int(call.data.split('_')[1])
    subsubcategories = SubSubCategory.objects.filter(parent_subcategory_id=subcat_id)
    if not subsubcategories:
        bot.send_message(call.message.chat.id, "Под-подкатегории не найдены.")
        return

    markup = InlineKeyboardMarkup(row_width=2)
    for subsubcat in subsubcategories:
        markup.add(InlineKeyboardButton(
            subsubcat.subsub_category_name, 
            callback_data=f"subsubcat_{subsubcat.id}_page_1"
        ))

    bot.send_message(call.message.chat.id, "Выберите под-подкатегорию:", reply_markup=markup)


@bot.callback_query_handler(func=lambda call: call.data.startswith("subsubcat_"))
def handle_subsub_category_selection(call):
    parts = call.data.split('_')
    subsubcat_id = int(parts[1])
    page = int(parts[3]) if len(parts) > 3 and parts[2] == "page" else 1
    ads_per_page = 5

    try:
        subsubcat = SubSubCategory.objects.get(id=subsubcat_id)
    except SubSubCategory.DoesNotExist:
        bot.send_message(call.message.chat.id, "Выбранная под-подкатегория не существует.")
        return

    ads = Ad.objects.filter(category=subsubcat).order_by('-created_at')
    total_ads = ads.count()
    total_pages = (total_ads + ads_per_page - 1) // ads_per_page

    start = (page - 1) * ads_per_page
    end = start + ads_per_page
    ads_to_show = ads[start:end]

    if not ads_to_show:
        bot.send_message(call.message.chat.id, "Нет объявлений на этой странице.")
        return

    for ad in ads_to_show:
        image = AdImage.objects.filter(ad=ad).first()
        ad_link = settings.AD_LINK_TEMPLATE.format(ad_id=ad.id)
        caption = (
            f"{ad.description}\n"
            f"Цена: {ad.price} {ad.currency}\n"
            f"<a href='{ad_link}'>🔗 Посмотреть на сайте</a>"
        )

        if image:
            with open(image.image.path, 'rb') as img_file:
                bot.send_photo(
                    call.message.chat.id, 
                    img_file, 
                    caption=caption,
                    parse_mode='HTML'
                )
        else:
            bot.send_message(
                call.message.chat.id, 
                caption,
                parse_mode='HTML'
            )

    pagination_markup = create_pagination_markup(
        current_page=page,
        total_pages=total_pages,
        callback_prefix=f"subsubcat_{subsubcat_id}_page"
    )
    
    if pagination_markup.keyboard:
        bot.send_message(call.message.chat.id, f"Страница {page} из {total_pages}", reply_markup=pagination_markup)


def process_search_query(message):
    search_query = message.text.strip()
    if not search_query:
        bot.send_message(message.chat.id, "Пожалуйста, введите непустой запрос.")
        return
    
    send_search_results(message.chat.id, search_query, page=1)



def send_search_results(chat_id, query, page=1):
    ads_per_page = 5
    ads = Ad.objects.filter(description__icontains=query).order_by('-created_at')
    total_ads = ads.count()
    total_pages = (total_ads + ads_per_page - 1) // ads_per_page

    start = (page - 1) * ads_per_page
    end = start + ads_per_page
    ads_to_show = ads[start:end]

    if not ads_to_show:
        bot.send_message(chat_id, "Нет объявлений на этой странице.")
        return

    for ad in ads_to_show:
        image = AdImage.objects.filter(ad=ad).first()
        ad_link = settings.AD_LINK_TEMPLATE.format(ad_id=ad.id)
        caption = (
            f"{ad.description}\n"
            f"Цена: {ad.price} {ad.currency}\n"
            f"<a href='{ad_link}'>🔗 Посмотреть на сайте</a>"
        )

        if image:
            with open(image.image.path, 'rb') as img_file:
                bot.send_photo(
                    chat_id,
                    img_file,
                    caption=caption,
                    parse_mode='HTML'
                )
        else:
            bot.send_message(chat_id, caption, parse_mode='HTML')

    pagination_markup = create_pagination_markup(
        current_page=page,
        total_pages=total_pages,
        callback_prefix=f"search_{query.replace(' ', '_')}"
    )
    if pagination_markup.keyboard:
        bot.send_message(chat_id, f"Страница {page} из {total_pages}", reply_markup=pagination_markup)


@bot.callback_query_handler(func=lambda call: call.data.startswith("search_"))
def handle_search_pagination(call):
    try:
        *query_parts, page_str = call.data.split("_")
        query = " ".join(query_parts[1:])  
        page = int(page_str)
    except Exception:
        bot.send_message(call.message.chat.id, "Ошибка при разборе запроса.")
        return

    send_search_results(call.message.chat.id, query, page)


class Command(BaseCommand):
    def handle(self, *args, **options):
        print("Бот запущен...")
        bot.infinity_polling()