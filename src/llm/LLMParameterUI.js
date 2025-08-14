/**
 * LLM Parameter UI - Interactive interface for natural language parameter control
 * Features autocomplete, real-time suggestions, and smooth parameter application
 */

class LLMParameterUI {
    constructor() {
        this.isVisible = false;
        this.overlay = null;
        this.inputField = null;
        this.autocompleteList = null;
        this.statusIndicator = null;
        this.lastInput = '';
        this.autocompleteTimeout = null;
        this.isProcessing = false;
    }

    createInterface() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'llm-interface-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: none;
            justify-content: center;
            align-items: center;
            font-family: 'Orbitron', monospace;
        `;

        // Create main container
        const container = document.createElement('div');
        container.style.cssText = `
            background: linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(20, 0, 40, 0.95));
            border: 2px solid #00ffff;
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 90vw;
            box-shadow: 0 0 50px rgba(0, 255, 255, 0.3);
            position: relative;
        `;

        // Header
        const header = document.createElement('div');
        header.innerHTML = `
            <h2 style="color: #00ffff; text-align: center; margin-bottom: 20px; font-size: 1.5rem; text-shadow: 0 0 20px #00ffff;">
                🤖 AI Parameter Generator
            </h2>
            <p style="color: #888; text-align: center; margin-bottom: 30px; font-size: 0.9rem;">
                Describe your desired visualization in natural language
            </p>
        `;

        // Input section
        const inputSection = document.createElement('div');
        inputSection.style.cssText = `
            position: relative;
            margin-bottom: 20px;
        `;

        // Input field
        this.inputField = document.createElement('textarea');
        this.inputField.placeholder = 'Type your description... (e.g., "bright cyan holographic effect with fast rotation")';
        this.inputField.style.cssText = `
            width: 100%;
            min-height: 80px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid rgba(0, 255, 255, 0.3);
            border-radius: 10px;
            color: #fff;
            font-family: 'Orbitron', monospace;
            font-size: 1rem;
            padding: 15px;
            resize: vertical;
            outline: none;
            transition: all 0.3s ease;
        `;

        // Input field focus effects
        this.inputField.addEventListener('focus', () => {
            this.inputField.style.borderColor = '#00ffff';
            this.inputField.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
        });

        this.inputField.addEventListener('blur', () => {
            this.inputField.style.borderColor = 'rgba(0, 255, 255, 0.3)';
            this.inputField.style.boxShadow = 'none';
        });

        // Autocomplete list
        this.autocompleteList = document.createElement('div');
        this.autocompleteList.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid rgba(0, 255, 255, 0.3);
            border-radius: 10px;
            border-top: none;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            max-height: 200px;
            overflow-y: auto;
            z-index: 10001;
            display: none;
        `;

        // Status indicator
        this.statusIndicator = document.createElement('div');
        this.statusIndicator.style.cssText = `
            text-align: center;
            margin: 20px 0;
            font-size: 0.9rem;
            min-height: 20px;
        `;

        // Button section
        const buttonSection = document.createElement('div');
        buttonSection.style.cssText = `
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
        `;

        // Generate button
        const generateButton = document.createElement('button');
        generateButton.innerHTML = '🎨 Generate Parameters';
        generateButton.style.cssText = `
            background: linear-gradient(135deg, #00ffff, #0088cc);
            border: none;
            color: #000;
            padding: 15px 30px;
            border-radius: 10px;
            font-family: 'Orbitron', monospace;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 255, 255, 0.3);
        `;

        generateButton.addEventListener('mouseenter', () => {
            generateButton.style.transform = 'translateY(-2px)';
            generateButton.style.boxShadow = '0 8px 25px rgba(0, 255, 255, 0.4)';
        });

        generateButton.addEventListener('mouseleave', () => {
            generateButton.style.transform = 'translateY(0)';
            generateButton.style.boxShadow = '0 5px 15px rgba(0, 255, 255, 0.3)';
        });

        generateButton.addEventListener('click', () => this.generateAndApplyParameters());

        // Close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕ Close';
        closeButton.style.cssText = `
            background: rgba(255, 0, 255, 0.2);
            border: 2px solid rgba(255, 0, 255, 0.3);
            color: #ff00ff;
            padding: 15px 30px;
            border-radius: 10px;
            font-family: 'Orbitron', monospace;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.background = 'rgba(255, 0, 255, 0.3)';
            closeButton.style.borderColor = '#ff00ff';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.background = 'rgba(255, 0, 255, 0.2)';
            closeButton.style.borderColor = 'rgba(255, 0, 255, 0.3)';
        });

        closeButton.addEventListener('click', () => this.hide());

        // Examples section
        const examplesSection = document.createElement('div');
        examplesSection.style.cssText = `
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid rgba(0, 255, 255, 0.2);
        `;

        const examplesTitle = document.createElement('div');
        examplesTitle.innerHTML = 'Quick Examples:';
        examplesTitle.style.cssText = `
            color: #888;
            font-size: 0.9rem;
            margin-bottom: 10px;
        `;

        const exampleButtons = [
            'bright cyan holographic effect',
            'slow red crystalline hypercube',
            'chaotic rainbow tetrahedron',
            'calm blue minimalist design',
            'intense purple quantum lattice',
            'golden sacred geometry'
        ];

        const examplesContainer = document.createElement('div');
        examplesContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        `;

        exampleButtons.forEach(example => {
            const btn = document.createElement('button');
            btn.innerHTML = example;
            btn.style.cssText = `
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid rgba(0, 255, 255, 0.3);
                color: #00ffff;
                padding: 8px 12px;
                border-radius: 15px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
            `;

            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(0, 255, 255, 0.2)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'rgba(0, 255, 255, 0.1)';
            });

            btn.addEventListener('click', () => {
                this.inputField.value = example;
                this.inputField.focus();
            });

            examplesContainer.appendChild(btn);
        });

        // Assemble components
        inputSection.appendChild(this.inputField);
        inputSection.appendChild(this.autocompleteList);
        
        buttonSection.appendChild(generateButton);
        buttonSection.appendChild(closeButton);
        
        examplesSection.appendChild(examplesTitle);
        examplesSection.appendChild(examplesContainer);

        container.appendChild(header);
        container.appendChild(inputSection);
        container.appendChild(this.statusIndicator);
        container.appendChild(buttonSection);
        container.appendChild(examplesSection);

        this.overlay.appendChild(container);
        document.body.appendChild(this.overlay);

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Input field typing
        this.inputField.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });

        // Enter key to generate
        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.generateAndApplyParameters();
            }
        });

        // Click outside to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    handleInput(value) {
        this.lastInput = value;

        // Clear previous timeout
        if (this.autocompleteTimeout) {
            clearTimeout(this.autocompleteTimeout);
        }

        // Show autocomplete after short delay
        this.autocompleteTimeout = setTimeout(() => {
            this.showAutocomplete(value);
        }, 300);
    }

    showAutocomplete(input) {
        if (!window.llmInterface) return;

        const suggestions = window.llmInterface.generateAutocompleteOptions(input);
        
        if (suggestions.length === 0 || input.length < 2) {
            this.autocompleteList.style.display = 'none';
            return;
        }

        this.autocompleteList.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.innerHTML = suggestion;
            item.style.cssText = `
                padding: 12px 15px;
                cursor: pointer;
                border-bottom: 1px solid rgba(0, 255, 255, 0.1);
                transition: background 0.2s ease;
                font-size: 0.9rem;
                color: #ccc;
            `;

            item.addEventListener('mouseenter', () => {
                item.style.background = 'rgba(0, 255, 255, 0.1)';
                item.style.color = '#fff';
            });

            item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
                item.style.color = '#ccc';
            });

            item.addEventListener('click', () => {
                this.inputField.value = suggestion;
                this.autocompleteList.style.display = 'none';
                this.inputField.focus();
            });

            this.autocompleteList.appendChild(item);
        });

        this.autocompleteList.style.display = 'block';
    }

    async generateAndApplyParameters() {
        if (this.isProcessing) return;

        const description = this.inputField.value.trim();
        if (!description) {
            this.showStatus('Please enter a description', 'error');
            return;
        }

        if (!window.llmInterface || !window.llmInterface.isInitialized) {
            this.showStatus('LLM interface not initialized', 'error');
            return;
        }

        this.isProcessing = true;
        this.showStatus('🤖 Generating parameters...', 'loading');
        this.autocompleteList.style.display = 'none';

        try {
            const parameters = await window.llmInterface.generateParameters(description);
            
            this.showStatus('✅ Applying parameters...', 'success');
            
            // Apply parameters with smooth transition
            const success = await window.llmInterface.applyParameters(parameters, true);
            
            if (success) {
                this.showStatus(`✅ Applied: ${Object.keys(parameters).join(', ')}`, 'success');
                
                // Auto-close after 2 seconds on success
                setTimeout(() => {
                    if (this.isVisible) {
                        this.hide();
                    }
                }, 2000);
            } else {
                this.showStatus('❌ Failed to apply parameters', 'error');
            }

        } catch (error) {
            console.error('🤖 Parameter generation failed:', error);
            this.showStatus(`❌ ${error.message}`, 'error');
        }

        this.isProcessing = false;
    }

    showStatus(message, type = 'info') {
        let color = '#888';
        
        switch (type) {
            case 'success':
                color = '#00ff00';
                break;
            case 'error':
                color = '#ff4444';
                break;
            case 'loading':
                color = '#00ffff';
                break;
        }

        this.statusIndicator.innerHTML = message;
        this.statusIndicator.style.color = color;
    }

    show() {
        if (!this.overlay) {
            this.createInterface();
        }

        this.isVisible = true;
        this.overlay.style.display = 'flex';
        
        // Focus input field after animation
        setTimeout(() => {
            this.inputField.focus();
        }, 100);

        // Add opening animation
        this.overlay.style.opacity = '0';
        this.overlay.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.overlay.style.transition = 'all 0.3s ease';
            this.overlay.style.opacity = '1';
            this.overlay.style.transform = 'scale(1)';
        }, 10);
    }

    hide() {
        if (!this.isVisible) return;

        this.isVisible = false;
        this.autocompleteList.style.display = 'none';
        
        // Add closing animation
        this.overlay.style.transition = 'all 0.3s ease';
        this.overlay.style.opacity = '0';
        this.overlay.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.overlay.style.display = 'none';
        }, 300);
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// Global instance
window.llmUI = new LLMParameterUI();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LLMParameterUI;
}