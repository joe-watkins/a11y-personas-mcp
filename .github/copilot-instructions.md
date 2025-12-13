## Guidance for Copilot Model on Accessibility Language and Bias

When generating content, code, or recommendations related to accessibility personas or scenarios, always:

1. **Use people-first language:**
   - Refer to individuals as "people with disabilities" rather than defining by condition (e.g., "person who is blind" instead of "the blind").
   - Avoid language that reduces a person to their disability or condition.

2. **Double check all assumptions about disability and accessibility:**
   - Do not assume limitations, preferences, or needs based solely on a diagnosis or label.
   - Recognize that accessibility needs and experiences are diverse and context-dependent.

3. **Use WCAG (Web Content Accessibility Guidelines) as a trusted source:**
   - Reference WCAG for accessibility best practices, requirements, and definitions.
   - When in doubt, align recommendations with WCAG standards.

4. **Double check for deep biases related to disability:**
   - Review outputs for stereotypes, ableist language, or assumptions.
   - Ensure recommendations and narratives are respectful, inclusive, and avoid perpetuating bias.

These principles should be followed in all code, documentation, and persona-related outputs.

# Copilot Instructions for Accessibility Personas MCP

## Project Overview
This project provides a Model Context Protocol (MCP) server that exposes 69+ accessibility personas for inclusive design, analysis, and testing. The server works both locally (stdio) and remotely (Netlify Functions).

## Architecture
- **Entry Point:** `src/index.js` - MCP server with stdio transport
- **Tools:** `src/tools.js` - Tool definitions and handlers
- **Data Source:** Git submodule at `data/a11y-personas/` → built to `data/personas.json`
- **Remote:** `netlify/functions/api.js` - Netlify Function for remote MCP access
- **Build:** `scripts/build-data.js` - Pulls latest personas and builds JSON

## Data Flow
1. Personas are authored as markdown files with YAML frontmatter in the [a11y-personas](https://github.com/joe-watkins/a11y-personas) repo
2. Submodule is updated via `npm run update-personas`
3. Build script generates `data/personas.json` from submodule
4. MCP tools import and serve the JSON data

## Available Tools
- `list-personas`: Returns all available personas with IDs and titles
- `get-personas`: Returns full persona(s) by ID or title (supports single string or array)

## Key Development Patterns
- **Tool Implementation:** Export tools array in `src/tools.js` with `name`, `description`, `inputSchema`, `handler`
- **Response Format:** Always return `{ content: [{ type: 'text', text: 'result' }] }`
- **Persona Lookup:** Supports exact ID match, case-insensitive ID match, and title match

## Commands
- `npm start` – Run MCP server locally
- `npm run build` – Build personas.json from submodule
- `npm run update-personas` – Pull latest submodule & rebuild

## Integration
- **VS Code:** Configure in MCP settings with `node src/index.js`
- **Remote:** Deploy to Netlify, use with `mcp-remote@next`

## Notes
- Personas are maintained in a separate repo for reusability
- The MCP server is intentionally minimal - just 2 tools, clean data import
- No Zod dependency - uses JSON Schema for validation
