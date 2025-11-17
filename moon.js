// Лунный календарь - расчет фаз Луны
class MoonCalendar {
    constructor() {
        this.lunarCycle = 29.530588853; // Длина лунного цикла в днях
        this.newMoon2000 = new Date('2000-01-06T18:14:00Z'); // Известное новолуние
    }
    
    // Расчет юлианской даты
    toJulian(date) {
        return date / 86400000 + 2440587.5;
    }
    
    // Расчет лунного возраста в днях
    getMoonAge(date = new Date()) {
        const julianDate = this.toJulian(date);
        const julianNewMoon = this.toJulian(this.newMoon2000);
        const daysSinceNewMoon = (julianDate - julianNewMoon) % this.lunarCycle;
        return daysSinceNewMoon >= 0 ? daysSinceNewMoon : daysSinceNewMoon + this.lunarCycle;
    }
    
    // Получение лунной фазы
    getMoonPhase(age) {
        if (age < 1) return "Новолуние";
        if (age < 7.4) return "Растущая луна";
        if (age < 14.8) return "Первая четверть";
        if (age < 22.1) return "Полнолуние";
        if (age < 29.5) return "Убывающая луна";
        return "Новолуние";
    }
    
    // Расчет видимости Луны
    getMoonVisibility(age) {
        const phase = age / this.lunarCycle;
        let visibility;
        
        if (phase < 0.25) {
            visibility = Math.sin(phase * 2 * Math.PI) * 50;
        } else if (phase < 0.5) {
            visibility = 50 + Math.sin((phase - 0.25) * 2 * Math.PI) * 50;
        } else if (phase < 0.75) {
            visibility = 100 - Math.sin((phase - 0.5) * 2 * Math.PI) * 50;
        } else {
            visibility = 50 - Math.sin((phase - 0.75) * 2 * Math.PI) * 50;
        }
        
        return Math.round(visibility);
    }
    
    // Лунный день
    getMoonDay(age) {
        return Math.floor(age) + 1;
    }
    
    // Визуализация Луны
    drawMoon(age, element) {
        const phase = age / this.lunarCycle;
        let shadow;
        
        if (phase < 0.5) {
            // Растущая луна
            shadow = 50 - Math.sin(phase * 2 * Math.PI) * 50;
        } else {
            // Убывающая луна
            shadow = 50 + Math.sin((phase - 0.5) * 2 * Math.PI) * 50;
        }
        
        element.style.background = `
            radial-gradient(circle at ${shadow}% 50%, 
                transparent 45%, 
                var(--card-bg) 46%
            ),
            radial-gradient(circle, 
                var(--accent-warning) 45%, 
                transparent 46%
            )
        `;
    }
    
    // Рекомендации по лунной фазе
    getRecommendations(phase, day) {
        const favorable = [];
        const unfavorable = [];
        
        switch(phase) {
            case "Новолуние":
                favorable.push("Начинать новые проекты", "Планировать будущее", "Медитировать");
                unfavorable.push("Принимать важные решения", "Заключать договора", "Начинать путешествия");
                break;
            case "Растущая луна":
                favorable.push("Начинать обучение", "Заниматься спортом", "Делать инвестиции");
                unfavorable.push("Проводить операции", "Завершать дела", "Увольняться с работы");
                break;
            case "Первая четверть":
                favorable.push("Проявлять инициативу", "Решать конфликты", "Заключать сделки");
                unfavorable.push("Откладывать дела", "Начинать ремонт", "Менять имидж");
                break;
            case "Полнолуние":
                favorable.push("Творческая работа", "Общение с друзьями", "Романтические встречи");
                unfavorable.push("Принимать серьезные решения", "Конфликтовать", "Управлять транспортом");
                break;
            case "Убывающая луна":
                favorable.push("Завершать проекты", "Избавляться от старого", "Проводить уборку");
                unfavorable.push("Начинать новое", "Делать покупки", "Знакомиться с людьми");
                break;
        }
        
        // Особые рекомендации для лунных дней
        if (day === 1) {
            favorable.push("Составлять планы на месяц");
        } else if (day === 9) {
            unfavorable.push("Начинать путешествия");
        } else if (day === 15) {
            favorable.push("Творческая реализация");
        } else if (day === 23) {
            unfavorable.push("Заключать брак");
        } else if (day === 29) {
            favorable.push("Отдых и медитация");
        }
        
        return { favorable, unfavorable };
    }
    
    // Прогноз на день
    getDayForecast(phase, day) {
        const forecasts = {
            "Новолуние": "День новых начинаний. Энергия только накапливается, лучше сосредоточиться на планировании.",
            "Растущая луна": "Период роста и развития. Отличное время для старта проектов и получения новых знаний.",
            "Первая четверть": "Время активных действий. Преодолевайте препятствия и двигайтесь к целям.",
            "Полнолуние": "Пик энергетики. Эмоции могут быть heightened, будьте внимательны в общении.",
            "Убывающая луна": "Время завершений. Избавляйтесь от ненужного и подводите итоги."
        };
        
        return forecasts[phase] || "Нейтральный день. Действуйте по обстоятельствам.";
    }
}

// Инициализация лунного календаря
document.addEventListener('DOMContentLoaded', function() {
    const moonCalc = new MoonCalendar();
    
    function updateMoonInfo() {
        const now = new Date();
        const age = moonCalc.getMoonAge(now);
        const phase = moonCalc.getMoonPhase(age);
        const day = moonCalc.getMoonDay(age);
        const visibility = moonCalc.getMoonVisibility(age);
        
        // Обновляем текущую фазу
        document.getElementById('current-phase').textContent = phase;
        document.getElementById('moon-day').textContent = day;
        document.getElementById('moon-visibility').textContent = visibility + '%';
        
        // Визуализация Луны
        const moonVisual = document.getElementById('moon-visual');
        moonCalc.drawMoon(age, moonVisual);
        
        // Описание фазы
        const phaseDescriptions = {
            "Новолуние": "Луна не видна на небе. Время новых начинаний и планирования.",
            "Растущая луна": "Луна растет. Благоприятное время для старта проектов и роста.",
            "Первая четверть": "Половина Луны освещена. Время активных действий и решений.",
            "Полнолуние": "Луна полностью освещена. Пик энергетики и эмоциональности.",
            "Убывающая луна": "Луна убывает. Время завершений и подведения итогов."
        };
        document.getElementById('phase-description').textContent = phaseDescriptions[phase];
        
        // Прогноз на 3 дня
        updateForecast(moonCalc);
        
        // Рекомендации
        updateRecommendations(moonCalc, phase, day);
    }
    
    function updateForecast(moonCalc) {
        for (let i = 0; i < 3; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            
            const age = moonCalc.getMoonAge(date);
            const phase = moonCalc.getMoonPhase(age);
            const day = moonCalc.getMoonDay(age);
            
            const dayNames = ['Сегодня', 'Завтра', 'Послезавтра'];
            const elements = {
                moon: document.getElementById(`moon-${['today', 'tomorrow', 'dayafter'][i]}`),
                forecast: document.getElementById(`forecast-${['today', 'tomorrow', 'dayafter'][i]}`)
            };
            
            moonCalc.drawMoon(age, elements.moon);
            elements.forecast.textContent = moonCalc.getDayForecast(phase, day);
        }
    }
    
    function updateRecommendations(moonCalc, phase, day) {
        const recommendations = moonCalc.getRecommendations(phase, day);
        
        const favorableList = document.getElementById('favorable-list');
        const unfavorableList = document.getElementById('unfavorable-list');
        
        favorableList.innerHTML = '';
        unfavorableList.innerHTML = '';
        
        recommendations.favorable.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            favorableList.appendChild(li);
        });
        
        recommendations.unfavorable.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            unfavorableList.appendChild(li);
        });
    }
    
    // Запускаем обновление
    updateMoonInfo();
    
    // Обновляем каждые 10 минут
    setInterval(updateMoonInfo, 600000);
});