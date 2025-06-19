document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.burger_menu button');
    const menu = document.querySelector('.burger_menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('open');
        });
    }
});


async function loadAdvAll() {
  try {
    const response = await fetch('/api/advertisments/');
    if (!response.ok) throw new Error('Ошибка загрузки рекламы');
    const data = await response.json();
    const adverts = data.results || [];

    if (adverts.length === 0) return;

    const link = document.getElementById('adv-link');
    const img = document.getElementById('adv-img');

    let currentIndex = 0;

    function showAd(index) {
      link.href = adverts[index].advertisment_url || '#';
      img.src = adverts[index].advertisment_image || '';
    }

    showAd(currentIndex);

    setInterval(() => {
      currentIndex = (currentIndex + 1) % adverts.length;
      showAd(currentIndex);
    }, 30000); 

  } catch (error) {
    console.error('Ошибка при загрузке рекламы:', error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadAdvAll();
});


document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('subcategoryContainer');
    const mainCategories = document.querySelector('.main-categories');

    mainCategories.addEventListener('mouseover', function (event) {
        const categoryItem = event.target.closest('.category_item');
        if (!categoryItem) return;

        const categoryId = categoryItem.dataset.id;

        Promise.all([
            fetch('/api/subcategorys').then(res => res.json()),
            fetch('/api/subsubcategorys').then(res => res.json())
        ])
        .then(([subcategoriesData, subsubcategoriesData]) => {
            const subcategories = Array.isArray(subcategoriesData) 
                ? subcategoriesData 
                : (subcategoriesData.subcategories || subcategoriesData.results || []);

            const subsubcategories = Array.isArray(subsubcategoriesData)
                ? subsubcategoriesData
                : (subsubcategoriesData.subsubcategories || subsubcategoriesData.results || []);

            const filteredSubcategories = subcategories.filter(sub => sub.parent_category === Number(categoryId));

            container.innerHTML = ''; // очищаем контейнер

            if (filteredSubcategories.length > 0) {
                filteredSubcategories.forEach(sub => {
                    // создаем ul для каждой подкатегории
                    const ul = document.createElement('ul');

                    // в ul первым элементом добавляем p с названием подкатегории
                    const p = document.createElement('p');
                    p.textContent = sub.sub_category_name;
                    ul.appendChild(p);

                    // фильтруем под-подкатегории для текущей подкатегории
                    const subSubs = subsubcategories.filter(ss => ss.parent_subcategory === sub.id);

                    if (subSubs.length > 0) {
                        subSubs.forEach(ss => {
                            const li = document.createElement('li');
                            li.classList.add('subsub_item');
                            li.textContent = ss.subsub_category_name;
                            ul.appendChild(li);
                        });
                    } else {
                        const li = document.createElement('li');
                        li.textContent = 'Нет под-подкатегорий';
                        ul.appendChild(li);
                    }

                    // добавляем этот ul в контейнер
                    container.appendChild(ul);
                });
            } else {
                container.textContent = 'Нет подкатегорий';
            }
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector('.tag_button');
    const categoryBlock = document.querySelector('.categorys');

    toggleButton.addEventListener('click', function () {
        categoryBlock.classList.toggle('open');
    });
});


const container = document.querySelector('.cards');

function truncate(text, maxLength = 150) {
    return text.length > maxLength ? text.slice(0, maxLength - 1) + '…' : text;
}

async function getCategoryName(id) {
    try {
        const res = await fetch(`/api/category_by_id/${id}/`);
        if (!res.ok) throw new Error('Категория не найдена');
        const data = await res.json();
        // Предположим, что в ответе есть поле с названием категории, например subsub_category_name или category_name
        return data.subsub_category_name || data.sub_category_name || data.category_name || 'Категория';
    } catch (error) {
        console.error('Ошибка получения категории:', error);
        return 'Категория';
    }
}

async function renderAds() {
    try {
        const container = document.querySelector('.cards.cards_ser');
        container.innerHTML = '';

        const params = new URLSearchParams(window.location.search);

        const response = await fetch('/api/ad_card/?' + params.toString());
        if (!response.ok) throw new Error('Ошибка загрузки объявлений');

        const ads = await response.json();

        for (const ad of ads) {
            const categoryName = await getCategoryName(ad.category);

            const div = document.createElement('div');
            div.className = 'card card_ser';
            div.dataset.productId = ad.id;

            div.innerHTML = `
                <div class="card_image card_image_ser">
                    <img src="${ad.first_image?.image ?? '/static/no-image.png'}" alt="">
                </div>
                <div class="card_infos_ser">
                    ${ad.past_price ? `<p class="old_price ">${Number(ad.past_price).toLocaleString()} <span>Kgs</span></p>` : ''}
                    <p class="price old_price_ser">${Number(ad.price).toLocaleString()} <span>Kgs</span></p>
                    <p class="category">${categoryName}</p>
                    <p class="discroption">${truncate(ad.description)}</p>
                </div>
            `;

            container.appendChild(div);
        }

        if (ads.length === 0) {
            container.textContent = 'Объявлений не найдено';
        }

    } catch (error) {
        console.error('Ошибка при загрузке объявлений:', error);
    }
}

renderAds();

// Функция, обновляющая URL-параметры и вызывает рендеринг
function updateFiltersAndRender() {
    const minPrice = document.getElementById('minPriceInput').value;
    const maxPrice = document.getElementById('maxPriceInput').value;

    const url = new URL(window.location);
    const params = url.searchParams;

    // Обновляем параметры
    if (minPrice) {
        params.set('min_price', minPrice);
    } else {
        params.delete('min_price');
    }

    if (maxPrice) {
        params.set('max_price', maxPrice);
    } else {
        params.delete('max_price');
    }

    // Обновляем URL без перезагрузки страницы
    window.history.replaceState(null, '', url.toString());

    // Запускаем функцию загрузки объявлений с новыми параметрами
    renderAds();
}

// Навешиваем обработчик на кнопку
document.getElementById('searchBtn').addEventListener('click', updateFiltersAndRender);

// Можно также запускать фильтр по нажатию Enter в полях, если нужно
document.getElementById('minPriceInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') updateFiltersAndRender();
});
document.getElementById('maxPriceInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') updateFiltersAndRender();
});



document.addEventListener('click', (event) => {
  const card = event.target.closest('.card_ser');
  if (card && card.dataset.productId) {
    const productId = card.dataset.productId;

    localStorage.setItem('selectedProductId', productId);

    window.location.href = 'http://127.0.0.1:8000/card_detail';
  }
});