class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = this.getSavedTheme() || this.getSystemTheme();
        this.init();
    }

    getSavedTheme() {
        return localStorage.getItem('theme');
    }

   
    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

 
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        this.showNotification(`Тема изменена на ${theme === 'dark' ? 'темную' : 'светлую'}`);
    }


    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.animateToggle();
    }

 
    animateToggle() {
        this.themeToggle.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 200);
    }

  
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas ${this.currentTheme === 'dark' ? 'fa-moon' : 'fa-sun'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

 
    watchSystemTheme() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    init() {

        this.setTheme(this.currentTheme);

  
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

     
        this.watchSystemTheme();


        this.themeToggle.addEventListener('mouseenter', () => {
            this.themeToggle.style.transform = 'scale(1.1)';
        });

        this.themeToggle.addEventListener('mouseleave', () => {
            this.themeToggle.style.transform = 'scale(1)';
        });
    }
}


class UIManager {
    constructor() {
        this.scrollTop = document.getElementById('scroll-top');
        this.contactForm = document.getElementById('contact-form');
        this.init();
    }

   
    handleScrollTop() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.scrollTop.classList.add('visible');
            } else {
                this.scrollTop.classList.remove('visible');
            }
        });

        this.scrollTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    handleContactForm() {
        if (!this.contactForm) return;

        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
          
            const formData = new FormData(this.contactForm);
            const data = Object.fromEntries(formData);
            
            console.log('Отправка формы:', data);
            
            this.showFormNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            this.contactForm.reset();
        });
    }


    showFormNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" 
               style="color: ${type === 'success' ? '#00b894' : '#d63031'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

 
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

 
    initScrollAnimation() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    
    init() {
        this.handleScrollTop();
        this.handleContactForm();
        this.initSmoothScroll();
        this.initScrollAnimation();

     
        const learnMoreBtn = document.getElementById('learn-more');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                document.querySelector('.features').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }

    
        const contactBtn = document.getElementById('contact');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                document.querySelector('.contact').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    const uiManager = new UIManager();
    
    if (!localStorage.getItem('visited')) {
        setTimeout(() => {
            themeManager.showNotification('👋 Добро пожаловать! Попробуйте переключить тему');
            localStorage.setItem('visited', 'true');
        }, 1000);
    }
});

(function() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
   
    if (initialTheme) {
        document.documentElement.setAttribute('data-theme', initialTheme);
    }
})();