# GitHub Copilot Instructions for Accessibility Personas MCP

## Project Overview
This is a Model Context Protocol (MCP) server providing 60+ accessibility personas for inclusive design evaluation. The server exposes personas through structured tools that analyze customer support scripts and suggest accessibility improvements.

## Architecture & Key Components

### Core MCP Server (`main.js`)
- **Entry point**: Creates McpServer instance with three main tools
- **Tool pattern**: Each tool follows `server.tool(id, description, schema, handler)` structure using Zod validation
- **Transport**: Uses StdioServerTransport for VS Code integration
- **ES Modules**: Uses `import` syntax with `__dirname` workaround for file paths

### Data Architecture
```
personas/           # 60+ markdown files with YAML frontmatter
data/
  accessibility-patterns.json  # Regex patterns for script analysis
```

### Persona Structure (`personas/*.md`)
All personas follow the `_template.md` pattern:
- **YAML frontmatter**: `title`, `profile`, `interaction_style`, `key_needs`, `cross_functional_considerations`
- **Biography section**: Narrative description with user quotes
- Filename = persona ID (e.g., `deaf-blind.md` → `deaf-blind` persona)

### Pattern-Based Analysis (`data/accessibility-patterns.json`)
```json
{
  "patterns": [
    {
      "id": "visual-dependency",
      "pattern": "\\b(look|see|view)\\b",
      "personas": ["deaf-blind", "low-vision", ...],
      "severity": "HIGH|MEDIUM|CRITICAL",
      "issue": "Description",
      "suggestion": "Improvement"
    }
  ]
}
```

## Key Development Patterns

### Adding New Personas
1. Create `personas/new-persona.md` following `_template.md` structure
2. Use kebab-case filenames (maps to persona IDs)
3. Include YAML frontmatter with all required fields
4. Run `analyze-persona-patterns` tool to update pattern associations

### Tool Implementation Pattern
```javascript
server.tool('tool-name', 'description', {
  param: z.string().describe('validation and docs')
}, async ({ param }) => {
  // Always return { content: [{ type: 'text', text: 'result' }] }
});
```

### Pattern Analysis Engine
- **Script analysis**: Regex matching against `accessibility-patterns.json`
- **Grading system**: A-F based on severity scoring (CRITICAL: -25, HIGH: -15, MEDIUM: -10)
- **Persona filtering**: Only show issues for personas that match the pattern
- **Contextual checks**: Dynamic evaluation using `new Function()` for script type conditions

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
- **Pattern matching**: Regex execution against script content with persona filtering
- **Frontmatter parsing**: Simple regex for extracting YAML `title:` field
- **Error handling**: Always return MCP-compliant response objects, never throw

## Testing Customer Support Scripts
Use `review-customer-support-scripts` with these parameters:
- `script_type`: "phone", "chat", "email", "in-person"
- `issue_category`: "technical-support", "billing", "account-access"
- `personas`: Optional array to filter analysis

The tool identifies barriers like visual dependencies, color assumptions, spatial directions, time pressure, and input method assumptions across different disability contexts.
