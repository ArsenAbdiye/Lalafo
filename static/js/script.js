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
            div.dataset.productId = ad.id;
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


document.querySelectorAll('.log_btn').forEach(btn => {
    btn.addEventListener('click', () => {
        closeAll();
        document.querySelector('.log_inp').style.left = '0';
    });
});

document.querySelectorAll('.log').forEach(btn => {
    btn.addEventListener('click', () => {
        closeAll();
        document.querySelector('.log_inp').style.left = '0';
    });
});

document.querySelectorAll('.reg_btn').forEach(btn => {
    btn.addEventListener('click', () => {
        closeAll();
        document.querySelector('.reg_inp').style.left = '0';
    });
});

document.querySelectorAll('.res_btn').forEach(btn => {
    btn.addEventListener('click', () => {
        closeAll();
        document.querySelector('.res_pass').style.left = '0';
    });
});

document.querySelectorAll('.modal__close').forEach(btn => {
    btn.addEventListener('click', () => {
        closeAll();
    });
});


function closeAll() {
    document.querySelector('.log_inp').style.left = '-100%';
    document.querySelector('.reg_inp').style.left = '-100%';
    document.querySelector('.res_pass').style.left = '-100%';
}


document.addEventListener('DOMContentLoaded', () => {
    // Проверка: если пользователь залогинен
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        document.querySelector('.log')?.style.setProperty('display', 'none', 'important');
        document.querySelector('.user_info')?.style.setProperty('display', 'block', 'important');
    }

    // Авторизация по кнопке
    document.querySelector('.login_btn').addEventListener('click', async () => {
        const username = document.querySelector('.login_email_input').value.trim();
        const password = document.querySelector('.login_password_input').value.trim();

        if (!username || !password) {
            console.error('Username или password пусты');
            return;
        }

        try {
            const response = await fetch('/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                alert('Ошибка авторизации, не верный пароль либо акаунт не потвержден')
                throw new Error('Ошибка авторизации');
            }

            const data = await response.json();

            console.log('Ответ сервера:', data);

            // Сохраняем токены
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            // Скрываем логин и показываем инфо
            document.querySelector('.log')?.style.setProperty('display', 'none', 'important');
            document.querySelector('.user_info')?.style.setProperty('display', 'block', 'important');

            alert('Успешный вход!');

        } catch (error) {
            console.error('Ошибка при получении токена:', error);
        }
    });
});

document.querySelector('.get_out')?.addEventListener('click', () => {
    // Удаляем токены из localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Показываем блок логина и скрываем user_info
    document.querySelector('.log')?.style.setProperty('display', 'block', 'important');
    document.querySelector('.user_info')?.style.setProperty('display', 'none', 'important');

    alert('Вы вышли из аккаунта');
});

document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) return;

    try {
        const userId = 0; // Заменить на нужный ID

        const response = await fetch(`/api/user_options/${userId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Не удалось получить данные пользователя');

        const data = await response.json();

        // Элементы
        const userImg = document.querySelector('.user_img');
        const userName = document.querySelector('.user_name');

        // Фото по умолчанию
        const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaUTp3j_LpF5r5_gNdvW0g7p057ExdcHWbUQ&s';

        // Вставка данных
        userImg.src = data.user_image || defaultImage;
        userName.textContent = data.usernickname || 'Без имени';

    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
    }
});



document.querySelectorAll('.user_button').forEach(btn => {
    btn.addEventListener('click', () => {
        const menu = document.querySelector('.user_menu');
        const isVisible = menu.style.display === 'block';
        menu.style.display = isVisible ? 'none' : 'block'; // Переключить
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.reset_btn')?.addEventListener('click', async () => {
        const email = document.querySelector('.reset_email_input')?.value.trim();

        if (!email) {
            alert('Пожалуйста, введите email');
            return;
        }

        try {
            const response = await fetch('/api/password_reset_email/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Ошибка при сбросе пароля');
            }

            alert('Новый пароль отправлен на вашу почту');

        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
            alert(`Ошибка: ${error.message}`);
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const regButton = document.querySelector('.reg_btn_reg');
    const backButton = document.querySelector('.back');
    const codebtn = document.querySelector('.codebtn')

    function updateView() {
        const showCode = localStorage.getItem('showCode');
        if (showCode === 'true') {
            // Скрыть регистрацию и дополнительные блоки
            document.querySelectorAll('.loginp, .log_or_reg, .logbtns').forEach(el => el.style.display = 'none');
            // Показать код
            document.querySelectorAll('.code').forEach(el => el.style.display = 'block');
        } else {
            // Показать регистрацию и дополнительные блоки
            document.querySelectorAll('.loginp,.logbtns').forEach(el => el.style.display = 'block');
            document.querySelectorAll('.log_or_reg').forEach(el => el.style.display = 'flex');
            // Скрыть код
            document.querySelectorAll('.code').forEach(el => el.style.display = 'none');
        }
    }

    updateView();

    regButton?.addEventListener('click', async () => {
        const email = document.querySelector('.reg_inp_email')?.value.trim();
        const password = document.querySelector('.reg_enp_password')?.value.trim();
        const confirm = document.querySelector('.reg_confirm')?.checked;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Введите корректный email');
            return;
        }

        if (!password) {
            alert('Введите пароль');
            return;
        }

        if (!confirm) {
            alert('Вы должны согласиться с условиями');
            return;
        }

        try {
            const response = await fetch('/api/registry_password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Ошибка сервера:', data);
                throw new Error(data.detail || JSON.stringify(data));
            }

            localStorage.setItem('showCode', 'true');
            updateView();

            alert('Регистрация прошла успешно! Введите код из почты.');

        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            alert(`Ошибка: ${error.message}`);
        }
    });

    backButton?.addEventListener('click', () => {
        localStorage.removeItem('showCode');
        updateView();
    });

    codebtn?.addEventListener('click', () => {
        localStorage.setItem('showCode', 'true');
        updateView();
    });
});



document.addEventListener('DOMContentLoaded', () => {
    const checkBtn = document.querySelector('.check');
    const resetBtn = document.querySelector('.reset');

    checkBtn?.addEventListener('click', async () => {
        const email = document.querySelector('.code_inp_mail')?.value.trim();
        const code = document.querySelector('.code_inp')?.value.trim();

        if (!email || !code) {
            alert('Пожалуйста, введите email и код');
            return;
        }

        try {
            const response = await fetch('/api/confirm_account/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || JSON.stringify(data));
            }

            alert('Аккаунт подтвержден успешно!');

            // Если нужно, можно сбросить localStorage и показать исходный экран
            localStorage.removeItem('showCode');
            // Переключить вид, если есть функция updateView из предыдущего кода:
            if (typeof updateView === 'function') {
                updateView();
            }

        } catch (error) {
            console.error('Не верный код, либо код он истек:', error);
            alert(`Ошибка: ${error.message}`);
        }
    });

    resetBtn?.addEventListener('click', async () => {
        const email = document.querySelector('.code_inp_mail')?.value.trim();

        if (!email) {
            alert('Пожалуйста, введите email');
            return;
        }

        try {
            const response = await fetch('/api/resend_code/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || JSON.stringify(data));
            }

            alert('Код успешно отправлен повторно!');

        } catch (error) {
            console.error('Ошибка при повторной отправке кода:', error);
            alert(`Ошибка: ${error.message}`);
        }
    });
});


document.querySelector('.google_login_btn').addEventListener('click', () => {
    const clientId = '855620373622-hlvav5npqebntirnsd29nfjr42rg4f33.apps.googleusercontent.com'; // Подставь свой Client ID
    const redirectUri = 'http://localhost:8000';
    const scope = 'openid email profile';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth` +
        `?response_type=code` +
        `&client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&access_type=offline&prompt=consent`;

    window.location.href = authUrl;
});


const clientId = '855620373622-hlvav5npqebntirnsd29nfjr42rg4f33.apps.googleusercontent.com';
const redirectUri = 'http://localhost:8000';
const scope = 'openid email profile'; // Запрашиваем профиль, email и openid
const responseType = 'id_token';
const nonce = 'random_nonce_123456'; // Для безопасности — лучше генерировать случайно

document.querySelectorAll('.google_login_btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=${responseType}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&nonce=${nonce}` +
      `&prompt=select_account`;

    window.location.href = authUrl;
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const idToken = hashParams.get('id_token');

  if (idToken) {
    fetch('/api/auth/google/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ google_token: idToken }),
    })
    .then(res => {
      if (!res.ok) throw new Error('Ошибка авторизации');
      return res.json();
    })
    .then(data => {
      localStorage.setItem('accessToken', data.access);
      // Очистить URL от хеша
      window.history.replaceState({}, document.title, '/');
      // Обновить интерфейс, например показать пользователя
    })
    .catch(err => console.error('Ошибка авторизации:', err));
  }
});