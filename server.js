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

function createPdf(text) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.text(text);
    doc.end();
  });
}

app.post('/api/generate', async (req, res) => {
  const { topic = 'Mathematics', grade = '10', exam = false } = req.body;
  const prompt = `Create a ${exam ? 'final exam' : 'practice test'} for ${topic} grade ${grade}. ` +
    'Return your response strictly as JSON with two fields: "questions" (the question paper with marks only, no answers) ' +
    'and "answers" (the corresponding step-by-step solutions and marking guidelines).';
app.post('/api/generate', async (req, res) => {
  const { topic = 'Mathematics', grade = '10', exam = false } = req.body;
  const prompt = `Create a ${exam ? 'final exam' : 'practice test'} for ${topic} grade ${grade}. Provide problems followed by step-by-step solutions and include marking guidelines.`;

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

    const questionPdf = await createPdf(data.questions);
    const answerPdf = await createPdf(data.answers);

    res.json({
      questionPdf: questionPdf.toString('base64'),
      answerPdf: answerPdf.toString('base64'),
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
