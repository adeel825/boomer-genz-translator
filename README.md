# 🧠 Boomer ↔ Gen Z Translator

A fun and interactive web app that translates between "Boomer" language and Gen Z slang using Claude AI. Bridge the generational gap with AI-powered translations!

## ✨ Features

- **Bidirectional Translation**: Switch between Boomer → Gen Z and Gen Z → Boomer modes
- **Voice Input**: Use your microphone to speak your phrases (Web Speech API)
- **Dark Mode**: Toggle between light and dark themes
- **Z-Slang Intensity Meter**: Visual indicator of how much Gen Z slang is in the translation
- **Confetti Celebrations**: Automatic confetti when certain slang words appear
- **Translation History**: Keep track of your recent translations (stored locally)
- **Random Phrases**: "Surprise Me" button for random phrase generation
- **Copy to Clipboard**: Easy copying with the "Copy that Slay" button
- **Responsive Design**: Works great on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Claude API key from [Anthropic Console](https://console.anthropic.com/)

### Installation

1. **Clone or download this project**
   ```bash
   cd boomer-genz-translator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your Claude API key**
   - Open the `.env` file
   - Replace `your_claude_api_key_here` with your actual Claude API key:
   ```env
   CLAUDE_API_KEY=sk-ant-your-actual-api-key-here
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Start translating! 🎉

## 🔧 API Endpoints

### POST `/translate`
Translates text between Boomer and Gen Z language.

**Request Body:**
```json
{
  "text": "I'm feeling happy today",
  "mode": "boomer-to-genz"
}
```

**Response:**
```json
{
  "translation": "I'm absolutely vibing today fr fr ✨",
  "slangIntensity": 75,
  "shouldTriggerConfetti": false
}
```

### GET `/random-phrase`
Gets a random phrase for the "Surprise Me" feature.

**Query Parameters:**
- `mode`: "boomer-to-genz" or "genz-to-boomer"

**Response:**
```json
{
  "phrase": "That's really cool"
}
```

## 🎮 How to Use

1. **Choose Your Mode**: Use the toggle switch to select translation direction
2. **Input Text**: Type or speak your phrase using the microphone button
3. **Translate**: Click "✨ Translate" or press Enter
4. **View Results**: See your translation with the Z-Slang intensity meter
5. **Copy & Share**: Use "📋 Copy that Slay" to copy the result
6. **Try Random**: Click "🎲 Surprise Me" for random phrases
7. **Check History**: View your recent translations below

## 🎨 Features Explained

### Z-Slang Intensity Meter
- Measures how much Gen Z slang is in the translation
- Fills up based on detected slang words
- Color gradient from green to red

### Confetti Celebrations
Automatically triggers when these words appear:
- "yeet", "skrrt", "slay", "periodt", "bussin"

### Voice Input
- Click the 🎤 button to start voice recognition
- Speak clearly and the text will appear in the input field
- Works in most modern browsers

### Dark Mode
- Toggle between light and dark themes
- Setting is saved in browser storage
- Smooth transitions between modes

## 🛠️ Technical Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **AI**: Claude 3 Sonnet via Anthropic API
- **Libraries**: 
  - `axios` for HTTP requests
  - `cors` for cross-origin requests
  - `dotenv` for environment variables
  - `canvas-confetti` for celebrations
- **APIs**: Web Speech API for voice input

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CLAUDE_API_KEY` | Your Claude AI API key | Yes |
| `PORT` | Server port (default: 3000) | No |

## 🎯 Slang Words Detected

The app recognizes these Gen Z terms for the intensity meter:
- yeet, skrrt, no cap, fr fr, bussin, slay, periodt
- bet, vibes, sus, lowkey, highkey, stan, fam
- bestie, bop, slaps, hits different, valid, based

## 🤝 Contributing

Feel free to submit issues and enhancement requests! This is a fun project meant to bring generations together through humor and technology.

## 📄 License

MIT License - feel free to use this project for your own fun translations!

## 🎉 Have Fun!

Remember, this is all about having fun and bridging generational gaps. Whether you're a Boomer trying to understand "no cap" or Gen Z explaining why something "slaps," this app is here to help translate with a smile! 

*Made with 💜 and Claude AI*