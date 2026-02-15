/*
 * Fichier: script.js
 * Description: Script principal pour les interactions dynamiques du portfolio.
 *              Gère le menu de navigation mobile, le basculement de thème (clair/sombre),
 *              les animations au défilement, les compteurs animés, l'accordéon des projets,
 *              et la validation du formulaire de contact.
 * Auteur: Brindel Ndengue (adapté et enrichi par l'IA)
 * Date: 15 Février 2026
 * Version: 2.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de toutes les fonctionnalités après le chargement du DOM

    /**
     * Gère le menu de navigation mobile (hamburger).
     */
    const initMobileNav = () => {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const isExpanded = navLinks.classList.contains('active');
                navToggle.setAttribute('aria-expanded', isExpanded);
                // Change l'icône du hamburger en croix et vice-versa
                navToggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            });

            // Ferme le menu mobile lorsqu'un lien est cliqué
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        navToggle.setAttribute('aria-expanded', 'false');
                        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });
            });
        }
    };

    /**
     * Gère le basculement entre le thème clair et le thème sombre.
     */
    const initThemeToggle = () => {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        const icon = themeToggle.querySelector('i');

        // Vérifie si un thème a été sauvegardé dans le localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.classList.add(savedTheme);
            icon.className = savedTheme === 'dark-mode' ? 'fas fa-sun' : 'fas fa-moon';
        } else {
            // Applique le thème par défaut du système si disponible
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                body.classList.add('dark-mode');
                icon.className = 'fas fa-sun';
            }
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDarkMode = body.classList.contains('dark-mode');
            // Change l'icône en fonction du thème
            icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
            // Sauvegarde le choix de l'utilisateur dans le localStorage
            localStorage.setItem('theme', isDarkMode ? 'dark-mode' : 'light-mode');
        });
    };

    /**
     * Gère les animations d'apparition au défilement (fade-in).
     */
    const initScrollAnimations = () => {
        const fadeElements = document.querySelectorAll('.fade-in');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                    observer.unobserve(entry.target); // N'observe qu'une seule fois
                }
            });
        }, { threshold: 0.1 }); // Déclenche quand 10% de l'élément est visible

        fadeElements.forEach(el => observer.observe(el));
    };

    /**
     * Gère l'animation des compteurs de statistiques.
     */
    const initCounters = () => {
        const counters = document.querySelectorAll('.stat-box .count');
        const speed = 200; // Vitesse de l'animation

        const animateCounter = (counter) => {
            const target = +counter.getAttribute('data-target');
            const updateCount = () => {
                const count = +counter.innerText;
                const increment = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });

        counters.forEach(counter => observer.observe(counter));
    };

    /**
     * Gère l'accordéon pour la section des projets.
     */
    const initProjectsAccordion = () => {
        const accordionHeaders = document.querySelectorAll('.project-header.clickable');

        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const currentlyActiveHeader = document.querySelector('.project-header.clickable[aria-expanded="true"]');
                if (currentlyActiveHeader && currentlyActiveHeader !== header) {
                    currentlyActiveHeader.setAttribute('aria-expanded', 'false');
                    const activeDetails = document.getElementById(currentlyActiveHeader.getAttribute('aria-controls'));
                    activeDetails.classList.remove('expanded');
                }

                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
                const details = document.getElementById(header.getAttribute('aria-controls'));
                details.classList.toggle('expanded');
            });
        });
    };

    /**
     * Gère la validation et l'envoi du formulaire de contact.
     * Utilise Formspree pour l'envoi sans backend.
     */
    const initContactForm = () => {
        const form = document.getElementById('realContactForm');
        if (!form) return;

        const formMessage = document.getElementById('formMessage');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // Validation en temps réel
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                validateField(input);
            });
        });

        const validateField = (field) => {
            const errorElement = document.getElementById(`${field.id}-error`);
            let isValid = true;
            let errorMessage = '';

            if (field.hasAttribute('required') && !field.value.trim()) {
                isValid = false;
                errorMessage = 'Ce champ est obligatoire.';
            } else if (field.type === 'email' && !/\S+@\S+\.\S+/.test(field.value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer une adresse email valide.';
            } else if (field.minLength > 0 && field.value.length < field.minLength) {
                isValid = false;
                errorMessage = `Ce champ doit contenir au moins ${field.minLength} caractères.`;
            }

            if (!isValid) {
                field.classList.add('invalid');
                if (errorElement) {
                    errorElement.textContent = errorMessage;
                    errorElement.style.display = 'block';
                }
            } else {
                field.classList.remove('invalid');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
            return isValid;
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            let isFormValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                formMessage.textContent = 'Veuillez corriger les erreurs avant de soumettre.';
                formMessage.className = 'form-feedback error';
                formMessage.style.display = 'block';
                return;
            }

            // Afficher l'état de chargement
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';

            const formData = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formMessage.textContent = 'Merci ! Votre message a bien été envoyé. Je vous répondrai bientôt.';
                    formMessage.className = 'form-feedback success';
                    form.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        formMessage.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formMessage.textContent = 'Une erreur est survenue lors de l\`envoi du message. Veuillez réessayer.';
                    }
                    formMessage.className = 'form-feedback error';
                }
            } catch (error) {
                formMessage.textContent = 'Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.';
                formMessage.className = 'form-feedback error';
            } finally {
                // Rétablir l'état normal du bouton
                submitBtn.disabled = false;
                btnText.style.display = 'inline-flex';
                btnLoading.style.display = 'none';
                formMessage.style.display = 'block';
            }
        });
    };

    /**
     * Met à jour l'année en cours dans le pied de page.
     */
    const updateCopyrightYear = () => {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    };

    /**
     * Ajoute des bulles animées à l'arrière-plan pour un effet visuel subtil.
     */
    const createBackgroundBubbles = () => {
        const container = document.querySelector('.bubbles-container');
        if (!container) return;

        const numberOfBubbles = 20;
        for (let i = 0; i < numberOfBubbles; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            const size = Math.random() * 60 + 20; // Taille entre 20px et 80px
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${Math.random() * 100}%`;
            bubble.style.animationDuration = `${Math.random() * 10 + 10}s`; // Durée entre 10s et 20s
            bubble.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(bubble);
        }
    };

    // Appel de toutes les fonctions d'initialisation
    initMobileNav();
    initThemeToggle();
    initScrollAnimations();
    initCounters();
    initProjectsAccordion();
    initContactForm();
    updateCopyrightYear();
    createBackgroundBubbles();
});
