class BoomerGenZTranslator {
    constructor() {
        this.currentMode = 'boomer-to-genz';
        this.recognition = null;
        this.isListening = false;
        this.translationHistory = this.loadHistory();
        
        this.initializeElements();
        this.setupEventListeners();
        this.setupSpeechRecognition();
        this.renderHistory();
    }

    initializeElements() {
        // UI Elements
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.modeToggle = document.getElementById('modeToggle');
        this.inputLabel = document.getElementById('inputLabel');
        this.inputText = document.getElementById('inputText');
        this.voiceBtn = document.getElementById('voiceBtn');
        this.translateBtn = document.getElementById('translateBtn');
        this.surpriseBtn = document.getElementById('surpriseBtn');
        this.resultContainer = document.getElementById('resultContainer');
        this.copyBtn = document.getElementById('copyBtn');
        this.zMeterFill = document.getElementById('zMeterFill');
        this.zMeterText = document.getElementById('zMeterText');
        this.historyContainer = document.getElementById('historyContainer');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.reverseModeLabel = document.getElementById('reverseModeLabel');

        // Initialize dark mode
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark');
            this.darkModeToggle.textContent = '☀️ Light Mode';
        }
    }

    setupEventListeners() {
        // Dark mode toggle
        this.darkModeToggle.addEventListener('click', () => this.toggleDarkMode());

        // Mode toggle
        this.modeToggle.addEventListener('change', () => this.toggleTranslationMode());

        // Voice input
        this.voiceBtn.addEventListener('click', () => this.toggleVoiceInput());

        // Translation
        this.translateBtn.addEventListener('click', () => this.translateText());

        // Surprise me
        this.surpriseBtn.addEventListener('click', () => this.surpriseMe());

        // Copy button
        this.copyBtn.addEventListener('click', () => this.copyTranslation());

        // Clear history
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

        // Enter key for translation
        this.inputText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.translateText();
            }
        });

        // Auto-resize textarea
        this.inputText.addEventListener('input', () => {
            this.inputText.style.height = 'auto';
            this.inputText.style.height = this.inputText.scrollHeight + 'px';
        });
    }

    setupSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.voiceBtn.classList.add('listening');
                this.voiceBtn.title = 'Listening... Click to stop';
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.inputText.value = transcript;
                this.inputText.style.height = 'auto';
                this.inputText.style.height = this.inputText.scrollHeight + 'px';
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.voiceBtn.classList.remove('listening');
                this.voiceBtn.title = 'Voice Input';
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                this.voiceBtn.classList.remove('listening');
                this.voiceBtn.title = 'Voice Input';
                this.showNotification('Voice recognition failed. Please try again.', 'error');
            };
        } else {
            this.voiceBtn.style.display = 'none';
        }
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
        this.darkModeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }

    toggleTranslationMode() {
        const isReversed = this.modeToggle.checked;
        this.currentMode = isReversed ? 'genz-to-boomer' : 'boomer-to-genz';
        
        if (isReversed) {
            this.inputLabel.textContent = 'Enter your Gen Z phrase:';
            this.inputText.placeholder = "Type something like 'That slaps no cap'...";
            this.reverseModeLabel.classList.remove('hidden');
        } else {
            this.inputLabel.textContent = 'Enter your Boomer phrase:';
            this.inputText.placeholder = "Type something like 'I'm feeling happy today'...";
            this.reverseModeLabel.classList.add('hidden');
        }

        // Clear current input and result
        this.inputText.value = '';
        this.clearResult();
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            this.showNotification('Voice input not supported in this browser', 'error');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    async translateText() {
        const text = this.inputText.value.trim();
        if (!text) {
            this.showNotification('Please enter some text to translate', 'error');
            return;
        }

        this.showLoading(true);
        this.translateBtn.disabled = true;

        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    mode: this.currentMode
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Translation failed');
            }

            this.displayResult(data.translation);
            this.updateZMeter(data.slangIntensity || 0);
            
            if (data.shouldTriggerConfetti) {
                this.triggerConfetti();
            }

            // Save to history
            this.addToHistory(text, data.translation, this.currentMode);

        } catch (error) {
            console.error('Translation error:', error);
            this.showNotification(error.message || 'Translation failed. Please try again.', 'error');
        } finally {
            this.showLoading(false);
            this.translateBtn.disabled = false;
        }
    }

    async surpriseMe() {
        this.showLoading(true);
        
        try {
            const response = await fetch(`/random-phrase?mode=${this.currentMode}`);
            const data = await response.json();
            
            if (response.ok) {
                this.inputText.value = data.phrase;
                this.inputText.style.height = 'auto';
                this.inputText.style.height = this.inputText.scrollHeight + 'px';
                
                // Auto-translate after a short delay
                setTimeout(() => this.translateText(), 500);
            }
        } catch (error) {
            console.error('Surprise me error:', error);
            this.showNotification('Failed to get random phrase', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayResult(translation) {
        this.resultContainer.innerHTML = `<div class="result-text">${translation}</div>`;
        this.resultContainer.classList.add('has-result');
        this.copyBtn.classList.remove('hidden');
        this.currentTranslation = translation;
    }

    clearResult() {
        this.resultContainer.innerHTML = '<div class="result-placeholder"><p>🔮 Your translation will appear here...</p></div>';
        this.resultContainer.classList.remove('has-result');
        this.copyBtn.classList.add('hidden');
        this.updateZMeter(0);
    }

    updateZMeter(intensity) {
        this.zMeterFill.style.width = `${intensity}%`;
        this.zMeterText.textContent = `${Math.round(intensity)}%`;
    }

    triggerConfetti() {
        // Trigger confetti animation
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981']
        });

        // Additional confetti burst
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981']
            });
        }, 200);

        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981']
            });
        }, 400);
    }

    copyTranslation() {
        if (!this.currentTranslation) return;

        navigator.clipboard.writeText(this.currentTranslation).then(() => {
            this.copyBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                this.copyBtn.textContent = '📋 Copy that Slay';
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.currentTranslation;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.copyBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                this.copyBtn.textContent = '📋 Copy that Slay';
            }, 2000);
        });
    }

    addToHistory(original, translation, mode) {
        const historyItem = {
            id: Date.now(),
            original,
            translation,
            mode,
            timestamp: new Date().toLocaleString()
        };

        this.translationHistory.unshift(historyItem);
        
        // Keep only last 10 translations
        if (this.translationHistory.length > 10) {
            this.translationHistory = this.translationHistory.slice(0, 10);
        }

        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        if (this.translationHistory.length === 0) {
            this.historyContainer.innerHTML = '<p class="history-placeholder">No translations yet. Start translating to build your history!</p>';
            return;
        }

        this.historyContainer.innerHTML = this.translationHistory.map(item => `
            <div class="history-item">
                <div class="original">${item.original}</div>
                <div class="translation">"${item.translation}"</div>
                <div class="mode">${item.mode === 'boomer-to-genz' ? '👴 → 🧢' : '🧢 → 👴'} • ${item.timestamp}</div>
            </div>
        `).join('');
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear your translation history?')) {
            this.translationHistory = [];
            this.saveHistory();
            this.renderHistory();
            this.showNotification('History cleared!', 'success');
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('translationHistory');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }

    saveHistory() {
        localStorage.setItem('translationHistory', JSON.stringify(this.translationHistory));
    }

    showLoading(show) {
        this.loadingOverlay.classList.toggle('hidden', !show);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            transform: translateX(100%);
        `;

        // Set background color based on type
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#6366f1'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BoomerGenZTranslator();
});