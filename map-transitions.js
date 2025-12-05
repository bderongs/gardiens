/**
 * Système de gestion des transitions entre cartes
 * Permet de passer du village aux maisons et vice versa
 */

/**
 * Charge les points d'entrée (portes) depuis une carte TMX
 * @param {string} mapFileName - Nom du fichier TMX
 * @returns {Promise<Array>} Liste des points d'entrée avec leur ID et position
 */
async function loadEntryPointsFromTMX(mapFileName) {
    const entryPoints = [];
    
    try {
        const response = await fetch(mapFileName);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const objectGroups = xmlDoc.querySelectorAll('objectgroup');
        
        for (const group of objectGroups) {
            const groupName = group.getAttribute('name') || '';
            
            // Chercher la couche "Entrees", "Portes", "EntryPoints", "Doors" ou "Sorties"
            if (groupName.toLowerCase().includes('entree') || 
                groupName.toLowerCase().includes('porte') ||
                groupName.toLowerCase().includes('entry') ||
                groupName.toLowerCase().includes('door') ||
                groupName.toLowerCase().includes('sortie') ||
                groupName.toLowerCase().includes('exit')) {
                
                const objects = group.querySelectorAll('object');
                
                for (const obj of objects) {
                    const objX = parseFloat(obj.getAttribute('x')) || 0;
                    const objY = parseFloat(obj.getAttribute('y')) || 0;
                    const objId = obj.getAttribute('id') || obj.getAttribute('name') || null;
                    
                    // Lire les propriétés pour obtenir un ID personnalisé si défini
                    const properties = {};
                    const propertyElements = obj.querySelectorAll('property');
                    
                    for (const prop of propertyElements) {
                        const name = prop.getAttribute('name');
                        const value = prop.getAttribute('value');
                        properties[name] = value;
                    }
                    
                    // Utiliser doorId depuis les propriétés, sinon l'ID de l'objet, sinon null
                    const doorId = properties.doorId || objId || null;
                    
                    // Calculer la position en tuiles (centre de l'objet)
                    const tileSize = 32; // Par défaut, sera ajusté selon la carte
                    const gridX = Math.floor((objX + parseFloat(obj.getAttribute('width') || 32) / 2) / tileSize);
                    const gridY = Math.floor((objY + parseFloat(obj.getAttribute('height') || 32) / 2) / tileSize);
                    
                    entryPoints.push({
                        id: doorId,
                        x: gridX,
                        y: gridY,
                        pixelX: objX + parseFloat(obj.getAttribute('width') || 32) / 2,
                        pixelY: objY + parseFloat(obj.getAttribute('height') || 32) / 2
                    });
                }
            }
        }
        
        console.log(`✅ ${entryPoints.length} point(s) d'entrée trouvé(s) dans ${mapFileName}`);
    } catch (error) {
        console.error('Erreur lors du chargement des points d\'entrée:', error);
    }
    
    return entryPoints;
}

/**
 * Charge les zones de transition depuis un fichier TMX
 * @param {TopDownTilemap} tilemap - La tilemap chargée
 * @returns {Array} Liste des zones de transition
 */
async function loadTransitionsFromTMX(tilemap) {
    const transitions = [];
    
    if (!tilemap) {
        console.warn('⚠️ loadTransitionsFromTMX: tilemap est null ou undefined');
        return transitions;
    }
    
    try {
        // Le TMX a été parsé par TMXLoader, on doit accéder aux objectgroups
        // Si le TMX n'a pas été parsé en XML, on doit le recharger
        const tmxPath = tilemap.tmxPath || 'village.tmx';
        console.log(`🔍 Chargement des transitions depuis: ${tmxPath}`);
        
        const response = await fetch(tmxPath);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Chercher les objectgroups (couches d'objets)
        const objectGroups = xmlDoc.querySelectorAll('objectgroup');
        console.log(`📦 ${objectGroups.length} objectgroup(s) trouvé(s) dans ${tmxPath}`);
        
        for (const group of objectGroups) {
            const groupName = group.getAttribute('name') || '';
            console.log(`  └─ ObjectGroup: "${groupName}"`);
            
            // Chercher la couche "Transitions", "Portes", "Sorties" ou "Doors"
            if (groupName.toLowerCase().includes('transition') || 
                groupName.toLowerCase().includes('porte') ||
                groupName.toLowerCase().includes('door') ||
                groupName.toLowerCase().includes('sortie') ||
                groupName.toLowerCase().includes('exit')) {
                
                console.log(`  ✅ Couche "${groupName}" correspond aux transitions`);
                const objects = group.querySelectorAll('object');
                console.log(`  📍 ${objects.length} objet(s) trouvé(s) dans cette couche`);
                
                for (const obj of objects) {
                    const objX = parseFloat(obj.getAttribute('x')) || 0;
                    const objY = parseFloat(obj.getAttribute('y')) || 0;
                    const objWidth = parseFloat(obj.getAttribute('width')) || 0;
                    const objHeight = parseFloat(obj.getAttribute('height')) || 0;
                    const objId = obj.getAttribute('id') || 'sans-id';
                    
                    console.log(`    └─ Objet ${objId}: x=${objX}, y=${objY}, width=${objWidth}, height=${objHeight}`);
                    
                    // Lire les propriétés
                    const properties = {};
                    const propertyElements = obj.querySelectorAll('property');
                    
                    for (const prop of propertyElements) {
                        const name = prop.getAttribute('name');
                        const value = prop.getAttribute('value');
                        properties[name] = value;
                        console.log(`      └─ Propriété: ${name} = ${value}`);
                    }
                    
                    // Vérifier qu'on a les propriétés nécessaires
                    if (properties.targetMap) {
                        const tileSize = tilemap.tmxTileWidth || 32;
                        
                        // Si l'objet est un point (width/height = 0), créer une zone de 1x1 tuile
                        const effectiveWidth = objWidth > 0 ? objWidth : tileSize;
                        const effectiveHeight = objHeight > 0 ? objHeight : tileSize;
                        
                        const gridX = Math.floor(objX / tileSize);
                        const gridY = Math.floor(objY / tileSize);
                        const gridWidth = Math.max(1, Math.ceil(effectiveWidth / tileSize));
                        const gridHeight = Math.max(1, Math.ceil(effectiveHeight / tileSize));
                        
                        const transition = {
                            x: gridX,
                            y: gridY,
                            width: gridWidth,
                            height: gridHeight,
                            targetMap: properties.targetMap,
                            // ID de la porte d'entrée dans la carte de destination (optionnel)
                            // Si non défini, utilisera la première porte trouvée
                            targetDoorId: properties.targetDoorId || null,
                            // Propriétés optionnelles
                            requiresKey: properties.requiresKey === 'true',
                            keyId: properties.keyId || null,
                            locked: properties.locked === 'true'
                        };
                        
                        transitions.push(transition);
                        console.log(`      ✅ Transition ajoutée: grille(${gridX}, ${gridY}) taille(${gridWidth}x${gridHeight}) → ${properties.targetMap}`);
                    } else {
                        console.log(`      ⚠️ Objet ${objId} ignoré: pas de propriété targetMap`);
                    }
                }
            }
        }
        
        console.log(`✅ ${transitions.length} transition(s) chargée(s) depuis ${tmxPath}`);
        if (transitions.length > 0) {
            console.log('📋 Liste des transitions:', transitions);
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement des transitions:', error);
        console.error('Stack:', error.stack);
    }
    
    return transitions;
}

/**
 * Extension de GameScene pour gérer les transitions
 * À intégrer dans script-phaser.js
 */
const MapTransitionMixin = {
    /**
     * Initialise le système de transitions
     */
    initTransitions() {
        this.transitions = [];
        this.currentMap = 'village.tmx';
        this.mapHistory = [];
        this.isTransitioning = false;
        this.lastTransitionCheckLog = null;
        this.lastTransitionDebugLog = null;
        this.lastTransitionTime = 0; // Timestamp de la dernière transition
        this.transitionCooldown = 2000; // Cooldown de 2 secondes après une transition
        console.log('🔧 Système de transitions initialisé');
    },
    
    /**
     * Vérifie si le joueur est sur une zone de transition
     */
    checkTransitions() {
        // Ne pas vérifier si on est déjà en train de faire une transition
        if (this.isTransitioning) {
            return;
        }
        
        if (!this.transitions || this.transitions.length === 0) {
            // Log seulement une fois toutes les 5 secondes pour éviter le spam
            if (!this.lastTransitionCheckLog || Date.now() - this.lastTransitionCheckLog > 5000) {
                console.log('⚠️ Aucune transition disponible');
                this.lastTransitionCheckLog = Date.now();
            }
            return;
        }
        
        // Ne pas vérifier les transitions si on est en train d'en faire une
        if (this.isTransitioning) {
            return;
        }
        
        // Vérifier le cooldown global (empêche les transitions trop rapides)
        const timeSinceLastTransition = Date.now() - this.lastTransitionTime;
        if (timeSinceLastTransition < this.transitionCooldown) {
            // Cooldown actif, ne pas vérifier (évite le spam de logs)
            return;
        }
        
        const tileSize = this.tilePixelSize;
        const playerGridX = Math.floor(this.player.x / tileSize);
        const playerGridY = Math.floor(this.player.y / tileSize);
        const playerPixelX = this.player.x;
        const playerPixelY = this.player.y;
        
        // Log détaillé toutes les secondes pour déboguer
        if (!this.lastTransitionDebugLog || Date.now() - this.lastTransitionDebugLog > 1000) {
            console.log(`🔍 Vérification transitions: joueur en grille(${playerGridX}, ${playerGridY}) pixels(${Math.floor(playerPixelX)}, ${Math.floor(playerPixelY)})`);
            console.log(`   ${this.transitions.length} transition(s) disponible(s):`, 
                this.transitions.map(t => `(${t.x},${t.y}) ${t.width}x${t.height} → ${t.targetMap}`));
            this.lastTransitionDebugLog = Date.now();
        }
        
        // Vérifier si le joueur est sur une zone de transition
        let currentTransition = null;
        for (const transition of this.transitions) {
            const inX = playerGridX >= transition.x && playerGridX < transition.x + transition.width;
            const inY = playerGridY >= transition.y && playerGridY < transition.y + transition.height;
            
            if (inX && inY) {
                currentTransition = transition;
                break;
            }
        }
        
        // Si le joueur est sur une zone de transition
        if (currentTransition) {
            // Vérifier si c'est la transition inverse de celle qu'on vient d'utiliser
            const previousMap = this.mapHistory.length > 0 ? this.mapHistory[this.mapHistory.length - 1].map : null;
            const isReverseTransition = previousMap && currentTransition.targetMap === previousMap;
            
            // Si c'est la transition inverse et qu'on vient juste d'arriver, bloquer avec un cooldown plus long
            if (isReverseTransition && timeSinceLastTransition < this.transitionCooldown * 3) {
                // Triple cooldown pour la transition inverse (4.5 secondes)
                console.log(`⏳ Transition inverse bloquée: ${Math.floor((this.transitionCooldown * 3 - timeSinceLastTransition) / 1000)}s restantes`);
                return;
            }
            
            console.log(`🚪 Transition détectée! Joueur(${playerGridX}, ${playerGridY}) dans zone(${currentTransition.x}, ${currentTransition.y}) ${currentTransition.width}x${currentTransition.height} → ${currentTransition.targetMap}`);
            
            // Vérifier si la transition est verrouillée
            if (currentTransition.locked) {
                console.log('🔒 Transition verrouillée');
                // Afficher un message (optionnel)
                this.showMessage('Cette porte est verrouillée', 2000);
                return;
            }
            
            // Déclencher la transition
            console.log('✅ Déclenchement de la transition...');
            this.triggerTransition(currentTransition);
            return;
        }
    },
    
    /**
     * Déclenche une transition vers une nouvelle carte
     */
    async triggerTransition(transition) {
        if (this.isTransitioning) return;
        
        console.log('🚪 Transition vers:', transition.targetMap);
        this.isTransitioning = true;
        
        // Trouver le point d'entrée actuel pour le retour
        const currentEntryPoints = await loadEntryPointsFromTMX(this.currentMap);
        let currentEntryPoint = null;
        
        // Chercher le point d'entrée le plus proche de la position actuelle
        const playerGridX = Math.floor(this.player.x / this.tilePixelSize);
        const playerGridY = Math.floor(this.player.y / this.tilePixelSize);
        
        for (const ep of currentEntryPoints) {
            const distance = Math.abs(ep.x - playerGridX) + Math.abs(ep.y - playerGridY);
            if (!currentEntryPoint || distance < 2) {
                currentEntryPoint = ep;
            }
        }
        
        // Sauvegarder la carte actuelle et le point d'entrée pour le retour
        this.mapHistory.push({
            map: this.currentMap,
            doorId: currentEntryPoint?.id || null
        });
        
        // Effet de fondu (optionnel mais recommandé)
        this.cameras.main.fadeOut(300, 0, 0, 0);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        try {
            // Sauvegarder la carte précédente AVANT de charger la nouvelle
            const previousMap = this.mapHistory.length > 0 ? this.mapHistory[this.mapHistory.length - 1].map : this.currentMap;
            console.log(`🔍 Carte précédente: ${previousMap}`);
            
            // Charger la nouvelle carte d'abord pour avoir accès à ses transitions
            await this.loadMap(transition.targetMap);
            
            // Maintenant que les transitions sont chargées, chercher la transition inverse
            let entryPoint = null;
            
            if (transition.targetDoorId) {
                // Si un ID est spécifié, chercher dans les points d'entrée
                const entryPoints = await loadEntryPointsFromTMX(transition.targetMap);
                entryPoint = entryPoints.find(ep => ep.id === transition.targetDoorId);
            }
            
            // Si pas d'ID spécifié, chercher la transition inverse dans la NOUVELLE carte
            if (!entryPoint) {
                console.log(`🔍 Recherche de transition inverse vers: ${previousMap}`);
                console.log(`   Transitions disponibles dans ${transition.targetMap}:`, 
                    this.transitions.map(t => `${t.targetMap} en (${t.x},${t.y})`));
                
                const reverseTransition = this.transitions.find(t => {
                    // Comparer les noms de fichiers (avec ou sans extension)
                    const tMap = (t.targetMap || '').replace('.tmx', '').toLowerCase().trim();
                    const prevMap = (previousMap || '').replace('.tmx', '').toLowerCase().trim();
                    const match = tMap === prevMap || 
                                  t.targetMap === previousMap || 
                                  t.targetMap === previousMap.replace('.tmx', '') ||
                                  t.targetMap === previousMap.replace('.tmx', '') + '.tmx';
                    if (match) {
                        console.log(`   ✅ Transition inverse trouvée: ${t.targetMap} en (${t.x},${t.y})`);
                    } else {
                        console.log(`   ❌ Transition non correspondante: ${t.targetMap} (cherché: ${previousMap})`);
                    }
                    return match;
                });
                
                if (reverseTransition) {
                    // Utiliser cette transition comme point d'entrée
                    const tileSize = this.tilePixelSize;
                    entryPoint = {
                        x: reverseTransition.x + Math.floor(reverseTransition.width / 2),
                        y: reverseTransition.y + Math.floor(reverseTransition.height / 2),
                        pixelX: (reverseTransition.x + reverseTransition.width / 2) * tileSize,
                        pixelY: (reverseTransition.y + reverseTransition.height / 2) * tileSize
                    };
                    console.log('✅ Porte de sortie trouvée automatiquement via transition inverse:', entryPoint);
                } else {
                    console.log('⚠️ Aucune transition inverse trouvée, recherche dans les points d\'entrée...');
                    // Fallback : chercher dans les points d'entrée
                    const entryPoints = await loadEntryPointsFromTMX(transition.targetMap);
                    console.log(`   Points d'entrée trouvés: ${entryPoints.length}`);
                    if (entryPoints.length > 0) {
                        entryPoint = entryPoints[0];
                        console.log('✅ Première porte d\'entrée utilisée:', entryPoint);
                    }
                }
            }
            
            if (!entryPoint) {
                // Dernier recours : utiliser le centre de la carte
                console.warn('⚠️ Aucun point d\'entrée trouvé, utilisation du centre de la carte');
                const mapWidth = this.mapData.width;
                const mapHeight = this.mapData.height;
                const tileSize = this.tilePixelSize;
                entryPoint = {
                    x: Math.floor(mapWidth / 2),
                    y: Math.floor(mapHeight / 2),
                    pixelX: (mapWidth / 2) * tileSize,
                    pixelY: (mapHeight / 2) * tileSize
                };
                console.log('📍 Point d\'entrée par défaut (centre):', entryPoint);
            }
            
            // Positionner le joueur légèrement en dehors de la zone de transition pour éviter le flicker
            // On va chercher la transition inverse pour savoir où positionner le joueur
            // (previousMap est déjà défini plus haut dans la fonction)
            const reverseTransition = this.transitions.find(t => t.targetMap === previousMap);
            
            let targetPixelX, targetPixelY;
            
            if (reverseTransition) {
                // Calculer une position juste à côté de la zone de transition (pas dedans)
                const tileSize = this.tilePixelSize;
                const transitionCenterX = (reverseTransition.x + reverseTransition.width / 2) * tileSize;
                const transitionCenterY = (reverseTransition.y + reverseTransition.height / 2) * tileSize;
                
                // Positionner le joueur à 2 tuiles de distance de la zone de transition
                // On va le positionner vers le bas (sud) de la zone par défaut
                const offsetDistance = tileSize * 2;
                
                // Calculer la direction depuis laquelle on vient (depuis la carte précédente)
                // Par défaut, on positionne le joueur en dessous de la zone de transition
                targetPixelX = transitionCenterX;
                targetPixelY = transitionCenterY + offsetDistance;
                
                // Si on ne peut pas positionner en dessous (limite de carte), essayer au-dessus
                if (targetPixelY >= (this.mapData.height - 1) * tileSize) {
                    targetPixelY = transitionCenterY - offsetDistance;
                }
                
                // Vérifier les limites de la carte
                const mapWidth = this.mapData.width;
                const mapHeight = this.mapData.height;
                targetPixelX = Phaser.Math.Clamp(targetPixelX, tileSize / 2, mapWidth * tileSize - tileSize / 2);
                targetPixelY = Phaser.Math.Clamp(targetPixelY, tileSize / 2, mapHeight * tileSize - tileSize / 2);
                
                console.log(`📍 Position d'arrivée calculée: (${Math.floor(targetPixelX)}, ${Math.floor(targetPixelY)}) - en dehors de la zone de transition`);
            } else {
                // Fallback : utiliser les coordonnées du point d'entrée avec un petit décalage
                targetPixelX = entryPoint.pixelX || (entryPoint.x * this.tilePixelSize + this.tilePixelSize / 2);
                targetPixelY = entryPoint.pixelY || (entryPoint.y * this.tilePixelSize + this.tilePixelSize / 2);
                
                // Ajouter un décalage vers le bas pour sortir de la zone (2 tuiles)
                targetPixelY += this.tilePixelSize * 2;
                
                // Vérifier les limites
                const mapWidth = this.mapData.width;
                const mapHeight = this.mapData.height;
                targetPixelX = Phaser.Math.Clamp(targetPixelX, this.tilePixelSize / 2, mapWidth * this.tilePixelSize - this.tilePixelSize / 2);
                targetPixelY = Phaser.Math.Clamp(targetPixelY, this.tilePixelSize / 2, mapHeight * this.tilePixelSize - this.tilePixelSize / 2);
            }
            
            this.player.x = targetPixelX;
            this.player.y = targetPixelY;
            this.playerCharacter.container.x = targetPixelX;
            this.playerCharacter.container.y = targetPixelY;
            
            // Mettre à jour les coordonnées de grille
            this.playerGridX = Math.floor(targetPixelX / this.tilePixelSize);
            this.playerGridY = Math.floor(targetPixelY / this.tilePixelSize);
            
            // Les transitions ont déjà été chargées dans loadMap()
            
            // Effet de fondu (retour)
            this.cameras.main.fadeIn(300, 0, 0, 0);
            
            this.currentMap = transition.targetMap;
            this.lastTransitionTime = Date.now(); // Enregistrer le timestamp
            
            console.log('✅ Transition terminée - joueur positionné en dehors de la zone de transition');
            console.log(`   Cooldown actif pendant ${this.transitionCooldown}ms`);
        } catch (error) {
            console.error('❌ Erreur lors de la transition:', error);
            this.cameras.main.fadeIn(300, 0, 0, 0);
            
            // En cas d'erreur, annuler la transition et déplacer le joueur hors de la zone
            // pour éviter la boucle infinie
            const tileSize = this.tilePixelSize;
            const playerGridX = Math.floor(this.player.x / tileSize);
            const playerGridY = Math.floor(this.player.y / tileSize);
            
            // Déplacer le joueur d'une tuile vers le bas pour le sortir de la zone de transition
            const newY = Math.min(
                (playerGridY + 2) * tileSize + tileSize / 2,
                (this.mapData?.height || 30) * tileSize - tileSize / 2
            );
            this.player.y = newY;
            this.playerCharacter.container.y = newY;
            
            // Réinitialiser le cooldown pour éviter les tentatives répétées
            this.lastTransitionTime = Date.now();
            this.isTransitioning = false;
            
            // Afficher un message d'erreur
            this.showMessage('Erreur lors du chargement de la carte', 3000);
            
            console.log('⚠️ Transition annulée, joueur déplacé hors de la zone');
            return; // Sortir immédiatement pour éviter de continuer
        }
        
        this.isTransitioning = false;
    },
    
    /**
     * Charge une nouvelle carte
     */
    async loadMap(mapFileName) {
        console.log('📦 Chargement de la carte:', mapFileName);
        
        // Détruire l'ancienne carte
        if (this.mapImage) {
            this.mapImage.destroy();
            this.mapImage = null;
        }
        if (this.mapTexture && this.textures.exists('mapTexture')) {
            this.textures.remove('mapTexture');
        }
        
        // Détruire les NPCs de l'ancienne carte
        if (this.npcs) {
            this.npcs.forEach(npc => {
                if (npc.container) {
                    npc.container.destroy(true);
                }
            });
            this.npcs = [];
        }
        
        // Charger la nouvelle carte
        const mapLoader = new TopDownTilemap();
        const loaded = await mapLoader.loadFromTMX(mapFileName);
        // Stocker le chemin du fichier TMX pour les transitions
        mapLoader.tmxPath = mapFileName;
        
        if (!loaded) {
            throw new Error(`Impossible de charger la carte: ${mapFileName}`);
        }
        
        // Pré-rendre la nouvelle carte
        await mapLoader.prerender(1);
        
        // Mettre à jour mapData
        this.mapData = {
            width: mapLoader.width,
            height: mapLoader.height,
            tileSize: mapLoader.tmxTileWidth || 32,
            tilemap: mapLoader,
            prerenderCanvas: mapLoader.offscreenCanvas
        };
        
        // Recréer la visualisation de la carte
        this.createMapVisualization(
            this.mapData.width, 
            this.mapData.height, 
            this.mapData.tileSize
        );
        
        // Ajuster la caméra à la nouvelle carte
        this.cameras.main.setBounds(
            0, 
            0, 
            this.mapData.width * this.mapData.tileSize, 
            this.mapData.height * this.mapData.tileSize
        );
        
        // Centrer la caméra sur le joueur
        this.cameras.main.startFollow(this.playerCharacter.container);
        
        // Réinitialiser les NPCs pour la nouvelle carte
        const mapWidth = this.mapData.width;
        const mapHeight = this.mapData.height;
        const tileSize = this.mapData.tileSize;
        this.initializeNPCs(mapWidth, mapHeight, tileSize);
        
        // Charger les transitions pour la nouvelle carte
        if (this.mapData?.tilemap) {
            console.log('🔄 Chargement des transitions pour la nouvelle carte...');
            this.transitions = await loadTransitionsFromTMX(this.mapData.tilemap);
            console.log(`✅ ${this.transitions.length} transition(s) chargée(s) pour ${mapFileName}`);
        } else {
            console.warn('⚠️ mapData.tilemap non disponible, impossible de charger les transitions');
        }
        
        console.log('✅ Carte chargée:', mapFileName);
    },
    
    /**
     * Retourne à la carte précédente
     */
    async goBackToPreviousMap() {
        if (this.mapHistory.length === 0) {
            console.warn('Aucune carte précédente');
            return;
        }
        
        const previous = this.mapHistory.pop();
        
        // Trouver la transition correspondante dans la carte précédente
        // On cherche une transition qui mène vers la carte actuelle
        const backTransition = this.transitions.find(t => t.targetMap === previous.map);
        
        if (backTransition) {
            // Inverser la transition : on va vers la carte précédente
            const reverseTransition = {
                targetMap: previous.map,
                targetDoorId: previous.doorId || null
            };
            await this.triggerTransition(reverseTransition);
        } else {
            // Fallback : créer une transition simple
            const transition = {
                targetMap: previous.map,
                targetDoorId: previous.doorId || null
            };
            await this.triggerTransition(transition);
        }
    },
    
    /**
     * Affiche un message temporaire (utilitaire)
     */
    showMessage(text, duration = 2000) {
        if (this.messageText) {
            this.messageText.destroy();
        }
        
        this.messageText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            text,
            {
                fontSize: '20px',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 }
            }
        ).setOrigin(0.5, 0.5).setDepth(3000);
        
        this.time.delayedCall(duration, () => {
            if (this.messageText) {
                this.messageText.destroy();
                this.messageText = null;
            }
        });
    }
};

