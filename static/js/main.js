// Kanoonu AI - Main JavaScript File

// Lawyer data array
let lawyers = [
    {
        id: 1,
        name: "Amit Sharma",
        phone: "9876543210",
        experience: "10 years",
        specialization: "Criminal Law",
        email: "amit.sharma@law.com",
        location: "Mumbai",
        rating: 4.8,
        cases_won: 150
    },
    {
        id: 2,
        name: "Neha Verma",
        phone: "9123456780",
        experience: "7 years",
        specialization: "Corporate Law",
        email: "neha.verma@law.com",
        location: "Delhi",
        rating: 4.6,
        cases_won: 120
    },
    {
        id: 3,
        name: "Rajesh Kumar",
        phone: "9988776655",
        experience: "15 years",
        specialization: "Family Law",
        email: "rajesh.kumar@law.com",
        location: "Bangalore",
        rating: 4.9,
        cases_won: 200
    },
    {
        id: 4,
        name: "Priya Singh",
        phone: "9871234567",
        experience: "5 years",
        specialization: "Property Law",
        email: "priya.singh@law.com",
        location: "Chennai",
        rating: 4.5,
        cases_won: 80
    }
];

// Utility functions
function getLawyerById(id) {
    return lawyers.find(lawyer => lawyer.id === parseInt(id));
}

function addLawyer(lawyerData) {
    const newId = Math.max(...lawyers.map(l => l.id)) + 1;
    const newLawyer = {
        id: newId,
        ...lawyerData
    };
    lawyers.push(newLawyer);
    return newLawyer;
}

function deleteLawyer(id) {
    const index = lawyers.findIndex(lawyer => lawyer.id === parseInt(id));
    if (index > -1) {
        lawyers.splice(index, 1);
        return true;
    }
    return false;
}

// Chat functionality
class ChatBot {
    constructor() {
        this.chatContainer = document.getElementById('chatContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.sendButtonText = document.getElementById('sendButtonText');
        this.sendButtonLoader = document.getElementById('sendButtonLoader');
        this.thinkingIndicator = document.getElementById('thinkingIndicator');
        this.thinkingTimer = document.getElementById('thinkingTimer');
        this.isLoading = false;
        this.thinkingStartTime = null;
        this.thinkingInterval = null;
        
        // Voice Assistant Properties
        this.recognition = null;
        this.isListening = false;
        this.readAloudEnabled = true;
        this.currentLanguage = 'en-IN';
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        
        this.init();
    }
    
    init() {
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        // Initialize Voice Recognition
        this.initVoiceRecognition();
        
        // Initialize Read Aloud Toggle
        this.initReadAloudToggle();
        
        // Initialize Language Selector
        this.initLanguageSelector();
        
        // Add welcome message
        this.addMessage('AI', 'Hello! I\'m Kanoonu AI, your legal assistant. How can I help you today?');
    }
    
    initVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser');
            const voiceButton = document.getElementById('voiceButton');
            if (voiceButton) {
                voiceButton.disabled = true;
                voiceButton.title = 'Speech recognition not supported';
            }
            return;
        }
        
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = this.currentLanguage;
        
        const voiceButton = document.getElementById('voiceButton');
        if (voiceButton) {
            voiceButton.addEventListener('click', () => this.toggleVoiceInput());
        }
        
        this.recognition.onstart = () => {
            this.isListening = true;
            this.showListeningIndicator();
            this.updateVoiceButton(true);
        };
        
        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
            
            if (this.messageInput) {
                this.messageInput.value = finalTranscript || interimTranscript;
            }
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.hideListeningIndicator();
            this.updateVoiceButton(false);
            this.isListening = false;
            
            if (event.error === 'no-speech') {
                alert('No speech detected. Please try again.');
            } else if (event.error === 'not-allowed') {
                alert('Microphone permission denied. Please enable microphone access.');
            }
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.hideListeningIndicator();
            this.updateVoiceButton(false);
        };
    }
    
    initReadAloudToggle() {
        const readAloudToggle = document.getElementById('readAloudToggle');
        if (readAloudToggle) {
            readAloudToggle.addEventListener('click', () => {
                this.readAloudEnabled = !this.readAloudEnabled;
                this.updateReadAloudButton();
                
                if (!this.readAloudEnabled && this.currentUtterance) {
                    this.synthesis.cancel();
                }
            });
        }
    }
    
    initLanguageSelector() {
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                if (this.recognition) {
                    this.recognition.lang = this.currentLanguage;
                }
            });
        }
    }
    
    toggleVoiceInput() {
        if (!this.recognition) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }
        
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }
    
    showListeningIndicator() {
        const indicator = document.getElementById('listeningIndicator');
        const listeningText = document.getElementById('listeningText');
        const listeningLanguage = document.getElementById('listeningLanguage');
        
        if (indicator) {
            indicator.classList.remove('hidden');
            
            const langNames = {
                'en-IN': 'English',
                'hi-IN': 'Hindi',
                'kn-IN': 'Kannada'
            };
            
            if (listeningLanguage) {
                listeningLanguage.textContent = `(${langNames[this.currentLanguage] || this.currentLanguage})`;
            }
        }
    }
    
    hideListeningIndicator() {
        const indicator = document.getElementById('listeningIndicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }
    
    updateVoiceButton(isListening) {
        const voiceButton = document.getElementById('voiceButton');
        const voiceIcon = document.getElementById('voiceIcon');
        
        if (voiceButton && voiceIcon) {
            if (isListening) {
                voiceButton.classList.add('animate-pulse');
                voiceButton.classList.remove('from-indigo-500', 'to-purple-600');
                voiceButton.classList.add('from-red-500', 'to-pink-600');
                voiceIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
            } else {
                voiceButton.classList.remove('animate-pulse');
                voiceButton.classList.remove('from-red-500', 'to-pink-600');
                voiceButton.classList.add('from-indigo-500', 'to-purple-600');
                voiceIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>';
            }
        }
    }
    
    updateReadAloudButton() {
        const readAloudToggle = document.getElementById('readAloudToggle');
        const readAloudIcon = document.getElementById('readAloudIcon');
        
        if (readAloudToggle && readAloudIcon) {
            if (this.readAloudEnabled) {
                readAloudToggle.classList.remove('from-gray-500', 'to-gray-600');
                readAloudToggle.classList.add('from-cyan-500', 'to-teal-600');
                readAloudToggle.title = 'Read aloud enabled - Click to disable';
            } else {
                readAloudToggle.classList.remove('from-cyan-500', 'to-teal-600');
                readAloudToggle.classList.add('from-gray-500', 'to-gray-600');
                readAloudToggle.title = 'Read aloud disabled - Click to enable';
            }
        }
    }
    
    speakText(text, language = null) {
        if (!this.readAloudEnabled || !this.synthesis) return;
        
        // Stop any current speech
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language || this.currentLanguage;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Select appropriate voice for language
        const voices = this.synthesis.getVoices();
        const langCode = (language || this.currentLanguage).split('-')[0];
        const preferredVoice = voices.find(voice => 
            voice.lang.startsWith(langCode) && voice.localService
        ) || voices.find(voice => voice.lang.startsWith(langCode));
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        utterance.onend = () => {
            this.currentUtterance = null;
        };
        
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.currentUtterance = null;
        };
        
        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);
    }
    
    addMessage(sender, message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${
            isUser ? 'user-message-enter' : 'ai-message-enter'
        }`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = `max-w-xs lg:max-w-md px-6 py-4 rounded-2xl ${
            isUser 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white'
        } shadow-lg hover-lift`;
        
        const senderSpan = document.createElement('div');
        senderSpan.className = 'text-xs font-semibold opacity-80 mb-1';
        senderSpan.textContent = sender;
        
        const messageSpan = document.createElement('div');
        messageSpan.className = 'text-sm leading-relaxed';
        messageSpan.textContent = message;
        
        bubbleDiv.appendChild(senderSpan);
        bubbleDiv.appendChild(messageSpan);
        messageDiv.appendChild(bubbleDiv);
        
        if (this.chatContainer) {
            this.chatContainer.appendChild(messageDiv);
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
    }
    
    async sendMessage() {
        if (this.isLoading) return;
        
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage('You', message, true);
        this.messageInput.value = '';
        
        // Show thinking indicator
        this.showThinkingIndicator();
        
        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: message })
            });
            
            const data = await response.json();
            this.hideThinkingIndicator();
            this.addMessage('AI', data.answer);
            
            // Read aloud the response
            if (this.readAloudEnabled) {
                this.speakText(data.answer, this.currentLanguage);
            }
        } catch (error) {
            this.hideThinkingIndicator();
            this.addMessage('AI', 'Sorry, I encountered an error. Please try again.');
            console.error('Error:', error);
        }
    }
    
    showThinkingIndicator() {
        this.isLoading = true;
        this.thinkingStartTime = Date.now();
        
        // Show thinking indicator
        if (this.thinkingIndicator) {
            this.thinkingIndicator.classList.remove('hidden');
        }
        
        // Update button state
        if (this.sendButton) {
            this.sendButton.disabled = true;
        }
        if (this.sendButtonText) {
            this.sendButtonText.classList.add('hidden');
        }
        if (this.sendButtonLoader) {
            this.sendButtonLoader.classList.remove('hidden');
        }
        
        // Start timer
        this.thinkingInterval = setInterval(() => {
            if (this.thinkingStartTime && this.thinkingTimer) {
                const elapsed = Math.floor((Date.now() - this.thinkingStartTime) / 1000);
                this.thinkingTimer.textContent = `${elapsed}s`;
            }
        }, 1000);
    }
    
    hideThinkingIndicator() {
        this.isLoading = false;
        
        // Hide thinking indicator
        if (this.thinkingIndicator) {
            this.thinkingIndicator.classList.add('hidden');
        }
        
        // Update button state
        if (this.sendButton) {
            this.sendButton.disabled = false;
        }
        if (this.sendButtonText) {
            this.sendButtonText.classList.remove('hidden');
        }
        if (this.sendButtonLoader) {
            this.sendButtonLoader.classList.add('hidden');
        }
        
        // Clear timer
        if (this.thinkingInterval) {
            clearInterval(this.thinkingInterval);
            this.thinkingInterval = null;
        }
        this.thinkingStartTime = null;
        
        // Reset timer display
        if (this.thinkingTimer) {
            this.thinkingTimer.textContent = '0s';
        }
    }
}

// Lawyer page functionality
function renderLawyers() {
    const container = document.getElementById('lawyersContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    lawyers.forEach(lawyer => {
        const card = document.createElement('div');
        card.className = 'lawyer-card';
        card.onclick = () => window.location.href = `/lawyer_detail?id=${lawyer.id}`;
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-gray-800">${lawyer.name}</h3>
                <span class="text-sm text-gray-500">${lawyer.rating} ⭐</span>
            </div>
            <div class="space-y-2">
                <p class="text-gray-600"><span class="font-semibold">Experience:</span> ${lawyer.experience}</p>
                <p class="text-gray-600"><span class="font-semibold">Specialization:</span> ${lawyer.specialization}</p>
                <p class="text-gray-600"><span class="font-semibold">Location:</span> ${lawyer.location}</p>
                <p class="text-gray-600"><span class="font-semibold">Cases Won:</span> ${lawyer.cases_won}</p>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="text-sm text-gray-500">Click to view full profile</p>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Lawyer detail page functionality
function renderLawyerDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const lawyerId = urlParams.get('id');
    
    if (!lawyerId) {
        window.location.href = '/lawyers';
        return;
    }
    
    const lawyer = getLawyerById(lawyerId);
    if (!lawyer) {
        window.location.href = '/lawyers';
        return;
    }
    
    const container = document.getElementById('lawyerDetail');
    if (!container) return;
    
    container.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div class="text-center mb-8">
                <div class="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span class="text-white text-4xl font-bold">${lawyer.name.charAt(0)}</span>
                </div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">${lawyer.name}</h1>
                <p class="text-lg text-gray-600">${lawyer.specialization} Expert</p>
                <div class="flex items-center justify-center mt-2">
                    <span class="text-yellow-500 text-xl">${'⭐'.repeat(Math.floor(lawyer.rating))}</span>
                    <span class="ml-2 text-gray-600">${lawyer.rating}/5</span>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div>
                        <h3 class="font-semibold text-gray-700 mb-1">Experience</h3>
                        <p class="text-gray-600">${lawyer.experience}</p>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-700 mb-1">Specialization</h3>
                        <p class="text-gray-600">${lawyer.specialization}</p>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-700 mb-1">Location</h3>
                        <p class="text-gray-600">${lawyer.location}</p>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <h3 class="font-semibold text-gray-700 mb-1">Phone</h3>
                        <p class="text-gray-600">${lawyer.phone}</p>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-700 mb-1">Email</h3>
                        <p class="text-gray-600">${lawyer.email}</p>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-700 mb-1">Cases Won</h3>
                        <p class="text-gray-600">${lawyer.cases_won}</p>
                    </div>
                </div>
            </div>
            
            <div class="mt-8 pt-6 border-t border-gray-200">
                <div class="flex space-x-4">
                    <button class="btn-primary flex-1" onclick="window.location.href='tel:${lawyer.phone}'">
                        📞 Call Now
                    </button>
                    <button class="btn-secondary flex-1" onclick="window.location.href='mailto:${lawyer.email}'">
                        ✉️ Email
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Admin page functionality
function renderAdminTable() {
    const container = document.getElementById('lawyersTable');
    if (!container) return;
    
    const tbody = container.querySelector('tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    lawyers.forEach(lawyer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${lawyer.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${lawyer.phone}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${lawyer.experience}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${lawyer.specialization}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="deleteLawyerAdmin(${lawyer.id})" class="btn-danger">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteLawyerAdmin(id) {
    if (confirm('Are you sure you want to delete this lawyer?')) {
        if (deleteLawyer(id)) {
            renderAdminTable();
            showNotification('Lawyer deleted successfully!', 'success');
        } else {
            showNotification('Error deleting lawyer!', 'error');
        }
    }
}

function addLawyerAdmin() {
    const form = document.getElementById('addLawyerForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const lawyerData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        experience: formData.get('experience'),
        specialization: formData.get('specialization'),
        email: formData.get('email'),
        location: formData.get('location'),
        rating: parseFloat(formData.get('rating')) || 4.0,
        cases_won: parseInt(formData.get('cases_won')) || 0
    };
    
    // Validate required fields
    if (!lawyerData.name || !lawyerData.phone || !lawyerData.experience || !lawyerData.specialization) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    addLawyer(lawyerData);
    renderAdminTable();
    form.reset();
    showNotification('Lawyer added successfully!', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load voices for speech synthesis (needed for some browsers)
    if ('speechSynthesis' in window) {
        let voices = speechSynthesis.getVoices();
        if (voices.length === 0) {
            speechSynthesis.onvoiceschanged = () => {
                voices = speechSynthesis.getVoices();
            };
        }
    }
    
    const currentPage = window.location.pathname;
    
    switch(currentPage) {
        case '/':
        case '/index.html':
            // Landing page - no specific JS needed
            break;
            
        case '/chatbot':
        case '/chatbot.html':
            new ChatBot();
            break;
            
        case '/lawyers':
        case '/lawyers.html':
            renderLawyers();
            break;
            
        case '/lawyer_detail':
        case '/lawyer_detail.html':
            renderLawyerDetail();
            break;
            
        case '/admin':
        case '/admin.html':
            renderAdminTable();
            break;
    }
});

