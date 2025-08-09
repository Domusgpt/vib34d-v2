/**
 * Trading Card Generator - Creates personalized trading cards from current visualization
 * Allows users to export their current VIB34D state as a shareable trading card
 */

export class TradingCardGenerator {
    constructor(engine) {
        this.engine = engine;
        this.currentSystem = window.currentSystem || 'faceted';
    }
    
    /**
     * Generate a trading card from current visualization state
     */
    async generateTradingCard(format = 'classic') {
        console.log('🎴 Generating trading card from current state...');
        
        // Capture current parameters
        const state = this.captureCurrentState();
        
        // Capture the actual canvas visual as base64 image
        const canvasImage = await this.captureCanvasImage();
        
        // Generate card HTML based on format
        const cardHTML = format === 'social' ? 
            this.generateSocialCard(state, canvasImage) : 
            this.generateClassicCard(state, canvasImage);
        
        // Create blob and download
        const blob = new Blob([cardHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `vib34d-card-${state.geometry.toLowerCase()}-${timestamp}.html`;
        
        // Trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        console.log(`🎴 Trading card generated: ${filename}`);
        
        // Show success message
        if (this.engine?.statusManager) {
            this.engine.statusManager.success(
                `🎴 Trading Card Created!<br>` +
                `<strong>${state.name}</strong><br>` +
                `Format: ${format === 'social' ? 'Social Media' : 'Classic'}<br>` +
                `<small>File: ${filename}</small>`
            );
        }
        
        return { success: true, filename, state };
    }
    
    /**
     * Capture the actual canvas as an image
     */
    async captureCanvasImage() {
        console.log('📸 Capturing actual canvas visualization...');
        
        // Find the active canvas based on current system
        let canvas = null;
        const systemCanvasMap = {
            'faceted': ['faceted-content-canvas', 'faceted-highlight-canvas'],
            'holographic': ['holo-content-canvas', 'holo-highlight-canvas'],
            'polychora': ['polychora-content-canvas', 'polychora-highlight-canvas']
        };
        
        // Try to get the most visible canvas from the current system
        const canvasIds = systemCanvasMap[this.currentSystem] || [];
        for (const id of canvasIds) {
            const c = document.getElementById(id);
            if (c && c.getContext) {
                canvas = c;
                break;
            }
        }
        
        // Fallback to any visible canvas
        if (!canvas) {
            const allCanvases = document.querySelectorAll('canvas');
            for (const c of allCanvases) {
                if (c.offsetParent !== null && c.width > 0 && c.height > 0) {
                    canvas = c;
                    break;
                }
            }
        }
        
        if (!canvas) {
            console.warn('⚠️ No active canvas found, using placeholder');
            return null;
        }
        
        try {
            // Create a composite canvas to capture all layers
            const compositeCanvas = document.createElement('canvas');
            const targetWidth = 800;
            const targetHeight = 600;
            compositeCanvas.width = targetWidth;
            compositeCanvas.height = targetHeight;
            const ctx = compositeCanvas.getContext('2d');
            
            // Black background
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, targetWidth, targetHeight);
            
            // Draw gradient background
            const gradient = ctx.createRadialGradient(
                targetWidth/2, targetHeight/2, 0,
                targetWidth/2, targetHeight/2, targetWidth/2
            );
            const hue = this.engine?.parameterManager?.getParameter('hue') || 200;
            gradient.addColorStop(0, `hsla(${hue}, 80%, 50%, 0.1)`);
            gradient.addColorStop(0.5, `hsla(${(hue + 60) % 360}, 60%, 40%, 0.05)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, targetWidth, targetHeight);
            
            // Draw all canvases from current system
            const layerOrder = ['background', 'shadow', 'content', 'highlight', 'accent'];
            for (const layer of layerOrder) {
                const layerId = this.currentSystem === 'faceted' ? 
                    `faceted-${layer}-canvas` : 
                    this.currentSystem === 'holographic' ? 
                    `holo-${layer}-canvas` : 
                    `polychora-${layer}-canvas`;
                
                const layerCanvas = document.getElementById(layerId);
                if (layerCanvas && layerCanvas.width > 0) {
                    ctx.globalAlpha = layer === 'background' ? 0.3 : 
                                     layer === 'shadow' ? 0.5 : 
                                     layer === 'accent' ? 0.7 : 1.0;
                    ctx.drawImage(layerCanvas, 0, 0, targetWidth, targetHeight);
                }
            }
            
            // Convert to base64
            const imageData = compositeCanvas.toDataURL('image/png', 0.9);
            console.log('✅ Canvas captured successfully');
            return imageData;
            
        } catch (error) {
            console.error('❌ Error capturing canvas:', error);
            return null;
        }
    }
    
    /**
     * Capture current visualization state
     */
    captureCurrentState() {
        const params = this.engine?.parameterManager?.getAllParameters() || {};
        const geometryNames = ['TETRAHEDRON', 'HYPERCUBE', 'SPHERE', 'TORUS', 'KLEIN BOTTLE', 'FRACTAL', 'WAVE', 'CRYSTAL'];
        const systemNames = {
            faceted: 'FACETED',
            holographic: 'HOLOGRAPHIC',
            polychora: 'POLYCHORA'
        };
        
        const state = {
            name: `${geometryNames[params.geometry || 0]} ${systemNames[this.currentSystem] || 'QUANTUM'}`,
            geometry: geometryNames[params.geometry || 0],
            system: this.currentSystem,
            dimension: (params.dimension || 3.8).toFixed(1),
            hue: params.hue || 200,
            saturation: ((params.saturation || 0.8) * 100).toFixed(0),
            intensity: ((params.intensity || 0.5) * 100).toFixed(0),
            speed: (params.speed || 1.0).toFixed(1),
            chaos: ((params.chaos || 0) * 100).toFixed(0),
            rarity: this.calculateRarity(params),
            parameters: params,
            portalUrl: window.location.origin + '/vib34d-portal.html'
        };
        
        return state;
    }
    
    /**
     * Calculate rarity based on parameter extremity
     */
    calculateRarity(params) {
        const extremity = 
            Math.abs(params.rot4dXW || 0) + 
            Math.abs(params.rot4dYW || 0) + 
            Math.abs(params.rot4dZW || 0) +
            (params.chaos || 0) * 2 +
            Math.abs((params.dimension || 3.8) - 3.8);
        
        if (extremity > 8) return 'MYTHIC';
        if (extremity > 6) return 'LEGENDARY';
        if (extremity > 4) return 'EPIC';
        if (extremity > 2) return 'RARE';
        return 'COMMON';
    }
    
    /**
     * Generate classic vertical trading card HTML
     */
    generateClassicCard(state, canvasImage) {
        // Use captured image or generate visualization code as fallback
        const visualizationContent = canvasImage ? 
            this.generateImageVisualization(canvasImage) : 
            this.generateVisualizationCode(state);
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VIB34D Trading Card - ${state.name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            background: #000;
            color: #fff;
            font-family: 'Orbitron', monospace;
            overflow: hidden;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: 
                radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        }
        
        .trading-card {
            width: 400px;
            height: 600px;
            background: linear-gradient(145deg, rgba(0,0,0,0.9), rgba(30,30,60,0.9));
            border-radius: 20px;
            border: 3px solid transparent;
            background-clip: padding-box;
            position: relative;
            overflow: hidden;
            box-shadow: 
                0 0 50px hsla(${state.hue}, 80%, 50%, 0.3),
                inset 0 0 50px rgba(255, 255, 255, 0.05);
            animation: cardGlow 3s ease-in-out infinite alternate;
        }
        
        @keyframes cardGlow {
            0% { 
                box-shadow: 
                    0 0 50px hsla(${state.hue}, 80%, 50%, 0.3),
                    inset 0 0 50px rgba(255, 255, 255, 0.05);
            }
            100% { 
                box-shadow: 
                    0 0 80px hsla(${(state.hue + 60) % 360}, 80%, 50%, 0.4),
                    inset 0 0 80px rgba(255, 255, 255, 0.1);
            }
        }
        
        .card-border {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 20px;
            background: linear-gradient(45deg, 
                hsl(${state.hue}, 80%, 50%), 
                hsl(${(state.hue + 120) % 360}, 80%, 50%), 
                hsl(${(state.hue + 240) % 360}, 80%, 50%),
                hsl(${state.hue}, 80%, 50%));
            background-size: 300% 300%;
            animation: borderShift 4s ease-in-out infinite;
            z-index: -1;
        }
        
        @keyframes borderShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        .card-header {
            position: relative;
            z-index: 10;
            padding: 20px;
            text-align: center;
            background: linear-gradient(180deg, rgba(0,0,0,0.8), transparent);
        }
        
        .card-title {
            font-size: 1.4rem;
            font-weight: 900;
            color: hsl(${state.hue}, 80%, 60%);
            text-shadow: 0 0 20px hsla(${state.hue}, 80%, 60%, 0.8);
            margin-bottom: 5px;
            letter-spacing: 2px;
        }
        
        .card-subtitle {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.7);
            font-weight: 400;
            letter-spacing: 1px;
        }
        
        .rarity-badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: ${state.rarity === 'MYTHIC' ? 'linear-gradient(45deg, #ff00ff, #00ffff)' :
                         state.rarity === 'LEGENDARY' ? 'linear-gradient(45deg, #ff6b35, #f7931e)' :
                         state.rarity === 'EPIC' ? 'linear-gradient(45deg, #9b59b6, #e74c3c)' :
                         state.rarity === 'RARE' ? 'linear-gradient(45deg, #3498db, #2ecc71)' :
                         'linear-gradient(45deg, #95a5a6, #7f8c8d)'};
            color: ${state.rarity === 'COMMON' ? '#fff' : '#000'};
            padding: 5px 15px;
            border-radius: 15px;
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
            animation: rarityPulse 2s ease-in-out infinite;
        }
        
        @keyframes rarityPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .visualizer-container {
            position: relative;
            width: 100%;
            height: 300px;
            margin: 20px 0;
            border-radius: 15px;
            overflow: hidden;
            background: radial-gradient(ellipse at center, hsla(${state.hue}, 80%, 50%, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%);
            border: 2px solid hsla(${state.hue}, 80%, 50%, 0.3);
        }
        
        .visualizer-canvas {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 10px;
        }
        
        .visualizer-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
        }
        
        .stats-panel {
            padding: 0 20px;
            margin-bottom: 20px;
        }
        
        .stat-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 0.7rem;
        }
        
        .stat-label {
            color: rgba(255, 255, 255, 0.6);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .stat-value {
            color: hsl(${state.hue}, 80%, 60%);
            font-weight: 700;
            text-shadow: 0 0 10px hsla(${state.hue}, 80%, 60%, 0.5);
        }
        
        .action-panel {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(0deg, rgba(0,0,0,0.9), transparent);
            padding: 20px;
            text-align: center;
        }
        
        .collect-button {
            width: 100%;
            background: linear-gradient(45deg, #ff6b35, #f7931e);
            border: none;
            color: #000;
            padding: 15px 20px;
            border-radius: 25px;
            font-family: 'Orbitron', monospace;
            font-size: 1rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 30px rgba(255, 107, 53, 0.4);
            position: relative;
            overflow: hidden;
        }
        
        .collect-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 0 50px rgba(255, 107, 53, 0.8);
        }
        
        .edition-number {
            position: absolute;
            bottom: 15px;
            left: 20px;
            font-size: 0.6rem;
            color: rgba(255, 255, 255, 0.5);
            font-weight: 400;
        }
        
        .hologram-effect {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(45deg, 
                hsla(${state.hue}, 80%, 50%, 0.1), 
                hsla(${(state.hue + 120) % 360}, 80%, 50%, 0.1), 
                hsla(${(state.hue + 240) % 360}, 80%, 50%, 0.1));
            background-size: 300% 300%;
            animation: hologramShift 6s ease-in-out infinite;
            pointer-events: none;
            border-radius: 20px;
        }
        
        @keyframes hologramShift {
            0%, 100% { 
                background-position: 0% 50%; 
                opacity: 0.3;
            }
            50% { 
                background-position: 100% 50%; 
                opacity: 0.6;
            }
        }
        
        @media (max-width: 480px) {
            .trading-card {
                width: 350px;
                height: 550px;
            }
        }
    </style>
</head>
<body>
    <div class="trading-card">
        <div class="card-border"></div>
        <div class="hologram-effect"></div>
        
        <div class="rarity-badge">${state.rarity}</div>
        
        <div class="card-header">
            <h1 class="card-title">${state.name}</h1>
            <p class="card-subtitle">${state.system} System • ${state.dimension}D</p>
        </div>
        
        <div class="visualizer-container">
            ${canvasImage ? 
                `<img src="${canvasImage}" class="visualizer-canvas" alt="${state.name}" style="width: 100%; height: 100%; object-fit: cover;" />` : 
                `<canvas class="visualizer-canvas" id="vib34dCanvas"></canvas>`
            }
        </div>
        
        <div class="stats-panel">
            <div class="stat-row">
                <span class="stat-label">Dimension</span>
                <span class="stat-value">${state.dimension}D</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Geometry</span>
                <span class="stat-value">${state.geometry}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">System</span>
                <span class="stat-value">${state.system.toUpperCase()}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Chaos</span>
                <span class="stat-value">${state.chaos}%</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Speed</span>
                <span class="stat-value">${state.speed}x</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">Rarity</span>
                <span class="stat-value">${state.rarity}</span>
            </div>
        </div>
        
        <div class="action-panel">
            <button class="collect-button" onclick="collectFullSystem()">
                <span class="collect-text">🌌 Get VIB34D Collection</span>
            </button>
        </div>
        
        <div class="edition-number">Generated ${new Date().toLocaleDateString()}</div>
    </div>

    <script>
        ${visualizationContent}
        
        // Initialize visualizer (only if using canvas, not image)
        document.addEventListener('DOMContentLoaded', () => {
            const canvas = document.getElementById('vib34dCanvas');
            if (canvas) {
                ${canvasImage ? '// Using captured image, no animation needed' : 'new TradingCardVisualizer(canvas);'}
            }
        });
        
        // Collect button action - leads to VIB34D Portal
        function collectFullSystem() {
            const portalUrl = '${state.portalUrl}';
            const confirmed = confirm(
                "🌌 Ready to explore the complete VIB34D Collection?\\n\\n" +
                "✨ 100+ Legendary Variations\\n" +
                "🎮 3 Complete Visualization Systems\\n" +
                "🎯 4D Mathematics & Physics\\n" +
                "💫 Real-time Parameter Control\\n" +
                "🎨 Create Your Own Trading Cards\\n\\n" +
                "Click OK to visit the VIB34D Portal!"
            );
            
            if (confirmed) {
                try {
                    window.location.href = portalUrl;
                } catch (e) {
                    window.open(portalUrl, '_blank');
                }
            }
        }
    </script>
</body>
</html>`;
    }
    
    /**
     * Generate social media card HTML
     */
    generateSocialCard(state, canvasImage) {
        const visualizationContent = canvasImage ? 
            this.generateImageVisualization(canvasImage) : 
            this.generateVisualizationCode(state);
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VIB34D - ${state.name}</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            background: #000;
            color: #fff;
            font-family: 'Orbitron', monospace;
            overflow: hidden;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        }
        
        .social-card {
            width: 500px;
            height: 280px;
            background: linear-gradient(145deg, rgba(0,0,0,0.9), rgba(30,30,60,0.9));
            border-radius: 15px;
            border: 2px solid transparent;
            background-clip: padding-box;
            position: relative;
            overflow: hidden;
            display: flex;
            box-shadow: 0 0 40px hsla(${state.hue}, 80%, 50%, 0.3);
            animation: cardPulse 4s ease-in-out infinite alternate;
        }
        
        @keyframes cardPulse {
            0% { box-shadow: 0 0 40px hsla(${state.hue}, 80%, 50%, 0.3); }
            100% { box-shadow: 0 0 60px hsla(${(state.hue + 60) % 360}, 80%, 50%, 0.4); }
        }
        
        .card-visual {
            flex: 1;
            position: relative;
            background: radial-gradient(ellipse at center, hsla(${state.hue}, 80%, 50%, 0.1), rgba(0, 0, 0, 0.8));
        }
        
        .visualizer-canvas {
            width: 100%;
            height: 100%;
            display: block;
            border-radius: 10px;
        }
        
        .visualizer-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
        }
        
        .card-info {
            flex: 1;
            padding: 25px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: linear-gradient(90deg, transparent, rgba(0,0,0,0.7));
        }
        
        .card-title {
            font-size: 1.6rem;
            font-weight: 900;
            color: hsl(${state.hue}, 80%, 60%);
            text-shadow: 0 0 20px hsla(${state.hue}, 80%, 60%, 0.8);
            margin-bottom: 8px;
            letter-spacing: 1px;
            line-height: 1.2;
        }
        
        .card-subtitle {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 20px;
            letter-spacing: 1px;
        }
        
        .feature-list {
            margin-bottom: 20px;
        }
        
        .feature-item {
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 5px;
        }
        
        .cta-button {
            background: linear-gradient(45deg, #ff6b35, #f7931e);
            border: none;
            color: #000;
            padding: 12px 20px;
            border-radius: 20px;
            font-family: 'Orbitron', monospace;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(255, 107, 53, 0.4);
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 30px rgba(255, 107, 53, 0.7);
        }
        
        .rarity-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: ${state.rarity === 'MYTHIC' ? 'linear-gradient(45deg, #ff00ff, #00ffff)' :
                         state.rarity === 'LEGENDARY' ? 'linear-gradient(45deg, #ff6b35, #f7931e)' :
                         state.rarity === 'EPIC' ? 'linear-gradient(45deg, #9b59b6, #e74c3c)' :
                         state.rarity === 'RARE' ? 'linear-gradient(45deg, #3498db, #2ecc71)' :
                         'linear-gradient(45deg, #95a5a6, #7f8c8d)'};
            color: ${state.rarity === 'COMMON' ? '#fff' : '#000'};
            padding: 4px 12px;
            border-radius: 10px;
            font-size: 0.6rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
    </style>
</head>
<body>
    <div class="social-card">
        <div class="rarity-badge">${state.rarity}</div>
        
        <div class="card-visual">
            ${canvasImage ? 
                `<img src="${canvasImage}" class="visualizer-canvas" alt="${state.name}" style="width: 100%; height: 100%; object-fit: cover;" />` : 
                `<canvas class="visualizer-canvas" id="vib34dCanvas"></canvas>`
            }
        </div>
        
        <div class="card-info">
            <div>
                <h1 class="card-title">VIB34D<br>${state.geometry}</h1>
                <p class="card-subtitle">${state.system} • ${state.dimension}D</p>
                
                <div class="feature-list">
                    <div class="feature-item">🌌 Dimension: ${state.dimension}D</div>
                    <div class="feature-item">⚡ Speed: ${state.speed}x</div>
                    <div class="feature-item">🎮 Chaos: ${state.chaos}%</div>
                    <div class="feature-item">✨ Rarity: ${state.rarity}</div>
                </div>
            </div>
            
            <button class="cta-button" onclick="exploreCollection()">
                🚀 Get Collection
            </button>
        </div>
    </div>

    <script>
        ${visualizationContent}
        
        document.addEventListener('DOMContentLoaded', () => {
            const canvas = document.getElementById('vib34dCanvas');
            if (canvas) {
                ${canvasImage ? '// Using captured image, no animation needed' : 'new TradingCardVisualizer(canvas);'}
            }
        });
        
        function exploreCollection() {
            const portalUrl = '${state.portalUrl}';
            if (confirm("🌌 Visit the VIB34D Portal to collect more variations?")) {
                try {
                    window.location.href = portalUrl;
                } catch (e) {
                    window.open(portalUrl, '_blank');
                }
            }
        }
    </script>
</body>
</html>`;
    }
    
    /**
     * Generate the actual WebGL visualization code for the trading card
     */
    generateVisualizationCode(state) {
        if (this.currentSystem === 'faceted') {
            return this.generateFacetedVisualizationCode(state);
        } else if (this.currentSystem === 'holographic') {
            return this.generateHolographicVisualizationCode(state);
        } else {
            return this.generateFallbackVisualizationCode(state);
        }
    }
    
    /**
     * Generate WebGL code for Faceted system with actual shaders
     */
    generateFacetedVisualizationCode(state) {
        return `
        // VIB34D Faceted System Trading Card - ${state.name}
        class TradingCardVisualizer {
            constructor(canvas) {
                this.canvas = canvas;
                this.gl = canvas.getContext('webgl');
                this.params = ${JSON.stringify(state.parameters)};
                this.startTime = Date.now();
                
                if (!this.gl) {
                    console.error('WebGL not supported');
                    return;
                }
                
                this.initShaders();
                this.initBuffers();
                this.resize();
                this.animate();
            }
            
            resize() {
                this.canvas.width = this.canvas.clientWidth;
                this.canvas.height = this.canvas.clientHeight;
                this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            }
            
            initShaders() {
                const vertexShaderSource = \`
                    attribute vec2 a_position;
                    void main() {
                        gl_Position = vec4(a_position, 0.0, 1.0);
                    }
                \`;
                
                const fragmentShaderSource = \`
                    precision highp float;
                    
                    uniform vec2 u_resolution;
                    uniform float u_time;
                    uniform vec2 u_mouse;
                    uniform float u_geometry;
                    uniform float u_gridDensity;
                    uniform float u_morphFactor;
                    uniform float u_chaos;
                    uniform float u_speed;
                    uniform float u_hue;
                    uniform float u_intensity;
                    uniform float u_saturation;
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
                    
                    float geometryFunction(vec4 p) {
                        int geomType = int(u_geometry);
                        
                        if (geomType == 0) {
                            vec4 pos = fract(p * u_gridDensity * 0.08);
                            vec4 dist = min(pos, 1.0 - pos);
                            return min(min(dist.x, dist.y), min(dist.z, dist.w)) * u_morphFactor;
                        }
                        else if (geomType == 1) {
                            vec4 pos = fract(p * u_gridDensity * 0.08);
                            vec4 dist = min(pos, 1.0 - pos);
                            float minDist = min(min(dist.x, dist.y), min(dist.z, dist.w));
                            return minDist * u_morphFactor;
                        }
                        else if (geomType == 2) {
                            float r = length(p);
                            float density = u_gridDensity * 0.08;
                            float spheres = abs(fract(r * density) - 0.5) * 2.0;
                            float theta = atan(p.y, p.x);
                            float harmonics = sin(theta * 3.0) * 0.2;
                            return (spheres + harmonics) * u_morphFactor;
                        }
                        else if (geomType == 3) {
                            float r1 = length(p.xy) - 2.0;
                            float torus = length(vec2(r1, p.z)) - 0.8;
                            float lattice = sin(p.x * u_gridDensity * 0.08) * sin(p.y * u_gridDensity * 0.08);
                            return (torus + lattice * 0.3) * u_morphFactor;
                        }
                        else if (geomType == 4) {
                            float u = atan(p.y, p.x);
                            float v = atan(p.w, p.z);
                            float dist = length(p) - 2.0;
                            float lattice = sin(u * u_gridDensity * 0.08) * sin(v * u_gridDensity * 0.08);
                            return (dist + lattice * 0.4) * u_morphFactor;
                        }
                        else if (geomType == 5) {
                            vec4 pos = fract(p * u_gridDensity * 0.08);
                            pos = abs(pos * 2.0 - 1.0);
                            float dist = length(max(abs(pos) - 1.0, 0.0));
                            return dist * u_morphFactor;
                        }
                        else if (geomType == 6) {
                            float freq = u_gridDensity * 0.08;
                            float time = u_time * 0.001 * u_speed;
                            float wave1 = sin(p.x * freq + time);
                            float wave2 = sin(p.y * freq + time * 1.3);
                            float wave3 = sin(p.z * freq * 0.8 + time * 0.7);
                            float interference = wave1 * wave2 * wave3;
                            return interference * u_morphFactor;
                        }
                        else if (geomType == 7) {
                            vec4 pos = fract(p * u_gridDensity * 0.08) - 0.5;
                            float cube = max(max(abs(pos.x), abs(pos.y)), max(abs(pos.z), abs(pos.w)));
                            return cube * u_morphFactor;
                        }
                        else {
                            vec4 pos = fract(p * u_gridDensity * 0.08);
                            vec4 dist = min(pos, 1.0 - pos);
                            return min(min(dist.x, dist.y), min(dist.z, dist.w)) * u_morphFactor;
                        }
                    }
                    
                    void main() {
                        vec2 uv = (gl_FragCoord.xy - u_resolution.xy * 0.5) / min(u_resolution.x, u_resolution.y);
                        
                        float timeSpeed = u_time * 0.0001 * u_speed;
                        vec4 pos = vec4(uv * 3.0, sin(timeSpeed * 3.0), cos(timeSpeed * 2.0));
                        pos.xy += (u_mouse - 0.5) * u_mouseIntensity * 2.0;
                        
                        pos = rotateXW(u_rot4dXW) * pos;
                        pos = rotateYW(u_rot4dYW) * pos;
                        pos = rotateZW(u_rot4dZW) * pos;
                        
                        float value = geometryFunction(pos);
                        
                        float noise = sin(pos.x * 7.0) * cos(pos.y * 11.0) * sin(pos.z * 13.0);
                        value += noise * u_chaos;
                        
                        float geometryIntensity = 1.0 - clamp(abs(value), 0.0, 1.0);
                        geometryIntensity += u_clickIntensity * 0.3;
                        
                        float finalIntensity = geometryIntensity * u_intensity;
                        
                        float hue = u_hue / 360.0 + value * 0.1;
                        
                        vec3 baseColor = vec3(
                            sin(hue * 6.28318 + 0.0) * 0.5 + 0.5,
                            sin(hue * 6.28318 + 2.0943) * 0.5 + 0.5,
                            sin(hue * 6.28318 + 4.1887) * 0.5 + 0.5
                        );
                        
                        float gray = (baseColor.r + baseColor.g + baseColor.b) / 3.0;
                        vec3 color = mix(vec3(gray), baseColor, u_saturation) * finalIntensity;
                        
                        gl_FragColor = vec4(color, finalIntensity * u_roleIntensity);
                    }
                \`;
                
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
                    intensity: this.gl.getUniformLocation(this.program, 'u_intensity'),
                    saturation: this.gl.getUniformLocation(this.program, 'u_saturation'),
                    dimension: this.gl.getUniformLocation(this.program, 'u_dimension'),
                    rot4dXW: this.gl.getUniformLocation(this.program, 'u_rot4dXW'),
                    rot4dYW: this.gl.getUniformLocation(this.program, 'u_rot4dYW'),
                    rot4dZW: this.gl.getUniformLocation(this.program, 'u_rot4dZW'),
                    mouseIntensity: this.gl.getUniformLocation(this.program, 'u_mouseIntensity'),
                    clickIntensity: this.gl.getUniformLocation(this.program, 'u_clickIntensity'),
                    roleIntensity: this.gl.getUniformLocation(this.program, 'u_roleIntensity')
                };
            }
            
            createProgram(vertexSource, fragmentSource) {
                const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
                const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
                
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
            
            initBuffers() {
                const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
                
                this.buffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
                
                const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
                this.gl.enableVertexAttribArray(positionLocation);
                this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
            }
            
            animate() {
                this.render();
                requestAnimationFrame(() => this.animate());
            }
            
            render() {
                if (!this.program) return;
                
                this.resize();
                this.gl.useProgram(this.program);
                
                const time = Date.now() - this.startTime;
                
                this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
                this.gl.uniform1f(this.uniforms.time, time);
                this.gl.uniform2f(this.uniforms.mouse, 0.5, 0.5);
                this.gl.uniform1f(this.uniforms.geometry, this.params.geometry || 0);
                this.gl.uniform1f(this.uniforms.gridDensity, this.params.gridDensity || 15);
                this.gl.uniform1f(this.uniforms.morphFactor, this.params.morphFactor || 1.0);
                this.gl.uniform1f(this.uniforms.chaos, this.params.chaos || 0.2);
                this.gl.uniform1f(this.uniforms.speed, this.params.speed || 1.0);
                this.gl.uniform1f(this.uniforms.hue, this.params.hue || 200);
                this.gl.uniform1f(this.uniforms.intensity, this.params.intensity || 0.5);
                this.gl.uniform1f(this.uniforms.saturation, this.params.saturation || 0.8);
                this.gl.uniform1f(this.uniforms.dimension, this.params.dimension || 3.8);
                this.gl.uniform1f(this.uniforms.rot4dXW, this.params.rot4dXW || 0.0);
                this.gl.uniform1f(this.uniforms.rot4dYW, this.params.rot4dYW || 0.0);
                this.gl.uniform1f(this.uniforms.rot4dZW, this.params.rot4dZW || 0.0);
                this.gl.uniform1f(this.uniforms.mouseIntensity, 0.0);
                this.gl.uniform1f(this.uniforms.clickIntensity, 0.0);
                this.gl.uniform1f(this.uniforms.roleIntensity, 1.0);
                
                this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
            }
        }`;
    }
    
    /**
     * Generate WebGL code for Holographic system with actual shaders
     */
    generateHolographicVisualizationCode(state) {
        return `
        // VIB34D Holographic System Trading Card - ${state.name}
        class TradingCardVisualizer {
            constructor(canvas) {
                this.canvas = canvas;
                this.gl = canvas.getContext('webgl');
                this.params = ${JSON.stringify(state.parameters)};
                this.startTime = Date.now();
                
                if (!this.gl) {
                    console.error('WebGL not supported');
                    return;
                }
                
                this.initHolographicShaders();
                this.initBuffers();
                this.resize();
                this.animate();
            }
            
            initHolographicShaders() {
                const vertexShaderSource = \`
                    attribute vec2 a_position;
                    void main() {
                        gl_Position = vec4(a_position, 0.0, 1.0);
                    }
                \`;
                
                // Use the actual holographic fragment shader
                const fragmentShaderSource = \`
                    precision highp float;
                    
                    uniform vec2 u_resolution;
                    uniform float u_time;
                    uniform vec2 u_mouse;
                    uniform float u_geometry;
                    uniform float u_density;
                    uniform float u_speed;
                    uniform vec3 u_color;
                    uniform float u_intensity;
                    uniform float u_roleDensity;
                    uniform float u_roleSpeed;
                    uniform float u_geometryType;
                    uniform float u_chaos;
                    uniform float u_morph;
                    uniform float u_rot4dXW;
                    uniform float u_rot4dYW;
                    uniform float u_rot4dZW;
                    
                    // 4D rotation matrices
                    mat4 rotateXW(float theta) {
                        float c = cos(theta);
                        float s = sin(theta);
                        return mat4(c, 0, 0, -s, 0, 1, 0, 0, 0, 0, 1, 0, s, 0, 0, c);
                    }
                    
                    mat4 rotateYW(float theta) {
                        float c = cos(theta);
                        float s = sin(theta);
                        return mat4(1, 0, 0, 0, 0, c, 0, -s, 0, 0, 1, 0, 0, s, 0, c);
                    }
                    
                    mat4 rotateZW(float theta) {
                        float c = cos(theta);
                        float s = sin(theta);
                        return mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, c, -s, 0, 0, s, c);
                    }
                    
                    vec3 project4Dto3D(vec4 p) {
                        float w = 2.5 / (2.5 + p.w);
                        return vec3(p.x * w, p.y * w, p.z * w);
                    }
                    
                    float tetrahedronLattice(vec3 p, float gridSize) {
                        vec3 q = fract(p * gridSize) - 0.5;
                        float d1 = length(q);
                        float d2 = length(q - vec3(0.4, 0.0, 0.0));
                        float d3 = length(q - vec3(0.0, 0.4, 0.0));
                        float d4 = length(q - vec3(0.0, 0.0, 0.4));
                        float vertices = 1.0 - smoothstep(0.0, 0.04, min(min(d1, d2), min(d3, d4)));
                        float edges = 0.0;
                        edges = max(edges, 1.0 - smoothstep(0.0, 0.02, abs(length(q.xy) - 0.2)));
                        edges = max(edges, 1.0 - smoothstep(0.0, 0.02, abs(length(q.yz) - 0.2)));
                        edges = max(edges, 1.0 - smoothstep(0.0, 0.02, abs(length(q.xz) - 0.2)));
                        return max(vertices, edges * 0.5);
                    }
                    
                    float getDynamicGeometry(vec3 p, float gridSize, float geometryType) {
                        int baseGeom = int(mod(geometryType, 8.0));
                        float variation = floor(geometryType / 8.0) / 4.0;
                        float variedGridSize = gridSize * (0.5 + variation * 1.5);
                        
                        if (baseGeom == 0) return tetrahedronLattice(p, variedGridSize);
                        // Add other geometry types as needed
                        return tetrahedronLattice(p, variedGridSize);
                    }
                    
                    void main() {
                        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                        float aspectRatio = u_resolution.x / u_resolution.y;
                        uv.x *= aspectRatio;
                        uv -= 0.5;
                        
                        float time = u_time * 0.0004 * u_speed * u_roleSpeed;
                        
                        vec4 p4d = vec4(uv * 3.0, sin(time * 0.1) * 0.15, cos(time * 0.08) * 0.15);
                        
                        p4d = rotateXW(u_rot4dXW + time * 0.2) * p4d;
                        p4d = rotateYW(u_rot4dYW + time * 0.15) * p4d;
                        p4d = rotateZW(u_rot4dZW + time * 0.25) * p4d;
                        
                        vec3 p = project4Dto3D(p4d);
                        
                        float roleDensity = u_density * u_roleDensity;
                        float morphedGeometry = u_geometryType + u_morph * 3.0;
                        float lattice = getDynamicGeometry(p, roleDensity, morphedGeometry);
                        
                        vec3 baseColor = u_color;
                        float latticeIntensity = lattice * u_intensity;
                        
                        vec3 color = baseColor * (0.3 + latticeIntensity * 0.7);
                        color += vec3(lattice * 0.4) * baseColor;
                        
                        gl_FragColor = vec4(color, 0.95);
                    }
                \`;
                
                this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
                this.uniforms = {
                    resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
                    time: this.gl.getUniformLocation(this.program, 'u_time'),
                    mouse: this.gl.getUniformLocation(this.program, 'u_mouse'),
                    geometry: this.gl.getUniformLocation(this.program, 'u_geometry'),
                    density: this.gl.getUniformLocation(this.program, 'u_density'),
                    speed: this.gl.getUniformLocation(this.program, 'u_speed'),
                    color: this.gl.getUniformLocation(this.program, 'u_color'),
                    intensity: this.gl.getUniformLocation(this.program, 'u_intensity'),
                    roleDensity: this.gl.getUniformLocation(this.program, 'u_roleDensity'),
                    roleSpeed: this.gl.getUniformLocation(this.program, 'u_roleSpeed'),
                    geometryType: this.gl.getUniformLocation(this.program, 'u_geometryType'),
                    chaos: this.gl.getUniformLocation(this.program, 'u_chaos'),
                    morph: this.gl.getUniformLocation(this.program, 'u_morph'),
                    rot4dXW: this.gl.getUniformLocation(this.program, 'u_rot4dXW'),
                    rot4dYW: this.gl.getUniformLocation(this.program, 'u_rot4dYW'),
                    rot4dZW: this.gl.getUniformLocation(this.program, 'u_rot4dZW')
                };
            }
            
            createProgram(vertexSource, fragmentSource) {
                const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
                const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
                
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
            
            initBuffers() {
                const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
                
                this.buffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
                
                const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
                this.gl.enableVertexAttribArray(positionLocation);
                this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
            }
            
            resize() {
                this.canvas.width = this.canvas.clientWidth;
                this.canvas.height = this.canvas.clientHeight;
                this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            }
            
            animate() {
                this.render();
                requestAnimationFrame(() => this.animate());
            }
            
            render() {
                if (!this.program) return;
                
                this.resize();
                this.gl.useProgram(this.program);
                
                const time = Date.now() - this.startTime;
                const hue = (this.params.hue || 200) / 360;
                
                // Convert hue to RGB
                const hslToRgb = (h, s, l) => {
                    let r, g, b;
                    if (s === 0) {
                        r = g = b = l;
                    } else {
                        const hue2rgb = (p, q, t) => {
                            if (t < 0) t += 1;
                            if (t > 1) t -= 1;
                            if (t < 1/6) return p + (q - p) * 6 * t;
                            if (t < 1/2) return q;
                            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                            return p;
                        };
                        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                        const p = 2 * l - q;
                        r = hue2rgb(p, q, h + 1/3);
                        g = hue2rgb(p, q, h);
                        b = hue2rgb(p, q, h - 1/3);
                    }
                    return [r, g, b];
                };
                
                const rgbColor = hslToRgb(hue, this.params.saturation || 0.8, this.params.intensity || 0.5);
                
                this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
                this.gl.uniform1f(this.uniforms.time, time);
                this.gl.uniform2f(this.uniforms.mouse, 0.5, 0.5);
                this.gl.uniform1f(this.uniforms.geometryType, this.params.geometryType || 0);
                this.gl.uniform1f(this.uniforms.density, this.params.density || 1.0);
                this.gl.uniform1f(this.uniforms.speed, this.params.speed || 0.5);
                this.gl.uniform3fv(this.uniforms.color, new Float32Array(rgbColor));
                this.gl.uniform1f(this.uniforms.intensity, this.params.intensity || 0.5);
                this.gl.uniform1f(this.uniforms.roleDensity, 1.0);
                this.gl.uniform1f(this.uniforms.roleSpeed, 1.0);
                this.gl.uniform1f(this.uniforms.chaos, this.params.chaos || 0.0);
                this.gl.uniform1f(this.uniforms.morph, this.params.morph || 0.0);
                this.gl.uniform1f(this.uniforms.rot4dXW, this.params.rot4dXW || 0.0);
                this.gl.uniform1f(this.uniforms.rot4dYW, this.params.rot4dYW || 0.0);
                this.gl.uniform1f(this.uniforms.rot4dZW, this.params.rot4dZW || 0.0);
                
                this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
            }
        }`;
    }
    
    /**
     * Generate fallback visualization code
     */
    generateFallbackVisualizationCode(state) {
        return `
        // VIB34D Trading Card - Fallback Canvas Renderer
        class TradingCardVisualizer {
            constructor(canvas) {
                console.log('🎴 Trading card using fallback 2D renderer');
                // Simple 2D fallback if WebGL fails
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.animate();
            }
            
            animate() {
                if (this.ctx) {
                    this.ctx.fillStyle = '#000';
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.fillStyle = '#00ffff';
                    this.ctx.font = '20px Orbitron';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('VIB34D', this.canvas.width/2, this.canvas.height/2);
                }
                requestAnimationFrame(() => this.animate());
            }
        }`;
    }
    
    /**
     * Generate simple image display code for captured canvas
     */
    generateImageVisualization(imageData) {
        return `
        // VIB34D Trading Card - Captured Visualization
        // This card contains the exact visual state from when it was created
        console.log('🎴 Trading card using captured visualization');
        
        // The visualization is embedded as an image
        // Original state preserved perfectly
        `;
    }
}