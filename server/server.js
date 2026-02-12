const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

// Tell the server to look for the .env file in the parent folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors()); 
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/coach', async (req, res) => {
  const { expenses, debts } = req.body;

  try {
    const response = await anthropic.messages.create({
   model: "claude-opus-4-6",// The highest intelligence model as of Feb 2026/ The official early 2026 stable name
      max_tokens: 1024,
      messages: [
        { 
          role: "user", 
          content: `You are a financial coach. Analyze these monthly expenses: ${JSON.stringify(expenses)} and debts: ${JSON.stringify(debts)}. Give 3 short, witty tips.` 
        }
      ],
    });

    res.json({ advice: response.content[0].text });
  // Find your catch block and update it to this:
} catch (error) {
  console.error("--- CLAUDE API ERROR ---");
  console.error("Status:", error.status); // e.g., 401, 403, 429
  console.error("Message:", error.message);
  console.error("------------------------");
  res.status(500).json({ error: error.message });
}
});

const PORT = process.env.PORT || 3001;
// Switching from 0.0.0.0 back to localhost/127.0.0.1 for local testing
app.listen(PORT, () => console.log(`🚀 Server running on http://127.0.0.1:${PORT}`));