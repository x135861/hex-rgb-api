# Hex to RGB API

A small REST API built with Express that converts hex colour values to RGB values.
Includes a unit-tested library function and an integration-tested route.

## Requirements

- Node.js 18 or newer

## Install and run

```bash
npm install
npm start          # starts the server at http://localhost:3000 (override with PORT)
```

## API

`GET /api/hex-to-rgb?hex=<value>`

| Input                 | Example                 |
| --------------------- | ----------------------- |
| 6 digit hex           | `ff5733` or `#ff5733`   |
| 3 digit shorthand     | `f53` or `#f53`         |

In a URL, `#` must be encoded as `%23`, so the leading `#` is optional.

Success (200):

```json
{ "hex": "#FF5733", "rgb": { "r": 255, "g": 87, "b": 51 }, "css": "rgb(255, 87, 51)" }
```

Error (400): `{ "error": "Invalid hex colour: \"xyz\". Use 3 or 6 hex digits, e.g. #ff5733" }`

Example with cURL:

```bash
curl "http://localhost:3000/api/hex-to-rgb?hex=ff5733"
```

## Tests

```bash
npm test                 # all tests
npm run test:unit        # library only
npm run test:integration # Express route only
npm run test:coverage    # with coverage report
```

## Project structure

```
src/lib/hexToRgb.js                       library function
src/app.js                                Express app and route
src/server.js                             server entry point
tests/unit/hexToRgb.test.js               unit tests
tests/integration/hexToRgbRoute.test.js   integration tests
```