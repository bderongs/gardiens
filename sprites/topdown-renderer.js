/**
 * Système de rendu top-down (vue de dessus)
 * Gère le rendu des tuiles 16x16 pixels pour une vue de dessus
 */

class TopDownRenderer {
    constructor() {
        // Dimensions des tuiles Roguelike/RPG pack
        this.tileSize = 16; // 16x16 pixels
    }

    /**
     * Dessine une tuile à une position donnée
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {Image} tileImage - Image de la tuile
     * @param {number} gridX - Position X en grille
     * @param {number} gridY - Position Y en grille
     * @param {number} offsetX - Offset X à l'écran
     * @param {number} offsetY - Offset Y à l'écran
     * @param {number} scale - Échelle d'affichage (par défaut 1)
     */
    drawTile(ctx, tileImage, gridX, gridY, offsetX = 0, offsetY = 0, scale = 1, tileType = 'default') {
        // Calculer la position exacte - chaque tuile doit se toucher parfaitement
        const tilePixelSize = this.tileSize * scale;
        const x = Math.round(gridX * tilePixelSize + offsetX);
        const y = Math.round(gridY * tilePixelSize + offsetY);
        
        // Couleurs de base pour les placeholders
        const baseColors = {
            'grass': '#7CB342',        // Vert herbe
            'dirt': '#A0522D',         // Marron brique
            'floor': '#D3D3D3',        // Gris clair
            'floor_dark': '#757575',   // Gris foncé
            'floor_light': '#B0E0E6',  // Bleu clair avec points (carrelage extérieur)
            'stone': '#C0C0C0',        // Gris clair
            'wall': '#5D4037',         // Marron foncé
            'wall_corner': '#4E342E',  // Marron très foncé
            'wall_door': '#8D6E63',    // Marron moyen
            'castle_wall': '#424242',  // Gris anthracite
            'castle_floor': '#616161',  // Gris moyen
            'castle_door': '#757575',   // Gris
            'house_wall': '#8B4513',   // Marron bois (murs extérieurs en bois)
            'house_floor': '#E8E8E8',  // Gris très clair (sol de maison)
            'house_door': '#654321',   // Marron foncé (porte en bois)
            'tree': '#228B22',          // Vert forêt
            'default': '#8B7355'        // Marron par défaut
        };
        
        const baseColor = baseColors[tileType] || baseColors['default'];
        
        // Si une image est disponible, l'utiliser directement
        if (tileImage && tileImage.complete && tileImage.width > 0 && tileImage.height > 0) {
            try {
                ctx.drawImage(
                    tileImage,
                    0, 0, tileImage.width, tileImage.height, // Source
                    x, y, tilePixelSize, tilePixelSize // Destination
                );
                return; // Image chargée, on s'arrête là
            } catch (e) {
                // Si erreur, continuer avec le placeholder
            }
        }
        
        // Sinon, dessiner un placeholder avec un motif pour rendre plus joli
        this.drawPlaceholderTile(ctx, x, y, tilePixelSize, tileType, baseColor);
    }
    
    /**
     * Dessine un placeholder de tuile avec un motif pour rendre plus joli
     */
    drawPlaceholderTile(ctx, x, y, size, tileType, baseColor) {
        // Couleur de base
        ctx.fillStyle = baseColor;
        ctx.fillRect(x, y, size, size);
        
        // Ajouter des motifs selon le type pour rendre plus joli
        if (tileType === 'grass') {
            // Herbe : ajouter quelques points verts plus foncés
            // Utiliser une fonction pseudo-aléatoire déterministe basée sur la position
            // pour éviter que les points bougent à chaque frame
            ctx.fillStyle = '#558B2F';
            const seed = (x * 73856093) ^ (y * 19349663); // Hash simple pour générer des positions fixes
            for (let i = 0; i < 3; i++) {
                // Fonction pseudo-aléatoire simple basée sur le seed
                const pseudoRandom = ((seed + i) * 1103515245 + 12345) & 0x7fffffff;
                const px = x + (pseudoRandom % size);
                const py = y + ((pseudoRandom * 7) % size);
                ctx.fillRect(px, py, 2, 2);
            }
        } else if (tileType === 'house_floor') {
            // Sol de maison : ajouter un motif de carreaux
            ctx.strokeStyle = '#D0D0D0';
            ctx.lineWidth = 1;
            const gridSize = size / 4;
            for (let gx = 0; gx < 4; gx++) {
                for (let gy = 0; gy < 4; gy++) {
                    ctx.strokeRect(x + gx * gridSize, y + gy * gridSize, gridSize, gridSize);
                }
            }
        } else if (tileType === 'house_wall') {
            // Mur : ajouter des lignes horizontales pour simuler des planches
            ctx.strokeStyle = '#C4A882';
            ctx.lineWidth = 1;
            for (let i = 1; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(x, y + (size / 4) * i);
                ctx.lineTo(x + size, y + (size / 4) * i);
                ctx.stroke();
            }
        } else if (tileType === 'dirt') {
            // Terre : ajouter quelques points plus foncés
            // Utiliser une fonction pseudo-aléatoire déterministe pour éviter le mouvement
            ctx.fillStyle = '#8B4513';
            const seed = (x * 73856093) ^ (y * 19349663);
            for (let i = 0; i < 4; i++) {
                const pseudoRandom = ((seed + i) * 1103515245 + 12345) & 0x7fffffff;
                const px = x + (pseudoRandom % size);
                const py = y + ((pseudoRandom * 7) % size);
                ctx.fillRect(px, py, 1, 1);
            }
        } else if (tileType === 'floor_light') {
            // Carrelage extérieur : ajouter des points blancs pour simuler le motif
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            const dotSize = Math.max(1, size / 10);
            const spacing = size / 4;
            for (let dy = spacing; dy < size; dy += spacing) {
                for (let dx = spacing; dx < size; dx += spacing) {
                    ctx.beginPath();
                    ctx.arc(x + dx, y + dy, dotSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    /**
     * Convertit les coordonnées de la souris en coordonnées de grille
     * @param {number} mouseX - Position X de la souris
     * @param {number} mouseY - Position Y de la souris
     * @param {number} offsetX - Offset X du canvas
     * @param {number} offsetY - Offset Y du canvas
     * @param {number} scale - Échelle d'affichage
     * @param {number} actualTileSize - Taille réelle des tuiles (optionnel, par défaut tileSize)
     * @returns {Object} {x, y} - Position en grille
     */
    getGridPositionFromMouse(mouseX, mouseY, offsetX = 0, offsetY = 0, scale = 1, actualTileSize = null) {
        const tileSize = actualTileSize || this.tileSize;
        const relativeX = mouseX - offsetX;
        const relativeY = mouseY - offsetY;
        const gridX = Math.floor(relativeX / (tileSize * scale));
        const gridY = Math.floor(relativeY / (tileSize * scale));
        return { x: gridX, y: gridY };
    }
}

// Instance globale
const topDownRenderer = new TopDownRenderer();

