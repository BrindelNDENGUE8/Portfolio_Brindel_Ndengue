document.addEventListener('DOMContentLoaded', function() {

    // --- 1. GESTION DU THÈME (CLAIR/SOMBRE) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    };

    // Appliquer le thème sauvegardé au chargement ou le thème par défaut (sombre)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- 2. MENU DE NAVIGATION MOBILE ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Fermer le menu en cliquant sur un lien
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.querySelector('i').classList.add('fa-bars');
                navToggle.querySelector('i').classList.remove('fa-times');
            });
        });
    }

    // --- 3. COMPTEUR DE STATISTIQUES ANIMÉ ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Vitesse de l'animation

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const updateCount = () => {
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 10); // Délai entre chaque incrémentation
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };

    const observerOptions = { root: null, threshold: 0.7 };
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Pour ne l'animer qu'une seule fois
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        if (counter) {
            counterObserver.observe(counter);
        }
    });

    // --- 4. ACCORDÉON POUR LES PROJETS ---
    const accordionHeaders = document.querySelectorAll('.projects-accordion .project-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentlyActiveHeader = document.querySelector('.project-header.active');
            if (currentlyActiveHeader && currentlyActiveHeader !== header) {
                currentlyActiveHeader.classList.remove('active');
                currentlyActiveHeader.nextElementSibling.classList.remove('show');
            }

            header.classList.toggle('active');
            const details = header.nextElementSibling;
            details.classList.toggle('show');
        });
    });

    // --- 5. LIGHTBOX POUR LES IMAGES (si vous en ajoutez) ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const clickableImages = document.querySelectorAll('.clickable-img');

    if (lightbox && lightboxImg && lightboxClose) {
        clickableImages.forEach(img => {
            img.addEventListener('click', () => {
                const fullImgSrc = img.getAttribute('data-full');
                if (fullImgSrc) {
                    lightboxImg.setAttribute('src', fullImgSrc);
                    lightbox.classList.add('show');
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('show');
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Ferme si on clique sur le fond
                closeLightbox();
            }
        });
    }

    // --- 6. GESTION DU FORMULAIRE DE CONTACT ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            
            formMessage.textContent = 'Envoi en cours...';
            formMessage.style.color = 'var(--text-light-color)';

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    formMessage.textContent = 'Merci ! Votre message a bien été envoyé.';
                    formMessage.style.color = '#28a745'; // Vert
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        formMessage.textContent = data.message || 'Une erreur est survenue. Veuillez réessayer.';
                        formMessage.style.color = '#dc3545'; // Rouge
                    });
                }
            }).catch(error => {
                console.error('Erreur réseau:', error);
                formMessage.textContent = 'Une erreur réseau est survenue. Veuillez réessayer plus tard.';
                formMessage.style.color = '#dc3545'; // Rouge
            });
        });
    }
});

// Toggle thème dark/light
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Change l'icône
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    // Sauvegarde préférence
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Charger thème sauvegardé
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

// Bulles animées
function createBubbles() {
    const container = document.querySelector('.bubbles-container');
    for (let i = 0; i < 35; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const size = Math.random() * 60 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}vw`;
        bubble.style.animationDuration = `${Math.random() * 10 + 10}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(bubble);
    }
}
createBubbles();

// Accordéon projets
document.querySelectorAll('.project-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('active');
        
        // Fermer les autres
        document.querySelectorAll('.project-item').forEach(other => {
            if (other !== item) {
                other.classList.remove('active');
            }
        });
    });
});

// Lightbox pour images
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');

document.querySelectorAll('.clickable-img').forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.getAttribute('data-full') || img.src;
        lightbox.classList.add('active');
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

// Compteur animé
const counters = document.querySelectorAll('.counter');
const speed = 200;

counters.forEach(counter => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCount, 1);
        } else {
            counter.innerText = target;
        }
    };
    
    // Déclencher quand visible
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            updateCount();
            observer.disconnect();
        }
    });
    
    observer.observe(counter);
});