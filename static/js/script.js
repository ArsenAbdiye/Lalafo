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
        const response = await fetch('/api/ad_card/');
        if (!response.ok) throw new Error('Ошибка загрузки объявлений');
        const ads = await response.json();

        for (const ad of ads) {
            const categoryName = await getCategoryName(ad.category);

            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <div class="card_image">
                    <img src="${ad.first_image?.image || '/static/no-image.png'}" alt="">
                </div>
                ${ad.past_price ? `<p class="old_price">${Number(ad.past_price).toLocaleString()} <span>Kgs</span></p>` : ''}
                <p class="price">${Number(ad.price).toLocaleString()} <span>Kgs</span></p>
                <p class="category">${categoryName}</p>
                <p class="discroption">${truncate(ad.description)}</p>
                <div class="card_infos">
                    <div class="user_icon">
                        <img src="${ad.user.user_image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaUTp3j_LpF5r5_gNdvW0g7p057ExdcHWbUQ&s'}" alt="">
                    </div>
                    <div class="card_inf">
                        <svg width="26" height="26" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.6385 3.11717C14.2968 3.83213 14.6666 4.80202 14.6666 5.81337C14.6666 6.82471 14.2968 7.7946 13.6385 8.50956L8.98197 13.5694C8.95632 13.5973 8.92949 13.6241 8.90155 13.6497C8.35911 14.1465 7.51566 14.1106 7.01764 13.5694L2.3611 8.50956C0.990719 7.02049 0.990719 4.60624 2.3611 3.11717C3.73147 1.6281 5.9533 1.6281 7.32367 3.11717L7.99981 3.85187L8.67594 3.11717C9.33392 2.40188 10.2265 2 11.1572 2C12.088 2 12.9806 2.40188 13.6385 3.11717Z" fill="#a1a8bd"/>
                        </svg>
                    </div>
                </div>
            `;
            container.appendChild(div);
        }
    } catch (error) {
        console.error('Ошибка при загрузке объявлений:', error);
    }
}

renderAds();