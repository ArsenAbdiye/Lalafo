if (localStorage.getItem('editAdId')) {
    console.warn('');
    return;
}


document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.burger_menu button');
    const menu = document.querySelector('.burger_menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('open');
        });
    }
});

const cityMap = {}; 


document.addEventListener("DOMContentLoaded", () => {
    const datalist = document.getElementById("cityList");

    fetch('/api/citys/')
        .then(res => res.json())
        .then(data => {
            data.results.forEach(city => {
                cityMap[city.city_name.trim().toLowerCase()] = city.id;
                
                const option = document.createElement("option");
                option.value = city.city_name;
                datalist.appendChild(option);
            });
        });
});

const imageInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('imagePreviewContainer');
const errorContainer = document.getElementById('errorContainer');

let selectedImages = [];

imageInput.addEventListener('change', function () {
    const newFiles = Array.from(imageInput.files);

    if (selectedImages.length + newFiles.length > 10) {
        errorContainer.textContent = "Максимум можно загрузить 10 изображений.";
        return;
    }

    errorContainer.textContent = "";

    newFiles.forEach(file => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.cursor = 'pointer'; 

            img.addEventListener('click', () => {
                const index = selectedImages.indexOf(file);
                if (index > -1) {
                    selectedImages.splice(index, 1); 
                }
                previewContainer.removeChild(img); 
            });

            previewContainer.appendChild(img);
        };

        reader.readAsDataURL(file);
        selectedImages.push(file);
    });

    imageInput.value = '';
});

const categoryBtn = document.getElementById('categoryToggleBtn');
const categoryList = document.getElementById('categoryList');
const ulCategories = categoryList.querySelector('ul');
const selectedCategoryDiv = document.getElementById('selectedCategory');

let isCategoryVisible = false;
let subcategoriesCache = [];
let subsubcategoriesCache = [];

categoryBtn.addEventListener('click', function () {
    if (isCategoryVisible) {
        categoryList.style.display = 'none';
        isCategoryVisible = false;
        selectedCategoryDiv.innerHTML = '';
        return;
    }

    if (ulCategories.children.length === 0) {
        fetch('/api/categorys/')
            .then(res => res.json())
            .then(data => {
                ulCategories.innerHTML = '';
                data.results.forEach(cat => {
                    const li = document.createElement('li');
                    li.textContent = cat.category_name;
                    li.dataset.categoryId = cat.id;
                    ulCategories.appendChild(li);
                });
                categoryList.style.display = 'block';
                isCategoryVisible = true;
            })
            .catch(err => console.error('Ошибка при загрузке категорий:', err));
    } else {
        categoryList.style.display = 'block';
        isCategoryVisible = true;
    }

    if (subcategoriesCache.length === 0) {
        fetch('/api/subcategorys/')
            .then(res => res.json())
            .then(data => {
                subcategoriesCache = data.results;
            })
            .catch(err => console.error('Ошибка при загрузке подкатегорий:', err));
    }

    if (subsubcategoriesCache.length === 0) {
        fetch('/api/subsubcategorys/')
            .then(res => res.json())
            .then(data => {
                subsubcategoriesCache = data.results;
            })
            .catch(err => console.error('Ошибка при загрузке подподкатегорий:', err));
    }
});

let formData = {
    subsubId: null,
    options: {}
};

ulCategories.addEventListener('click', event => {
    const catLi = event.target;
    const categoryId = parseInt(catLi.dataset.categoryId);
    if (!categoryId) return;

    const filteredSubcategories = subcategoriesCache.filter(
        sub => sub.parent_category === categoryId
    );

    selectedCategoryDiv.innerHTML = `
        <strong>Подкатегории:</strong>
        <ul class="subcategoriesList" id="subcategoriesList"></ul>
        <div class="subsubcategoriesContainer" id="subsubcategoriesContainer"></div>
        <div class="category_options" id="categoryOptionsContainer"></div>
    `;

    const subUl = document.getElementById('subcategoriesList');
    const subsubContainer = document.getElementById('subsubcategoriesContainer');
    const optionsContainer = document.getElementById('categoryOptionsContainer');

    subUl.innerHTML = '';
    subsubContainer.innerHTML = '';
    optionsContainer.innerHTML = '';

    formData.subsubId = null;
    formData.options = {};

    filteredSubcategories.forEach(sub => {
        const li = document.createElement('li');
        li.textContent = sub.sub_category_name;
        li.dataset.subcategoryId = sub.id;
        li.style.cursor = 'pointer';
        subUl.appendChild(li);
    });

    subUl.onclick = (subEvent) => {
        const subLi = subEvent.target;
        const subcategoryId = parseInt(subLi.dataset.subcategoryId);
        if (!subcategoryId) return;

        const filteredSubsub = subsubcategoriesCache.filter(
            subsub => subsub.parent_subcategory === subcategoryId
        );

        subsubContainer.innerHTML = `<strong>Подподкатегории:</strong><ul id="subsubList"></ul>`;
        optionsContainer.innerHTML = '';

        const subsubUl = document.getElementById('subsubList');
        subsubUl.innerHTML = '';

        formData.subsubId = null;
        formData.options = {};

        filteredSubsub.forEach(ss => {
            const li = document.createElement('li');
            li.textContent = ss.subsub_category_name;
            li.dataset.subsubId = ss.id;
            li.style.cursor = 'pointer';
            subsubUl.appendChild(li);
        });

        subsubUl.onclick = async (ssEvent) => {
            const subsubLi = ssEvent.target;
            const subsubId = parseInt(subsubLi.dataset.subsubId);
            if (!subsubId) return;

            formData.subsubId = subsubId;
            formData.options = {};

            optionsContainer.innerHTML = '<strong>Опции:</strong>';

            try {
                const response = await fetch(`/api/category_options/${subsubId}/`);
                if (!response.ok) throw new Error('Ошибка загрузки опций');
                const data = await response.json();

                data.subsubcategories.forEach(optionGroup => {
                    const groupDiv = document.createElement('div');
                    groupDiv.style.marginBottom = '10px';

                    const title = document.createElement('p');
                    title.textContent = optionGroup.option_title;
                    title.style.fontWeight = 'bold';
                    groupDiv.appendChild(title);

                    optionGroup.category_option.forEach(opt => {
                        const label = document.createElement('label');
                        label.style.display = 'block';

                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = `option_${optionGroup.id}`;
                        input.value = opt.id;

                        input.addEventListener('change', () => {
                            formData.options[optionGroup.id] = opt.id;
                        });

                        label.appendChild(input);
                        label.appendChild(document.createTextNode(opt.option_field));
                        groupDiv.appendChild(label);
                    });

                    optionsContainer.appendChild(groupDiv);
                });

            } catch (error) {
                optionsContainer.innerHTML = 'Ошибка при загрузке опций';
                console.error(error);
            }
        };
    };
});

// Добавляем обработчик на кнопку "Опубликовать"
const publishBtn = document.querySelector('.cre_btn');

publishBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const selectedCityName = document.getElementById("cityInput").value.trim().toLowerCase();
    const cityId = cityMap[selectedCityName];

    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert('Токен не найден. Пожалуйста, войдите в систему.');
        return;
    }

    if (!formData.subsubId) {
        alert('Выберите подподкатегорию.');
        return;
    }

    if (Object.keys(formData.options).length === 0) {
        alert('Выберите опции категории.');
        return;
    }
    if (!cityId) {
        alert('Выберите город из выпадающего списка.');
        console.log(cityId);
        
        return;
    }

    const bodyCategoryOptions = {
        category: formData.subsubId,
        ad_categoy_fields: Object.entries(formData.options).map(([optionId, fieldId]) => ({
            option: parseInt(optionId),
            field: parseInt(fieldId)
        }))
    };


    try {
        const responseOptions = await fetch('/api/ad_category_options/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(bodyCategoryOptions)
        });

        if (!responseOptions.ok) {
            const errorData = await responseOptions.json();
            alert('Ошибка при отправке опций: ' + (errorData.detail || JSON.stringify(errorData)));
            return;
        }

        const dataOptions = await responseOptions.json();
        const adCategoryOptionsId = dataOptions.id;

        const formDataToSend = new FormData();

        selectedImages.forEach(file => {
            formDataToSend.append('uploaded_images', file);
        });

        formDataToSend.append('description', document.getElementById('cre_textarea').value.trim());
        formDataToSend.append('category', formData.subsubId);
        formDataToSend.append('category_options', adCategoryOptionsId);
        formDataToSend.append('price', document.querySelector('.cre_price input').value.trim());

        const currencyInput = document.querySelector('.cre_currency input[type="radio"]:checked');
        formDataToSend.append('currency', currencyInput ? currencyInput.value : '');

        formDataToSend.append('contact_name', 'Имя контакта'); // ← Замени на ввод с формы
        formDataToSend.append('phone_number', document.querySelector('.cre_phone input').value.trim());
        formDataToSend.append('hide_phone', true); // ← Или false
        formDataToSend.append('city', cityId); // ← Замени на динамический ID

        const responseAd = await fetch('/api/ad/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formDataToSend
        });

        if (!responseAd.ok) {
            const errorAd = await responseAd.json();
            alert('Ошибка при отправке объявления: ' + (errorAd.detail || JSON.stringify(errorAd)));
            return;
        }

        const dataAd = await responseAd.json();
        alert('Объявление успешно опубликовано!');
        console.log('✅ Объявление создано:', dataAd);

    } catch (error) {
        console.error('Ошибка при отправке объявления:', error);
        alert('Ошибка при отправке данных. Попробуйте позже.');
    }
});


