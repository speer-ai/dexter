# Dexter Web

Dexter is a web-based voice assistant inspired by the "Jarvis" interface. This version runs entirely with JavaScript and uses the OpenAI API for responses. It contains a small Node backend and a React frontend.

## Setup

1. Install Node.js (v18 or later).
2. Create a `.env` file in `server/` and set `OPENAI_API_KEY` to your API key.
3. From the repository root run:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

## Development

Run both the backend and the frontend during development:

```bash
# Terminal 1
cd server && npm start

# Terminal 2
cd client && npm run dev
```

The frontend will proxy API requests to the backend.

## Deployment

The project is designed to be deployed on Vercel. Deploy the `client` as a static site and the `server` as a serverless function or separate service.

## Features

- Text and voice input using the browser Speech Recognition API.
- Text to speech responses.
- Simple chat interface with a webcam preview in place of the original gesture controls.
- All intelligence provided by OpenAI's `gpt-3.5-turbo` model.

Dexter speaks with an English accent and keeps a conversational history so each reply feels natural.
