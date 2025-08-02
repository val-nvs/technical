/**
 * 7-Segment Display Component
 * Usage: SevenSegmentDisplay.create(containerElement)
 */
const SevenSegmentDisplay = {
    // Auto-inject CSS when first used
    cssInjected: false,
    
    injectCSS() {
        if (this.cssInjected) return;
        
        // Inject CSS with local font
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'DSEG7Modern';
                src: url('./DSEG7Modern-BoldItalic.ttf') format('truetype');
                font-weight: bold;
                font-style: italic;
            }

            .seven-segment-container {
                position: relative;
                display: inline-block;
                cursor: pointer;
                margin: 30px auto;
                transition: all 0.3s ease;
            }

            .seven-segment-container:hover {
                transform: scale(1.02);
            }

            .seven-segment-container.focused {
                outline: 2px solid #00ff41;
                outline-offset: 8px;
                animation: seven-segment-pulse 1.5s infinite;
            }

            @keyframes seven-segment-pulse {
                0%, 100% { outline-color: #00ff41; }
                50% { outline-color: #00ff4180; }
            }

            .seven-segment-background {
                font-family: 'DSEG7Modern', monospace;
                font-size: 8rem;
                font-weight: bold;
                font-style: italic;
                color: #333;
                user-select: none;
                pointer-events: none;
                letter-spacing: 0.1em;
            }

            .seven-segment-active {
                font-family: 'DSEG7Modern', monospace;
                font-size: 8rem;
                font-weight: bold;
                font-style: italic;
                color: #00ff41;
                position: absolute;
                top: 0;
                left: 0;
                user-select: none;
                pointer-events: none;
                letter-spacing: 0.1em;
            }
        `;
        document.head.appendChild(style);
        this.cssInjected = true;
    },
    
    create(parentElement) {
        this.injectCSS();
        
        // Create HTML structure
        const container = document.createElement('div');
        container.className = 'seven-segment-container';
        
        const background = document.createElement('div');
        background.className = 'seven-segment-background';
        background.textContent = '888';
        
        const active = document.createElement('div');
        active.className = 'seven-segment-active';
        active.textContent = '000';
        
        container.appendChild(background);
        container.appendChild(active);
        parentElement.appendChild(container);
        
        // Component state
        let value = "000";
        let isFocused = false;
        
        function updateDisplay() {
            let significantStart = value.search(/[1-9]/);
            
            if (significantStart === -1) {
                active.innerHTML = `<span style="color: #333;">${value}</span>`;
            } else {
                const leadingZeros = value.substring(0, significantStart);
                const significantDigits = value.substring(significantStart);
                
                active.innerHTML = 
                    `<span style="color: #333;">${leadingZeros}</span>` +
                    `<span style="color: #00ff41;">${significantDigits}</span>`;
            }
        }
        
        function setFocus() {
            container.classList.add('focused');
            isFocused = true;
            value = "000";
            updateDisplay();
        }
        
        function removeFocus() {
            container.classList.remove('focused');
            isFocused = false;
        }
        
        // Event listeners
        container.addEventListener('click', () => {
            setFocus();
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.seven-segment-container') || 
                !container.contains(e.target)) {
                removeFocus();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (!isFocused) return;
            
            const key = e.key;
            
            if (key >= '0' && key <= '9') {
                value = value.slice(1) + key;
                updateDisplay();
                e.preventDefault();
            }
            else if (key === 'Escape') {
                removeFocus();
            }
        });
        
        updateDisplay();
        
        // Return API for external control
        return {
            setValue(newValue) {
                value = newValue.toString().padStart(3, '0').slice(-3);
                updateDisplay();
            },
            getValue() {
                return value;
            },
            focus() {
                setFocus();
            },
            blur() {
                removeFocus();
            },
            destroy() {
                container.remove();
            }
        };
    }
};