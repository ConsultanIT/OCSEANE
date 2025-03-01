// Theme Toggle
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        themeToggle.textContent = theme === 'light' ? '🌓' : '☀️';
    }

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    const formInputs = contactForm.querySelectorAll('input, textarea');

    // Configuration de l'email
    const EMAIL_CONFIG = {
        recipient: 'spotDomain@protonmail.com',
        subject: 'Nouvelle demande - ocseane.com'
    };

    // Fonction de validation d'un champ
    function validateField(field) {
        const errorDiv = field.parentElement.querySelector('.error-message');
        let isValid = true;

        // Réinitialiser les classes et messages
        field.classList.remove('error', 'valid');
        errorDiv.textContent = '';
        errorDiv.classList.remove('visible');

        // Vérifier si le champ est vide
        if (field.required && !field.value.trim()) {
            isValid = false;
        }
        // Vérifier la longueur minimale
        else if (field.minLength && field.value.length < field.minLength) {
            isValid = false;
        }
        // Vérifier le format email
        else if (field.type === 'email' && field.value) {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            isValid = emailPattern.test(field.value);
        }

        // Afficher l'erreur si nécessaire
        if (!isValid) {
            field.classList.add('error');
            errorDiv.textContent = field.dataset.error;
            errorDiv.classList.add('visible');
        } else {
            field.classList.add('valid');
        }

        return isValid;
    }

    // Validation en temps réel
    formInputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });

    // Fonction d'envoi du formulaire
    async function submitForm(formData) {
        const submitButton = contactForm.querySelector('.submit-btn');
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            // Préparation des données pour l'envoi
            const emailData = {
                to: EMAIL_CONFIG.recipient,
                subject: EMAIL_CONFIG.subject,
                content: `
                    Nouveau message de ${formData.prenom} ${formData.nom}
                    Email: ${formData.email}
                    Message: ${formData.message}
                `
            };

            // Ici, vous devrez implémenter l'appel à votre API d'envoi d'email
            // Par exemple avec fetch() vers votre backend
            
            // Simulation de l'envoi (à remplacer par votre logique d'envoi réelle)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Animation de succès
            submitButton.textContent = 'Message envoyé !';
            submitButton.style.backgroundColor = 'var(--success-color)';

            // Reset du formulaire après 3 secondes
            setTimeout(() => {
                contactForm.reset();
                submitButton.textContent = 'Envoyer';
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                submitButton.style.backgroundColor = '';
            }, 3000);

        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            submitButton.textContent = 'Erreur d\'envoi';
            submitButton.style.backgroundColor = 'var(--error-color)';

            setTimeout(() => {
                submitButton.textContent = 'Envoyer';
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                submitButton.style.backgroundColor = '';
            }, 3000);
        }
    }

    // Validation à la soumission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Valider tous les champs
        let isFormValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            return;
        }

        // Récupération des données du formulaire
        const formData = {
            nom: document.getElementById('nom').value.trim(),
            prenom: document.getElementById('prenom').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Envoi du formulaire
        await submitForm(formData);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Configuration PayPal
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay'
        },
        
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    description: "Nom de domaine premium: ocseane.com",
                    amount: {
                        currency_code: "USD",
                        value: "6500.00"
                    }
                }]
            });
        },
        
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Transaction completed by ' + details.payer.name.given_name);
                // Here you would typically initiate the domain transfer process
            });
        },
        
        onError: function(err) {
            console.error('PayPal Error:', err);
            alert('Une erreur est survenue lors du paiement. Veuillez réessayer.');
        }
    }).render('#paypal-button-container');

    // Animation on scroll for features
    const features = document.querySelectorAll('.feature');
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

    features.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(20px)';
        feature.style.transition = 'all 0.6s ease-out';
        observer.observe(feature);
    });

    // Contact button pulse animation
    const contactButton = document.getElementById('contactButton');
    contactButton.addEventListener('click', () => {
        document.querySelector('#contact').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Gestion du carrousel de témoignages
    const testimonialSlider = document.querySelector('.testimonials-slider');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevButton = document.querySelector('.testimonial-nav.prev');
    const nextButton = document.querySelector('.testimonial-nav.next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    let currentTestimonial = 0;
    let autoplayInterval;
    
    // Créer les points de navigation
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showTestimonial(index));
        dotsContainer.appendChild(dot);
    });
    
    // Afficher le premier témoignage
    testimonialCards[0].classList.add('active');
    
    function showTestimonial(index) {
        // Arrêter l'autoplay temporairement
        stopAutoplay();
        
        testimonialCards.forEach(card => {
            card.classList.remove('active');
            card.style.transform = 'translateX(100%)';
        });
        
        const dots = document.querySelectorAll('.testimonial-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        testimonialCards[index].classList.add('active');
        testimonialCards[index].style.transform = 'translateX(0)';
        currentTestimonial = index;
        
        // Redémarrer l'autoplay
        startAutoplay();
    }
    
    function nextTestimonial() {
        const next = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(next);
    }
    
    function prevTestimonial() {
        const prev = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(prev);
    }
    
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextTestimonial, 5000);
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    prevButton.addEventListener('click', prevTestimonial);
    nextButton.addEventListener('click', nextTestimonial);
    
    // Démarrer l'autoplay
    startAutoplay();
    
    // Arrêter l'autoplay quand l'utilisateur survole le carrousel
    testimonialSlider.addEventListener('mouseenter', stopAutoplay);
    testimonialSlider.addEventListener('mouseleave', startAutoplay);
});

// Génération du token CSRF
function generateCSRFToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Validation du formulaire de contact
document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Réinitialiser tous les messages d'erreur
    document.querySelectorAll('.error-message').forEach(error => error.textContent = '');
    
    const form = e.target;
    const formData = new FormData(form);
    let isValid = true;
    
    // Protection XSS
    function sanitizeInput(input) {
        return input.replace(/[<>]/g, '');
    }
    
    // Validation du nom
    const nom = form.querySelector('#nom');
    const nomValue = sanitizeInput(nom.value.trim());
    if (!nomValue || nomValue.length < 2 || nomValue.length > 50) {
        showError(nom, 'Le nom est obligatoire (entre 2 et 50 caractères)');
        isValid = false;
    }
    
    // Validation du prénom
    const prenom = form.querySelector('#prenom');
    const prenomValue = sanitizeInput(prenom.value.trim());
    if (!prenomValue || prenomValue.length < 2 || prenomValue.length > 50) {
        showError(prenom, 'Le prénom est obligatoire (entre 2 et 50 caractères)');
        isValid = false;
    }
    
    // Validation de l'email avec une regex plus stricte
    const email = form.querySelector('#email');
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email.value.trim() || !emailPattern.test(email.value) || email.value.length > 100) {
        showError(email, 'Une adresse Gmail valide est obligatoire');
        isValid = false;
    }
    
    // Validation du message avec limite de taille
    const message = form.querySelector('#message');
    const messageValue = sanitizeInput(message.value.trim());
    if (!messageValue || messageValue.length < 10 || messageValue.length > 1000) {
        showError(message, 'Le message doit contenir entre 10 et 1000 caractères');
        isValid = false;
    }
    
    if (isValid) {
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';
        
        // Ajout du token CSRF
        const csrfToken = generateCSRFToken();
        
        const formDataToSend = {
            to: 'spotDomain@protonmail.com',
            from: email.value,
            nom: nomValue,
            prenom: prenomValue,
            message: messageValue,
            csrf_token: csrfToken,
            timestamp: Date.now()
        };
        
        try {
            // Rate limiting - vérification du dernier envoi
            const lastSubmit = localStorage.getItem('lastSubmit');
            const now = Date.now();
            if (lastSubmit && (now - parseInt(lastSubmit)) < 60000) { // 1 minute de délai
                throw new Error('Veuillez attendre une minute entre chaque envoi');
            }
            
            // Simulation de l'envoi avec délai de sécurité
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Enregistrement du timestamp de soumission
            localStorage.setItem('lastSubmit', now.toString());
            
            console.log('Email envoyé à:', formDataToSend.to);
            
            // Réinitialiser le formulaire
            form.reset();
            alert('Message envoyé avec succès !');
            
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            alert(error.message || 'Une erreur est survenue. Veuillez réessayer.');
            
        } finally {
            // Réinitialiser le bouton
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer';
        }
    }
});

// Fonction pour afficher les messages d'erreur
function showError(input, message) {
    const errorDiv = input.parentElement.querySelector('.error-message');
    errorDiv.textContent = message;
    input.classList.add('invalid');
}

// Validation en temps réel
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('input', () => {
        const errorDiv = input.parentElement.querySelector('.error-message');
        if (input.checkValidity()) {
            errorDiv.textContent = '';
            input.classList.remove('invalid');
        } else {
            showError(input, input.dataset.error);
        }
    });
});
