document.addEventListener('DOMContentLoaded', () => {

    // 1. Изменение шапки при скролле
    const header = document.querySelector('.header');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 2. Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('menu-open');
            // Опционально: анимация "гамбургера" в крестик
            // Для этого можно добавить CSS класс
            menuToggle.classList.toggle('active');
        });

        // Закрывать меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('menu-open');
                menuToggle.classList.remove('active');
            });
        });
    }

    // 3. Табы локаций
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');

            // Удаляем активный класс у всех
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Добавляем активный класс нажатому
            btn.classList.add('active');

            // Показываем нужный контент
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // 4. Появление элементов при скролле (Intersection Observer)
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); // Анимируем только один раз
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // 5. Нативный CSS scroll-behavior используется вместо JS.
});

// Глобальная функция для копирования телефона по клику
window.copyPhone = function (btnElement, phoneString, event) {
    if (event) event.preventDefault();

    // Пытаемся скопировать в буфер
    navigator.clipboard.writeText(phoneString).then(() => {
        // Раз копия успешна, меняем текст кнопки
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = 'Скопировано!';
        btnElement.style.backgroundColor = '#125687'; // Дадим индикцию цветом
        btnElement.style.color = '#fff';

        // Возвращаем текст
        setTimeout(() => {
            btnElement.innerHTML = originalText;
            btnElement.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        alert('Не удалось скопировать номер: ' + phoneString);
    });
};
