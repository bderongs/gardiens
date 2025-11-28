/**
 * Chargeur de cartes TMX (Tiled Map Editor)
 * Parse les fichiers .tmx et charge les tuiles depuis la spritesheet
 */

class TMXLoader {
    constructor() {
        this.spritesheet = null;
        this.spritesheetImage = null;
        this.tileWidth = 16;
        this.tileHeight = 16;
        this.spacing = 0; // Espacement entre les tuiles dans la spritesheet (0 par défaut, sera ajusté si nécessaire)
        this.tilesPerRow = 0; // Sera calculé après chargement de la spritesheet
    }

    /**
     * Charge la spritesheet
     * @param {string} spritesheetPath - Chemin vers la spritesheet
     * @returns {Promise<Image>}
     */
    async loadSpritesheet(spritesheetPath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.spritesheetImage = img;
                // Calculer le nombre de tuiles par ligne
                // Pour les spritesheets sans spacing, utiliser simplement width / tileWidth
                if (this.spacing > 0) {
                    this.tilesPerRow = Math.floor((img.width + this.spacing) / (this.tileWidth + this.spacing));
                } else {
                    this.tilesPerRow = Math.floor(img.width / this.tileWidth);
                }
                console.log(`Spritesheet chargée: ${img.width}x${img.height}, tuiles ${this.tileWidth}x${this.tileHeight}, ${this.tilesPerRow} tuiles par ligne`);
                resolve(img);
            };
            img.onerror = (err) => {
                console.error('Erreur lors du chargement de la spritesheet:', spritesheetPath, err);
                reject(err);
            };
            img.src = spritesheetPath;
        });
    }

    /**
     * Décode les données base64 et décompresse avec zlib
     * @param {string} base64Data - Données encodées en base64
     * @returns {Uint32Array} Données décompressées (GIDs)
     */
    decodeLayerData(base64Data) {
        // Convertir base64 en Uint8Array
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Décompresser avec pako
        try {
            if (typeof pako !== 'undefined') {
                const decompressed = pako.inflate(bytes);
                // Convertir en Uint32Array (little-endian)
                const gids = new Uint32Array(decompressed.length / 4);
                const dataView = new DataView(decompressed.buffer);
                for (let i = 0; i < gids.length; i++) {
                    gids[i] = dataView.getUint32(i * 4, true); // true = little-endian
                }
                return gids;
            } else {
                throw new Error('pako.js est requis pour décompresser les données TMX');
            }
        } catch (e) {
            console.error('Erreur lors de la décompression:', e);
            throw e;
        }
    }

    /**
     * Parse un fichier TMX
     * @param {string} tmxPath - Chemin vers le fichier .tmx
     * @returns {Promise<Object>} Carte parsée
     */
    async loadTMX(tmxPath) {
        console.log(`TMXLoader: Chargement de ${tmxPath}...`);
        try {
            const response = await fetch(tmxPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const text = await response.text();
            console.log(`TMXLoader: TMX chargé, ${text.length} caractères`);
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, 'text/xml');
            
            const map = xml.querySelector('map');
        const width = parseInt(map.getAttribute('width'));
        const height = parseInt(map.getAttribute('height'));
        const tileWidth = parseInt(map.getAttribute('tilewidth'));
        const tileHeight = parseInt(map.getAttribute('tileheight'));
        
        // Mettre à jour la taille des tuiles selon le TMX AVANT de charger la spritesheet
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        
        // Parser les propriétés de collision depuis le tileset
        const collisionMap = new Map(); // Map<gid, hasCollision>
        const tileset = map.querySelector('tileset');
        const firstGid = parseInt(tileset.getAttribute('firstgid')) || 1;
        
        // Parser toutes les tuiles avec leurs propriétés
        const tileElements = tileset.querySelectorAll('tile');
        for (const tileEl of tileElements) {
            const tileId = parseInt(tileEl.getAttribute('id'));
            const gid = firstGid + tileId; // GID réel dans la carte
            
            // Chercher la propriété "collides"
            const properties = tileEl.querySelector('properties');
            if (properties) {
                const collidesProp = properties.querySelector('property[name="collides"]');
                if (collidesProp && collidesProp.getAttribute('value') === 'true') {
                    collisionMap.set(gid, true);
                }
            }
        }
        
        // Charger la spritesheet (après avoir mis à jour tileWidth)
        const image = tileset.querySelector('image');
        let spritesheetPath = image.getAttribute('source');
        
        // Gérer les chemins relatifs (../../) dans le TMX
        if (spritesheetPath.startsWith('../../')) {
            // Chemin absolu depuis Downloads, essayer de le résoudre
            const fileName = spritesheetPath.split('/').pop();
            // Essayer plusieurs emplacements possibles
            const possiblePaths = [
                `assets/${fileName}`,
                `sprites/${fileName}`,
                spritesheetPath.replace('../../Downloads/', '~/Downloads/')
            ];
            // Pour l'instant, utiliser le nom du fichier directement
            spritesheetPath = fileName;
        }
        
        const basePath = tmxPath.substring(0, tmxPath.lastIndexOf('/'));
        const fullSpritesheetPath = basePath ? `${basePath}/${spritesheetPath}` : spritesheetPath;
        
        console.log(`TMXLoader: Chargement de la spritesheet: ${fullSpritesheetPath}`);
        await this.loadSpritesheet(fullSpritesheetPath);
        console.log(`TMXLoader: Spritesheet chargée: ${this.spritesheetImage ? this.spritesheetImage.width + 'x' + this.spritesheetImage.height : 'ERREUR'}`);
        
        // Parser les layers
        const layers = [];
        const layerElements = map.querySelectorAll('layer');
        
        for (const layerEl of layerElements) {
            const layerName = layerEl.getAttribute('name');
            const dataEl = layerEl.querySelector('data');
            const encoding = dataEl.getAttribute('encoding');
            const compression = dataEl.getAttribute('compression');
            
            let tileData = [];
            
            if (encoding === 'base64' && compression === 'zlib') {
                const base64Data = dataEl.textContent.trim();
                const gids = this.decodeLayerData(base64Data);
                // Les GIDs sont déjà dans le bon format
                tileData = Array.from(gids);
            } else if (encoding === 'csv') {
                // Format CSV simple
                const csv = dataEl.textContent.trim();
                tileData = csv.split(',').map(v => parseInt(v.trim()) || 0);
            }
            
            layers.push({
                name: layerName,
                data: tileData,
                width: width,
                height: height
            });
        }
        
            return {
                width: width,
                height: height,
                tileWidth: tileWidth,
                tileHeight: tileHeight,
                layers: layers,
                spritesheet: this.spritesheetImage,
                collisionMap: collisionMap, // Map des GIDs avec collision
                firstGid: firstGid
            };
        } catch (error) {
            console.error('Erreur lors du chargement du TMX:', error);
            throw error;
        }
    }

    /**
     * Extrait une tuile de la spritesheet
     * @param {number} tileIndex - Index de la tuile (GID - 1, car firstgid=1)
     * @param {CanvasRenderingContext2D} ctx - Contexte de destination
     * @param {number} destX - Position X de destination
     * @param {number} destY - Position Y de destination
     * @param {number} scale - Échelle
     */
    drawTile(tileIndex, ctx, destX, destY, scale = 1) {
        if (!this.spritesheetImage || tileIndex === 0) {
            return; // Pas de tuile ou tuile vide
        }
        
        // GID commence à 1, donc on soustrait 1 pour l'index
        const index = tileIndex - 1;
        
        // Calculer la position dans la spritesheet
        const col = index % this.tilesPerRow;
        const row = Math.floor(index / this.tilesPerRow);
        
        const srcX = col * (this.tileWidth + this.spacing);
        const srcY = row * (this.tileHeight + this.spacing);
        
        const destSize = this.tileWidth * scale;
        
        // Désactiver l'anti-aliasing pour un rendu pixel-perfect
        const oldSmoothing = ctx.imageSmoothingEnabled;
        ctx.imageSmoothingEnabled = false;
        
        ctx.drawImage(
            this.spritesheetImage,
            srcX, srcY, this.tileWidth, this.tileHeight,
            destX, destY, destSize, destSize
        );
        
        // Restaurer l'état précédent
        ctx.imageSmoothingEnabled = oldSmoothing;
    }
    
    /**
     * Vérifie si un GID a une collision
     * @param {number} gid - Global Tile ID
     * @param {Map} collisionMap - Map des collisions depuis le TMX
     * @returns {boolean} true si la tuile a une collision
     */
    hasCollision(gid, collisionMap) {
        if (!collisionMap) return false;
        return collisionMap.has(gid) && collisionMap.get(gid) === true;
    }
}

// Instance globale
const tmxLoader = new TMXLoader();

