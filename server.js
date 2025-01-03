const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Llama API configuration
const LLAMA_API_KEY = process.env.LLAMA_API_KEY;
 
const OPENAI_API_KEY = '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';

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: `You are a compassionate mental health support AI assistant named bro.ai. 
                            Provide empathetic, supportive responses while being clear that you're an AI and 
                            not a replacement for professional mental health care. If someone appears to be in 
                            crisis, always recommend professional help and provide the crisis hotline number (988).
                            Keep responses concise but caring.`
                }, {
                    role: "user",
                    content: userMessage
                }],
                temperature: 0.7,
                max_tokens: 150
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'API request failed');
        }

        res.json({ response: data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 