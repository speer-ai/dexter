# Dexter Web (Next.js)

Dexter is a web‑based voice assistant inspired by the "Jarvis" interface. This refactored version uses **Next.js** with **Tailwind CSS** and the OpenAI API.

## Setup

1. Install Node.js (v18 or later).
2. Create a `.env.local` file at the repository root and set `OPENAI_API_KEY` to your API key.
3. Install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

Navigate to `http://localhost:3000` to use Dexter. API requests are handled by Next.js API routes.

## Production Build

```bash
npm run build
npm start
```

## Features

- Text and voice input using the browser Speech Recognition API.
- Text to speech responses.
- Simple chat interface with a webcam preview.
- All intelligence provided by OpenAI's `gpt-3.5-turbo` model.

Dexter speaks with an English accent and keeps a conversational history so replies feel natural.
