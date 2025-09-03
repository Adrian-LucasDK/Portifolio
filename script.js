document.addEventListener('DOMContentLoaded', function () {

    // --- 1. Smooth Scrolling para links de navegação ---
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 2. Adicionar classe 'scrolled' ao header ao rolar a página ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3. Função para calcular e exibir a idade automaticamente ---
    function calculateAndDisplayAge() {
        const birthDate = new Date(2005, 4, 24); // Mês é 0-indexado (Maio é 4)
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        const ageElement = document.getElementById('current-age');
        if (ageElement) {
            ageElement.textContent = age + ' anos';
        }
    }
    calculateAndDisplayAge(); // Chamar ao carregar a página

    // --- 4. Lógica para o Botão de Modo Escuro ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Verifica a preferência do usuário ou o último estado salvo
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || (savedTheme === null && prefersDarkMode)) {
        body.classList.add('dark-mode');
        darkModeToggle.querySelector('i').classList.remove('fa-moon');
        darkModeToggle.querySelector('i').classList.add('fa-sun');
    } else {
        darkModeToggle.querySelector('i').classList.remove('fa-sun');
        darkModeToggle.querySelector('i').classList.add('fa-moon');
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            darkModeToggle.querySelector('i').classList.remove('fa-moon');
            darkModeToggle.querySelector('i').classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            darkModeToggle.querySelector('i').classList.remove('fa-sun');
            darkModeToggle.querySelector('i').classList.add('fa-moon');
        }
    });

    // --- 5. Lógica para o Botão Voltar ao Topo ---
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Mostra o botão após rolar 300px
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- 6. Indicador de Seção Ativa na Navegação ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% da seção visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- 7. Animações de Rolagem (Intersection Observer para .animate-on-scroll) ---
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');

    const animateOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Elemento visível em 20%
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                animateObserver.unobserve(entry.target); // Para animar apenas uma vez
            }
        });
    }, animateOptions);

    animateOnScrollElements.forEach(element => {
        animateObserver.observe(element);
    });

});

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navUl = document.querySelector('header nav ul');

// Abrir/fechar menu ao clicar no botão
mobileMenuToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Impede que o clique no botão feche imediatamente
    navUl.classList.toggle('show');
});

// Fechar o menu quando clicar em algum link
navUl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navUl.classList.remove('show');
    });
});

// Fechar o menu ao clicar fora dele
document.addEventListener('click', (e) => {
    if (!navUl.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navUl.classList.remove('show');
    }
});

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const messageIcon = formMessage.querySelector('i');
const messageText = formMessage.querySelector('.message-text');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    emailjs.sendForm('service_bqc6ljj', 'template_1tmlrxg', this)
        .then(() => {
            messageIcon.className = 'fas fa-check-circle';
            messageText.textContent = 'Obrigado pelo seu contato! Sua mensagem foi enviada com sucesso.';
            formMessage.className = 'form-message success show';
            contactForm.reset();
        }, (error) => {
            messageIcon.className = 'fas fa-exclamation-triangle';
            messageText.textContent = 'Ops! Ocorreu um erro ao enviar sua mensagem. Tente novamente.';
            formMessage.className = 'form-message error show';
            console.error('Erro:', error);
        });
});