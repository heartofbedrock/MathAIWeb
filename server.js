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

async function createPdf(text) {
  const escapeHtml = (str) =>
    str.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
    <script>document.addEventListener('DOMContentLoaded', function(){renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}]});});</script>
    <style>body{font-family:'Times New Roman',serif;padding:1in;}pre{white-space:pre-wrap;}</style>
  </head>
  <body><pre>${escapeHtml(text)}</pre></body>
  </html>`;
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(500);
    const buffer = await page.pdf({ format: 'A4', margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' } });
    await browser.close();
    return buffer;
  } catch (err) {
    console.error('PDF generation failed:', err);
    throw new Error('Failed to generate PDF');
  }
}

app.post('/api/generate', async (req, res) => {
  const { topic = 'Mathematics', grade = '10', exam = false } = req.body;
  const prompt = `Create a ${exam ? 'final exam' : 'practice test'} for ${topic} grade ${grade}. Provide problems followed by step-by-step solutions and include marking guidelines. Return your response as JSON with fields \"questions\" and \"answers\".`;

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate paper' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
