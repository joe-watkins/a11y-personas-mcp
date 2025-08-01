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

## Tool

- tbd

## Resources

### Model Context Protocol (MCP)
- **[MCP Main Repository](https://github.com/modelcontextprotocol)** - Official Model Context Protocol documentation, specifications, and examples
- **[TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)** - TypeScript/JavaScript SDK used to build this MCP server, includes APIs for creating tools, resources, and prompts
- **[MCP Inspector](https://github.com/modelcontextprotocol/inspector)** - Debugging tool for testing and inspecting MCP servers during development
