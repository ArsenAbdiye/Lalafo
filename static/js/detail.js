document.addEventListener("DOMContentLoaded", function () {
    // бургер меню
    const btn = document.querySelector('.burger_menu button');
    const menu = document.querySelector('.burger_menu');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('open');
        });
    }

    // кнопка "все категории"
    const toggleButton = document.querySelector('.tag_button');
    const categoryBlock = document.querySelector('.categorys');
    if (toggleButton && categoryBlock) {
        toggleButton.addEventListener('click', function () {
            categoryBlock.classList.toggle('open');
        });
    }

    // при наведении на категорию — показывать подкатегории
    const container = document.getElementById('subcategoryContainer');
    const mainCategories = document.querySelector('.main-categories');
    if (container && mainCategories) {
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
                            const ul = document.createElement('ul');
                            const p = document.createElement('p');
                            p.textContent = sub.sub_category_name;
                            ul.appendChild(p);

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


var main = new Splide('#main-slider', {
    type: 'fade',
    heightRatio: 0.5,
    pagination: false,
    arrows: false,
    cover: true,
});

var thumbnails = new Splide('#thumbnail-slider', {
    rewind: true,
    fixedWidth: 104,
    fixedHeight: 58,
    isNavigation: true,
    gap: 10,
    focus: 'center',
    pagination: false,
    cover: true,
    dragMinThreshold: {
        mouse: 4,
        touch: 10,
    },
    breakpoints: {
        640: {
            fixedWidth: 66,
            fixedHeight: 38,
        },
    },
});

main.sync(thumbnails);
main.mount();
thumbnails.mount();

document.addEventListener('DOMContentLoaded', () => {
    const productId = localStorage.getItem('selectedProductId');

    if (!productId) {
        console.error('ID не найден в localStorage');
        return;
    }

    const adId = `http://127.0.0.1:8000/api/ad_detail/${productId}/`;


    fetch(adId)
        .then(response => response.json())
        .then(data => {
            const images = data.images;

            const mainList = document.querySelector('#main-slider .splide__list');
            const thumbList = document.querySelector('#thumbnail-slider .splide__list');

            // Очистим существующие <li>
            mainList.innerHTML = '';
            thumbList.innerHTML = '';

            // Добавим изображения из ответа
            images.forEach(img => {
                const mainItem = document.createElement('li');
                mainItem.className = 'splide__slide';
                mainItem.innerHTML = `<img src="${img.image}" alt="Ad image">`;
                mainList.appendChild(mainItem);

                const thumbItem = document.createElement('li');
                thumbItem.className = 'splide__slide';
                thumbItem.innerHTML = `<img src="${img.image}" alt="Ad thumbnail">`;
                thumbList.appendChild(thumbItem);
            });

            // Инициализация Splide после вставки
            new Splide('#main-slider', {
                type: 'fade',
                heightRatio: 0.5,
                pagination: false,
                arrows: false,
                cover: true,
            }).mount();

            new Splide('#thumbnail-slider', {
                fixedWidth: 100,
                fixedHeight: 64,
                isNavigation: true,
                gap: 10,
                focus: 'center',
                pagination: false,
                cover: true,
                breakpoints: {
                    600: {
                        fixedWidth: 66,
                        fixedHeight: 40,
                    },
                },
            }).mount();

            // Связываем карусели
            const main = Splide.instances[0];
            const thumb = Splide.instances[1];
            main.sync(thumb);
        })
        .catch(error => {
            console.error('Ошибка загрузки изображений:', error);
        });

    fetch(adId)
        .then(response => response.json())
        .then(data => {
            document.querySelector('.impressions').textContent = data.impressions ?? '0';
            document.querySelector('.views').textContent = data.views ?? '0';
            document.querySelector('.favorites_count').textContent = data.favorites_count ?? '0';
        })
        .catch(error => {
            console.error('Ошибка при загрузке статистики:', error);
        });

    fetch(adId)
        .then(response => response.json())
        .then(data => {
            const user = data.user;

            // Аватар
            const avatarImg = document.querySelector('.userAvatar-photo');
            if (avatarImg) {
                avatarImg.src = user.user_image;
                avatarImg.setAttribute('data-src', user.user_image);
            }

            // Имя/ник
            const userNameText = document.querySelector('.userName-text');
            if (userNameText) {
                userNameText.textContent = user.usernickname;
            }

            // Метка PRO/VIP
            const proLabel = document.querySelector('.pro-label');
            if (proLabel) {
                if (user.is_pro) {
                    proLabel.textContent = 'PRO';
                } else if (user.is_vip) {
                    proLabel.textContent = 'VIP';
                } else {
                    proLabel.remove(); // Удалим метку, если ни pro, ни vip
                }
            }

            // Номер телефона
            const phoneP = document.querySelector('.phone-wrap p');
            const showButton = document.querySelector('.show-button');

            if (data.hide_phone) {
                // Телефон скрыт
                phoneP.textContent = '+996 XXX XXX XXX';
                if (showButton) showButton.style.display = 'none';
            } else {
                // Показываем реальный номер
                phoneP.textContent = data.phone_number;
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки контактной информации:', error);
        });

    fetch(adId)
        .then(res => res.json())
        .then(data => {
            
            const container = document.querySelector('.details-page__params');
            container.innerHTML = ''; // Очищаем старые поля

            data.category_options.ad_categoy_fields.forEach(field => {
                const title = field.option.option_title;
                const value = field.field.option_field;

                const li = document.createElement('li');
                li.innerHTML = `
          <p class="LFParagraph size-14 option">${title}:</p>
          <a class="LFLink small weight-400 value_or_field" href="#">${value}</a>
        `;
                container.appendChild(li);
            });
        })
        .catch(err => {
            console.error('Ошибка загрузки category options:', err);
        });

    fetch(adId)
        .then(res => res.json())
        .then(data => {
            console.log('ababa');

            const text = data.description || '';


            const splitIndex = 50; // сколько символов для заголовка
            const firstPart = text.slice(0, splitIndex);
            const restPart = text.slice(splitIndex);

            const h1 = document.querySelector('h1.discription_part');
            const p = document.querySelector('.pdes');

            if (h1) h1.textContent = firstPart;
            if (p) p.textContent = restPart;
        })
        .catch(err => {
            console.error('Ошибка при загрузке description:', err);
        });

    fetch(adId)
        .then(res => res.json())
        .then(data => {
            const cityName = data.city?.city_name || "Неизвестно";

            const cityBlock = document.querySelector('.map p');
            if (cityBlock) {
                cityBlock.textContent = cityName;
            }
        })
        .catch(err => {
            console.error('Ошибка при получении данных города:', err);
        });

    fetch(adId)
        .then(res => res.json())
        .then(data => {
            // Цена
            const priceElem = document.querySelector('.ad-detail-price-container p.LFHeading');
            if (priceElem) {
                priceElem.textContent = `${data.price} ${data.currency}`;
            }

            // Аватар пользователя
            const userAvatarImg = document.querySelector('.userAvatar_photo');
            if (userAvatarImg) {
                userAvatarImg.src = data.user.user_image;
                userAvatarImg.setAttribute('data-src', data.user.user_image);
                userAvatarImg.alt = data.user.usernickname || 'User avatar';
            }

            // Никнейм пользователя
            const userNameText = document.querySelector('.name');
            if (userNameText) {
                userNameText.textContent = data.user.usernickname;
            }
        })
        .catch(err => console.error('Ошибка загрузки данных:', err));



    fetch(adId)
        .then(res => res.json())
        .then(data => {
            const phoneElem = document.querySelector('.phone-item p.LFParagraph');
            if (phoneElem) {
                // Если телефон нужно показать даже при hide_phone = true, иначе можно сделать условие
                phoneElem.textContent = data.phone_number || '+996 555 507 7xx';
            }
        })
        .catch(err => console.error('Ошибка загрузки телефона:', err));

    fetch(adId)
        .then(res => res.json())
        .then(data => {
            const cat = data.category;

            // Формируем массив хлебных крошек
            // Сначала категория, потом подкатегория, потом субсубкатегория
            const crumbs = [];

            if (cat?.parent_subcategory?.parent_category) {
                crumbs.push({
                    name: cat.parent_subcategory.parent_category.category_name,
                    url: '/' + cat.parent_subcategory.parent_category.category_name.toLowerCase() // пример url, адаптируй под свои маршруты
                });
            }

            if (cat?.parent_subcategory) {
                crumbs.push({
                    name: cat.parent_subcategory.sub_category_name,
                    url: '/' + cat.parent_subcategory.sub_category_name.toLowerCase().replace(/\s+/g, '-')
                });
            }

            if (cat?.subsub_category_name) {
                crumbs.push({
                    name: cat.subsub_category_name,
                    url: '/' + cat.subsub_category_name.toLowerCase().replace(/\s+/g, '-')
                });
            }

            const ul = document.getElementById('breadcrumb');
            ul.innerHTML = ''; // очистка

            crumbs.forEach((crumb, idx) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = crumb.url;
                a.textContent = crumb.name;
                li.appendChild(a);

                // Добавляем стрелку ">"
                if (idx < crumbs.length - 1) {
                    li.innerHTML += ' &gt;';
                }

                ul.appendChild(li);
            });
        })
        .catch(err => console.error('Ошибка при загрузке категории:', err));

});


