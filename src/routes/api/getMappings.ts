import express from 'express';
const app = express.Router();

app.get('/getMapping', async function (req, res) {
  res.json({ ok: true });
});

export default app;
