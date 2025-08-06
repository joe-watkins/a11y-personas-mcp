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
    name: "A11y Personas MCP",
    version: "1.0.0",
});

// Register a tool that MCP clients can invoke
// Tools are functions that clients can call to perform specific actions
server.tool(
    'get-personas',                // Tool identifier - used by clients to invoke this tool
    'Get one or more accessibility personas by ID or title', // Human-readable description of what this tool does
    {
        // Define the tool's input schema using Zod
        // This validates parameters passed from the client - supports both single persona and arrays
        personas: z.union([
            z.string().describe('Single persona ID or title'),
            z.array(z.string()).describe('Array of persona IDs or titles')
        ]).describe('Persona identifier(s) - can be ID (filename without .md) or title from frontmatter')
    },
    // The actual function that gets executed when the tool is called
    async ({ personas }) => {
        try {
            const personaInputs = Array.isArray(personas) ? personas : [personas];
            const results = [];
            const notFound = [];
            
            // Get all available personas for title matching
            const availablePersonas = getAvailablePersonas();
            
            for (const input of personaInputs) {
                const trimmedInput = input.trim();
                let personaId = null;
                
                // First try exact ID match
                if (availablePersonas.includes(trimmedInput)) {
                    personaId = trimmedInput;
                } else {
                    // Try to find by title (case-insensitive)
                    for (const id of availablePersonas) {
                        try {
                            const personaPath = join(__dirname, 'personas', `${id}.md`);
                            const content = readFileSync(personaPath, 'utf-8');
                            
                            // Extract title from frontmatter
                            const titleMatch = content.match(/^---[\s\S]*?title:\s*(.+?)$/m);
                            if (titleMatch) {
                                const title = titleMatch[1].trim();
                                if (title.toLowerCase() === trimmedInput.toLowerCase()) {
                                    personaId = id;
                                    break;
                                }
                            }
                        } catch (error) {
                            // Skip if file can't be read
                            continue;
                        }
                    }
                }
                
                if (personaId) {
                    try {
                        const personaPath = join(__dirname, 'personas', `${personaId}.md`);
                        const content = readFileSync(personaPath, 'utf-8');
                        results.push({
                            id: personaId,
                            content: content
                        });
                    } catch (error) {
                        notFound.push(trimmedInput);
                    }
                } else {
                    notFound.push(trimmedInput);
                }
            }
            
            // Build response
            let responseText = '';
            
            if (results.length > 0) {
                if (results.length === 1) {
                    responseText = `# Persona: ${results[0].id}\n\n${results[0].content}`;
                } else {
                    responseText = `# Retrieved ${results.length} Personas\n\n`;
                    results.forEach((result, index) => {
                        responseText += `## ${index + 1}. Persona: ${result.id}\n\n${result.content}`;
                        if (index < results.length - 1) {
                            responseText += '\n\n---\n\n';
                        }
                    });
                }
            }
            
            if (notFound.length > 0) {
                if (responseText) responseText += '\n\n';
                responseText += `## Not Found\n\nThe following personas could not be found: ${notFound.join(', ')}\n\n`;
                responseText += `Available personas: ${availablePersonas.join(', ')}`;
            }
            
            if (!responseText) {
                responseText = `No personas found. Available personas: ${availablePersonas.join(', ')}`;
            }
            
            return {
                content: [{ type: 'text', text: responseText }]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error retrieving personas: ${error.message}\n\nAvailable personas: ${getAvailablePersonas().join(', ')}`
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