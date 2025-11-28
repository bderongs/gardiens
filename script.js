/**
 * Jeu Gardiens des Cités Perdues
 * Gestion de la sélection de personnage et de pouvoirs
 * 
 * Fonctionnalités :
 * - Sélection d'un personnage principal à diriger
 * - Les autres personnages apparaissent comme NPCs sur la carte
 * - Les NPCs se déplacent de manière aléatoire (V0)
 * - Les noms des NPCs sont affichés au-dessus de leur tête
 * - Animations de marche : les personnages utilisent les sprites walkcycle (ligne 8)
 *   avec animations des jambes et orientation de la tête selon la direction
 */

// Données des personnages disponibles
const characters = [
    {
        id: 'sophie',
        name: 'Sophie Foster',
        description: 'Télépathe exceptionnelle, capable de communiquer avec les animaux',
        image: '👩‍🦰',
        colorClass: 'bg-purple-600',
        defaultPower: 'telepathe'
    },
    {
        id: 'fitz',
        name: 'Fitz Vacker',
        description: 'Télépathe talentueux, membre de la famille Vacker',
        image: '👨',
        colorClass: 'bg-blue-600',
        defaultPower: 'telepathe'
    },
    {
        id: 'keefe',
        name: 'Keefe Sencen',
        description: 'Empathe, capable de ressentir et manipuler les émotions',
        image: '😎',
        colorClass: 'bg-yellow-600',
        defaultPower: 'empathe'
    },
    {
        id: 'dex',
        name: 'Dex Dizznee',
        description: 'Technopathe, créateur d\'inventions extraordinaires',
        image: '🔧',
        colorClass: 'bg-green-600',
        defaultPower: 'technopathe'
    },
    {
        id: 'biana',
        name: 'Biana Vacker',
        description: 'Éclipseuse, capable de devenir invisible',
        image: '✨',
        colorClass: 'bg-pink-600',
        defaultPower: 'eclipseur'
    },
    {
        id: 'tam',
        name: 'Tam Song',
        description: 'Ténébreux, maître des ombres et de l\'hydrombre',
        image: '🌑',
        colorClass: 'bg-gray-600',
        defaultPower: 'tenebreux'
    }
];

// Données des pouvoirs disponibles (basés sur les talents officiels de Gardiens des cités perdues)
const powers = [
    {
        id: 'telepathe',
        name: 'Télépathe',
        description: 'Lire dans les pensées et communiquer mentalement',
        icon: '🧠',
        color: 'purple'
    },
    {
        id: 'empathe',
        name: 'Empathe',
        description: 'Discerner les humeurs et émotions des autres',
        icon: '💚',
        color: 'green'
    },
    {
        id: 'technopathe',
        name: 'Technopathe',
        description: 'Fabriquer des gadgets et contrôler la technologie',
        icon: '⚙️',
        color: 'indigo'
    },
    {
        id: 'flasheur',
        name: 'Flasheur',
        description: 'Contrôler la lumière et devenir invisible (toggle avec Espace)',
        icon: '✨',
        color: 'pink'
    },
    {
        id: 'tenebreux',
        name: 'Ténébreux',
        description: 'Manipuler les ombres et créer des ombres persistantes (Espace pour créer)',
        icon: '🌑',
        color: 'gray'
    },
    {
        id: 'eclipseur',
        name: 'Éclipseur',
        description: 'Disparaître momentanément et traverser les obstacles (toggle avec Espace)',
        icon: '🌙',
        color: 'cyan'
    },
    {
        id: 'phaseur',
        name: 'Phaseur',
        description: 'Séparer les atomes et traverser les obstacles (toggle avec Espace)',
        icon: '🌀',
        color: 'blue'
    },
    {
        id: 'teleporteur',
        name: 'Téléporteur',
        description: 'Se téléporter instantanément d\'un endroit à un autre',
        icon: '⚡',
        color: 'blue'
    },
    {
        id: 'hypnotiseur',
        name: 'Hypnotiseur',
        description: 'Hypnotiser des personnes pendant un temps limité',
        icon: '👁️',
        color: 'red'
    },
    {
        id: 'instillateur',
        name: 'Instillateur',
        description: 'Instiller des émotions en sa cible',
        icon: '💭',
        color: 'purple'
    },
    {
        id: 'invocateur',
        name: 'Invocateur',
        description: 'Appeler des objets d\'un claquement de doigts',
        icon: '✨',
        color: 'orange'
    },
    {
        id: 'polyglotte',
        name: 'Polyglotte',
        description: 'Parler toutes les langues et imiter les voix',
        icon: '🗣️',
        color: 'yellow'
    },
    {
        id: 'chargeur',
        name: 'Chargeur',
        description: 'Contrôler l\'électricité',
        icon: '⚡',
        color: 'yellow'
    },
    {
        id: 'discerneur',
        name: 'Discerneur',
        description: 'Mesurer le potentiel des elfes',
        icon: '🔍',
        color: 'indigo'
    },
    {
        id: 'enjoleur',
        name: 'Enjôleur',
        description: 'Chanter une douce chanson pour contrôler',
        icon: '🎵',
        color: 'pink'
    },
    {
        id: 'fluctuateur',
        name: 'Fluctuateur',
        description: 'Modifier la densité de n\'importe quelle matière',
        icon: '🌊',
        color: 'blue'
    },
    {
        id: 'givreur',
        name: 'Givreur',
        description: 'Contrôler la neige et la glace',
        icon: '❄️',
        color: 'cyan'
    },
    {
        id: 'hydrokinesiste',
        name: 'Hydrokinésiste',
        description: 'Manipuler l\'eau à leur guise',
        icon: '💧',
        color: 'blue'
    },
    {
        id: 'optimisateur',
        name: 'Optimisateur',
        description: 'Rendre plus puissant n\'importe quel autre talent',
        icon: '⭐',
        color: 'yellow'
    },
    {
        id: 'psionipathe',
        name: 'Psionipathe',
        description: 'Créer des champs de forces',
        icon: '🛡️',
        color: 'indigo'
    },
    {
        id: 'pyrokinesiste',
        name: 'Pyrokinésiste',
        description: 'Manipuler le feu',
        icon: '🔥',
        color: 'red'
    },
    {
        id: 'rafaleur',
        name: 'Rafaleur',
        description: 'Contrôler le vent',
        icon: '💨',
        color: 'cyan'
    },
    {
        id: 'vociferateur',
        name: 'Vociférateur',
        description: 'Parler extrêmement fort sans trop d\'efforts',
        icon: '📢',
        color: 'orange'
    }
];

// Options de personnalisation détaillées
const customizationOptions = {
    skinColors: [
        { name: 'Très clair', value: '#ffdbac' },
        { name: 'Clair', value: '#fdbcb4' },
        { name: 'Moyen clair', value: '#e0ac69' },
        { name: 'Moyen', value: '#d08b5b' },
        { name: 'Moyen foncé', value: '#c68642' },
        { name: 'Foncé', value: '#8d5524' },
        { name: 'Très foncé', value: '#654321' }
    ],
    eyeColors: [
        { name: 'Bleu', value: '#4a90e2' },
        { name: 'Vert', value: '#50c878' },
        { name: 'Marron', value: '#8b4513' },
        { name: 'Noisette', value: '#b8860b' },
        { name: 'Gris', value: '#708090' },
        { name: 'Violet', value: '#9370db' },
        { name: 'Ambre', value: '#ffbf00' }
    ],
    hairStyles: [
        { name: 'Court lisse', id: 'short_straight' },
        { name: 'Court bouclé', id: 'short_curly' },
        { name: 'Moyen lisse', id: 'medium_straight' },
        { name: 'Moyen bouclé', id: 'medium_curly' },
        { name: 'Long lisse', id: 'long_straight' },
        { name: 'Long bouclé', id: 'long_curly' },
        { name: 'Queue de cheval', id: 'ponytail' },
        { name: 'Chignon', id: 'bun' },
        { name: 'Raie sur le côté', id: 'side_part' },
        { name: 'Frange', id: 'bangs' }
    ],
    hairColors: [
        { name: 'Noir', value: '#1a1a1a' },
        { name: 'Brun foncé', value: '#2d1810' },
        { name: 'Brun', value: '#3d2817' },
        { name: 'Châtain', value: '#8b4513' },
        { name: 'Châtain clair', value: '#a0522d' },
        { name: 'Blond foncé', value: '#daa520' },
        { name: 'Blond', value: '#f4d03f' },
        { name: 'Blond clair', value: '#ffeb3b' },
        { name: 'Roux', value: '#a0522d' },
        { name: 'Roux clair', value: '#cd853f' },
        { name: 'Blanc', value: '#f5f5f5' },
        { name: 'Bleu', value: '#4169e1' },
        { name: 'Violet', value: '#8a2be2' },
        { name: 'Rose', value: '#ff69b4' }
    ],
    outfits: [
        { name: 'T-shirt', id: 'tshirt', color: '#4a5568', type: 'casual' },
        { name: 'Chemise', id: 'shirt', color: '#2d3748', type: 'formal' },
        { name: 'Robe', id: 'dress', color: '#718096', type: 'elegant' },
        { name: 'Veste', id: 'jacket', color: '#1a202c', type: 'formal' },
        { name: 'Haut élégant', id: 'elegant_top', color: '#4a4a4a', type: 'elegant' },
        { name: 'Sweat', id: 'hoodie', color: '#5a5a5a', type: 'casual' }
    ]
};

// Sprites disponibles (basés sur les fichiers réels)
const availableSprites = {
    body: {
        female: [
            { path: 'sprites/body/female_light.png', name: 'Clair' }
        ],
        male: [
            { path: 'sprites/body/male_light.png', name: 'Clair' },
            { path: 'sprites/body/male_tanned.png', name: 'Bronzé' },
            { path: 'sprites/body/male_dark.png', name: 'Foncé' }
        ]
    },
    hair: {
        female: [
            { path: 'sprites/hair/female_long_blonde.png', name: 'Long Blond' },
            { path: 'sprites/hair/female_long_brunette.png', name: 'Long Brun' }
            // Note: Les autres couleurs nécessitent des sprites supplémentaires
            // qui ne sont pas encore copiés dans sprites/hair/
        ],
        male: [
            { path: 'sprites/hair/male_short_blonde.png', name: 'Court Blond' },
            { path: 'sprites/hair/male_short_brunette.png', name: 'Court Brun' },
            { path: 'sprites/hair/male_short_redhead.png', name: 'Court Roux' },
            { path: 'sprites/hair/male_messy_blonde.png', name: 'Ébouriffé Blond' }
        ]
    },
    clothes: {
        female: [
            { path: 'sprites/clothes/female_dress.png', name: 'Robe Classique', type: 'dress' },
            // Note: Pour ajouter plus de robes, copier depuis lpc-sprites-temp/torso/dress_female/
            // Exemples disponibles : dress_w_sash_female.png, underdress.png, overskirt.png
        ],
        male: [
            { path: 'sprites/clothes/male_shirt_white.png', name: 'Chemise Blanche' }
        ]
    },
    bottom: {
        female: [
            { path: null, name: 'Aucun (avec robe)', note: 'Les robes couvrent déjà les jambes' },
            { path: 'sprites/clothes/pants/white_pants_female.png', name: 'Pantalon Blanc' },
            { path: 'sprites/clothes/pants/teal_pants_female.png', name: 'Pantalon Turquoise' },
            { path: 'sprites/clothes/pants/red_pants_female.png', name: 'Pantalon Rouge' },
            { path: 'sprites/clothes/pants/magenta_pants_female.png', name: 'Pantalon Magenta' }
        ],
        male: [
            { path: 'sprites/clothes/pants/white_pants_male.png', name: 'Pantalon Blanc' },
            { path: 'sprites/clothes/pants/teal_pants_male.png', name: 'Pantalon Turquoise' },
            { path: 'sprites/clothes/pants/red_pants_male.png', name: 'Pantalon Rouge' },
            { path: 'sprites/clothes/pants/magenta_pants_male.png', name: 'Pantalon Magenta' }
        ]
    }
};

// État du jeu
let gameState = {
    selectedCharacter: null,
    selectedCharacterId: null, // ID du personnage pour la config de sprites
    selectedPowers: [],
    maxPowers: 3,
    activePower: null, // Pouvoir actuellement sélectionné
    powerCooldowns: {}, // Cooldowns pour chaque pouvoir
    powerEffects: [], // Effets visuels actifs
    activePowerStates: {}, // États persistants des pouvoirs (invisibilité, phase, etc.)
    persistentShadows: [], // Ombres persistantes créées par les Ténébreux
    persistentEffects: [], // Effets persistants (eau, feu, glace, vent, etc.)
    customization: {
        bodySprite: null, // Chemin direct vers le sprite du corps
        hairSprite: null, // Chemin direct vers le sprite des cheveux
        clothesSprite: null, // Chemin direct vers le sprite des vêtements (haut)
        bottomSprite: null, // Chemin direct vers le sprite des bas/pantalons
        bottomSpriteIndex: null // Index du sprite sélectionné (pour éviter les conflits quand les chemins sont identiques)
    },
    characterPosition: { x: 5, y: 5 }, // Position en grille isométrique
    cameraOffset: { x: 0, y: 0 }, // Offset de la caméra pour le défilement
    npcs: [], // Liste des personnages non-joueurs (NPCs) sur la carte
    lastMoveTime: null, // Timestamp du dernier mouvement pour l'animation
    lastDirection: 'south' // Dernière direction du personnage principal
};

// Couleurs pour les icônes de pouvoirs
const powerColors = {
    purple: '#a855f7',
    blue: '#3b82f6',
    green: '#10b981',
    pink: '#ec4899',
    yellow: '#eab308',
    gray: '#6b7280',
    indigo: '#6366f1',
    orange: '#f97316',
    red: '#ef4444',
    cyan: '#06b6d4'
};

// Éléments DOM
const screens = {
    home: document.getElementById('home-screen'),
    characterSelection: document.getElementById('character-selection'),
    customization: document.getElementById('customization-screen'),
    powerSelection: document.getElementById('power-selection'),
    game: document.getElementById('game-screen')
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    renderCharacters();
    renderPowers();
});

// Gestionnaires d'événements
function initializeEventListeners() {
    document.getElementById('start-btn').addEventListener('click', showCharacterSelection);
    document.getElementById('confirm-customization-btn').addEventListener('click', showPowerSelection);
    document.getElementById('confirm-powers-btn').addEventListener('click', showGameScreen);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
}

// Afficher l'écran de sélection de personnage
function showCharacterSelection() {
    hideAllScreens();
    screens.characterSelection.classList.remove('hidden');
    screens.characterSelection.classList.add('animate-fade-in-up');
}

// Afficher l'écran de personnalisation
function showCustomization(character) {
    gameState.selectedCharacter = character;
    gameState.selectedCharacterId = character.id; // Sauvegarder l'ID pour utiliser la config
    document.getElementById('customization-character-name').textContent = character.name;
    hideAllScreens();
    screens.customization.classList.remove('hidden');
    screens.customization.classList.add('animate-fade-in-up');
    renderCustomizationOptions();
    drawCharacterPreview();
}

// Afficher l'écran de sélection de pouvoirs
function showPowerSelection() {
    document.getElementById('character-name').textContent = gameState.selectedCharacter.name;
    hideAllScreens();
    screens.powerSelection.classList.remove('hidden');
    screens.powerSelection.classList.add('animate-fade-in-up');
    updatePowerSelection();
}

// Afficher l'écran de jeu
function showGameScreen() {
    if (gameState.selectedPowers.length === 0) {
        alert('Veuillez sélectionner au moins un pouvoir !');
        return;
    }
    hideAllScreens();
    screens.game.classList.remove('hidden');
    screens.game.classList.add('animate-fade-in-up');
    renderGameScreen();
}

// Redémarrer le jeu
function restartGame() {
    gameState = {
        selectedCharacter: null,
        selectedCharacterId: null,
        selectedPowers: [],
        maxPowers: 3,
        activePower: null,
        powerCooldowns: {},
        powerEffects: [],
        activePowerStates: {},
        persistentShadows: [],
        persistentEffects: [],
        customization: {
            bodySprite: null,
            hairSprite: null,
            clothesSprite: null,
            bottomSprite: null,
            bottomSpriteIndex: null
        },
        characterPosition: { x: 5, y: 5 }, // Position en grille isométrique
        cameraOffset: { x: 0, y: 0 }, // Offset de la caméra pour le défilement
        npcs: [], // Liste des personnages non-joueurs (NPCs) sur la carte
        lastMoveTime: null, // Timestamp du dernier mouvement pour l'animation
        lastDirection: 'south' // Dernière direction du personnage principal
    };
    hideAllScreens();
    screens.home.classList.remove('hidden');
    renderCharacters();
    renderPowers();
}

// Cacher tous les écrans
function hideAllScreens() {
    Object.values(screens).forEach(screen => {
        screen.classList.add('hidden');
        screen.classList.remove('animate-fade-in-up');
    });
}

// Rendre les personnages
function renderCharacters() {
    const grid = document.getElementById('characters-grid');
    grid.innerHTML = '';
    
    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = `character-card bg-white/10 backdrop-blur-lg rounded-lg p-6 border-2 border-transparent`;
        card.innerHTML = `
            <div class="text-6xl mb-4 text-center">${character.image}</div>
            <h3 class="text-2xl font-bold text-white mb-2 text-center">${character.name}</h3>
            <p class="text-purple-200 text-center mb-4">${character.description}</p>
            <div class="text-center">
                <span class="inline-block ${character.colorClass} text-white px-3 py-1 rounded-full text-sm">
                    ${character.defaultPower}
                </span>
            </div>
        `;
        card.addEventListener('click', () => {
            document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            setTimeout(() => showCustomization(character), 300);
        });
        grid.appendChild(card);
    });
}

// Rendre les pouvoirs
function renderPowers() {
    const grid = document.getElementById('powers-grid');
    grid.innerHTML = '';
    
    powers.forEach(power => {
        const card = document.createElement('div');
        card.className = `power-card bg-white/10 backdrop-blur-lg rounded-lg p-6 border-2 border-transparent`;
        card.dataset.powerId = power.id;
        card.innerHTML = `
            <div class="text-5xl mb-3 text-center power-icon" style="color: ${powerColors[power.color] || powerColors.purple}">
                ${power.icon}
            </div>
            <h4 class="text-xl font-bold text-white mb-2 text-center">${power.name}</h4>
            <p class="text-purple-200 text-sm text-center">${power.description}</p>
        `;
        card.addEventListener('click', () => togglePower(power, card));
        grid.appendChild(card);
    });
}

// Basculer la sélection d'un pouvoir
function togglePower(power, cardElement) {
    const index = gameState.selectedPowers.findIndex(p => p.id === power.id);
    
    if (index > -1) {
        // Désélectionner
        gameState.selectedPowers.splice(index, 1);
        cardElement.classList.remove('selected');
    } else {
        // Sélectionner (si moins de 3)
        if (gameState.selectedPowers.length < gameState.maxPowers) {
            gameState.selectedPowers.push(power);
            cardElement.classList.add('selected');
        } else {
            // Animation de refus
            cardElement.style.animation = 'shake 0.5s';
            setTimeout(() => {
                cardElement.style.animation = '';
            }, 500);
        }
    }
    
    updatePowerSelection();
}

// Mettre à jour l'affichage de la sélection des pouvoirs
function updatePowerSelection() {
    const count = gameState.selectedPowers.length;
    document.getElementById('selected-count').textContent = count;
    const confirmBtn = document.getElementById('confirm-powers-btn');
    
    if (count > 0) {
        confirmBtn.disabled = false;
    } else {
        confirmBtn.disabled = true;
    }
    
    // Mettre à jour l'état visuel des cartes de pouvoirs
    document.querySelectorAll('.power-card').forEach(card => {
        const powerId = card.dataset.powerId;
        const isSelected = gameState.selectedPowers.some(p => p.id === powerId);
        const isMaxReached = gameState.selectedPowers.length >= gameState.maxPowers;
        
        if (isSelected) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
            if (isMaxReached) {
                card.classList.add('disabled');
            } else {
                card.classList.remove('disabled');
            }
        }
    });
}

// Rendre les options de personnalisation avec les sprites disponibles
function renderCustomizationOptions() {
    const characterId = gameState.selectedCharacterId;
    const characterConfig = characterRenderer.charactersConfig?.[characterId];
    const gender = characterConfig?.gender || 'male';
    
    // Initialiser avec la config du personnage si disponible
    if (characterConfig && characterConfig.sprites) {
        if (!gameState.customization.bodySprite) {
            gameState.customization.bodySprite = characterConfig.sprites.body;
        }
        if (!gameState.customization.hairSprite) {
            gameState.customization.hairSprite = characterConfig.sprites.hair;
        }
        if (!gameState.customization.clothesSprite) {
            gameState.customization.clothesSprite = characterConfig.sprites.clothes;
        }
        // Ne pas initialiser bottomSprite automatiquement - laisser l'utilisateur choisir
        // if (!gameState.customization.bottomSprite && characterConfig.sprites.bottom) {
        //     gameState.customization.bottomSprite = characterConfig.sprites.bottom;
        // }
    }
    
    // Initialiser bottomSprite au premier sprite disponible si null
    if (!gameState.customization.bottomSprite) {
        const bottomSprites = availableSprites.bottom[gender] || [];
        if (bottomSprites.length > 0) {
            // Ne pas initialiser automatiquement - laisser null pour que l'utilisateur choisisse
            // gameState.customization.bottomSprite = bottomSprites[0].path;
        }
    }
    
    // Corps (body sprites)
    const bodyContainer = document.getElementById('body-sprites');
    bodyContainer.innerHTML = '';
    const bodySprites = availableSprites.body[gender] || [];
    bodySprites.forEach(sprite => {
        const btn = document.createElement('button');
        btn.className = `p-3 rounded-lg border-2 transition-all bg-white/5 hover:bg-white/10 hover:scale-105 ${gameState.customization.bodySprite === sprite.path ? 'border-purple-400 bg-purple-500/30 scale-105' : 'border-transparent'}`;
        
        // Créer un conteneur pour l'aperçu
        const container = document.createElement('div');
        container.className = 'flex flex-col items-center gap-2';
        
        // Créer un canvas pour l'aperçu
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        canvas.className = 'border-2 border-purple-300 rounded-lg shadow-lg';
        const ctx = canvas.getContext('2d');
        
        // Charger et dessiner le sprite
        const img = new Image();
        img.onload = () => {
            // Dessiner le frame 0 (vue de face) - première frame de 64x64
            ctx.drawImage(img, 0, 0, 64, 64, 0, 0, 64, 64);
        };
        img.src = sprite.path;
        
        const label = document.createElement('span');
        label.className = 'text-xs text-white font-medium';
        label.textContent = sprite.name;
        
        container.appendChild(canvas);
        container.appendChild(label);
        btn.appendChild(container);
        
        btn.addEventListener('click', () => {
            gameState.customization.bodySprite = sprite.path;
            renderCustomizationOptions();
            drawCharacterPreview();
        });
        bodyContainer.appendChild(btn);
    });
    
    // Cheveux
    const hairContainer = document.getElementById('hair-sprites');
    hairContainer.innerHTML = '';
    const hairSprites = availableSprites.hair[gender] || [];
    // Filtrer les doublons (même chemin)
    const uniqueHairSprites = hairSprites.filter((sprite, index, self) => 
        index === self.findIndex(s => s.path === sprite.path)
    );
    
    uniqueHairSprites.forEach(sprite => {
        const btn = document.createElement('button');
        btn.className = `p-3 rounded-lg border-2 transition-all bg-white/5 hover:bg-white/10 hover:scale-105 ${gameState.customization.hairSprite === sprite.path ? 'border-purple-400 bg-purple-500/30 scale-105' : 'border-transparent'}`;
        
        const container = document.createElement('div');
        container.className = 'flex flex-col items-center gap-2';
        
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        canvas.className = 'border-2 border-purple-300 rounded-lg shadow-lg';
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 64, 64, 0, 0, 64, 64);
        };
        img.src = sprite.path;
        
        const label = document.createElement('span');
        label.className = 'text-xs text-white font-medium';
        label.textContent = sprite.name;
        
        container.appendChild(canvas);
        container.appendChild(label);
        btn.appendChild(container);
        
        btn.addEventListener('click', () => {
            gameState.customization.hairSprite = sprite.path;
            renderCustomizationOptions();
            drawCharacterPreview();
        });
        hairContainer.appendChild(btn);
    });
    
    // Vêtements (Haut/Robes)
    const clothesContainer = document.getElementById('clothes-sprites');
    clothesContainer.innerHTML = '';
    const clothesSprites = availableSprites.clothes[gender] || [];
    clothesSprites.forEach(sprite => {
        const btn = document.createElement('button');
        btn.className = `p-3 rounded-lg border-2 transition-all bg-white/5 hover:bg-white/10 hover:scale-105 ${gameState.customization.clothesSprite === sprite.path ? 'border-purple-400 bg-purple-500/30 scale-105' : 'border-transparent'}`;
        
        const container = document.createElement('div');
        container.className = 'flex flex-col items-center gap-2';
        
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        canvas.className = 'border-2 border-purple-300 rounded-lg shadow-lg';
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 64, 64, 0, 0, 64, 64);
        };
        img.src = sprite.path;
        
        const label = document.createElement('span');
        label.className = 'text-xs text-white font-medium text-center';
        label.textContent = sprite.name;
        
        container.appendChild(canvas);
        container.appendChild(label);
        btn.appendChild(container);
        
        btn.addEventListener('click', () => {
            gameState.customization.clothesSprite = sprite.path;
            // Si c'est une robe, suggérer de ne pas mettre de pantalon
            if (sprite.type === 'dress' && gameState.customization.bottomSprite) {
                // Optionnel : réinitialiser le pantalon si une robe est sélectionnée
                // gameState.customization.bottomSprite = null;
            }
            renderCustomizationOptions();
            drawCharacterPreview();
        });
        clothesContainer.appendChild(btn);
    });
    
    // Bas/Pantalons
    const bottomContainer = document.getElementById('bottom-sprites');
    bottomContainer.innerHTML = '';
    const bottomSprites = availableSprites.bottom[gender] || [];
    
    // Utiliser l'index pour la sélection
    bottomSprites.forEach((sprite, index) => {
        const btn = document.createElement('button');
        // Comparer avec l'index plutôt que le chemin pour éviter les conflits
        const isSelected = gameState.customization.bottomSpriteIndex === index;
        const hasSprite = sprite.path !== null && sprite.path !== undefined;
        
        btn.className = `p-3 rounded-lg border-2 transition-all hover:scale-105 ${hasSprite ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-800/50'} ${isSelected ? 'border-purple-400 bg-purple-500/30 scale-105' : 'border-transparent'}`;
        btn.dataset.spriteIndex = index;
        if (!hasSprite) {
            btn.disabled = false; // Permettre la sélection "Aucun"
            btn.title = sprite.note || 'Aucun pantalon';
        }
        
        const container = document.createElement('div');
        container.className = 'flex flex-col items-center gap-2';
        
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        canvas.className = `border-2 border-purple-300 rounded-lg shadow-lg ${!hasSprite ? 'opacity-30' : ''}`;
        const ctx = canvas.getContext('2d');
        
        if (hasSprite) {
            const img = new Image();
            img.onload = () => {
                // Dessiner le frame 0 (vue de face) - première frame de 64x64
                ctx.drawImage(img, 0, 0, 64, 64, 0, 0, 64, 64);
            };
            img.onerror = () => {
                // En cas d'erreur, dessiner un placeholder
                ctx.fillStyle = '#666';
                ctx.fillRect(0, 0, 64, 64);
                ctx.fillStyle = '#999';
                ctx.font = '8px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Erreur', 32, 32);
            };
            img.src = sprite.path;
        } else {
            // Dessiner un placeholder pour "Aucun"
            ctx.fillStyle = '#444';
            ctx.fillRect(0, 0, 64, 64);
            ctx.fillStyle = '#888';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Aucun', 32, 32);
        }
        
        const label = document.createElement('span');
        label.className = 'text-xs text-white font-medium text-center';
        label.textContent = sprite.name;
        if (sprite.note) {
            label.title = sprite.note;
        }
        
        container.appendChild(canvas);
        container.appendChild(label);
        btn.appendChild(container);
        
        btn.addEventListener('click', () => {
            gameState.customization.bottomSprite = sprite.path || null;
            gameState.customization.bottomSpriteIndex = index;
            renderCustomizationOptions();
            drawCharacterPreview();
        });
        
        bottomContainer.appendChild(btn);
    });
}

// Fonction pour dessiner un visage réaliste
function drawRealisticFace(ctx, x, y, size, skinColor, eyeColor) {
    const scale = size / 100;
    
    // Tête (forme ovale)
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.ellipse(x, y, 35 * scale, 45 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ombre sur le visage pour donner du volume
    const faceShadow = ctx.createRadialGradient(x, y - 10 * scale, 0, x, y, 50 * scale);
    faceShadow.addColorStop(0, 'rgba(0,0,0,0.1)');
    faceShadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = faceShadow;
    ctx.beginPath();
    ctx.ellipse(x, y, 35 * scale, 45 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Nez
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(x, y + 5 * scale);
    ctx.lineTo(x - 3 * scale, y + 15 * scale);
    ctx.moveTo(x, y + 5 * scale);
    ctx.lineTo(x + 3 * scale, y + 15 * scale);
    ctx.stroke();
    
    // Sourcils
    ctx.fillStyle = '#2d1810';
    ctx.beginPath();
    ctx.ellipse(x - 15 * scale, y - 10 * scale, 12 * scale, 3 * scale, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 15 * scale, y - 10 * scale, 12 * scale, 3 * scale, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Yeux (blanc)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(x - 15 * scale, y + 5 * scale, 8 * scale, 10 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 15 * scale, y + 5 * scale, 8 * scale, 10 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Iris
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.arc(x - 15 * scale, y + 5 * scale, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 15 * scale, y + 5 * scale, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupille
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x - 15 * scale, y + 5 * scale, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 15 * scale, y + 5 * scale, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Reflet dans les yeux
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x - 12 * scale, y + 3 * scale, 1.5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 18 * scale, y + 3 * scale, 1.5 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Cils
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1.5 * scale;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(x - 20 * scale + i * 2 * scale, y - 2 * scale);
        ctx.lineTo(x - 20 * scale + i * 2 * scale, y - 5 * scale);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 10 * scale + i * 2 * scale, y - 2 * scale);
        ctx.lineTo(x + 10 * scale + i * 2 * scale, y - 5 * scale);
        ctx.stroke();
    }
    
    // Bouche
    ctx.fillStyle = '#d81b60';
    ctx.beginPath();
    ctx.ellipse(x, y + 25 * scale, 6 * scale, 4 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ligne de la bouche
    ctx.strokeStyle = '#b71c1c';
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(x - 5 * scale, y + 25 * scale);
    ctx.quadraticCurveTo(x, y + 28 * scale, x + 5 * scale, y + 25 * scale);
    ctx.stroke();
    
    // Joues (roses)
    const cheekGradient = ctx.createRadialGradient(x - 20 * scale, y + 15 * scale, 0, x - 20 * scale, y + 15 * scale, 8 * scale);
    cheekGradient.addColorStop(0, 'rgba(255,182,193,0.4)');
    cheekGradient.addColorStop(1, 'rgba(255,182,193,0)');
    ctx.fillStyle = cheekGradient;
    ctx.beginPath();
    ctx.arc(x - 20 * scale, y + 15 * scale, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 20 * scale, y + 15 * scale, 8 * scale, 0, Math.PI * 2);
    ctx.fill();
}

// Fonction pour dessiner des cheveux réalistes
function drawRealisticHair(ctx, x, y, size, hairStyle, hairColor) {
    const scale = size / 100;
    ctx.fillStyle = hairColor;
    ctx.strokeStyle = hairColor;
    ctx.lineWidth = 2 * scale;
    
    // Créer un gradient pour les cheveux (plus clair au sommet)
    const hairGradient = ctx.createLinearGradient(x, y - 50 * scale, x, y);
    const lighterColor = lightenColor(hairColor, 20);
    hairGradient.addColorStop(0, lighterColor);
    hairGradient.addColorStop(1, hairColor);
    ctx.fillStyle = hairGradient;
    
    switch(hairStyle) {
        case 'short_straight':
            // Cheveux courts lisses
            ctx.beginPath();
            ctx.ellipse(x, y - 40 * scale, 40 * scale, 20 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            // Mèches
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.moveTo(x - 35 * scale + i * 10 * scale, y - 35 * scale);
                ctx.lineTo(x - 35 * scale + i * 10 * scale, y - 20 * scale);
                ctx.stroke();
            }
            break;
            
        case 'short_curly':
            // Cheveux courts bouclés
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.arc(x - 30 * scale + i * 12 * scale, y - 35 * scale, 6 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
            
        case 'medium_straight':
            // Cheveux moyens lisses
            ctx.beginPath();
            ctx.ellipse(x, y - 45 * scale, 42 * scale, 30 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            // Mèches sur les côtés
            ctx.beginPath();
            ctx.arc(x, y - 15 * scale, 42 * scale, 0, Math.PI, true);
            ctx.fill();
            // Détails
            for (let i = 0; i < 10; i++) {
                ctx.beginPath();
                ctx.moveTo(x - 40 * scale + i * 8 * scale, y - 40 * scale);
                ctx.quadraticCurveTo(x - 40 * scale + i * 8 * scale, y - 20 * scale, x - 40 * scale + i * 8 * scale, y - 5 * scale);
                ctx.stroke();
            }
            break;
            
        case 'medium_curly':
            // Cheveux moyens bouclés
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.arc(x - 35 * scale + i * 10 * scale, y - 40 * scale, 8 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.arc(x - 30 * scale + i * 12 * scale, y - 20 * scale, 7 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
            
        case 'long_straight':
            // Cheveux longs lisses
            ctx.beginPath();
            ctx.ellipse(x, y - 45 * scale, 42 * scale, 35 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y + 10 * scale, 42 * scale, 0, Math.PI, true);
            ctx.fill();
            // Mèches longues
            for (let i = 0; i < 12; i++) {
                ctx.beginPath();
                ctx.moveTo(x - 40 * scale + i * 7 * scale, y - 40 * scale);
                ctx.quadraticCurveTo(x - 40 * scale + i * 7 * scale, y, x - 40 * scale + i * 7 * scale, y + 20 * scale);
                ctx.stroke();
            }
            break;
            
        case 'long_curly':
            // Cheveux longs bouclés
            for (let i = 0; i < 10; i++) {
                ctx.beginPath();
                ctx.arc(x - 40 * scale + i * 8 * scale, y - 40 * scale, 9 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.arc(x - 35 * scale + i * 10 * scale, y - 20 * scale, 8 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.arc(x - 30 * scale + i * 12 * scale, y, 7 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            break;
            
        case 'ponytail':
            // Queue de cheval
            ctx.beginPath();
            ctx.ellipse(x, y - 45 * scale, 40 * scale, 25 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            // Queue
            ctx.beginPath();
            ctx.ellipse(x + 35 * scale, y - 10 * scale, 8 * scale, 25 * scale, -0.5, 0, Math.PI * 2);
            ctx.fill();
            // Élastique
            ctx.fillStyle = '#8b4513';
            ctx.beginPath();
            ctx.arc(x + 35 * scale, y - 10 * scale, 10 * scale, 0, Math.PI * 2);
            ctx.fill();
            break;
            
        case 'bun':
            // Chignon
            ctx.beginPath();
            ctx.ellipse(x, y - 45 * scale, 38 * scale, 20 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            // Chignon
            ctx.beginPath();
            ctx.arc(x, y - 25 * scale, 12 * scale, 0, Math.PI * 2);
            ctx.fill();
            break;
            
        case 'side_part':
            // Raie sur le côté
            ctx.beginPath();
            ctx.ellipse(x, y - 45 * scale, 42 * scale, 30 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            // Raie
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.moveTo(x - 10 * scale, y - 50 * scale);
            ctx.lineTo(x - 10 * scale, y - 20 * scale);
            ctx.stroke();
            break;
            
        case 'bangs':
            // Frange
            ctx.beginPath();
            ctx.ellipse(x, y - 45 * scale, 42 * scale, 30 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            // Frange
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.moveTo(x - 35 * scale + i * 10 * scale, y - 35 * scale);
                ctx.quadraticCurveTo(x - 35 * scale + i * 10 * scale, y - 25 * scale, x - 35 * scale + i * 10 * scale, y - 20 * scale);
                ctx.stroke();
            }
            break;
    }
}

// Fonction pour éclaircir une couleur
function lightenColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// Dessiner le personnage sur le canvas de prévisualisation
async function drawCharacterPreview() {
    const canvas = document.getElementById('character-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Utiliser uniquement les sprites LPC
    try {
        // Effacer le canvas avec un fond dégradé
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#e0f2fe');
        gradient.addColorStop(1, '#bae6fd');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 3; // Échelle plus grande pour la prévisualisation
        
        // Utiliser le renderer de sprites avec l'ID du personnage
        const characterId = gameState.selectedCharacterId || gameState.selectedCharacter?.id;
        await characterRenderer.drawCharacter(
            ctx, 
            centerX - 32 * scale / 2, // Centrer le sprite
            centerY - 32 * scale / 2, // Centrer verticalement
            gameState.customization, 
            scale,
            characterId // Passer l'ID pour utiliser la config prédéfinie
        );
    } catch (error) {
        // Si les sprites ne sont pas disponibles, afficher un message
        console.error('Erreur lors du chargement des sprites:', error);
        
        // Effacer le canvas
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#e0f2fe');
        gradient.addColorStop(1, '#bae6fd');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Afficher un message d'erreur
        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Chargement des sprites...', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Vérifiez la console pour les erreurs', canvas.width / 2, canvas.height / 2 + 25);
    }
}

// Dessiner le personnage dans l'espace de jeu (version avec sprites uniquement)
/**
 * Initialise les NPCs (personnages non-joueurs) sur la carte
 * Tous les personnages sauf celui sélectionné apparaissent comme NPCs
 */
function initializeNPCs(mapWidth, mapHeight, topDownTilemap) {
    gameState.npcs = [];
    
    // Pour chaque personnage disponible
    characters.forEach(character => {
        // Ignorer le personnage principal sélectionné
        if (character.id === gameState.selectedCharacterId) {
            return;
        }
        
        // Trouver une position aléatoire valide (traversable)
        let attempts = 0;
        let position = null;
        
        while (attempts < 50 && !position) {
            const x = Math.floor(Math.random() * mapWidth);
            const y = Math.floor(Math.random() * mapHeight);
            
            // Vérifier que la position est traversable et pas trop proche du personnage principal
            const distanceFromPlayer = Math.sqrt(
                Math.pow(x - gameState.characterPosition.x, 2) + 
                Math.pow(y - gameState.characterPosition.y, 2)
            );
            
            if (topDownTilemap.isWalkable(x, y) && distanceFromPlayer > 3) {
                position = { x, y };
            }
            attempts++;
        }
        
        // Si on n'a pas trouvé de position valide, utiliser une position par défaut
        if (!position) {
            position = { 
                x: Math.floor(Math.random() * mapWidth), 
                y: Math.floor(Math.random() * mapHeight) 
            };
        }
        
        // Créer le NPC avec sa configuration
        const npc = {
            id: character.id,
            name: character.name,
            position: { 
                x: position.x, 
                y: position.y 
            },
            targetGridX: position.x, // Position cible en grille (comme le personnage principal)
            targetGridY: position.y, // Position cible en grille (comme le personnage principal)
            lastMoveTime: Date.now(),
            moveInterval: 2000 + Math.random() * 3000, // Intervalle entre les déplacements (2-5 secondes)
            customization: getDefaultCustomizationForCharacter(character.id),
            animationStartTime: null, // Timestamp du début de l'animation de marche
            lastDirection: 'south' // Dernière direction du NPC
        };
        
        gameState.npcs.push(npc);
    });
}

/**
 * Obtient la personnalisation par défaut pour un personnage
 */
function getDefaultCustomizationForCharacter(characterId) {
    const config = characterRenderer.getCharacterConfig(characterId);
    if (!config) {
        return {
            bodySprite: null,
            hairSprite: null,
            clothesSprite: null,
            bottomSprite: null
        };
    }
    
    return {
        bodySprite: config.sprites.body || null,
        hairSprite: config.sprites.hair || null,
        clothesSprite: config.sprites.clothes || null,
        bottomSprite: null
    };
}

/**
 * Met à jour les positions des NPCs avec un déplacement aléatoire fluide (V0)
 * Les NPCs se déplacent case par case, comme le personnage principal
 */
function updateNPCsMovement(mapWidth, mapHeight, topDownTilemap) {
    const now = Date.now();
    
    gameState.npcs.forEach(npc => {
        // Calculer la position actuelle en grille (arrondie)
        const currentGridX = Math.round(npc.position.x);
        const currentGridY = Math.round(npc.position.y);
        
        // Vérifier si le NPC est arrivé à sa position cible
        const dx = npc.targetGridX - currentGridX;
        const dy = npc.targetGridY - currentGridY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Si le NPC est arrivé à destination ou très proche, choisir une nouvelle direction
        if (distance < 0.5 && (now - npc.lastMoveTime >= npc.moveInterval)) {
            // Choisir une direction aléatoire (une case à la fois)
            const directions = [
                { x: 0, y: -1, name: 'north' },  // Haut
                { x: 0, y: 1, name: 'south' },   // Bas
                { x: -1, y: 0, name: 'west' },   // Gauche
                { x: 1, y: 0, name: 'east' }    // Droite
            ];
            
            // Mélanger les directions pour plus de variété
            const shuffled = directions.sort(() => Math.random() - 0.5);
            
            let newDirection = null;
            for (const dir of shuffled) {
                const newX = currentGridX + dir.x;
                const newY = currentGridY + dir.y;
                
                // Vérifier que la position est valide et traversable
                if (newX >= 0 && newX < mapWidth && 
                    newY >= 0 && newY < mapHeight && 
                    topDownTilemap.isWalkable(newX, newY)) {
                    npc.targetGridX = newX;
                    npc.targetGridY = newY;
                    npc.lastMoveTime = now;
                    npc.moveInterval = 1500 + Math.random() * 2000; // Intervalle entre 1.5 et 3.5 secondes
                    newDirection = dir;
                    break;
                }
            }
            
            // Si aucune direction valide n'a été trouvée, attendre un peu plus
            if (!newDirection) {
                npc.lastMoveTime = now;
                npc.moveInterval = 1000; // Attendre 1 seconde avant de réessayer
            }
        }
        
        // Animer le déplacement vers la position cible (comme le personnage principal)
        const targetDx = npc.targetGridX - npc.position.x;
        const targetDy = npc.targetGridY - npc.position.y;
        const targetDistance = Math.sqrt(targetDx * targetDx + targetDy * targetDy);
        
        if (targetDistance > 0.1) {
            // Vitesse de déplacement identique au personnage principal
            npc.position.x += targetDx * 0.15;
            npc.position.y += targetDy * 0.15;
            // Démarrer l'animation si ce n'est pas déjà fait
            if (!npc.animationStartTime) {
                npc.animationStartTime = Date.now();
            }
            // Mettre à jour la direction
            npc.lastDirection = calculateDirection(targetDx, targetDy);
        } else {
            // Arrondir à la position cible exacte
            npc.position.x = npc.targetGridX;
            npc.position.y = npc.targetGridY;
            // Arrêter l'animation
            npc.animationStartTime = null;
        }
    });
}

/**
 * Dessine tous les NPCs sur la carte avec leur nom au-dessus
 */
async function drawNPCs(ctx, tileScale, topDownTilemap) {
    const actualTileSize = topDownTilemap.tmxTileWidth || topDownRenderer.tileSize;
    
    for (const npc of gameState.npcs) {
        // Calculer la position à l'écran
        const npcScreenX = npc.position.x * actualTileSize * tileScale;
        const npcScreenY = npc.position.y * actualTileSize * tileScale;
        const x = npcScreenX + gameState.cameraOffset.x;
        const y = npcScreenY + gameState.cameraOffset.y;
        
        // Calculer la direction et l'état de mouvement du NPC
        const npcDx = npc.targetGridX - npc.position.x;
        const npcDy = npc.targetGridY - npc.position.y;
        const npcDistance = Math.sqrt(npcDx * npcDx + npcDy * npcDy);
        const npcIsMoving = npcDistance > 0.1;
        
        // Calculer la direction
        const npcDirection = npcIsMoving ? calculateDirection(npcDx, npcDy) : npc.lastDirection;
        
        // Calculer le frame d'animation
        const npcAnimationFrame = npcIsMoving ? calculateWalkFrame(npc.animationStartTime, 100) : 0;
        
        // Dessiner le personnage NPC
        try {
            const scale = 48 / 64; // Même taille que le personnage principal
            await characterRenderer.drawCharacter(
                ctx,
                x - 32 * scale / 2,
                y - 32 * scale / 2,
                npc.customization,
                scale,
                npc.id,
                npcDirection, // Direction du NPC
                npcIsMoving, // Si le NPC bouge
                npcAnimationFrame // Frame d'animation
            );
        } catch (error) {
            console.warn(`Erreur lors du rendu du NPC ${npc.name}:`, error);
            // Dessiner un rectangle de secours
            ctx.fillStyle = '#888';
            ctx.fillRect(x - 16, y - 16, 32, 32);
        }
        
        // Dessiner le nom au-dessus du personnage
        ctx.save();
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        // Fond semi-transparent pour le nom
        const textMetrics = ctx.measureText(npc.name);
        const textWidth = textMetrics.width;
        const textHeight = 16;
        const padding = 4;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(
            x - textWidth / 2 - padding,
            y - 32 - textHeight - padding,
            textWidth + padding * 2,
            textHeight + padding * 2
        );
        
        // Texte du nom
        ctx.fillStyle = '#ffffff';
        ctx.fillText(npc.name, x, y - 32 - padding);
        
        ctx.restore();
    }
}

/**
 * Calcule la direction du mouvement depuis les différences de position
 * @param {number} dx - Différence en X
 * @param {number} dy - Différence en Y
 * @returns {string} Direction ('north', 'south', 'east', 'west')
 */
function calculateDirection(dx, dy) {
    // Si le mouvement est négligeable, retourner 'south' par défaut
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
        return 'south';
    }
    
    // Calculer l'angle du mouvement
    const angle = Math.atan2(dy, dx);
    
    // Convertir l'angle en direction
    // En vue top-down, on regarde depuis le haut :
    // - dy négatif = vers le haut de l'écran = north
    // - dy positif = vers le bas de l'écran = south
    // - dx négatif = vers la gauche = west
    // - dx positif = vers la droite = east
    
    // Déterminer la direction principale
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    if (absDy > absDx) {
        // Mouvement vertical dominant
        return dy < 0 ? 'north' : 'south';
    } else {
        // Mouvement horizontal dominant
        return dx < 0 ? 'west' : 'east';
    }
}

/**
 * Calcule le frame d'animation pour le cycle de marche basé sur le temps
 * @param {number} startTime - Temps de début du mouvement (timestamp)
 * @param {number} animationSpeed - Vitesse de l'animation (ms par frame, défaut: 100)
 * @returns {number} Frame d'animation (0-8)
 */
function calculateWalkFrame(startTime, animationSpeed = 100) {
    if (!startTime) return 0;
    const elapsed = Date.now() - startTime;
    const frame = Math.floor(elapsed / animationSpeed) % 9; // 9 frames pour walkcycle
    return frame;
}

async function drawCharacterOnGameCanvas(ctx, x, y, size = 80, direction = 'south', isMoving = false, animationFrame = 0) {
    // Utiliser uniquement les sprites LPC
    // Augmenter la taille par défaut pour mieux voir le personnage
    try {
        const scale = size / 64; // Les sprites LPC font généralement 64x64
        const characterId = gameState.selectedCharacterId || gameState.selectedCharacter?.id;
        await characterRenderer.drawCharacter(
            ctx, 
            x - 32 * scale / 2, // Centrer le sprite
            y - 32 * scale / 2, // Centrer verticalement aussi
            gameState.customization, 
            scale,
            characterId, // Passer l'ID pour utiliser la config prédéfinie
            direction, // Direction du personnage
            isMoving, // Si le personnage bouge
            animationFrame // Frame d'animation
        );
        return; // Succès
    } catch (error) {
        // Si les sprites ne sont pas disponibles, afficher un message
        console.error('Erreur lors du rendu du personnage:', error);
        // Dessiner un rectangle simple pour indiquer l'erreur
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x - 16, y - 16, 32, 32);
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', x, y);
    }
}

// Initialiser l'espace de jeu top-down (vue de dessus)
async function initializeGameCanvas() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Ajuster la taille du canvas
    const container = canvas.parentElement;
    canvas.width = container.clientWidth - 32; // Padding
    canvas.height = 500; // Hauteur fixe définie dans le HTML
    
    // Configurer le canvas pour un rendu net (sans anti-aliasing qui peut créer des espaces)
    ctx.imageSmoothingEnabled = false; // Désactiver l'anti-aliasing pour un rendu pixel-perfect
    
    // Échelle d'affichage des tuiles (32x32 pixels -> ~11x11 pixels à l'écran pour dézoomer)
    // Facteur de dézoom de 3, donc scale = 1
    const tileScale = 1;
    
    // Initialiser la tilemap en chargeant la carte TMX d'exemple
    const mapWidth = 30;
    const mapHeight = 30;
    
    // Charger la carte village.tmx
    const tmxPath = 'village.tmx';
    const loaded = await topDownTilemap.loadFromTMX(tmxPath, mapWidth, mapHeight);
    
    if (!loaded) {
        // Fallback vers la génération manuelle si le TMX ne charge pas
        console.warn('Impossible de charger le TMX, utilisation de la génération manuelle');
        topDownTilemap.createCastleMap(mapWidth, mapHeight);
    }
    
    // Pré-rendre la carte sur un canvas offscreen pour optimiser les performances
    console.log('Pré-rendu de la carte en cours...');
    await topDownTilemap.prerender(tileScale);
    console.log('Carte pré-rendue avec succès !');
    
    // Position initiale du personnage (dans la cour de la maison)
    gameState.characterPosition.x = 15;
    gameState.characterPosition.y = 15;
    
    // Initialiser les NPCs (personnages non-joueurs)
    initializeNPCs(mapWidth, mapHeight, topDownTilemap);
    
    // Vérifier le statut des assets
    checkTopDownAssetsStatus();
    
    // Position cible en grille
    let targetGridX = gameState.characterPosition.x;
    let targetGridY = gameState.characterPosition.y;
    
    // Calculer l'offset de la caméra pour centrer le personnage
    function updateCameraOffset() {
        // Utiliser la taille des tuiles TMX si disponible, sinon la taille par défaut
        const actualTileSize = topDownTilemap.tmxTileWidth || topDownRenderer.tileSize;
        const charScreenX = gameState.characterPosition.x * actualTileSize * tileScale;
        const charScreenY = gameState.characterPosition.y * actualTileSize * tileScale;
        gameState.cameraOffset.x = canvas.width / 2 - charScreenX;
        gameState.cameraOffset.y = canvas.height / 2 - charScreenY;
    }
    updateCameraOffset();
    
    // Dessiner l'environnement top-down
    async function drawTopDownEnvironment() {
        // Fond
        ctx.fillStyle = '#87CEEB'; // Ciel bleu
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dessiner la tilemap
        try {
            if (topDownTilemap && topDownTilemap.width > 0 && topDownTilemap.height > 0) {
                await topDownTilemap.draw(ctx, gameState.cameraOffset.x, gameState.cameraOffset.y, tileScale);
            } else {
                console.warn('Tilemap non initialisée');
                ctx.fillStyle = '#000000';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Tilemap non initialisée', canvas.width / 2, canvas.height / 2);
            }
        } catch (error) {
            console.error('Erreur lors du dessin de la tilemap:', error);
            ctx.fillStyle = '#ff0000';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Erreur de chargement des tuiles: ' + error.message, canvas.width / 2, canvas.height / 2);
        }
    }
    
    // Dessiner le personnage en vue top-down
    async function drawTopDownCharacter() {
        try {
            // Vérifier si le personnage est invisible (Éclipseur/Flasheur actif)
            const isInvisible = gameState.selectedPowers.some(p => 
                (p.id === 'eclipseur' || p.id === 'flasheur') && 
                gameState.activePowerStates[p.id]
            );
            
            if (isInvisible) {
                // Dessiner un effet de transparence au lieu du personnage
                const actualTileSize = topDownTilemap.tmxTileWidth || topDownRenderer.tileSize;
                const charScreenX = gameState.characterPosition.x * actualTileSize * tileScale;
                const charScreenY = gameState.characterPosition.y * actualTileSize * tileScale;
                const x = charScreenX + gameState.cameraOffset.x;
                const y = charScreenY + gameState.cameraOffset.y;
                
                // Dessiner un contour translucide pour indiquer la position
                ctx.save();
                ctx.globalAlpha = 0.3;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, 24, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
                return;
            }
            
            // Utiliser la taille des tuiles TMX si disponible, sinon la taille par défaut
            const actualTileSize = topDownTilemap.tmxTileWidth || topDownRenderer.tileSize;
            const charScreenX = gameState.characterPosition.x * actualTileSize * tileScale;
            const charScreenY = gameState.characterPosition.y * actualTileSize * tileScale;
            
            const x = charScreenX + gameState.cameraOffset.x;
            const y = charScreenY + gameState.cameraOffset.y;
            
            // Calculer la direction et l'état de mouvement
            const dx = targetGridX - gameState.characterPosition.x;
            const dy = targetGridY - gameState.characterPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const isMoving = distance > 0.1;
            
            // Calculer la direction
            const direction = isMoving ? calculateDirection(dx, dy) : gameState.lastDirection;
            gameState.lastDirection = direction;
            
            // Calculer le frame d'animation
            if (isMoving && !gameState.lastMoveTime) {
                gameState.lastMoveTime = Date.now();
            } else if (!isMoving) {
                gameState.lastMoveTime = null;
            }
            
            const animationFrame = isMoving ? calculateWalkFrame(gameState.lastMoveTime, 100) : 0;
            
            // Dessiner le personnage centré sur la tuile (taille fixe, indépendante du zoom de la carte)
            // Le personnage reste à 48 pixels même si la carte est dézoomée
            await drawCharacterOnGameCanvas(ctx, x, y, 48, direction, isMoving, animationFrame).catch(err => {
                console.error('Erreur lors du rendu du personnage:', err);
            });
        } catch (error) {
            console.error('Erreur lors du rendu du personnage:', error);
        }
    }
    
    // Fonction d'animation
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Animation de déplacement en grille du personnage principal
        const dx = targetGridX - gameState.characterPosition.x;
        const dy = targetGridY - gameState.characterPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0.1) {
            gameState.characterPosition.x += dx * 0.15;
            gameState.characterPosition.y += dy * 0.15;
            updateCameraOffset();
        } else {
            gameState.characterPosition.x = targetGridX;
            gameState.characterPosition.y = targetGridY;
            // Réinitialiser le temps de mouvement quand on s'arrête
            gameState.lastMoveTime = null;
        }
        
        // Mettre à jour le mouvement des NPCs
        updateNPCsMovement(mapWidth, mapHeight, topDownTilemap);
        
        // Dessiner l'environnement
        drawTopDownEnvironment().then(() => {
            // Dessiner les NPCs avant le personnage principal (pour la profondeur)
            drawNPCs(ctx, tileScale, topDownTilemap).then(() => {
                // Dessiner le personnage principal après les NPCs
                drawTopDownCharacter();
                
                // Dessiner les effets de pouvoirs (vue top-down)
                drawPowerEffects(ctx);
            }).catch(err => {
                console.error('Erreur lors du rendu des NPCs:', err);
                // Continuer même si les NPCs ne se dessinent pas
                drawTopDownCharacter();
                drawPowerEffects(ctx);
            });
        }).catch(err => {
            console.error('Erreur lors du rendu de l\'environnement:', err);
        });
        
        requestAnimationFrame(animate);
    }
    
    // Gestion du clic pour déplacer
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Convertir les coordonnées de la souris en coordonnées de grille
        // Utiliser la taille des tuiles TMX si disponible
        const actualTileSize = topDownTilemap.tmxTileWidth || topDownRenderer.tileSize;
        const gridPos = topDownRenderer.getGridPositionFromMouse(
            mouseX,
            mouseY,
            gameState.cameraOffset.x,
            gameState.cameraOffset.y,
            tileScale,
            actualTileSize
        );
        
        // Vérifier que la position est dans les limites de la carte
        const roundedX = Math.round(gridPos.x);
        const roundedY = Math.round(gridPos.y);
        
        if (roundedX >= 0 && roundedX < mapWidth && 
            roundedY >= 0 && roundedY < mapHeight) {
            // Vérifier si la position est traversable
            if (topDownTilemap.isWalkable(gridPos.x, gridPos.y)) {
                targetGridX = roundedX;
                targetGridY = roundedY;
            } else {
                console.log('Position bloquée par un mur ou un bâtiment');
            }
        }
    });
    
    // Gestion du clavier pour déplacer avec les flèches
    const keysPressed = new Set();
    
    // Fonction pour déplacer le personnage d'une case dans une direction
    function moveCharacter(direction) {
        let newX = targetGridX;
        let newY = targetGridY;
        
        switch(direction) {
            case 'up':
                newY = Math.max(0, targetGridY - 1);
                break;
            case 'down':
                newY = Math.min(mapHeight - 1, targetGridY + 1);
                break;
            case 'left':
                newX = Math.max(0, targetGridX - 1);
                break;
            case 'right':
                newX = Math.min(mapWidth - 1, targetGridX + 1);
                break;
        }
        
        // Vérifier si le personnage peut traverser les obstacles (pouvoir Phaseur/Éclipseur)
        const canPhase = gameState.selectedPowers.some(p => 
            (p.id === 'phaseur' || p.id === 'eclipseur') && 
            gameState.activePowerStates[p.id]
        );
        
        // Vérifier que la nouvelle position est traversable (ou si on peut phaser)
        if (canPhase || topDownTilemap.isWalkable(newX, newY)) {
            targetGridX = newX;
            targetGridY = newY;
        }
    }
    
    // Gestionnaire d'événements pour les touches pressées
    window.addEventListener('keydown', (e) => {
        // Éviter le défilement de la page avec les flèches
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
        
        // Ajouter la touche à l'ensemble des touches pressées
        keysPressed.add(e.key);
        
        // Déplacer immédiatement si c'est une flèche
        switch(e.key) {
            case 'ArrowUp':
                moveCharacter('up');
                break;
            case 'ArrowDown':
                moveCharacter('down');
                break;
            case 'ArrowLeft':
                moveCharacter('left');
                break;
            case 'ArrowRight':
                moveCharacter('right');
                break;
        }
    });
    
    // Gestionnaire pour les touches relâchées
    window.addEventListener('keyup', (e) => {
        keysPressed.delete(e.key);
    });
    
    // Redimensionner le canvas si la fenêtre change
    window.addEventListener('resize', () => {
        canvas.width = container.clientWidth - 32;
        updateCameraOffset();
    });
    
    animate();
}

// Vérifier le statut des assets et mettre à jour l'affichage
async function checkTopDownAssetsStatus() {
    const statusDiv = document.getElementById('assets-status');
    if (!statusDiv) return;
    
    // Toujours cacher le message pour l'instant (les placeholders fonctionnent)
    statusDiv.style.display = 'none';
    
    // Optionnel : vérifier si les assets existent vraiment
    // const testPaths = [
    //     'assets/roguelike-rpg/Base/tile_0000.png',
    //     'assets/roguelike-rpg/Dungeon/tile_0000.png',
    //     'assets/roguelike-rpg/Indoor/tile_0000.png'
    // ];
    // 
    // let assetsFound = false;
    // for (const path of testPaths) {
    //     try {
    //         const response = await fetch(path, { method: 'HEAD' });
    //         if (response.ok) {
    //             assetsFound = true;
    //             break;
    //         }
    //     } catch (e) {
    //         // Continue à vérifier les autres chemins
    //     }
    // }
    // 
    // if (assetsFound) {
    //     statusDiv.style.display = 'none';
    // } else {
    //     statusDiv.style.display = 'block';
    // }
}

// Vérifier le statut des assets et mettre à jour l'affichage (ancienne fonction pour compatibilité)
async function checkAssetsStatus() {
    // Utiliser la nouvelle fonction pour le top-down
    await checkTopDownAssetsStatus();
    
    try {
        // Tester si on peut charger une tuile
        const testTile = await spriteLoader.loadImage('assets/isometric/tiles/floor_S.png');
        if (testTile && testTile.complete && testTile.naturalWidth > 0) {
            // Assets disponibles - cacher le message
            statusDiv.style.display = 'none';
            console.log('✅ Assets isométriques détectés et chargés');
            return;
        }
    } catch (error) {
        console.warn('⚠️ Assets isométriques non trouvés:', error);
    }
    
    // Assets non disponibles - afficher le message
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = `
        <div class="text-yellow-300 font-semibold mb-1">📦 Assets requis</div>
        <div>Téléchargez les Isometric Prototypes Tiles depuis :</div>
        <div class="text-blue-300 underline">kenney-assets.itch.io/isometric-prototypes-tiles</div>
        <div class="mt-1">Placez-les dans <code class="bg-black/30 px-1 rounded">assets/isometric/tiles/</code></div>
        <div class="mt-2 text-xs text-yellow-200">💡 Note: Utilisez un serveur local (python -m http.server) pour éviter les problèmes CORS</div>
    `;
}

// Dessiner les effets de pouvoirs en vue isométrique
function drawPowerEffectsIsometric(ctx) {
    const now = Date.now();
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    
    // Filtrer les effets expirés et les dessiner
    gameState.powerEffects = gameState.powerEffects.filter(effect => {
        const elapsed = now - effect.startTime;
        const progress = elapsed / effect.duration;
        
        if (progress >= 1) {
            return false; // Supprimer l'effet expiré
        }
        
        // Convertir la position du personnage en coordonnées isométriques
        const { screenX, screenY } = isometricRenderer.cartesianToIsometric(
            effect.x,
            effect.y
        );
        
        const x = screenX + gameState.cameraOffset.x;
        const y = screenY + gameState.cameraOffset.y;
        
        // Dessiner l'effet avec les nouvelles coordonnées
        const effectWithCoords = { ...effect, x, y };
        drawEffectByType(ctx, effectWithCoords, progress, canvas);
        return true; // Garder l'effet
    });
}

// Rendre l'écran de jeu
function renderGameScreen() {
    const character = gameState.selectedCharacter;
    const powersDisplay = document.getElementById('powers-display');
    const appearanceDisplay = document.getElementById('appearance-display');
    
    // Nom du personnage
    document.getElementById('game-character-name').textContent = character.name;
    
    // Pouvoirs
    const powersText = gameState.selectedPowers.map(p => p.name).join(', ');
    document.getElementById('game-character-powers').textContent = powersText || 'Aucun pouvoir';
    
    // Mini aperçu
    const miniCanvas = document.createElement('canvas');
    miniCanvas.width = 64;
    miniCanvas.height = 64;
    const miniCtx = miniCanvas.getContext('2d');
    // Remplir le fond
    miniCtx.fillStyle = '#e0f2fe';
    miniCtx.fillRect(0, 0, 64, 64);
    // Dessiner le personnage
    drawCharacterOnGameCanvas(miniCtx, 32, 48, 20).then(() => {
        document.getElementById('character-mini-display').innerHTML = '';
        document.getElementById('character-mini-display').appendChild(miniCanvas);
    }).catch(() => {
        // Fallback si erreur
        document.getElementById('character-mini-display').innerHTML = '';
        document.getElementById('character-mini-display').appendChild(miniCanvas);
    });
    
    // Afficher les pouvoirs
    powersDisplay.innerHTML = '';
    gameState.selectedPowers.forEach(power => {
        const powerCard = document.createElement('div');
        powerCard.className = 'bg-white/10 backdrop-blur-lg rounded-lg p-3 border-2 border-green-500';
        powerCard.innerHTML = `
            <div class="text-2xl mb-1 text-center">${power.icon}</div>
            <h4 class="text-sm font-bold text-white mb-1 text-center">${power.name}</h4>
        `;
        powersDisplay.appendChild(powerCard);
    });
    
    // Initialiser le sélecteur de pouvoir actif
    initializePowerSelector();
    
    // Initialiser les événements clavier
    initializePowerControls();
    
    // Afficher l'apparence
    const skinName = customizationOptions.skinColors.find(c => c.value === gameState.customization.skinColor)?.name || 'Clair';
    const eyeColorName = customizationOptions.eyeColors.find(c => c.value === gameState.customization.eyeColor)?.name || 'Bleu';
    const hairStyleName = customizationOptions.hairStyles.find(h => h.id === gameState.customization.hairStyle)?.name || 'Moyen';
    const hairColorName = customizationOptions.hairColors.find(c => c.value === gameState.customization.hairColor)?.name || 'Brun';
    const outfitName = customizationOptions.outfits.find(o => o.id === gameState.customization.outfit)?.name || 'T-shirt';
    
    appearanceDisplay.innerHTML = `
        <p><strong>Peau:</strong> ${skinName}</p>
        <p><strong>Yeux:</strong> ${eyeColorName}</p>
        <p><strong>Cheveux:</strong> ${hairStyleName} - ${hairColorName}</p>
        <p><strong>Tenue:</strong> ${outfitName}</p>
    `;
    
    // Initialiser le canvas de jeu
    setTimeout(() => {
        initializeGameCanvas();
    }, 100);
}

// Initialiser le sélecteur de pouvoir actif
function initializePowerSelector() {
    const powerButtonsContainer = document.getElementById('power-buttons');
    if (!powerButtonsContainer) return;
    
    powerButtonsContainer.innerHTML = '';
    
    if (gameState.selectedPowers.length === 0) {
        powerButtonsContainer.innerHTML = '<span class="text-purple-200 text-sm">Aucun pouvoir sélectionné</span>';
        return;
    }
    
    // Sélectionner le premier pouvoir par défaut
    if (!gameState.activePower && gameState.selectedPowers.length > 0) {
        gameState.activePower = gameState.selectedPowers[0].id;
    }
    
    // Créer un bouton pour chaque pouvoir
    gameState.selectedPowers.forEach((power, index) => {
        const button = document.createElement('button');
        const isActive = gameState.activePower === power.id;
        const color = powerColors[power.color] || powerColors.purple;
        
        button.className = `power-selector-btn px-4 py-2 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
            isActive ? 'ring-4 ring-offset-2' : 'opacity-70'
        }`;
        button.style.backgroundColor = isActive ? color : `${color}80`;
        button.style.color = 'white';
        button.style.border = `2px solid ${color}`;
        button.style.boxShadow = isActive ? `0 0 20px ${color}` : 'none';
        
        button.innerHTML = `
            <span class="text-xl">${power.icon}</span>
            <span class="ml-2">${power.name}</span>
        `;
        
        button.addEventListener('click', () => {
            gameState.activePower = power.id;
            updatePowerSelector();
            // Si c'est un pouvoir toggle, lancer l'activation/désactivation
            const togglePowers = ['eclipseur', 'flasheur', 'phaseur'];
            if (togglePowers.includes(power.id)) {
                launchActivePower();
            }
        });
        
        // Raccourci clavier (1, 2, 3)
        document.addEventListener('keydown', (e) => {
            if (e.key === String(index + 1) && e.target.tagName !== 'INPUT') {
                gameState.activePower = power.id;
                updatePowerSelector();
            }
        });
        
        powerButtonsContainer.appendChild(button);
    });
}

// Mettre à jour l'affichage du sélecteur de pouvoir
function updatePowerSelector() {
    const buttons = document.querySelectorAll('.power-selector-btn');
    buttons.forEach((button, index) => {
        const power = gameState.selectedPowers[index];
        if (!power) return;
        
        const isActive = gameState.activePower === power.id;
        const color = powerColors[power.color] || powerColors.purple;
        
        // Vérifier si le pouvoir a un état actif (toggle)
        const isStateActive = gameState.activePowerStates[power.id] || false;
        
        button.style.backgroundColor = isActive ? color : `${color}80`;
        button.style.boxShadow = isActive ? `0 0 20px ${color}` : 'none';
        button.style.opacity = isActive ? '1' : '0.7';
        
        // Ajouter un indicateur visuel si le pouvoir est activé (toggle)
        if (isStateActive && (power.id === 'eclipseur' || power.id === 'flasheur' || power.id === 'phaseur')) {
            button.style.border = `3px solid ${color}`;
            button.style.animation = 'pulse 1s infinite';
        } else {
            button.style.border = `2px solid ${color}`;
            button.style.animation = 'none';
        }
    });
}

// Initialiser les contrôles de pouvoir (barre d'espace)
function initializePowerControls() {
    document.addEventListener('keydown', (e) => {
        // Éviter de déclencher si on est dans un input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Barre d'espace pour lancer le pouvoir
        if (e.code === 'Space' && screens.game && !screens.game.classList.contains('hidden')) {
            e.preventDefault();
            launchActivePower();
        }
    });
}

// Lancer le pouvoir actif
function launchActivePower() {
    if (!gameState.activePower) {
        return;
    }
    
    const power = gameState.selectedPowers.find(p => p.id === gameState.activePower);
    if (!power) {
        return;
    }
    
    // Pouvoirs avec états persistants (toggle)
    const togglePowers = ['eclipseur', 'flasheur', 'phaseur']; // Éclipseur, Flasheur, Phaseur
    
    if (togglePowers.includes(power.id)) {
        // Toggle l'état du pouvoir
        const isActive = gameState.activePowerStates[power.id] || false;
        gameState.activePowerStates[power.id] = !isActive;
        
        // Effet visuel pour l'activation/désactivation
        createPowerEffect(power);
        
        // Message de feedback
        if (gameState.activePowerStates[power.id]) {
            showCooldownMessage(`${power.name} activé !`, 'success');
        } else {
            showCooldownMessage(`${power.name} désactivé`, 'info');
        }
        return;
    }
    
    // Pouvoirs avec effets persistants (Ténébreux crée des ombres)
    if (power.id === 'tenebreux') {
        const now = Date.now();
        const lastUsed = gameState.powerCooldowns[power.id] || 0;
        const cooldownTime = 1000; // 1 seconde
        
        if (now - lastUsed < cooldownTime) {
            const remaining = ((cooldownTime - (now - lastUsed)) / 1000).toFixed(1);
            showCooldownMessage(`Rechargement: ${remaining}s`);
            return;
        }
        
        gameState.powerCooldowns[power.id] = now;
        
        // Créer une ombre persistante à la position du personnage
        createPersistentShadow(power);
        createPowerEffect(power);
        updateCooldownIndicator(power, cooldownTime);
        return;
    }
    
    // Pouvoirs avec effets instantanés (par défaut)
    const now = Date.now();
    const lastUsed = gameState.powerCooldowns[power.id] || 0;
    const cooldownTime = 2000; // 2 secondes
    
    if (now - lastUsed < cooldownTime) {
        const remaining = ((cooldownTime - (now - lastUsed)) / 1000).toFixed(1);
        showCooldownMessage(`Rechargement: ${remaining}s`);
        return;
    }
    
    // Mettre à jour le cooldown
    gameState.powerCooldowns[power.id] = now;
    
    // Créer l'effet visuel
    createPowerEffect(power);
    
    // Effets spéciaux selon le pouvoir
    applyPowerEffect(power);
    
    // Mettre à jour l'indicateur de cooldown
    updateCooldownIndicator(power, cooldownTime);
}

// Appliquer les effets pratiques des pouvoirs
function applyPowerEffect(power) {
    switch(power.id) {
        case 'telepathe':
            // La télépathie pourrait révéler des informations (pas d'effet visuel immédiat)
            showCooldownMessage('Pensées perçues...', 'info');
            break;
        case 'empathe':
            // L'empathie permet de ressentir les émotions
            showCooldownMessage('Émotions perçues...', 'info');
            break;
        case 'technopathe':
            // Interaction avec la technologie (pas d'effet immédiat visible)
            showCooldownMessage('Technologie détectée', 'info');
            break;
        case 'hydrokinesiste':
            // Créer un effet d'eau persistant qui se diffuse
            createPersistentWaterEffect(power);
            showCooldownMessage('Eau contrôlée', 'info');
            break;
        case 'pyrokinesiste':
            // Créer un effet de feu persistant qui se diffuse
            createPersistentFireEffect(power);
            showCooldownMessage('Feu contrôlé', 'info');
            break;
        case 'givreur':
            // Créer un effet de glace persistant
            createPersistentIceEffect(power);
            showCooldownMessage('Glace contrôlée', 'info');
            break;
        case 'rafaleur':
            // Créer un effet de vent persistant
            createPersistentWindEffect(power);
            showCooldownMessage('Vent contrôlé', 'info');
            break;
        case 'teleporteur':
            // Téléporter le personnage à un endroit aléatoire
            teleportCharacterRandomly();
            showCooldownMessage('Téléportation !', 'success');
            break;
        case 'chargeur':
            // Créer un effet d'électricité
            createPersistentElectricityEffect(power);
            showCooldownMessage('Électricité contrôlée', 'info');
            break;
        case 'fluctuateur':
            // Modifier la densité de la matière (effet visuel d'aura)
            showCooldownMessage('Densité modifiée', 'info');
            break;
        case 'psionipathe':
            // Créer un champ de force (effet visuel d'aura)
            showCooldownMessage('Champ de force créé', 'info');
            break;
        case 'instillateur':
            // Instiller des émotions (effet visuel d'aura)
            showCooldownMessage('Émotions instillées', 'info');
            break;
        case 'optimisateur':
            // Amplifier les autres talents (effet visuel d'étincelles)
            showCooldownMessage('Talents amplifiés', 'success');
            break;
        case 'enjoleur':
            // Chant hypnotique (effet visuel de spirale)
            showCooldownMessage('Chant enjôleur', 'info');
            break;
        case 'vociferateur':
            // Parler très fort (effet visuel d'ondes sonores)
            showCooldownMessage('Voix amplifiée', 'info');
            break;
        case 'invocateur':
            // Invoquer des objets (effet visuel d'étincelles)
            showCooldownMessage('Objet invoqué', 'info');
            break;
        case 'discerneur':
            // Mesurer le potentiel (pas d'effet visuel immédiat)
            showCooldownMessage('Potentiel mesuré', 'info');
            break;
    }
}

// Créer un effet d'eau persistant qui se diffuse
function createPersistentWaterEffect(power) {
    const waterEffect = {
        type: 'water',
        x: gameState.characterPosition.x,
        y: gameState.characterPosition.y,
        startTime: Date.now(),
        duration: 5000, // 5 secondes
        radius: 0,
        maxRadius: 3, // Rayon maximum en tuiles
        color: '#4A90E2',
        particles: [] // Particules d'eau
    };
    
    // Créer des particules d'eau initiales
    for (let i = 0; i < 20; i++) {
        waterEffect.particles.push({
            x: waterEffect.x + (Math.random() - 0.5) * 2,
            y: waterEffect.y + (Math.random() - 0.5) * 2,
            vx: (Math.random() - 0.5) * 0.1,
            vy: (Math.random() - 0.5) * 0.1,
            life: 1.0
        });
    }
    
    gameState.persistentEffects.push(waterEffect);
}

// Créer un effet de feu persistant qui se diffuse
function createPersistentFireEffect(power) {
    const fireEffect = {
        type: 'fire',
        x: gameState.characterPosition.x,
        y: gameState.characterPosition.y,
        startTime: Date.now(),
        duration: 5000, // 5 secondes
        radius: 0,
        maxRadius: 3, // Rayon maximum en tuiles
        color: '#FF4500',
        particles: [] // Particules de feu
    };
    
    // Créer des particules de feu initiales
    for (let i = 0; i < 30; i++) {
        fireEffect.particles.push({
            x: fireEffect.x + (Math.random() - 0.5) * 2,
            y: fireEffect.y + (Math.random() - 0.5) * 2,
            vx: (Math.random() - 0.5) * 0.15,
            vy: -Math.random() * 0.2, // Le feu monte
            life: 1.0,
            size: Math.random() * 3 + 2
        });
    }
    
    gameState.persistentEffects.push(fireEffect);
}

// Créer un effet de glace persistant
function createPersistentIceEffect(power) {
    const iceEffect = {
        type: 'ice',
        x: gameState.characterPosition.x,
        y: gameState.characterPosition.y,
        startTime: Date.now(),
        duration: 4000, // 4 secondes
        radius: 0,
        maxRadius: 2.5,
        color: '#87CEEB',
        crystals: [] // Cristaux de glace
    };
    
    // Créer des cristaux de glace
    for (let i = 0; i < 15; i++) {
        iceEffect.crystals.push({
            x: iceEffect.x + (Math.random() - 0.5) * 3,
            y: iceEffect.y + (Math.random() - 0.5) * 3,
            size: Math.random() * 8 + 4,
            rotation: Math.random() * Math.PI * 2
        });
    }
    
    gameState.persistentEffects.push(iceEffect);
}

// Créer un effet de vent persistant
function createPersistentWindEffect(power) {
    const windEffect = {
        type: 'wind',
        x: gameState.characterPosition.x,
        y: gameState.characterPosition.y,
        startTime: Date.now(),
        duration: 3000, // 3 secondes
        radius: 0,
        maxRadius: 4,
        color: '#E0E0E0',
        direction: Math.random() * Math.PI * 2,
        particles: []
    };
    
    // Créer des particules de vent
    for (let i = 0; i < 25; i++) {
        windEffect.particles.push({
            x: windEffect.x + (Math.random() - 0.5) * 4,
            y: windEffect.y + (Math.random() - 0.5) * 4,
            vx: Math.cos(windEffect.direction) * 0.2,
            vy: Math.sin(windEffect.direction) * 0.2,
            life: 1.0
        });
    }
    
    gameState.persistentEffects.push(windEffect);
}

// Créer un effet d'électricité persistant
function createPersistentElectricityEffect(power) {
    const electricEffect = {
        type: 'electricity',
        x: gameState.characterPosition.x,
        y: gameState.characterPosition.y,
        startTime: Date.now(),
        duration: 2000, // 2 secondes
        radius: 0,
        maxRadius: 2,
        color: '#FFD700',
        bolts: [] // Éclairs
    };
    
    // Créer des éclairs
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        electricEffect.bolts.push({
            x: electricEffect.x,
            y: electricEffect.y,
            angle: angle,
            length: Math.random() * 30 + 20,
            segments: Math.floor(Math.random() * 5) + 3
        });
    }
    
    gameState.persistentEffects.push(electricEffect);
}

// Téléporter le personnage à un endroit aléatoire
function teleportCharacterRandomly() {
    // Obtenir les dimensions de la carte
    const mapWidth = topDownTilemap.width || 30;
    const mapHeight = topDownTilemap.height || 20;
    
    // Essayer plusieurs positions aléatoires jusqu'à trouver une traversable
    let attempts = 0;
    let newX, newY;
    
    do {
        newX = Math.floor(Math.random() * mapWidth);
        newY = Math.floor(Math.random() * mapHeight);
        attempts++;
    } while (!topDownTilemap.isWalkable(newX, newY) && attempts < 50);
    
    // Si on a trouvé une position valide, téléporter
    if (topDownTilemap.isWalkable(newX, newY)) {
        // Effet de disparition
        createPowerEffect({
            id: 'teleporteur',
            name: 'Téléporteur',
            color: '#3b82f6'
        });
        
        // Attendre un peu puis téléporter
        setTimeout(() => {
            gameState.characterPosition.x = newX;
            gameState.characterPosition.y = newY;
            
            // Effet de réapparition
            createPowerEffect({
                id: 'teleporteur',
                name: 'Téléporteur',
                color: '#3b82f6'
            });
        }, 300);
    } else {
        showCooldownMessage('Aucune position valide trouvée', 'info');
    }
}

// Créer une ombre persistante pour les Ténébreux
function createPersistentShadow(power) {
    const shadow = {
        x: gameState.characterPosition.x,
        y: gameState.characterPosition.y,
        startTime: Date.now(),
        duration: 10000, // 10 secondes
        color: powerColors[power.color] || '#000000',
        opacity: 0.7
    };
    
    gameState.persistentShadows.push(shadow);
    
    // Limiter le nombre d'ombres (max 5)
    if (gameState.persistentShadows.length > 5) {
        gameState.persistentShadows.shift();
    }
}

// Créer un effet visuel pour un pouvoir
function createPowerEffect(power) {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    // Utiliser les coordonnées de grille du personnage
    const charX = gameState.characterPosition.x;
    const charY = gameState.characterPosition.y;
    const color = powerColors[power.color] || powerColors.purple;
    
    // Créer un effet selon le type de pouvoir
    const effect = {
        powerId: power.id,
        powerName: power.name,
        color: color,
        startTime: Date.now(),
        duration: 1000, // 1 seconde
        x: charX, // Coordonnées en grille
        y: charY, // Coordonnées en grille
        type: getPowerEffectType(power.id)
    };
    
    gameState.powerEffects.push(effect);
}

// Déterminer le type d'effet selon le pouvoir
function getPowerEffectType(powerId) {
    const effectTypes = {
        'telepathe': 'wave', // Ondes cérébrales
        'teleporteur': 'teleport', // Téléportation avec particules
        'empathe': 'aura', // Aura émotionnelle
        'flasheur': 'flash', // Flash d'invisibilité
        'polyglotte': 'sound', // Ondes sonores
        'tenebreux': 'shadow', // Ombres
        'technopathe': 'circuit', // Circuits électriques
        'invocateur': 'sparkle', // Étincelles
        'hypnotiseur': 'spiral', // Spirale hypnotique
        'eclipseur': 'light', // Lumière
        'phaseur': 'teleport', // Phase avec particules
        'chargeur': 'circuit', // Électricité
        'hydrokinesiste': 'wave', // Ondes d'eau
        'pyrokinesiste': 'flame', // Flammes
        'givreur': 'wave', // Ondes de glace
        'rafaleur': 'wave', // Ondes de vent
        'fluctuateur': 'aura', // Aura de matière
        'psionipathe': 'aura', // Champ de force
        'instillateur': 'aura', // Aura émotionnelle
        'optimisateur': 'sparkle', // Étincelles d'amplification
        'enjoleur': 'spiral', // Spirale hypnotique
        'vociferateur': 'sound' // Ondes sonores
    };
    
    return effectTypes[powerId] || 'ray';
}

// Dessiner les effets de pouvoirs (vue top-down)
function drawPowerEffects(ctx) {
    const now = Date.now();
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    
    // Obtenir la taille des tuiles pour convertir les coordonnées de grille en coordonnées d'écran
    const actualTileSize = topDownTilemap.tmxTileWidth || topDownRenderer.tileSize;
    const tileScale = 1; // Échelle des tuiles (dézoomée d'un facteur 3)
    
    // Dessiner les ombres persistantes des Ténébreux
    gameState.persistentShadows = gameState.persistentShadows.filter(shadow => {
        const elapsed = now - shadow.startTime;
        const progress = elapsed / shadow.duration;
        
        if (progress >= 1) {
            return false; // Supprimer l'ombre expirée
        }
        
        // Convertir les coordonnées de grille en coordonnées d'écran
        const screenX = shadow.x * actualTileSize * tileScale + gameState.cameraOffset.x;
        const screenY = shadow.y * actualTileSize * tileScale + gameState.cameraOffset.y;
        
        // Dessiner l'ombre avec fade out
        ctx.save();
        ctx.globalAlpha = shadow.opacity * (1 - progress);
        ctx.fillStyle = shadow.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Effet d'ombre plus sombre au centre
        const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, 20);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
        
        return true;
    });
    
    // Dessiner les effets persistants (eau, feu, glace, vent, électricité)
    gameState.persistentEffects = gameState.persistentEffects.filter(effect => {
        const elapsed = now - effect.startTime;
        const progress = elapsed / effect.duration;
        
        if (progress >= 1) {
            return false; // Supprimer l'effet expiré
        }
        
        // Convertir les coordonnées de grille en coordonnées d'écran
        const screenX = effect.x * actualTileSize * tileScale + gameState.cameraOffset.x;
        const screenY = effect.y * actualTileSize * tileScale + gameState.cameraOffset.y;
        
        // Dessiner selon le type d'effet
        switch(effect.type) {
            case 'water':
                drawPersistentWater(ctx, effect, progress, screenX, screenY, actualTileSize * tileScale);
                break;
            case 'fire':
                drawPersistentFire(ctx, effect, progress, screenX, screenY, actualTileSize * tileScale);
                break;
            case 'ice':
                drawPersistentIce(ctx, effect, progress, screenX, screenY, actualTileSize * tileScale);
                break;
            case 'wind':
                drawPersistentWind(ctx, effect, progress, screenX, screenY, actualTileSize * tileScale);
                break;
            case 'electricity':
                drawPersistentElectricity(ctx, effect, progress, screenX, screenY, actualTileSize * tileScale);
                break;
        }
        
        return true;
    });
    
    // Filtrer les effets expirés et les dessiner
    gameState.powerEffects = gameState.powerEffects.filter(effect => {
        const elapsed = now - effect.startTime;
        const progress = elapsed / effect.duration;
        
        if (progress >= 1) {
            return false; // Supprimer l'effet expiré
        }
        
        // Convertir les coordonnées de grille en coordonnées d'écran (top-down)
        // Utiliser la même logique que drawTopDownCharacter
        const screenX = effect.x * actualTileSize * tileScale + gameState.cameraOffset.x;
        const screenY = effect.y * actualTileSize * tileScale + gameState.cameraOffset.y;
        
        // Créer une copie de l'effet avec les coordonnées d'écran
        const screenEffect = {
            ...effect,
            x: screenX,
            y: screenY
        };
        
        // Dessiner l'effet selon son type
        drawEffectByType(ctx, screenEffect, progress, canvas);
        return true; // Garder l'effet
    });
}

// Dessiner un effet selon son type
function drawEffectByType(ctx, effect, progress, canvas) {
    const { x, y, color, type } = effect;
    
    ctx.save();
    ctx.globalAlpha = 1 - progress; // Fade out
    
    switch (type) {
        case 'ray':
            // Rayon simple
            drawRay(ctx, x, y, color, progress);
            break;
        case 'wave':
            // Ondes concentriques
            drawWave(ctx, x, y, color, progress);
            break;
        case 'teleport':
            // Particules de téléportation
            drawTeleportParticles(ctx, x, y, color, progress);
            break;
        case 'aura':
            // Aura autour du personnage
            drawAura(ctx, x, y, color, progress);
            break;
        case 'flash':
            // Flash d'invisibilité
            drawFlash(ctx, x, y, color, progress);
            break;
        case 'sound':
            // Ondes sonores
            drawSoundWaves(ctx, x, y, color, progress);
            break;
        case 'shadow':
            // Ombres
            drawShadow(ctx, x, y, color, progress);
            break;
        case 'circuit':
            // Circuits électriques
            drawCircuit(ctx, x, y, color, progress);
            break;
        case 'sparkle':
            // Étincelles
            drawSparkles(ctx, x, y, color, progress);
            break;
        case 'spiral':
            // Spirale hypnotique
            drawSpiral(ctx, x, y, color, progress);
            break;
        case 'flame':
            // Flammes
            drawFlame(ctx, x, y, color, progress);
            break;
        case 'light':
            // Lumière
            drawLight(ctx, x, y, color, progress);
            break;
        case 'strike':
            // Coup
            drawStrike(ctx, x, y, color, progress);
            break;
        default:
            drawRay(ctx, x, y, color, progress);
    }
    
    ctx.restore();
}

// Fonctions de dessin pour chaque type d'effet
function drawRay(ctx, x, y, color, progress) {
    const length = 150 * (1 - progress);
    const angle = Math.PI * 2 * progress;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    
    for (let i = 0; i < 8; i++) {
        const a = angle + (Math.PI * 2 * i / 8);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * length, y + Math.sin(a) * length);
        ctx.stroke();
    }
}

function drawWave(ctx, x, y, color, progress) {
    const radius = 50 + (progress * 200);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    
    for (let i = 0; i < 3; i++) {
        const r = radius - (i * 20);
        if (r > 0) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

function drawTeleportParticles(ctx, x, y, color, progress) {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 80 * progress;
        const px = x + Math.cos(angle) * distance;
        const py = y + Math.sin(angle) * distance;
        
        ctx.fillStyle = color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(px, py, 4 * (1 - progress), 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawAura(ctx, x, y, color, progress) {
    const radius = 60 + Math.sin(progress * Math.PI * 4) * 10;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, color + '80');
    gradient.addColorStop(1, color + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawFlash(ctx, x, y, color, progress) {
    const size = 100 * (1 - progress);
    
    ctx.fillStyle = color + '40';
    ctx.shadowBlur = 30;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

function drawSoundWaves(ctx, x, y, color, progress) {
    for (let i = 0; i < 5; i++) {
        const offset = i * 0.2;
        const waveProgress = (progress + offset) % 1;
        const radius = 30 + waveProgress * 150;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1 - waveProgress;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function drawShadow(ctx, x, y, color, progress) {
    const shadowCount = 3;
    
    for (let i = 0; i < shadowCount; i++) {
        const offset = i * 20;
        const alpha = (1 - progress) / shadowCount;
        
        ctx.fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(x + offset, y + offset, 40 * (1 - progress), 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawCircuit(ctx, x, y, color, progress) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const length = 60 * progress;
        const startX = x + Math.cos(angle) * 30;
        const startY = y + Math.sin(angle) * 30;
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Nœud
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(endX, endY, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawSparkles(ctx, x, y, color, progress) {
    const sparkleCount = 15;
    
    for (let i = 0; i < sparkleCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkleCount;
        const distance = 80 * progress;
        const px = x + Math.cos(angle) * distance;
        const py = y + Math.sin(angle) * distance;
        
        ctx.fillStyle = color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(px, py, 5 * (1 - progress), 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawSpiral(ctx, x, y, color, progress) {
    const turns = 3;
    const radius = 50 * progress;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    
    ctx.beginPath();
    for (let i = 0; i < 100; i++) {
        const angle = (i / 100) * Math.PI * 2 * turns;
        const r = (i / 100) * radius;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.stroke();
}

function drawFlame(ctx, x, y, color, progress) {
    const height = 100 * (1 - progress);
    
    const gradient = ctx.createLinearGradient(x, y, x, y - height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, color + 'CC');
    gradient.addColorStop(1, color + '00');
    
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.quadraticCurveTo(x - 10, y - height, x, y - height);
    ctx.quadraticCurveTo(x + 10, y - height, x + 20, y);
    ctx.closePath();
    ctx.fill();
}

function drawLight(ctx, x, y, color, progress) {
    const radius = 80 * (1 - progress);
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.3, color + 'AA');
    gradient.addColorStop(0.6, color + '66');
    gradient.addColorStop(1, color + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawStrike(ctx, x, y, color, progress) {
    const length = 120 * (1 - progress);
    const angle = Math.PI * 2 * progress;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.shadowBlur = 25;
    ctx.shadowColor = color;
    
    for (let i = 0; i < 4; i++) {
        const a = angle + (Math.PI * i / 2);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(a) * length, y + Math.sin(a) * length);
        ctx.stroke();
    }
}

// Fonctions de dessin pour les effets persistants

// Dessiner un effet d'eau persistant qui se diffuse
function drawPersistentWater(ctx, effect, progress, screenX, screenY, tileSize) {
    const now = Date.now();
    const elapsed = now - effect.startTime;
    
    // Mettre à jour le rayon (se diffuse progressivement)
    effect.radius = Math.min(effect.maxRadius, progress * effect.maxRadius);
    
    // Mettre à jour les particules
    effect.particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        
        // Réinitialiser les particules qui sortent du rayon
        const distFromCenter = Math.sqrt(
            Math.pow(particle.x - effect.x, 2) + 
            Math.pow(particle.y - effect.y, 2)
        );
        if (distFromCenter > effect.radius * tileSize || particle.life <= 0) {
            particle.x = effect.x + (Math.random() - 0.5) * 0.5;
            particle.y = effect.y + (Math.random() - 0.5) * 0.5;
            particle.vx = (Math.random() - 0.5) * 0.1;
            particle.vy = (Math.random() - 0.5) * 0.1;
            particle.life = 1.0;
        }
    });
    
    ctx.save();
    ctx.globalAlpha = 0.7 * (1 - progress);
    
    // Dessiner les particules d'eau
    effect.particles.forEach(particle => {
        const px = screenX + (particle.x - effect.x) * tileSize;
        const py = screenY + (particle.y - effect.y) * tileSize;
        
        ctx.fillStyle = effect.color;
        ctx.beginPath();
        ctx.arc(px, py, 3 * particle.life, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Cercle d'eau qui se diffuse
    const radius = effect.radius * tileSize;
    const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius);
    gradient.addColorStop(0, effect.color + '80');
    gradient.addColorStop(0.5, effect.color + '40');
    gradient.addColorStop(1, effect.color + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Dessiner un effet de feu persistant qui se diffuse
function drawPersistentFire(ctx, effect, progress, screenX, screenY, tileSize) {
    const now = Date.now();
    
    // Mettre à jour le rayon
    effect.radius = Math.min(effect.maxRadius, progress * effect.maxRadius);
    
    // Mettre à jour les particules de feu
    effect.particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.03;
        particle.size *= 0.98;
        
        // Réinitialiser les particules qui sortent du rayon
        const distFromCenter = Math.sqrt(
            Math.pow(particle.x - effect.x, 2) + 
            Math.pow(particle.y - effect.y, 2)
        );
        if (distFromCenter > effect.radius * tileSize || particle.life <= 0) {
            particle.x = effect.x + (Math.random() - 0.5) * 0.5;
            particle.y = effect.y + (Math.random() - 0.5) * 0.5;
            particle.vx = (Math.random() - 0.5) * 0.15;
            particle.vy = -Math.random() * 0.2;
            particle.life = 1.0;
            particle.size = Math.random() * 3 + 2;
        }
    });
    
    ctx.save();
    ctx.globalAlpha = 0.8 * (1 - progress);
    
    // Dessiner les particules de feu
    effect.particles.forEach(particle => {
        const px = screenX + (particle.x - effect.x) * tileSize;
        const py = screenY + (particle.y - effect.y) * tileSize;
        
        // Gradient de feu (rouge -> orange -> jaune)
        const fireGradient = ctx.createRadialGradient(px, py, 0, px, py, particle.size);
        fireGradient.addColorStop(0, '#FFD700');
        fireGradient.addColorStop(0.5, '#FF4500');
        fireGradient.addColorStop(1, '#FF0000');
        
        ctx.fillStyle = fireGradient;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF4500';
        ctx.beginPath();
        ctx.arc(px, py, particle.size * particle.life, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Zone de feu qui se diffuse
    const radius = effect.radius * tileSize;
    const fireGradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius);
    fireGradient.addColorStop(0, '#FF4500' + '60');
    fireGradient.addColorStop(0.5, '#FF0000' + '30');
    fireGradient.addColorStop(1, '#FF0000' + '00');
    
    ctx.fillStyle = fireGradient;
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Dessiner un effet de glace persistant
function drawPersistentIce(ctx, effect, progress, screenX, screenY, tileSize) {
    // Mettre à jour le rayon
    effect.radius = Math.min(effect.maxRadius, progress * effect.maxRadius);
    
    ctx.save();
    ctx.globalAlpha = 0.6 * (1 - progress);
    
    // Dessiner les cristaux de glace
    effect.crystals.forEach(crystal => {
        const cx = screenX + (crystal.x - effect.x) * tileSize;
        const cy = screenY + (crystal.y - effect.y) * tileSize;
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(crystal.rotation + progress * Math.PI);
        
        // Dessiner un cristal hexagonal
        ctx.strokeStyle = effect.color;
        ctx.fillStyle = effect.color + '40';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 5;
        ctx.shadowColor = effect.color;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            const px = Math.cos(angle) * crystal.size;
            const py = Math.sin(angle) * crystal.size;
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    });
    
    // Zone de glace qui se diffuse
    const radius = effect.radius * tileSize;
    const iceGradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius);
    iceGradient.addColorStop(0, effect.color + '50');
    iceGradient.addColorStop(0.5, effect.color + '30');
    iceGradient.addColorStop(1, effect.color + '00');
    
    ctx.fillStyle = iceGradient;
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Dessiner un effet de vent persistant
function drawPersistentWind(ctx, effect, progress, screenX, screenY, tileSize) {
    // Mettre à jour le rayon
    effect.radius = Math.min(effect.maxRadius, progress * effect.maxRadius);
    
    // Mettre à jour les particules de vent
    effect.particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.04;
        
        // Réinitialiser les particules qui sortent du rayon
        const distFromCenter = Math.sqrt(
            Math.pow(particle.x - effect.x, 2) + 
            Math.pow(particle.y - effect.y, 2)
        );
        if (distFromCenter > effect.radius * tileSize || particle.life <= 0) {
            particle.x = effect.x + (Math.random() - 0.5) * 1;
            particle.y = effect.y + (Math.random() - 0.5) * 1;
            particle.vx = Math.cos(effect.direction) * 0.2;
            particle.vy = Math.sin(effect.direction) * 0.2;
            particle.life = 1.0;
        }
    });
    
    ctx.save();
    ctx.globalAlpha = 0.5 * (1 - progress);
    
    // Dessiner les particules de vent (lignes)
    effect.particles.forEach(particle => {
        const px = screenX + (particle.x - effect.x) * tileSize;
        const py = screenY + (particle.y - effect.y) * tileSize;
        
        ctx.strokeStyle = effect.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = particle.life * 0.5;
        
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(
            px + Math.cos(effect.direction) * 15 * particle.life,
            py + Math.sin(effect.direction) * 15 * particle.life
        );
        ctx.stroke();
    });
    
    ctx.restore();
}

// Dessiner un effet d'électricité persistant
function drawPersistentElectricity(ctx, effect, progress, screenX, screenY, tileSize) {
    ctx.save();
    ctx.globalAlpha = 0.8 * (1 - progress);
    
    // Dessiner les éclairs
    effect.bolts.forEach((bolt, index) => {
        const time = (Date.now() - effect.startTime) / 100;
        const flicker = Math.sin(time * 10 + index) > 0;
        
        if (!flicker) return;
        
        ctx.strokeStyle = effect.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = effect.color;
        
        // Dessiner un éclair en zigzag
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        
        let currentX = screenX;
        let currentY = screenY;
        const segmentLength = bolt.length / bolt.segments;
        
        for (let i = 0; i < bolt.segments; i++) {
            const offset = (Math.random() - 0.5) * 10;
            currentX += Math.cos(bolt.angle) * segmentLength + Math.cos(bolt.angle + Math.PI/2) * offset;
            currentY += Math.sin(bolt.angle) * segmentLength + Math.sin(bolt.angle + Math.PI/2) * offset;
            ctx.lineTo(currentX, currentY);
        }
        
        ctx.stroke();
    });
    
    // Zone d'électricité
    const radius = effect.maxRadius * tileSize * progress;
    const electricGradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, radius);
    electricGradient.addColorStop(0, effect.color + '40');
    electricGradient.addColorStop(1, effect.color + '00');
    
    ctx.fillStyle = electricGradient;
    ctx.beginPath();
    ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Afficher un message de cooldown
function showCooldownMessage(message, type = 'default') {
    const indicator = document.getElementById('power-cooldown-indicator');
    if (indicator) {
        indicator.textContent = message;
        indicator.classList.remove('hidden');
        
        // Changer la couleur selon le type
        if (type === 'success') {
            indicator.style.color = '#10b981'; // Vert
        } else if (type === 'info') {
            indicator.style.color = '#3b82f6'; // Bleu
        } else {
            indicator.style.color = '#ffffff'; // Blanc par défaut
        }
        
        setTimeout(() => {
            indicator.classList.add('hidden');
        }, 2000);
    }
}

// Mettre à jour l'indicateur de cooldown
function updateCooldownIndicator(power, cooldownTime) {
    const startTime = Date.now();
    const updateInterval = 100; // Mettre à jour toutes les 100ms
    
    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = cooldownTime - elapsed;
        
        if (remaining <= 0) {
            clearInterval(interval);
            return;
        }
        
        const seconds = (remaining / 1000).toFixed(1);
        // L'indicateur sera mis à jour automatiquement lors du prochain lancement
    }, updateInterval);
}

// Animation de secousse pour le refus
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

