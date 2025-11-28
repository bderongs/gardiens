/**
 * Système de rendu isométrique
 * Gère la conversion de coordonnées et le rendu des tuiles isométriques
 */

class IsometricRenderer {
    constructor() {
        // Dimensions des tuiles isométriques selon les specs Tiled de Sketch Town
        // Les images font 256x352 pixels, mais dans Tiled:
        // - tilewidth="232" : largeur de la tuile dans la grille isométrique
        // - tileheight="110" : hauteur de la tuile dans la grille isométrique
        // - tileoffset x="-12" y="6" : offset pour positionner correctement
        this.tileWidth = 232;   // Largeur de la tuile dans la grille (selon Tiled)
        this.tileHeight = 110;  // Hauteur de la tuile dans la grille (selon Tiled)
        this.tileDepth = 352;   // Hauteur totale de l'image (256x352)
        this.tileImageWidth = 256; // Largeur réelle de l'image
        this.tileOffsetX = -12; // Offset X pour positionnement correct
        this.tileOffsetY = 6;   // Offset Y pour positionnement correct
        
        // Facteur de conversion pour l'isométrie
        // Dans une vue isométrique, les coordonnées sont transformées
        this.isoAngle = Math.PI / 6; // 30 degrés
    }

    /**
     * Convertit des coordonnées cartésiennes (x, y) en coordonnées isométriques (screenX, screenY)
     * @param {number} x - Coordonnée X en grille
     * @param {number} y - Coordonnée Y en grille
     * @returns {Object} {screenX, screenY} - Coordonnées à l'écran
     */
    cartesianToIsometric(x, y) {
        // Formule isométrique selon les specs Tiled de Sketch Town
        // Chaque tuile se déplace de tileWidth/2 horizontalement et tileHeight/2 verticalement
        // Cela crée l'effet de losange isométrique connecté
        const screenX = (x - y) * (this.tileWidth / 2);
        const screenY = (x + y) * (this.tileHeight / 2);
        return { screenX, screenY };
    }

    /**
     * Convertit des coordonnées isométriques (screenX, screenY) en coordonnées cartésiennes
     * @param {number} screenX - Coordonnée X à l'écran
     * @param {number} screenY - Coordonnée Y à l'écran
     * @returns {Object} {x, y} - Coordonnées en grille
     */
    isometricToCartesian(screenX, screenY) {
        // Conversion inverse de cartesianToIsometric
        const x = (screenX / (this.tileWidth / 2) + screenY / (this.tileHeight / 2)) / 2;
        const y = (screenY / (this.tileHeight / 2) - screenX / (this.tileWidth / 2)) / 2;
        // Utiliser Math.round() pour avoir la position de grille la plus proche
        // (où les pieds du personnage touchent réellement le sol)
        return { x: Math.round(x), y: Math.round(y) };
    }

    /**
     * Dessine une tuile isométrique avec continuité parfaite
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {Image} tileImage - Image de la tuile
     * @param {number} gridX - Position X en grille
     * @param {number} gridY - Position Y en grille
     * @param {number} offsetX - Offset X à l'écran
     * @param {number} offsetY - Offset Y à l'écran
     */
    drawTile(ctx, tileImage, gridX, gridY, offsetX = 0, offsetY = 0) {
        const { screenX, screenY } = this.cartesianToIsometric(gridX, gridY);
        const x = screenX + offsetX;
        const y = screenY + offsetY;
        
        // Selon les specs Tiled de Sketch Town:
        // - Le point (x, y) est le centre de la base de la tuile dans la grille
        // - Il y a un offset de (-12, 6) à appliquer
        // - L'image fait 256x352 mais la tuile dans la grille fait 232x110
        // On dessine l'image complète (256x352) en appliquant l'offset
        const drawX = x - this.tileImageWidth / 2 + this.tileOffsetX;
        const drawY = y - this.tileDepth + this.tileOffsetY;
        
        // Dessiner l'image complète à sa taille réelle
        ctx.drawImage(
            tileImage,
            drawX,
            drawY,
            this.tileImageWidth,
            this.tileDepth
        );
    }

    /**
     * Dessine un personnage en position isométrique
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {Image} characterImage - Image du personnage
     * @param {number} gridX - Position X en grille
     * @param {number} gridY - Position Y en grille
     * @param {number} offsetX - Offset X à l'écran
     * @param {number} offsetY - Offset Y à l'écran
     * @param {number} scale - Échelle du personnage
     */
    drawCharacter(ctx, characterImage, gridX, gridY, offsetX = 0, offsetY = 0, scale = 1) {
        const { screenX, screenY } = this.cartesianToIsometric(gridX, gridY);
        const x = screenX + offsetX;
        const y = screenY + offsetY;
        
        // Dessiner le personnage centré et légèrement au-dessus du sol
        const charWidth = characterImage.width * scale;
        const charHeight = characterImage.height * scale;
        
        ctx.drawImage(
            characterImage,
            x - charWidth / 2,
            y - charHeight - this.tileHeight / 2, // Légèrement au-dessus du sol
            charWidth,
            charHeight
        );
    }

    /**
     * Calcule la position de la souris en coordonnées de grille isométrique
     * @param {number} mouseX - Position X de la souris
     * @param {number} mouseY - Position Y de la souris
     * @param {number} offsetX - Offset X du canvas
     * @param {number} offsetY - Offset Y du canvas
     * @returns {Object} {x, y} - Position en grille
     */
    getGridPositionFromMouse(mouseX, mouseY, offsetX = 0, offsetY = 0) {
        const relativeX = mouseX - offsetX;
        const relativeY = mouseY - offsetY;
        return this.isometricToCartesian(relativeX, relativeY);
    }
}

// Instance globale
const isometricRenderer = new IsometricRenderer();

