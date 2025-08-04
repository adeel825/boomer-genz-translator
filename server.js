const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/translate', async (req, res) => {
  try {
    const { text, mode } = req.body;
    
    if (!text || !mode) {
      return res.status(400).json({ error: 'Text and mode are required' });
    }

    if (!process.env.CLAUDE_API_KEY) {
      return res.status(500).json({ error: 'Claude API key not configured' });
    }

    let prompt;
    if (mode === 'boomer-to-genz') {
      prompt = `Translate this Boomer phrase into Gen Z slang. Make it short, fun, expressive, and current: "${text}"`;
    } else if (mode === 'genz-to-boomer') {
      prompt = `Translate this Gen Z phrase into a plain sentence a Boomer would say: "${text}"`;
    } else {
      return res.status(400).json({ error: 'Invalid mode. Use "boomer-to-genz" or "genz-to-boomer"' });
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    const translation = response.data.content[0].text.trim();
    
    // Calculate slang intensity for Z-meter
    const slangWords = ['yeet', 'skrrt', 'no cap', 'fr fr', 'bussin', 'slay', 'periodt', 'bet', 'vibes', 'sus', 'lowkey', 'highkey', 'stan', 'fam', 'bestie', 'bop', 'slaps', 'hits different', 'valid', 'based'];
    const slangCount = slangWords.filter(word => 
      translation.toLowerCase().includes(word.toLowerCase())
    ).length;
    const slangIntensity = Math.min((slangCount / 3) * 100, 100);

    // Check for confetti trigger words
    const confettiTriggers = ['yeet', 'skrrt', 'slay', 'periodt', 'bussin'];
    const shouldTriggerConfetti = confettiTriggers.some(word => 
      translation.toLowerCase().includes(word.toLowerCase())
    );

    res.json({
      translation,
      slangIntensity,
      shouldTriggerConfetti
    });

  } catch (error) {
    console.error('Translation error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Translation failed', 
      details: error.response?.data?.error?.message || error.message 
    });
  }
});

// Random phrases endpoint for "Surprise Me" feature
app.get('/random-phrase', (req, res) => {
  const { mode } = req.query;
  
  const boomerPhrases = [
    "I'm feeling happy today",
    "That's really cool",
    "You did a great job",
    "I don't understand this technology",
    "Back in my day, we worked hard",
    "That music is too loud",
    "Kids these days don't know how good they have it",
    "I need to call customer service",
    "This app is confusing",
    "I'm proud of you"
  ];
  
  const genzPhrases = [
    "That's so fire fr fr",
    "This slaps no cap",
    "You're absolutely valid bestie",
    "That's giving main character energy",
    "I'm living for this vibe",
    "This hits different periodt",
    "You understood the assignment",
    "That's bussin bussin",
    "We stan a legend",
    "Touch grass bestie"
  ];
  
  const phrases = mode === 'boomer-to-genz' ? boomerPhrases : genzPhrases;
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  
  res.json({ phrase: randomPhrase });
});

app.listen(PORT, () => {
  console.log(`🚀 Boomer to Gen Z Translator running on http://localhost:${PORT}`);
  console.log('Make sure to set your CLAUDE_API_KEY in the .env file!');
});