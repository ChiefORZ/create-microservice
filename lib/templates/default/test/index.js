// Packages
const micro = require('micro');
const test = require('ava');
const listen = require('test-listen');
const fetch = require('node-fetch');

// Service
const service = require('../loader/loader');

test('service should return status 200', async t => {
  const microInstance = micro(service);
  const url = await listen(microInstance);
  const response = await fetch(url);
  const data = await response.text();

  t.deepEqual(response.status, 200);
  t.deepEqual(data, 'Hello, world');
});

test('unknown route should return status 404', async t => {
  const microInstance = micro(service);
  const url = await listen(microInstance);
  const response = await fetch(`${url}/error`);
  const data = await response.json();

  t.deepEqual(response.status, 404);
  t.deepEqual(data, { error: 'not found' });
});
