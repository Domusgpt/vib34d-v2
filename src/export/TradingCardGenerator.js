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
     * Generate the visualization code for the trading card
     */
    generateVisualizationCode(state) {
        return `
        // VIB34D Trading Card Visualizer - ${state.name}
        class TradingCardVisualizer {
            constructor(canvas) {
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.time = 0;
                this.params = ${JSON.stringify(state.parameters)};
                this.resize();
                
                // Generate geometry based on type
                this.setupGeometry('${state.geometry}');
                this.animate();
            }
            
            resize() {
                const rect = this.canvas.getBoundingClientRect();
                this.canvas.width = rect.width * devicePixelRatio;
                this.canvas.height = rect.height * devicePixelRatio;
                this.ctx.scale(devicePixelRatio, devicePixelRatio);
                this.canvas.style.width = rect.width + 'px';
                this.canvas.style.height = rect.height + 'px';
                
                this.centerX = rect.width / 2;
                this.centerY = rect.height / 2;
                this.scale = Math.min(rect.width, rect.height) * 0.15;
            }
            
            setupGeometry(type) {
                // Simplified geometry setup based on type
                switch(type) {
                    case 'HYPERCUBE':
                        this.vertices = [
                            [-1, -1, -1, -1], [1, -1, -1, -1], [-1, 1, -1, -1], [1, 1, -1, -1],
                            [-1, -1, 1, -1], [1, -1, 1, -1], [-1, 1, 1, -1], [1, 1, 1, -1],
                            [-1, -1, -1, 1], [1, -1, -1, 1], [-1, 1, -1, 1], [1, 1, -1, 1],
                            [-1, -1, 1, 1], [1, -1, 1, 1], [-1, 1, 1, 1], [1, 1, 1, 1]
                        ];
                        this.edges = [
                            [0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14, 15],
                            [0, 2], [1, 3], [4, 6], [5, 7], [8, 10], [9, 11], [12, 14], [13, 15],
                            [0, 4], [1, 5], [2, 6], [3, 7], [8, 12], [9, 13], [10, 14], [11, 15],
                            [0, 8], [1, 9], [2, 10], [3, 11], [4, 12], [5, 13], [6, 14], [7, 15]
                        ];
                        break;
                    default:
                        // Default to tetrahedron for simplicity
                        this.vertices = [
                            [1, 1, 1, 0], [1, -1, -1, 0], [-1, 1, -1, 0], [-1, -1, 1, 0]
                        ];
                        this.edges = [
                            [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]
                        ];
                }
            }
            
            project4Dto3D(vertex, time) {
                const [x, y, z, w] = vertex;
                
                // Apply user's rotation parameters
                const angleXW = time * 0.01 * (this.params.speed || 1) + (this.params.rot4dXW || 0);
                const angleYW = time * 0.008 * (this.params.speed || 1) + (this.params.rot4dYW || 0);
                const angleZW = time * 0.006 * (this.params.speed || 1) + (this.params.rot4dZW || 0);
                
                // Rotate in XW plane
                let newX = x * Math.cos(angleXW) - w * Math.sin(angleXW);
                let newW = x * Math.sin(angleXW) + w * Math.cos(angleXW);
                
                // Rotate in YW plane  
                let newY = y * Math.cos(angleYW) - newW * Math.sin(angleYW);
                newW = y * Math.sin(angleYW) + newW * Math.cos(angleYW);
                
                // Rotate in ZW plane
                let newZ = z * Math.cos(angleZW) - newW * Math.sin(angleZW);
                newW = z * Math.sin(angleZW) + newW * Math.cos(angleZW);
                
                // Add chaos
                if (this.params.chaos) {
                    newX += Math.sin(time * 0.01 + x) * this.params.chaos * 0.1;
                    newY += Math.cos(time * 0.01 + y) * this.params.chaos * 0.1;
                    newZ += Math.sin(time * 0.01 + z) * this.params.chaos * 0.1;
                }
                
                // 4D to 3D projection
                const distance = this.params.dimension || 3.8;
                const factor = distance / (distance + newW);
                
                return [newX * factor, newY * factor, newZ * factor, newW];
            }
            
            project3Dto2D(vertex3D) {
                const [x, y, z] = vertex3D;
                const distance = 3;
                const factor = distance / (distance + z);
                
                return [
                    this.centerX + x * this.scale * factor,
                    this.centerY + y * this.scale * factor,
                    factor
                ];
            }
            
            animate() {
                this.time += 1;
                this.render();
                requestAnimationFrame(() => this.animate());
            }
            
            render() {
                // Clear with gradient background
                const gradient = this.ctx.createRadialGradient(
                    this.centerX, this.centerY, 0,
                    this.centerX, this.centerY, Math.max(this.centerX, this.centerY)
                );
                const hue = this.params.hue || 200;
                gradient.addColorStop(0, \`hsla(\${hue}, 80%, 50%, 0.1)\`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.canvas.width / devicePixelRatio, this.canvas.height / devicePixelRatio);
                
                // Project all vertices
                const projectedVertices = this.vertices.map(vertex => {
                    const vertex3D = this.project4Dto3D(vertex, this.time);
                    const vertex2D = this.project3Dto2D(vertex3D);
                    return vertex2D;
                });
                
                // Draw edges
                this.edges.forEach(([i, j]) => {
                    const [x1, y1, z1] = projectedVertices[i];
                    const [x2, y2, z2] = projectedVertices[j];
                    
                    const avgZ = (z1 + z2) / 2;
                    const edgeHue = (hue + this.time * 0.5 + avgZ * 100) % 360;
                    const opacity = (0.3 + avgZ * 0.7) * (this.params.intensity || 0.5) * 2;
                    const thickness = (1 + avgZ * 3) * (1 + (this.params.morphFactor || 0) * 0.5);
                    
                    this.ctx.strokeStyle = \`hsla(\${edgeHue}, \${(this.params.saturation || 0.8) * 100}%, 60%, \${opacity})\`;
                    this.ctx.lineWidth = thickness;
                    this.ctx.shadowColor = \`hsla(\${edgeHue}, 80%, 60%, 0.8)\`;
                    this.ctx.shadowBlur = 10;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(x1, y1);
                    this.ctx.lineTo(x2, y2);
                    this.ctx.stroke();
                });
                
                // Draw vertices
                projectedVertices.forEach(([x, y, z], index) => {
                    const vertexHue = (hue + this.time * 0.7 + index * 23) % 360;
                    const size = (2 + z * 4) * (1 + (this.params.gridDensity || 10) / 20);
                    const opacity = (0.4 + z * 0.6) * (this.params.intensity || 0.5) * 2;
                    
                    this.ctx.shadowColor = \`hsla(\${vertexHue}, 80%, 60%, 0.9)\`;
                    this.ctx.shadowBlur = 15;
                    this.ctx.fillStyle = \`hsla(\${vertexHue}, \${(this.params.saturation || 0.8) * 100}%, 60%, \${opacity})\`;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, size, 0, Math.PI * 2);
                    this.ctx.fill();
                });
                
                this.ctx.shadowBlur = 0;
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