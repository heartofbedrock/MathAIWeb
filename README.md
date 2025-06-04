# MathAIWeb

f66m3b-codex/build-ai-based-math-paper-generator-website
A minimal web application that generates math papers with step-by-step solutions using the OpenAI API. The generated paper is returned as a downloadable PDF.

## Requirements

- Node.js 18 or newer

## Setup

1. Install dependencies (includes the `pdfkit` package for PDF generation):
=======
main
   ```bash
   npm install
   ```

f66m3b-codex/build-ai-based-math-paper-generator-website
2. Copy `.env.example` to `.env` and add your OpenAI key:
   ```bash
   cp .env.example .env
   # edit .env and set OPENAI_API_KEY
=======
2. Create a `.env` file with your OpenAI key:
   ```env
   OPENAI_API_KEY=your-key-here
main
   ```

3. Run the development server:
   ```bash
f66m3b-codex/build-ai-based-math-paper-generator-website
   npm start
=======
   node server.js
main
   ```

The app will be available at `http://localhost:3000`.

f66m3b-codex/build-ai-based-math-paper-generator-website
Submitting the form will download a `paper.pdf` file containing the generated test or exam.
=======
main

## Deployment

This project can be deployed to [Railway](https://railway.app) or any Node.js hosting provider. Ensure that the `OPENAI_API_KEY` environment variable is set on the host.
