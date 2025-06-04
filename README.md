# MathAIWeb

A minimal web application that generates math papers with step-by-step solutions using the OpenAI API. The server returns two PDFs: one with the questions only and another with the answers and marking guidelines.

## Requirements

- Node.js 18 or newer

## Setup

1. Install dependencies (includes the `katex` and `puppeteer` packages for PDF generation):
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and add your OpenAI key:
   ```bash
   cp .env.example .env
   # edit .env and set OPENAI_API_KEY
   ```

3. Run the development server:
   ```bash
   npm start
   ```

The app will be available at `http://localhost:3000`.

## Deployment

This project can be deployed to [Railway](https://railway.app) or any Node.js hosting provider. Ensure that the `OPENAI_API_KEY` environment variable is set on the host.
