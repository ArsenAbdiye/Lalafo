// ======= ИНИЦИАЛИЗАЦИЯ ПРИ DOMContentLoaded =======
document.addEventListener("DOMContentLoaded", function () {
    initBurgerMenu();
    initCategoryToggle();
    initHoverCategoryLoad();
    loadAdvAll();
    initProductDetail();
});

// ======= КЭШ ДЛЯ ПОДКАТЕГОРИЙ =======
let subcategoriesCache = null;
let subsubcategoriesCache = null;

async function fetchCategories() {
    if (!subcategoriesCache || !subsubcategoriesCache) {
        const [sub, subsub] = await Promise.all([
            fetch('/api/subcategorys').then(res => res.json()),
            fetch('/api/subsubcategorys').then(res => res.json()),
        ]);
        subcategoriesCache = sub.results || sub;
        subsubcategoriesCache = subsub.results || subsub;
    }
}

// ======= ФУНКЦИИ ИНИЦИАЛИЗАЦИИ UI =======
function initBurgerMenu() {
    const btn = document.querySelector('.burger_menu button');
    const menu = document.querySelector('.burger_menu');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('open');
        });
    }
}

function initCategoryToggle() {
    const toggleButton = document.querySelector('.tag_button');
    const categoryBlock = document.querySelector('.categorys');
    if (toggleButton && categoryBlock) {
        toggleButton.addEventListener('click', () => {
            categoryBlock.classList.toggle('open');
        });
    }
}

function initHoverCategoryLoad() {
    const container = document.getElementById('subcategoryContainer');
    const mainCategories = document.querySelector('.main-categories');
    if (!container || !mainCategories) return;

    mainCategories.addEventListener('mouseover', async function (event) {
        const categoryItem = event.target.closest('.category_item');
        if (!categoryItem) return;

        await fetchCategories();

        const categoryId = Number(categoryItem.dataset.id);
        const filteredSubcategories = subcategoriesCache.filter(sub => sub.parent_category === categoryId);

        container.innerHTML = '';

        if (filteredSubcategories.length > 0) {
            filteredSubcategories.forEach(sub => {
                const ul = document.createElement('ul');
                const p = document.createElement('p');
                p.textContent = sub.sub_category_name;
                ul.appendChild(p);

                const subSubs = subsubcategoriesCache.filter(ss => ss.parent_subcategory === sub.id);

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
    });
}

// ======= РЕКЛАМА =======
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

// ======= ЗАГРУЗКА ИНФОРМАЦИИ О ПРОДУКТЕ =======
async function initProductDetail() {
    const productId = localStorage.getItem('selectedProductId');
    if (!productId) return;

    const adId = `http://127.0.0.1:8000/api/ad_detail/${productId}/`;

    try {
        const response = await fetch(adId);
        const data = await response.json();

        renderImages(data.images);
        renderStatistics(data);
        renderUser(data.user, data.hide_phone, data.phone_number);
        renderOptions(data.category_options.ad_categoy_fields);
        renderDescription(data.description);
        renderCity(data.city);
        renderPrice(data);
        renderBreadcrumbs(data.category);
        renderPhone(data.phone_number);

    } catch (err) {
        console.error('Ошибка при загрузке деталей:', err);
    }
}

// ======= ОТДЕЛЬНЫЕ ФУНКЦИИ РЕНДЕРА =======
function renderImages(images) {
    const mainList = document.querySelector('#main-slider .splide__list');
    const thumbList = document.querySelector('#thumbnail-slider .splide__list');
    mainList.innerHTML = '';
    thumbList.innerHTML = '';

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

    const main = new Splide('#main-slider', {
        type: 'fade', heightRatio: 0.5, pagination: false, arrows: false, cover: true,
    });

    const thumbs = new Splide('#thumbnail-slider', {
        fixedWidth: 104, fixedHeight: 58, isNavigation: true, gap: 10, focus: 'center',
        pagination: false, cover: true,
        breakpoints: { 640: { fixedWidth: 66, fixedHeight: 38 } },
    });

    main.sync(thumbs);
    main.mount();
    thumbs.mount();
}

function renderStatistics(data) {
    document.querySelector('.impressions').textContent = data.impressions ?? '0';
    document.querySelector('.views').textContent = data.views ?? '0';
    document.querySelector('.favorites_count').textContent = data.favorites_count ?? '0';
}

function renderUser(user, hidePhone, phoneNumber) {
    const avatarImg = document.querySelector('.userAvatar-photo');
    if (avatarImg) avatarImg.src = user.user_image;

    const userNameText = document.querySelector('.userName-text');
    if (userNameText) userNameText.textContent = user.usernickname;

    const proLabel = document.querySelector('.pro-label');
    if (proLabel) {
        if (user.is_pro) proLabel.textContent = 'PRO';
        else if (user.is_vip) proLabel.textContent = 'VIP';
        else proLabel.remove();
    }

    const phoneP = document.querySelector('.phone-wrap p');
    if (hidePhone) {
        phoneP.textContent = '+996 XXX XXX XXX';
        document.querySelector('.show-button')?.style.setProperty('display', 'none');
    } else {
        phoneP.textContent = phoneNumber;
    }
}

function renderOptions(fields) {
    const container = document.querySelector('.details-page__params');
    container.innerHTML = '';

    fields.forEach(field => {
        const title = field.option.option_title;
        const value = field.field.option_field;

        const li = document.createElement('li');
        li.innerHTML = `<p class="LFParagraph size-14 option">${title}:</p>
                         <a class="LFLink small weight-400 value_or_field" href="#">${value}</a>`;
        container.appendChild(li);
    });
}

function renderDescription(text = '') {
    const h1 = document.querySelector('h1.discription_part');
    const p = document.querySelector('.pdes');

    if (h1) h1.textContent = text.slice(0, 50);
    if (p) p.textContent = text.slice(50);
}

function renderCity(city) {
    const cityBlock = document.querySelector('.map p');
    if (cityBlock) {
        cityBlock.textContent = city?.city_name || 'Неизвестно';
    }
}

function renderPrice(data) {
    const priceElem = document.querySelector('.ad-detail-price-container p.LFHeading');
    if (priceElem) {
        priceElem.textContent = `${data.price} ${data.currency}`;
    }

    const avatarImg = document.querySelector('.userAvatar_photo');
    if (avatarImg) {
        avatarImg.src = data.user.user_image;
        avatarImg.alt = data.user.usernickname || 'User avatar';
    }

    const userNameText = document.querySelector('.name');
    if (userNameText) userNameText.textContent = data.user.usernickname;
}

function renderPhone(phoneNumber) {
    const phoneElem = document.querySelector('.phone-item p.LFParagraph');
    if (phoneElem) phoneElem.textContent = phoneNumber || '+996 555 507 7xx';
}

function renderBreadcrumbs(cat) {
    const ul = document.getElementById('breadcrumb');
    ul.innerHTML = '';

    const crumbs = [];

    if (cat?.parent_subcategory?.parent_category) {
        crumbs.push({
            name: cat.parent_subcategory.parent_category.category_name,
            url: '/' + cat.parent_subcategory.parent_category.category_name.toLowerCase()
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

    crumbs.forEach((crumb, idx) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = crumb.url;
        a.textContent = crumb.name;
        li.appendChild(a);

        if (idx < crumbs.length - 1) {
            li.innerHTML += ' &gt;';
        }

        ul.appendChild(li);
    });
}
