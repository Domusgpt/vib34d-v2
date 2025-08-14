/**
 * Mobile WebGL Context Manager
 * Manages WebGL context lifecycle on mobile devices to stay within GPU limits
 * Only keeps 5 contexts active at a time (current system only)
 */

class MobileContextManager {
    constructor() {
        this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.activeContexts = new Map(); // canvas id -> context
        this.maxContexts = 5; // Mobile GPU limit
        this.currentSystem = null;
    }

    /**
     * Switch to a new system, destroying previous contexts on mobile
     */
    switchSystem(newSystem) {
        console.log(`📱 Mobile Context Manager: Switching from ${this.currentSystem} to ${newSystem}`);
        
        if (!this.isMobile) {
            console.log('💻 Desktop mode - keeping all contexts');
            this.currentSystem = newSystem;
            return;
        }

        // On mobile, we need to destroy previous system's contexts
        if (this.currentSystem && this.currentSystem !== newSystem) {
            this.destroySystemContexts(this.currentSystem);
        }

        this.currentSystem = newSystem;
    }

    /**
     * Destroy all WebGL contexts for a specific system
     */
    destroySystemContexts(system) {
        console.log(`🗑️ Destroying WebGL contexts for ${system} system`);
        
        const canvasIds = this.getSystemCanvasIds(system);
        let destroyed = 0;

        canvasIds.forEach(canvasId => {
            const canvas = document.getElementById(canvasId);
            if (canvas) {
                // Get the WebGL context
                const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
                if (gl) {
                    // Destroy the context
                    const loseContext = gl.getExtension('WEBGL_lose_context');
                    if (loseContext) {
                        loseContext.loseContext();
                        destroyed++;
                        console.log(`❌ Destroyed WebGL context for ${canvasId}`);
                    }
                }

                // Clear the canvas
                canvas.width = 1;
                canvas.height = 1;
                
                // Remove from active contexts
                this.activeContexts.delete(canvasId);
            }
        });

        console.log(`✅ Destroyed ${destroyed} WebGL contexts for ${system}`);
    }

    /**
     * Get canvas IDs for a specific system
     */
    getSystemCanvasIds(system) {
        const systemCanvasMap = {
            'faceted': [
                'background-canvas',
                'shadow-canvas',
                'content-canvas',
                'highlight-canvas',
                'accent-canvas'
            ],
            'quantum': [
                'quantum-background-canvas',
                'quantum-shadow-canvas',
                'quantum-content-canvas',
                'quantum-highlight-canvas',
                'quantum-accent-canvas'
            ],
            'holographic': [
                'holo-background-canvas',
                'holo-shadow-canvas',
                'holo-content-canvas',
                'holo-highlight-canvas',
                'holo-accent-canvas'
            ],
            'polychora': [
                'polychora-background-canvas',
                'polychora-shadow-canvas',
                'polychora-content-canvas',
                'polychora-highlight-canvas',
                'polychora-accent-canvas'
            ]
        };

        return systemCanvasMap[system] || [];
    }

    /**
     * Register a new WebGL context
     */
    registerContext(canvasId, context) {
        if (!this.isMobile) return;

        this.activeContexts.set(canvasId, context);
        console.log(`📱 Registered context for ${canvasId} (${this.activeContexts.size}/${this.maxContexts} active)`);

        // Warn if exceeding limit
        if (this.activeContexts.size > this.maxContexts) {
            console.warn(`⚠️ Exceeding mobile WebGL context limit! ${this.activeContexts.size} > ${this.maxContexts}`);
        }
    }

    /**
     * Get active context count
     */
    getActiveContextCount() {
        return this.activeContexts.size;
    }

    /**
     * Check if we're at the context limit
     */
    isAtLimit() {
        return this.isMobile && this.activeContexts.size >= this.maxContexts;
    }

    /**
     * Force cleanup of all contexts (emergency use)
     */
    forceCleanup() {
        console.log('🧹 Force cleanup of all WebGL contexts');
        
        this.activeContexts.forEach((context, canvasId) => {
            const canvas = document.getElementById(canvasId);
            if (canvas) {
                const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
                if (gl) {
                    const loseContext = gl.getExtension('WEBGL_lose_context');
                    if (loseContext) {
                        loseContext.loseContext();
                    }
                }
                canvas.width = 1;
                canvas.height = 1;
            }
        });

        this.activeContexts.clear();
        console.log('✅ All contexts cleaned up');
    }

    /**
     * Prepare canvases for a system (mobile optimization)
     */
    prepareSystemCanvases(system) {
        if (!this.isMobile) return;

        console.log(`📱 Preparing canvases for ${system} system`);
        
        const canvasIds = this.getSystemCanvasIds(system);
        const container = document.querySelector('.canvas-container');
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for mobile

        canvasIds.forEach(canvasId => {
            const canvas = document.getElementById(canvasId);
            if (canvas) {
                // Set proper dimensions before context creation
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                canvas.style.width = rect.width + 'px';
                canvas.style.height = rect.height + 'px';
                
                console.log(`✅ Prepared ${canvasId}: ${canvas.width}x${canvas.height}`);
            }
        });
    }
}

// Global instance
window.mobileContextManager = new MobileContextManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileContextManager;
}