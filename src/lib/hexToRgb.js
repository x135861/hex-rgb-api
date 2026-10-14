/**
 * @file hexToRgb.js
 * Small library for converting hexadecimal colour values to RGB values.
 *
 * Supported input formats (case-insensitive, leading "#" is optional):
 *   - 6 digits: "#FF5733" or "ff5733"
 *   - 3 digits (shorthand): "#F53" which expands to "#FF5533"
 */

'use strict';

/** Matches 3 or 6 hexadecimal digits with an optional leading "#". */
const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Converts a hex colour string to an RGB object.
 *
 * @param {string} hex - Hex colour, e.g. "#ff5733", "ff5733" or "#f53".
 * @returns {{r: number, g: number, b: number}} RGB channels, each 0-255.
 * @throws {TypeError} If `hex` is not a string.
 * @throws {Error} If `hex` is not a valid 3 or 6 digit hex colour.
 *
 * @example
 * hexToRgb('#ff5733'); // { r: 255, g: 87, b: 51 }
 */
function hexToRgb(hex) {
    if (typeof hex !== 'string') {
        throw new TypeError('Hex value must be a string');
    }

    const match = HEX_PATTERN.exec(hex.trim());
    if (!match) {
        throw new Error(`Invalid hex colour: "${hex}". Use 3 or 6 hex digits, e.g. #ff5733`);
    }

    let digits = match[1];
    if (digits.length === 3) {
        // Expand shorthand: "f53" -> "ff5533"
        digits = digits
            .split('')
            .map((ch) => ch + ch)
            .join('');
    }

    return {
        r: parseInt(digits.slice(0, 2), 16),
        g: parseInt(digits.slice(2, 4), 16),
        b: parseInt(digits.slice(4, 6), 16),
    };
}

module.exports = { hexToRgb };