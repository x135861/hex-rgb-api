/**
 * @file app.js
 * Express application with the hex-to-RGB route.
 * The app is exported without calling listen() so that tests can use it directly.
 */

'use strict';

const express = require('express');
const { hexToRgb } = require('./lib/hexToRgb');

const app = express();

/**
 * GET /api/hex-to-rgb?hex=<value>
 *
 * Query parameter `hex`: 3 or 6 digit hex colour, "#" optional (encode it as %23 in a URL).
 * 200: { hex: "#RRGGBB", rgb: { r, g, b }, css: "rgb(r, g, b)" }
 * 400: { error: "<message>" } when `hex` is missing or invalid.
 */
app.get('/api/hex-to-rgb', (req, res) => {
    const { hex } = req.query;

    if (hex === undefined) {
        return res.status(400).json({ error: 'Query parameter "hex" is required' });
    }

    try {
        const rgb = hexToRgb(hex);
        const normalized = `#${hex.trim().replace(/^#/, '').toUpperCase()}`;
        return res.status(200).json({
            hex: normalized,
            rgb,
            css: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

/** Fallback for unknown routes, returned as JSON instead of Express' default HTML. */
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

module.exports = app;