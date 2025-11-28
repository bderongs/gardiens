/**
 * Chargeur de sprites pour le système Universal LPC
 * Gère le chargement et le cache des images sprites
 */

class SpriteLoader {
    constructor() {
        this.cache = new Map();
        this.loadingPromises = new Map();
    }

    /**
     * Charge une image sprite
     * @param {string} path - Chemin vers l'image
     * @returns {Promise<HTMLImageElement>} - Image chargée
     */
    async loadImage(path) {
        // Vérifier le cache
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }

        // Vérifier si l'image est déjà en cours de chargement
        if (this.loadingPromises.has(path)) {
            return this.loadingPromises.get(path);
        }

        // Créer une nouvelle promesse de chargement
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.cache.set(path, img);
                this.loadingPromises.delete(path);
                resolve(img);
            };
            img.onerror = () => {
                this.loadingPromises.delete(path);
                // Ne pas logger les erreurs pour les assets manquants (c'est normal avec les placeholders)
                // console.warn(`Impossible de charger l'image : ${path}`);
                reject(new Error(`Erreur de chargement : ${path}`));
            };
            img.src = path;
        });

        this.loadingPromises.set(path, promise);
        return promise;
    }

    /**
     * Charge plusieurs images en parallèle
     * @param {string[]} paths - Tableau de chemins
     * @returns {Promise<HTMLImageElement[]>} - Tableau d'images chargées
     */
    async loadImages(paths) {
        return Promise.all(paths.map(path => this.loadImage(path)));
    }

    /**
     * Vérifie si une image est chargée
     * @param {string} path - Chemin vers l'image
     * @returns {boolean}
     */
    isLoaded(path) {
        return this.cache.has(path);
    }

    /**
     * Vide le cache
     */
    clearCache() {
        this.cache.clear();
        this.loadingPromises.clear();
    }
}

// Instance globale
const spriteLoader = new SpriteLoader();

