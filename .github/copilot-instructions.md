# GitHub Copilot Instructions for Accessibility Personas MCP

## Project Overview
This is a simplified Model Context Protocol (MCP) server providing 60+ accessibility personas for inclusive design evaluation. The server exposes personas through two core tools that bring accessibility personas into LLM context for analysis and design guidance.

## Architecture & Key Components

### Core MCP Server (`main.js`)
- **Entry point**: Creates McpServer instance with two main tools
- **Tool pattern**: Each tool follows `server.tool(id, description, schema, handler)` structure using Zod validation
- **Transport**: Uses StdioServerTransport for VS Code integration
- **ES Modules**: Uses `import` syntax with `__dirname` workaround for file paths

### Data Architecture
```
personas/           # 60+ markdown files with YAML frontmatter
```

### Persona Structure (`personas/*.md`)
All personas follow the `_template.md` pattern:
- **YAML frontmatter**: `title`, `profile`, `interaction_style`, `key_needs`, `cross_functional_considerations`
- **Biography section**: Narrative description with user quotes
- Filename = persona ID (e.g., `deaf-blind.md` → `deaf-blind` persona)

## Key Development Patterns

### Adding New Personas
1. Create `personas/new-persona.md` following `_template.md` structure
2. Use kebab-case filenames (maps to persona IDs)
3. Include YAML frontmatter with all required fields

### Tool Implementation Pattern
```javascript
server.tool('tool-name', 'description', {
  param: z.string().describe('validation and docs')
}, async ({ param }) => {
  // Always return { content: [{ type: 'text', text: 'result' }] }
});
```

## Essential Commands

```bash
npm start           # Run MCP server (production)
npm run dev         # Development with hot reload
tsx main.js         # Direct execution
```

## VS Code Integration
- Install via Command Palette: "MCP install" → "Command (stdio)"
- Configuration: `npm start --silent` as command
- Usage: `#tool-name` in Copilot chat (Agent mode)

## File Naming Conventions
- Personas: `kebab-case.md` (e.g., `motor-impaired-non-speaking.md`)
- Temporary conditions: `temp-` prefix (e.g., `temp-broken-dominant-arm.md`)
- Tool IDs: `kebab-case` matching function names

## Critical Integration Points
- **Persona loading**: `getAvailablePersonas()` scans `personas/` directory
- **Frontmatter parsing**: Simple regex for extracting YAML `title:` field
- **Error handling**: Always return MCP-compliant response objects, never throw

## Available Tools

### `list-personas`
Lists all available accessibility personas with their descriptive titles.
- **Parameters**: None
- **Returns**: Formatted list of all personas

### `get-persona`
Retrieves one or more accessibility personas by ID or title.
- **Parameters**: `personas` (string | array) - persona ID(s) or title(s)
- **Returns**: Full persona content including profile, interaction style, key needs, and cross-functional considerations

## Usage Patterns

Users should use these tools to bring personas into their conversation context, then work with the LLM to:
- Analyze designs for accessibility issues
- Review code for inclusive practices
- Evaluate content for readability and comprehension
- Plan testing scenarios with diverse user needs
- Generate accessible design requirements

The personas provide the foundational knowledge that enables the LLM to give accessibility-informed recommendations and analysis.
