import express from 'express';
import cors from 'cors';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Utility function to get available personas
const getAvailablePersonas = () => {
    const personasDir = join(__dirname, 'personas');
    return readdirSync(personasDir)
        .filter(file => file.endsWith('.md') && !file.startsWith('_'))
        .map(file => file.replace('.md', ''));
};

// Utility function to read persona by ID
const readPersonaById = (personaId) => {
    try {
        const personaPath = join(__dirname, 'personas', `${personaId}.md`);
        return readFileSync(personaPath, 'utf-8');
    } catch (error) {
        return null;
    }
};

// Utility function to find persona by title
const findPersonaByTitle = (title) => {
    const availablePersonas = getAvailablePersonas();
    
    for (const id of availablePersonas) {
        const content = readPersonaById(id);
        if (content) {
            const titleMatch = content.match(/^---[\s\S]*?title:\s*(.+?)$/m);
            if (titleMatch && titleMatch[1].trim().toLowerCase() === title.toLowerCase()) {
                return { id, content };
            }
        }
    }
    return null;
};

// Extract title from persona content
const extractTitle = (content) => {
    const titleMatch = content.match(/^---[\s\S]*?title:\s*(.+?)$/m);
    return titleMatch ? titleMatch[1].trim() : null;
};

// GET /list-personas - List all available personas with titles
app.get('/list-personas', (req, res) => {
    try {
        const availablePersonas = getAvailablePersonas();
        
        if (availablePersonas.length === 0) {
            return res.json({
                success: true,
                data: [],
                message: 'No personas found'
            });
        }

        const personas = availablePersonas.map(personaId => {
            const content = readPersonaById(personaId);
            const title = content ? extractTitle(content) : null;
            
            return {
                id: personaId,
                title: title || personaId
            };
        });

        res.json({
            success: true,
            data: personas,
            count: personas.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to list personas',
            message: error.message
        });
    }
});

// GET /get-personas - Get one or more personas by ID or title
app.get('/get-personas', (req, res) => {
    try {
        const { personas } = req.query;
        
        if (!personas) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameter: personas',
                message: 'Provide personas parameter as comma-separated IDs or titles'
            });
        }

        const personaInputs = personas.split(',').map(p => p.trim());
        const results = [];
        const notFound = [];

        for (const input of personaInputs) {
            let personaData = null;
            
            // Try exact ID match first
            const availablePersonas = getAvailablePersonas();
            if (availablePersonas.includes(input)) {
                const content = readPersonaById(input);
                if (content) {
                    personaData = { 
                        id: input, 
                        title: extractTitle(content) || input,
                        content 
                    };
                }
            } else {
                // Try title match
                const titleMatch = findPersonaByTitle(input);
                if (titleMatch) {
                    personaData = {
                        id: titleMatch.id,
                        title: extractTitle(titleMatch.content) || titleMatch.id,
                        content: titleMatch.content
                    };
                }
            }

            if (personaData) {
                results.push(personaData);
            } else {
                notFound.push(input);
            }
        }

        const response = {
            success: true,
            data: results,
            count: results.length
        };

        if (notFound.length > 0) {
            response.notFound = notFound;
            response.availablePersonas = getAvailablePersonas();
        }

        res.json(response);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get personas',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'A11y Personas API is running',
        version: '1.0.0'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        availableEndpoints: ['/list-personas', '/get-personas', '/health']
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

// Start server (only if not in Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`A11y Personas API running on port ${PORT}`);
        console.log(`\nClickable endpoints:`);
        console.log(`  Health check: http://localhost:${PORT}/health`);
        console.log(`  List personas: http://localhost:${PORT}/list-personas`);
        console.log(`  Get persona: http://localhost:${PORT}/get-personas?personas=adhd-attention`);
        console.log(`\nAPI Documentation: See API.md for full details`);
    });
}

export default app;
