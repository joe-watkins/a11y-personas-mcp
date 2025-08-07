# A11y Personas API

RESTful API server for accessibility personas, built with Express.js.

## Endpoints

### GET /list-personas
Returns a list of all available personas with their IDs and titles.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "blindness-screen-reader-nvda",
      "title": "Maya - NVDA Screen Reader User"
    },
    {
      "id": "deafness-sign-language",
      "title": "Alex - ASL User"
    }
  ],
  "count": 2
}
```

### GET /get-personas?personas=id1,id2
Returns full persona content for specified IDs or titles.

**Parameters:**
- `personas` (required): Comma-separated list of persona IDs or titles

**Example:**
```
GET /get-personas?personas=blindness-screen-reader-nvda,deafness-sign-language
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "blindness-screen-reader-nvda",
      "title": "Maya - NVDA Screen Reader User",
      "content": "---\ntitle: Maya - NVDA Screen Reader User\n..."
    }
  ],
  "count": 1,
  "notFound": ["invalid-persona"],
  "availablePersonas": ["persona1", "persona2"]
}
```

### GET /health
Health check endpoint.

## Local Development

```bash
# Install dependencies
npm install

# Run Express server in development
npm run server:dev

# Run MCP server (original)
npm run dev
```

## Deployment

This API is configured for Vercel deployment with zero configuration needed.

## CORS

CORS is enabled for all origins in development. Configure as needed for production.
