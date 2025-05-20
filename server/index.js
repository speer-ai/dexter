import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  try {
    const messages = history.concat({ role: 'user', content: message });
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });
    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Dexter server running on port ${PORT}`);
});
