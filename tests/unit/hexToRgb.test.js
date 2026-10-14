/**
 * @file hexToRgb.test.js
 * Unit tests for the hexToRgb library function (no HTTP, no Express).
 */

'use strict';

const { hexToRgb } = require('../../src/lib/hexToRgb');

describe('hexToRgb - valid input', () => {
    test.each([
        ['#ff5733', { r: 255, g: 87, b: 51 }],
        ['ff5733', { r: 255, g: 87, b: 51 }],
        ['#FF5733', { r: 255, g: 87, b: 51 }],
        ['#000000', { r: 0, g: 0, b: 0 }],
        ['#ffffff', { r: 255, g: 255, b: 255 }],
        ['#f53', { r: 255, g: 85, b: 51 }],
        ['abc', { r: 170, g: 187, b: 204 }],
        ['  #00ff00  ', { r: 0, g: 255, b: 0 }],
    ])('converts %p to %p', (input, expected) => {
        expect(hexToRgb(input)).toEqual(expected);
    });

    test('upper and lower case give the same result', () => {
        expect(hexToRgb('#AbCdEf')).toEqual(hexToRgb('#abcdef'));
    });

    test('shorthand equals the expanded form', () => {
        expect(hexToRgb('#1a2')).toEqual(hexToRgb('#11aa22'));
    });

    test('every channel is an integer between 0 and 255', () => {
        const { r, g, b } = hexToRgb('#7f80ff');
        [r, g, b].forEach((c) => {
            expect(Number.isInteger(c)).toBe(true);
            expect(c).toBeGreaterThanOrEqual(0);
            expect(c).toBeLessThanOrEqual(255);
        });
    });
});

describe('hexToRgb - invalid input', () => {
    test.each([
        [''],
        ['#'],
        ['#ff'],
        ['#ffff'],
        ['#fffff'],
        ['#fffffff'],
        ['#gggggg'],
        ['#12345z'],
        ['##ff5733'],
        ['ff 57 33'],
    ])('throws Error for %p', (input) => {
        expect(() => hexToRgb(input)).toThrow(Error);
        expect(() => hexToRgb(input)).toThrow(/Invalid hex colour/);
    });

    test.each([[undefined], [null], [123], [{}], [['#fff']], [true]])(
        'throws TypeError for non-string %p',
        (input) => {
            expect(() => hexToRgb(input)).toThrow(TypeError);
        }
    );
});