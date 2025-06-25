// main.js - Pour les animations de fond organiques

document.addEventListener('DOMContentLoaded', () => {
    const backgroundElementsContainer = document.querySelector('.background-elements-container');

    // Définir les types d'éléments avec Font Awesome 6 qui rappellent la nature
    const elementTypes = [
        { icon: 'fas fa-leaf', class: 'background-element--leaf', baseSize: 1.2, sizeRange: 3.5 },     // Feuille
        { icon: 'fas fa-tint', class: 'background-element--water', baseSize: 1.0, sizeRange: 2.5 },    // Goutte d'eau
        { icon: 'fas fa-seedling', class: 'background-element--seedling', baseSize: 1.0, sizeRange: 2.0 }, // Jeune pousse
        { icon: 'fas fa-cloud', class: 'background-element--cloud', baseSize: 1.5, sizeRange: 4.0 },   // Nuage (léger)
        { icon: 'fas fa-mountain', class: 'background-element--mountain', baseSize: 0.8, sizeRange: 1.5 } // Montagne (plus petit, plus stylisé)
    ];

    const numberOfElements = 30; // Nombre d'éléments flottants simultanément
    const minDuration = 25; // Durée minimale de l'animation en secondes
    const maxDuration = 55; // Durée maximale de l'animation en secondes
    const minDelay = 0;   // Délai minimal avant le début de l'animation
    const maxDelay = 20;  // Délai maximal

    function createBackgroundElement() {
        const elementType = elementTypes[Math.floor(Math.random() * elementTypes.length)];
        const element = document.createElement('i');
        element.classList.add('background-element', elementType.icon, elementType.class);

        // Position de départ aléatoire (n'importe quel bord)
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let startX, startY, endX, endY;

        switch (side) {
            case 0: // Apparition par le haut
                startX = Math.random() * window.innerWidth;
                startY = -50;
                break;
            case 1: // Apparition par la droite
                startX = window.innerWidth + 50;
                startY = Math.random() * window.innerHeight;
                break;
            case 2: // Apparition par le bas
                startX = Math.random() * window.innerWidth;
                startY = window.innerHeight + 50;
                break;
            case 3: // Apparition par la gauche
                startX = -50;
                startY = Math.random() * window.innerHeight;
                break;
        }

        element.style.left = `${startX}px`;
        element.style.top = `${startY}px`;

        // Taille aléatoire basée sur le type d'élément
        const fontSize = elementType.baseSize + (Math.random() * elementType.sizeRange);
        element.style.fontSize = `${fontSize}em`;
        element.style.setProperty('--initial-opacity', (Math.random() * 0.4) + 0.1); // Opacité faible et variée

        // Directions de fin aléatoires (loin de l'écran)
        const exitOffset = Math.max(window.innerWidth, window.innerHeight) * 0.8;

        switch (side) {
            case 0: // Sortir par le bas
                endX = startX + (Math.random() - 0.5) * exitOffset;
                endY = window.innerHeight + 100;
                break;
            case 1: // Sortir par la gauche
                endX = -100;
                endY = startY + (Math.random() - 0.5) * exitOffset;
                break;
            case 2: // Sortir par le haut
                endX = startX + (Math.random() - 0.5) * exitOffset;
                endY = -100;
                break;
            case 3: // Sortir par la droite
                endX = window.innerWidth + 100;
                endY = startY + (Math.random() - 0.5) * exitOffset;
                break;
        }

        const duration = Math.random() * (maxDuration - minDuration) + minDuration;
        const delay = Math.random() * (maxDelay - minDelay) + minDelay;

        element.style.setProperty('--start-x', `${startX}px`);
        element.style.setProperty('--start-y', `${startY}px`);
        element.style.setProperty('--end-x', `${endX}px`);
        element.style.setProperty('--end-y', `${endY}px`);
        element.style.animationDuration = `${duration}s`;
        element.style.animationDelay = `${delay}s`;

        backgroundElementsContainer.appendChild(element);

        // Supprimer l'élément après son animation pour éviter l'encombrement du DOM
        element.addEventListener('animationend', () => {
            element.remove();
            // Recréer un nouvel élément pour une animation continue
            createBackgroundElement();
        });
    }

    // Créer les éléments initiaux
    for (let i = 0; i < numberOfElements; i++) {
        createBackgroundElement();
    }
});