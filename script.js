// ─── Bulles (augmenté à 35) ────────────────────────────────────────────────
const bubblesContainer = document.querySelector('.bubbles-container');
const colors = [
    'rgba(96, 165, 250, 0.22)',
    'rgba(34, 197, 94, 0.18)',
    'rgba(249, 115, 22, 0.15)',
    'rgba(139, 92, 246, 0.16)',
    'rgba(59, 130, 246, 0.20)',
    'rgba(236, 72, 153, 0.14)',
    'rgba(245, 158, 11, 0.17)',
];

for (let i = 0; i < 35; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    const size = Math.random() * 140 + 50;
    const duration = Math.random() * 28 + 18;
    const delay = Math.random() * -35;
    const rot = Math.random() * 360;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
    bubble.style.left = `${Math.random() * 100}vw`;
    bubble.style.top = `${Math.random() * 140}vh`;
    bubble.style.animationDuration = `${duration}s, ${duration + 8}s`;
    bubble.style.animationDelay = `${delay}s`;
    bubble.style.transform = `rotate(${rot}deg)`;

    bubblesContainer.appendChild(bubble);
}

// ─── Dark Mode ──────────────────────────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    themeToggle.innerHTML = body.classList.contains('dark-mode')
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
});

// ─── Counters ───────────────────────────────────────────────────────────────
document.querySelectorAll('.counter').forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const increment = target / 120; // ~2 secondes

    const update = () => {
        count += increment;
        counter.innerText = Math.ceil(count);
        if (count < target) {
            requestAnimationFrame(update);
        } else {
            counter.innerText = target;
        }
    };
    update();
});

// ─── Fade-in on scroll ──────────────────────────────────────────────────────
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.15 });

sections.forEach(sec => observer.observe(sec));

// ─── Smooth scroll ──────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href'))?.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ============================================================================
// Gestion du formulaire réel – feedback utilisateur + loading
// ============================================================================

const realForm = document.getElementById('realContactForm');
const formFeedback = document.getElementById('formMessage');
const submitButton = document.getElementById('submitBtn');
const btnText = submitButton.querySelector('.btn-text');
const btnLoading = submitButton.querySelector('.btn-loading');

if (realForm) {
    realForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Désactive le bouton pendant l'envoi
        submitButton.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        formFeedback.textContent = 'Envoi en cours...';
        formFeedback.className = 'form-feedback sending';

        try {
            const formData = new FormData(realForm);

            const response = await fetch(realForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formFeedback.textContent = 'Message envoyé avec succès ! Je vous répondrai rapidement.';
                formFeedback.className = 'form-feedback success';
                realForm.reset();
            } else {
                throw new Error('Réponse serveur non OK');
            }
        } catch (error) {
            console.error(error);
            formFeedback.textContent = 'Désolé, une erreur est survenue. Essayez directement par email.';
            formFeedback.className = 'form-feedback error';
        } finally {
            // Réactive le bouton
            submitButton.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
}

// ============================================================================
// OUVERTURE / FERMETURE DES MODALES PROJETS
// ============================================================================

const projectCards = document.querySelectorAll('.project-card.clickable');
const modals = document.querySelectorAll('.project-modal');
const modalCloses = document.querySelectorAll('.modal-close');

projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        const modal = document.getElementById(`modal-${projectId}`);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

modalCloses.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.project-modal').classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Fermer avec touche Échap
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.project-modal.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// Fermer en cliquant à l'extérieur
modals.forEach(modal => {
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ============================================================================
// LIGHTBOX POUR LES PHOTOS DES ENGAGEMENTS
// ============================================================================

document.querySelectorAll('.engagement-photo').forEach(photo => {
    photo.addEventListener('click', () => {
        const fullSrc = photo.getAttribute('data-full');
        const caption = photo.querySelector('img').getAttribute('alt') || 'Activité associative';
        
        document.getElementById('lightbox-img').src = fullSrc;
        document.getElementById('lightbox-caption').textContent = caption;
        document.getElementById('lightbox').classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});


// DÉROULEMENT ACCORDION
document.querySelectorAll('.project-header.clickable').forEach(header => {
    header.addEventListener('click', () => {
        const targetId = header.getAttribute('data-toggle');
        const details = document.getElementById(targetId);
        const isActive = header.classList.contains('active');

        // Fermer les autres
        document.querySelectorAll('.project-details.active').forEach(d => {
            if (d.id !== targetId) {
                d.classList.remove('active');
                d.previousElementSibling.classList.remove('active');
            }
        });

        // Toggle
        header.classList.toggle('active');
        details.classList.toggle('active');
    });
});

// LIGHTBOX SCREENSHOTS
document.querySelectorAll('.gallery-grid img').forEach(img => {
    img.addEventListener('click', () => {
        document.getElementById('lightbox-img').src = img.getAttribute('data-full');
        document.getElementById('lightbox').classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

document.querySelector('.lightbox').addEventListener('click', e => {
    if (e.target.classList.contains('lightbox') || e.target.classList.contains('lightbox-close')) {
        document.getElementById('lightbox').classList.remove('active');
        document.body.style.overflow = '';
    }
});