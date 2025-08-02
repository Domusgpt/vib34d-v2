# 🌌 VIB34D Holographic Engine

**A unified 4D mathematics and holographic visualization system with real-time interactive portfolio management.**

[![Demo](https://img.shields.io/badge/Live%20Demo-Try%20Now-00ffff?style=for-the-badge&logo=github)](https://domusgpt.github.io/vib34d-holographic-engine)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![WebGL](https://img.shields.io/badge/WebGL-Powered-orange?style=for-the-badge&logo=webgl)](https://webgl.org/)

## ✨ Features

### 🎯 Dual System Architecture
- **VIB34D Engine**: Classical 4D polytopal mathematics and holographic rendering
- **Active Holograms**: Real-time elaborate holographic effects with full interactivity
- **Unified Interface**: Seamlessly switch between systems with tabbed navigation

### 🎮 Interactive Systems
- **Mouse/Touch Control**: Responsive real-time interactions
- **Audio Reactivity**: Live microphone input with frequency analysis
- **Scroll Effects**: Parallax and depth control with scroll wheel
- **Keyboard Shortcuts**: Quick navigation and variant switching

### 🎨 Holographic Portfolio
- **Real-time Parameter Control**: 7 parameter sliders for live adjustment
- **Save to Portfolio**: Capture current holographic states
- **Gallery Browser**: Visual portfolio with live preview iframes
- **Custom Variations**: Create and manage unlimited variations

### 🧮 4D Mathematics
- **8 Base Geometries**: Tetrahedron, Hypercube, Sphere, Torus, Klein Bottle, Fractal, Wave, Crystal
- **30 Built-in Variations**: 4 variants per geometry type
- **4D Rotations**: XW, YW, ZW rotation controls
- **Dimensional Shifting**: Smooth transitions between 3D and 4D space

## 🚀 Quick Start

### Online Demo
Visit the live demo: **[https://domusgpt.github.io/vib34d-holographic-engine](https://domusgpt.github.io/vib34d-holographic-engine)**

### Local Development
```bash
# Clone the repository
git clone https://github.com/domusgpt/vib34d-holographic-engine.git
cd vib34d-holographic-engine

# Start local server
npm start
# or
python3 -m http.server 8144

# Open in browser
open http://localhost:8144
```

## 📖 User Guide

### 🎛️ System Navigation

#### **Tab 1: Variations** 
- Navigate through 100+ geometric variations
- Use arrow keys or navigation buttons
- Random variation button for exploration

#### **Tab 2: 4D Mathematics**
- Control 4D rotation matrices (XW, YW, ZW)
- Adjust dimensional parameters
- Randomize all parameters

#### **Tab 3: Holographic**
- Grid density and morph factor controls
- Chaos and speed parameters
- Color and hue adjustments

#### **Tab 4: Active Holograms** ⭐ **NEW**
- Activate elaborate holographic effects
- Real-time parameter sliders:
  - **Density**: Particle/point density (0.5-3.0)
  - **Speed**: Animation speed (0.1-2.0) 
  - **Chaos**: Randomness factor (0-1)
  - **Morph**: Geometric morphing (0-1)
  - **Hue**: Color spectrum (0-360°)
  - **Saturation**: Color intensity (0-1)
  - **Intensity**: Overall brightness (0.1-1)

#### **Tab 5: Export**
- Export configurations as JSON
- Export custom CSS themes
- Export standalone HTML pages
- Import saved configurations

### 💾 Portfolio Management

#### **Save Custom Holograms**
1. Go to **Active Holograms** tab
2. Adjust parameters with sliders
3. Click **"💾 Save to Portfolio"**
4. Variation saved with timestamp

#### **Browse Portfolio Gallery**
1. Click **"🖼️ View Portfolio"** 
2. Gallery opens with live previews
3. Hover over cards for live preview
4. Click **"Load in System"** to edit
5. Click **"Delete"** to remove variations

### ⌨️ Keyboard Shortcuts
- **← →** : Previous/Next variation
- **Space** : Random variation  
- **Enter** : Toggle auto-cycle
- **P** : Toggle parameter display

### 🖱️ Mouse Controls
- **Move** : Real-time holographic response
- **Click** : Trigger ripple effects
- **Scroll** : Parallax depth control (over holographic area)

## 🏗️ Technical Architecture

### 📁 Project Structure
```
vib34d-holographic-engine/
├── index.html                    # Main application
├── hologram-gallery.html         # Portfolio gallery
├── src/
│   ├── core/
│   │   ├── Engine.js             # VIB34D core engine
│   │   ├── GeometryRegistry.js   # Geometry definitions
│   │   ├── InteractionCoordinator.js # Input handling
│   │   └── SystemController.js   # System coordination
│   ├── holograms/
│   │   ├── RealHolographicSystem.js  # Active holograms
│   │   └── HolographicVisualizer.js  # WebGL rendering
│   ├── features/
│   │   ├── ExportSystem.js       # Export functionality
│   │   └── VisualizerPool.js     # Visualizer management
│   └── styles/
│       └── vib34d-styles.css     # Core styling
├── collections/                  # Variation collections
├── data/                        # Configuration data
└── dist/                        # Distribution files
```

### 🎨 Rendering Pipeline
1. **5-Layer Canvas System**: Background, Shadow, Content, Highlight, Accent
2. **WebGL Shaders**: Custom GLSL shaders for each geometry type
3. **Blend Modes**: Screen, multiply, overlay, color-dodge effects
4. **Real-time Updates**: 60fps rendering with parameter interpolation

### 🔊 Audio Processing
- **Microphone Access**: Real-time audio input
- **FFT Analysis**: 256-point frequency analysis
- **Frequency Bands**: Bass (0-10%), Mid (10-40%), High (40-100%)
- **Beat Detection**: Real-time rhythm analysis
- **Smoothing**: Anti-jitter filtering for stable visuals

## 🌐 Browser Support

| Browser | Version | WebGL | Audio | Touch |
|---------|---------|-------|-------|-------|
| Chrome  | 90+     | ✅     | ✅     | ✅     |
| Firefox | 88+     | ✅     | ✅     | ✅     |
| Safari  | 14+     | ✅     | ✅     | ✅     |
| Edge    | 90+     | ✅     | ✅     | ✅     |

**Requirements:**
- WebGL-enabled browser
- Microphone access (for audio reactivity)
- Modern JavaScript support (ES6+)

## 🛠️ Development

### Local Setup
```bash
# Install dependencies (optional)
npm install

# Start development server
npm run dev

# Run on different port
python3 -m http.server 8145
```

### Testing
```bash
# Open test suite
open http://localhost:8144/test-integration.html

# Manual testing workflow:
# 1. Test all 5 tabs functionality
# 2. Test parameter sliders
# 3. Test portfolio save/load
# 4. Test gallery previews
```

### Deployment
```bash
# Deploy to GitHub Pages
npm run deploy

# Manual deployment
git add -A
git commit -m "Deploy VIB34D Holographic Engine"
git push origin main
```

## 📊 Performance

### Optimization Features
- **Canvas Layer Management**: Efficient blend mode usage
- **WebGL Context Sharing**: Shared context across visualizers  
- **Parameter Interpolation**: Smooth transitions between states
- **Memory Management**: Automatic cleanup and garbage collection
- **Mobile Optimization**: Touch-optimized controls and reduced complexity

### Benchmarks
- **Initialization**: < 2 seconds
- **Variant Switching**: < 100ms
- **Parameter Updates**: < 16ms (60fps)
- **Memory Usage**: < 200MB
- **Bundle Size**: < 1MB total

## 🎯 Use Cases

### 🎨 Creative Applications
- **Digital Art**: Create unique holographic artworks
- **Music Visualization**: Audio-reactive performances
- **Interactive Installations**: Touch/gesture-controlled displays
- **Portfolio Showcase**: Present visual work professionally

### 🎓 Educational
- **4D Mathematics**: Visualize complex geometric concepts
- **Physics Demonstrations**: Show wave interference and patterns
- **Computer Graphics**: Learn WebGL and shader programming
- **Interactive Learning**: Hands-on parameter exploration

### 💼 Professional
- **Presentations**: Engaging visual backgrounds
- **Web Development**: Integrate holographic elements
- **UI/UX Design**: Interactive prototype inspiration
- **Brand Identity**: Unique visual signatures

## 🔧 Customization

### Adding New Geometries
```javascript
// Register new geometry in GeometryRegistry.js
const customGeometry = {
    name: 'CUSTOM_SHAPE',
    vertices: [...],
    shader: customShaderCode,
    parameters: {...}
};
```

### Custom Shaders
```glsl
// Example vertex shader
attribute vec4 a_position;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    // Custom transformation logic
    gl_Position = a_position;
}
```

### Color Schemes
```css
/* Modify CSS custom properties */
:root {
    --primary-color: #00ffff;
    --accent-color: #ff64ff;
    --background-color: #000000;
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-geometry`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Reporting Issues
- Use GitHub Issues for bug reports
- Include browser version and console logs
- Provide steps to reproduce
- Attach screenshots if relevant

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Paul Phillips** - Original concept and development
- **VIB3 Mathematics** - 4D geometric foundations
- **WebGL Community** - Shader development techniques
- **Open Source Contributors** - Community feedback and improvements

## 🔗 Links

- **Live Demo**: [https://domusgpt.github.io/vib34d-holographic-engine](https://domusgpt.github.io/vib34d-holographic-engine)
- **Source Code**: [https://github.com/domusgpt/vib34d-holographic-engine](https://github.com/domusgpt/vib34d-holographic-engine)
- **Documentation**: [Wiki](https://github.com/domusgpt/vib34d-holographic-engine/wiki)
- **Issues**: [Bug Reports](https://github.com/domusgpt/vib34d-holographic-engine/issues)

---

**Built with ❤️ and 4D mathematics by Paul Phillips**

*Transform your browser into a holographic visualization playground!*