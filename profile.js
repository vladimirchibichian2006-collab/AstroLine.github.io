// profile.js - Логика работы профиля пользователя

document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const profileEdit = document.getElementById('profile-edit');
    const profileView = document.getElementById('profile-view');
    const profileForm = document.getElementById('profile-form');
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarDisplay = document.getElementById('avatar-display');
    const removeAvatarBtn = document.getElementById('remove-avatar');
    const editProfileBtn = document.getElementById('edit-profile');
    const logoutBtn = document.getElementById('logout-btn');
    const resetBtn = document.getElementById('reset-btn');
    const birthDateInput = document.getElementById('birth-date');
    const zodiacSignSelect = document.getElementById('zodiac-sign');
    const horoscopePreview = document.getElementById('horoscope-preview');
    const horoscopeContent = document.getElementById('horoscope-content');

    // Текущий аватар в base64
    let currentAvatar = null;

    // Инициализация
    initProfile();

    // Функция инициализации профиля
    function initProfile() {
        loadProfileData();
        setupEventListeners();
        
        // Показать анимацию появления
        setTimeout(() => {
            profileEdit.style.opacity = '1';
            profileEdit.style.transform = 'translateY(0)';
        }, 100);
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Отправка формы
        profileForm.addEventListener('submit', handleFormSubmit);
        
        // Загрузка аватарки
        avatarUpload.addEventListener('change', handleAvatarUpload);
        
        // Удаление аватарки
        removeAvatarBtn.addEventListener('click', removeAvatar);
        
        // Редактирование профиля
        editProfileBtn.addEventListener('click', switchToEditMode);
        
        // Выход из профиля
        logoutBtn.addEventListener('click', handleLogout);
        
        // Сброс данных
        resetBtn.addEventListener('click', handleReset);
        
        // Автоматическое определение знака зодиака
        birthDateInput.addEventListener('change', updateZodiacSign);
    }

    // Обработчик отправки формы
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = profileForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        
        // Показать индикатор загрузки
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        submitBtn.disabled = true;
        
        // Собрать данные формы
        const formData = {
            name: document.getElementById('user-name').value.trim(),
            birthDate: birthDateInput.value,
            zodiacSign: zodiacSignSelect.value,
            city: document.getElementById('user-city').value.trim(),
            email: document.getElementById('user-email').value.trim(),
            bio: document.getElementById('user-bio').value.trim(),
            avatar: currentAvatar
        };
        
        // Имитация задержки сервера
        setTimeout(() => {
            saveProfileData(formData);
            showProfileView(formData);
            
            // Скрыть индикатор загрузки
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
            
            showNotification('Данные успешно сохранены!', 'success');
        }, 1000);
    }

    // Загрузка аватарки
    function handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            showNotification('Пожалуйста, выберите изображение', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showNotification('Размер файла не должен превышать 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            currentAvatar = e.target.result;
            updateAvatarPreview(currentAvatar);
            showNotification('Аватарка успешно загружена', 'success');
        };
        reader.readAsDataURL(file);
    }

    // Удаление аватарки
    function removeAvatar() {
        currentAvatar = null;
        updateAvatarPreview(null);
        showNotification('Аватарка удалена', 'info');
    }

    // Обновление превью аватарки
    function updateAvatarPreview(avatarData) {
        const placeholder = avatarPreview.querySelector('.avatar-placeholder');
        
        if (avatarData) {
            avatarPreview.style.backgroundImage = `url(${avatarData})`;
            avatarPreview.classList.add('has-avatar');
            placeholder.style.display = 'none';
        } else {
            avatarPreview.style.backgroundImage = '';
            avatarPreview.classList.remove('has-avatar');
            placeholder.style.display = 'block';
        }
    }

    // Обновление отображения аватарки
    function updateAvatarDisplay(avatarData) {
        const placeholder = avatarDisplay.querySelector('.avatar-placeholder');
        
        if (avatarData) {
            avatarDisplay.style.backgroundImage = `url(${avatarData})`;
            avatarDisplay.classList.add('has-avatar');
            placeholder.style.display = 'none';
        } else {
            avatarDisplay.style.backgroundImage = '';
            avatarDisplay.classList.remove('has-avatar');
            placeholder.style.display = 'block';
        }
    }

    // Автоматическое определение знака зодиака
    function updateZodiacSign() {
        const birthDate = new Date(birthDateInput.value);
        const zodiacSign = calculateZodiacSign(birthDate);
        
        if (zodiacSign) {
            zodiacSignSelect.value = zodiacSign;
        }
    }

    // Расчет знака зодиака по дате
    function calculateZodiacSign(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Овен";
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Телец";
        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Близнецы";
        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Рак";
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Лев";
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Дева";
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Весы";
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Скорпион";
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Стрелец";
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Козерог";
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Водолей";
        if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Рыбы";
        
        return null;
    }

    // Загрузка данных профиля
    function loadProfileData() {
        const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
        
        if (savedProfile) {
            // Заполнить форму данными
            document.getElementById('user-name').value = savedProfile.name || '';
            birthDateInput.value = savedProfile.birthDate || '';
            zodiacSignSelect.value = savedProfile.zodiacSign || '';
            document.getElementById('user-city').value = savedProfile.city || '';
            document.getElementById('user-email').value = savedProfile.email || '';
            document.getElementById('user-bio').value = savedProfile.bio || '';
            
            if (savedProfile.avatar) {
                currentAvatar = savedProfile.avatar;
                updateAvatarPreview(currentAvatar);
            }
            
            // Показать режим просмотра
            showProfileView(savedProfile);
        }
    }

    // Сохранение данных профиля
    function saveProfileData(profileData) {
        localStorage.setItem('userProfile', JSON.stringify(profileData));
    }

    // Показать режим просмотра профиля
    function showProfileView(profileData) {
        // Обновить данные отображения
        document.getElementById('display-name').textContent = profileData.name || 'Не указано';
        document.getElementById('display-birthdate').textContent = profileData.birthDate ? 
            new Date(profileData.birthDate).toLocaleDateString('ru-RU') : 'Не указана';
        document.getElementById('display-zodiac').textContent = profileData.zodiacSign || 'Не указан';
        document.getElementById('display-city').textContent = profileData.city || 'Не указан';
        document.getElementById('display-email').textContent = profileData.email || 'Не указан';
        document.getElementById('display-bio').textContent = profileData.bio || 'Не указано';
        
        // Обновить аватар
        updateAvatarDisplay(profileData.avatar);
        
        // Загрузить гороскоп
        loadHoroscope(profileData.zodiacSign);
        
        // Переключить режимы
        switchToViewMode();
    }

    // Переключение в режим редактирования
    function switchToEditMode() {
        profileView.style.opacity = '0';
        profileView.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            profileView.style.display = 'none';
            profileEdit.style.display = 'block';
            
            setTimeout(() => {
                profileEdit.style.opacity = '1';
                profileEdit.style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    }

    // Переключение в режим просмотра
    function switchToViewMode() {
        profileEdit.style.opacity = '0';
        profileEdit.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            profileEdit.style.display = 'none';
            profileView.style.display = 'block';
            
            setTimeout(() => {
                profileView.style.opacity = '1';
                profileView.style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    }

    // Загрузка гороскопа
    function loadHoroscope(zodiacSign) {
        if (!zodiacSign) {
            horoscopePreview.style.display = 'none';
            return;
        }
        
        // Показать блок гороскопа
        horoscopePreview.style.display = 'block';
        horoscopeContent.textContent = 'Загрузка...';
        
        // Имитация загрузки гороскопа
        setTimeout(() => {
            const horoscopes = {
                'Овен': 'Сегодня прекрасный день для новых начинаний! Энергия Марса наполняет вас силой и решимостью.',
                'Телец': 'День стабильности и гармонии. Отличное время для финансовых операций и укрепления отношений.',
                'Близнецы': 'Общение и новые знакомства принесут удачу. Будьте открыты для неожиданных встреч.',
                'Рак': 'Эмоциональный день. Прислушайтесь к интуиции - она подскажет верное решение.',
                'Лев': 'Ваша харизма на высоте! Используйте это для продвижения творческих проектов.',
                'Дева': 'Внимание к деталям принесет успех. Идеальный день для планирования и анализа.',
                'Весы': 'Гармония в отношениях. Решите давние конфликты и найдите компромиссы.',
                'Скорпион': 'Глубокие трансформации. День подходит для избавления от старого и ненужного.',
                'Стрелец': 'Путешествия и обучение принесут новые возможности. Расширяйте горизонты!',
                'Козерог': 'Карьерный рост и достижение целей. Ваша настойчивость будет вознаграждена.',
                'Водолей': 'Инновации и оригинальные идеи. Делитесь своими мыслями с окружающими.',
                'Рыбы': 'Творческое вдохновение и духовный рост. Идеальное время для медитации.'
            };
            
            horoscopeContent.textContent = horoscopes[zodiacSign] || 'Гороскоп временно недоступен для вашего знака.';
        }, 1500);
    }

    // Обработчик выхода
    function handleLogout() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            localStorage.removeItem('userProfile');
            window.location.href = 'index.html';
        }
    }

    // Обработчик сброса данных
    function handleReset() {
        if (confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
            localStorage.removeItem('userProfile');
            profileForm.reset();
            currentAvatar = null;
            updateAvatarPreview(null);
            showNotification('Все данные сброшены', 'info');
        }
    }

    // Показать уведомление
    function showNotification(message, type = 'info') {
        // Создать элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Добавить стили
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#1e90ff'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        // Обработчик закрытия
        notification.querySelector('.notification-close').onclick = () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        };
        
        // Добавить в DOM
        document.body.appendChild(notification);
        
        // Автоматическое закрытие
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }

    // Добавить CSS анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);
});
// Функция для обновления иконки профиля в хедере
function updateProfileIcon(avatarData) {
    const profileIcon = document.querySelector('.profile-icon-inner');
    if (!profileIcon) return;
    
    if (avatarData) {
        // Создаем изображение для иконки
        profileIcon.innerHTML = '';
        const img = document.createElement('img');
        img.src = avatarData;
        img.alt = 'Аватар';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        profileIcon.appendChild(img);
    } else {
        // Возвращаем стандартную иконку
        profileIcon.innerHTML = '👤';
        profileIcon.style.fontSize = '1.2rem';
    }
}

// Обновить функцию handleAvatarUpload
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showNotification('Пожалуйста, выберите изображение', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Размер файла не должен превышать 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentAvatar = e.target.result;
        updateAvatarPreview(currentAvatar);
        updateProfileIcon(currentAvatar); // ← ДОБАВИТЬ ЭТУ СТРОКУ
        showNotification('Аватарка успешно загружена', 'success');
    };
    reader.readAsDataURL(file);
}

// Обновить функцию removeAvatar
function removeAvatar() {
    currentAvatar = null;
    updateAvatarPreview(null);
    updateProfileIcon(null); // ← ДОБАВИТЬ ЭТУ СТРОКУ
    showNotification('Аватарка удалена', 'info');
}

// Обновить функцию loadProfileData
function loadProfileData() {
    const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
    
    if (savedProfile) {
        // Заполнить форму данными
        document.getElementById('user-name').value = savedProfile.name || '';
        birthDateInput.value = savedProfile.birthDate || '';
        zodiacSignSelect.value = savedProfile.zodiacSign || '';
        document.getElementById('user-city').value = savedProfile.city || '';
        document.getElementById('user-email').value = savedProfile.email || '';
        document.getElementById('user-bio').value = savedProfile.bio || '';
        
        if (savedProfile.avatar) {
            currentAvatar = savedProfile.avatar;
            updateAvatarPreview(currentAvatar);
            updateProfileIcon(currentAvatar); // ← ДОБАВИТЬ ЭТУ СТРОКУ
        }
        
        // Показать режим просмотра
        showProfileView(savedProfile);
    }
}

// Обновить функцию handleFormSubmit
function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = profileForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Показать индикатор загрузки
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    submitBtn.disabled = true;
    
    // Собрать данные формы
    const formData = {
        name: document.getElementById('user-name').value.trim(),
        birthDate: birthDateInput.value,
        zodiacSign: zodiacSignSelect.value,
        city: document.getElementById('user-city').value.trim(),
        email: document.getElementById('user-email').value.trim(),
        bio: document.getElementById('user-bio').value.trim(),
        avatar: currentAvatar
    };
    
    // Имитация задержки сервера
    setTimeout(() => {
        saveProfileData(formData);
        showProfileView(formData);
        
        // Обновить иконку профиля
        updateProfileIcon(formData.avatar); // ← ДОБАВИТЬ ЭТУ СТРОКУ
        
        // Скрыть индикатор загрузки
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
        
        showNotification('Данные успешно сохранены!', 'success');
    }, 1000);
}