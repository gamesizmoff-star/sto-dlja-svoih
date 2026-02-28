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

    // 3. SPA-навигация через вкладки
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabSections = document.querySelectorAll('.tab-section');

    function switchTab(sectionId) {
        // Убираем active у всех ссылок и секций
        tabLinks.forEach(link => link.classList.remove('active'));
        tabSections.forEach(section => {
            section.classList.remove('active');
        });

        // Активируем нужную вкладку
        tabLinks.forEach(link => {
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Показать нужную секцию
        const targetSection = document.querySelector(`.tab-section[data-section="${sectionId}"]`);
        if (targetSection) {
            targetSection.classList.add('active');

            // Скролл наверх при переключении
            window.scrollTo({ top: 0, behavior: 'instant' });

            // Все элементы появляются одновременно (без стаггера)
            const animateElements = targetSection.querySelectorAll('.animate-on-scroll');
            animateElements.forEach(el => {
                el.classList.remove('is-visible');
            });
            // Небольшая задержка чтобы reset сработал до применения is-visible
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    animateElements.forEach(el => el.classList.add('is-visible'));
                });
            });

            // Если это секция locations — загрузить карту
            if (sectionId === 'locations') {
                loadYandexMap();
            }
        }
    }

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            switchTab(sectionId);
        });
    });

    // 4. Табы локаций (внутри секции locations)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');

            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // 5. Появление элементов при скролле (Intersection Observer)
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
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // 6. Ленивая загрузка Яндекс.Карт
    let mapInitialized = false;

    window.loadYandexMap = function () {
        if (mapInitialized) return;

        // Проверяем, что API ещё не загружен
        if (typeof ymaps !== 'undefined') {
            initMap();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
        script.onload = () => {
            ymaps.ready(initMap);
        };
        script.onerror = () => {
            const container = document.getElementById('yandex-map');
            if (container) {
                container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:rgba(255,255,255,0.4);font-family:var(--font-heading);font-size:1.1rem;text-align:center;padding:2rem;">Карта временно недоступна.<br>Используйте кнопку «Маршрут».</div>';
            }
        };
        document.head.appendChild(script);
        mapInitialized = true;
    };

    function initMap() {
        const mapContainer = document.getElementById('yandex-map');
        if (!mapContainer) return;

        const map = new ymaps.Map('yandex-map', {
            center: [59.882561, 30.369361], // ул. Бухарестская, 10, СПб
            zoom: 16,
            controls: ['zoomControl', 'geolocationControl']
        });

        const placemark = new ymaps.Placemark([59.882561, 30.369361], {
            balloonContentHeader: 'СТО ДЛЯ СВОИХ',
            balloonContentBody: 'ул. Бухарестская, 10<br>Ежедневно с 9:00 до 21:00<br>+7 (921) 330-21-20',
            hintContent: 'СТО ДЛЯ СВОИХ — СПб'
        }, {
            preset: 'islands#blueAutoIcon'
        });

        map.geoObjects.add(placemark);

        // Отключить зум скроллом, чтобы не мешать навигации
        map.behaviors.disable('scrollZoom');
        mapInitialized = true;
    }

});

// Глобальная функция для копирования телефона по клику
window.copyPhone = function (btnElement, phoneString, event) {
    if (event) event.preventDefault();

    navigator.clipboard.writeText(phoneString).then(() => {
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = 'Скопировано!';
        btnElement.style.backgroundColor = '#125687';
        btnElement.style.color = '#fff';

        setTimeout(() => {
            btnElement.innerHTML = originalText;
            btnElement.style.backgroundColor = '';
        }, 2000);
    }).catch(err => {
        alert('Не удалось скопировать номер: ' + phoneString);
    });
};
