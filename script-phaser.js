/**
 * Jeu Gardiens des Cités Perdues - Version Phaser
 * Migration progressive vers Phaser 3 avec sprites LPC et carte TMX
 */

// Données des personnages disponibles
const characters = [
    {
        id: 'sophie',
        name: 'Sophie Foster',
        description: 'Télépathe exceptionnelle, capable de communiquer avec les animaux',
        biographie: 'Élevée par des humains, Sophie découvre qu\'elle est une elfe génétiquement modifiée par le Cygne Noir : le Projet Colibri. Dotée de multiples talents rares (Télépathe, Infiglatrice, Téléporteur), elle est la clé pour sauver les Cités Perdues.',
        image: '👩‍🦰',
        colorClass: 'bg-purple-600',
        defaultPower: 'telepathe'
    },
    {
        id: 'fitz',
        name: 'Fitz Vacker',
        description: 'Télépathe talentueux, membre de la famille Vacker',
        biographie: 'C\'est lui qui retrouve Sophie dans le monde humain. Membre de la prestigieuse famille Vacker, Fitz est un télépathe d\'élite et le Cognat de Sophie. Malgré son image de « garçon parfait », il lutte contre la pression familiale et ses propres colères.',
        image: '👨',
        colorClass: 'bg-blue-600',
        defaultPower: 'telepathe'
    },
    {
        id: 'keefe',
        name: 'Keefe Sencen',
        description: 'Empathe, capable de ressentir et manipuler les émotions',
        biographie: 'Rebelle et blagueur, Keefe cache de profondes blessures familiales liées à sa mère, une chef des Invisibles. Empathe puissant, il développe par la suite des capacités inédites qui font de lui une arme redoutable, tout en protégeant Sophie.',
        image: '😎',
        colorClass: 'bg-yellow-600',
        defaultPower: 'empathe'
    },
    {
        id: 'dex',
        name: 'Dex Dizznee',
        description: 'Technopathe, créateur d\'inventions extraordinaires',
        biographie: 'Meilleur ami de Sophie, Dex est un génie de l\'alchimie. Fils d\'un « mauvais assortiment », il prouve sa valeur en créant des gadgets indispensables à l\'équipe. Sa loyauté est sans faille et il est capable de pirater n\'importe quel système.',
        image: '🤓',
        colorClass: 'bg-green-600',
        defaultPower: 'technopathe'
    },
    {
        id: 'biana',
        name: 'Biana Vacker',
        description: 'Éclipseuse, capable de devenir invisible',
        biographie: 'Sœur de Fitz, Biana passe d\'une image de princesse superficielle à une guerrière redoutable. Éclipseuse talentueuse, elle utilise son invisibilité pour l\'espionnage. Marquée physiquement par ses combats, elle fait preuve d\'un courage inébranlable.',
        image: '😊',
        colorClass: 'bg-pink-600',
        defaultPower: 'eclipseur'
    },
    {
        id: 'tam',
        name: 'Tam Song',
        description: 'Ténébreux, maître des ombres et de l\'hydrombre',
        biographie: 'Frère jumeau de Linh, Tam est un Ténébreux méfiant et protecteur. Banni de l\'Atlantide pour avoir refusé d\'abandonner sa sœur, il cache un cœur loyal sous son attitude sombre et sarcastique. Il maîtrise les ombres comme personne d\'autre.',
        image: '😐',
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

const SPRITE_LAYERS_ORDER = ['body', 'bottom', 'clothes', 'hair'];
const LPC_COLUMNS = 13;

// Sprites disponibles pour la personnalisation
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
            { path: 'sprites/clothes/female_dress_sash.png', name: 'Robe avec Ceinture', type: 'dress' },
            { path: 'sprites/clothes/female_dress_under.png', name: 'Sous-Robe', type: 'dress' },
            { path: 'sprites/clothes/female_shirt_white.png', name: 'Chemisier Blanc', type: 'shirt' },
            { path: 'sprites/clothes/female_shirt_blue.png', name: 'Chemisier Turquoise', type: 'shirt' },
            { path: 'sprites/clothes/female_tunic_white.png', name: 'Tunique Blanche', type: 'tunic' },
            { path: 'sprites/clothes/female_tunic_brown.png', name: 'Tunique Marron', type: 'tunic' },
            { path: 'sprites/clothes/female_tunic_maroon.png', name: 'Tunique Bordeaux', type: 'tunic' },
            { path: 'sprites/clothes/female_tunic_teal.png', name: 'Tunique Turquoise', type: 'tunic' }
        ],
        male: [
            { path: 'sprites/clothes/male_shirt_white.png', name: 'Chemise Blanche' },
            { path: 'sprites/clothes/male_shirt_brown.png', name: 'Chemise Marron', type: 'shirt' },
            { path: 'sprites/clothes/male_shirt_maroon.png', name: 'Chemise Bordeaux', type: 'shirt' },
            { path: 'sprites/clothes/male_shirt_teal.png', name: 'Chemise Turquoise', type: 'shirt' },
            { path: 'sprites/clothes/male_tunic_white.png', name: 'Tunique Blanche', type: 'tunic' },
            { path: 'sprites/clothes/male_tunic_brown.png', name: 'Tunique Marron', type: 'tunic' }
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
    selectedCharacterId: null,
    selectedPowers: [],
    maxPowers: 3,
    activePower: null,
    powerCooldowns: {},
    activePowerStates: {},
    customization: {
        bodySprite: null,
        hairSprite: null,
        clothesSprite: null,
        bottomSprite: null,
        bottomSpriteIndex: null
    },
    npcs: [],
    lastMoveTime: null,
    lastDirection: 'south',
    currentMood: 'calm' // Humeur du joueur pour les dialogues
};

// Instance Phaser
let phaserGame = null;
let gameScene = null;
let phaserBootstrapData = null;

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
    // renderPowers() sera appelé quand l'écran de jeu sera affiché
});

// Gestionnaires d'événements
function initializeEventListeners() {
    document.getElementById('start-btn').addEventListener('click', () => {
        hideAllScreens();
        screens.characterSelection.classList.remove('hidden');
        screens.characterSelection.classList.add('animate-fade-in-up');
    });

    // Bouton de confirmation de personnalisation
    const confirmCustomizationBtn = document.getElementById('confirm-customization-btn');
    if (confirmCustomizationBtn) {
        confirmCustomizationBtn.addEventListener('click', () => {
            hideAllScreens();
            screens.game.classList.remove('hidden');
            screens.game.classList.add('animate-fade-in-up');
            // Attendre que le DOM soit mis à jour avant de rendre les pouvoirs
            setTimeout(() => {
                console.log('Tentative de rendu des pouvoirs après affichage de l\'écran de jeu');
                renderPowers(); // Afficher les pouvoirs dans l'interface de test
            }, 100);
            initializePhaserGame().catch(err => console.error('Erreur Phaser:', err));
        });
    }

    document.getElementById('restart-btn').addEventListener('click', async () => {
        if (phaserGame) {
            phaserGame.destroy(true);
            phaserGame = null;
        }
        gameState = {
            selectedCharacter: null,
            selectedCharacterId: null,
            selectedPowers: [],
            maxPowers: 3,
            activePower: null,
            powerCooldowns: {},
            activePowerStates: {},
            customization: {
                bodySprite: null,
                hairSprite: null,
                clothesSprite: null,
                bottomSprite: null,
                bottomSpriteIndex: null
            },
            npcs: [],
            lastMoveTime: null,
            lastDirection: 'south'
        };
        hideAllScreens();
        screens.home.classList.remove('hidden');
        renderCharacters();
        renderPowers();
    });
}

function hideAllScreens() {
    Object.values(screens).forEach(screen => {
        screen.classList.add('hidden');
        screen.classList.remove('animate-fade-in-up');
    });
}

// Rendre les personnages
function renderCharacters() {
    const grid = document.getElementById('characters-grid');
    if (!grid) return;
    grid.innerHTML = '';

    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = `character-card bg-white/10 backdrop-blur-lg rounded-lg p-6 border-2 border-transparent cursor-pointer transition-all hover:scale-105`;
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
            gameState.selectedCharacter = character;
            gameState.selectedCharacterId = character.id;
            setTimeout(() => {
                showCustomization(character);
            }, 300);
        });
        grid.appendChild(card);
    });
}

// Afficher l'écran de personnalisation
function showCustomization(character) {
    gameState.selectedCharacter = character;
    gameState.selectedCharacterId = character.id;

    const nameEl = document.getElementById('customization-character-name');
    if (nameEl) {
        nameEl.textContent = character.name;
    }

    hideAllScreens();
    screens.customization.classList.remove('hidden');
    screens.customization.classList.add('animate-fade-in-up');

    // Rendre les options et l'aperçu
    renderCustomizationOptions();
    drawCharacterPreview();
}

// Rendre les options de personnalisation avec les sprites disponibles
function renderCustomizationOptions() {
    const characterId = gameState.selectedCharacterId;
    if (!characterRenderer || !characterRenderer.charactersConfig) {
        console.error('characterRenderer ou charactersConfig non disponible');
        return;
    }

    const characterConfig = characterRenderer.charactersConfig[characterId];
    const gender = characterConfig?.gender || (characterId === 'sophie' || characterId === 'biana' ? 'female' : 'male');

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
    }

    // Corps (body sprites)
    const bodyContainer = document.getElementById('body-sprites');
    if (bodyContainer) {
        bodyContainer.innerHTML = '';
        const bodySprites = availableSprites.body[gender] || [];
        bodySprites.forEach(sprite => {
            const btn = document.createElement('button');
            btn.className = `p-3 rounded-lg border-2 transition-all bg-white/5 hover:bg-white/10 hover:scale-105 ${gameState.customization.bodySprite === sprite.path ? 'border-purple-400 bg-purple-500/30 scale-105' : 'border-transparent'}`;

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
            img.onerror = () => {
                ctx.fillStyle = '#666';
                ctx.fillRect(0, 0, 64, 64);
                ctx.fillStyle = '#999';
                ctx.font = '8px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Erreur', 32, 32);
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
    }

    // Cheveux
    const hairContainer = document.getElementById('hair-sprites');
    if (hairContainer) {
        hairContainer.innerHTML = '';
        const hairSprites = availableSprites.hair[gender] || [];
        hairSprites.forEach(sprite => {
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
            img.onerror = () => {
                ctx.fillStyle = '#666';
                ctx.fillRect(0, 0, 64, 64);
                ctx.fillStyle = '#999';
                ctx.font = '8px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Erreur', 32, 32);
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
    }

    // Vêtements (Haut/Robes)
    const clothesContainer = document.getElementById('clothes-sprites');
    if (clothesContainer) {
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
            img.onerror = () => {
                ctx.fillStyle = '#666';
                ctx.fillRect(0, 0, 64, 64);
                ctx.fillStyle = '#999';
                ctx.font = '8px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Erreur', 32, 32);
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
                renderCustomizationOptions();
                drawCharacterPreview();
            });
            clothesContainer.appendChild(btn);
        });
    }

    // Bas/Pantalons
    const bottomContainer = document.getElementById('bottom-sprites');
    if (bottomContainer) {
        bottomContainer.innerHTML = '';
        const bottomSprites = availableSprites.bottom[gender] || [];

        bottomSprites.forEach((sprite, index) => {
            const btn = document.createElement('button');
            const isSelected = gameState.customization.bottomSpriteIndex === index;
            const hasSprite = sprite.path !== null && sprite.path !== undefined;

            btn.className = `p-3 rounded-lg border-2 transition-all hover:scale-105 ${hasSprite ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-800/50'} ${isSelected ? 'border-purple-400 bg-purple-500/30 scale-105' : 'border-transparent'}`;
            btn.dataset.spriteIndex = index;

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
                    ctx.drawImage(img, 0, 0, 64, 64, 0, 0, 64, 64);
                };
                img.onerror = () => {
                    ctx.fillStyle = '#666';
                    ctx.fillRect(0, 0, 64, 64);
                    ctx.fillStyle = '#999';
                    ctx.font = '8px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Erreur', 32, 32);
                };
                img.src = sprite.path;
            } else {
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
}

// Dessiner le personnage sur le canvas de prévisualisation
async function drawCharacterPreview() {
    const canvas = document.getElementById('character-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    try {
        // Effacer le canvas avec un fond dégradé
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#e0f2fe');
        gradient.addColorStop(1, '#bae6fd');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 3;

        const characterId = gameState.selectedCharacterId || gameState.selectedCharacter?.id;
        if (characterRenderer) {
            await characterRenderer.waitForConfig();
            await characterRenderer.drawCharacter(
                ctx,
                centerX - 32 * scale / 2,
                centerY - 32 * scale / 2,
                gameState.customization,
                scale,
                characterId,
                'south',
                false,
                0
            );
        }
    } catch (error) {
        console.error('Erreur lors du chargement des sprites:', error);

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#e0f2fe');
        gradient.addColorStop(1, '#bae6fd');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#666';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Chargement des sprites...', canvas.width / 2, canvas.height / 2);
    }
}

// Rendre les pouvoirs pour le test
function renderPowers() {
    console.log('=== renderPowers() appelé ===');
    console.log('powers défini?', typeof powers !== 'undefined');
    console.log('Nombre de pouvoirs:', typeof powers !== 'undefined' ? powers.length : 0);

    // Chercher l'élément même s'il est caché
    const powersList = document.getElementById('powers-test-list');
    if (!powersList) {
        console.warn('Élément powers-test-list non trouvé');
        console.log('Tous les éléments avec id:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
        // Réessayer plusieurs fois
        let attempts = 0;
        const retry = setInterval(() => {
            attempts++;
            const retryList = document.getElementById('powers-test-list');
            if (retryList) {
                console.log(`Élément trouvé après ${attempts} tentatives`);
                clearInterval(retry);
                renderPowers();
            } else if (attempts >= 10) {
                console.error('Élément powers-test-list toujours non trouvé après 10 tentatives');
                clearInterval(retry);
            }
        }, 100);
        return;
    }

    console.log('Élément powers-test-list trouvé!');
    console.log('Élément visible?', powersList.offsetParent !== null);
    console.log('Nombre de pouvoirs à afficher:', powers.length);
    console.log('Liste des pouvoirs:', powers.map(p => p.name));

    powersList.innerHTML = '';

    if (!powers || powers.length === 0) {
        console.warn('Aucun pouvoir disponible');
        powersList.innerHTML = '<p class="text-purple-200 text-sm">Aucun pouvoir disponible</p>';
        return;
    }

    // Afficher tous les pouvoirs
    console.log(`Affichage de ${powers.length} pouvoirs...`);
    powers.forEach((power, index) => {
        console.log(`Rendu du pouvoir ${index + 1}/${powers.length}: ${power.name}`);
        const isSelected = gameState.selectedPowers.some(p => p.id === power.id);
        const isActive = gameState.activePower === power.id;
        const isStateActive = gameState.activePowerStates[power.id] || false;

        const powerCard = document.createElement('div');
        powerCard.className = `power-card p-3 rounded-lg cursor-pointer transition-all ${isSelected ? 'ring-2 ring-purple-400' : 'bg-white/5'
            } ${isActive ? 'bg-purple-600/30' : ''}`;

        const powerColors = {
            purple: 'bg-purple-600',
            green: 'bg-green-600',
            indigo: 'bg-indigo-600',
            pink: 'bg-pink-600',
            gray: 'bg-gray-600',
            cyan: 'bg-cyan-600'
        };

        const borderColor = isSelected ? 'border-purple-400' : 'border-transparent';
        const bgColor = isSelected ? 'bg-purple-600/30' : 'bg-white/5';
        const hoverEffect = isSelected ? '' : 'hover:bg-white/10';

        powerCard.innerHTML = `
            <div class="flex items-center gap-2 mb-1">
                <span class="text-2xl">${power.icon}</span>
                <span class="text-white font-semibold text-sm">${power.name}</span>
            </div>
            <p class="text-purple-200 text-xs mb-2">${power.description}</p>
            <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs ${isSelected ? 'text-green-300 font-bold' : 'text-gray-400'}">
                    ${isSelected ? '✓ Sélectionné' : 'Cliquer pour sélectionner'}
                </span>
                ${isActive ? '<span class="text-xs text-yellow-300 font-bold">● Actif</span>' : ''}
                ${isStateActive ? '<span class="text-xs text-cyan-300">⚡ Activé</span>' : ''}
            </div>
        `;

        powerCard.className = `power-card p-3 rounded-lg cursor-pointer transition-all border-2 ${borderColor} ${bgColor} ${hoverEffect}`;

        powerCard.addEventListener('click', () => {
            if (isSelected) {
                // Si déjà sélectionné, le désélectionner
                gameState.selectedPowers = gameState.selectedPowers.filter(p => p.id !== power.id);
                if (gameState.activePower === power.id) {
                    gameState.activePower = null;
                }
                gameState.activePowerStates[power.id] = false;
            } else {
                // Sélectionner ce pouvoir (un seul à la fois)
                gameState.selectedPowers = [power];
                gameState.activePower = power.id;
                // Réinitialiser tous les états actifs
                Object.keys(gameState.activePowerStates).forEach(key => {
                    gameState.activePowerStates[key] = false;
                });
                console.log(`Pouvoir sélectionné: ${power.name} (ID: ${power.id})`);
                console.log('Pouvoir actif:', gameState.activePower);
            }
            renderPowers();
            if (gameScene) {
                gameScene.updatePowerEffects();
            }
        });

        powersList.appendChild(powerCard);
    });
}

function spritePathToKey(path) {
    return path.replace(/[^a-zA-Z0-9]/g, '_');
}

function calculateDirection(dx, dy) {
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
        return 'south';
    }
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (absDy > absDx) {
        return dy < 0 ? 'north' : 'south';
    }
    return dx < 0 ? 'west' : 'east';
}

function calculateWalkFrame(startTime, animationSpeed = 100) {
    if (!startTime) return 0;
    const elapsed = Date.now() - startTime;
    return Math.floor(elapsed / animationSpeed) % 9;
}

function resolveCharacterSprites(characterId, customization = {}) {
    const sprites = {
        body: customization.bodySprite || null,
        hair: customization.hairSprite || null,
        clothes: customization.clothesSprite || null,
        bottom: customization.bottomSprite || null
    };

    const config = characterRenderer.getCharacterConfig(characterId);
    if (config?.sprites) {
        sprites.body = sprites.body || config.sprites.body || null;
        sprites.hair = sprites.hair || config.sprites.hair || null;
        sprites.clothes = sprites.clothes || config.sprites.clothes || null;
        sprites.bottom = sprites.bottom || config.sprites.bottom || null;
    }

    return sprites;
}

async function preparePhaserSpriteAssets() {
    const playerSprites = resolveCharacterSprites(
        gameState.selectedCharacterId,
        gameState.customization
    );

    const npcs = characters
        .filter(character => character.id !== gameState.selectedCharacterId)
        .map(character => ({
            id: character.id,
            name: character.name,
            sprites: resolveCharacterSprites(character.id)
        }));

    const uniquePaths = new Set();
    const collectPaths = spriteSet => {
        SPRITE_LAYERS_ORDER.forEach(layer => {
            const path = spriteSet[layer];
            if (path) uniquePaths.add(path);
        });
    };

    collectPaths(playerSprites);
    npcs.forEach(npc => collectPaths(npc.sprites));

    return {
        player: {
            id: gameState.selectedCharacterId,
            name: gameState.selectedCharacter?.name || 'Gardiens',
            sprites: playerSprites
        },
        npcs,
        uniquePaths: Array.from(uniquePaths)
    };
}

async function initializePhaserGame() {
    const container = document.getElementById('phaser-game');
    if (!container) {
        console.error('Container phaser-game non trouvé');
        return;
    }

    if (phaserGame) {
        phaserGame.destroy(true);
        phaserGame = null;
    }

    console.log('Initialisation Phaser...');
    console.log('1. Attente de characterRenderer...');
    await characterRenderer.waitForConfig();
    console.log('2. Préparation des sprites...');
    const spriteAssets = await preparePhaserSpriteAssets();
    console.log('3. Chargement de la carte...');
    const mapData = await loadMapForPhaser();
    console.log('4. Données préparées, création du jeu Phaser');

    phaserBootstrapData = { spriteAssets, mapData };

    const config = {
        type: Phaser.AUTO,
        parent: 'phaser-game',
        width: container.clientWidth,
        height: 500,
        backgroundColor: '#87CEEB',
        pixelArt: true,
        scene: GameScene
    };

    phaserGame = new Phaser.Game(config);
}

async function loadMapForPhaser() {
    console.log('loadMapForPhaser: Début');
    const mapLoader = new TopDownTilemap();
    try {
        console.log('loadMapForPhaser: Chargement de village.tmx...');
        const loaded = await mapLoader.loadFromTMX('village.tmx');
        console.log('loadMapForPhaser: Résultat du chargement:', loaded);

        if (!loaded) {
            console.warn('TMX non chargé, utilisation du fallback');
            return {
                width: 30,
                height: 30,
                tileSize: 32,
                tilemap: null,
                prerenderCanvas: null
            };
        }

        // Pour les tuiles TMX de 32x32, on veut les afficher à leur taille native
        // Le scale doit être 1 car les tuiles TMX sont déjà à la bonne taille
        const tileSize = mapLoader.tmxTileWidth || 32;
        const scale = 1; // Pas besoin de scale car les tuiles TMX sont déjà 32x32

        console.log(`Pré-rendu de la carte TMX: ${mapLoader.width}x${mapLoader.height}, tuiles ${tileSize}x${tileSize}`);
        console.log('tmxSpritesheet:', mapLoader.tmxSpritesheet ? 'présent' : 'absent');
        console.log('tmxLoader.spritesheetImage:', tmxLoader.spritesheetImage ? 'chargé' : 'non chargé');

        // S'assurer que la spritesheet TMX est chargée
        if (!tmxLoader.spritesheetImage) {
            console.warn('Spritesheet TMX non chargée, attente...');
            // Attendre que l'image se charge (max 2 secondes)
            for (let i = 0; i < 20 && !tmxLoader.spritesheetImage; i++) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            if (!tmxLoader.spritesheetImage) {
                console.error('Spritesheet TMX toujours non chargée après attente');
                console.error('Chemin attendu: assets/Serene_Village_32x32.png');
            } else {
                console.log('Spritesheet TMX chargée après attente');
            }
        } else {
            console.log('Spritesheet TMX déjà chargée');
        }

        console.log('Début du pré-rendu...');
        await mapLoader.prerender(scale);
        console.log('Pré-rendu terminé');

        if (!mapLoader.offscreenCanvas) {
            console.error('Canvas pré-rendu non créé');
            return {
                width: mapLoader.width || 30,
                height: mapLoader.height || 30,
                tileSize,
                tilemap: mapLoader,
                prerenderCanvas: null
            };
        }

        console.log(`Canvas pré-rendu créé: ${mapLoader.offscreenCanvas.width}x${mapLoader.offscreenCanvas.height}`);

        return {
            width: mapLoader.width,
            height: mapLoader.height,
            tileSize,
            tilemap: mapLoader,
            prerenderCanvas: mapLoader.offscreenCanvas
        };
    } catch (error) {
        console.error('Erreur lors du chargement de la carte TMX:', error);
        console.error('Stack:', error.stack);
        return {
            width: 30,
            height: 30,
            tileSize: 32,
            tilemap: null,
            prerenderCanvas: null
        };
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        gameScene = this;
        window.gameScene = this; // Exposer globalement pour l'interface de dialogue
        this.bootstrap = phaserBootstrapData || { spriteAssets: { uniquePaths: [] }, mapData: null };
        phaserBootstrapData = null;
        this.spriteAssets = this.bootstrap.spriteAssets || { uniquePaths: [] };
        this.createdAnimations = new Set();
        this.mapData = this.bootstrap.mapData || null;
        this.tilePixelSize = this.mapData?.tileSize || 32;
        this.powerEffects = []; // Liste des effets actifs
        this.powerParticles = []; // Particules des pouvoirs
    }

    // Vérifier si le personnage peut traverser les obstacles (pouvoir Phaseur/Éclipseur)
    canPassThrough() {
        const canPass = gameState.selectedPowers.some(p =>
            (p.id === 'phaseur' || p.id === 'eclipseur') &&
            gameState.activePowerStates[p.id]
        );
        // Log de débogage (à retirer en production si nécessaire)
        if (canPass) {
            const activePower = gameState.selectedPowers.find(p =>
                (p.id === 'phaseur' || p.id === 'eclipseur') &&
                gameState.activePowerStates[p.id]
            );
            // console.log(`Peut traverser - ${activePower?.name} actif`);
        }
        return canPass;
    }

    preload() {
        (this.spriteAssets.uniquePaths || []).forEach(path => {
            const key = spritePathToKey(path);
            if (!this.textures.exists(key)) {
                this.load.spritesheet(key, path, { frameWidth: 64, frameHeight: 64 });
            }
        });
    }

    create() {
        const mapWidth = this.mapData?.width || 30;
        const mapHeight = this.mapData?.height || 30;
        const tileSize = this.mapData?.tileSize || 32;
        this.tilePixelSize = tileSize;

        this.createMapVisualization(mapWidth, mapHeight, tileSize);

        const startX = 15 * tileSize + tileSize / 2;
        const startY = 15 * tileSize + tileSize / 2;
        const playerName = this.spriteAssets?.player?.name || 'Gardiens';
        const playerSprites = this.spriteAssets?.player?.sprites || {};
        this.playerCharacter = this.createCharacterSprite(startX, startY, playerSprites, playerName);
        this.player = this.playerCharacter.container;

        this.playerGridX = 15;
        this.playerGridY = 15;
        this.moveSpeed = 2.0; // Vitesse de déplacement en pixels par frame

        this.cameras.main.setBounds(0, 0, mapWidth * tileSize, mapHeight * tileSize);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);

        // Désactiver complètement le déplacement par la souris
        // (supprimé pour éviter les conflits avec le clavier)

        this.cursors = this.input.keyboard.createCursorKeys();

        // Gestion de la barre d'espace pour activer les pouvoirs
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Gestion de la touche E pour interagir avec les NPCs
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Vérifier que la touche E est bien capturée
        console.log('Touche E initialisée:', this.interactKey ? 'Oui' : 'Non');

        // Alternative : écouter aussi les événements clavier globaux pour la touche E
        this.input.keyboard.on('keydown-E', () => {
            console.log('Touche E détectée via événement Phaser');
        });

        this.initializeNPCs(mapWidth, mapHeight, tileSize);
        this.updateUI();
        this.updatePowerEffects();

        // Initialiser le service de dialogue
        if (window.DialogueService) {
            this.dialogueService = new DialogueService();

            // En production sur Netlify, la clé API est gérée par la fonction proxy
            // En développement local, charger depuis localStorage
            const isNetlify = window.location.hostname.includes('netlify.app') ||
                window.location.hostname.includes('netlify.com');

            if (isNetlify) {
                console.log('✅ Service de dialogue initialisé (mode production Netlify - clé API gérée par proxy)');
            } else {
                // Mode développement local : charger la clé depuis localStorage
                const apiKey = localStorage.getItem('llm_api_key');
                if (apiKey) {
                    this.dialogueService.setApiKey(apiKey);
                    console.log('✅ Service de dialogue initialisé avec OpenAI (gpt-4o-mini) - mode développement');
                } else {
                    console.warn('⚠️ Clé API LLM non définie. Les dialogues ne fonctionneront pas. Configurez votre clé dans config-api.js ou via localStorage.setItem("llm_api_key", "votre_cle")');
                }
            }
        }

        // État du dialogue
        this.isDialogueActive = false;
        this.currentDialogueNPC = null;
        this.conversationHistory = [];
        this.nearestNPCForInteraction = null; // NPC le plus proche pour l'interaction
        this.ttsService = null; // Service de synthèse vocale

        // Fallback : écouter les événements clavier globaux pour la touche E
        // (au cas où Phaser ne capture pas correctement la touche)
        this.eKeyListener = (event) => {
            if (event.key === 'e' || event.key === 'E') {
                if (this.nearestNPCForInteraction && !this.isDialogueActive) {
                    console.log('✅ Touche E détectée (fallback), démarrage du dialogue');
                    event.preventDefault();
                    this.startDialogue(this.nearestNPCForInteraction);
                }
            }
        };
        window.addEventListener('keydown', this.eKeyListener);
    }

    createMapVisualization(mapWidth, mapHeight, tileSize) {
        if (this.mapData?.prerenderCanvas) {
            if (this.textures.exists('mapTexture')) {
                this.textures.remove('mapTexture');
            }
            this.mapTexture = this.textures.addCanvas('mapTexture', this.mapData.prerenderCanvas);
            this.mapImage = this.add.image(0, 0, 'mapTexture').setOrigin(0, 0);
            this.mapImage.setDepth(-1000);
            return;
        }

        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = mapWidth * tileSize;
        mapCanvas.height = mapHeight * tileSize;
        const mapCtx = mapCanvas.getContext('2d');
        mapCtx.fillStyle = '#90EE90';
        mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
        mapCtx.fillStyle = '#8B4513';
        mapCtx.fillRect(7 * tileSize, 7 * tileSize, 6 * tileSize, 6 * tileSize);
        mapCtx.fillStyle = '#654321';
        mapCtx.fillRect(17 * tileSize, 17 * tileSize, 4 * tileSize, 4 * tileSize);

        if (this.textures.exists('mapTexture')) {
            this.textures.remove('mapTexture');
        }
        this.mapTexture = this.textures.addCanvas('mapTexture', mapCanvas);
        this.mapImage = this.add.image(0, 0, 'mapTexture').setOrigin(0, 0);
        this.mapImage.setDepth(-1000);
    }

    createCharacterSprite(x, y, spritePaths, displayName) {
        const container = this.add.container(x, y);
        const layers = [];

        SPRITE_LAYERS_ORDER.forEach(layerName => {
            const path = spritePaths[layerName];
            if (!path) return;
            const key = spritePathToKey(path);
            if (!this.textures.exists(key)) return;
            const sprite = this.add.sprite(0, 0, key);
            sprite.setOrigin(0.5, 0.9);
            container.add(sprite);
            layers.push({ sprite, key });
            this.ensureAnimationsForKey(key);
        });

        let nameText = null;
        if (displayName) {
            nameText = this.add.text(0, -40, displayName, {
                fontSize: '12px',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 4, y: 2 }
            }).setOrigin(0.5, 1);
            container.add(nameText);
        }

        container.setDepth(y);

        return {
            container,
            layers,
            nameText,
            direction: 'south',
            isMoving: false
        };
    }

    ensureAnimationsForKey(key) {
        if (this.createdAnimations.has(key)) return;
        const directionOffsets = { north: 0, west: 1, south: 2, east: 3 };

        Object.entries(directionOffsets).forEach(([direction, offset]) => {
            const idleRow = offset;
            const idleStart = idleRow * LPC_COLUMNS;
            if (!this.anims.exists(`${key}-${direction}-idle`)) {
                this.anims.create({
                    key: `${key}-${direction}-idle`,
                    frames: [{ key, frame: idleStart }],
                    frameRate: 6,
                    repeat: -1
                });
            }
            const walkRow = 8 + offset;
            const walkStart = walkRow * LPC_COLUMNS;
            const walkEnd = walkStart + 8;
            if (!this.anims.exists(`${key}-${direction}-walk`)) {
                this.anims.create({
                    key: `${key}-${direction}-walk`,
                    frames: this.anims.generateFrameNumbers(key, { start: walkStart, end: walkEnd }),
                    frameRate: 10,
                    repeat: -1
                });
            }
        });

        this.createdAnimations.add(key);
    }

    updateCharacterAnimation(characterObj, direction, isMoving) {
        if (!characterObj) return;
        const animSuffix = isMoving ? 'walk' : 'idle';
        characterObj.layers.forEach(layer => {
            const animKey = `${layer.key}-${direction}-${animSuffix}`;
            if (layer.sprite.anims.currentAnim?.key !== animKey) {
                layer.sprite.anims.play(animKey, true);
            }
        });
        characterObj.direction = direction;
        characterObj.isMoving = isMoving;
        characterObj.container.setDepth(characterObj.container.y);
    }

    update() {
        const tileSize = this.tilePixelSize;
        const mapWidth = this.mapData?.width || 30;
        const mapHeight = this.mapData?.height || 30;

        // Calculer la direction du mouvement basée sur les touches pressées
        let moveX = 0;
        let moveY = 0;

        if (this.cursors.left.isDown) {
            moveX = -1;
        } else if (this.cursors.right.isDown) {
            moveX = 1;
        }

        if (this.cursors.up.isDown) {
            moveY = -1;
        } else if (this.cursors.down.isDown) {
            moveY = 1;
        }

        // Normaliser la diagonale pour une vitesse constante
        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707; // 1/√2 pour normaliser la diagonale
            moveY *= 0.707;
        }

        // Calculer la nouvelle position en pixels
        const newPixelX = this.player.x + moveX * this.moveSpeed;
        const newPixelY = this.player.y + moveY * this.moveSpeed;

        // Vérifier si on peut passer à travers les obstacles (Phaseur/Éclipseur actif)
        const canPass = this.canPassThrough();

        // Si le phaseur/éclipseur est actif, ignorer complètement les collisions
        if (canPass) {
            // Appliquer le mouvement sans vérification de collision
            this.player.x = Phaser.Math.Clamp(newPixelX, tileSize / 2, mapWidth * tileSize - tileSize / 2);
            this.player.y = Phaser.Math.Clamp(newPixelY, tileSize / 2, mapHeight * tileSize - tileSize / 2);
        } else {
            // Vérifier les collisions normalement
            const newGridX = Math.floor(newPixelX / tileSize);
            const newGridY = Math.floor(newPixelY / tileSize);

            // Vérifier les limites de la carte
            const clampedGridX = Phaser.Math.Clamp(newGridX, 0, mapWidth - 1);
            const clampedGridY = Phaser.Math.Clamp(newGridY, 0, mapHeight - 1);

            // Obtenir la case actuelle
            const currentGridX = Math.floor(this.player.x / tileSize);
            const currentGridY = Math.floor(this.player.y / tileSize);

            // Vérifier les collisions seulement si on change de case
            let canMoveX = true;
            let canMoveY = true;

            if (this.mapData?.tilemap) {
                // Vérifier collision X
                if (clampedGridX !== currentGridX) {
                    canMoveX = this.mapData.tilemap.isWalkable(clampedGridX, currentGridY);
                }

                // Vérifier collision Y
                if (clampedGridY !== currentGridY) {
                    canMoveY = this.mapData.tilemap.isWalkable(currentGridX, clampedGridY);
                }
            }

            // Appliquer le mouvement selon les collisions
            if (canMoveX) {
                this.player.x = Phaser.Math.Clamp(newPixelX, tileSize / 2, mapWidth * tileSize - tileSize / 2);
            }
            if (canMoveY) {
                this.player.y = Phaser.Math.Clamp(newPixelY, tileSize / 2, mapHeight * tileSize - tileSize / 2);
            }
        }

        // Mettre à jour la position du personnage
        this.playerCharacter.container.x = this.player.x;
        this.playerCharacter.container.y = this.player.y;

        // Mettre à jour les coordonnées de grille pour l'animation
        this.playerGridX = this.player.x / tileSize;
        this.playerGridY = this.player.y / tileSize;

        // Mettre à jour la position du personnage
        this.playerCharacter.container.x = this.player.x;
        this.playerCharacter.container.y = this.player.y;

        // Mettre à jour les coordonnées de grille pour l'animation
        this.playerGridX = this.player.x / tileSize;
        this.playerGridY = this.player.y / tileSize;

        // Déterminer la direction pour l'animation
        const isMoving = moveX !== 0 || moveY !== 0;
        let direction = this.playerCharacter.direction || 'south';

        if (isMoving) {
            if (Math.abs(moveY) > Math.abs(moveX)) {
                direction = moveY < 0 ? 'north' : 'south';
            } else {
                direction = moveX < 0 ? 'west' : 'east';
            }
        }

        this.updateCharacterAnimation(this.playerCharacter, direction, isMoving);

        this.updateNPCs();

        // Détection de proximité pour les dialogues (doit être après updateNPCs)
        this.checkNPCProximity();

        // Gestion de la barre d'espace pour activer les pouvoirs
        if (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.activateActivePower();
        }
    }

    activateActivePower() {
        if (!gameState.activePower) {
            console.log('Aucun pouvoir actif');
            return;
        }

        const power = gameState.selectedPowers.find(p => p.id === gameState.activePower);
        if (!power) return;

        // Pouvoirs avec toggle (Éclipseur, Flasheur, Phaseur)
        const togglePowers = ['eclipseur', 'flasheur', 'phaseur'];
        if (togglePowers.includes(power.id)) {
            const isActive = gameState.activePowerStates[power.id] || false;
            gameState.activePowerStates[power.id] = !isActive;
            const newState = !isActive ? 'activé' : 'désactivé';
            console.log(`=== ${power.name} ${newState} ===`);
            this.updatePowerEffects();
            this.createPowerActivationEffect(power, !isActive);
            renderPowers();
            return;
        }

        // Tous les autres pouvoirs avec leurs effets spécifiques
        this.activatePowerEffect(power);
    }

    // Activer l'effet d'un pouvoir spécifique
    activatePowerEffect(power) {
        const now = Date.now();
        const lastUsed = gameState.powerCooldowns[power.id] || 0;
        const cooldown = this.getPowerCooldown(power.id);

        if (now - lastUsed < cooldown) {
            const remaining = ((cooldown - (now - lastUsed)) / 1000).toFixed(1);
            console.log(`Rechargement: ${remaining}s`);
            return;
        }

        gameState.powerCooldowns[power.id] = now;

        switch (power.id) {
            case 'tenebreux':
                this.createShadowAtPlayer();
                break;
            case 'teleporteur':
                this.teleportPlayer();
                break;
            case 'hypnotiseur':
                this.hypnotizeNearbyNPCs();
                break;
            case 'instillateur':
                this.instillEmotionInNPCs();
                break;
            case 'invocateur':
                this.summonObject();
                break;
            case 'chargeur':
                this.createElectricityEffect();
                break;
            case 'hydrokinesiste':
                this.createWaterEffect();
                break;
            case 'pyrokinesiste':
                this.createFireEffect();
                break;
            case 'givreur':
                this.createIceEffect();
                break;
            case 'rafaleur':
                this.createWindEffect();
                break;
            case 'telepathe':
                this.telepathicScan();
                break;
            case 'empathe':
                this.empathicSense();
                break;
            case 'technopathe':
                this.technopathActivate();
                break;
            case 'polyglotte':
                this.polyglotSpeak();
                break;
            case 'discerneur':
                this.discernPotential();
                break;
            case 'enjoleur':
                this.enchantNPCs();
                break;
            case 'fluctuateur':
                this.fluctuateMatter();
                break;
            case 'optimisateur':
                this.optimizeOtherPowers();
                break;
            case 'psionipathe':
                this.createForceField();
                break;
            case 'vociferateur':
                this.vociferate();
                break;
            default:
                console.log(`Pouvoir ${power.name} activé`);
        }

        this.createPowerActivationEffect(power, true);
    }

    // Obtenir le cooldown d'un pouvoir
    getPowerCooldown(powerId) {
        const cooldowns = {
            'tenebreux': 1000,
            'teleporteur': 3000,
            'hypnotiseur': 5000,
            'instillateur': 4000,
            'invocateur': 2000,
            'chargeur': 2000,
            'hydrokinesiste': 2000,
            'pyrokinesiste': 2000,
            'givreur': 2000,
            'rafaleur': 2000,
            'telepathe': 3000,
            'empathe': 3000,
            'technopathe': 2000,
            'polyglotte': 1000,
            'discerneur': 2000,
            'enjoleur': 4000,
            'fluctuateur': 3000,
            'optimisateur': 5000,
            'psionipathe': 4000,
            'vociferateur': 2000
        };
        return cooldowns[powerId] || 2000;
    }

    createShadowAtPlayer() {
        if (!this.playerCharacter) return;

        const shadow = this.add.circle(
            this.player.x,
            this.player.y,
            20,
            0x000000,
            0.5
        );
        shadow.setDepth(this.player.y - 1);

        // Faire disparaître l'ombre après 5 secondes
        this.time.delayedCall(5000, () => {
            this.tweens.add({
                targets: shadow,
                alpha: 0,
                duration: 1000,
                onComplete: () => shadow.destroy()
            });
        });
    }

    updatePowerEffects() {
        if (!this.playerCharacter) return;

        // Vérifier l'invisibilité (Éclipseur/Flasheur)
        const isInvisible = gameState.selectedPowers.some(p =>
            (p.id === 'eclipseur' || p.id === 'flasheur') &&
            gameState.activePowerStates[p.id]
        );

        // Vérifier le phaseur (effet de particules)
        const isPhasing = gameState.selectedPowers.some(p =>
            p.id === 'phaseur' &&
            gameState.activePowerStates[p.id]
        );

        // Appliquer l'effet d'invisibilité
        this.playerCharacter.layers.forEach(layer => {
            layer.sprite.setAlpha(isInvisible ? 0.3 : 1);
            // Effet de phaseur : scintillement
            if (isPhasing) {
                layer.sprite.setTint(0x88ccff);
                this.createPhasingParticles();
            } else {
                layer.sprite.clearTint();
            }
        });
        if (this.playerCharacter.nameText) {
            this.playerCharacter.nameText.setAlpha(isInvisible ? 0.3 : 1);
        }

        // Nettoyer les effets expirés
        this.cleanupExpiredEffects();
    }

    // Créer un effet visuel lors de l'activation d'un pouvoir
    createPowerActivationEffect(power, isActivating) {
        if (!this.playerCharacter) return;

        const colors = {
            'purple': 0x9370db,
            'green': 0x50c878,
            'indigo': 0x4b0082,
            'pink': 0xff69b4,
            'gray': 0x708090,
            'cyan': 0x00ffff,
            'blue': 0x4169e1,
            'red': 0xff4500,
            'orange': 0xff8c00,
            'yellow': 0xffd700
        };

        const color = colors[power.color] || 0xffffff;

        // Cercle d'activation
        const circle = this.add.circle(this.player.x, this.player.y, 0, color, 0.6);
        circle.setDepth(this.player.y + 1000);

        this.tweens.add({
            targets: circle,
            radius: { from: 0, to: 60 },
            alpha: { from: 0.6, to: 0 },
            duration: 500,
            onComplete: () => circle.destroy()
        });

        // Particules
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const particle = this.add.circle(this.player.x, this.player.y, 3, color, 1);
            particle.setDepth(this.player.y + 1000);

            this.tweens.add({
                targets: particle,
                x: this.player.x + Math.cos(angle) * 40,
                y: this.player.y + Math.sin(angle) * 40,
                alpha: { from: 1, to: 0 },
                duration: 400,
                onComplete: () => particle.destroy()
            });
        }
    }

    // Effet de particules pour le phaseur
    createPhasingParticles() {
        if (!this.playerCharacter || Math.random() > 0.3) return; // Limiter la fréquence

        const particle = this.add.circle(
            this.player.x + Phaser.Math.Between(-20, 20),
            this.player.y + Phaser.Math.Between(-20, 20),
            2,
            0x88ccff,
            0.8
        );
        particle.setDepth(this.player.y + 1000);

        this.tweens.add({
            targets: particle,
            alpha: { from: 0.8, to: 0 },
            scale: { from: 1, to: 0 },
            duration: 300,
            onComplete: () => particle.destroy()
        });
    }

    // Nettoyer les effets expirés
    cleanupExpiredEffects() {
        this.powerEffects = this.powerEffects.filter(effect => {
            if (effect.expiresAt && Date.now() > effect.expiresAt) {
                if (effect.object) effect.object.destroy();
                return false;
            }
            return true;
        });
    }

    // ========== EFFETS DES POUVOIRS ==========

    // Téléporteur : téléporter le joueur à un endroit aléatoire
    teleportPlayer() {
        if (!this.playerCharacter) return;

        const mapWidth = this.mapData?.width || 30;
        const mapHeight = this.mapData?.height || 30;
        const tileSize = this.tilePixelSize;

        // Effet de départ
        this.createTeleportEffect(this.player.x, this.player.y, false);

        // Trouver une position valide
        let attempts = 0;
        let newX, newY;
        do {
            newX = Phaser.Math.Between(2, mapWidth - 3) * tileSize + tileSize / 2;
            newY = Phaser.Math.Between(2, mapHeight - 3) * tileSize + tileSize / 2;
            attempts++;
        } while (attempts < 20 && this.mapData?.tilemap &&
            !this.mapData.tilemap.isWalkable(Math.floor(newX / tileSize), Math.floor(newY / tileSize)));

        // Téléporter après un court délai
        this.time.delayedCall(200, () => {
            this.player.x = newX;
            this.player.y = newY;
            this.playerCharacter.container.x = newX;
            this.playerCharacter.container.y = newY;
            this.playerGridX = newX / tileSize;
            this.playerGridY = newY / tileSize;

            // Effet d'arrivée
            this.createTeleportEffect(newX, newY, true);
        });

        console.log('Téléportation !');
    }

    createTeleportEffect(x, y, isArrival) {
        const color = isArrival ? 0x00ffff : 0xff00ff;

        // Cercle de téléportation
        const circle = this.add.circle(x, y, 0, color, 0.8);
        circle.setDepth(y + 1000);

        this.tweens.add({
            targets: circle,
            radius: { from: 0, to: 50 },
            alpha: { from: 0.8, to: 0 },
            duration: 400,
            onComplete: () => circle.destroy()
        });

        // Particules en spirale
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI * 2 * i) / 16;
            const particle = this.add.circle(x, y, 2, color, 1);
            particle.setDepth(y + 1000);

            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * 60,
                y: y + Math.sin(angle) * 60,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0 },
                duration: 500,
                onComplete: () => particle.destroy()
            });
        }
    }

    // Hypnotiseur : hypnotiser les NPCs proches
    hypnotizeNearbyNPCs() {
        if (!this.playerCharacter) return;

        const range = 150;
        const hypnotized = [];

        this.npcs.forEach(npc => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                npc.container.x, npc.container.y
            );

            if (distance <= range) {
                hypnotized.push(npc);
                this.hypnotizeNPC(npc);
            }
        });

        // Effet visuel de spirale hypnotique
        this.createHypnoticSpiral();

        console.log(`${hypnotized.length} NPC(s) hypnotisé(s)`);
    }

    hypnotizeNPC(npc) {
        // Ralentir le NPC
        if (npc.moveInterval) {
            npc.moveInterval *= 2;
        }

        // Effet visuel : spirale au-dessus du NPC
        const spiral = this.add.circle(npc.container.x, npc.container.y - 30, 0, 0xff0000, 0.6);
        spiral.setDepth(npc.container.y + 1000);

        this.tweens.add({
            targets: spiral,
            radius: { from: 0, to: 20 },
            alpha: { from: 0.6, to: 0 },
            duration: 2000,
            onComplete: () => spiral.destroy()
        });

        // Timer pour libérer l'hypnose
        this.time.delayedCall(5000, () => {
            if (npc.moveInterval) {
                npc.moveInterval /= 2;
            }
        });
    }

    createHypnoticSpiral() {
        if (!this.playerCharacter) return;

        for (let i = 0; i < 3; i++) {
            const spiral = this.add.circle(this.player.x, this.player.y, 0, 0xff0000, 0.7);
            spiral.setDepth(this.player.y + 1000);

            this.tweens.add({
                targets: spiral,
                radius: { from: 0, to: 80 },
                alpha: { from: 0.7, to: 0 },
                duration: 1000 + i * 200,
                delay: i * 100,
                onComplete: () => spiral.destroy()
            });
        }
    }

    // Instillateur : instiller des émotions dans les NPCs
    instillEmotionInNPCs() {
        if (!this.playerCharacter) return;

        const range = 120;
        const colors = [0xff69b4, 0xffff00, 0xff4500, 0x00ff00]; // Rose, Jaune, Orange, Vert

        this.npcs.forEach(npc => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                npc.container.x, npc.container.y
            );

            if (distance <= range) {
                const emotion = colors[Phaser.Math.Between(0, colors.length - 1)];
                this.instillEmotion(npc, emotion);
            }
        });

        // Effet visuel d'aura émotionnelle
        this.createEmotionAura();
    }

    instillEmotion(npc, color) {
        // Particules d'émotion
        for (let i = 0; i < 5; i++) {
            const particle = this.add.circle(
                npc.container.x + Phaser.Math.Between(-10, 10),
                npc.container.y + Phaser.Math.Between(-10, 10),
                3,
                color,
                0.8
            );
            particle.setDepth(npc.container.y + 1000);

            this.tweens.add({
                targets: particle,
                y: npc.container.y - 30,
                alpha: { from: 0.8, to: 0 },
                duration: 1000,
                onComplete: () => particle.destroy()
            });
        }
    }

    createEmotionAura() {
        if (!this.playerCharacter) return;

        const aura = this.add.circle(this.player.x, this.player.y, 0, 0xff69b4, 0.4);
        aura.setDepth(this.player.y + 1000);

        this.tweens.add({
            targets: aura,
            radius: { from: 0, to: 100 },
            alpha: { from: 0.4, to: 0 },
            duration: 800,
            onComplete: () => aura.destroy()
        });
    }

    // Invocateur : appeler un objet
    summonObject() {
        if (!this.playerCharacter) return;

        // Créer un objet temporaire qui apparaît
        const object = this.add.circle(
            this.player.x + Phaser.Math.Between(-30, 30),
            this.player.y + Phaser.Math.Between(-30, 30),
            0,
            0xff8c00,
            0.9
        );
        object.setDepth(this.player.y + 1000);

        // Animation d'apparition
        this.tweens.add({
            targets: object,
            radius: { from: 0, to: 15 },
            scaleY: { from: 0, to: 1 },
            duration: 300,
            ease: 'Back.easeOut'
        });

        // Étincelles
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const spark = this.add.circle(object.x, object.y, 2, 0xffd700, 1);
            spark.setDepth(this.player.y + 1000);

            this.tweens.add({
                targets: spark,
                x: object.x + Math.cos(angle) * 25,
                y: object.y + Math.sin(angle) * 25,
                alpha: { from: 1, to: 0 },
                duration: 400,
                onComplete: () => spark.destroy()
            });
        }

        // Faire disparaître l'objet après 3 secondes
        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: object,
                alpha: { from: 0.9, to: 0 },
                scale: { from: 1, to: 0 },
                duration: 300,
                onComplete: () => object.destroy()
            });
        });

        console.log('Objet invoqué !');
    }

    // Chargeur : créer un effet d'électricité
    createElectricityEffect() {
        if (!this.playerCharacter) return;

        // Éclairs depuis le joueur
        for (let i = 0; i < 5; i++) {
            const angle = Phaser.Math.Between(0, 360) * Math.PI / 180;
            const distance = Phaser.Math.Between(30, 80);
            const endX = this.player.x + Math.cos(angle) * distance;
            const endY = this.player.y + Math.sin(angle) * distance;

            this.createLightning(this.player.x, this.player.y, endX, endY);
        }

        // Effet sur les NPCs proches
        this.npcs.forEach(npc => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                npc.container.x, npc.container.y
            );

            if (distance <= 100) {
                this.createLightning(this.player.x, this.player.y, npc.container.x, npc.container.y);
                // Ralentir temporairement le NPC
                if (npc.moveInterval) {
                    npc.moveInterval *= 1.5;
                    this.time.delayedCall(2000, () => {
                        if (npc.moveInterval) npc.moveInterval /= 1.5;
                    });
                }
            }
        });

        console.log('Électricité contrôlée !');
    }

    createLightning(x1, y1, x2, y2) {
        // Créer plusieurs segments pour simuler un éclair
        const segments = 5;
        const points = [];

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = x1 + (x2 - x1) * t + Phaser.Math.Between(-5, 5);
            const y = y1 + (y2 - y1) * t + Phaser.Math.Between(-5, 5);
            points.push({ x, y });
        }

        // Dessiner l'éclair avec des cercles
        points.forEach((point, i) => {
            if (i < points.length - 1) {
                const nextPoint = points[i + 1];
                const midX = (point.x + nextPoint.x) / 2;
                const midY = (point.y + nextPoint.y) / 2;

                const bolt = this.add.circle(midX, midY, 3, 0xffff00, 1);
                bolt.setDepth(y1 + 1000);

                this.tweens.add({
                    targets: bolt,
                    alpha: { from: 1, to: 0 },
                    duration: 100,
                    delay: i * 20,
                    onComplete: () => bolt.destroy()
                });
            }
        });
    }

    // Hydrokinésiste : créer un effet d'eau
    createWaterEffect() {
        if (!this.playerCharacter) return;

        // Vagues d'eau
        for (let i = 0; i < 3; i++) {
            const wave = this.add.circle(this.player.x, this.player.y, 0, 0x4169e1, 0.5);
            wave.setDepth(this.player.y + 1000);

            this.tweens.add({
                targets: wave,
                radius: { from: 0, to: 100 },
                alpha: { from: 0.5, to: 0 },
                duration: 1000,
                delay: i * 200,
                onComplete: () => wave.destroy()
            });
        }

        // Particules d'eau
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const particle = this.add.circle(
                this.player.x,
                this.player.y,
                2,
                0x4169e1,
                0.8
            );
            particle.setDepth(this.player.y + 1000);

            this.tweens.add({
                targets: particle,
                x: this.player.x + Math.cos(angle) * 80,
                y: this.player.y + Math.sin(angle) * 80,
                alpha: { from: 0.8, to: 0 },
                duration: 800,
                onComplete: () => particle.destroy()
            });
        }

        console.log('Eau contrôlée !');
    }

    // Pyrokinésiste : créer un effet de feu
    createFireEffect() {
        if (!this.playerCharacter) return;

        // Flammes
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const flame = this.add.circle(
                this.player.x,
                this.player.y,
                5,
                0xff4500,
                0.9
            );
            flame.setDepth(this.player.y + 1000);

            const distance = Phaser.Math.Between(30, 60);
            this.tweens.add({
                targets: flame,
                x: this.player.x + Math.cos(angle) * distance,
                y: this.player.y + Math.sin(angle) * distance,
                radius: { from: 5, to: 0 },
                alpha: { from: 0.9, to: 0 },
                duration: 600,
                onComplete: () => flame.destroy()
            });
        }

        // Effet persistant de feu autour du joueur
        const fireAura = this.add.circle(this.player.x, this.player.y, 40, 0xff4500, 0.3);
        fireAura.setDepth(this.player.y + 1000);

        this.tweens.add({
            targets: fireAura,
            alpha: { from: 0.3, to: 0 },
            duration: 2000,
            onComplete: () => fireAura.destroy()
        });

        console.log('Feu contrôlé !');
    }

    // Givreur : créer un effet de glace
    createIceEffect() {
        if (!this.playerCharacter) return;

        // Flocons de neige
        for (let i = 0; i < 15; i++) {
            const flake = this.add.circle(
                this.player.x + Phaser.Math.Between(-50, 50),
                this.player.y + Phaser.Math.Between(-50, 50),
                3,
                0x87ceeb,
                0.9
            );
            flake.setDepth(this.player.y + 1000);

            this.tweens.add({
                targets: flake,
                y: flake.y + Phaser.Math.Between(30, 60),
                x: flake.x + Phaser.Math.Between(-10, 10),
                alpha: { from: 0.9, to: 0 },
                duration: 1000,
                delay: i * 50,
                onComplete: () => flake.destroy()
            });
        }

        // Cercle de glace
        const iceCircle = this.add.circle(this.player.x, this.player.y, 0, 0x87ceeb, 0.6);
        iceCircle.setDepth(this.player.y + 1000);

        this.tweens.add({
            targets: iceCircle,
            radius: { from: 0, to: 80 },
            alpha: { from: 0.6, to: 0 },
            duration: 1000,
            onComplete: () => iceCircle.destroy()
        });

        // Ralentir les NPCs proches
        this.npcs.forEach(npc => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                npc.container.x, npc.container.y
            );

            if (distance <= 100) {
                if (npc.moveInterval) {
                    npc.moveInterval *= 2;
                    this.time.delayedCall(3000, () => {
                        if (npc.moveInterval) npc.moveInterval /= 2;
                    });
                }
            }
        });

        console.log('Glace contrôlée !');
    }

    // Rafaleur : créer un effet de vent
    createWindEffect() {
        if (!this.playerCharacter) return;

        // Particules de vent
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            const particle = this.add.circle(
                this.player.x,
                this.player.y,
                2,
                0xe0e0e0,
                0.7
            );
            particle.setDepth(this.player.y + 1000);

            this.tweens.add({
                targets: particle,
                x: this.player.x + Math.cos(angle) * 120,
                y: this.player.y + Math.sin(angle) * 120,
                alpha: { from: 0.7, to: 0 },
                duration: 1000,
                delay: i * 30,
                onComplete: () => particle.destroy()
            });
        }

        // Pousser les NPCs
        this.npcs.forEach(npc => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                npc.container.x, npc.container.y
            );

            if (distance <= 120) {
                const angle = Math.atan2(
                    npc.container.y - this.player.y,
                    npc.container.x - this.player.x
                );
                const pushDistance = 20;

                npc.targetGridX += Math.cos(angle) * pushDistance / this.tilePixelSize;
                npc.targetGridY += Math.sin(angle) * pushDistance / this.tilePixelSize;
            }
        });

        console.log('Vent contrôlé !');
    }

    // Télépathe : scanner les pensées
    telepathicScan() {
        if (!this.playerCharacter) return;

        // Ondes cérébrales
        for (let i = 0; i < 5; i++) {
            const wave = this.add.circle(this.player.x, this.player.y, 0, 0x9370db, 0.4);
            wave.setDepth(this.player.y + 1000);

            this.tweens.add({
                targets: wave,
                radius: { from: 0, to: 150 },
                alpha: { from: 0.4, to: 0 },
                duration: 1500,
                delay: i * 200,
                onComplete: () => wave.destroy()
            });
        }

        // Révéler les NPCs proches
        this.npcs.forEach(npc => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                npc.container.x, npc.container.y
            );

            if (distance <= 150) {
                // Effet visuel sur le NPC
                const thought = this.add.circle(npc.container.x, npc.container.y - 20, 5, 0x9370db, 0.8);
                thought.setDepth(npc.container.y + 1000);

                this.tweens.add({
                    targets: thought,
                    y: npc.container.y - 40,
                    alpha: { from: 0.8, to: 0 },
                    duration: 1000,
                    onComplete: () => thought.destroy()
                });
            }
        });

        console.log('Pensées perçues...');
    }

    // Empathe : ressentir les émotions
    empathicSense() {
        if (!this.playerCharacter) return;

        // Aura émotionnelle
        const aura = this.add.circle(this.player.x, this.player.y, 0, 0x50c878, 0.5);
        aura.setDepth(this.player.y + 1000);

        this.tweens.add({
            targets: aura,
            radius: { from: 0, to: 120 },
            alpha: { from: 0.5, to: 0 },
            duration: 1200,
            onComplete: () => aura.destroy()
        });

        // Afficher les émotions des NPCs
        this.npcs.forEach(npc => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                npc.container.x, npc.container.y
            );

            if (distance <= 120) {
                const emotions = [0xff69b4, 0xffff00, 0xff4500, 0x50c878];
                const emotion = emotions[Phaser.Math.Between(0, emotions.length - 1)];

                const emotionBubble = this.add.circle(npc.container.x, npc.container.y - 15, 8, emotion, 0.7);
                emotionBubble.setDepth(npc.container.y + 1000);

                this.tweens.add({
                    targets: emotionBubble,
                    scale: { from: 0, to: 1 },
                    alpha: { from: 0.7, to: 0 },
                    duration: 1500,
                    onComplete: () => emotionBubble.destroy()
                });
            }
        });

        console.log('Émotions perçues...');
    }

    // Technopathe : activer la technologie
    technopathActivate() {
        if (!this.playerCharacter) return;

        // Effet de circuits électriques
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            const circuit = this.add.circle(
                this.player.x,
                this.player.y,
                3,
                0x4b0082,
                0.9
            );
            circuit.setDepth(this.player.y + 1000);

            const distance = Phaser.Math.Between(40, 70);
            this.tweens.add({
                targets: circuit,
                x: this.player.x + Math.cos(angle) * distance,
                y: this.player.y + Math.sin(angle) * distance,
                alpha: { from: 0.9, to: 0 },
                duration: 800,
                onComplete: () => circuit.destroy()
            });
        }

        console.log('Technologie détectée');
    }

    // Polyglotte : parler toutes les langues
    polyglotSpeak() {
        if (!this.playerCharacter) return;

        // Ondes sonores
        for (let i = 0; i < 4; i++) {
            const wave = this.add.circle(this.player.x, this.player.y, 0, 0xffd700, 0.5);
            wave.setDepth(this.player.y + 1000);

            this.tweens.add({
                targets: wave,
                radius: { from: 0, to: 100 },
                alpha: { from: 0.5, to: 0 },
                duration: 800,
                delay: i * 150,
                onComplete: () => wave.destroy()
            });
        }

        console.log('Parole multilingue !');
    }

    // Discerneur : mesurer le potentiel
    discernPotential() {
        if (!this.playerCharacter) return;

        // Rayon de détection
        const scan = this.add.circle(this.player.x, this.player.y, 0, 0x4b0082, 0.6);
        scan.setDepth(this.player.y + 1000);

        this.tweens.add({
            targets: scan,
            radius: { from: 0, to: 200 },
            alpha: { from: 0.6, to: 0 },
            duration: 1500,
            onComplete: () => scan.destroy()
        });

        // Marquer les NPCs avec leur potentiel
        this.npcs.forEach(npc => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                npc.container.x, npc.container.y
            );

            if (distance <= 200) {
                const potential = Phaser.Math.Between(1, 5);
                const color = potential >= 4 ? 0xffd700 : potential >= 3 ? 0xff8c00 : 0x808080;

                const marker = this.add.circle(npc.container.x, npc.container.y - 25, 6, color, 0.9);
                marker.setDepth(npc.container.y + 1000);

                this.tweens.add({
                    targets: marker,
                    alpha: { from: 0.9, to: 0 },
                    duration: 2000,
                    onComplete: () => marker.destroy()
                });
            }
        });

        console.log('Potentiel mesuré');
    }

    // Enjôleur : enchanter les NPCs
    enchantNPCs() {
        if (!this.playerCharacter) return;

        // Spirales hypnotiques
        for (let i = 0; i < 3; i++) {
            const spiral = this.add.circle(this.player.x, this.player.y, 0, 0xff69b4, 0.7);
            spiral.setDepth(this.player.y + 1000);

            this.tweens.add({
                targets: spiral,
                radius: { from: 0, to: 120 },
                alpha: { from: 0.7, to: 0 },
                duration: 1200,
                delay: i * 200,
                onComplete: () => spiral.destroy()
            });
        }

        // Enchanter les NPCs proches
        this.npcs.forEach(npc => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                npc.container.x, npc.container.y
            );

            if (distance <= 120) {
                // Attirer le NPC vers le joueur
                const angle = Math.atan2(
                    this.player.y - npc.container.y,
                    this.player.x - npc.container.x
                );
                npc.targetGridX += Math.cos(angle) * 10 / this.tilePixelSize;
                npc.targetGridY += Math.sin(angle) * 10 / this.tilePixelSize;
            }
        });

        console.log('NPCs enchantés !');
    }

    // Fluctuateur : modifier la densité de la matière
    fluctuateMatter() {
        if (!this.playerCharacter) return;

        // Effet d'onde de matière
        for (let i = 0; i < 4; i++) {
            const wave = this.add.circle(this.player.x, this.player.y, 0, 0x4169e1, 0.5);
            wave.setDepth(this.player.y + 1000);

            this.tweens.add({
                targets: wave,
                radius: { from: 0, to: 100 },
                alpha: { from: 0.5, to: 0 },
                duration: 1000,
                delay: i * 200,
                onComplete: () => wave.destroy()
            });
        }

        // Ralentir temporairement les NPCs (densité modifiée)
        this.npcs.forEach(npc => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                npc.container.x, npc.container.y
            );

            if (distance <= 100) {
                if (npc.moveInterval) {
                    npc.moveInterval *= 1.5;
                    this.time.delayedCall(3000, () => {
                        if (npc.moveInterval) npc.moveInterval /= 1.5;
                    });
                }
            }
        });

        console.log('Densité modifiée !');
    }

    // Optimisateur : amplifier les autres pouvoirs
    optimizeOtherPowers() {
        if (!this.playerCharacter) return;

        // Étincelles d'amplification
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const spark = this.add.circle(
                this.player.x,
                this.player.y,
                3,
                0xffd700,
                1
            );
            spark.setDepth(this.player.y + 1000);

            this.tweens.add({
                targets: spark,
                x: this.player.x + Math.cos(angle) * 50,
                y: this.player.y + Math.sin(angle) * 50,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0 },
                duration: 600,
                onComplete: () => spark.destroy()
            });
        }

        // Réduire les cooldowns des autres pouvoirs
        Object.keys(gameState.powerCooldowns).forEach(powerId => {
            gameState.powerCooldowns[powerId] = Math.max(0, gameState.powerCooldowns[powerId] - 1000);
        });

        console.log('Pouvoirs optimisés !');
    }

    // Psionipathe : créer un champ de force
    createForceField() {
        if (!this.playerCharacter) return;

        // Champ de force autour du joueur
        const field = this.add.circle(this.player.x, this.player.y, 0, 0x4b0082, 0.4);
        field.setDepth(this.player.y + 1000);

        this.tweens.add({
            targets: field,
            radius: { from: 0, to: 80 },
            alpha: { from: 0.4, to: 0.2 },
            duration: 500
        });

        // Faire disparaître après 5 secondes
        this.time.delayedCall(5000, () => {
            this.tweens.add({
                targets: field,
                alpha: { from: 0.2, to: 0 },
                duration: 500,
                onComplete: () => field.destroy()
            });
        });

        // Repousser les NPCs
        this.npcs.forEach(npc => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                npc.container.x, npc.container.y
            );

            if (distance <= 80) {
                const angle = Math.atan2(
                    npc.container.y - this.player.y,
                    npc.container.x - this.player.x
                );
                npc.targetGridX -= Math.cos(angle) * 15 / this.tilePixelSize;
                npc.targetGridY -= Math.sin(angle) * 15 / this.tilePixelSize;
            }
        });

        console.log('Champ de force créé !');
    }

    // Vociférateur : crier très fort
    vociferate() {
        if (!this.playerCharacter) return;

        // Ondes sonores puissantes
        for (let i = 0; i < 6; i++) {
            const wave = this.add.circle(this.player.x, this.player.y, 0, 0xff8c00, 0.6);
            wave.setDepth(this.player.y + 1000);

            this.tweens.add({
                targets: wave,
                radius: { from: 0, to: 150 },
                alpha: { from: 0.6, to: 0 },
                duration: 1000,
                delay: i * 100,
                onComplete: () => wave.destroy()
            });
        }

        // Étourdir les NPCs proches
        this.npcs.forEach(npc => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                npc.container.x, npc.container.y
            );

            if (distance <= 150) {
                // Ralentir temporairement
                if (npc.moveInterval) {
                    npc.moveInterval *= 3;
                    this.time.delayedCall(2000, () => {
                        if (npc.moveInterval) npc.moveInterval /= 3;
                    });
                }
            }
        });

        console.log('VOCIFÉRATION !');
    }

    findValidSpawnPosition(mapWidth, mapHeight, tilemap) {
        for (let attempt = 0; attempt < 50; attempt++) {
            const x = Phaser.Math.Between(0, mapWidth - 1);
            const y = Phaser.Math.Between(0, mapHeight - 1);
            if (!tilemap || tilemap.isWalkable(x, y)) {
                const distance = Math.hypot(x - this.playerGridX, y - this.playerGridY);
                if (distance > 3) {
                    return { x, y };
                }
            }
        }
        return {
            x: Phaser.Math.Clamp(Math.floor(mapWidth / 2), 0, mapWidth - 1),
            y: Phaser.Math.Clamp(Math.floor(mapHeight / 2), 0, mapHeight - 1)
        };
    }

    initializeNPCs(mapWidth, mapHeight, tileSize) {
        const tilemap = this.mapData?.tilemap;
        this.npcs = (this.spriteAssets?.npcs || []).map(npcData => {
            const spawn = this.findValidSpawnPosition(mapWidth, mapHeight, tilemap);
            const spriteInfo = npcData.sprites || {};
            const characterSprite = this.createCharacterSprite(
                spawn.x * tileSize + tileSize / 2,
                spawn.y * tileSize + tileSize / 2,
                spriteInfo,
                npcData.name
            );
            return {
                ...characterSprite,
                character: npcData,
                gridX: spawn.x,
                gridY: spawn.y,
                targetGridX: spawn.x,
                targetGridY: spawn.y,
                lastMoveTime: Date.now(),
                moveInterval: 2000 + Math.random() * 3000
            };
        });
    }

    updateNPCs() {
        const tileSize = this.tilePixelSize;
        const now = Date.now();
        const mapWidth = this.mapData?.width || 30;
        const mapHeight = this.mapData?.height || 30;

        this.npcs.forEach(npc => {
            if (now - npc.lastMoveTime >= npc.moveInterval) {
                const directions = [
                    { x: 0, y: -1 },
                    { x: 0, y: 1 },
                    { x: -1, y: 0 },
                    { x: 1, y: 0 }
                ];
                Phaser.Utils.Array.Shuffle(directions);
                let moved = false;
                for (const dir of directions) {
                    const newX = npc.gridX + dir.x;
                    const newY = npc.gridY + dir.y;
                    if (newX >= 0 && newX < mapWidth && newY >= 0 && newY < mapHeight) {
                        if (!this.mapData?.tilemap || this.mapData.tilemap.isWalkable(newX, newY)) {
                            npc.targetGridX = newX;
                            npc.targetGridY = newY;
                            npc.lastMoveTime = now;
                            npc.moveInterval = 1500 + Math.random() * 2000;
                            moved = true;
                            break;
                        }
                    }
                }
                if (!moved) {
                    npc.lastMoveTime = now;
                    npc.moveInterval = 1000;
                }
            }

            const dx = npc.targetGridX - npc.gridX;
            const dy = npc.targetGridY - npc.gridY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0.1) {
                npc.gridX += dx * 0.15;
                npc.gridY += dy * 0.15;
            } else {
                npc.gridX = npc.targetGridX;
                npc.gridY = npc.targetGridY;
            }

            npc.container.x = npc.gridX * tileSize + tileSize / 2;
            npc.container.y = npc.gridY * tileSize + tileSize / 2;
            this.updateCharacterAnimation(npc, distance > 0.1 ? calculateDirection(dx, dy) : npc.direction || 'south', distance > 0.1);
        });
    }

    updateUI() {
        const nameEl = document.getElementById('game-character-name');
        if (nameEl && gameState.selectedCharacter) {
            nameEl.textContent = gameState.selectedCharacter.name;
        }
        const powersEl = document.getElementById('game-character-powers');
        if (powersEl) {
            powersEl.textContent = gameState.selectedPowers.map(p => p.name).join(', ') || 'Aucun pouvoir';
        }
    }

    /**
     * Vérifie la proximité des NPCs pour initier des dialogues
     */
    checkNPCProximity() {
        // Vérifier si le service de dialogue est disponible (même sans clé API, on peut afficher l'indicateur)
        if (this.isDialogueActive) return;

        // Distance d'interaction en cases (2 cases = distance de 2)
        const interactionDistanceInTiles = 2;
        const playerGridX = this.player.x / this.tilePixelSize;
        const playerGridY = this.player.y / this.tilePixelSize;

        let nearestNPC = null;
        let nearestDistance = Infinity;

        if (!this.npcs || this.npcs.length === 0) return;

        this.npcs.forEach(npc => {
            if (!npc || !npc.container) return;

            const npcGridX = npc.container.x / this.tilePixelSize;
            const npcGridY = npc.container.y / this.tilePixelSize;

            const distance = Math.sqrt(
                Math.pow(npcGridX - playerGridX, 2) +
                Math.pow(npcGridY - playerGridY, 2)
            );

            // Trouver le NPC le plus proche (distance en cases)
            if (distance < interactionDistanceInTiles && distance < nearestDistance) {
                nearestNPC = npc;
                nearestDistance = distance;
            }

            // Retirer l'indicateur visuel si le NPC est trop loin
            if (distance >= interactionDistanceInTiles && npc.interactionIndicator) {
                npc.interactionIndicator.destroy();
                npc.interactionIndicator = null;
            }
        });

        // Afficher un indicateur visuel sur le NPC le plus proche
        if (nearestNPC && !nearestNPC.interactionIndicator) {
            const indicator = this.add.text(
                nearestNPC.container.x,
                nearestNPC.container.y - 50,
                'Appuyez sur E pour parler',
                {
                    fontSize: '12px',
                    fill: '#ffff00',
                    backgroundColor: '#000000',
                    padding: { x: 6, y: 3 },
                    fontStyle: 'bold'
                }
            ).setOrigin(0.5, 0.5);
            indicator.setDepth(nearestNPC.container.y + 1000);
            nearestNPC.interactionIndicator = indicator;
        }

        // Mettre à jour la position de l'indicateur
        if (nearestNPC && nearestNPC.interactionIndicator) {
            nearestNPC.interactionIndicator.x = nearestNPC.container.x;
            nearestNPC.interactionIndicator.y = nearestNPC.container.y - 50;
        }

        // Stocker le NPC le plus proche pour l'interaction (utilisé par le fallback)
        this.nearestNPCForInteraction = nearestNPC;

        // Vérifier la touche E (séparément pour éviter les problèmes de timing)
        // Utiliser plusieurs méthodes pour s'assurer que la touche est détectée
        if (this.interactKey) {
            const eKeyPressed = Phaser.Input.Keyboard.JustDown(this.interactKey);

            if (eKeyPressed && nearestNPC && !this.isDialogueActive) {
                console.log('✅ Touche E pressée (Phaser), démarrage du dialogue avec', nearestNPC.character?.name);
                this.startDialogue(nearestNPC);
                if (nearestNPC.interactionIndicator) {
                    nearestNPC.interactionIndicator.destroy();
                    nearestNPC.interactionIndicator = null;
                }
            }
        }
    }

    /**
     * Démarre un dialogue avec un NPC
     */
    async startDialogue(npc) {
        if (this.isDialogueActive) return;

        console.log('Démarrage du dialogue avec', npc.character?.name);

        // Vérifier si le service de dialogue est disponible
        if (!this.dialogueService) {
            console.warn('Service de dialogue non disponible. Vérifiez que la clé API est configurée.');
            // Afficher quand même l'interface avec un message d'erreur
        }

        this.isDialogueActive = true;
        this.currentDialogueNPC = npc;
        this.conversationHistory = [];
        this.discussedTopics = []; // Sujets déjà abordés pour éviter les répétitions

        // Afficher l'interface de dialogue
        const dialogueUI = document.getElementById('dialogue-ui');
        if (dialogueUI) {
            dialogueUI.classList.remove('hidden');
        }

        // Afficher le nom du NPC
        const npcNameEl = document.getElementById('dialogue-npc-name');
        if (npcNameEl && npc.character) {
            npcNameEl.textContent = npc.character.name;
        }

        // Afficher l'avatar du NPC (emoji)
        const npcAvatarEl = document.getElementById('dialogue-npc-avatar');
        if (npcAvatarEl && npc.character) {
            const characterData = characters.find(c => c.id === npc.character.id);
            if (characterData) {
                npcAvatarEl.innerHTML = characterData.image;
                npcAvatarEl.className = `w-16 h-16 ${characterData.colorClass} rounded-full flex items-center justify-center text-3xl border-2 border-purple-700`;
            }
        }

        // Initialiser le service TTS si disponible
        if (!this.ttsService && window.TTSService) {
            this.ttsService = new TTSService();
            if (!this.ttsService.isAvailable()) {
                console.warn('TTS non disponible dans ce navigateur');
            }
        }

        // Initialiser le bouton TTS (une seule fois)
        const ttsToggleBtn = document.getElementById('dialogue-tts-toggle');
        if (ttsToggleBtn && this.ttsService && !ttsToggleBtn.dataset.initialized) {
            ttsToggleBtn.dataset.initialized = 'true';
            // Mettre à jour l'apparence selon l'état actuel
            if (this.ttsService.isEnabled) {
                ttsToggleBtn.classList.add('text-purple-600');
                ttsToggleBtn.classList.remove('text-gray-500');
            } else {
                ttsToggleBtn.classList.add('text-gray-500');
                ttsToggleBtn.classList.remove('text-purple-600');
            }

            ttsToggleBtn.addEventListener('click', () => {
                const isEnabled = !this.ttsService.isEnabled;
                this.ttsService.setEnabled(isEnabled);
                ttsToggleBtn.classList.toggle('text-purple-600', isEnabled);
                ttsToggleBtn.classList.toggle('text-gray-500', !isEnabled);
            });
        }

        // Afficher un message de chargement
        const dialogueMessageEl = document.getElementById('dialogue-message');
        const dialogueChoicesEl = document.getElementById('dialogue-choices');
        if (dialogueMessageEl) {
            dialogueMessageEl.textContent = '...';
        }
        if (dialogueChoicesEl) {
            dialogueChoicesEl.innerHTML = '';
        }

        // Si le service de dialogue n'est pas disponible, afficher un message d'erreur
        if (!this.dialogueService) {
            if (dialogueMessageEl) {
                dialogueMessageEl.textContent = "Salut ! Comment ça va ? (Service de dialogue non configuré)";
            }
            if (dialogueChoicesEl) {
                dialogueChoicesEl.innerHTML = `
                    <button class="dialogue-choice-btn bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 text-sm">
                        Répondre amicalement
                    </button>
                    <button class="dialogue-choice-btn bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 text-sm ml-2" onclick="window.gameScene?.endDialogue()">
                        Fermer
                    </button>
                `;
            }
            return;
        }

        try {
            // Générer le dialogue initial avec l'humeur du joueur et les sujets déjà abordés
            const dialogue = await this.dialogueService.generateInitialDialogue(
                npc.character.id,
                gameState.selectedCharacterId,
                gameState.currentMood,
                this.discussedTopics
            );

            // Afficher le message du NPC
            if (dialogueMessageEl) {
                dialogueMessageEl.textContent = dialogue.message;
            }

            // Lire le message à voix haute
            if (this.ttsService && this.ttsService.isEnabled) {
                this.ttsService.speak(dialogue.message, npc.character.id, {
                    onEnd: () => {
                        console.log('Lecture terminée');
                    },
                    onError: (error) => {
                        console.error('Erreur lors de la lecture:', error);
                    }
                });
            }

            // Ajouter à l'historique
            this.conversationHistory.push({
                speaker: npc.character.name,
                message: dialogue.message
            });

            // Extraire les sujets abordés dans le message initial
            this.extractTopicsFromMessage(dialogue.message, npc.character.id);

            // Afficher les choix
            if (dialogueChoicesEl && dialogue.choices) {
                dialogueChoicesEl.innerHTML = '';
                dialogue.choices.forEach((choice, index) => {
                    const button = document.createElement('button');
                    button.className = 'dialogue-choice-btn bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 text-sm';
                    button.textContent = choice.text;
                    button.addEventListener('click', () => {
                        this.handleDialogueChoice(choice);
                    });
                    dialogueChoicesEl.appendChild(button);
                });
            }
        } catch (error) {
            console.error('Erreur lors de la génération du dialogue:', error);
            if (dialogueMessageEl) {
                dialogueMessageEl.textContent = "Salut ! Comment ça va ?";
            }
        }
    }

    /**
     * Gère le choix du joueur dans le dialogue
     */
    async handleDialogueChoice(choice) {
        if (!this.currentDialogueNPC || !this.dialogueService) return;

        const dialogueMessageEl = document.getElementById('dialogue-message');
        const dialogueChoicesEl = document.getElementById('dialogue-choices');

        // Afficher le choix du joueur
        if (dialogueMessageEl) {
            dialogueMessageEl.textContent = `Vous: ${choice.text}`;
        }

        // Ajouter à l'historique
        this.conversationHistory.push({
            speaker: gameState.selectedCharacter?.name || 'Vous',
            message: choice.text
        });

        // Désactiver les boutons
        if (dialogueChoicesEl) {
            dialogueChoicesEl.innerHTML = '<p class="text-purple-200 text-sm">Le personnage réfléchit...</p>';
        }

        try {
            // Générer la réponse du NPC avec de nouveaux choix contextualisés (incluant l'humeur et les sujets abordés)
            const response = await this.dialogueService.generateNPCResponse(
                this.currentDialogueNPC.character.id,
                gameState.selectedCharacterId,
                choice,
                this.conversationHistory,
                gameState.currentMood,
                this.discussedTopics
            );

            // La réponse peut être une string (ancien format) ou un objet avec message et choices
            const npcResponse = typeof response === 'string' ? response : response.message;
            const newChoices = typeof response === 'object' && response.choices ? response.choices : null;

            // Extraire et ajouter les sujets abordés dans le message du NPC
            this.extractTopicsFromMessage(npcResponse, this.currentDialogueNPC.character.id);

            // Afficher la réponse
            if (dialogueMessageEl) {
                dialogueMessageEl.textContent = npcResponse;
            }

            // Lire la réponse à voix haute
            if (this.ttsService && this.ttsService.isEnabled && this.currentDialogueNPC) {
                this.ttsService.speak(npcResponse, this.currentDialogueNPC.character.id, {
                    onEnd: () => {
                        console.log('Lecture terminée');
                    },
                    onError: (error) => {
                        console.error('Erreur lors de la lecture:', error);
                    }
                });
            }

            // Ajouter à l'historique
            this.conversationHistory.push({
                speaker: this.currentDialogueNPC.character.name,
                message: npcResponse
            });

            // Afficher les nouveaux choix contextualisés
            if (dialogueChoicesEl) {
                if (newChoices && newChoices.length > 0) {
                    // Afficher les choix générés dynamiquement
                    dialogueChoicesEl.innerHTML = '';
                    newChoices.forEach((newChoice) => {
                        const button = document.createElement('button');
                        button.className = 'dialogue-choice-btn bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 text-sm';
                        button.textContent = newChoice.text;
                        button.addEventListener('click', () => {
                            this.handleDialogueChoice(newChoice);
                        });
                        dialogueChoicesEl.appendChild(button);
                    });

                    // Ajouter un bouton pour terminer la conversation
                    const endBtn = document.createElement('button');
                    endBtn.className = 'dialogue-choice-btn bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 text-sm ml-2';
                    endBtn.textContent = 'Terminer la conversation';
                    endBtn.addEventListener('click', () => {
                        this.endDialogue();
                    });
                    dialogueChoicesEl.appendChild(endBtn);
                } else {
                    // Fallback : proposer de continuer ou fermer
                    dialogueChoicesEl.innerHTML = `
                        <button class="dialogue-choice-btn bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 text-sm">
                            Continuer à parler
                        </button>
                        <button class="dialogue-choice-btn bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 text-sm ml-2">
                            Terminer la conversation
                        </button>
                    `;

                    const continueBtn = dialogueChoicesEl.querySelector('button:first-child');
                    const endBtn = dialogueChoicesEl.querySelector('button:last-child');

                    continueBtn.addEventListener('click', () => {
                        this.continueDialogue();
                    });

                    endBtn.addEventListener('click', () => {
                        this.endDialogue();
                    });
                }
            }
        } catch (error) {
            console.error('Erreur lors de la génération de la réponse:', error);
            if (dialogueMessageEl) {
                dialogueMessageEl.textContent = "D'accord, je comprends.";
            }
        }
    }

    /**
     * Continue le dialogue avec de nouveaux choix contextualisés
     */
    async continueDialogue() {
        if (!this.currentDialogueNPC || !this.dialogueService) return;

        const dialogueChoicesEl = document.getElementById('dialogue-choices');
        const dialogueMessageEl = document.getElementById('dialogue-message');

        if (dialogueChoicesEl) {
            dialogueChoicesEl.innerHTML = '<p class="text-purple-200 text-sm">Génération de nouveaux choix...</p>';
        }

        try {
            // Récupérer le dernier message du NPC pour générer des choix contextualisés
            const lastNPCMessage = this.conversationHistory
                .filter(h => h.speaker === this.currentDialogueNPC.character.name)
                .pop()?.message || "Comment ça va ?";

            // Générer de nouveaux choix basés sur le dernier message, l'humeur du joueur et les sujets déjà abordés
            const choices = await this.dialogueService.generateContextualChoices(
                lastNPCMessage,
                this.currentDialogueNPC.character.id,
                gameState.selectedCharacterId,
                gameState.currentMood
            );

            if (dialogueChoicesEl) {
                dialogueChoicesEl.innerHTML = '';
                choices.forEach(choice => {
                    const button = document.createElement('button');
                    button.className = 'dialogue-choice-btn bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 text-sm';
                    button.textContent = choice.text;
                    button.addEventListener('click', () => {
                        this.handleDialogueChoice(choice);
                    });
                    dialogueChoicesEl.appendChild(button);
                });

                // Ajouter un bouton pour terminer
                const endBtn = document.createElement('button');
                endBtn.className = 'dialogue-choice-btn bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 text-sm ml-2';
                endBtn.textContent = 'Terminer la conversation';
                endBtn.addEventListener('click', () => {
                    this.endDialogue();
                });
                dialogueChoicesEl.appendChild(endBtn);
            }
        } catch (error) {
            console.error('Erreur lors de la génération des choix:', error);
            // Fallback avec des choix génériques
            if (dialogueChoicesEl) {
                const fallbackChoices = [
                    { text: "Répondre amicalement", tone: "friendly" },
                    { text: "Répondre avec humour", tone: "funny" },
                    { text: "Répondre brièvement", tone: "brief" }
                ];
                dialogueChoicesEl.innerHTML = '';
                fallbackChoices.forEach(choice => {
                    const button = document.createElement('button');
                    button.className = 'dialogue-choice-btn bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105 text-sm';
                    button.textContent = choice.text;
                    button.addEventListener('click', () => {
                        this.handleDialogueChoice(choice);
                    });
                    dialogueChoicesEl.appendChild(button);
                });
            }
        }
    }

    /**
     * Extrait les sujets abordés d'un message pour éviter les répétitions
     */
    extractTopicsFromMessage(message, characterId) {
        if (!message || !characterId) return;

        const npc = this.dialogueService?.characterPersonalities[characterId];
        if (!npc) return;

        // Vérifier si le message mentionne un des sujets favoris du personnage
        const messageLower = message.toLowerCase();
        npc.topics.forEach(topic => {
            const topicLower = topic.toLowerCase();
            if (messageLower.includes(topicLower) && !this.discussedTopics.includes(topic)) {
                this.discussedTopics.push(topic);
            }
        });

        // Limiter à 10 sujets pour éviter que la liste devienne trop longue
        if (this.discussedTopics.length > 10) {
            this.discussedTopics = this.discussedTopics.slice(-10);
        }
    }

    /**
     * Termine le dialogue
     */
    endDialogue() {
        // Arrêter la lecture TTS en cours
        if (this.ttsService) {
            this.ttsService.stop();
        }

        this.isDialogueActive = false;
        this.currentDialogueNPC = null;
        this.conversationHistory = [];
        this.discussedTopics = []; // Réinitialiser les sujets abordés

        const dialogueUI = document.getElementById('dialogue-ui');
        if (dialogueUI) {
            dialogueUI.classList.add('hidden');
        }
    }
}
