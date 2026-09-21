'use strict';

const express = require('express');
const multer = require('multer');
const { extractBasicMetadata } = require('./metadata');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

function createApp() {
  const app = express();

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/metadata', upload.single('file'), (req, res) => {
    try {
      const metadata = extractBasicMetadata(req.file);
      res.json(metadata);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return app;
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  createApp().listen(port, () => {
    console.log(`cra-demo listening on port ${port}`);
  });
}

module.exports = { createApp };
