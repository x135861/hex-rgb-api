/**
 * @file server.js
 * Entry point: starts the HTTP server. Port can be set with the PORT environment variable.
 */

'use strict';

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Hex-to-RGB API listening on http://localhost:${PORT}`);
});