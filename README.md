# MathAIWeb

A minimal web application that generates math papers with step-by-step solutions using the OpenAI API. The generated paper is returned as a downloadable PDF.

## Setup

1. Install dependencies (includes the `pdfkit` package for PDF generation):
   ```bash
   npm install
   ```

2. Create a `.env` file with your OpenAI key:
   ```env
   OPENAI_API_KEY=your-key-here
   ```

3. Run the development server:
   ```bash
   node server.js
   ```

The app will be available at `http://localhost:3000`.

Submitting the form will download a `paper.pdf` file containing the generated test or exam.

## Deployment

This project can be deployed to [Railway](https://railway.app) or any Node.js hosting provider. Ensure that the `OPENAI_API_KEY` environment variable is set on the host.
