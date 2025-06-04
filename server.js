const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

}

app.post('/api/generate', async (req, res) => {
  const { topic = 'Mathematics', grade = '10', exam = false } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    let data;
    try {
      data = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      console.error('Failed to parse JSON from OpenAI');
      return res.status(500).json({ error: 'Invalid AI response' });
    }

    const title = `${topic} Grade ${grade} ${exam ? 'Exam' : 'Worksheet'}`;
    const questionPdf = await createWorksheet(title, 'Questions', data.questions);
    const answerPdf = await createWorksheet(title, 'Solutions', data.answers);

    res.json({
      questionPdf: questionPdf.toString('base64'),
      answerPdf: answerPdf.toString('base64'),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate paper' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
