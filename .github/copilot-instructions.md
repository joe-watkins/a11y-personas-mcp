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
personas/           # 60+ markdown files with YAML frontmatter

# Copilot Instructions for Accessibility Personas MCP (Updated August 2025)

## Project Overview
This project provides a Model Context Protocol (MCP) server that exposes a large set of accessibility personas for inclusive design, analysis, and testing. The server is designed for integration with LLMs and developer tools, enabling context-aware accessibility guidance.

## Current Architecture
- **Entry Point:** `main.js` initializes the MCP server and registers all tools.
- **Personas:** Markdown files in `personas/` directory, each with YAML frontmatter and narrative content. Filenames are kebab-case persona IDs.
- **Tool Pattern:** Tools are registered with `server.tool(id, description, schema, handler)`, using Zod for validation. All handlers return MCP-compliant response objects.
- **Transport:** Uses StdioServerTransport for integration with VS Code and other clients.

## Key Development Patterns
- **Adding Personas:**
  1. Copy `_template.md` in `personas/` and fill in all required YAML fields and biography.
  2. Use kebab-case for filenames (e.g., `deaf-blind.md`).
  3. For temporary/conditional personas, use `temp-` prefix.
- **Tool Implementation:**
  - Follow the pattern: `server.tool('tool-id', 'description', schema, handler)`.
  - Always validate input and return `{ content: [{ type: 'text', text: 'result' }] }`.
- **Error Handling:**
  - Never throw; always return a valid MCP error response.
- **File Naming:**
  - Personas: `kebab-case.md`
  - Temporary: `temp-*.md`
  - Tool IDs: `kebab-case`

## Available Tools
- `list-personas`: Returns all available personas with titles.
- `get-persona`: Returns full persona(s) by ID or title.

## Usage & Integration
- **VS Code:**
  - Install via Command Palette: "MCP install" → "Command (stdio)"
  - Configure: `npm start --silent`
  - Use: `#list-personas` or `#get-persona` in Copilot chat (Agent mode)
- **Commands:**
  - `npm start` – Run MCP server
  - `npm run dev` – Development mode
  - `tsx main.js` – Direct execution

## Example Usage
1. Use `list-personas` to see all available personas.
2. Use `get-persona` to retrieve details for one or more personas by ID or title.
3. Use persona content to inform design reviews, code analysis, or accessibility testing scenarios.

## Notes
- The project is now focused on robust persona delivery and MCP tool integration. Legacy details and patterns have been removed.
- For any new features or changes, follow the current tool and persona patterns as described above.
