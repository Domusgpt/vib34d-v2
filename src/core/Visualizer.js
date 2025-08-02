/**
 * VIB34D Integrated Holographic Visualizer
 * WebGL-based renderer for individual holographic layers
 */

import { GeometryLibrary } from '../geometry/GeometryLibrary.js';

export class IntegratedHolographicVisualizer {
    constructor(canvasId, role, reactivity, variant) {
        this.canvas = document.getElementById(canvasId);
        this.role = role;
        this.reactivity = reactivity;
        this.variant = variant;
        this.gl = this.canvas.getContext('webgl');
        
        if (!this.gl) {
            console.error(`WebGL not supported for ${canvasId}`);
            return;
        }
        
        this.mouseX = 0.5;
        this.mouseY = 0.5;
        this.mouseIntensity = 0.0;
        this.clickIntensity = 0.0;
        this.startTime = Date.now();
        
        // Default parameters
        this.params = {
            geometry: 0,
            gridDensity: 15,
            morphFactor: 1.0,
            chaos: 0.2,
            speed: 1.0,
            hue: 200,
            dimension: 3.5,
            rot4dXW: 0.0,
            rot4dYW: 0.0,
            rot4dZW: 0.0
        };
        
        this.init();
    }
    
    /**
     * Initialize WebGL rendering pipeline
     */
    init() {
        this.initShaders();
        this.initBuffers();
        this.resize();
    }
    
    /**
     * Initialize shaders with 4D mathematics
     */
    initShaders() {
        const vertexShaderSource = `attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;
        
        const fragmentShaderSource = `precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_geometry;
uniform float u_gridDensity;
uniform float u_morphFactor;
uniform float u_chaos;
uniform float u_speed;
uniform float u_hue;
uniform float u_dimension;
uniform float u_rot4dXW;
uniform float u_rot4dYW;
uniform float u_rot4dZW;
uniform float u_mouseIntensity;
uniform float u_clickIntensity;
uniform float u_roleIntensity;

// 4D rotation matrices
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

vec3 project4Dto3D(vec4 p) {
    float w = 2.5 / (2.5 + p.w);
    return vec3(p.x * w, p.y * w, p.z * w);
}

// Simplified geometry functions for WebGL 1.0 compatibility
float geometryFunction(vec4 p) {
    int geomType = int(u_geometry);
    
    if (geomType == 0) {
        // Tetrahedron lattice
        vec4 pos = fract(p * u_gridDensity * 0.1);
        vec4 dist = min(pos, 1.0 - pos);
        return min(min(dist.x, dist.y), min(dist.z, dist.w)) * u_morphFactor;
    }
    else if (geomType == 1) {
        // Hypercube lattice
        vec4 pos = fract(p * u_gridDensity * 0.1);
        vec4 dist = min(pos, 1.0 - pos);
        float minDist = min(min(dist.x, dist.y), min(dist.z, dist.w));
        return minDist * u_morphFactor;
    }
    else if (geomType == 2) {
        // Sphere lattice
        float r = length(p);
        float density = u_gridDensity * 0.05;
        float spheres = abs(fract(r * density) - 0.5) * 2.0;
        float theta = atan(p.y, p.x);
        float harmonics = sin(theta * 3.0) * 0.2;
        return (spheres + harmonics) * u_morphFactor;
    }
    else if (geomType == 3) {
        // Torus lattice
        float r1 = length(p.xy) - 2.0;
        float torus = length(vec2(r1, p.z)) - 0.8;
        float lattice = sin(p.x * u_gridDensity * 0.08) * sin(p.y * u_gridDensity * 0.08);
        return (torus + lattice * 0.3) * u_morphFactor;
    }
    else if (geomType == 4) {
        // Klein bottle lattice
        float u = atan(p.y, p.x);
        float v = atan(p.w, p.z);
        float dist = length(p) - 2.0;
        float lattice = sin(u * u_gridDensity * 0.06) * sin(v * u_gridDensity * 0.03);
        return (dist + lattice * 0.4) * u_morphFactor;
    }
    else if (geomType == 5) {
        // Fractal lattice
        vec4 pos = abs(p);
        pos = pos * 2.0 - 1.0;
        float dist = length(max(abs(pos) - 1.0, 0.0));
        return dist * u_morphFactor;
    }
    else if (geomType == 6) {
        // Wave lattice
        float freq = u_gridDensity * 0.1;
        float time = u_time * 0.001 * u_speed;
        float wave1 = sin(p.x * freq + time);
        float wave2 = sin(p.y * freq + time * 1.3);
        float interference = wave1 * wave2;
        return interference * u_morphFactor;
    }
    else if (geomType == 7) {
        // Crystal lattice
        vec4 pos = fract(p * u_gridDensity * 0.12) - 0.5;
        float cube = max(max(abs(pos.x), abs(pos.y)), max(abs(pos.z), abs(pos.w)));
        return cube * u_morphFactor;
    }
    else {
        // Default hypercube
        vec4 pos = fract(p * u_gridDensity * 0.1);
        vec4 dist = min(pos, 1.0 - pos);
        return min(min(dist.x, dist.y), min(dist.z, dist.w)) * u_morphFactor;
    }
}

void main() {
    vec2 uv = (gl_FragCoord.xy - u_resolution.xy * 0.5) / min(u_resolution.x, u_resolution.y);
    
    // 4D position with mouse interaction
    vec4 pos = vec4(uv * 3.0, sin(u_time * 0.0003), cos(u_time * 0.0002));
    pos.xy += (u_mouse - 0.5) * u_mouseIntensity * 2.0;
    
    // Apply 4D rotations
    pos = rotateXW(u_rot4dXW) * pos;
    pos = rotateYW(u_rot4dYW) * pos;
    pos = rotateZW(u_rot4dZW) * pos;
    
    // Calculate geometry value
    float value = geometryFunction(pos);
    
    // Apply chaos
    float noise = sin(pos.x * 7.0) * cos(pos.y * 11.0) * sin(pos.z * 13.0);
    value += noise * u_chaos;
    
    // Color based on geometry value and hue
    float intensity = 1.0 - clamp(abs(value), 0.0, 1.0);
    intensity += u_clickIntensity * 0.3;
    
    float hue = u_hue / 360.0 + value * 0.1;
    vec3 color = vec3(
        sin(hue * 6.28318 + 0.0) * 0.5 + 0.5,
        sin(hue * 6.28318 + 2.0943) * 0.5 + 0.5,
        sin(hue * 6.28318 + 4.1887) * 0.5 + 0.5
    ) * intensity;
    
    gl_FragColor = vec4(color, intensity * u_roleIntensity);
}`;
        
        this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
        this.uniforms = {
            resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
            time: this.gl.getUniformLocation(this.program, 'u_time'),
            mouse: this.gl.getUniformLocation(this.program, 'u_mouse'),
            geometry: this.gl.getUniformLocation(this.program, 'u_geometry'),
            gridDensity: this.gl.getUniformLocation(this.program, 'u_gridDensity'),
            morphFactor: this.gl.getUniformLocation(this.program, 'u_morphFactor'),
            chaos: this.gl.getUniformLocation(this.program, 'u_chaos'),
            speed: this.gl.getUniformLocation(this.program, 'u_speed'),
            hue: this.gl.getUniformLocation(this.program, 'u_hue'),
            dimension: this.gl.getUniformLocation(this.program, 'u_dimension'),
            rot4dXW: this.gl.getUniformLocation(this.program, 'u_rot4dXW'),
            rot4dYW: this.gl.getUniformLocation(this.program, 'u_rot4dYW'),
            rot4dZW: this.gl.getUniformLocation(this.program, 'u_rot4dZW'),
            mouseIntensity: this.gl.getUniformLocation(this.program, 'u_mouseIntensity'),
            clickIntensity: this.gl.getUniformLocation(this.program, 'u_clickIntensity'),
            roleIntensity: this.gl.getUniformLocation(this.program, 'u_roleIntensity')
        };
    }
    
    /**
     * Create WebGL program from shaders
     */
    createProgram(vertexSource, fragmentSource) {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        
        if (!vertexShader || !fragmentShader) {
            return null;
        }
        
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Program linking failed:', this.gl.getProgramInfoLog(program));
            return null;
        }
        
        return program;
    }
    
    /**
     * Create individual shader
     */
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation failed:', this.gl.getShaderInfoLog(shader));
            console.error('Shader source:', source);
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
    }
    
    /**
     * Resize canvas and viewport
     */
    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Update visualization parameters
     */
    updateParameters(params) {
        this.params = { ...this.params, ...params };
    }
    
    /**
     * Update mouse interaction state
     */
    updateInteraction(x, y, intensity) {
        this.mouseX = x;
        this.mouseY = y;
        this.mouseIntensity = intensity;
    }
    
    /**
     * Render frame
     */
    render() {
        if (!this.program) return;
        
        this.resize();
        this.gl.useProgram(this.program);
        
        // Role-specific intensity
        const roleIntensities = {
            'background': 0.3,
            'shadow': 0.5,
            'content': 0.8,
            'highlight': 1.0,
            'accent': 1.2
        };
        
        const time = Date.now() - this.startTime;
        
        // Set uniforms
        this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.uniforms.time, time);
        this.gl.uniform2f(this.uniforms.mouse, this.mouseX, this.mouseY);
        this.gl.uniform1f(this.uniforms.geometry, this.params.geometry);
        this.gl.uniform1f(this.uniforms.gridDensity, this.params.gridDensity);
        this.gl.uniform1f(this.uniforms.morphFactor, this.params.morphFactor);
        this.gl.uniform1f(this.uniforms.chaos, this.params.chaos);
        this.gl.uniform1f(this.uniforms.speed, this.params.speed);
        this.gl.uniform1f(this.uniforms.hue, this.params.hue);
        this.gl.uniform1f(this.uniforms.dimension, this.params.dimension);
        this.gl.uniform1f(this.uniforms.rot4dXW, this.params.rot4dXW);
        this.gl.uniform1f(this.uniforms.rot4dYW, this.params.rot4dYW);
        this.gl.uniform1f(this.uniforms.rot4dZW, this.params.rot4dZW);
        this.gl.uniform1f(this.uniforms.mouseIntensity, this.mouseIntensity);
        this.gl.uniform1f(this.uniforms.clickIntensity, this.clickIntensity);
        this.gl.uniform1f(this.uniforms.roleIntensity, roleIntensities[this.role] || 1.0);
        
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
    
    /**
     * Clean up WebGL resources
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