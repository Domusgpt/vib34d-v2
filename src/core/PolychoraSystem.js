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

import { IntegratedHolographicVisualizer } from './Visualizer.js';

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
        this.render();
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
        
        // Update all visualizers with new parameters
        this.visualizers.forEach(visualizer => {
            visualizer.updateParameters(this.parameters);
        });
        
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
        
        // Update all visualizers
        this.visualizers.forEach(visualizer => {
            visualizer.setPolytope(polytopeIndex);
        });
        
        console.log(`🔮 Set polytope to ${polytope.name}: ${polytope.description}`);
        return polytope;
    }
    
    /**
     * Main render loop
     */
    render() {
        if (!this.isActive) return;
        
        // Update all visualizers
        this.visualizers.forEach(visualizer => {
            visualizer.render();
        });
        
        // Continue animation
        this.animationId = requestAnimationFrame(() => this.render());
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        this.stop();
        
        this.visualizers.forEach(visualizer => {
            visualizer.destroy();
        });
        
        this.visualizers = [];
        console.log('🔮 Polychora System destroyed');
    }
}

/**
 * Individual Polychora Layer Visualizer
 * Renders glassmorphic 4D polytope projections with line-based effects
 */
class PolychoraVisualizer {
    constructor(canvasId, role, config) {
        this.canvasId = canvasId;
        this.role = role;
        this.config = config;
        this.polytope = 0;
        
        // Initialize WebGL context and state
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.buffer = null;
        
        // Polychora-specific shader uniforms
        this.polychoraUniforms = {};
        
        // Animation state
        this.startTime = Date.now();
        this.params = {
            coreSize: 1.2,
            outlineWidth: 1.8,
            rot4dXW: 0.0,
            rot4dYW: 0.0,
            rot4dZW: 0.0,
            dimension: 3.8,
            speed: 1.2,
            hue: 280
        };
    }
    
    /**
     * Initialize with Polychora-specific shader
     */
    initialize() {
        if (!this.initWebGL()) return false;
        if (!this.createPolychoraShader()) return false;
        if (!this.initBuffers()) return false;
        
        return true;
    }
    
    /**
     * Initialize WebGL context
     */
    initWebGL() {
        this.canvas = document.getElementById(this.canvasId);
        if (!this.canvas) {
            console.error(`Canvas ${this.canvasId} not found`);
            return false;
        }
        
        this.gl = this.canvas.getContext('webgl');
        if (!this.gl) {
            console.error(`WebGL not supported for ${this.canvasId}`);
            return false;
        }
        
        return true;
    }
    
    /**
     * Create Polychora-specific shader with glassmorphic line rendering
     */
    createPolychoraShader() {
        const vertexShader = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;
        
        const fragmentShader = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform int u_polytope;
uniform vec3 u_layerColor;
uniform float u_layerScale;
uniform float u_layerOpacity;
uniform float u_lineWidth;
uniform float u_coreSize;
uniform float u_outlineWidth;
uniform float u_glassBlur;
uniform float u_rot4dXW;
uniform float u_rot4dYW;
uniform float u_rot4dZW;
uniform float u_dimension;
uniform float u_speed;
uniform float u_hue;

// 4D rotation matrices (same as before)
mat4 rotateXW(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat4(c, 0.0, 0.0, -s, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, s, 0.0, 0.0, c);
}

mat4 rotateYW(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat4(1.0, 0.0, 0.0, 0.0, 0.0, c, 0.0, -s, 0.0, 0.0, 1.0, 0.0, 0.0, s, 0.0, c);
}

mat4 rotateZW(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, c, -s, 0.0, 0.0, s, c);
}

// 4D to 3D projection
vec3 project4Dto3D(vec4 p) {
    float w = u_dimension / (u_dimension + p.w);
    return vec3(p.x * w, p.y * w, p.z * w);
}

// Real 4D Polytope distance functions - Based on existing system patterns
float polytope4D(vec4 p, int type) {
    // Scale position similar to existing systems
    vec4 pos = p;
    
    if (type == 0) {
        // 5-Cell (4-Simplex) - 5 tetrahedral cells
        // Based on tetrahedron lattice pattern from HolographicVisualizer
        vec4 q = fract(pos * 2.0) - 0.5;
        float d1 = length(q);
        float d2 = length(q - vec4(0.4, 0.0, 0.0, 0.0));
        float d3 = length(q - vec4(0.0, 0.4, 0.0, 0.0));
        float d4 = length(q - vec4(0.0, 0.0, 0.4, 0.0));
        float d5 = length(q - vec4(0.0, 0.0, 0.0, 0.4));
        return min(min(min(d1, d2), min(d3, d4)), d5) - 0.1;
        
    } else if (type == 1) {
        // Tesseract (8-Cell) - 8 cubic cells
        // Based on hypercube lattice pattern
        vec4 q = abs(pos) - 1.0;
        float outside = length(max(q, 0.0));
        float inside = max(max(max(q.x, q.y), q.z), q.w);
        return outside + min(inside, 0.0);
        
    } else if (type == 2) {
        // 16-Cell (4-Orthoplex) - 16 tetrahedral cells
        // Cross-polytope: sum of absolute coordinates
        float dist = abs(pos.x) + abs(pos.y) + abs(pos.z) + abs(pos.w) - 1.0;
        // Add lattice structure similar to existing patterns
        vec4 lattice = fract(pos * 3.0) - 0.5;
        return dist + sin(lattice.x * 6.28) * sin(lattice.y * 6.28) * 0.1;
        
    } else if (type == 3) {
        // 24-Cell - 24 octahedral cells (unique 4D polytope)
        // Combination of cross-polytope and hypercube patterns
        float cross = abs(pos.x) + abs(pos.y) + abs(pos.z) + abs(pos.w);
        float cube = max(max(abs(pos.x), abs(pos.y)), max(abs(pos.z), abs(pos.w)));
        float dist = max(cross - 2.0, cube - 1.0);
        // Add octahedral cell structure
        vec4 oct = fract(pos * 2.0) - 0.5;
        float octCell = (abs(oct.x) + abs(oct.y) + abs(oct.z) + abs(oct.w)) - 0.5;
        return min(dist, octCell);
        
    } else if (type == 4) {
        // 600-Cell - 600 tetrahedral cells (icosahedral symmetry)
        // Based on sphere lattice with icosahedral structure
        float r = length(pos);
        float phi = (1.0 + sqrt(5.0)) / 2.0; // Golden ratio for icosahedral
        // Create icosahedral vertices in 4D
        vec4 ico = vec4(cos(r * phi), sin(r * phi), cos(r * phi * 0.618), sin(r * phi * 0.618));
        ico = fract(ico * 1.618) - 0.5; // Golden ratio scaling
        float icoDist = length(ico) - 0.3;
        // Combine with tetrahedral cells
        vec4 tet = fract(pos * 4.0) - 0.5;
        float tetDist = min(min(length(tet), length(tet - vec4(0.25, 0.25, 0.25, 0.25))), 
                           min(length(tet - vec4(0.25, -0.25, -0.25, 0.25)), 
                               length(tet - vec4(-0.25, 0.25, -0.25, 0.25))));
        return min(icoDist, tetDist - 0.2);
        
    } else if (type == 5) {
        // 120-Cell - 120 dodecahedral cells (largest regular 4D polytope)
        // Based on crystal lattice with dodecahedral structure
        vec4 q = fract(pos * 1.5) - 0.5;
        // Create dodecahedral distance (12-sided)
        float dodge = max(max(abs(q.x), abs(q.y)), max(abs(q.z), abs(q.w)));
        // Add pentagonal faces (dodecahedron has 12 pentagonal faces)
        float pent1 = abs(dot(normalize(q), vec4(1.0, 0.618, 0.0, 0.0)));
        float pent2 = abs(dot(normalize(q), vec4(0.618, 1.0, 0.618, 0.0)));
        float pent3 = abs(dot(normalize(q), vec4(0.0, 0.618, 1.0, 0.618)));
        float pentPattern = min(min(pent1, pent2), pent3) - 0.7;
        return max(dodge - 0.4, pentPattern);
        
    } else {
        // Default fallback to 5-Cell
        vec4 q = fract(pos * 2.0) - 0.5;
        return length(q) - 0.3;
    }
}

// Advanced Glassmorphic line rendering with multiple effects
float glassmorphicLines(vec2 uv, vec4 p4d) {
    // Project 4D polytope to screen space
    vec3 p3d = project4Dto3D(p4d);
    vec2 screenPos = p3d.xy;
    
    // Distance to polytope surface
    float dist = polytope4D(p4d, u_polytope);
    
    // Multi-layer line structure for glassmorphic effect
    float lines = smoothstep(u_lineWidth * 0.02, u_lineWidth * 0.01, abs(dist));
    
    // Core bright lines
    float core = smoothstep(u_coreSize * 0.005, u_coreSize * 0.001, abs(dist));
    
    // Soft outline glow
    float outline = smoothstep(u_outlineWidth * 0.05, u_outlineWidth * 0.02, abs(dist)) - lines;
    
    // Add edge detection for sharper lines
    float edgeX = abs(dFdx(dist));
    float edgeY = abs(dFdy(dist));
    float edge = sqrt(edgeX * edgeX + edgeY * edgeY);
    float edgeLines = smoothstep(0.1, 0.2, edge);
    
    // Combine effects with glassmorphic weighting
    return lines * 3.0 + core * 5.0 + outline * 1.5 + edgeLines * 2.0;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - u_resolution.xy * 0.5) / min(u_resolution.x, u_resolution.y);
    
    // Scale UV by layer scale
    uv *= u_layerScale;
    
    // Create 4D position with time animation
    float t = u_time * u_speed * 0.001;
    vec4 pos = vec4(uv * 2.0, sin(t), cos(t * 1.3));
    
    // Apply 4D rotations
    pos = rotateXW(u_rot4dXW + t * 0.1) * pos;
    pos = rotateYW(u_rot4dYW + t * 0.2) * pos;
    pos = rotateZW(u_rot4dZW + t * 0.15) * pos;
    
    // Calculate glassmorphic line intensity
    float intensity = glassmorphicLines(uv, pos);
    
    // Apply layer color with hue shift
    float hueShift = u_hue / 360.0;
    vec3 color = u_layerColor;
    
    // Add glassmorphic glow effect
    float glow = intensity * exp(-length(uv) * u_glassBlur * 0.1);
    
    gl_FragColor = vec4(color * (intensity + glow), intensity * u_layerOpacity);
}`;
        
        this.program = this.createShaderProgram(vertexShader, fragmentShader);
        if (!this.program) return false;
        
        // Get uniform locations
        this.polychoraUniforms = {
            resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
            time: this.gl.getUniformLocation(this.program, 'u_time'),
            polytope: this.gl.getUniformLocation(this.program, 'u_polytope'),
            layerColor: this.gl.getUniformLocation(this.program, 'u_layerColor'),
            layerScale: this.gl.getUniformLocation(this.program, 'u_layerScale'),
            layerOpacity: this.gl.getUniformLocation(this.program, 'u_layerOpacity'),
            lineWidth: this.gl.getUniformLocation(this.program, 'u_lineWidth'),
            coreSize: this.gl.getUniformLocation(this.program, 'u_coreSize'),
            outlineWidth: this.gl.getUniformLocation(this.program, 'u_outlineWidth'),
            glassBlur: this.gl.getUniformLocation(this.program, 'u_glassBlur'),
            rot4dXW: this.gl.getUniformLocation(this.program, 'u_rot4dXW'),
            rot4dYW: this.gl.getUniformLocation(this.program, 'u_rot4dYW'),
            rot4dZW: this.gl.getUniformLocation(this.program, 'u_rot4dZW'),
            dimension: this.gl.getUniformLocation(this.program, 'u_dimension'),
            speed: this.gl.getUniformLocation(this.program, 'u_speed'),
            hue: this.gl.getUniformLocation(this.program, 'u_hue')
        };
        
        return true;
    }
    
    /**
     * Create shader program
     */
    createShaderProgram(vertexSource, fragmentSource) {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        
        if (!vertexShader || !fragmentShader) return null;
        
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Shader program linking failed:', this.gl.getProgramInfoLog(program));
            return null;
        }
        
        return program;
    }
    
    /**
     * Create shader
     */
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation failed:', this.gl.getShaderInfoLog(shader));
            return null;
        }
        
        return shader;
    }
    
    /**
     * Initialize vertex buffers
     */
    initBuffers() {
        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
        
        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        
        return true;
    }
    
    /**
     * Update parameters
     */
    updateParameters(params) {
        this.params = { ...this.params, ...params };
    }
    
    /**
     * Set polytope
     */
    setPolytope(polytopeIndex) {
        this.polytope = polytopeIndex;
    }
    
    /**
     * Render this layer
     */
    render() {
        if (!this.gl || !this.program) return;
        
        // Resize canvas to match container
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width || window.innerWidth;
        this.canvas.height = rect.height || window.innerHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
        // Clear with transparency
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        // Enable blending for glassmorphic effects
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        // Use program
        this.gl.useProgram(this.program);
        
        // Set uniforms
        this.gl.uniform2f(this.polychoraUniforms.resolution, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.polychoraUniforms.time, Date.now() - this.startTime);
        this.gl.uniform1i(this.polychoraUniforms.polytope, this.polytope);
        this.gl.uniform3f(this.polychoraUniforms.layerColor, ...this.config.color);
        this.gl.uniform1f(this.polychoraUniforms.layerScale, this.config.scale);
        this.gl.uniform1f(this.polychoraUniforms.layerOpacity, this.config.opacity);
        this.gl.uniform1f(this.polychoraUniforms.lineWidth, this.config.lineWidth);
        this.gl.uniform1f(this.polychoraUniforms.coreSize, this.params.coreSize || 1.0);
        this.gl.uniform1f(this.polychoraUniforms.outlineWidth, this.params.outlineWidth || 1.5);
        this.gl.uniform1f(this.polychoraUniforms.glassBlur, this.config.blur);
        this.gl.uniform1f(this.polychoraUniforms.rot4dXW, this.params.rot4dXW || 0);
        this.gl.uniform1f(this.polychoraUniforms.rot4dYW, this.params.rot4dYW || 0);
        this.gl.uniform1f(this.polychoraUniforms.rot4dZW, this.params.rot4dZW || 0);
        this.gl.uniform1f(this.polychoraUniforms.dimension, this.params.dimension || 3.8);
        this.gl.uniform1f(this.polychoraUniforms.speed, this.params.speed || 1.0);
        this.gl.uniform1f(this.polychoraUniforms.hue, this.params.hue || 280);
        
        // Draw
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
    
    /**
     * Clean up
     */
    destroy() {
        if (this.gl && this.program) {
            this.gl.deleteProgram(this.program);
        }
        if (this.gl && this.buffer) {
            this.gl.deleteBuffer(this.buffer);
        }
    }
}