/**
 * Trading Card Manager - Smart orchestrator for system-specific card generation
 * Dynamically loads the appropriate generator based on current system
 */
export class TradingCardManager {
    static generators = {}; // Cache loaded generators
    
    /**
     * Create a trading card for the specified system
     */
    static async createCard(system, format = 'classic', parameters = {}) {
        try {
            console.log(`🎴 Creating ${format} trading card for ${system} system...`);
            
            // Get the appropriate generator
            const generator = await this.getGenerator(system);
            
            // Generate the card
            const result = await generator.generateCard(format, parameters);
            
            if (result.success) {
                console.log(`✅ ${system} trading card created: ${result.filename}`);
            } else {
                console.error(`❌ ${system} trading card failed: ${result.error}`);
            }
            
            return result;
        } catch (error) {
            console.error(`❌ Trading card manager error:`, error);
            return {
                success: false,
                error: error.message,
                system
            };
        }
    }
    
    /**
     * Get generator for specific system (with caching and dynamic import)
     */
    static async getGenerator(system) {
        // Return cached generator if available
        if (this.generators[system]) {
            return this.generators[system];
        }
        
        // Dynamic import based on system
        const generatorMap = {
            'faceted': () => import('./FacetedCardGenerator.js'),
            'quantum': () => import('./QuantumCardGenerator.js'),
            'holographic': () => import('./HolographicCardGenerator.js'),
            'polychora': () => import('./PolychoraCardGenerator.js')
        };
        
        const importFunction = generatorMap[system];
        if (!importFunction) {
            throw new Error(`Unknown system: ${system}. Available: ${Object.keys(generatorMap).join(', ')}`);
        }
        
        // Import and instantiate
        const { default: GeneratorClass } = await importFunction();
        const generator = new GeneratorClass();
        
        // Cache for future use
        this.generators[system] = generator;
        
        console.log(`📦 Loaded ${system} card generator`);
        return generator;
    }
    
    /**
     * Get current system parameters from the UI
     */
    static getCurrentParameters() {
        const parameters = {};
        
        // Get all slider values
        const sliders = document.querySelectorAll('.control-slider');
        sliders.forEach(slider => {
            parameters[slider.id] = parseFloat(slider.value);
        });
        
        // Get active geometry
        const activeGeometry = document.querySelector('.geom-btn.active');
        if (activeGeometry) {
            parameters.geometry = parseInt(activeGeometry.dataset.index);
        }
        
        // Add system info
        parameters.system = window.currentSystem || 'faceted';
        
        return parameters;
    }
    
    /**
     * Clear generator cache (useful for development)
     */
    static clearCache() {
        this.generators = {};
        console.log('🧹 Trading card generator cache cleared');
    }
    
    /**
     * Get available systems
     */
    static getAvailableSystems() {
        return ['faceted', 'quantum', 'holographic', 'polychora'];
    }
    
    /**
     * Get system info for UI
     */
    static getSystemInfo(system) {
        const info = {
            'faceted': {
                name: 'Faceted',
                description: 'Clean geometric patterns showcasing mathematical purity',
                color: '#00ffff',
                specialty: 'Mathematical precision'
            },
            'quantum': {
                name: 'Quantum',
                description: 'Enhanced 3D lattice with complex holographic effects',
                color: '#00ffff',
                specialty: 'Enhanced complexity'
            },
            'holographic': {
                name: 'Holographic',
                description: 'Audio-reactive visualization with rich volumetric effects',
                color: '#ff64ff',
                specialty: 'Audio reactivity'
            },
            'polychora': {
                name: 'Polychora',
                description: 'True 4D polytope mathematics with glassmorphic rendering',
                color: '#ff9600',
                specialty: '4D mathematics'
            }
        };
        
        return info[system] || { name: 'Unknown', description: '', color: '#ffffff', specialty: '' };
    }
}