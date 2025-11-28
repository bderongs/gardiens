/**
 * Système de gestion de tilemap isométrique
 * Gère le chargement et le rendu des tuiles pour créer des environnements
 */

class Tilemap {
    constructor() {
        this.tiles = []; // Grille de tuiles [y][x] - contient l'objet (mur, bâtiment, etc.)
        this.ground = []; // Grille de sol [y][x] - contient toujours le sol (herbe, chemin)
        this.width = 0;
        this.height = 0;
        this.tileImages = {}; // Cache des images de tuiles
        this.spriteLoader = spriteLoader; // Utiliser le spriteLoader existant
    }

    /**
     * Initialise une tilemap vide
     * @param {number} width - Largeur en tuiles
     * @param {number} height - Hauteur en tuiles
     */
    initialize(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.ground = [];
        
        for (let y = 0; y < height; y++) {
            this.tiles[y] = [];
            this.ground[y] = [];
            for (let x = 0; x < width; x++) {
                this.tiles[y][x] = null; // null = pas d'objet
                this.ground[y][x] = null; // null = pas de sol défini
            }
        }
    }

    /**
     * Définit une tuile à une position donnée
     * @param {number} x - Position X en grille
     * @param {number} y - Position Y en grille
     * @param {string} tileType - Type de tuile (ex: 'floor', 'wall', 'door')
     * @param {string} tileVariant - Variante de la tuile (ex: '1', '2', 'corner')
     * @param {boolean} isGround - Si true, définit le sol (herbe, chemin). Si false, définit un objet (mur, bâtiment, etc.)
     */
    setTile(x, y, tileType, tileVariant = '1', isGround = false) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            const tileData = {
                type: tileType,
                variant: tileVariant,
                path: this.getTilePath(tileType, tileVariant)
            };
            
            if (isGround) {
                this.ground[y][x] = tileData;
            } else {
                // Types de sol : toujours définir dans ground
                const groundTypes = ['grass', 'dirt', 'floor', 'stone'];
                if (groundTypes.includes(tileType)) {
                    this.ground[y][x] = tileData;
                    this.tiles[y][x] = null; // Effacer l'objet si on met du sol
                } else {
                    this.tiles[y][x] = tileData;
                    // Si pas de sol défini, mettre de l'herbe par défaut
                    if (!this.ground[y][x]) {
                        this.ground[y][x] = {
                            type: 'grass',
                            variant: 'S',
                            path: this.getTilePath('grass', 'S')
                        };
                    }
                }
            }
        }
    }

    /**
     * Vérifie si une position est traversable (pas de mur, pas de bâtiment)
     * La position correspond à où les pieds du personnage touchent le sol
     * @param {number} x - Position X en grille (peut être un nombre décimal)
     * @param {number} y - Position Y en grille (peut être un nombre décimal)
     * @returns {boolean} true si la position est traversable
     */
    isWalkable(x, y) {
        // Arrondir pour obtenir la position de grille où les pieds du personnage touchent réellement le sol
        const gridX = Math.round(x);
        const gridY = Math.round(y);
        
        if (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) {
            return false; // Hors limites
        }
        
        // Vérifier la tuile à cette position de grille (où les pieds touchent le sol)
        const tile = this.tiles[gridY] && this.tiles[gridY][gridX];
        if (!tile) {
            return true; // Pas d'objet, donc traversable
        }
        
        // Types non traversables : murs, bâtiments, tours
        const nonWalkableTypes = ['castle', 'castleTower', 'building', 'buildingCorner', 'buildingBeige', 'buildingCornerBeige', 'wall', 'wallCorner'];
        return !nonWalkableTypes.includes(tile.type);
    }

    /**
     * Obtient le chemin d'une tuile
     * @param {string} tileType - Type de tuile
     * @param {string} tileVariant - Variante (peut être une direction N/S/E/W ou un numéro)
     * @returns {string} Chemin vers l'image
     */
    getTilePath(tileType, tileVariant = 'S') {
        // Mapping des types de tuiles vers les noms de fichiers réels
        const tileNameMap = {
            // Tuiles originales (Isometric Prototypes)
            'floor': 'floor',
            'wall': 'wall',
            'door': 'doorClosed',
            'doorway': 'doorway',
            'wallCorner': 'wallCorner',
            'block': 'block',
            'window': 'windowMiddle',
            // Tuiles Sketch Town Expansion
            'building': 'building_stack',
            'buildingCorner': 'building_stackCorner',
            'buildingBeige': 'building_stackBeige',
            'buildingCornerBeige': 'building_stackCornerBeige',
            'castle': 'castle_end',
            'castleTower': 'castle_towerBeigeBase', // Utiliser la base de tour beige
            'roof': 'roof_slantCorner',
            'roofBeige': 'roof_slantCornerBeige',
            'roofGreen': 'roof_slantCornerGreen',
            'roofBrown': 'roof_slantCornerBrown',
            'balconyStone': 'balcony_stone',
            'balconyWood': 'balcony_wood',
            // Sols et terrains
            'dirt': 'dirt_corner', // Utiliser dirt_corner comme base pour les chemins
            'grass': 'grass_block',
            'stone': 'stone',
            'path': 'path',
            // Arbres et végétation
            'tree': 'tree_pineLarge', // Utiliser les grands arbres pour plus de visibilité
            'treeOak': 'tree_oak',
            'bush': 'bush',
            // Autres éléments
            'fence': 'fence_wood'
        };
        
        const baseName = tileNameMap[tileType] || tileType;
        
        // Les tuiles Kenney utilisent des suffixes de direction (_N, _S, _E, _W)
        // Par défaut, on utilise _S (South) pour la vue de face
        // S'assurer que la direction est en majuscule
        const direction = (tileVariant && tileVariant.length === 1) ? tileVariant.toUpperCase() : 'S';
        const fileName = `${baseName}_${direction}.png`;
        
        const path = `assets/isometric/tiles/${fileName}`;
        return path;
    }

    /**
     * Charge une image de tuile
     * @param {string} path - Chemin vers l'image
     * @returns {Promise<Image>} Image chargée
     */
    async loadTileImage(path) {
        if (this.tileImages[path]) {
            return this.tileImages[path];
        }
        
        try {
            const img = await this.spriteLoader.loadImage(path);
            this.tileImages[path] = img;
            return img;
        } catch (error) {
            console.warn(`Impossible de charger la tuile ${path}, utilisation d'un placeholder`);
            return this.createPlaceholderTile();
        }
    }

    /**
     * Crée une tuile placeholder si l'image n'est pas disponible
     * @returns {Image} Image placeholder
     */
    createPlaceholderTile() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Dessiner un losange isométrique simple
        ctx.fillStyle = '#8B7355';
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        
        const centerX = 128;
        const centerY = 256;
        const width = 128;
        const height = 64;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - height);
        ctx.lineTo(centerX + width, centerY);
        ctx.lineTo(centerX, centerY + height);
        ctx.lineTo(centerX - width, centerY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }

    /**
     * Dessine la tilemap complète
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {number} offsetX - Offset X à l'écran
     * @param {number} offsetY - Offset Y à l'écran
     */
    async draw(ctx, offsetX = 0, offsetY = 0) {
        // Première passe : dessiner tous les sols (herbe, chemins)
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const groundTile = this.ground[y][x];
                if (groundTile) {
                    try {
                        const tileImage = await this.loadTileImage(groundTile.path);
                        if (tileImage && tileImage.complete) {
                            isometricRenderer.drawTile(ctx, tileImage, x, y, offsetX, offsetY);
                        }
                    } catch (err) {
                        console.warn(`Erreur lors du chargement de la tuile de sol ${groundTile.path}:`, err);
                    }
                }
            }
        }
        
        // Deuxième passe : dessiner les objets (murs, bâtiments, arbres, etc.)
        // Dessiner de bas en haut pour le bon ordre de profondeur
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                if (tile) {
                    try {
                        const tileImage = await this.loadTileImage(tile.path);
                        if (tileImage && tileImage.complete) {
                            isometricRenderer.drawTile(ctx, tileImage, x, y, offsetX, offsetY);
                        }
                    } catch (err) {
                        console.warn(`Erreur lors du chargement de la tuile ${tile.path}:`, err);
                    }
                }
            }
        }
    }

    /**
     * Crée un environnement de base (sol + quelques murs)
     * @param {number} width - Largeur
     * @param {number} height - Hauteur
     */
    createBasicEnvironment(width, height) {
        this.initialize(width, height);
        
        // Remplir avec un sol (utiliser la direction S pour la vue de face)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.setTile(x, y, 'floor', 'S');
            }
        }
        
        // Ajouter des murs sur les bords (avec les bonnes directions)
        for (let x = 0; x < width; x++) {
            this.setTile(x, 0, 'wall', 'N'); // Mur nord
            this.setTile(x, height - 1, 'wall', 'S'); // Mur sud
        }
        for (let y = 0; y < height; y++) {
            this.setTile(0, y, 'wall', 'W'); // Mur ouest
            this.setTile(width - 1, y, 'wall', 'E'); // Mur est
        }
        
        // Ajouter des coins de murs
        this.setTile(0, 0, 'wallCorner', 'N');
        this.setTile(width - 1, 0, 'wallCorner', 'E');
        this.setTile(0, height - 1, 'wallCorner', 'W');
        this.setTile(width - 1, height - 1, 'wallCorner', 'S');
        
        // Ajouter quelques portes
        if (width > 4 && height > 4) {
            this.setTile(Math.floor(width / 2), 0, 'door', 'N');
            this.setTile(Math.floor(width / 2), height - 1, 'door', 'S');
        }
    }

    /**
     * Crée un environnement d'école Foxfire avec herbe, chemins, château et arbres
     * @param {number} width - Largeur
     * @param {number} height - Hauteur
     */
    createFoxfireSchool(width, height) {
        this.initialize(width, height);
        
        // Remplir tout avec de l'herbe comme base (définir comme sol)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.setTile(x, y, 'grass', 'S', true); // true = c'est du sol
            }
        }
        
        // Créer une bordure de château fort autour de l'école
        this.createCastleBorder(width, height);
        
        // Créer un chemin principal qui traverse l'école
        this.createMainPath(width, height);
        
        // Bâtiment principal central (grande salle/château) - 4x4
        const centerX = Math.floor(width / 2) - 2;
        const centerY = Math.floor(height / 2) - 2;
        this.createBuilding(centerX, centerY, 4, 4, 'castle');
        
        // Ajouter des arbres de manière naturelle
        this.addNaturalTrees(width, height);
    }

    /**
     * Crée une bordure de château fort autour de l'école
     * Les murs sont placés par-dessus l'herbe (le sol est conservé)
     * @param {number} width - Largeur de la carte
     * @param {number} height - Hauteur de la carte
     */
    createCastleBorder(width, height) {
        // Murs de château sur les bords (l'herbe reste en dessous)
        for (let x = 1; x < width - 1; x++) {
            // Ne pas remplacer l'herbe, mais ajouter le mur par-dessus
            // On va utiliser setTile qui remplace, mais le rendu en deux passes
            // dessinera d'abord l'herbe, puis le mur
            this.setTile(x, 1, 'castle', 'N');
            this.setTile(x, height - 2, 'castle', 'S');
        }
        for (let y = 1; y < height - 1; y++) {
            this.setTile(1, y, 'castle', 'W');
            this.setTile(width - 2, y, 'castle', 'E');
        }
        
        // Tours de château aux coins
        this.setTile(1, 1, 'castleTower', 'N');
        this.setTile(width - 2, 1, 'castleTower', 'E');
        this.setTile(1, height - 2, 'castleTower', 'W');
        this.setTile(width - 2, height - 2, 'castleTower', 'S');
        
        // Portes dans les murs (une de chaque côté)
        if (width > 6) {
            this.setTile(Math.floor(width / 2), 1, 'door', 'N');
            this.setTile(Math.floor(width / 2), height - 2, 'door', 'S');
        }
        if (height > 6) {
            this.setTile(1, Math.floor(height / 2), 'door', 'W');
            this.setTile(width - 2, Math.floor(height / 2), 'door', 'E');
        }
    }

    /**
     * Crée un chemin principal qui traverse l'école
     * @param {number} width - Largeur de la carte
     * @param {number} height - Hauteur de la carte
     */
    createMainPath(width, height) {
        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);
        
        // Chemin horizontal principal (centre) - définir comme sol
        for (let x = 2; x < width - 2; x++) {
            if (x >= 0 && x < width && centerY >= 0 && centerY < height) {
                this.setTile(x, centerY, 'dirt', 'S', true); // true = c'est du sol
            }
        }
        
        // Chemin vertical principal (centre) - définir comme sol
        for (let y = 2; y < height - 2; y++) {
            if (centerX >= 0 && centerX < width && y >= 0 && y < height) {
                this.setTile(centerX, y, 'dirt', 'S', true); // true = c'est du sol
            }
        }
        
        // Chemins vers les bâtiments des coins - définir comme sol
        // Chemin vers bâtiment haut-gauche
        for (let x = 2; x <= 4; x++) {
            this.setTile(x, 3, 'dirt', 'S', true);
        }
        for (let y = 2; y <= 3; y++) {
            this.setTile(4, y, 'dirt', 'S', true);
        }
        
        // Chemin vers bâtiment haut-droite
        for (let x = width - 5; x < width - 2; x++) {
            this.setTile(x, 3, 'dirt', 'S', true);
        }
        for (let y = 2; y <= 3; y++) {
            this.setTile(width - 5, y, 'dirt', 'S', true);
        }
        
        // Chemin vers bâtiment bas-gauche
        for (let x = 2; x <= 4; x++) {
            this.setTile(x, height - 4, 'dirt', 'S', true);
        }
        for (let y = height - 4; y < height - 2; y++) {
            this.setTile(4, y, 'dirt', 'S', true);
        }
        
        // Chemin vers bâtiment bas-droite
        for (let x = width - 5; x < width - 2; x++) {
            this.setTile(x, height - 4, 'dirt', 'S', true);
        }
        for (let y = height - 4; y < height - 2; y++) {
            this.setTile(width - 5, y, 'dirt', 'S', true);
        }
    }


    /**
     * Ajoute des arbres de manière naturelle dans les zones d'herbe
     * @param {number} width - Largeur de la carte
     * @param {number} height - Hauteur de la carte
     */
    addNaturalTrees(width, height) {
        // Arbres autour des bâtiments et dans les zones d'herbe
        const treePositions = [
            // Coins extérieurs (zones d'herbe)
            [0, 0], [0, 1], [1, 0],
            [width - 1, 0], [width - 2, 0], [width - 1, 1],
            [0, height - 1], [1, height - 1], [0, height - 2],
            [width - 1, height - 1], [width - 2, height - 1], [width - 1, height - 2],
            // Zones d'herbe entre les bâtiments et les murs
            [3, 0], [4, 0], [5, 0],
            [width - 4, 0], [width - 5, 0], [width - 6, 0],
            [3, height - 1], [4, height - 1], [5, height - 1],
            [width - 4, height - 1], [width - 5, height - 1], [width - 6, height - 1],
            [0, 3], [0, 4], [0, 5],
            [width - 1, 3], [width - 1, 4], [width - 1, 5],
            [0, height - 4], [0, height - 5], [0, height - 6],
            [width - 1, height - 4], [width - 1, height - 5], [width - 1, height - 6],
            // Zones d'herbe au centre (entre les chemins)
            [3, 3], [4, 3], [3, 4],
            [width - 4, 3], [width - 5, 3], [width - 4, 4],
            [3, height - 4], [4, height - 4], [3, height - 5],
            [width - 4, height - 4], [width - 5, height - 4], [width - 4, height - 5],
        ];
        
        for (const [x, y] of treePositions) {
            if (x >= 0 && x < width && y >= 0 && y < height) {
                // Vérifier que c'est bien de l'herbe (pas un chemin, pas un bâtiment, pas un mur)
                const groundTile = this.ground[y] && this.ground[y][x];
                const objectTile = this.tiles[y] && this.tiles[y][x];
                // Placer un arbre seulement si le sol est de l'herbe et qu'il n'y a pas d'objet
                if (groundTile && groundTile.type === 'grass' && !objectTile) {
                    this.setTile(x, y, 'tree', 'S');
                }
            }
        }
    }

    /**
     * Ajoute des éléments décoratifs
     * @param {number} width - Largeur de la carte
     * @param {number} height - Hauteur de la carte
     */
    addDecorativeElements(width, height) {
        // Pour l'instant, on peut ajouter plus d'arbres ou d'autres éléments plus tard
        // Cette fonction peut être étendue avec des rochers, des buissons, etc.
    }

    /**
     * Crée un bâtiment avec des murs et une porte
     * @param {number} startX - Position X de départ
     * @param {number} startY - Position Y de départ
     * @param {number} buildingWidth - Largeur du bâtiment
     * @param {number} buildingHeight - Hauteur du bâtiment
     * @param {string} buildingType - Type de bâtiment ('building', 'buildingBeige', 'castle')
     */
    createBuilding(startX, startY, buildingWidth, buildingHeight, buildingType = 'building') {
        // Murs du bâtiment (nord et sud)
        for (let x = startX; x < startX + buildingWidth; x++) {
            if (x >= 0 && x < this.width) {
                if (startY >= 0 && startY < this.height) {
                    this.setTile(x, startY, buildingType, 'N');
                }
                if (startY + buildingHeight - 1 >= 0 && startY + buildingHeight - 1 < this.height) {
                    // Porte au centre du mur sud
                    if (x === startX + Math.floor(buildingWidth / 2)) {
                        this.setTile(x, startY + buildingHeight - 1, 'door', 'S');
                    } else {
                        this.setTile(x, startY + buildingHeight - 1, buildingType, 'S');
                    }
                }
            }
        }
        
        // Murs du bâtiment (ouest et est)
        for (let y = startY; y < startY + buildingHeight; y++) {
            if (y >= 0 && y < this.height) {
                if (startX >= 0 && startX < this.width) {
                    this.setTile(startX, y, buildingType, 'W');
                }
                if (startX + buildingWidth - 1 >= 0 && startX + buildingWidth - 1 < this.width) {
                    this.setTile(startX + buildingWidth - 1, y, buildingType, 'E');
                }
            }
        }
        
        // Coins du bâtiment
        const cornerType = buildingType === 'building' ? 'buildingCorner' : 
                          buildingType === 'buildingBeige' ? 'buildingCornerBeige' : 'buildingCorner';
        
        if (startX >= 0 && startX < this.width && startY >= 0 && startY < this.height) {
            this.setTile(startX, startY, cornerType, 'N');
        }
        if (startX + buildingWidth - 1 >= 0 && startX + buildingWidth - 1 < this.width && startY >= 0 && startY < this.height) {
            this.setTile(startX + buildingWidth - 1, startY, cornerType, 'E');
        }
        if (startX >= 0 && startX < this.width && startY + buildingHeight - 1 >= 0 && startY + buildingHeight - 1 < this.height) {
            this.setTile(startX, startY + buildingHeight - 1, cornerType, 'W');
        }
        if (startX + buildingWidth - 1 >= 0 && startX + buildingWidth - 1 < this.width && startY + buildingHeight - 1 >= 0 && startY + buildingHeight - 1 < this.height) {
            this.setTile(startX + buildingWidth - 1, startY + buildingHeight - 1, cornerType, 'S');
        }
    }


    /**
     * Crée une salle avec des murs
     * @param {number} startX - Position X de départ
     * @param {number} startY - Position Y de départ
     * @param {number} roomWidth - Largeur de la salle
     * @param {number} roomHeight - Hauteur de la salle
     */
    createRoom(startX, startY, roomWidth, roomHeight) {
        // Murs de la salle
        for (let x = startX; x < startX + roomWidth; x++) {
            if (x >= 0 && x < this.width) {
                if (startY >= 0 && startY < this.height) {
                    this.setTile(x, startY, 'wall', 'N');
                }
                if (startY + roomHeight - 1 >= 0 && startY + roomHeight - 1 < this.height) {
                    this.setTile(x, startY + roomHeight - 1, 'wall', 'S');
                }
            }
        }
        for (let y = startY; y < startY + roomHeight; y++) {
            if (y >= 0 && y < this.height) {
                if (startX >= 0 && startX < this.width) {
                    this.setTile(startX, y, 'wall', 'W');
                }
                if (startX + roomWidth - 1 >= 0 && startX + roomWidth - 1 < this.width) {
                    this.setTile(startX + roomWidth - 1, y, 'wall', 'E');
                }
            }
        }
        
        // Coins de la salle
        if (startX >= 0 && startX < this.width && startY >= 0 && startY < this.height) {
            this.setTile(startX, startY, 'wallCorner', 'N');
        }
        if (startX + roomWidth - 1 >= 0 && startX + roomWidth - 1 < this.width && startY >= 0 && startY < this.height) {
            this.setTile(startX + roomWidth - 1, startY, 'wallCorner', 'E');
        }
        if (startX >= 0 && startX < this.width && startY + roomHeight - 1 >= 0 && startY + roomHeight - 1 < this.height) {
            this.setTile(startX, startY + roomHeight - 1, 'wallCorner', 'W');
        }
        if (startX + roomWidth - 1 >= 0 && startX + roomWidth - 1 < this.width && startY + roomHeight - 1 >= 0 && startY + roomHeight - 1 < this.height) {
            this.setTile(startX + roomWidth - 1, startY + roomHeight - 1, 'wallCorner', 'S');
        }
    }
}

// Instance globale
const tilemap = new Tilemap();

