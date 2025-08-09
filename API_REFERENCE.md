# 📚 VIB34D API REFERENCE

**Complete Function & Parameter Documentation**  
**Version**: 4-System Architecture  
**Last Updated**: August 9, 2025

---

## 🎯 Core System Functions

### **switchSystem(system)** - CRITICAL FUNCTION
```javascript
/**
 * Switches between the 4 visualization systems
 * Location: index.html line 775 (currently blocked by ES6 module scope)
 * 
 * @param {string} system - System identifier
 * @param {string} system.faceted - Simple 2D patterns
 * @param {string} system.quantum - Complex 3D lattice  
 * @param {string} system.holographic - Audio-reactive effects
 * @param {string} system.polychora - 4D polytope mathematics
 * 
 * @returns {Promise<void>} Async operation
 * @throws {Error} If system parameter is invalid
 * 
 * @example
 * await switchSystem('quantum'); // Activates quantum system
 * await switchSystem('holographic'); // Activates holographic system
 */
window.switchSystem = async function(system) {
    // 85-line implementation - lines 775-851
    // Updates UI, shows/hides canvas layers, activates engines
}
```

**Current Status**: 🚨 **BLOCKED** - Function exists but not accessible to HTML onclick handlers due to ES6 module scope

### **selectGeometry(index)** - GEOMETRY SELECTION
```javascript
/**
 * Selects geometry type for current visualization system
 * Location: index.html line 867
 * 
 * @param {number} index - Geometry type index (0-7)
 * @param {number} index.0 - TETRAHEDRON
 * @param {number} index.1 - HYPERCUBE  
 * @param {number} index.2 - SPHERE
 * @param {number} index.3 - TORUS
 * @param {number} index.4 - KLEIN_BOTTLE
 * @param {number} index.5 - FRACTAL
 * @param {number} index.6 - WAVE
 * @param {number} index.7 - CRYSTAL
 * 
 * @example
 * selectGeometry(1); // Selects HYPERCUBE
 * selectGeometry(5); // Selects FRACTAL
 */
window.selectGeometry = function(index) {
    // Updates geometry buttons, applies to current system
    // Calls updateParameter('geometry', index)
}
```

### **updateParameter(param, value)** - PARAMETER CONTROL
```javascript
/**
 * Updates visualization parameter for current system
 * Location: index.html line 888
 * 
 * @param {string} param - Parameter name
 * @param {number} value - Parameter value (range varies by parameter)
 * 
 * @example
 * updateParameter('hue', 180);        // Set hue to 180 degrees
 * updateParameter('intensity', 0.8);  // Set intensity to 80%
 * updateParameter('chaos', 0.5);      // Set chaos to 50%
 */
window.updateParameter = function(param, value) {
    // Routes parameter update to current active system
    // Validates value range, updates visualizers
}
```

---

## 🔧 Parameter System API

### **ParameterManager Class**
```javascript
/**
 * Unified parameter management across all systems
 * Location: src/core/Parameters.js
 */
class ParameterManager {
    /**
     * Get all current parameters
     * @returns {Object} Complete parameter set
     */
    getAllParameters() {
        return { ...this.params };
    }
    
    /**
     * Set specific parameter with validation
     * @param {string} name - Parameter name
     * @param {number} value - Parameter value
     * @returns {boolean} Success status
     */
    setParameter(name, value) {
        // Validates against parameterDefs, clamps to valid range
        // Applies type conversion (int/float)
    }
    
    /**
     * Set multiple parameters at once
     * @param {Object} paramObj - Key-value parameter pairs
     */
    setParameters(paramObj) {
        for (const [name, value] of Object.entries(paramObj)) {
            this.setParameter(name, value);
        }
    }
}
```

### **Parameter Definitions**
```javascript
// Complete parameter specification with ranges and types
const parameters = {
    geometry: {
        type: 'int',
        min: 0,
        max: 7,
        default: 0,
        description: 'Geometry type (0=Tetrahedron, 1=Hypercube, etc.)'
    },
    
    rot4dXW: {
        type: 'float', 
        min: -6.28318,  // -2π
        max: 6.28318,   // 2π
        default: 0.0,
        description: 'X-W plane 4D rotation in radians'
    },
    
    rot4dYW: {
        type: 'float',
        min: -6.28318,
        max: 6.28318, 
        default: 0.0,
        description: 'Y-W plane 4D rotation in radians'
    },
    
    rot4dZW: {
        type: 'float',
        min: -6.28318,
        max: 6.28318,
        default: 0.0,
        description: 'Z-W plane 4D rotation in radians'
    },
    
    gridDensity: {
        type: 'float',
        min: 5,
        max: 100,
        default: 15,
        description: 'Geometric detail density'
    },
    
    morphFactor: {
        type: 'float',
        min: 0,
        max: 2,
        default: 1.0,
        description: 'Shape transformation amount'
    },
    
    chaos: {
        type: 'float',
        min: 0,
        max: 1,
        default: 0.2,
        description: 'Randomization factor'
    },
    
    speed: {
        type: 'float',
        min: 0.1,
        max: 3.0,
        default: 1.0,
        description: 'Animation speed multiplier'
    },
    
    hue: {
        type: 'int',
        min: 0,
        max: 360,
        default: 200,
        description: 'Color hue in degrees'
    },
    
    intensity: {
        type: 'float',
        min: 0,
        max: 1,
        default: 0.5,
        description: 'Visual brightness/intensity'
    },
    
    saturation: {
        type: 'float',
        min: 0,
        max: 1,
        default: 0.8,
        description: 'Color saturation level'
    }
};
```

---

## 🎨 System-Specific APIs

### **Faceted System API**
```javascript
/**
 * VIB34D Integrated Engine - Simple geometric patterns
 * Location: src/core/Engine.js
 */
class VIB34DIntegratedEngine {
    /**
     * Initialize 5-layer faceted system
     */
    constructor() {
        this.visualizers = [];      // 5 layer visualizers
        this.parameterManager = new ParameterManager();
        this.currentVariation = 0;  // Current variation index
    }
    
    /**
     * Update visualization parameters
     * @param {Object} params - Parameter updates
     */
    updateParameters(params) {
        this.parameterManager.setParameters(params);
        this.visualizers.forEach(vis => vis.updateParameters(params));
    }
    
    /**
     * Update mouse interaction
     * @param {number} x - Mouse X (0-1)
     * @param {number} y - Mouse Y (0-1) 
     * @param {number} intensity - Interaction intensity (0-1)
     */
    updateInteraction(x, y, intensity) {
        this.visualizers.forEach(vis => vis.updateInteraction(x, y, intensity));
    }
}
```

### **Quantum System API**
```javascript
/**
 * Quantum Engine - Enhanced holographic effects
 * Location: src/quantum/QuantumEngine.js
 */
class QuantumEngine {
    /**
     * Activate/deactivate quantum system
     * @param {boolean} active - System active state
     */
    setActive(active) {
        this.isActive = active;
        const quantumLayers = document.getElementById('quantumLayers');
        quantumLayers.style.display = active ? 'block' : 'none';
    }
    
    /**
     * Update quantum parameters with enhanced mapping
     * @param {string} param - Parameter name
     * @param {number} value - Parameter value
     */
    updateParameter(param, value) {
        this.parameters.setParameter(param, value);
        
        // Apply enhanced quantum effects
        const params = {};
        params[param] = value;
        this.visualizers.forEach(visualizer => {
            visualizer.updateParameters(params);
        });
    }
}
```

### **Holographic System API**
```javascript
/**
 * Real Holographic System - Audio reactive effects
 * Location: src/holograms/RealHolographicSystem.js
 */
class RealHolographicSystem {
    /**
     * Activate holographic system with audio
     * @param {boolean} active - System active state
     */
    setActive(active) {
        this.isActive = active;
        
        if (active && !this.audioEnabled) {
            this.initAudio(); // Start microphone access
        }
        
        const holoLayers = document.getElementById('holographicLayers');
        holoLayers.style.display = active ? 'block' : 'none';
    }
    
    /**
     * Update audio data for visualization
     * @param {Object} audioData - Processed audio data
     * @param {number} audioData.bass - Bass frequency (0-1)
     * @param {number} audioData.mid - Mid frequency (0-1)
     * @param {number} audioData.high - High frequency (0-1)
     * @param {number} audioData.rhythm - Rhythm detection (0-1)
     */
    updateAudio(audioData) {
        this.visualizers.forEach(vis => vis.updateAudio(audioData));
    }
}
```

### **Polychora System API**
```javascript
/**
 * Polychora System - 4D polytope mathematics
 * Location: src/core/PolychoraSystem.js
 */
class PolychoraSystem {
    /**
     * Start polychora system
     */
    async start() {
        await this.initialize();
        this.isRunning = true;
        this.render();
    }
    
    /**
     * Stop polychora system
     */
    stop() {
        this.isRunning = false;
    }
    
    /**
     * Update polytope selection
     * @param {number} polytopeType - Polytope type (0-5)
     * @param {number} polytopeType.0 - 5-Cell (Simplex)
     * @param {number} polytopeType.1 - Tesseract (8-Cell)
     * @param {number} polytopeType.2 - 16-Cell (Cross-polytope)
     * @param {number} polytopeType.3 - 24-Cell
     * @param {number} polytopeType.4 - 600-Cell
     * @param {number} polytopeType.5 - 120-Cell
     */
    setPolytope(polytopeType) {
        this.currentPolytope = polytopeType;
        this.updateVisualization();
    }
}
```

---

## 🎴 Trading Card Generation API

### **TradingCardGenerator Class**
```javascript
/**
 * Smart trading card generation with system detection
 * Location: src/export/TradingCardGenerator.js
 */
class TradingCardGenerator {
    /**
     * Detect currently active visualization system
     * @returns {string} System identifier ('faceted', 'quantum', 'holographic', 'polychora')
     */
    detectCurrentSystem() {
        // Multi-method detection with fallbacks
        // 1. Check active UI button
        // 2. Check global variable
        // 3. Check visible canvas layers
    }
    
    /**
     * Generate trading card from current state
     * @param {string} format - Card format ('classic' or 'social')
     * @returns {Promise<Object>} Generation result with filename and state
     */
    async generateTradingCard(format = 'classic') {
        const state = this.captureCurrentState();
        const canvasImage = await this.captureCanvasImage();
        const cardHTML = this.generateCardHTML(state, canvasImage, format);
        
        return {
            success: true,
            filename: this.generateFilename(state),
            state: state,
            optimizedShaders: this.getSystemShaders(state.system)
        };
    }
    
    /**
     * Capture all 5 canvas layers from current system
     * @returns {Promise<string>} Base64 composite image
     */
    async captureCanvasImage() {
        const systemConfig = this.getSystemConfig(this.currentSystem);
        
        // Composite all 5 layers with proper blend modes
        const compositeCanvas = document.createElement('canvas');
        const ctx = compositeCanvas.getContext('2d');
        
        for (const layerName of systemConfig.layers) {
            const canvas = document.getElementById(systemConfig.prefix + layerName);
            if (canvas) {
                ctx.globalCompositeOperation = this.getBlendMode(layerName);
                ctx.drawImage(canvas, 0, 0);
            }
        }
        
        return compositeCanvas.toDataURL('image/png');
    }
    
    /**
     * Get optimized shaders for specific system
     * @param {string} system - System identifier
     * @returns {Array<string>} Required shader names for system
     */
    getSystemShaders(system) {
        const shaderMap = {
            faceted: ['basic-2d-patterns', 'simple-colors'],
            quantum: ['complex-3d-lattice', 'hsv-colors', 'rgb-glitch', 'volumetric-particles'],
            holographic: ['3d-lattice', 'audio-reactive', 'rgb-glitch', 'frequency-analysis'],
            polychora: ['4d-polytopes', 'distance-functions', 'glassmorphic-rendering']
        };
        return shaderMap[system] || shaderMap.faceted;
    }
}
```

---

## 🖼️ Gallery System API

### **GallerySystem Class**
```javascript
/**
 * Portfolio management with live previews
 * Location: src/gallery/GallerySystem.js
 */
class GallerySystem {
    /**
     * Open gallery modal with all saved variations
     */
    openGallery() {
        this.populateGallery();
        this.galleryModal.style.display = 'block';
    }
    
    /**
     * Load variation into current system
     * @param {number} variationId - Saved variation ID
     * @returns {Promise<boolean>} Load success status
     */
    async loadVariation(variationId) {
        const savedState = UnifiedSaveManager.load(variationId);
        
        // Switch to correct system if needed
        if (savedState.system !== currentSystem) {
            await switchSystem(savedState.system);
        }
        
        // Apply saved parameters
        parameterManager.setParameters(savedState.parameters);
        this.updateVisualization();
        
        return true;
    }
    
    /**
     * Generate live preview for variation
     * @param {Object} variationData - Saved variation data
     * @returns {HTMLCanvasElement} Preview canvas
     */
    generatePreview(variationData) {
        const previewCanvas = document.createElement('canvas');
        previewCanvas.width = 200;
        previewCanvas.height = 200;
        
        // Create miniature version of visualization
        const miniVisualizer = this.createMiniVisualizer(variationData.system);
        miniVisualizer.updateParameters(variationData.parameters);
        miniVisualizer.render();
        
        return previewCanvas;
    }
}
```

---

## 💾 Save/Load System API

### **UnifiedSaveManager Class**
```javascript
/**
 * Unified save/load across all 4 systems
 * Location: src/core/UnifiedSaveManager.js
 */
class UnifiedSaveManager {
    /**
     * Save current visualization state
     * @param {string} customName - Optional custom name
     * @returns {string} Generated variation ID
     */
    static saveCurrentState(customName = null) {
        const currentSystem = detectCurrentSystem();
        const parameters = parameterManager.getAllParameters();
        const systemSpecificData = this.captureSystemSpecific(currentSystem);
        
        const saveData = {
            id: this.generateId(),
            system: currentSystem,
            parameters: parameters,
            systemData: systemSpecificData,
            name: customName || this.generateName(parameters),
            timestamp: Date.now(),
            version: '1.0.0'
        };
        
        localStorage.setItem(`vib34d-save-${saveData.id}`, JSON.stringify(saveData));
        return saveData.id;
    }
    
    /**
     * Load saved variation by ID
     * @param {string} variationId - Saved variation ID
     * @returns {Object|null} Saved variation data
     */
    static load(variationId) {
        const saved = localStorage.getItem(`vib34d-save-${variationId}`);
        return saved ? JSON.parse(saved) : null;
    }
    
    /**
     * Get all saved variations grouped by system
     * @returns {Object} Variations grouped by system type
     */
    static getAllGroupedBySystem() {
        const allSaved = this.getAllSaved();
        return {
            faceted: allSaved.filter(s => s.system === 'faceted'),
            quantum: allSaved.filter(s => s.system === 'quantum'), 
            holographic: allSaved.filter(s => s.system === 'holographic'),
            polychora: allSaved.filter(s => s.system === 'polychora')
        };
    }
}
```

---

## 🎮 Interaction System API

### **InteractionHandler Class**
```javascript
/**
 * Unified input handling across all systems
 * Location: src/utils/InteractionHandler.js
 */
class InteractionHandler {
    /**
     * Initialize interaction system
     * @param {Object} engine - Current system engine
     */
    constructor(engine) {
        this.engine = engine;
        this.setupEventListeners();
    }
    
    /**
     * Handle mouse movement
     * @param {number} x - Mouse X position (0-1)
     * @param {number} y - Mouse Y position (0-1)
     */
    handleMouseMove(x, y) {
        const intensity = this.calculateIntensity(x, y);
        this.engine.updateInteraction(x, y, intensity);
    }
    
    /**
     * Handle touch interaction
     * @param {TouchEvent} event - Touch event
     */
    handleTouch(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const rect = event.target.getBoundingClientRect();
        
        const x = (touch.clientX - rect.left) / rect.width;
        const y = (touch.clientY - rect.top) / rect.height;
        
        this.handleMouseMove(x, y);
    }
    
    /**
     * Handle scroll wheel
     * @param {WheelEvent} event - Wheel event
     */
    handleWheel(event) {
        const delta = event.deltaY * 0.001;
        this.updateParameter('morphFactor', Math.max(0, Math.min(2, 
            parameterManager.getParameter('morphFactor') + delta
        )));
    }
}
```

---

## 🚨 Critical API Constraints

### **Function Accessibility**
- **switchSystem**: Must be globally accessible for HTML onclick handlers
- **selectGeometry**: Must be globally accessible for geometry buttons  
- **updateParameter**: Must be globally accessible for slider events

### **Parameter Validation**
- All parameter values MUST be validated against defined ranges
- Type conversion (int/float) MUST be applied consistently
- Invalid values MUST be clamped to valid range, not rejected

### **System State Management**
- **currentSystem** variable MUST stay synchronized across all components
- Canvas layer visibility MUST be mutually exclusive (only one system visible)
- Engine activation MUST be properly managed (activate new, deactivate old)

### **WebGL Resource Management**
- Each system MUST clean up its WebGL resources when deactivated
- Shader programs MUST be properly deleted to prevent memory leaks
- Canvas contexts MUST be properly released

---

*This API reference provides complete function signatures and usage patterns for the entire VIB34D system architecture.*