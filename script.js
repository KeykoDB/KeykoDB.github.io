document.addEventListener('DOMContentLoaded', () => {
    // 1. Animation des sections au scroll
    const sections = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the section visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // 2. Thème sombre (Dark Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        if (savedTheme === 'dark-theme') {
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('dark-theme');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        if (body.classList.contains('dark-theme')) {
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark-theme');
        } else {
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light-theme');
        }
    });

    // 3. Popup des détails de compétence
    const skillItems = document.querySelectorAll('.skill-item');
    const skillDetailsPopup = document.getElementById('skill-details-popup');
    const closePopupBtn = skillDetailsPopup.querySelector('.close-popup');
    const overlay = document.getElementById('overlay');

    const skillData = {
        "HTML": "Le HTML (HyperText Markup Language) est le langage standard pour créer des pages web. Il structure le contenu en utilisant des balises pour les titres, paragraphes, images, liens, etc. C'est la base de toute page web. Maîtrise des concepts fondamentaux et des balises sémantiques.",
        "CSS": "Le CSS (Cascading Style Sheets) est utilisé pour styliser l'apparence du HTML. Il contrôle les couleurs, les polices, les marges, le positionnement et d'autres aspects visuels, rendant les pages web attrayantes et responsives. Compétence en flexbox, grid, et design adaptatif.",
        "Python": "Python est un langage de programmation de haut niveau, polyvalent et facile à apprendre. Il est utilisé pour le développement web (Django, Flask), l'analyse de données, l'intelligence artificielle, l'automatisation de scripts et bien plus encore. Connaissance des bases, structures de données, et programmation orientée objet.",
        "Windows": "Maîtrise de l'administration et de l'utilisation des systèmes d'exploitation Windows. Cela inclut la gestion des utilisateurs, des groupes, des permissions, la configuration du réseau, la résolution de problèmes et la maintenance système, ainsi que la gestion des Services de Domaine Active Directory (AD DS).",
        "Linux": "Connaissance approfondie des commandes Linux et de l'administration système. Cela comprend la gestion des fichiers et répertoires, l'installation de logiciels, la configuration de services (Apache, Nginx, SSH), la gestion des processus, la sécurisation de base et l'écriture de scripts shell.",
        "Reseau": "Compréhension et configuration des protocoles réseau fondamentaux comme DHCP (Dynamic Host Configuration Protocol) pour l'attribution automatique d'adresses IP, et DNS (Domain Name System) pour la résolution de noms de domaine en adresses IP. Connaissance des modèles OSI/TCP-IP, routage et sous-réseautage."
    };

    skillItems.forEach(item => {
        item.addEventListener('click', () => {
            const skillName = item.dataset.skill;
            const title = skillName;
            const description = skillData[skillName] || "Détails non disponibles pour cette compétence.";

            skillDetailsPopup.querySelector('h3').textContent = title;
            skillDetailsPopup.querySelector('p').textContent = description;

            skillDetailsPopup.classList.add('active');
            overlay.classList.add('active');
            // Accessibility: Set focus to the close button when popup opens
            closePopupBtn.focus();
        });
    });

    const closeSkillPopup = () => {
        skillDetailsPopup.classList.remove('active');
        overlay.classList.remove('active');
    };

    closePopupBtn.addEventListener('click', closeSkillPopup);

    overlay.addEventListener('click', closeSkillPopup);

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && skillDetailsPopup.classList.contains('active')) {
            closeSkillPopup();
        }
    });

    // 4. Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        formMessage.classList.remove('hidden', 'success', 'error');
        formMessage.textContent = "Envoi en cours...";
        formMessage.style.backgroundColor = 'rgba(0, 123, 255, 0.1)'; // Subtle blue for pending
        formMessage.style.color = '#0056b3';

        try {
            // Simulate API request (replace with actual backend endpoint)
            const response = await new Promise((resolve, reject) => setTimeout(() => {
                const success = Math.random() < 0.8; // 80% success rate for demo
                if (success) {
                    resolve({ status: 200, message: "Votre message a été envoyé avec succès !" });
                } else {
                    reject({ status: 500, message: "Une erreur est survenue. Veuillez réessayer plus tard." });
                }
            }, 1500));

            formMessage.textContent = response.message;
            formMessage.classList.add('success');
            formMessage.style.backgroundColor = ''; // Reset inline style
            formMessage.style.color = ''; // Reset inline style
            contactForm.reset();

        } catch (error) {
            formMessage.textContent = error.message;
            formMessage.classList.add('error');
            formMessage.style.backgroundColor = ''; // Reset inline style
            formMessage.style.color = ''; // Reset inline style
        } finally {
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000); // Hide message after 5 seconds
        }
    });

    // 5. Back to Top Button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.id = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Retour en haut de page');
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // CSS for back-to-top button
    const style = document.createElement('style');
    style.innerHTML = `
        #back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--accent-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 1.5em;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease, background-color 0.5s ease;
            z-index: 999;
        }
        #back-to-top.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        #back-to-top:hover {
            background-color: #388E3C; /* Manually darken for light mode */
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0,0,0,0.3);
        }
        body.dark-theme #back-to-top {
             background-color: var(--accent-color); /* Use dark theme accent */
             color: black; /* Changed to black for contrast */
        }
        body.dark-theme #back-to-top:hover {
             background-color: #5CB800; /* Manually darken for dark mode */
        }
    `;
    document.head.appendChild(style);

    // 6. Smooth scrolling for navigation links
    document.querySelectorAll('header nav ul li a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 7. Project Details Placeholder (expandable content/modal)
    // For now, these buttons don't do anything, but this sets up the potential
    // for a modal or dynamic content loading for project details.
    document.querySelectorAll('.btn-project-details').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Les détails de ce projet seront bientôt disponibles dans une pop-up !");
            // Here you would implement logic to load project details into a modal
            // Similar to how skill details are handled, but with dynamic content.
        });
    });

    // 8. Header shrink on scroll
    const header = document.querySelector('header');
    const profileImg = document.getElementById('profile-img');
    const headerTitle = header.querySelector('h1');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) { // Shrink after 100px scroll
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    });

    // CSS for header shrink (add to your style.css)
    const headerShrinkStyle = document.createElement('style');
    headerShrinkStyle.innerHTML = `
        header.shrink {
            padding: 10px 20px; /* Smaller padding */
            box-shadow: 0 2px 8px var(--shadow-medium); /* Lighter shadow */
        }
        header.shrink .header-content {
            margin-bottom: 10px; /* Less space */
        }
        header.shrink #profile-img {
            width: 80px; /* Smaller image */
            height: 80px;
            border-width: 2px; /* Thinner border */
        }
        header.shrink h1 {
            font-size: 2em; /* Smaller title */
            letter-spacing: 1px;
            margin-left: 0; /* Adjust margin if necessary */
        }
        header.shrink nav ul {
            gap: 10px;
        }
        header.shrink nav ul li a {
            padding: 8px 15px; /* Smaller navigation links */
            font-size: 0.9em;
        }
        header.shrink #theme-toggle {
            width: 35px;
            height: 35px;
            font-size: 1.1em;
            top: 10px;
            right: 10px;
        }

        /* Ensure smooth transitions for header shrink */
        header, header .header-content, header #profile-img, header h1, header nav ul li a, header #theme-toggle {
            transition: all 0.3s ease-in-out;
        }

        /* Adjust profile image margin when shrinking to prevent overlap if it was too large */
        @media (min-width: 769px) { /* Apply only on larger screens where it might overlap */
            header.shrink .header-content #profile-img {
                margin-right: 15px;
            }
        }
    `;
    document.head.appendChild(headerShrinkStyle);
});

// Helper function for CSS `darken` (since CSS doesn't have it natively)
// This is a workaround as CSS variables don't support arithmetic ops directly.
// For dynamic color changes, a preprocessor like SASS/LESS is ideal,
// or calculate colors in JS, or use HSL for easier manipulation.
// For now, I'll define it for illustration, but actual darken would need a preprocessor.
function darken(color, percentage) {
    // A simplified example using a fixed darken for certain colors
    // In a real project, consider using a CSS preprocessor or a JavaScript color library.
    if (color.includes('#')) {
        // Hex to RGB
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);

        // Darken RGB
        r = Math.max(0, r - Math.round(r * percentage / 100));
        g = Math.max(0, g - Math.round(g * percentage / 100));
        b = Math.max(0, b - Math.round(b * percentage / 100));

        // RGB to Hex
        const toHex = (c) => ('0' + c.toString(16)).slice(-2);
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    // Return original color if not hex or not handled
    return color;
}