// Import MCP server components and validation library
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to get available personas
const getAvailablePersonas = () => {
    const personasDir = join(__dirname, 'personas');
    return readdirSync(personasDir)
        .filter(file => file.endsWith('.md') && !file.startsWith('_'))
        .map(file => file.replace('.md', ''));
};

// Create a new MCP server instance with metadata
const server = new McpServer({
    name: "A11y Personas MCP",    // Human-readable server name
    version: "1.0.0",            // Server version for compatibility tracking
});

// Register a tool that MCP clients can invoke
// Tools are functions that clients can call to perform specific actions
server.tool(
    'get-persona',                // Tool identifier - used by clients to invoke this tool
    'Tool to get a static persona', // Human-readable description of what this tool does
    {
        // Define the tool's input schema using Zod
        // This validates parameters passed from the client
        persona: z.string().describe('The name of the persona to get'),
    },
    // The actual function that gets executed when the tool is called
    async ({ persona }) => {
        try {
            // Get list of available personas
            const availablePersonas = getAvailablePersonas();
            
            // Check if requested persona exists
            if (!availablePersonas.includes(persona)) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Persona "${persona}" not found. Available personas: ${availablePersonas.join(', ')}`
                        }
                    ]
                };
            }
            
            // Read the persona file
            const personaPath = join(__dirname, 'personas', `${persona}.md`);
            const personaContent = readFileSync(personaPath, 'utf8');
            
            return {
                content: [
                    {
                        type: 'text',
                        text: personaContent
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error reading persona "${persona}": ${error.message}`
                    }
                ]
            };
        }
    }
);

// Register list-personas tool
server.tool(
    'list-personas',
    'Tool to list all available accessibility personas',
    {
        // No parameters required
    },
    async () => {
        try {
            const availablePersonas = getAvailablePersonas();
            
            if (availablePersonas.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'No personas found in the personas directory.'
                        }
                    ]
                };
            }
            
            // Extract titles from persona files
            const personaWithTitles = availablePersonas.map(persona => {
                try {
                    const personaPath = join(__dirname, 'personas', `${persona}.md`);
                    const content = readFileSync(personaPath, 'utf8');
                    
                    // Simple frontmatter parsing to extract title
                    const titleMatch = content.match(/^---[\s\S]*?title:\s*(.+?)$/m);
                    const title = titleMatch ? titleMatch[1].trim() : persona;
                    
                    return `- ${title}`;
                } catch (error) {
                    // Fallback to filename if can't read file or extract title
                    return `- ${persona}`;
                }
            });
            
            const personaList = `Available accessibility personas:\n${personaWithTitles.join('\n')}`;
            
            return {
                content: [
                    {
                        type: 'text',
                        text: personaList
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error listing personas: ${error.message}`
                    }
                ]
            };
        }
    }
);

// Create a stdio transport for communication
// This handles the low-level message passing between client and server
const transport = new StdioServerTransport();

// Connect the server to the transport to start listening for client requests
// This establishes the communication channel and makes the server ready to receive calls
server.connect(transport);