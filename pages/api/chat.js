import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { message, history = [] } = req.body;
  try {
    const messages = history.concat({ role: 'user', content: message });
    const completion = await openai.chat.completions.create({
      model: 'grok-2-vision-1212',
      messages,
    });
    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'xAI request failed' });
  }
}
