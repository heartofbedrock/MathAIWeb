const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const PDFDocument = require('pdfkit');
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

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    const output = completion.choices[0].message.content;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="paper.pdf"');

    const doc = new PDFDocument();
    doc.pipe(res);
    doc.text(output);
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate paper' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
