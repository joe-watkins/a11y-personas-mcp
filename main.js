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

// Load accessibility patterns from external JSON file
const loadAccessibilityPatterns = () => {
    try {
        const patternsPath = join(__dirname, 'data', 'accessibility-patterns.json');
        const patternsData = JSON.parse(readFileSync(patternsPath, 'utf8'));
        return patternsData;
    } catch (error) {
        console.error('Error loading accessibility patterns:', error);
        return { patterns: [], contextualChecks: [] };
    }
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

// Register review-care-scripts tool
server.tool(
    'review-care-scripts',
    'Reviews customer support scripts through the lens of accessibility personas',
    {
        script_content: z.string().describe('The support script text to review'),
        script_type: z.string().describe('The type of support interaction (phone, chat, email, in-person)'),
        issue_category: z.string().describe('The category of support issue (technical-support, billing, account-access, etc.)'),
        personas: z.array(z.string()).optional().describe('Specific personas to focus on (default: all)')
    },
    async ({ script_content, script_type, issue_category, personas }) => {
        try {
            // Get available personas or use specified ones
            const availablePersonas = getAvailablePersonas();
            const targetPersonas = personas && personas.length > 0 ? personas : availablePersonas;
            
            // Validate that specified personas exist
            const invalidPersonas = targetPersonas.filter(p => !availablePersonas.includes(p));
            if (invalidPersonas.length > 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Invalid personas specified: ${invalidPersonas.join(', ')}. Available personas: ${availablePersonas.join(', ')}`
                        }
                    ]
                };
            }

            // Load persona data for analysis
            const personaData = {};
            for (const persona of targetPersonas) {
                try {
                    const personaPath = join(__dirname, 'personas', `${persona}.md`);
                    const content = readFileSync(personaPath, 'utf8');
                    personaData[persona] = content;
                } catch (error) {
                    console.error(`Error loading persona ${persona}:`, error);
                }
            }

            // Analyze script for accessibility issues
            const analysis = analyzeScriptAccessibility(script_content, script_type, issue_category, personaData);
            
            return {
                content: [
                    {
                        type: 'text',
                        text: analysis
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error analyzing script: ${error.message}`
                    }
                ]
            };
        }
    }
);

// Register analyze-persona-patterns tool
server.tool(
    'analyze-persona-patterns',
    'Analyzes an existing persona and suggests accessibility pattern updates',
    {
        persona_id: z.string().describe('The persona identifier (e.g., "deaf-blind", "low-vision-taylor")'),
        auto_update: z.boolean().optional().describe('Whether to automatically update patterns file (default: false)')
    },
    async ({ persona_id, auto_update = false }) => {
        try {
            // Get available personas to validate the ID
            const availablePersonas = getAvailablePersonas();
            if (!availablePersonas.includes(persona_id)) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Persona "${persona_id}" not found. Available personas: ${availablePersonas.join(', ')}`
                        }
                    ]
                };
            }

            // Use the get-persona functionality internally to fetch persona content
            const personaPath = join(__dirname, 'personas', `${persona_id}.md`);
            const persona_content = readFileSync(personaPath, 'utf8');
            
            // Parse persona content to extract key information
            const personaAnalysis = analyzePersonaForPatterns(persona_content, persona_id);
            
            // Load current accessibility patterns
            const { patterns: currentPatterns, contextualChecks } = loadAccessibilityPatterns();
            
            // Analyze which existing patterns should include this persona
            const patternUpdates = analyzeExistingPatterns(personaAnalysis, currentPatterns);
            
            // Suggest new patterns specific to this persona
            const newPatterns = suggestNewPatterns(personaAnalysis, currentPatterns);
            
            // Generate response
            let response = `🔍 PERSONA PATTERN ANALYSIS: ${personaAnalysis.title}\n\n`;
            
            // Show existing patterns that should be updated
            if (patternUpdates.length > 0) {
                response += `📝 EXISTING PATTERNS TO UPDATE:\n`;
                patternUpdates.forEach(update => {
                    response += `• ${update.patternId}: ${update.reason}\n`;
                });
                response += `\n`;
            }
            
            // Show suggested new patterns
            if (newPatterns.length > 0) {
                response += `✨ SUGGESTED NEW PATTERNS:\n`;
                newPatterns.forEach(pattern => {
                    response += `• ${pattern.id}: ${pattern.issue} (${pattern.severity})\n`;
                    response += `  Pattern: ${pattern.pattern}\n`;
                    response += `  Suggestion: ${pattern.suggestion}\n\n`;
                });
            }
            
            // If auto_update is true, actually update the patterns file
            if (auto_update) {
                const updatedPatterns = applyPatternUpdates(currentPatterns, patternUpdates, newPatterns, persona_id);
                await updatePatternsFile(updatedPatterns, contextualChecks);
                response += `✅ PATTERNS FILE UPDATED AUTOMATICALLY\n`;
            } else {
                response += `💡 Run with auto_update=true to apply these changes automatically\n`;
            }
            
            return {
                content: [
                    {
                        type: 'text',
                        text: response
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error analyzing persona patterns: ${error.message}`
                    }
                ]
            };
        }
    }
);

// Helper function to analyze persona content for pattern relevance
const analyzePersonaForPatterns = (personaContent, personaId) => {
    // Extract key information from persona content
    const titleMatch = personaContent.match(/^---[\s\S]*?title:\s*(.+?)$/m);
    const title = titleMatch ? titleMatch[1].trim() : personaId;
    
    // Extract profile, interaction style, and key needs
    const profileMatch = personaContent.match(/profile:\s*([\s\S]*?)(?=interaction_style:|key_needs:|$)/);
    const interactionMatch = personaContent.match(/interaction_style:\s*([\s\S]*?)(?=key_needs:|profile:|$)/);
    const needsMatch = personaContent.match(/key_needs:\s*([\s\S]*?)(?=cross_functional_considerations:|$)/);
    
    const profile = profileMatch ? profileMatch[1].trim() : '';
    const interactionStyle = interactionMatch ? interactionMatch[1].trim() : '';
    const keyNeeds = needsMatch ? needsMatch[1].trim() : '';
    
    // Analyze content for accessibility indicators
    const contentLower = personaContent.toLowerCase();
    
    return {
        id: personaId,
        title,
        profile,
        interactionStyle,
        keyNeeds,
        indicators: {
            visual: contentLower.includes('vision') || contentLower.includes('blind') || contentLower.includes('see'),
            auditory: contentLower.includes('deaf') || contentLower.includes('hearing') || contentLower.includes('audio'),
            motor: contentLower.includes('motor') || contentLower.includes('hand') || contentLower.includes('gesture'),
            cognitive: contentLower.includes('cognitive') || contentLower.includes('memory') || contentLower.includes('complexity'),
            speech: contentLower.includes('speak') || contentLower.includes('voice') || contentLower.includes('verbal'),
            technical: contentLower.includes('technical') || contentLower.includes('technology') || contentLower.includes('literacy'),
            time: contentLower.includes('time') || contentLower.includes('slow') || contentLower.includes('timeout')
        }
    };
};

// Helper function to analyze which existing patterns should include the new persona
const analyzeExistingPatterns = (personaAnalysis, currentPatterns) => {
    const updates = [];
    
    currentPatterns.forEach(pattern => {
        let shouldInclude = false;
        let reason = '';
        
        switch (pattern.id) {
            case 'visual-dependency':
                if (personaAnalysis.indicators.visual) {
                    shouldInclude = true;
                    reason = 'Persona has visual impairments or dependencies';
                }
                break;
            case 'audio-dependency':
                if (personaAnalysis.indicators.auditory) {
                    shouldInclude = true;
                    reason = 'Persona has auditory impairments or dependencies';
                }
                break;
            case 'speech-requirement':
            case 'voice-tone-assumption':
                if (personaAnalysis.indicators.speech || personaAnalysis.indicators.auditory) {
                    shouldInclude = true;
                    reason = 'Persona has speech or auditory limitations';
                }
                break;
            case 'input-method-assumption':
            case 'mouse-dependency':
            case 'physical-capability-assumption':
                if (personaAnalysis.indicators.motor) {
                    shouldInclude = true;
                    reason = 'Persona has motor impairments affecting input methods';
                }
                break;
            case 'technical-jargon':
                if (personaAnalysis.indicators.technical || personaAnalysis.indicators.cognitive) {
                    shouldInclude = true;
                    reason = 'Persona has limited technical ability or cognitive considerations';
                }
                break;
            case 'time-pressure':
            case 'session-timeout-pressure':
                if (personaAnalysis.indicators.time || personaAnalysis.indicators.motor || personaAnalysis.indicators.cognitive) {
                    shouldInclude = true;
                    reason = 'Persona needs additional time for interactions';
                }
                break;
        }
        
        if (shouldInclude && !pattern.personas.includes(personaAnalysis.id)) {
            updates.push({
                patternId: pattern.id,
                reason: reason
            });
        }
    });
    
    return updates;
};

// Helper function to suggest new patterns based on persona analysis
const suggestNewPatterns = (personaAnalysis, currentPatterns) => {
    const newPatterns = [];
    
    // Look for unique characteristics not covered by existing patterns
    const contentLower = (personaAnalysis.profile + personaAnalysis.keyNeeds).toLowerCase();
    
    // Cognitive load patterns
    if (personaAnalysis.indicators.cognitive && !currentPatterns.some(p => p.id.includes('cognitive'))) {
        newPatterns.push({
            id: `cognitive-load-${personaAnalysis.id}`,
            pattern: "\\b(remember|recall|complex|complicated|multiple steps)\\b",
            flags: "gi",
            personas: [personaAnalysis.id],
            severity: "MEDIUM",
            issue: "Cognitive load assumption",
            suggestion: "Simplify instructions and provide step-by-step guidance with clear progression",
            examples: ["remember your password", "follow these complex steps", "recall the information"]
        });
    }
    
    // Memory-related patterns
    if (contentLower.includes('memory') && !currentPatterns.some(p => p.id.includes('memory'))) {
        newPatterns.push({
            id: `memory-requirement-${personaAnalysis.id}`,
            pattern: "\\b(remember|memorize|recall|don't forget)\\b",
            flags: "gi",
            personas: [personaAnalysis.id],
            severity: "HIGH",
            issue: "Memory requirement",
            suggestion: "Provide persistent visual cues and allow users to save/reference information",
            examples: ["remember this code", "don't forget to", "memorize your PIN"]
        });
    }
    
    // Literacy assumptions
    if (contentLower.includes('literacy') || contentLower.includes('reading')) {
        newPatterns.push({
            id: `literacy-assumption-${personaAnalysis.id}`,
            pattern: "\\b(read carefully|as you can see|obviously|clearly stated)\\b",
            flags: "gi",
            personas: [personaAnalysis.id],
            severity: "MEDIUM",
            issue: "Literacy assumption",
            suggestion: "Use simple language and provide audio or visual alternatives to text",
            examples: ["read carefully through", "as you can see", "it's clearly stated"]
        });
    }
    
    return newPatterns;
};

// Helper function to apply pattern updates
const applyPatternUpdates = (currentPatterns, patternUpdates, newPatterns, personaId) => {
    const updatedPatterns = [...currentPatterns];
    
    // Update existing patterns to include the new persona
    patternUpdates.forEach(update => {
        const patternIndex = updatedPatterns.findIndex(p => p.id === update.patternId);
        if (patternIndex !== -1 && !updatedPatterns[patternIndex].personas.includes(personaId)) {
            updatedPatterns[patternIndex].personas.push(personaId);
        }
    });
    
    // Add new patterns
    updatedPatterns.push(...newPatterns);
    
    return updatedPatterns;
};

// Helper function to update the patterns file
const updatePatternsFile = async (updatedPatterns, contextualChecks) => {
    try {
        const patternsPath = join(__dirname, 'data', 'accessibility-patterns.json');
        const updatedData = {
            patterns: updatedPatterns,
            contextualChecks: contextualChecks
        };
        
        const fs = await import('fs');
        fs.writeFileSync(patternsPath, JSON.stringify(updatedData, null, 2));
    } catch (error) {
        throw new Error(`Failed to update patterns file: ${error.message}`);
    }
};

// Helper function to analyze script accessibility
const analyzeScriptAccessibility = (scriptContent, scriptType, issueCategory, personaData) => {
    const issues = [];
    const suggestions = [];
    let grade = 'A';
    let gradePoints = 100;

    // Load accessibility patterns from external file
    const { patterns: accessibilityPatterns, contextualChecks } = loadAccessibilityPatterns();

    // Analyze script content against patterns
    const foundIssues = [];
    
    accessibilityPatterns.forEach(patternData => {
        const regex = new RegExp(patternData.pattern, patternData.flags);
        const matches = scriptContent.match(regex);
        if (matches) {
            patternData.personas.forEach(persona => {
                if (Object.keys(personaData).includes(persona)) {
                    const personaName = getPersonaDisplayName(persona, personaData[persona]);
                    foundIssues.push({
                        persona: personaName,
                        severity: patternData.severity,
                        issue: patternData.issue,
                        matches: matches,
                        suggestion: patternData.suggestion
                    });
                    
                    // Adjust grade based on severity
                    if (patternData.severity === 'CRITICAL') gradePoints -= 25;
                    else if (patternData.severity === 'HIGH') gradePoints -= 15;
                    else if (patternData.severity === 'MEDIUM') gradePoints -= 10;
                }
            });
        }
    });

    // Check contextual patterns
    contextualChecks.forEach(check => {
        try {
            // Create a safe evaluation context
            const evalContext = { scriptType, scriptContent, issueCategory };
            // Simple condition evaluation (in production, you'd want a safer evaluator)
            const conditionFunction = new Function('scriptType', 'scriptContent', 'issueCategory', `return ${check.condition}`);
            
            if (conditionFunction(scriptType, scriptContent, issueCategory)) {
                check.personas.forEach(persona => {
                    if (Object.keys(personaData).includes(persona)) {
                        const personaName = getPersonaDisplayName(persona, personaData[persona]);
                        foundIssues.push({
                            persona: personaName,
                            severity: check.severity,
                            issue: check.issue,
                            suggestion: check.suggestion
                        });
                        
                        if (check.severity === 'CRITICAL') gradePoints -= 25;
                        else if (check.severity === 'HIGH') gradePoints -= 15;
                        else if (check.severity === 'MEDIUM') gradePoints -= 10;
                    }
                });
            }
        } catch (error) {
            console.error('Error evaluating contextual check:', error);
        }
    });

    // Calculate final grade
    if (gradePoints >= 90) grade = 'A';
    else if (gradePoints >= 80) grade = 'B';
    else if (gradePoints >= 70) grade = 'C';
    else if (gradePoints >= 60) grade = 'D';
    else grade = 'F';

    // Format the response
    let response = `🔴 ACCESSIBILITY GRADE: ${grade}${gradePoints < 70 ? '- (Multiple Critical Issues)' : gradePoints < 90 ? ' (Some Issues Found)' : ' (Good Accessibility)'}\n\n`;

    if (foundIssues.length > 0) {
        response += `ISSUES IDENTIFIED:\n`;
        
        // Group by severity
        const criticalIssues = foundIssues.filter(i => i.severity === 'CRITICAL');
        const highIssues = foundIssues.filter(i => i.severity === 'HIGH');
        const mediumIssues = foundIssues.filter(i => i.severity === 'MEDIUM');

        if (criticalIssues.length > 0) {
            response += `\nCRITICAL ISSUES:\n`;
            criticalIssues.forEach(issue => {
                response += `• ${issue.persona}: BLOCKED - ${issue.issue}\n`;
            });
        }

        if (highIssues.length > 0) {
            response += `\nHIGH RISK:\n`;
            highIssues.forEach(issue => {
                response += `• ${issue.persona}: ${issue.issue}\n`;
            });
        }

        if (mediumIssues.length > 0) {
            response += `\nMEDIUM RISK:\n`;
            mediumIssues.forEach(issue => {
                response += `• ${issue.persona}: ${issue.issue}\n`;
            });
        }

        response += `\nSUGGESTED IMPROVEMENTS:\n`;
        const uniqueSuggestions = [...new Set(foundIssues.map(i => i.suggestion))];
        uniqueSuggestions.forEach((suggestion, index) => {
            response += `${index + 1}. ${suggestion}\n`;
        });

        response += `\nINCLUSIVE ALTERNATIVES:\n`;
        response += `✅ Offer multiple communication channels upfront\n`;
        response += `✅ Use device-agnostic and sensory-neutral language\n`;
        response += `✅ Remove time pressure and allow flexible pacing\n`;
        response += `✅ Provide multiple verification/confirmation methods\n`;
        response += `✅ Send direct links or codes instead of complex navigation\n`;
    } else {
        response += `✅ No major accessibility issues detected!\n\n`;
        response += `This script appears to be inclusive and accessible across different user needs.`;
    }

    return response;
};

// Helper function to extract persona display name
const getPersonaDisplayName = (personaId, personaContent) => {
    try {
        const titleMatch = personaContent.match(/^---[\s\S]*?title:\s*(.+?)$/m);
        return titleMatch ? titleMatch[1].trim() : personaId;
    } catch (error) {
        return personaId;
    }
};

// Create a stdio transport for communication
// This handles the low-level message passing between client and server
const transport = new StdioServerTransport();

// Connect the server to the transport to start listening for client requests
// This establishes the communication channel and makes the server ready to receive calls
server.connect(transport);