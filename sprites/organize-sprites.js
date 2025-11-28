/**
 * Script pour organiser les sprites LPC et créer des configurations de personnages
 * Ce script sera exécuté via Node.js pour copier et organiser les sprites
 */

const fs = require('fs');
const path = require('path');

const LPC_DIR = path.join(__dirname, '..', 'lpc-sprites-temp');
const SPRITES_DIR = path.join(__dirname);

// Configuration des personnages principaux
const charactersConfig = {
    sophie: {
        name: 'Sophie Foster',
        gender: 'female',
        hair: { style: 'long', color: 'light-blonde2' },
        body: { type: 'light' },
        clothes: { type: 'elegant' }
    },
    fitz: {
        name: 'Fitz Vacker',
        gender: 'male',
        hair: { style: 'short', color: 'brunette2' },
        body: { type: 'light' },
        clothes: { type: 'formal' }
    },
    keefe: {
        name: 'Keefe Sencen',
        gender: 'male',
        hair: { style: 'messy', color: 'blonde' },
        body: { type: 'medium' },
        clothes: { type: 'casual' }
    },
    dex: {
        name: 'Dex Dizznee',
        gender: 'male',
        hair: { style: 'short', color: 'redhead' },
        body: { type: 'light' },
        clothes: { type: 'casual' }
    },
    biana: {
        name: 'Biana Vacker',
        gender: 'female',
        hair: { style: 'long', color: 'blonde' },
        body: { type: 'light' },
        clothes: { type: 'elegant' }
    },
    tam: {
        name: 'Tam Song',
        gender: 'male',
        hair: { style: 'short', color: 'black' },
        body: { type: 'dark' },
        clothes: { type: 'dark' }
    }
};

// Mapping des styles de cheveux disponibles
const hairMapping = {
    female: {
        'long': 'long',
        'medium': 'shoulderl',
        'short': 'pixie',
        'curly': 'jewfro',
        'ponytail': 'ponytail',
        'bun': 'shortknot'
    },
    male: {
        'short': 'plain',
        'medium': 'shoulderl',
        'long': 'long',
        'messy': 'messy2',
        'ponytail': 'ponytail'
    }
};

/**
 * Copie un fichier s'il existe
 */
function copyFile(src, dest) {
    try {
        if (fs.existsSync(src)) {
            const destDir = path.dirname(dest);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            fs.copyFileSync(src, dest);
            return true;
        }
    } catch (error) {
        console.error(`Erreur lors de la copie de ${src}:`, error.message);
    }
    return false;
}

/**
 * Trouve un fichier sprite dans le repository LPC
 */
function findSprite(category, gender, subcategory, filename) {
    const basePath = path.join(LPC_DIR, category, gender || '');
    const searchPaths = [
        path.join(basePath, subcategory, filename),
        path.join(basePath, filename),
        path.join(LPC_DIR, category, subcategory, gender, filename),
        path.join(LPC_DIR, category, subcategory, filename)
    ];
    
    for (const searchPath of searchPaths) {
        if (fs.existsSync(searchPath)) {
            return searchPath;
        }
    }
    return null;
}

/**
 * Organise les sprites pour un personnage
 */
function organizeCharacterSprites(characterId, config) {
    const { gender, hair, body, clothes } = config;
    
    // Créer le dossier du personnage
    const charDir = path.join(SPRITES_DIR, 'characters', characterId);
    if (!fs.existsSync(charDir)) {
        fs.mkdirSync(charDir, { recursive: true });
    }
    
    const sprites = {};
    
    // Copier le corps
    const bodyFiles = [
        `${body.type}.png`,
        `dark.png`,
        `light.png`,
        `tanned.png`
    ];
    
    for (const bodyFile of bodyFiles) {
        const src = findSprite('body', gender, '', bodyFile);
        if (src) {
            const dest = path.join(charDir, `body_${bodyFile}`);
            if (copyFile(src, dest)) {
                sprites.body = `sprites/characters/${characterId}/body_${bodyFile}`;
                break;
            }
        }
    }
    
    // Copier les cheveux
    const hairStyle = hairMapping[gender]?.[hair.style] || hair.style;
    const hairFiles = [
        `${hairStyle}/${hair.color}.png`,
        `${hairStyle}/${hair.color}2.png`,
        `${hairStyle}.png`
    ];
    
    for (const hairFile of hairFiles) {
        const src = findSprite('hair', gender, hairStyle, hairFile.includes('/') ? hairFile.split('/')[1] : hairFile);
        if (!src && hairFile.includes('/')) {
            const dir = hairFile.split('/')[0];
            const file = hairFile.split('/')[1];
            const src2 = findSprite('hair', gender, dir, file);
            if (src2) {
                const dest = path.join(charDir, `hair_${file}`);
                if (copyFile(src2, dest)) {
                    sprites.hair = `sprites/characters/${characterId}/hair_${file}`;
                    break;
                }
            }
        } else if (src) {
            const dest = path.join(charDir, `hair_${path.basename(src)}`);
            if (copyFile(src, dest)) {
                sprites.hair = `sprites/characters/${characterId}/${path.basename(dest)}`;
                break;
            }
        }
    }
    
    return sprites;
}

/**
 * Fonction principale
 */
function main() {
    console.log('Organisation des sprites LPC...');
    
    // Créer la structure de dossiers
    const dirs = [
        path.join(SPRITES_DIR, 'characters'),
        path.join(SPRITES_DIR, 'body'),
        path.join(SPRITES_DIR, 'hair'),
        path.join(SPRITES_DIR, 'clothes')
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    
    // Organiser les sprites pour chaque personnage
    const allSprites = {};
    for (const [charId, config] of Object.entries(charactersConfig)) {
        console.log(`Organisation des sprites pour ${config.name}...`);
        const sprites = organizeCharacterSprites(charId, config);
        allSprites[charId] = sprites;
    }
    
    // Sauvegarder la configuration
    const configPath = path.join(SPRITES_DIR, 'characters-config.json');
    fs.writeFileSync(configPath, JSON.stringify(allSprites, null, 2));
    
    console.log('Organisation terminée !');
    console.log(`Configuration sauvegardée dans ${configPath}`);
}

if (require.main === module) {
    main();
}

module.exports = { organizeCharacterSprites, charactersConfig };


