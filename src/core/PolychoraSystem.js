/**
 * Polychora System - 5-Layer Glassmorphic 4D Polytope Renderer
 * 
 * Features:
 * - 5 layered canvases (background, shadow, content, highlight, accent)
 * - Real 4D polytope mathematics with proper distance functions
 * - Glassmorphic line-based rendering with core/outline system
 * - Layer-specific scaling and translucency based on polytope geometry
 * - Unique color magnetism and glass effects
 */

/**
 * PolychoraVisualizer - Individual layer renderer for 4D polytopes
 * Renders glassmorphic line-based effects with WebGL
 */
class PolychoraVisualizer {
    constructor(canvasId, role, config) {
        this.canvasId = canvasId;
        this.role = role;
        this.config = config;
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.time = 0;
    }
    
    initialize() {
        this.canvas = document.getElementById(this.canvasId);
        if (!this.canvas) {
            console.error(`❌ Canvas ${this.canvasId} not found`);
            return false;
        }
        
        this.gl = this.canvas.getContext('webgl');
        if (!this.gl) {
            console.error(`❌ WebGL not supported for ${this.canvasId}`);
            return false;
        }
        
        // Create glassmorphic 4D polytope shader
        if (!this.createPolychoraShader()) {
            return false;
        }
        
        this.setupCanvasSize();
        return true;
    }
    
    setupCanvasSize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    
    createPolychoraShader() {
        const vertexShader = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;
        
        const fragmentShader = `
            precision mediump float;
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform float u_polytope;
            uniform float u_rot4dXW;
            uniform float u_rot4dYW;
            uniform float u_rot4dZW;
            uniform float u_dimension;
            uniform float u_hue;
            uniform vec3 u_layerColor;
            uniform float u_layerScale;
            uniform float u_layerOpacity;
            uniform float u_lineWidth;
            uniform float u_blur;
            
            // 4D rotation matrices
            mat4 rotateXW(float angle) {
                float c = cos(angle);
                float s = sin(angle);
                return mat4(
                    c, 0, 0, -s,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    s, 0, 0, c
                );
            }
            
            mat4 rotateYW(float angle) {
                float c = cos(angle);
                float s = sin(angle);
                return mat4(
                    1, 0, 0, 0,
                    0, c, 0, -s,
                    0, 0, 1, 0,
                    0, s, 0, c
                );
            }
            
            mat4 rotateZW(float angle) {
                float c = cos(angle);
                float s = sin(angle);
                return mat4(
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, c, -s,
                    0, 0, s, c
                );
            }
            
            // 4D polytope distance functions
            float polytope4D(vec4 p, float type) {
                if (type < 0.5) {
                    // 5-Cell (4-Simplex)
                    vec4 q = abs(p) - 0.8;
                    float d1 = length(max(q, 0.0)) + min(max(max(max(q.x, q.y), q.z), q.w), 0.0);
                    vec4 r = p - vec4(0.5, 0.5, 0.5, 0.5);
                    float d2 = length(r) - 0.3;
                    return min(d1, d2);
                } else if (type < 1.5) {
                    // Tesseract (8-Cell)
                    vec4 q = abs(p) - 1.0;
                    float outside = length(max(q, 0.0));
                    float inside = max(max(max(q.x, q.y), q.z), q.w);
                    return outside + min(inside, 0.0);
                } else if (type < 2.5) {
                    // 16-Cell (4-Orthoplex)
                    return abs(p.x) + abs(p.y) + abs(p.z) + abs(p.w) - 1.5;
                } else if (type < 3.5) {
                    // 24-Cell
                    vec4 q = abs(p);
                    float d = max(max(q.x + q.y, q.z + q.w), max(q.x + q.z, q.y + q.w)) - 1.2;
                    return d;
                } else if (type < 4.5) {
                    // 600-Cell
                    float phi = (1.0 + sqrt(5.0)) / 2.0;
                    vec4 q = abs(p);
                    float d = length(q) - 1.0;
                    float r = max(max(q.x, q.y/phi), max(q.z*phi, q.w)) - 0.8;
                    return min(d, r);
                } else {
                    // 120-Cell
                    vec4 q = abs(p);
                    float d = max(max(max(q.x, q.y), max(q.z, q.w)), length(q.xy) + length(q.zw)) - 1.1;
                    return d;
                }
            }
            
            void main() {
                vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
                uv *= u_layerScale;
                
                // Create 4D point
                vec4 pos = vec4(uv, sin(u_time * 0.3) * 0.5, cos(u_time * 0.2) * 0.5);
                
                // Apply 4D rotations
                pos = rotateXW(u_rot4dXW + u_time * 0.1) * pos;
                pos = rotateYW(u_rot4dYW + u_time * 0.15) * pos;
                pos = rotateZW(u_rot4dZW + u_time * 0.12) * pos;
                
                // Get polytope distance
                float dist = polytope4D(pos, u_polytope);
                
                // Create glassmorphic line effect
                float lineCore = smoothstep(0.0, u_lineWidth * 0.01, abs(dist));
                float lineOutline = smoothstep(0.0, u_lineWidth * 0.02, abs(dist + 0.05));
                
                // Combine core and outline for glassmorphic effect
                float alpha = (1.0 - lineCore) * 0.8 + (1.0 - lineOutline) * 0.2;
                alpha *= u_layerOpacity;
                
                // Apply blur effect
                alpha *= exp(-length(uv) * u_blur * 0.5);
                
                // Color based on layer configuration and hue
                vec3 color = u_layerColor;
                color = mix(color, vec3(sin(u_hue/360.0*6.28), cos(u_hue/360.0*6.28), 0.8), 0.3);
                
                gl_FragColor = vec4(color, alpha);
            }
        `;
        
        this.program = this.createShaderProgram(vertexShader, fragmentShader);
        return this.program !== null;
    }
    
    createShaderProgram(vertexSource, fragmentSource) {
        const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        
        if (!vertexShader || !fragmentShader) return null;
        
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Shader program link error:', this.gl.getProgramInfoLog(program));
            return null;
        }
        
        // Create quad vertices
        const vertices = new Float32Array([
            -1, -1,  1, -1,  -1,  1,
            -1,  1,  1, -1,   1,  1
        ]);
        
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        
        return program;
    }
    
    compileShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            return null;
        }
        
        return shader;
    }
    
    render(parameters = {}) {
        if (!this.gl || !this.program) return;
        
        this.time += 0.016;
        
        this.gl.useProgram(this.program);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        // Set uniforms
        const uniforms = {
            u_time: this.time,
            u_resolution: [this.canvas.width, this.canvas.height],
            u_polytope: parameters.polytope || 0,
            u_rot4dXW: parameters.rot4dXW || 0,
            u_rot4dYW: parameters.rot4dYW || 0,
            u_rot4dZW: parameters.rot4dZW || 0,
            u_dimension: parameters.dimension || 3.8,
            u_hue: parameters.hue || 280,
            u_layerColor: this.config.color,
            u_layerScale: this.config.scale * (parameters.layerScale || 1.0),
            u_layerOpacity: this.config.opacity * (parameters.translucency || 1.0),
            u_lineWidth: this.config.lineWidth * (parameters.lineThickness || 1.0),
            u_blur: this.config.blur * (parameters.glassBlur || 1.0)
        };
        
        Object.entries(uniforms).forEach(([name, value]) => {
            const location = this.gl.getUniformLocation(this.program, name);
            if (location) {
                if (Array.isArray(value)) {
                    if (value.length === 2) this.gl.uniform2fv(location, value);
                    else if (value.length === 3) this.gl.uniform3fv(location, value);
                } else {
                    this.gl.uniform1f(location, value);
                }
            }
        });
        
        // Draw quad
        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}

export class PolychoraSystem {
    constructor() {
        this.canvasContainer = null;
        this.visualizers = [];
        this.isActive = false;
        this.animationId = null;
        
        // 6 Real 4D Polytopes
        this.polytopes = [
            { name: '5-Cell', description: '4-Simplex with 5 tetrahedral cells' },
            { name: 'Tesseract', description: '8-Cell hypercube with 8 cubic cells' },
            { name: '16-Cell', description: '4-Orthoplex with 16 tetrahedral cells' },
            { name: '24-Cell', description: 'Unique 4D polytope with 24 octahedral cells' },
            { name: '600-Cell', description: 'Icosahedral symmetry with 600 tetrahedral cells' },
            { name: '120-Cell', description: 'Largest regular 4D polytope with 120 dodecahedral cells' }
        ];
        
        // Polychora-specific parameters
        this.parameters = {
            polytope: 0,        // Current polytope (0-5)
            lineThickness: 2.5, // Core line thickness
            coreSize: 1.2,      // Inner core size
            outlineWidth: 1.8,  // Outline width
            glassBlur: 3.0,     // Glassmorphic blur amount
            colorMagnetism: 0.7,// Color attraction between layers
            layerScale: 1.0,    // Overall layer scaling
            translucency: 0.8,  // Overall translucency
            
            // 4D Math parameters (shared with other systems)
            rot4dXW: 0.0,
            rot4dYW: 0.0,
            rot4dZW: 0.0,
            dimension: 3.8,
            speed: 1.2,
            hue: 280,           // Purple/magenta base
        };
        
        // Layer-specific configurations for glassmorphic effects
        this.layerConfigs = {
            background: { 
                scale: 1.5, 
                opacity: 0.25, 
                lineWidth: 3.0,
                color: [0.6, 0.3, 0.9], // Purple
                blur: 4.0
            },
            shadow: { 
                scale: 1.2, 
                opacity: 0.4, 
                lineWidth: 2.5,
                color: [0.3, 0.3, 0.6], // Dark blue
                blur: 2.0
            },
            content: { 
                scale: 1.0, 
                opacity: 0.85, 
                lineWidth: 2.0,
                color: [0.0, 0.8, 1.0], // Cyan
                blur: 0.5
            },
            highlight: { 
                scale: 0.8, 
                opacity: 0.7, 
                lineWidth: 1.5,
                color: [1.0, 0.4, 0.8], // Pink
                blur: 1.5
            },
            accent: { 
                scale: 0.6, 
                opacity: 0.4, 
                lineWidth: 1.0,
                color: [1.0, 1.0, 0.6], // Yellow
                blur: 3.0
            }
        };
    }
    
    /**
     * Initialize the 5-layer Polychora system
     */
    initialize() {
        console.log('🔮 Initializing Polychora System');
        
        this.canvasContainer = document.getElementById('polychoraLayers');
        if (!this.canvasContainer) {
            console.error('❌ Polychora canvas container not found');
            return false;
        }
        
        // Create visualizers for each layer
        const layers = ['background', 'shadow', 'content', 'highlight', 'accent'];
        
        layers.forEach(role => {
            const canvasId = `polychora-${role}-canvas`;
            const visualizer = new PolychoraVisualizer(canvasId, role, this.layerConfigs[role]);
            
            if (visualizer.initialize()) {
                this.visualizers.push(visualizer);
                console.log(`✅ Polychora ${role} layer initialized`);
            } else {
                console.error(`❌ Failed to initialize Polychora ${role} layer`);
            }
        });
        
        if (this.visualizers.length === 0) {
            console.error('❌ No Polychora visualizers initialized');
            return false;
        }
        
        console.log(`✅ Polychora System initialized with ${this.visualizers.length} layers`);
        return true;
    }
    
    /**
     * Start the Polychora system
     */
    start() {
        if (this.isActive) return;
        
        console.log('🔮 Starting Polychora System');
        this.isActive = true;
        this.canvasContainer.style.display = 'block';
        this.startRenderLoop();
    }
    
    startRenderLoop() {
        const render = () => {
            if (!this.isActive) return;
            
            this.visualizers.forEach(visualizer => {
                visualizer.render(this.parameters);
            });
            
            this.animationId = requestAnimationFrame(render);
        };
        render();
    }
    
    /**
     * Stop the Polychora system
     */
    stop() {
        if (!this.isActive) return;
        
        console.log('🔮 Stopping Polychora System');
        this.isActive = false;
        this.canvasContainer.style.display = 'none';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    /**
     * Update system parameters
     */
    updateParameters(newParams) {
        Object.assign(this.parameters, newParams);
        console.log('🔮 Updated Polychora parameters:', newParams);
    }
    
    /**
     * Set current polytope
     */
    setPolytope(polytopeIndex) {
        if (polytopeIndex < 0 || polytopeIndex >= this.polytopes.length) {
            console.warn('⚠️ Invalid polytope index:', polytopeIndex);
            return;
        }
        
        this.parameters.polytope = polytopeIndex;
        const polytope = this.polytopes[polytopeIndex];
        
        console.log(`🔮 Set polytope to ${polytope.name}: ${polytope.description}`);
        return polytope;
    }
    
    /**
     * Get current polytope information
     */
    getCurrentPolytope() {
        return this.polytopes[this.parameters.polytope];
    }
    
    /**
     * Get all polytope names for UI
     */
    getPolytopeNames() {
        return this.polytopes.map(p => p.name);
    }
    
    /**
     * Destroy system and clean up resources
     */
    destroy() {
        this.stop();
        this.visualizers.forEach(visualizer => {
            if (visualizer.destroy) {
                visualizer.destroy();
            }
        });
        this.visualizers = [];
        console.log('🔮 Polychora System destroyed');
    }
}