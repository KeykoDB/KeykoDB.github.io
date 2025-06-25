document.addEventListener('DOMContentLoaded', () => {
    // --- Gestion du thème (mode clair/sombre) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Charger le thème depuis localStorage ou définir le thème par défaut
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
        // Mettre à jour l'icône si le thème sombre est activé au chargement
        if (currentTheme === 'dark-theme') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    } else {
        // Définir un thème par défaut (ex: clair) si aucun n'est trouvé
        body.classList.add('light-theme'); // Ajoutez 'light-theme' si vous avez des styles spécifiques
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light-theme');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark-theme');
        }
    });

    // --- Animation de l'en-tête (rétrécissement au scroll) ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Si l'utilisateur a scrollé plus de 50px
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Effet de fondu à l'apparition des sections ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.1, // La section devient visible à 10% de son apparition
        rootMargin: "0px 0px -50px 0px" // Déclenchement 50px avant d'atteindre le bas de la viewport
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Logique du carrousel de projets ---
    const carouselWrapper = document.querySelector('.project-carousel-wrapper');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    let currentIndex = 0;

    function updateCarousel() {
        // Get the width of the first card (assuming all cards have the same width)
        const card = document.querySelector('.project-card');
        if (!card) return; // Exit if no cards are found

        // Calculate card width including its right margin/gap
        const cardWidth = card.offsetWidth; // This gets the content + padding + border
        const style = getComputedStyle(card);
        const marginRight = parseFloat(style.marginRight) || 0; // Get actual margin-right
        const gap = parseFloat(style.gap) || 20; // Default to 20px if gap not set or not applicable directly

        // For flexbox gap, it's simpler: just add the gap to the card width
        // If using margin-right, it's (cardWidth + marginRight)
        const itemWidth = cardWidth + gap; // Assuming gap is applied as a margin-right or flex gap

        // Calculate the number of items visible in the container
        const containerWidth = document.querySelector('.project-carousel-container').offsetWidth;
        const visibleItems = Math.floor(containerWidth / itemWidth);

        // Adjust total items and current index for looping logic
        const totalItems = carouselWrapper.children.length;

        // Ensure currentIndex doesn't exceed bounds
        if (currentIndex < 0) {
            currentIndex = totalItems - visibleItems; // Jump to end (or near end)
        } else if (currentIndex > totalItems - visibleItems) {
            currentIndex = 0; // Loop back to start
        }

        // Apply transform
        carouselWrapper.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }


    if (prevBtn && nextBtn && carouselWrapper) {
        prevBtn.addEventListener('click', () => {
            const card = document.querySelector('.project-card');
            if (!card) return;
            const containerWidth = document.querySelector('.project-carousel-container').offsetWidth;
            const itemWidth = card.offsetWidth + (parseFloat(getComputedStyle(card).marginRight) || 20); // Get actual margin-right or assumed gap
            const visibleItems = Math.floor(containerWidth / itemWidth);
            const totalItems = carouselWrapper.children.length;

            if (currentIndex > 0) {
                currentIndex--;
            } else {
                // Revenir à la fin si on est au début (boucle)
                currentIndex = totalItems - visibleItems; // Go to the last "full" view
                if (currentIndex < 0) currentIndex = 0; // Safety check for less items than can be displayed
            }
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            const card = document.querySelector('.project-card');
            if (!card) return;
            const containerWidth = document.querySelector('.project-carousel-container').offsetWidth;
            const itemWidth = card.offsetWidth + (parseFloat(getComputedStyle(card).marginRight) || 20); // Get actual margin-right or assumed gap
            const visibleItems = Math.floor(containerWidth / itemWidth);
            const totalItems = carouselWrapper.children.length;

            if (currentIndex < totalItems - visibleItems) {
                currentIndex++;
            } else {
                // Revenir au début si on est à la fin (boucle)
                currentIndex = 0;
            }
            updateCarousel();
        });

        // S'assurer que le carrousel est mis à jour si la fenêtre est redimensionnée
        window.addEventListener('resize', updateCarousel);
        // Initialiser le carrousel au chargement de la page
        updateCarousel();
    }


    // --- Pop-ups des compétences ---
    const skillItems = document.querySelectorAll('.skill-item');
    const skillDetails = document.getElementById('skill-details-popup');
    const skillTitle = document.getElementById('skill-details-title');
    const skillDescription = document.getElementById('skill-details-description');
    const closePopupBtn = document.querySelector('.close-popup');
    const overlay = document.getElementById('overlay');

    // Make sure all elements exist before adding listeners
    if (skillDetails && skillTitle && skillDescription && closePopupBtn && overlay) {
        const skillsData = {
            "HTML": "Maîtrise complète pour créer des structures sémantiques et des designs réactifs et modernes.",
            "CSS": "Maîtrise complète pour créer des structures sémantiques et des designs réactifs et modernes.",
            "Python": "Solides compétences en programmation pour des applications dynamiques et interactives.",
            "Windows (Administration et utilisation)": "Compétences approfondies en administration et utilisation des systèmes d'exploitation Windows.",
            "Linux (Commandes et administration)": "Compétences approfondies en commandes et administration des systèmes d'exploitation Linux.",
            "Protocoles réseau : DHCP, DNS": "Connaissance et configuration des protocoles réseau essentiels comme DHCP et DNS."
        };

        skillItems.forEach(item => {
            item.addEventListener('click', () => {
                const skillName = item.textContent.trim();
                skillTitle.textContent = skillName;
                skillDescription.textContent = skillsData[skillName] || "Description non disponible.";
                skillDetails.classList.add('active');
                overlay.classList.add('active');
                body.style.overflow = 'hidden'; // Empêcher le défilement du corps
            });
        });

        closePopupBtn.addEventListener('click', () => {
            skillDetails.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = ''; // Restaurer le défilement du corps
        });

        overlay.addEventListener('click', () => {
            skillDetails.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    }

    // --- Gestion du formulaire de contact ---
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Empêche le rechargement de la page

            formMessage.classList.remove('success', 'error', 'hidden');
            formMessage.textContent = 'Envoi en cours...';

            // Simuler l'envoi du formulaire
            // Dans un cas réel, tu utiliserais Fetch API pour envoyer les données à un backend
            try {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simule un délai réseau

                // Ici, tu pourrais ajouter une logique pour vérifier les entrées avant de "réussir"
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;

                if (name && email && message) {
                    formMessage.textContent = 'Message envoyé avec succès ! Je vous répondrai bientôt.';
                    formMessage.classList.add('success');
                    contactForm.reset(); // Réinitialise le formulaire après succès
                } else {
                    throw new Error('Veuillez remplir tous les champs du formulaire.');
                }

            } catch (error) {
                formMessage.textContent = 'Erreur lors de l\'envoi : ' + error.message;
                formMessage.classList.add('error');
            } finally {
                formMessage.classList.remove('hidden');
                // Masquer le message après quelques secondes
                setTimeout(() => {
                    formMessage.classList.add('hidden');
                }, 5000);
            }
        });
    }
});