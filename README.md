# Accessibility Personas MCP

A simple MCP server that provides accessibility personas for different use cases. 

## Installation in VS Code

1. Open VS Code Command Palette (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows/Linux)
2. Search for "MCP install" and select it
3. Choose "Command (stdio)" as the connection type
4. Configure the MCP server:
   - **Command**: `npm start`
   - **Name**: `a11y-personas-mcp`
   - **Type**: Local MCP
5. Save the configuration

The MCP server will now be available in your VS Code MCP client.

## Usage

```bash
npm start
```

Or directly with tsx:

```bash
npx tsx main.js
```

## Tools

### `get-persona`
Retrieves the complete accessibility persona documentation for a specific persona.

**Parameters:**
- `persona` (string): The name of the persona to retrieve (e.g., "deaf-blind", "low-vision-taylor")

**Returns:** Full markdown content including profile, interaction style, key needs, and cross-functional considerations.

### `list-personas`
Lists all available accessibility personas with their descriptive titles.

**Parameters:** None

**Returns:** Formatted list of all available personas with user-friendly titles.

## Available Personas

This MCP server provides access to the following accessibility personas:

- **Deafblind Person** (`deaf-blind`) - Individual with profound hearing and vision loss
- **Low Vision User - Taylor Kim** (`low-vision-taylor`) - User with low vision accessibility needs  
- **Motor-Impaired / Non-Speaking Person** (`motor-impaired-non-speaking`) - Individual with motor impairments and communication needs
- **Sighted Deaf or Hard-of-Hearing user with limited technical ability** (`sighted-deaf-hoh-low-tech`) - Deaf/HoH user with basic technical skills

Each persona includes detailed information about their profile, interaction style, key accessibility needs, and cross-functional considerations for customer care, development, design/UX, and testing teams.

## Sample Prompts

Once the MCP server is installed and running, you can use prompts like these in your MCP client:

**List all available personas:**
```
List all available accessibility personas
```

**Get a specific persona:**
```
Get the deaf-blind persona
```

```
Tell me about the low vision user persona
```

```
I need information about the motor-impaired non-speaking persona
```

```
Show me the sighted deaf hard-of-hearing persona with low tech skills
```

**General accessibility questions:**
```
What accessibility considerations should I keep in mind for users with motor impairments?
```

```
How should customer care handle interactions with deafblind users?
```

## Resources

### Model Context Protocol (MCP)
- **[MCP Main Repository](https://github.com/modelcontextprotocol)** - Official Model Context Protocol documentation, specifications, and examples
- **[TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)** - TypeScript/JavaScript SDK used to build this MCP server, includes APIs for creating tools, resources, and prompts
- **[MCP Inspector](https://github.com/modelcontextprotocol/inspector)** - Debugging tool for testing and inspecting MCP servers during development
