const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate', async (req, res) => {
  const { topic = 'Mathematics', grade = '10', exam = false } = req.body;
  const prompt = `Create a ${exam ? 'final exam' : 'practice test'} for ${topic} grade ${grade}. Provide problems followed by step-by-step solutions and include marking guidelines.`;

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
