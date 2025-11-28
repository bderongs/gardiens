/**
 * Rendu de personnage avec système de calques (paper doll)
 * Utilise les sprites Universal LPC
 */

class CharacterRenderer {
    constructor(spriteLoader) {
        this.spriteLoader = spriteLoader;
        this.charactersConfig = null;
        this.availableSprites = null;
        this.configLoaded = false;
        this.loadConfig();
    }

    /**
     * Charge la configuration des personnages
     */
    async loadConfig() {
        // Configuration intégrée directement pour éviter les problèmes CORS avec file://
        this.charactersConfig = {
            "sophie": {
                "name": "Sophie Foster",
                "gender": "female",
                "sprites": {
                    "body": "sprites/body/female_light.png",
                    "hair": "sprites/hair/female_long_blonde.png",
                    "clothes": "sprites/clothes/female_dress.png"
                },
                "description": "Télépathe exceptionnelle, cheveux blonds longs, style élégant"
            },
            "fitz": {
                "name": "Fitz Vacker",
                "gender": "male",
                "sprites": {
                    "body": "sprites/body/male_light.png",
                    "hair": "sprites/hair/male_short_brunette.png",
                    "clothes": "sprites/clothes/male_shirt_white.png"
                },
                "description": "Télépathe talentueux, cheveux bruns courts, style formel"
            },
            "keefe": {
                "name": "Keefe Sencen",
                "gender": "male",
                "sprites": {
                    "body": "sprites/body/male_tanned.png",
                    "hair": "sprites/hair/male_messy_blonde.png",
                    "clothes": "sprites/clothes/male_shirt_white.png"
                },
                "description": "Empathe, cheveux blonds ébouriffés, style décontracté"
            },
            "dex": {
                "name": "Dex Dizznee",
                "gender": "male",
                "sprites": {
                    "body": "sprites/body/male_light.png",
                    "hair": "sprites/hair/male_short_redhead.png",
                    "clothes": "sprites/clothes/male_shirt_white.png"
                },
                "description": "Technopathe, cheveux roux courts, style décontracté"
            },
            "biana": {
                "name": "Biana Vacker",
                "gender": "female",
                "sprites": {
                    "body": "sprites/body/female_light.png",
                    "hair": "sprites/hair/female_long_blonde.png",
                    "clothes": "sprites/clothes/female_dress.png"
                },
                "description": "Éclipseuse, cheveux blonds longs, style élégant"
            },
            "tam": {
                "name": "Tam Song",
                "gender": "male",
                "sprites": {
                    "body": "sprites/body/male_dark.png",
                    "hair": "sprites/hair/male_short_brunette.png",
                    "clothes": "sprites/clothes/male_shirt_white.png"
                },
                "description": "Ténébreux, cheveux noirs courts, style sombre"
            }
        };
        
        this.availableSprites = {
            "hair": {
                "female": {
                    "long": ["light-blonde2", "brunette2", "redhead2", "white-blonde2", "gray"],
                    "medium": ["shoulderl"],
                    "short": ["pixie"],
                    "ponytail": ["ponytail"]
                },
                "male": {
                    "short": ["plain/brunette2", "plain/light-blonde2", "plain/redhead2", "plain/black"],
                    "messy": ["messy2/light-blonde2"],
                    "long": ["long"]
                }
            },
            "body": {
                "female": ["light", "dark", "tanned"],
                "male": ["light", "dark", "tanned"]
            },
            "clothes": {
                "shirts": ["white_longsleeve", "teal_longsleeve", "brown_longsleeve", "maroon_longsleeve"],
                "dresses": ["dress_w_sash_female", "underdress"]
            }
        };
        
        // Configuration chargée (log désactivé pour éviter le spam)
        this.configLoaded = true;
    }
    
    /**
     * Attend que la configuration soit chargée
     */
    async waitForConfig() {
        while (!this.configLoaded) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    /**
     * Obtient la configuration d'un personnage
     */
    getCharacterConfig(characterId) {
        if (this.charactersConfig && this.charactersConfig[characterId]) {
            return this.charactersConfig[characterId];
        }
        return null;
    }

    /**
     * Met à jour les sprites d'un personnage
     */
    updateCharacterSprites(characterId, newSprites) {
        if (!this.charactersConfig) {
            this.charactersConfig = {};
        }
        if (!this.charactersConfig[characterId]) {
            this.charactersConfig[characterId] = { sprites: {} };
        }
        this.charactersConfig[characterId].sprites = {
            ...this.charactersConfig[characterId].sprites,
            ...newSprites
        };
    }

    /**
     * Dessine un personnage sur un canvas en combinant les sprites
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {Object} customization - Options de personnalisation
     * @param {number} scale - Échelle de rendu (défaut: 1)
     * @param {string} characterId - ID du personnage (optionnel, pour utiliser la config prédéfinie)
     * @param {string} direction - Direction du personnage ('north', 'south', 'east', 'west')
     * @param {boolean} isMoving - Si true, utilise l'animation de marche
     * @param {number} animationFrame - Frame d'animation pour le cycle de marche (0-8)
     */
    async drawCharacter(ctx, x, y, customization, scale = 1, characterId = null, direction = 'south', isMoving = false, animationFrame = 0) {
        // Attendre que la config soit chargée
        await this.waitForConfig();
        
        // Utiliser directement les sprites depuis customization si disponibles
        let sprites = {};
        
        // Si customization contient directement les chemins de sprites, les utiliser
        if (customization.bodySprite || customization.hairSprite || customization.clothesSprite || customization.bottomSprite) {
            sprites = {
                body: customization.bodySprite,
                hair: customization.hairSprite,
                clothes: customization.clothesSprite,
                bottom: customization.bottomSprite || null // S'assurer que bottom est null si non défini
            };
            // Debug: vérifier que bottomSprite est bien défini
            if (customization.bottomSprite) {
                console.log('Rendu des bas avec sprite:', customization.bottomSprite);
            }
        } else {
            // Sinon, utiliser la config prédéfinie ou construire depuis customization
            if (characterId && this.charactersConfig && this.charactersConfig[characterId]) {
                sprites = { ...this.charactersConfig[characterId].sprites };
            }
            
            // Construire/remplacer les sprites depuis customization
            const customSprites = this.buildSpritePaths(customization, characterId);
            sprites = { ...sprites, ...customSprites };
        }

        // Ordre de rendu (de l'arrière vers l'avant) :
        // 1. Corps
        // 2. Bas/Pantalons
        // 3. Vêtements (haut)
        // 4. Cheveux (les cheveux sont dessinés par-dessus)

        try {
            // Ordre de rendu : corps → bas → vêtements → cheveux (de l'arrière vers l'avant)
            // Dessiner le corps avec la direction et l'animation appropriées
            if (sprites.body) {
                await this.drawSpriteSheet(ctx, x, y, sprites.body, scale, animationFrame, direction, isMoving);
            }

            // Dessiner les bas/pantalons par-dessus le corps (mais sous les vêtements)
            // Ne pas dessiner si le sprite de bas est le même que le haut (pour éviter la duplication)
            if (sprites.bottom && sprites.bottom !== sprites.clothes) {
                try {
                    await this.drawSpriteSheet(ctx, x, y, sprites.bottom, scale, animationFrame, direction, isMoving);
                } catch (error) {
                    console.warn('Erreur lors du rendu des bas:', sprites.bottom, error);
                }
            }

            // Dessiner les vêtements (haut) par-dessus le corps et les bas
            if (sprites.clothes) {
                await this.drawSpriteSheet(ctx, x, y, sprites.clothes, scale, animationFrame, direction, isMoving);
            }

            // Dessiner les cheveux par-dessus tout
            if (sprites.hair) {
                await this.drawSpriteSheet(ctx, x, y, sprites.hair, scale, animationFrame, direction, isMoving);
            }
        } catch (error) {
            console.error('Erreur lors du rendu du personnage:', error);
            // Dessiner un personnage de secours si les sprites ne sont pas disponibles
            this.drawFallbackCharacter(ctx, x, y, scale);
        }
    }

    /**
     * Construit les chemins de sprites depuis les options de personnalisation
     */
    buildSpritePaths(customization, characterId = null) {
        const { hairStyle, hairColor, outfit, skinColor } = customization;
        const sprites = {};

        // Déterminer le genre depuis le characterId ou par défaut
        let gender = 'male';
        if (characterId && this.charactersConfig && this.charactersConfig[characterId]) {
            gender = this.charactersConfig[characterId].gender || 'male';
        } else {
            // Deviner depuis les personnages disponibles
            const femaleChars = ['sophie', 'biana'];
            if (characterId && femaleChars.includes(characterId)) {
                gender = 'female';
            }
        }

        // Corps basé sur la couleur de peau
        if (skinColor) {
            const skinType = this.getSkinType(skinColor);
            sprites.body = `sprites/body/${gender}_${skinType}.png`;
        }

        // Cheveux
        if (hairStyle && hairColor) {
            sprites.hair = this.buildHairPath(hairStyle, hairColor, gender);
        }

        // Vêtements
        if (outfit) {
            sprites.clothes = this.buildClothesPath(outfit, gender);
        }

        return sprites;
    }

    /**
     * Construit le chemin pour les cheveux
     */
    buildHairPath(style, color, gender = 'male') {
        // Mapping des couleurs
        const colorMap = {
            '#1a1a1a': 'black',
            '#2d1810': 'black',
            '#3d2817': 'brunette',
            '#8b4513': 'brunette',
            '#a0522d': 'brunette',
            '#f4d03f': 'blonde',
            '#ffeb3b': 'blonde',
            '#daa520': 'blonde',
            '#a0522d': 'redhead',
            '#cd853f': 'redhead'
        };

        const colorName = colorMap[color] || 'blonde';
        
        // Mapping des styles selon le genre
        let styleName = 'long';
        if (gender === 'female') {
            const femaleStyleMap = {
                'short_straight': 'short',
                'short_curly': 'short',
                'medium_straight': 'medium',
                'medium_curly': 'medium',
                'long_straight': 'long',
                'long_curly': 'long',
                'ponytail': 'ponytail',
                'bun': 'bun',
                'side_part': 'medium',
                'bangs': 'medium'
            };
            styleName = femaleStyleMap[style] || 'long';
        } else {
            const maleStyleMap = {
                'short_straight': 'short',
                'short_curly': 'short',
                'medium_straight': 'medium',
                'medium_curly': 'medium',
                'long_straight': 'long',
                'long_curly': 'long',
                'ponytail': 'ponytail',
                'messy': 'messy'
            };
            styleName = maleStyleMap[style] || 'short';
        }

        // Construire le chemin avec le bon format
        if (gender === 'female') {
            if (styleName === 'long') {
                return `sprites/hair/female_long_${colorName}.png`;
            } else if (styleName === 'medium') {
                return `sprites/hair/female_long_${colorName}.png`; // Fallback sur long
            } else {
                return `sprites/hair/female_long_${colorName}.png`; // Fallback
            }
        } else {
            if (styleName === 'messy') {
                return `sprites/hair/male_messy_${colorName}.png`;
            } else {
                return `sprites/hair/male_short_${colorName}.png`;
            }
        }
    }

    /**
     * Construit le chemin pour les vêtements
     */
    buildClothesPath(outfit, gender = 'male') {
        if (gender === 'female') {
            const femaleOutfitMap = {
                'dress': 'sprites/clothes/female_dress.png',
                'elegant_top': 'sprites/clothes/female_dress.png',
                'tshirt': 'sprites/clothes/female_dress.png', // Fallback
                'shirt': 'sprites/clothes/female_dress.png',
                'jacket': 'sprites/clothes/female_dress.png',
                'hoodie': 'sprites/clothes/female_dress.png'
            };
            return femaleOutfitMap[outfit] || 'sprites/clothes/female_dress.png';
        } else {
            const maleOutfitMap = {
                'tshirt': 'sprites/clothes/male_shirt_white.png',
                'shirt': 'sprites/clothes/male_shirt_white.png',
                'jacket': 'sprites/clothes/male_shirt_white.png',
                'hoodie': 'sprites/clothes/male_shirt_white.png',
                'dress': 'sprites/clothes/male_shirt_white.png', // Fallback
                'elegant_top': 'sprites/clothes/male_shirt_white.png'
            };
            return maleOutfitMap[outfit] || 'sprites/clothes/male_shirt_white.png';
        }
    }

    /**
     * Détermine le type de peau depuis la couleur
     */
    getSkinType(skinColor) {
        // Mapping simplifié des couleurs de peau
        if (skinColor.includes('fdbcb4') || skinColor.includes('ffdbac')) return 'light';
        if (skinColor.includes('d08b5b') || skinColor.includes('e0ac69')) return 'tanned';
        if (skinColor.includes('8d5524') || skinColor.includes('654321')) return 'dark';
        return 'light';
    }

    /**
     * Dessine une spritesheet (extrait la première frame ou le frame spécifié)
     * Dans les sprites LPC, les frames sont organisés ainsi :
     * - Les directions sont "nwse" (north, west, south, east)
     * - Pour chaque pose, les directions sont organisées en LIGNES
     * - Ligne 0 = spellcast (idle) - 7 frames
     * - Ligne 8 = walkcycle (marche) - 9 frames
     * - Pour chaque pose, les directions sont :
     *   - Ligne de base + 0 = north (dos, regardant vers le haut)
     *   - Ligne de base + 1 = west (côté gauche)
     *   - Ligne de base + 2 = south (face, regardant vers le bas/camera)
     *   - Ligne de base + 3 = east (côté droit)
     * @param {boolean} isMoving - Si true, utilise walkcycle (ligne 8), sinon spellcast (ligne 0)
     */
    async drawSpriteSheet(ctx, x, y, spritePath, scale = 1, frameIndex = 0, direction = 'south', isMoving = false) {
        try {
            const img = await this.spriteLoader.loadImage(spritePath);
            
            // Les sprites LPC sont des spritesheets de 832x1344 pixels
            // Chaque frame fait généralement 64x64 pixels
            // Il y a 13 colonnes et 21 lignes
            const frameWidth = 64;
            const frameHeight = 64;
            const cols = 13;
            
            // Déterminer la ligne de base selon l'état (idle ou marche)
            const baseRow = isMoving ? 8 : 0; // walkcycle = ligne 8, spellcast = ligne 0
            const maxFrames = isMoving ? 9 : 7; // walkcycle a 9 frames, spellcast a 7 frames
            
            // Mapping des directions vers les offsets de ligne
            const directionRowMap = {
                'north': 0,   // Dos (regardant vers le haut)
                'west': 1,    // Côté gauche
                'south': 2,   // Face (regardant vers le bas/camera)
                'east': 3,    // Côté droit
                'n': 0,
                'w': 1,
                's': 2,
                'e': 3
            };
            
            // Calculer la ligne et la colonne
            let col, row;
            if (direction && directionRowMap[direction] !== undefined) {
                // La direction détermine l'offset de ligne par rapport à la ligne de base
                row = baseRow + directionRowMap[direction];
                // Limiter le frameIndex au nombre de frames disponibles
                col = Math.min(frameIndex % maxFrames, maxFrames - 1);
            } else {
                // Par défaut : south (vue de face)
                row = baseRow + 2; // South
                col = Math.min(frameIndex % maxFrames, maxFrames - 1);
            }
            
            const sx = col * frameWidth;
            const sy = row * frameHeight;
            
            // Vérifier que le frame est dans les limites
            if (sx + frameWidth <= img.width && sy + frameHeight <= img.height) {
                // Dessiner le frame spécifique
                ctx.drawImage(
                    img,
                    sx, sy, frameWidth, frameHeight, // Source: frame spécifique
                    x, y, frameWidth * scale, frameHeight * scale // Destination
                );
            } else {
                // Si le frame n'existe pas, utiliser la vue de face (south) de la pose idle
                const fallbackCol = 0;
                const fallbackRow = 2; // South = vue de face (ligne 2 de spellcast)
                ctx.drawImage(
                    img,
                    fallbackCol * frameWidth, fallbackRow * frameHeight, frameWidth, frameHeight,
                    x, y, frameWidth * scale, frameHeight * scale
                );
            }
        } catch (error) {
            console.warn(`Impossible de charger le sprite ${spritePath}:`, error);
            throw error;
        }
    }


    /**
     * Personnage de secours si les sprites ne sont pas disponibles
     */
    drawFallbackCharacter(ctx, x, y, scale) {
        // Dessiner un personnage simple avec Canvas
        ctx.fillStyle = '#fdbcb4';
        ctx.fillRect(x, y, 20 * scale, 40 * scale);
        ctx.beginPath();
        ctx.arc(x + 10 * scale, y - 10 * scale, 10 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Tête de secours
     */
    drawFallbackHead(ctx, x, y, scale) {
        ctx.fillStyle = '#fdbcb4';
        ctx.beginPath();
        ctx.arc(x + 15 * scale, y, 15 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Obtient la liste des sprites disponibles pour une catégorie
     */
    getAvailableSprites(category) {
        if (!this.availableSprites) return [];
        return this.availableSprites[category] || [];
    }

    /**
     * Obtient tous les sprites disponibles
     */
    getAllAvailableSprites() {
        return this.availableSprites || {};
    }
}

// Instance globale
const characterRenderer = new CharacterRenderer(spriteLoader);

