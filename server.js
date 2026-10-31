import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT || 3000);
const model = process.env.OPENAI_MODEL || 'gpt-5.5';

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

// Small in-memory per-IP throttle for local development. Add durable rate limiting
// and authentication before exposing this endpoint publicly.
const requests = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
app.use('/api/', (req, res, next) => {
  const now = Date.now();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  let state = requests.get(ip);
  if (!state || now - state.start > WINDOW_MS) state = { start: now, count: 0 };
  state.count += 1;
  requests.set(ip, state);
  if (state.count > MAX_REQUESTS) return res.status(429).json({ error: 'Too many requests. Wait a few minutes and try again.' });
  next();
});

app.get('/api/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true, configured: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'replace_with_your_private_key'), model });
});

app.post('/api/ai', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const input = typeof req.body?.input === 'string' ? req.body.input.trim() : '';
  const instructions = typeof req.body?.instructions === 'string' ? req.body.instructions.trim().slice(0, 4000) : '';
  if (!input) return res.status(400).json({ error: 'Enter a message for the AI first.' });
  if (input.length > 12000) return res.status(413).json({ error: 'Your message is too long. Keep it under 12,000 characters.' });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'replace_with_your_private_key') {
    return res.status(503).json({ error: 'AI is not configured yet. Copy .env.example to .env and set OPENAI_API_KEY.' });
  }
  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        instructions: [
          'You are NeonNova AI Lab, a helpful AI assistant for creating, testing, understanding, and integrating AI-powered software.',
          'Be honest about limitations. Do not claim to have executed code, trained a model, or deployed an app unless a tool actually did so.',
          'Protect secrets and recommend safe server-side handling of credentials.',
          instructions
        ].filter(Boolean).join('\n\n'),
        input
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const providerMessage = data?.error?.message || `AI provider returned HTTP ${response.status}.`;
      const safeMessage = response.status === 401 ? 'The API key was rejected. Check OPENAI_API_KEY in .env.'
        : response.status === 429 ? 'The API provider reported a rate or quota limit. Check your API project usage and billing.'
        : response.status >= 500 ? 'The AI provider is temporarily unavailable. Try again shortly.'
        : providerMessage;
      return res.status(response.status === 401 ? 502 : response.status === 429 ? 429 : 502).json({ error: safeMessage });
    }
    const output = typeof data.output_text === 'string' ? data.output_text : (data.output || [])
      .flatMap(item => item.content || []).filter(part => part.type === 'output_text').map(part => part.text).join('\n');
    if (!output) return res.status(502).json({ error: 'The AI provider returned no text. Try a different request.' });
    return res.json({ output, model: data.model || model, responseId: data.id || null });
  } catch (error) {
    console.error('AI provider request failed:', error?.message || 'unknown error');
    return res.status(502).json({ error: 'Could not reach the AI provider. Check your internet connection and try again.' });
  }
});

app.use(express.static(__dirname, { dotfiles: 'ignore', index: 'index.html' }));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(port, () => {
  console.log(`NeonNova is running at http://localhost:${port}`);
  console.log(`AI model: ${model}. API key configured: ${Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'replace_with_your_private_key')}`);
});
