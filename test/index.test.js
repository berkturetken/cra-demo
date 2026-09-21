'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createApp } = require('../src/index');

function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

function request(server, options, body) {
  return new Promise((resolve, reject) => {
    const { port } = server.address();
    const req = http.request({ ...options, port }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

test('GET /health returns ok', async () => {
  const server = await listen(createApp());
  try {
    const res = await request(server, { path: '/health', method: 'GET' });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), { status: 'ok' });
  } finally {
    server.close();
  }
});

test('POST /metadata without a file returns 400', async () => {
  const server = await listen(createApp());
  try {
    const res = await request(server, {
      path: '/metadata',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    assert.equal(res.statusCode, 400);
  } finally {
    server.close();
  }
});
