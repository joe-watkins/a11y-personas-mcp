# a11y-personas-mcp

MCP server providing accessibility personas for inclusive design and development.

A Model Context Protocol (MCP) server that works both locally (stdio) and remotely (Netlify Functions).

## Quick Start

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "a11y-personas": {
      "command": "npx",
      "args": ["-y", "a11y-personas-mcp"]
    }
  }
}
```

That's it! No cloning, no building - just add the config and start using accessibility personas.

## Important note about synthetic users with disabilities

**These synthetic personas are educational tools and starting points for accessibility considerations—they do not replace the need to work directly with real people with disabilities.** Each person's experience with disability is unique, and these generalized personas may not accurately reflect the full spectrum of real-world impacts, adaptive strategies, or individual preferences. For meaningful accessibility improvements, always prioritize user research, usability testing, and direct feedback from people with disabilities in your target audience.

These personas are more centered around the technical and functional aspects of accessibility, rather than personal narratives or lived experiences. They are designed to help teams understand the specific interaction styles, key needs, and cross-functional considerations for various disabilities, enabling more effective design and development practices.

## Available Tools

| Tool | Description |
|------|-------------|
| `list-personas` | List all 69 accessibility personas with their IDs and titles. |
| `get-personas` | Get detailed information about one or more personas by ID or title. |

### Example Usage

```
# List all personas
list-personas

# Get a specific persona by ID
get-personas personas="blindness-screen-reader-nvda"

# Get multiple personas
get-personas personas=["adhd-attention", "dyslexia-reading"]

# Get by title (case-insensitive)
get-personas personas="Screen Reader User (NVDA)"
```

## Data Source

Personas are sourced from the [a11y-personas](https://github.com/joe-watkins/a11y-personas) repository as a git submodule. Each persona includes:

- **Profile**: Key characteristics and context
- **Interaction Style**: Input methods, output preferences, and limitations
- **Key Needs**: Essential accessibility requirements
- **Cross-Functional Considerations**: Guidance for customer care, development, design/UX, and testing
- **Biography**: Narrative description for empathy and understanding

## Installation

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/joe-watkins/a11y-personas-mcp.git

# Or if already cloned
git submodule update --init --recursive

# Install dependencies and build personas data
npm install
npm run build
```

### Configure VS Code / Claude Desktop

Add to your MCP settings:

```json
{
  "mcpServers": {
    "a11y-personas-mcp": {
      "command": "node",
      "args": ["C:/path/to/a11y-personas-mcp/src/index.js"]
    }
  }
}
```

## Updating Personas

Pull the latest personas from the source repository:

```bash
npm run update-personas
```

## Deploy to Netlify

This project is configured to deploy as a Netlify Function.

### Deploy via GitHub

1. Push this repository to GitHub
2. Connect it to Netlify via the Netlify dashboard
3. Netlify will automatically build and deploy

### Using the Remote Server

Once deployed, configure your MCP settings to use the remote server:

```json
{
  "mcpServers": {
    "a11y-personas-mcp": {
      "command": "npx",
      "args": ["mcp-remote@next", "https://your-site.netlify.app/mcp"]
    }
  }
}
```

Replace `your-site.netlify.app` with your actual Netlify URL.

## Project Structure

```
├── src/
│   ├── index.js          # MCP server (stdio transport)
│   └── tools.js          # Tool definitions
├── data/
│   ├── a11y-personas/    # Git submodule (source personas)
│   └── personas.json     # Built personas data
├── scripts/
│   └── build-data.js     # Build script
└── netlify/
    └── functions/
        └── api.js        # Netlify Function (remote MCP)
```

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run MCP server locally |
| `npm run build` | Build personas.json from submodule |
| `npm run update-personas` | Pull latest submodule & rebuild |

## Learn More

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [a11y-personas Repository](https://github.com/joe-watkins/a11y-personas)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
