import express from 'express';
const app = express.Router();

app.get('/get', async function (req, res) {
  res.json({ ok: true });
});

export default app;
