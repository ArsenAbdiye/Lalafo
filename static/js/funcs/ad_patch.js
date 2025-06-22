if (!localStorage.getItem('editAdId')) {
    console.warn('');
}

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

document.addEventListener('DOMContentLoaded', function () {
    const optionsBlock = document.querySelector('.cre_options');
    if (optionsBlock) {
        optionsBlock.style.display = 'block';
    }
});

const newImages = [];
const deletedImageIds = [];
const deletedEmailIds = [];
const deletedPhoneIds = [];
const deletedSocIds = []; // Если соцсети с id (массив с сервера), иначе можно не сохранять

document.addEventListener('DOMContentLoaded', async function () {
    const adId = localStorage.getItem('editAdId');
    if (!adId) return;

    try {
        const response = await fetch(`/api/ad_detail/${adId}/`);
        const data = await response.json();

        // Описание
        const descriptionTextarea = document.getElementById('cre_textarea');
        if (descriptionTextarea) {
            descriptionTextarea.value = data.description || '';
        }

        // Изображения
        const imageContainer = document.getElementById('imagePreviewContainer');
        imageContainer.innerHTML = '';
        data.images.forEach(img => {
            const image = document.createElement('img');
            image.src = img.image;
            image.dataset.id = img.id;
            image.style.cursor = 'pointer';

            image.addEventListener('click', () => {
                imageContainer.removeChild(image);
                if (img.id) {
                    deletedImageIds.push(img.id);
                }
            });

            imageContainer.appendChild(image);
        });

        // Обработчик новых изображений
        const imageInput = document.getElementById('imageInput');
        imageInput.addEventListener('change', function () {
            const files = Array.from(imageInput.files);

            files.forEach(file => {
                newImages.push(file);

                const reader = new FileReader();
                reader.onload = function (e) {
                    const imgEl = document.createElement('img');
                    imgEl.src = e.target.result;
                    imgEl.dataset.new = 'true';
                    imgEl.style.cursor = 'pointer';

                    imgEl.addEventListener('click', () => {
                        imageContainer.removeChild(imgEl);
                        const index = newImages.indexOf(file);
                        if (index !== -1) newImages.splice(index, 1);
                    });

                    imageContainer.appendChild(imgEl);
                };
                reader.readAsDataURL(file);
            });

            imageInput.value = '';
        });

        // Цена
        const priceInput = document.querySelector('.cre_price_options .cre_price .cre_inps');
        if (priceInput) priceInput.value = data.price || '';

        // Валюта
        const currencyInputs = document.querySelectorAll('input[name="currency"]');
        currencyInputs.forEach(input => {
            if (input.value === data.currency) input.checked = true;
        });

        // Телефон (основной)
        const phoneInput = document.querySelector('.cre_price_options .cre_phone .cre_inps');
        if (phoneInput) phoneInput.value = data.phone_number || '';

        // Город
        const cityInput = document.getElementById('cityInput');
        if (cityInput) cityInput.value = data.city.city_name || '';

        // -------------------
        // Дополнительные поля
        // -------------------

        // EMAILS
        if (data.emails && data.emails.length > 0) {
            const emailWrapper = document.querySelector('.cre_meails');
            emailWrapper.querySelectorAll('.cre_email').forEach(e => e.remove());

            data.emails.forEach(emailObj => {
                const div = document.createElement('div');
                div.className = 'cre_email';
                div.dataset.id = emailObj.id; // сохраняем id

                div.innerHTML = `
                    <input class="cre_email_inp cre_inps" type="text" placeholder="Email" value="${emailObj.email}">
                    <button class="cre_email_btn btn_cre remove_btn" type="button">удалить</button>
                `;
                emailWrapper.appendChild(div);
            });
        }

        // PHONE NUMBERS
        if (data.phone_numbers && data.phone_numbers.length > 0) {
            const phoneWrapper = document.querySelector('.cre_phones');
            phoneWrapper.querySelectorAll('.cre_phone').forEach(e => e.remove());

            data.phone_numbers.forEach(phoneObj => {
                const div = document.createElement('div');
                div.className = 'cre_phone';
                div.dataset.id = phoneObj.id; // сохраняем id

                div.innerHTML = `
                    <input class="cre_email_inp cre_inps" type="text" placeholder="Телефон" value="${phoneObj.number}">
                    <button class="cre_email_btn btn_cre remove_btn" type="button">удалить</button>
                `;
                phoneWrapper.appendChild(div);
            });
        }

        // SOCIAL NETWORK
        if (data.social_network && data.social_network.length > 0) {
            const socWrapper = document.querySelector('.cre_socs');
            socWrapper.querySelectorAll('.cre_soc').forEach(e => e.remove());

            data.social_network.forEach((soc, index) => {
                // Если у соцсетей есть id - можно присвоить, иначе можно использовать индекс
                const div = document.createElement('div');
                div.className = 'cre_soc';
                div.dataset.id = soc.id ?? `temp-${index}`; 

                div.innerHTML = `
                    <input class="cre_email_inp cre_inps" type="text" placeholder="Социальные ссылки" value="${soc.social_network_link ?? soc}">
                    <button class="cre_email_btn btn_cre remove_btn" type="button">удалить</button>
                `;
                socWrapper.appendChild(div);
            });
        }

        // --- Логика удаления для email, телефонов и соцсетей ---
        // Делегируем события кнопкам "удалить"
        function addRemoveListeners(containerSelector, deletedIdsArray) {
            const container = document.querySelector(containerSelector);
            container.addEventListener('click', event => {
                if (event.target.classList.contains('remove_btn')) {
                    const parentDiv = event.target.closest('div');
                    if (parentDiv && parentDiv.dataset.id) {
                        deletedIdsArray.push(parseInt(parentDiv.dataset.id));
                    }
                    parentDiv?.remove();
                }
            });
        }

        addRemoveListeners('.cre_meails', deletedEmailIds);
        addRemoveListeners('.cre_phones', deletedPhoneIds);
        addRemoveListeners('.cre_socs', deletedSocIds);

    } catch (error) {
        console.error('Ошибка при загрузке объявления:', error);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const days = {
        monday: 'Пн',
        tuesday: 'Вт',
        wednesday: 'Ср',
        thursday: 'Чт',
        friday: 'Пт',
        saturday: 'Сб',
        sunday: 'Вс'
    };

    const options = [
        'Выходной',
        'Утро',
        'День',
        'Вечер',
        'Круглосуточно'
    ];

    const container = document.getElementById('weekly-schedule');

    Object.entries(days).forEach(([key, label]) => {
        const wrapper = document.createElement('div');

        const selectLabel = document.createElement('label');
        selectLabel.textContent = `${label}: `;

        const select = document.createElement('select');
        select.name = key;
        select.id = key;

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Выбрать';
        select.appendChild(defaultOption);

        options.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });

        selectLabel.appendChild(select);
        wrapper.appendChild(selectLabel);
        container.appendChild(wrapper);
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // Email
    document.querySelector('.add_email_btn').addEventListener('click', () => {
        const container = document.createElement('div');
        container.className = 'cre_email';
        container.innerHTML = `
      <input class="cre_email_inp cre_inps" type="text" placeholder="Email">
      <button class="cre_email_btn btn_cre remove_btn" type="button">удалить</button>
    `;
        document.querySelector('.cre_meails').appendChild(container);
    });

    // Phone
    document.querySelector('.add_phone_btn').addEventListener('click', () => {
        const container = document.createElement('div');
        container.className = 'cre_phone';
        container.innerHTML = `
      <input class="cre_email_inp cre_inps" type="text" placeholder="Телефон">
      <button class="cre_email_btn btn_cre remove_btn" type="button">удалить</button>
    `;
        document.querySelector('.cre_phones').appendChild(container);
    });

    // Socs
    document.querySelector('.add_soc_btn').addEventListener('click', () => {
        const container = document.createElement('div');
        container.className = 'cre_soc';
        container.innerHTML = `
      <input class="cre_email_inp cre_inps" type="text" placeholder="Социальные ссылки">
      <button class="cre_email_btn btn_cre remove_btn" type="button">удалить</button>
    `;
        document.querySelector('.cre_socs').appendChild(container);
    });

    // Удаление любого доп. поля
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove_btn')) {
            const parent = e.target.parentElement;
            parent.remove();
        }
    });
});


document.querySelector('.cre_btn').addEventListener('click', async () => {
    const id = localStorage.getItem('editAdId');
    if (!id) {
        alert('ID объявления не найден');
        return;
    }

    const description = document.getElementById('cre_textarea').value.trim();
    const price = document.querySelector('.cre_price_options .cre_price .cre_inps').value.trim();
    const phone_number = document.querySelector('.cre_price_options .cre_phone .cre_inps').value.trim();
    const currencyEl = document.querySelector('input[name="currency"]:checked');
    const currency = currencyEl ? currencyEl.value : null;

    const token = localStorage.getItem('accessToken');

    const body = {
        description,
        price,
        currency,
        contact_name: "string",
        phone_number,
        hide_phone: true
    };

    try {
        // PATCH объявление
        const res = await fetch(`/api/ad_update/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert('Ошибка обновления: ' + JSON.stringify(errorData));
            return;
        }

        // DELETE удалённые изображения
        for (const imgId of deletedImageIds) {
            await fetch(`/api/ad_images/${imgId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }

        // POST новые изображения
        for (const file of newImages) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('ad', id);
            await fetch('/api/ad_images/', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
        }

        // DELETE удалённые EMAIL
        for (const emailId of deletedEmailIds) {
            await fetch(`/api/email/${emailId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }

        // POST новые EMAIL
        const emailInputs = document.querySelectorAll('.cre_meails .cre_email input[type="text"]');
        for (const input of emailInputs) {
            const val = input.value.trim();
            if (val && !input.closest('.cre_email').dataset.id) {
                await fetch('/api/email/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ email: val, ad: parseInt(id) })
                });
            }
        }

        // DELETE удалённые PHONE
        for (const phoneId of deletedPhoneIds) {
            await fetch(`/api/phone_number/${phoneId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }

        // POST новые PHONE
        const phoneInputs = document.querySelectorAll('.cre_phones .cre_phone input[type="text"]');
        for (const input of phoneInputs) {
            const val = input.value.trim();
            if (val && !input.closest('.cre_phone').dataset.id) {
                await fetch('/api/phone_number/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ number: val, ad: parseInt(id) })
                });
            }
        }

        // DELETE удалённые СОЦСЕТИ
        for (const socId of deletedSocIds) {
            await fetch(`/api/social_netrwork/${socId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }

        // POST новые СОЦСЕТИ
        const socInputs = document.querySelectorAll('.cre_socs .cre_soc input[type="text"]');
        for (const input of socInputs) {
            console.log(input.value.trim());
            
            const val = input.value.trim();
            if (val && !input.closest('.cre_soc').dataset.id) {
                await fetch('/api/social_netrwork/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ social_network_link: val, ad: parseInt(id) })
                });
            }
        }

        alert('Объявление успешно обновлено');

    } catch (error) {
        alert('Ошибка сети: ' + error.message);
    }
});


