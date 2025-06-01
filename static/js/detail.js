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


var main = new Splide( '#main-slider', {
  type       : 'fade',
  heightRatio: 0.5,
  pagination : false,
  arrows     : false,
  cover      : true,
} );

var thumbnails = new Splide( '#thumbnail-slider', {
  rewind          : true,
  fixedWidth      : 104,
  fixedHeight     : 58,
  isNavigation    : true,
  gap             : 10,
  focus           : 'center',
  pagination      : false,
  cover           : true,
  dragMinThreshold: {
    mouse: 4,
    touch: 10,
  },
  breakpoints : {
    640: {
      fixedWidth  : 66,
      fixedHeight : 38,
    },
  },
} );

main.sync( thumbnails );
main.mount();
thumbnails.mount();