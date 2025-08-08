/**
 * Collection Manager - Auto-discovery system for JSON collections
 * Scans collections/ folder for JSON files and loads them automatically
 */
export class CollectionManager {
    constructor() {
        this.collections = new Map();
        this.baseCollectionPath = './collections/';
        this.loadingPromises = new Map();
    }
    
    /**
     * Auto-discover and load all JSON collections from collections/ folder
     * Scans for user-saved JSON files up to 9999 for dev purposes
     */
    async autoDiscoverCollections() {
        console.log('🔍 Auto-discovering user-saved collections...');
        
        // Try to load common collection filenames that users might save
        const possibleCollections = [];
        
        // Known collection files and common user patterns
        const baseNames = [
            // Known base collection
            'base-variations.json',
            
            // Common user save patterns (from save systems)
            'custom-variations.json',
            'user-collection.json',
            'my-variations.json',
            'holographic-collection.json',
            'vib34d-collection.json',
            
            // User-custom files (saveToPortfolio creates these)
            'user-custom-2025-08-08.json',
            'user-custom-2025-08-09.json',
            'user-custom-2025-08-10.json'
        ];
        
        // Add limited numbered collections for actual user saves
        for (let i = 1; i <= 20; i++) {
            baseNames.push(`custom-${i}.json`);
        }
        
        // Add recent custom files (saveToGallery creates these with timestamps)
        const now = new Date();
        for (let days = 0; days < 7; days++) {
            const date = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            baseNames.push(`user-custom-${dateStr}.json`);
        }
        
        // Add potential timestamp-based files (from saveToGallery system)
        for (let i = 0; i < 10; i++) {
            const timestamp = Date.now() - (i * 60000); // Last 10 minutes
            baseNames.push(`custom-${timestamp}.json`);
        }
        
        possibleCollections.push(...baseNames);
        
        const loadPromises = possibleCollections.map(filename => 
            this.loadCollection(filename).catch(err => {
                // Silently fail - this is normal for files that don't exist
                return null;
            })
        );
        
        const results = await Promise.allSettled(loadPromises);
        const validResults = results.filter(r => r.status === 'fulfilled' && r.value);
        
        console.log(`✅ Auto-discovery complete: ${validResults.length} user collections loaded`);
        return Array.from(this.collections.values());
    }
    
    /**
     * Load a specific collection from the collections/ folder
     */
    async loadCollection(filename) {
        const fullPath = this.baseCollectionPath + filename;
        
        // Avoid duplicate loading
        if (this.loadingPromises.has(filename)) {
            return this.loadingPromises.get(filename);
        }
        
        const loadPromise = this.fetchCollectionFile(fullPath, filename);
        this.loadingPromises.set(filename, loadPromise);
        
        try {
            const collection = await loadPromise;
            this.collections.set(filename, collection);
            console.log(`📋 Loaded collection: ${collection.name} (${collection.variations.length} variations)`);
            return collection;
        } catch (error) {
            console.log(`📁 Collection ${filename} not available (this is normal for user files)`);
            this.loadingPromises.delete(filename);
            throw error;
        }
    }
    
    /**
     * Fetch and parse a collection file
     */
    async fetchCollectionFile(fullPath, filename) {
        const response = await fetch(fullPath);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate collection format
        if (!data.type || data.type !== 'holographic-collection') {
            throw new Error('Invalid collection format: missing type');
        }
        
        if (!data.variations || !Array.isArray(data.variations)) {
            throw new Error('Invalid collection format: missing variations array');
        }
        
        // Add metadata
        data.filename = filename;
        data.loadedAt = new Date().toISOString();
        
        return data;
    }
    
    /**
     * Get all loaded collections
     */
    getAllCollections() {
        return Array.from(this.collections.values());
    }
    
    /**
     * Get a specific collection by filename
     */
    getCollection(filename) {
        return this.collections.get(filename);
    }
    
    /**
     * Get all variations from all collections (flattened)
     */
    getAllVariations() {
        const allVariations = [];
        let currentId = 0;
        
        for (const collection of this.collections.values()) {
            for (const variation of collection.variations) {
                allVariations.push({
                    ...variation,
                    id: currentId++,
                    collectionName: collection.name,
                    collectionFilename: collection.filename,
                    isFromCollection: true
                });
            }
        }
        
        return allVariations;
    }
    
    /**
     * Save a new collection or append to existing user collection
     */
    async saveCollection(collection, filename) {
        // Validate filename
        if (!filename.endsWith('.json')) {
            filename += '.json';
        }
        
        let formattedCollection;
        
        // Check if we're appending to an existing user collection
        const existingCollection = this.collections.get(filename);
        if (existingCollection && filename.includes('user-custom-')) {
            // Append to existing collection
            const newVariations = [...existingCollection.variations, ...collection.variations];
            
            // Update IDs to be sequential
            newVariations.forEach((variation, index) => {
                variation.id = index;
            });
            
            formattedCollection = {
                ...existingCollection,
                totalVariations: newVariations.length,
                variations: newVariations,
                updated: new Date().toISOString()
            };
            
            console.log(`📝 Appending to existing collection: ${existingCollection.name}`);
        } else {
            // Create new collection
            formattedCollection = {
                name: collection.name || 'Unnamed Collection',
                description: collection.description || '',
                version: '1.0',
                type: 'holographic-collection',
                profileName: collection.profileName || 'VIB34D System',
                totalVariations: collection.variations.length,
                created: new Date().toISOString(),
                variations: collection.variations
            };
        }
        
        // Convert to JSON
        const jsonData = JSON.stringify(formattedCollection, null, 2);
        
        // Create download (since we can't write directly to collections/)
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log(`💾 Collection saved: ${filename}`);
        console.log(`📁 To use: Move ${filename} to collections/ folder and refresh gallery`);
        
        // Update our internal collection if it exists
        if (existingCollection) {
            this.collections.set(filename, formattedCollection);
        }
        
        return formattedCollection;
    }
    
    /**
     * Create a collection from custom variations
     */
    createCustomCollection(customVariations, name) {
        const collection = {
            name: name || `Custom Collection ${new Date().toLocaleDateString()}`,
            description: 'User-created custom holographic variations',
            version: '1.0',
            type: 'holographic-collection',
            profileName: 'Active Holographic Systems',
            totalVariations: customVariations.length,
            created: new Date().toISOString(),
            variations: customVariations.map((cv, index) => ({
                id: index,
                name: cv.name || `Custom Variation ${index + 1}`,
                isCustom: true,
                parameters: {
                    geometryType: cv.params.geometry,
                    density: cv.params.density,
                    speed: cv.params.speed,
                    chaos: cv.params.chaos,
                    morph: cv.params.morph,
                    hue: cv.params.hue,
                    saturation: cv.params.saturation,
                    intensity: cv.params.intensity
                }
            }))
        };
        
        return collection;
    }
    
    /**
     * Get collection statistics
     */
    getStatistics() {
        const collections = Array.from(this.collections.values());
        const stats = {
            totalCollections: collections.length,
            totalVariations: collections.reduce((sum, c) => sum + c.variations.length, 0),
            customCollections: collections.filter(c => c.name.includes('Custom')).length,
            baseCollections: collections.filter(c => c.name.includes('Base')).length,
            collections: collections.map(c => ({
                name: c.name,
                filename: c.filename,
                variationCount: c.variations.length,
                created: c.created
            }))
        };
        
        return stats;
    }
}