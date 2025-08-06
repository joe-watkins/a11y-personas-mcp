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

// Register review-customer-support-scripts tool
server.tool(
    'review-customer-support-scripts',
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

// Register review-product-requirements tool
server.tool(
    'review-product-requirements',
    'Reviews product requirements through the lens of accessibility personas to identify barriers and suggest improvements',
    {
        requirements: z.string().describe('The product requirements text to review'),
        personas: z.array(z.string()).optional().describe('Specific personas to focus on (default: all)')
    },
    async ({ requirements, personas }) => {
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

            // Analyze requirements for accessibility issues
            const analysis = analyzeProductRequirements(requirements, personaData);
            
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
                        text: `Error analyzing product requirements: ${error.message}`
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

// Helper function to analyze product requirements accessibility
const analyzeProductRequirements = (requirements, personaData) => {
    let grade = 'A';
    let gradePoints = 100;

    // Load accessibility patterns from external file
    const { patterns: accessibilityPatterns, contextualChecks } = loadAccessibilityPatterns();

    // Analyze requirements content against patterns
    const foundIssues = [];
    
    accessibilityPatterns.forEach(patternData => {
        const regex = new RegExp(patternData.pattern, patternData.flags);
        const matches = requirements.match(regex);
        if (matches) {
            // Check if this pattern affects any of the requested personas
            const affectedPersonas = patternData.personas.filter(persona => Object.keys(personaData).includes(persona));
            
            if (affectedPersonas.length > 0) {
                const personaNames = affectedPersonas.map(persona => getPersonaDisplayName(persona, personaData[persona]));
                
                foundIssues.push({
                    personas: affectedPersonas,
                    personaNames: personaNames,
                    severity: patternData.severity,
                    issue: patternData.issue,
                    matches: matches,
                    suggestion: patternData.suggestion,
                    patternId: patternData.id
                });
                
                // Adjust grade based on severity (only once per pattern, not per persona)
                if (patternData.severity === 'CRITICAL') {
                    gradePoints -= 25;
                } else if (patternData.severity === 'HIGH') {
                    gradePoints -= 15;
                } else if (patternData.severity === 'MEDIUM') {
                    gradePoints -= 10;
                }
            }
        }
    });

    // Additional product requirements specific checks
    const productSpecificIssues = analyzeProductSpecificPatterns(requirements, personaData);
    foundIssues.push(...productSpecificIssues);
    
    // Adjust grade for product-specific issues
    productSpecificIssues.forEach(issue => {
        if (issue.severity === 'CRITICAL') {
            gradePoints -= 25;
        } else if (issue.severity === 'HIGH') {
            gradePoints -= 15;
        } else if (issue.severity === 'MEDIUM') {
            gradePoints -= 10;
        }
    });

    // Calculate final grade
    if (gradePoints >= 90) grade = 'A';
    else if (gradePoints >= 80) grade = 'B';
    else if (gradePoints >= 70) grade = 'C';
    else if (gradePoints >= 60) grade = 'D';
    else grade = 'F';

    // Format the response
    let response = `📋 PRODUCT REQUIREMENTS ACCESSIBILITY REVIEW\n\n`;
    response += `🎯 ACCESSIBILITY GRADE: ${grade}${gradePoints < 70 ? '- (Multiple Critical Issues)' : gradePoints < 90 ? ' (Some Issues Found)' : ' (Excellent Accessibility)'}\n\n`;

    if (foundIssues.length > 0) {
        response += `⚠️ ACCESSIBILITY BARRIERS IDENTIFIED:\n`;
        
        // Group by severity
        const criticalIssues = foundIssues.filter(i => i.severity === 'CRITICAL');
        const highIssues = foundIssues.filter(i => i.severity === 'HIGH');
        const mediumIssues = foundIssues.filter(i => i.severity === 'MEDIUM');

        if (criticalIssues.length > 0) {
            response += `\n🚫 CRITICAL BARRIERS (Excludes Users):\n`;
            criticalIssues.forEach(issue => {
                const personaList = issue.personaNames.slice(0, 3).join(', ') + (issue.personaNames.length > 3 ? ` (+${issue.personaNames.length - 3} more)` : '');
                response += `• ${personaList}: BLOCKED - ${issue.issue}\n`;
                if (issue.matches && issue.matches.length <= 3) {
                    response += `  Examples: "${issue.matches.slice(0, 3).join('", "')}"\n`;
                }
            });
        }

        if (highIssues.length > 0) {
            response += `\n⚡ HIGH RISK (Significant Barriers):\n`;
            highIssues.forEach(issue => {
                const personaList = issue.personaNames.slice(0, 3).join(', ') + (issue.personaNames.length > 3 ? ` (+${issue.personaNames.length - 3} more)` : '');
                response += `• ${personaList}: ${issue.issue}\n`;
                if (issue.matches && issue.matches.length <= 3) {
                    response += `  Examples: "${issue.matches.slice(0, 3).join('", "')}"\n`;
                }
            });
        }

        if (mediumIssues.length > 0) {
            response += `\n⚠️ MEDIUM RISK (Usability Concerns):\n`;
            mediumIssues.forEach(issue => {
                const personaList = issue.personaNames.slice(0, 3).join(', ') + (issue.personaNames.length > 3 ? ` (+${issue.personaNames.length - 3} more)` : '');
                response += `• ${personaList}: ${issue.issue}\n`;
                if (issue.matches && issue.matches.length <= 3) {
                    response += `  Examples: "${issue.matches.slice(0, 3).join('", "')}"\n`;
                }
            });
        }

        response += `\n💡 RECOMMENDED IMPROVEMENTS:\n`;
        const uniqueSuggestions = [...new Set(foundIssues.map(i => i.suggestion))];
        uniqueSuggestions.forEach((suggestion, index) => {
            response += `${index + 1}. ${suggestion}\n`;
        });

        response += `\n✅ INCLUSIVE PRODUCT REQUIREMENTS:\n`;
        response += `• Specify multiple input modalities (touch, voice, keyboard, eye-tracking)\n`;
        response += `• Include alternative content formats (audio, visual, haptic)\n`;
        response += `• Define flexible timing and pacing requirements\n`;
        response += `• Require customizable interface elements (font size, contrast, layout)\n`;
        response += `• Specify clear error handling and recovery processes\n`;
        response += `• Include progressive disclosure and complexity management\n`;
        response += `• Define offline and low-bandwidth functionality\n`;
        response += `• Require multi-language and plain language support\n`;
    } else {
        response += `✅ EXCELLENT ACCESSIBILITY FOUNDATION!\n\n`;
        response += `Your product requirements demonstrate strong accessibility awareness. Consider these enhancement opportunities:\n\n`;
        response += `🌟 ACCESSIBILITY EXCELLENCE CHECKLIST:\n`;
        response += `• Define specific WCAG compliance levels and testing protocols\n`;
        response += `• Include persona-based acceptance criteria\n`;
        response += `• Specify assistive technology compatibility requirements\n`;
        response += `• Define accessibility performance metrics and KPIs\n`;
        response += `• Include inclusive design review processes\n`;
        response += `• Specify user testing requirements with diverse abilities\n`;
    }

    // Add persona impact summary
    const personaImpactSummary = generatePersonaImpactSummary(foundIssues, personaData);
    if (personaImpactSummary) {
        response += `\n${personaImpactSummary}`;
    }

    return response;
};

// Helper function to analyze product-specific accessibility patterns
const analyzeProductSpecificPatterns = (requirements, personaData) => {
    const issues = [];
    const requirementsLower = requirements.toLowerCase();
    
    // Check for missing accessibility considerations
    const accessibilityKeywords = [
        'accessibility', 'a11y', 'wcag', 'screen reader', 'keyboard', 
        'contrast', 'alternative text', 'alt text', 'disability', 'inclusive'
    ];
    const hasAccessibilityMentions = accessibilityKeywords.some(keyword => 
        requirementsLower.includes(keyword)
    );
    
    if (!hasAccessibilityMentions && Object.keys(personaData).length > 0) {
        issues.push({
            personas: Object.keys(personaData),
            personaNames: Object.keys(personaData).map(id => getPersonaDisplayName(id, personaData[id])),
            severity: 'HIGH',
            issue: 'No explicit accessibility requirements mentioned',
            matches: [],
            suggestion: 'Include specific accessibility requirements, WCAG compliance levels, and assistive technology support',
            patternId: 'missing-accessibility-requirements'
        });
    }
    
    // Check for visual-only requirements
    const visualOnlyPatterns = [
        /\b(must see|visual(?:ly)? (?:appealing|stunning|beautiful))\b/gi,
        /\b(?:only|exclusively) (?:visual|graphical)\b/gi,
        /\brequires? (?:seeing|vision|sight)\b/gi
    ];
    
    visualOnlyPatterns.forEach(pattern => {
        const matches = requirements.match(pattern);
        if (matches) {
            const visuallyImpairedPersonas = Object.keys(personaData).filter(id => {
                const content = personaData[id].toLowerCase();
                return content.includes('blind') || content.includes('vision') || content.includes('sight');
            });
            
            if (visuallyImpairedPersonas.length > 0) {
                issues.push({
                    personas: visuallyImpairedPersonas,
                    personaNames: visuallyImpairedPersonas.map(id => getPersonaDisplayName(id, personaData[id])),
                    severity: 'CRITICAL',
                    issue: 'Requirements assume visual capabilities',
                    matches: matches,
                    suggestion: 'Specify alternative non-visual interaction methods and content formats',
                    patternId: 'visual-only-requirements'
                });
            }
        }
    });
    
    // Check for motor ability assumptions
    const motorPatterns = [
        /\b(?:must|requires?) (?:precise|fine|accurate) (?:mouse|pointer|touch|gesture)\b/gi,
        /\b(?:drag.?and.?drop|pinch|swipe|multi.?touch) (?:required|mandatory|essential)\b/gi,
        /\b(?:only|exclusively) (?:mouse|touch|gesture) (?:input|interaction)\b/gi
    ];
    
    motorPatterns.forEach(pattern => {
        const matches = requirements.match(pattern);
        if (matches) {
            const motorImpairedPersonas = Object.keys(personaData).filter(id => {
                const content = personaData[id].toLowerCase();
                return content.includes('motor') || content.includes('mobility') || content.includes('hand') || 
                       content.includes('arm') || content.includes('dexterity') || content.includes('tremor');
            });
            
            if (motorImpairedPersonas.length > 0) {
                issues.push({
                    personas: motorImpairedPersonas,
                    personaNames: motorImpairedPersonas.map(id => getPersonaDisplayName(id, personaData[id])),
                    severity: 'CRITICAL',
                    issue: 'Requirements assume fine motor control abilities',
                    matches: matches,
                    suggestion: 'Provide alternative input methods including keyboard navigation, voice control, and switch access',
                    patternId: 'motor-assumptions'
                });
            }
        }
    });
    
    // Check for cognitive load assumptions
    const cognitivePatterns = [
        /\b(?:complex|complicated|advanced|sophisticated) (?:workflow|process|interaction)\b/gi,
        /\b(?:must|requires?) (?:remembering|memorizing|recalling) (?:multiple|complex|numerous)\b/gi,
        /\b(?:simultaneous|concurrent|parallel) (?:tasks|activities|processes)\b/gi
    ];
    
    cognitivePatterns.forEach(pattern => {
        const matches = requirements.match(pattern);
        if (matches) {
            const cognitivePersonas = Object.keys(personaData).filter(id => {
                const content = personaData[id].toLowerCase();
                return content.includes('cognitive') || content.includes('memory') || content.includes('attention') ||
                       content.includes('autism') || content.includes('adhd') || content.includes('dementia');
            });
            
            if (cognitivePersonas.length > 0) {
                issues.push({
                    personas: cognitivePersonas,
                    personaNames: cognitivePersonas.map(id => getPersonaDisplayName(id, personaData[id])),
                    severity: 'HIGH',
                    issue: 'Requirements may create high cognitive load',
                    matches: matches,
                    suggestion: 'Design for progressive disclosure, provide clear guidance, and allow task saving/resumption',
                    patternId: 'cognitive-load-requirements'
                });
            }
        }
    });
    
    return issues;
};

// Helper function to generate persona impact summary
const generatePersonaImpactSummary = (foundIssues, personaData) => {
    if (foundIssues.length === 0) return '';
    
    // Count issues per persona
    const personaImpacts = {};
    foundIssues.forEach(issue => {
        issue.personas.forEach(personaId => {
            if (!personaImpacts[personaId]) {
                personaImpacts[personaId] = {
                    name: getPersonaDisplayName(personaId, personaData[personaId]),
                    critical: 0,
                    high: 0,
                    medium: 0
                };
            }
            personaImpacts[personaId][issue.severity.toLowerCase()]++;
        });
    });
    
    let summary = `\n📊 PERSONA IMPACT SUMMARY:\n`;
    
    // Sort by total impact (critical weighted more heavily)
    const sortedPersonas = Object.entries(personaImpacts)
        .sort(([,a], [,b]) => {
            const aWeight = a.critical * 3 + a.high * 2 + a.medium;
            const bWeight = b.critical * 3 + b.high * 2 + b.medium;
            return bWeight - aWeight;
        })
        .slice(0, 10); // Show top 10 most impacted personas
    
    sortedPersonas.forEach(([personaId, impact]) => {
        const issues = [];
        if (impact.critical > 0) issues.push(`${impact.critical} CRITICAL`);
        if (impact.high > 0) issues.push(`${impact.high} HIGH`);
        if (impact.medium > 0) issues.push(`${impact.medium} MEDIUM`);
        
        summary += `• ${impact.name}: ${issues.join(', ')}\n`;
    });
    
    return summary;
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
            // Check if this pattern affects any of the requested personas
            const affectedPersonas = patternData.personas.filter(persona => Object.keys(personaData).includes(persona));
            
            if (affectedPersonas.length > 0) {
                const personaNames = affectedPersonas.map(persona => getPersonaDisplayName(persona, personaData[persona]));
                
                foundIssues.push({
                    personas: affectedPersonas,
                    personaNames: personaNames,
                    severity: patternData.severity,
                    issue: patternData.issue,
                    matches: matches,
                    suggestion: patternData.suggestion,
                    patternId: patternData.id
                });
                
                // Adjust grade based on severity (only once per pattern, not per persona)
                if (patternData.severity === 'CRITICAL') gradePoints -= 25;
                else if (patternData.severity === 'HIGH') gradePoints -= 15;
                else if (patternData.severity === 'MEDIUM') gradePoints -= 10;
            }
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
                // Check if this contextual check affects any of the requested personas
                const affectedPersonas = check.personas.filter(persona => Object.keys(personaData).includes(persona));
                
                if (affectedPersonas.length > 0) {
                    const personaNames = affectedPersonas.map(persona => getPersonaDisplayName(persona, personaData[persona]));
                    
                    foundIssues.push({
                        personas: affectedPersonas,
                        personaNames: personaNames,
                        severity: check.severity,
                        issue: check.issue,
                        suggestion: check.suggestion,
                        patternId: check.id
                    });
                    
                    // Adjust grade based on severity (only once per pattern)
                    if (check.severity === 'CRITICAL') gradePoints -= 25;
                    else if (check.severity === 'HIGH') gradePoints -= 15;
                    else if (check.severity === 'MEDIUM') gradePoints -= 10;
                }
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
                const personaList = issue.personaNames.slice(0, 3).join(', ') + (issue.personaNames.length > 3 ? ` (+${issue.personaNames.length - 3} more)` : '');
                response += `• ${personaList}: BLOCKED - ${issue.issue}\n`;
                if (issue.matches) {
                    response += `  Found: "${issue.matches.slice(0, 2).join('", "')}"\n`;
                }
            });
        }

        if (highIssues.length > 0) {
            response += `\nHIGH RISK:\n`;
            highIssues.forEach(issue => {
                const personaList = issue.personaNames.slice(0, 3).join(', ') + (issue.personaNames.length > 3 ? ` (+${issue.personaNames.length - 3} more)` : '');
                response += `• ${personaList}: ${issue.issue}\n`;
                if (issue.matches) {
                    response += `  Found: "${issue.matches.slice(0, 2).join('", "')}"\n`;
                }
            });
        }

        if (mediumIssues.length > 0) {
            response += `\nMEDIUM RISK:\n`;
            mediumIssues.forEach(issue => {
                const personaList = issue.personaNames.slice(0, 3).join(', ') + (issue.personaNames.length > 3 ? ` (+${issue.personaNames.length - 3} more)` : '');
                response += `• ${personaList}: ${issue.issue}\n`;
                if (issue.matches) {
                    response += `  Found: "${issue.matches.slice(0, 2).join('", "')}"\n`;
                }
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