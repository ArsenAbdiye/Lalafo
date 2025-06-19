document.addEventListener('DOMContentLoaded', () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        console.warn('Токен не найден, пользователь не авторизован.');
        return;
    }

    fetch('http://127.0.0.1:8000/api/user_options/0/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при получении данных профиля');
        }
        return response.json();
    })
    .then(data => {
        // Вставка фото
        const imgTag = document.querySelector('.user_image_setin img');
        
        if (imgTag && data.user_image) {
            imgTag.src = data.user_image;
        }

        // Вставка имени
        const nameInput = document.querySelector('.user_name_set input');
        if (nameInput && data.usernickname) {
            nameInput.value = data.usernickname;
        }

        // Вставка описания
        const aboutTextarea = document.querySelector('.user_disc_set textarea');
        if (aboutTextarea && data.user_discription) {
            // Очищаем от HTML, если нужно — или можно вставить как innerHTML в другой контейнер
            aboutTextarea.value = data.user_discription.replace(/<\/?[^>]+(>|$)/g, "");
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('userFileInput');
    const chooseBtn = document.querySelector('.user_img_btn_set button:first-child');
    const deleteBtn = document.querySelector('.user_img_btn_set button:last-child');
    const imageTag = document.querySelector('.user_image_setin img');

    // Загрузка из localStorage при старте
    const storedImage = localStorage.getItem('user_profile_image');
    if (storedImage && imageTag) {
        imageTag.src = storedImage;
    }

    // Открыть выбор файла
    chooseBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // При выборе файла
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageUrl = event.target.result;
                imageTag.src = imageUrl;
                localStorage.setItem('user_profile_image', imageUrl); // сохраняем в localStorage
            };
            reader.readAsDataURL(file);
        }
    });

    // Удалить изображение
    deleteBtn.addEventListener('click', () => {
        imageTag.src = '';
        localStorage.removeItem('user_profile_image');
        fileInput.value = ''; // сбросить выбранный файл
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('userNameInput');
    const aboutTextarea = document.getElementById('userAboutTextarea');

    // Загружаем данные из localStorage
    const savedName = localStorage.getItem('user_name');
    const savedAbout = localStorage.getItem('user_about');

    if (savedName) {
        nameInput.value = savedName;
    }

    if (savedAbout) {
        aboutTextarea.value = savedAbout;
    }

    // Сохраняем имя при вводе
    nameInput.addEventListener('input', () => {
        localStorage.setItem('user_name', nameInput.value);
    });

    // Сохраняем "о себе" при вводе
    aboutTextarea.addEventListener('input', () => {
        localStorage.setItem('user_about', aboutTextarea.value);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.querySelector('.save_set');

    saveBtn.addEventListener('click', async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('Вы не авторизованы');
            return;
        }

        // Собираем данные из localStorage и полей
        const userImage = localStorage.getItem('user_profile_image'); // base64
        const userName = document.getElementById('userNameInput').value;
        const userAbout = document.getElementById('userAboutTextarea').value;

        // Преобразование base64 изображения в Blob
        const imageBlob = userImage ? dataURLtoBlob(userImage) : null;
        const formData = new FormData();

        if (imageBlob) {
            formData.append('user_image', imageBlob, 'profile.jpg');
        }

        formData.append('usernickname', userName || '');
        formData.append('user_discription', userAbout || '');
        formData.append('is_vip', false);  // можно заменить значением из чекбокса
        formData.append('is_pro', false);  // можно заменить значением из чекбокса

        try {
            const response = await fetch('http://127.0.0.1:8000/api/user_options/0/', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (response.ok) {
                alert('Данные успешно сохранены!');
            } else {
                const errorData = await response.json();
                console.error('Ошибка:', errorData);
                alert('Ошибка при сохранении данных');
            }
        } catch (error) {
            console.error('Ошибка при отправке:', error);
            alert('Ошибка соединения');
        }
    });

    function dataURLtoBlob(dataURL) {
        const byteString = atob(dataURL.split(',')[1]);
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    }
});


