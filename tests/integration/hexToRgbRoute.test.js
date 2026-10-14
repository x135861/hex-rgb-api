/**
 * @file hexToRgbRoute.test.js
 * Integration tests for GET /api/hex-to-rgb. Supertest sends real HTTP requests to the
 * Express app (without opening a port), so routing, query parsing, the library and the
 * JSON response are all tested together.
 */

'use strict';

const request = require('supertest');
const app = require('../../src/app');

const ROUTE = '/api/hex-to-rgb';

describe(`GET ${ROUTE} - successful conversions`, () => {
    test('converts a 6 digit hex without "#"', async () => {
        const res = await request(app).get(ROUTE).query({ hex: 'ff5733' });

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/application\/json/);
        expect(res.body).toEqual({
            hex: '#FF5733',
            rgb: { r: 255, g: 87, b: 51 },
            css: 'rgb(255, 87, 51)',
        });
    });

    test('accepts a URL-encoded "#" (%23)', async () => {
        const res = await request(app).get(`${ROUTE}?hex=%2300ff00`);

        expect(res.status).toBe(200);
        expect(res.body.rgb).toEqual({ r: 0, g: 255, b: 0 });
    });

    test('converts a 3 digit shorthand', async () => {
        const res = await request(app).get(ROUTE).query({ hex: '#f53' });

        expect(res.status).toBe(200);
        expect(res.body.rgb).toEqual({ r: 255, g: 85, b: 51 });
    });

    test('is case-insensitive', async () => {
        const lower = await request(app).get(ROUTE).query({ hex: 'abcdef' });
        const upper = await request(app).get(ROUTE).query({ hex: 'ABCDEF' });

        expect(lower.body).toEqual(upper.body);
    });

    test.each([
        ['000000', { r: 0, g: 0, b: 0 }],
        ['ffffff', { r: 255, g: 255, b: 255 }],
    ])('handles boundary value %s', async (hex, rgb) => {
        const res = await request(app).get(ROUTE).query({ hex });

        expect(res.status).toBe(200);
        expect(res.body.rgb).toEqual(rgb);
    });
});

describe(`GET ${ROUTE} - error handling`, () => {
    test('returns 400 when the hex parameter is missing', async () => {
        const res = await request(app).get(ROUTE);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Query parameter "hex" is required' });
    });

    test.each([[''], ['12345'], ['gggggg'], ['#ff57333']])(
        'returns 400 for invalid hex %p',
        async (hex) => {
            const res = await request(app).get(ROUTE).query({ hex });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/Invalid hex colour/);
            expect(res.body).not.toHaveProperty('rgb');
        }
    );

    test('returns 400 when the hex parameter is given twice (array)', async () => {
        const res = await request(app).get(`${ROUTE}?hex=fff&hex=000`);

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/must be a string/);
    });
});

describe('unknown routes', () => {
    test('returns a JSON 404 for an unknown path', async () => {
        const res = await request(app).get('/api/nothing-here');

        expect(res.status).toBe(404);
        expect(res.headers['content-type']).toMatch(/application\/json/);
        expect(res.body).toEqual({ error: 'Not found' });
    });

    test('returns 404 for an unsupported method on the route', async () => {
        const res = await request(app).post(ROUTE).send({ hex: 'ff5733' });

        expect(res.status).toBe(404);
    });
});