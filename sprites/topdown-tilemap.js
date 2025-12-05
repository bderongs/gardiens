/**
 * Système de gestion de tilemap top-down (vue de dessus)
 * Gère le chargement et le rendu des tuiles 16x16 pour créer des environnements
 */

class TopDownTilemap {
    constructor() {
        this.tiles = []; // Grille de tuiles [y][x] - contient l'objet (mur, bâtiment, etc.)
        this.ground = []; // Grille de sol [y][x] - contient toujours le sol (herbe, chemin)
        this.width = 0;
        this.height = 0;
        this.tileImages = {}; // Cache des images de tuiles
        this.spriteLoader = spriteLoader; // Utiliser le spriteLoader existant
        this.tileSize = 16; // Taille des tuiles en pixels
        
        // Canvas offscreen pour pré-rendre la carte statique
        this.offscreenCanvas = null;
        this.offscreenCtx = null;
        this.isRendered = false; // Indique si la carte a été pré-rendue
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
                this.tiles[y][x] = null;
                this.ground[y][x] = null;
            }
        }
    }

    /**
     * Définit une tuile à une position donnée
     * @param {number} x - Position X en grille
     * @param {number} y - Position Y en grille
     * @param {string} tileType - Type de tuile
     * @param {string} tileVariant - Variante de la tuile
     * @param {boolean} isGround - Si true, définit le sol. Si false, définit un objet
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
                const groundTypes = ['grass', 'dirt', 'floor', 'stone', 'floor_dark', 'floor_light'];
                if (groundTypes.includes(tileType)) {
                    this.ground[y][x] = tileData;
                    this.tiles[y][x] = null;
                } else {
                    this.tiles[y][x] = tileData;
                    if (!this.ground[y][x]) {
                        this.ground[y][x] = {
                            type: 'grass',
                            variant: '1',
                            path: this.getTilePath('grass', '1')
                        };
                    }
                }
            }
        }
    }

    /**
     * Obtient le chemin d'une tuile
     * @param {string} tileType - Type de tuile
     * @param {string} tileVariant - Variante
     * @returns {string} Chemin vers l'image
     */
    getTilePath(tileType, tileVariant = '1') {
        // Mapping des types de tuiles vers les fichiers du pack Roguelike/RPG
        // Note: Les numéros de tuiles sont approximatifs et peuvent nécessiter des ajustements
        // selon la structure réelle de la spritesheet Kenney
        const tileNameMap = {
            // Sols
            'grass': 'Base/tile_0000.png',           // Herbe
            'dirt': 'Base/tile_0001.png',             // Terre
            'floor': 'Indoor/tile_0000.png',          // Sol intérieur clair
            'floor_dark': 'Indoor/tile_0001.png',     // Sol intérieur foncé
            'floor_light': 'Indoor/tile_0002.png',    // Sol intérieur très clair
            'stone': 'Base/tile_0002.png',            // Pierre
            // Murs extérieurs
            'wall': 'Base/tile_0045.png',              // Mur extérieur
            'wall_corner': 'Base/tile_0046.png',       // Coin de mur
            'wall_door': 'Base/tile_0047.png',        // Porte extérieure
            // Château (utiliser des tuiles Dungeon plus sombres)
            'castle_wall': 'Dungeon/tile_0000.png',   // Mur de château (pierre sombre)
            'castle_floor': 'Dungeon/tile_0001.png',  // Sol de château (pierre)
            'castle_door': 'Dungeon/tile_0002.png',   // Porte de château
            // Maison (utiliser des tuiles pour les murs extérieurs en bois)
            'house_wall': 'Base/tile_0045.png',       // Mur extérieur en bois (pas Indoor qui ressemble à des fenêtres)
            'house_floor': 'Indoor/tile_0000.png',    // Sol de maison (parquet/plancher)
            'house_door': 'Indoor/tile_0047.png',    // Porte intérieure
            // Arbres
            'tree': 'Base/tile_0020.png',             // Arbre
        };
        
        const baseName = tileNameMap[tileType] || `Base/tile_0000.png`;
        return `assets/roguelike-rpg/${baseName}`;
    }

    /**
     * Charge une image de tuile
     * @param {string} path - Chemin vers l'image
     * @param {string} tileType - Type de tuile pour le placeholder
     * @returns {Promise<Image>} Image chargée
     */
    async loadTileImage(path, tileType = 'default') {
        // Si on a déjà chargé cette image, la retourner
        if (this.tileImages[path]) {
            const cached = this.tileImages[path];
            // Si c'est une promesse, attendre qu'elle se résolve
            if (cached instanceof Promise) {
                return await cached;
            }
            return cached;
        }
        
        // Vérifier si on a déjà un placeholder pour ce type
        const placeholderKey = `placeholder_${tileType}`;
        if (this.tileImages[placeholderKey]) {
            const cached = this.tileImages[placeholderKey];
            if (cached instanceof Promise) {
                return await cached;
            }
            return cached;
        }
        
        try {
            const img = await this.spriteLoader.loadImage(path);
            // Vérifier que l'image est bien chargée
            if (img && img.complete && img.naturalWidth > 0) {
                this.tileImages[path] = img;
                return img;
            } else {
                throw new Error('Image non chargée');
            }
        } catch (error) {
            // Utiliser un placeholder coloré selon le type de tuile
            const placeholderPromise = this.createPlaceholderTile(tileType);
            this.tileImages[placeholderKey] = placeholderPromise;
            // Mettre aussi dans le cache avec le path pour éviter de réessayer
            this.tileImages[path] = placeholderPromise;
            const placeholder = await placeholderPromise;
            // Remplacer la promesse par l'image une fois chargée
            this.tileImages[placeholderKey] = placeholder;
            this.tileImages[path] = placeholder;
            return placeholder;
        }
    }

    /**
     * Crée une tuile placeholder avec une couleur spécifique selon le type
     * @param {string} tileType - Type de tuile pour déterminer la couleur
     * @returns {Image} Image placeholder
     */
    createPlaceholderTile(tileType = 'default') {
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
        const ctx = canvas.getContext('2d');
        
            // Couleurs selon le type de tuile (ajustées pour la maison)
            const colors = {
                'grass': '#7CB342',      // Vert herbe
                'dirt': '#A0522D',        // Marron brique (pour la cour)
                'floor': '#D3D3D3',       // Gris clair (sol intérieur)
                'floor_dark': '#757575',  // Gris foncé
                'floor_light': '#F5F5F5', // Blanc cassé (table)
                'stone': '#C0C0C0',       // Gris clair (statue)
                'wall': '#5D4037',        // Marron foncé
                'wall_corner': '#4E342E',  // Marron très foncé
                'wall_door': '#8D6E63',    // Marron moyen
                'castle_wall': '#424242',  // Gris anthracite
                'castle_floor': '#616161', // Gris moyen
                'castle_door': '#757575',  // Gris
                'house_wall': '#D2B48C',   // Beige/tan (murs de la maison)
                'house_floor': '#E8E8E8',  // Gris très clair (sol intérieur)
                'house_door': '#8B4513',   // Marron selle (porte)
                'tree': '#228B22',         // Vert forêt
                'default': '#8B7355'       // Marron par défaut
            };
        
        const color = colors[tileType] || colors['default'];
        
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, this.tileSize, this.tileSize);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, this.tileSize, this.tileSize);
        
        // Créer une image et attendre qu'elle soit chargée
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(img); // Résoudre même en cas d'erreur
            img.src = canvas.toDataURL();
        });
    }

    /**
     * Prépare le canvas offscreen et pré-rend la carte complète
     * @param {number} scale - Échelle d'affichage
     * @returns {Promise<void>}
     */
    async prerender(scale = 2) {
        if (this.isRendered && this.offscreenCanvas) {
            return; // Déjà pré-rendu
        }
        
        // Créer le canvas offscreen
        // Utiliser la taille des tuiles TMX si disponible, sinon la taille par défaut
        const actualTileSize = this.tmxTileWidth || this.tileSize;
        const tilePixelSize = actualTileSize * scale;
        const canvasWidth = this.width * tilePixelSize;
        const canvasHeight = this.height * tilePixelSize;
        
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = canvasWidth;
        this.offscreenCanvas.height = canvasHeight;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.offscreenCtx.imageSmoothingEnabled = false; // Pixel-perfect
        
        // Dessiner toute la carte sur le canvas offscreen (sans offset)
        await this.drawToCanvas(this.offscreenCtx, 0, 0, scale);
        
        this.isRendered = true;
    }
    
    /**
     * Dessine la tilemap sur un canvas (méthode interne pour pré-rendu)
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {number} offsetX - Offset X à l'écran
     * @param {number} offsetY - Offset Y à l'écran
     * @param {number} scale - Échelle d'affichage
     */
    async drawToCanvas(ctx, offsetX = 0, offsetY = 0, scale = 2) {
        // Première passe : dessiner tous les sols
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const groundTile = this.ground[y][x];
                if (groundTile) {
                    // Vérifier si c'est une tuile TMX
                    if (groundTile.path === 'tmx' && this.tmxSpritesheet && tmxLoader.spritesheetImage) {
                        // Utiliser directement la taille des tuiles TMX
                        const tilePixelSize = (this.tmxTileWidth || topDownRenderer.tileSize) * scale;
                        const screenX = x * tilePixelSize + offsetX;
                        const screenY = y * tilePixelSize + offsetY;
                        // Le scale pour drawTile doit être 1 car les tuiles sont déjà à la bonne taille
                        tmxLoader.drawTile(groundTile.gid, ctx, screenX, screenY, scale);
                    } else {
                        try {
                            const tileImage = await this.loadTileImage(groundTile.path, groundTile.type);
                            if (tileImage) {
                                topDownRenderer.drawTile(ctx, tileImage, x, y, offsetX, offsetY, scale, groundTile.type);
                            }
                        } catch (err) {
                            // En cas d'erreur, dessiner directement le placeholder
                            topDownRenderer.drawTile(ctx, null, x, y, offsetX, offsetY, scale, groundTile.type);
                        }
                    }
                } else {
                    // Si pas de sol défini, dessiner de l'herbe par défaut
                    topDownRenderer.drawTile(ctx, null, x, y, offsetX, offsetY, scale, 'grass');
                }
            }
        }
        
        // Deuxième passe : dessiner les objets
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                if (tile) {
                    // Vérifier si c'est une tuile TMX
                    if (tile.path === 'tmx' && this.tmxSpritesheet && tmxLoader.spritesheetImage) {
                        // Utiliser directement la taille des tuiles TMX
                        const tilePixelSize = (this.tmxTileWidth || topDownRenderer.tileSize) * scale;
                        const screenX = x * tilePixelSize + offsetX;
                        const screenY = y * tilePixelSize + offsetY;
                        // Le scale pour drawTile doit être 1 car les tuiles sont déjà à la bonne taille
                        tmxLoader.drawTile(tile.gid, ctx, screenX, screenY, scale);
                    } else {
                        try {
                            const tileImage = await this.loadTileImage(tile.path, tile.type);
                            if (tileImage) {
                                topDownRenderer.drawTile(ctx, tileImage, x, y, offsetX, offsetY, scale, tile.type);
                            }
                        } catch (err) {
                            // En cas d'erreur, dessiner directement le placeholder
                            topDownRenderer.drawTile(ctx, null, x, y, offsetX, offsetY, scale, tile.type);
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Dessine la tilemap complète (utilise le canvas offscreen si disponible)
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {number} offsetX - Offset X à l'écran
     * @param {number} offsetY - Offset Y à l'écran
     * @param {number} scale - Échelle d'affichage
     */
    async draw(ctx, offsetX = 0, offsetY = 0, scale = 2) {
        // Si la carte est pré-rendue, copier depuis le canvas offscreen
        if (this.isRendered && this.offscreenCanvas) {
            const tilePixelSize = this.tileSize * scale;
            
            // Calculer la zone visible à copier
            const sourceX = Math.max(0, -offsetX);
            const sourceY = Math.max(0, -offsetY);
            const sourceWidth = Math.min(ctx.canvas.width, this.offscreenCanvas.width - sourceX);
            const sourceHeight = Math.min(ctx.canvas.height, this.offscreenCanvas.height - sourceY);
            
            const destX = Math.max(0, offsetX);
            const destY = Math.max(0, offsetY);
            
            // Copier uniquement la partie visible
            if (sourceWidth > 0 && sourceHeight > 0) {
                ctx.drawImage(
                    this.offscreenCanvas,
                    sourceX, sourceY, sourceWidth, sourceHeight,
                    destX, destY, sourceWidth, sourceHeight
                );
            }
        } else {
            // Fallback : dessiner normalement (première fois ou si pré-rendu échoue)
            await this.drawToCanvas(ctx, offsetX, offsetY, scale);
        }
    }
    
    /**
     * Invalide le cache de pré-rendu (à appeler si la carte change)
     */
    invalidateCache() {
        this.isRendered = false;
        this.offscreenCanvas = null;
        this.offscreenCtx = null;
    }

    /**
     * Vérifie si une position est traversable
     * @param {number} x - Position X en grille
     * @param {number} y - Position Y en grille
     * @returns {boolean} true si la position est traversable
     */
    isWalkable(x, y) {
        const gridX = Math.round(x);
        const gridY = Math.round(y);
        
        if (gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) {
            return false;
        }
        
        // Vérifier d'abord les objets (murs, etc.)
        const tile = this.tiles[gridY] && this.tiles[gridY][gridX];
        if (tile) {
            // Si c'est une tuile TMX, vérifier les propriétés de collision
            if (tile.path === 'tmx' && tile.gid && this.tmxCollisionMap) {
                if (tmxLoader.hasCollision(tile.gid, this.tmxCollisionMap)) {
                    return false; // Collision détectée
                }
            } else {
                // Sinon, utiliser la liste des types non traversables
                const nonWalkableTypes = ['wall', 'wall_corner', 'castle_wall', 'house_wall', 'tree'];
                if (nonWalkableTypes.includes(tile.type)) {
                    return false; // Type non traversable
                }
            }
        }
        
        // Vérifier aussi les tuiles de sol (ground) pour les collisions (ex: eau)
        const groundTile = this.ground[gridY] && this.ground[gridY][gridX];
        if (groundTile) {
            // Si c'est une tuile TMX de sol avec collision (ex: eau), elle n'est pas traversable
            if (groundTile.path === 'tmx' && groundTile.gid && this.tmxCollisionMap) {
                if (tmxLoader.hasCollision(groundTile.gid, this.tmxCollisionMap)) {
                    return false; // Sol avec collision (eau, etc.)
                }
            }
        }
        
        // Si aucune collision détectée, la position est traversable
        return true;
    }

    /**
     * Charge une carte depuis un fichier TMX
     * @param {string} tmxPath - Chemin vers le fichier .tmx
     * @param {number} mapWidth - Largeur de la carte (si différente du TMX)
     * @param {number} mapHeight - Hauteur de la carte (si différente du TMX)
     */
    async loadFromTMX(tmxPath, mapWidth = null, mapHeight = null) {
        try {
            // Utiliser l'instance globale tmxLoader
            if (typeof tmxLoader === 'undefined') {
                throw new Error('tmxLoader n\'est pas défini. Assurez-vous que tmx-loader.js est chargé avant topdown-tilemap.js');
            }
            const mapData = await tmxLoader.loadTMX(tmxPath);
            
            // Utiliser les dimensions du TMX ou celles fournies
            const width = mapWidth || mapData.width;
            const height = mapHeight || mapData.height;
            
            this.initialize(width, height);
            
            // Charger les layers dans l'ordre
            // Ground -> Décor (ou Floor -> Objects selon le fichier)
            for (const layer of mapData.layers) {
                const layerName = layer.name.toLowerCase();
                const isGroundLayer = layerName === 'floor' || layerName === 'ground' || layerName === 'ground/terrain' || layerName === 'ground overlay' || layerName === 'sol';
                console.log(`📋 Layer "${layer.name}" (${layerName}) → ${isGroundLayer ? 'SOL' : 'OBJET'}`);
                
                for (let y = 0; y < layer.height && y < height; y++) {
                    for (let x = 0; x < layer.width && x < width; x++) {
                        const index = y * layer.width + x;
                        const gid = layer.data[index] || 0;
                        
                        if (gid === 0) continue; // Tuile vide
                        
                        // Déterminer si c'est un sol ou un objet selon le layer
                        // "Ground" = sol, "Décor" ou autres = objets
                        if (isGroundLayer) {
                            // C'est un sol
                            this.ground[y][x] = {
                                type: 'tmx_tile',
                                variant: gid.toString(),
                                path: 'tmx', // Marqueur spécial pour TMX
                                gid: gid
                            };
                        } else {
                            // C'est un objet (décor, murs, etc.)
                            // Vérifier si cette tuile a une collision
                            const hasCollision = tmxLoader.hasCollision(gid, mapData.collisionMap);
                            
                            this.tiles[y][x] = {
                                type: hasCollision ? 'tmx_wall' : 'tmx_tile', // Marquer comme mur si collision
                                variant: gid.toString(),
                                path: 'tmx', // Marqueur spécial pour TMX
                                gid: gid
                            };
                        }
                    }
                }
            }
            
            // Stocker la référence à la spritesheet et les données de collision
            this.tmxSpritesheet = mapData.spritesheet;
            this.tmxTileWidth = mapData.tileWidth;
            this.tmxTileHeight = mapData.tileHeight;
            this.tmxCollisionMap = mapData.collisionMap || new Map();
            this.tmxFirstGid = mapData.firstGid || 1;
            
            // Mettre à jour la taille des tuiles dans le renderer si nécessaire
            if (mapData.tileWidth !== topDownRenderer.tileSize) {
                // Adapter le scale pour que les tuiles 32x32 s'affichent correctement
                // On garde le tileSize à 16 dans le renderer mais on ajuste le scale
                console.log(`Carte avec tuiles ${mapData.tileWidth}x${mapData.tileHeight}, adaptation nécessaire`);
            }
            
            return true;
        } catch (error) {
            console.error('Erreur lors du chargement du TMX:', error);
            // Fallback vers la génération manuelle
            this.createCastleMap(mapWidth || 30, mapHeight || 30);
            return false;
        }
    }

    /**
     * Crée une carte avec une maison simple (fallback si TMX ne charge pas)
     * @param {number} width - Largeur
     * @param {number} height - Hauteur
     */
    createCastleMap(width, height) {
        this.initialize(width, height);
        
        // Remplir avec un sol de carrelage (fond bleu clair avec points dans l'image)
        // Utiliser floor_light pour un carrelage clair
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                this.setTile(x, y, 'floor_light', '1', true);
            }
        }
        
        // Créer le manoir exactement comme dans l'image
        // Le manoir fait environ 16 tuiles de large et 10 tuiles de haut
        const mansionX = Math.floor(width / 2) - 8;
        const mansionY = Math.floor(height / 2) - 5;
        const mansionW = 16;
        const mansionH = 10;
        
        // Utiliser createMansion pour créer la structure détaillée
        this.createMansion(mansionX, mansionY, mansionW, mansionH);
        
        // Ajouter les arbres autour du manoir (comme dans l'image)
        // 2 arbres à gauche (alignés verticalement)
        const leftTrees = [
            [mansionX - 2, mansionY + 2],
            [mansionX - 2, mansionY + 5],
        ];
        // 2 arbres à droite (alignés verticalement)
        const rightTrees = [
            [mansionX + mansionW + 1, mansionY + 2],
            [mansionX + mansionW + 1, mansionY + 5],
        ];
        // 2 arbres en bas (de chaque côté de l'entrée)
        const bottomTrees = [
            [mansionX + 2, mansionY - 2],
            [mansionX + mansionW - 3, mansionY - 2],
        ];
        
        const allTrees = [...leftTrees, ...rightTrees, ...bottomTrees];
        for (const [x, y] of allTrees) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.setTile(x, y, 'tree', '1');
            }
        }
    }

    /**
     * Crée un château
     * @param {number} startX - Position X de départ
     * @param {number} startY - Position Y de départ
     * @param {number} width - Largeur du château
     * @param {number} height - Hauteur du château
     */
    createCastle(startX, startY, width, height) {
        // Sol du château
        for (let y = startY + 1; y < startY + height - 1; y++) {
            for (let x = startX + 1; x < startX + width - 1; x++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    this.setTile(x, y, 'castle_floor', '1', true);
                }
            }
        }
        
        // Murs du château
        for (let x = startX; x < startX + width; x++) {
            if (x >= 0 && x < this.width) {
                if (startY >= 0 && startY < this.height) {
                    this.setTile(x, startY, 'castle_wall', '1');
                }
                if (startY + height - 1 >= 0 && startY + height - 1 < this.height) {
                    this.setTile(x, startY + height - 1, 'castle_wall', '1');
                }
            }
        }
        for (let y = startY; y < startY + height; y++) {
            if (y >= 0 && y < this.height) {
                if (startX >= 0 && startX < this.width) {
                    this.setTile(startX, y, 'castle_wall', '1');
                }
                if (startX + width - 1 >= 0 && startX + width - 1 < this.width) {
                    this.setTile(startX + width - 1, y, 'castle_wall', '1');
                }
            }
        }
        
        // Porte du château (au centre du mur sud)
        const doorX = startX + Math.floor(width / 2);
        const doorY = startY + height - 1;
        if (doorX >= 0 && doorX < this.width && doorY >= 0 && doorY < this.height) {
            this.setTile(doorX, doorY, 'castle_door', '1');
        }
    }

    /**
     * Crée une maison
     * @param {number} startX - Position X de départ
     * @param {number} startY - Position Y de départ
     * @param {number} width - Largeur de la maison
     * @param {number} height - Hauteur de la maison
     */
    createHouse(startX, startY, width, height) {
        // Sol de la maison
        for (let y = startY + 1; y < startY + height - 1; y++) {
            for (let x = startX + 1; x < startX + width - 1; x++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    this.setTile(x, y, 'house_floor', '1', true);
                }
            }
        }
        
        // Murs de la maison
        for (let x = startX; x < startX + width; x++) {
            if (x >= 0 && x < this.width) {
                if (startY >= 0 && startY < this.height) {
                    this.setTile(x, startY, 'house_wall', '1');
                }
                if (startY + height - 1 >= 0 && startY + height - 1 < this.height) {
                    this.setTile(x, startY + height - 1, 'house_wall', '1');
                }
            }
        }
        for (let y = startY; y < startY + height; y++) {
            if (y >= 0 && y < this.height) {
                if (startX >= 0 && startX < this.width) {
                    this.setTile(startX, y, 'house_wall', '1');
                }
                if (startX + width - 1 >= 0 && startX + width - 1 < this.width) {
                    this.setTile(startX + width - 1, y, 'house_wall', '1');
                }
            }
        }
        
        // Porte de la maison (au centre du mur sud)
        const doorX = startX + Math.floor(width / 2);
        const doorY = startY + height - 1;
        if (doorX >= 0 && doorX < this.width && doorY >= 0 && doorY < this.height) {
            this.setTile(doorX, doorY, 'house_door', '1');
        }
    }

    /**
     * Crée la grande maison avec cour intérieure (basée sur l'image)
     * Structure en H avec cour centrale, aile gauche (chambre) et aile droite (cuisine)
     * Reproduit exactement l'image fournie
     * @param {number} startX - Position X de départ
     * @param {number} startY - Position Y de départ
     * @param {number} width - Largeur totale
     * @param {number} height - Hauteur totale
     */
    createMansion(startX, startY, width, height) {
        // Structure en H : deux ailes latérales avec une cour centrale
        // Basé sur l'image : maison de 16x10 tuiles environ
        
        // Dimensions ajustées pour correspondre exactement à l'image
        const buildingWidth = width;
        const buildingHeight = height;
        
        // Aile gauche (chambre) - 5 tuiles de large, 6 tuiles de haut
        const leftWingX = startX;
        const leftWingY = startY + 2;
        const leftWingW = 5;
        const leftWingH = 6;
        
        // Aile droite (cuisine) - 5 tuiles de large, 6 tuiles de haut
        const rightWingX = startX + 11;
        const rightWingY = startY + 2;
        const rightWingW = 5;
        const rightWingH = 6;
        
        // Cour centrale - 6 tuiles de large, 6 tuiles de haut
        const courtyardX = startX + 5;
        const courtyardY = startY + 2;
        const courtyardW = 6;
        const courtyardH = 6;
        
        // Partie basse (entrée avec escaliers) - toute la largeur, 2 tuiles de haut
        const entranceX = startX;
        const entranceY = startY;
        const entranceW = buildingWidth;
        const entranceH = 2;
        
        // Partie haute (mur avec statue) - toute la largeur, 2 tuiles de haut
        const topWallX = startX;
        const topWallY = startY + 8;
        const topWallW = buildingWidth;
        const topWallH = 2;
        
        // Sol de l'aile gauche (chambre) - gris clair
        for (let y = leftWingY; y < leftWingY + leftWingH; y++) {
            for (let x = leftWingX; x < leftWingX + leftWingW; x++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    this.setTile(x, y, 'house_floor', '1', true);
                }
            }
        }
        
        // Sol de l'aile droite (cuisine) - gris clair
        for (let y = rightWingY; y < rightWingY + rightWingH; y++) {
            for (let x = rightWingX; x < rightWingX + rightWingW; x++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    this.setTile(x, y, 'house_floor', '1', true);
                }
            }
        }
        
        // Cour centrale - briques rouge-brun (utiliser dirt pour l'effet)
        for (let y = courtyardY; y < courtyardY + courtyardH; y++) {
            for (let x = courtyardX; x < courtyardX + courtyardW; x++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    this.setTile(x, y, 'dirt', '1', true);
                }
            }
        }
        
        // Sol de l'entrée - gris clair (escaliers)
        // Dans l'image, les escaliers sont visibles en bas
        for (let y = entranceY; y < entranceY + entranceH; y++) {
            for (let x = entranceX; x < entranceX + entranceW; x++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    this.setTile(x, y, 'house_floor', '1', true);
                }
            }
        }
        
        // Murs extérieurs
        // Mur bas (entrée) - avec porte au centre et fenêtres de chaque côté
        const mainDoorX = startX + Math.floor(width / 2);
        for (let x = startX; x < startX + width; x++) {
            if (x >= 0 && x < this.width && entranceY >= 0 && entranceY < this.height) {
                // Porte au centre, fenêtres de chaque côté (représentées par des murs pour l'instant)
                // Les fenêtres seront visibles grâce aux tuiles de mur
                if (x === mainDoorX) {
                    // Porte principale (laisser ouverte pour l'instant, sera gérée plus bas)
                    continue;
                } else {
                    this.setTile(x, entranceY, 'house_wall', '1');
                }
            }
        }
        
        // Mur haut
        for (let x = startX; x < startX + width; x++) {
            if (x >= 0 && x < this.width && topWallY >= 0 && topWallY < this.height) {
                this.setTile(x, topWallY, 'house_wall', '1');
            }
        }
        
        // Mur gauche
        for (let y = startY; y < startY + height; y++) {
            if (startX >= 0 && startX < this.width && y >= 0 && y < this.height) {
                this.setTile(startX, y, 'house_wall', '1');
            }
        }
        
        // Mur droit
        for (let y = startY; y < startY + height; y++) {
            if (startX + width - 1 >= 0 && startX + width - 1 < this.width && y >= 0 && y < this.height) {
                this.setTile(startX + width - 1, y, 'house_wall', '1');
            }
        }
        
        // Murs intérieurs séparant les ailes de la cour
        // Mur entre aile gauche et cour (avec ouverture au centre)
        for (let y = courtyardY; y < courtyardY + courtyardH; y++) {
            const leftDoorY = courtyardY + Math.floor(courtyardH / 2);
            // Laisser une ouverture (arche) au centre, pas de mur
            if (y !== leftDoorY && courtyardX >= 0 && courtyardX < this.width && y >= 0 && y < this.height) {
                this.setTile(courtyardX, y, 'house_wall', '1');
            }
        }
        
        // Mur entre aile droite et cour (avec ouverture au centre)
        for (let y = courtyardY; y < courtyardY + courtyardH; y++) {
            const rightDoorY = courtyardY + Math.floor(courtyardH / 2);
            // Laisser une ouverture (arche) au centre, pas de mur
            if (y !== rightDoorY && courtyardX + courtyardW >= 0 && courtyardX + courtyardW < this.width && y >= 0 && y < this.height) {
                this.setTile(courtyardX + courtyardW, y, 'house_wall', '1');
            }
        }
        
        // Porte d'entrée principale (au centre du mur bas) - porte arquée
        // Dans l'image, c'est une petite porte arquée sur le palier des escaliers
        if (mainDoorX >= 0 && mainDoorX < this.width && entranceY >= 0 && entranceY < this.height) {
            this.setTile(mainDoorX, entranceY, 'house_door', '1');
        }
        
        // Éléments décoratifs dans la cour
        // Pelouse verte au centre de la cour (utiliser grass)
        const lawnX = courtyardX + Math.floor(courtyardW / 2) - 1;
        const lawnY = courtyardY + Math.floor(courtyardH / 2) - 1;
        for (let y = lawnY; y <= lawnY + 2; y++) {
            for (let x = lawnX; x <= lawnX + 2; x++) {
                if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                    this.setTile(x, y, 'grass', '1', true);
                }
            }
        }
        
        // Table au centre de la pelouse (utiliser floor_light)
        const tableX = courtyardX + Math.floor(courtyardW / 2);
        const tableY = courtyardY + Math.floor(courtyardH / 2);
        if (tableX >= 0 && tableX < this.width && tableY >= 0 && tableY < this.height) {
            this.setTile(tableX, tableY, 'floor_light', '1');
        }
        
        // Chaises autour de la table (6 chaises : 3 de chaque côté)
        // Dans l'image, les chaises sont alignées sur les côtés longs de la table
        const chairPositions = [
            [tableX - 1, tableY - 1], // Haut-gauche
            [tableX - 1, tableY],     // Gauche
            [tableX - 1, tableY + 1], // Bas-gauche
            [tableX + 1, tableY - 1], // Haut-droite
            [tableX + 1, tableY],     // Droite
            [tableX + 1, tableY + 1], // Bas-droite
        ];
        for (const [x, y] of chairPositions) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                this.setTile(x, y, 'floor_dark', '1');
            }
        }
        
        // Statue en haut de la cour (utiliser stone)
        const statueX = courtyardX + Math.floor(courtyardW / 2);
        const statueY = topWallY; // En haut, dans le mur
        if (statueX >= 0 && statueX < this.width && statueY >= 0 && statueY < this.height) {
            this.setTile(statueX, statueY, 'stone', '1');
        }
        
        // Détails dans l'aile gauche (chambre)
        // Lits en bas de la chambre
        const bedY = leftWingY + leftWingH - 2;
        for (let x = leftWingX + 1; x < leftWingX + 3; x++) {
            if (x >= 0 && x < this.width && bedY >= 0 && bedY < this.height) {
                this.setTile(x, bedY, 'floor_dark', '1');
            }
        }
        for (let x = leftWingX + 1; x < leftWingX + 3; x++) {
            if (x >= 0 && x < this.width && bedY + 1 >= 0 && bedY + 1 < this.height) {
                this.setTile(x, bedY + 1, 'floor_dark', '1');
            }
        }
        
        // Armoire en haut de la chambre (au centre)
        const wardrobeX = leftWingX + Math.floor(leftWingW / 2);
        const wardrobeY = leftWingY;
        if (wardrobeX >= 0 && wardrobeX < this.width && wardrobeY >= 0 && wardrobeY < this.height) {
            this.setTile(wardrobeX, wardrobeY, 'floor_dark', '1');
        }
        
        // Commode avec miroir à droite de l'armoire
        const dresserX = leftWingX + leftWingW - 2;
        const dresserY = leftWingY;
        if (dresserX >= 0 && dresserX < this.width && dresserY >= 0 && dresserY < this.height) {
            this.setTile(dresserX, dresserY, 'floor_light', '1');
        }
        
        // Détails dans l'aile droite (cuisine)
        // Comptoir en haut (sur toute la largeur sauf les bords)
        for (let x = rightWingX + 1; x < rightWingX + rightWingW - 1; x++) {
            if (x >= 0 && x < this.width && rightWingY >= 0 && rightWingY < this.height) {
                this.setTile(x, rightWingY, 'floor_dark', '1');
            }
        }
        
        // Horloge en haut à gauche de la cuisine
        const clockX = rightWingX + 1;
        const clockY = rightWingY;
        if (clockX >= 0 && clockX < this.width && clockY >= 0 && clockY < this.height) {
            this.setTile(clockX, clockY, 'floor_light', '1');
        }
        
        // Table au centre de la cuisine (bleue dans l'image, utiliser floor_light)
        const kitchenTableX = rightWingX + Math.floor(rightWingW / 2);
        const kitchenTableY = rightWingY + Math.floor(rightWingH / 2);
        if (kitchenTableX >= 0 && kitchenTableX < this.width && kitchenTableY >= 0 && kitchenTableY < this.height) {
            this.setTile(kitchenTableX, kitchenTableY, 'floor_light', '1');
        }
        
        // Barils en bas de la cuisine (2 barils)
        const barrelY = rightWingY + rightWingH - 2;
        const barrel1X = rightWingX + 1;
        const barrel2X = rightWingX + 2;
        if (barrel1X >= 0 && barrel1X < this.width && barrelY >= 0 && barrelY < this.height) {
            this.setTile(barrel1X, barrelY, 'floor_dark', '1');
        }
        if (barrel2X >= 0 && barrel2X < this.width && barrelY >= 0 && barrelY < this.height) {
            this.setTile(barrel2X, barrelY, 'floor_dark', '1');
        }
        
        // Sac à droite de la table
        const sackX = rightWingX + rightWingW - 2;
        const sackY = kitchenTableY;
        if (sackX >= 0 && sackX < this.width && sackY >= 0 && sackY < this.height) {
            this.setTile(sackX, sackY, 'floor_dark', '1');
        }
    }

    /**
     * Ajoute des arbres autour de la maison
     */
    addTreesAroundMansion(mapWidth, mapHeight) {
        // Arbres autour de la maison (éviter de les placer sur la maison)
        const mansionCenterX = Math.floor(mapWidth / 2);
        const mansionCenterY = Math.floor(mapHeight / 2);
        const mansionSize = 16;
        
        const treePositions = [];
        
        // Arbres en bas
        for (let x = 2; x < mapWidth - 2; x++) {
            if (Math.abs(x - mansionCenterX) > mansionSize / 2 + 2) {
                treePositions.push([x, mapHeight - 3]);
                treePositions.push([x, mapHeight - 4]);
            }
        }
        
        // Arbres en haut
        for (let x = 2; x < mapWidth - 2; x++) {
            if (Math.abs(x - mansionCenterX) > mansionSize / 2 + 2) {
                treePositions.push([x, 2]);
                treePositions.push([x, 3]);
            }
        }
        
        // Arbres à gauche
        for (let y = 2; y < mapHeight - 2; y++) {
            if (Math.abs(y - mansionCenterY) > mansionSize / 2 + 2) {
                treePositions.push([2, y]);
                treePositions.push([3, y]);
            }
        }
        
        // Arbres à droite
        for (let y = 2; y < mapHeight - 2; y++) {
            if (Math.abs(y - mansionCenterY) > mansionSize / 2 + 2) {
                treePositions.push([mapWidth - 3, y]);
                treePositions.push([mapWidth - 4, y]);
            }
        }
        
        for (const [x, y] of treePositions) {
            if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
                const groundTile = this.ground[y] && this.ground[y][x];
                const objectTile = this.tiles[y] && this.tiles[y][x];
                if (groundTile && groundTile.type === 'grass' && !objectTile) {
                    this.setTile(x, y, 'tree', '1');
                }
            }
        }
    }
}

// Instance globale
const topDownTilemap = new TopDownTilemap();

