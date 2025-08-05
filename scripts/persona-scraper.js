#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

/**
 * Scrape web page and create persona
 * @param {string} url - URL to scrape
 * @param {string} personaName - Name for the persona file (e.g., "visual-processing-disorder")
 */
async function scrapeAndCreatePersona(url, personaName) {
    try {
        console.log(`🔍 Scraping persona content from: ${url}`);
        
        // Use Playwright MCP to scrape the page
        const scrapedContent = await scrapeWebPage(url);
        
        console.log(`📝 Processing scraped content...`);
        
        // Extract persona information using AI analysis
        const personaData = await extractPersonaData(scrapedContent, url);
        
        console.log(`🎨 Formatting persona according to template...`);
        
        // Generate the persona file content
        const personaContent = await generatePersonaFile(personaData);
        
        // Save the persona file
        const filePath = join(projectRoot, 'personas', `${personaName}.md`);
        await writeFile(filePath, personaContent, 'utf8');
        
        console.log(`✅ Persona created successfully: ${filePath}`);
        console.log(`📋 Persona title: ${personaData.title}`);
        
        return filePath;
        
    } catch (error) {
        console.error(`❌ Error creating persona: ${error.message}`);
        throw error;
    }
}

/**
 * Scrape web page content using Firecrawl MCP
 */
async function scrapeWebPage(url) {
    try {
        console.log(`🌐 Scraping content from: ${url}`);
        
        // Use Firecrawl to scrape the page content
        const response = await fetch('http://localhost:3000/mcp/firecrawl/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url,
                formats: ['markdown'],
                onlyMainContent: true,
                waitFor: 2000
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.data || !data.data.markdown) {
            throw new Error('No content extracted from the page');
        }
        
        // Extract title from markdown or use URL as fallback
        const content = data.data.markdown;
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : extractTitleFromUrl(url);
        
        return {
            title: title,
            content: content,
            url: url,
            rawData: data
        };
        
    } catch (error) {
        console.error(`❌ Scraping failed: ${error.message}`);
        console.log(`📝 Using fallback content extraction...`);
        
        // Fallback: return basic structure for manual input
        return {
            title: extractTitleFromUrl(url),
            content: `Content could not be automatically extracted from ${url}. Please manually review the page and update the persona accordingly.`,
            url: url,
            error: error.message
        };
    }
}

/**
 * Extract a reasonable title from URL
 */
function extractTitleFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const segments = pathname.split('/').filter(s => s.length > 0);
        
        if (segments.length > 0) {
            const lastSegment = segments[segments.length - 1];
            // Convert slug to title case
            return lastSegment
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
        }
        
        return urlObj.hostname.replace('www.', '');
    } catch {
        return 'Web Accessibility Persona';
    }
}

/**
 * Extract and structure persona data from scraped content
 */
async function extractPersonaData(scrapedContent, sourceUrl) {
    console.log(`🧠 Analyzing content for persona characteristics...`);
    
    const content = scrapedContent.content.toLowerCase();
    const originalContent = scrapedContent.content;
    
    // Analyze content to identify disability type and characteristics
    const disabilityAnalysis = analyzeDisabilityType(content);
    const assistiveTech = identifyAssistiveTechnologies(content);
    const barriers = identifyAccessibilityBarriers(content);
    const needs = extractAccessibilityNeeds(content);
    
    // Generate persona title
    const title = scrapedContent.title.includes('Persona') 
        ? scrapedContent.title 
        : `${scrapedContent.title} - Accessibility Persona`;
    
    // Build profile based on analysis
    const profile = [
        disabilityAnalysis.primary || "Has accessibility needs requiring consideration",
        "Cognitively intact and independent (unless specified otherwise)",
        ...assistiveTech.map(tech => `Uses ${tech} for daily tasks`),
        "Seeks inclusive digital experiences"
    ];
    
    // Determine interaction styles based on disability type
    const interactionStyle = generateInteractionStyle(disabilityAnalysis, assistiveTech);
    
    // Generate key needs based on analysis
    const keyNeeds = [
        ...needs,
        "Accessible interface design that works with assistive technologies",
        "Clear and consistent navigation patterns",
        "Multiple ways to access and interact with content",
        "Flexible timing and pacing for interactions"
    ];
    
    // Generate cross-functional considerations
    const crossFunctional = generateCrossFunctionalConsiderations(disabilityAnalysis, barriers);
    
    // Extract or generate biography content
    const biography = generateBiography(originalContent, disabilityAnalysis, sourceUrl);
    
    const personaData = {
        title: title,
        profile: profile.slice(0, 4), // Limit to 4 key points
        interaction_style: interactionStyle,
        key_needs: keyNeeds.slice(0, 7), // Limit to 7 key needs
        cross_functional_considerations: crossFunctional,
        biography: biography,
        sourceUrl: sourceUrl,
        generatedDate: new Date().toISOString().split('T')[0],
        contentAnalysis: {
            disabilityType: disabilityAnalysis.type,
            assistiveTech: assistiveTech,
            identifiedBarriers: barriers
        }
    };
    
    return personaData;
}

/**
 * Analyze content to identify disability type and characteristics
 */
function analyzeDisabilityType(content) {
    const patterns = {
        visual: {
            keywords: ['blind', 'vision', 'sight', 'visual', 'screen reader', 'braille', 'magnifier', 'contrast'],
            primary: "Has visual impairment affecting daily digital interactions"
        },
        hearing: {
            keywords: ['deaf', 'hearing', 'auditory', 'sign language', 'captions', 'subtitles'],
            primary: "Has hearing impairment requiring visual alternatives"
        },
        motor: {
            keywords: ['motor', 'mobility', 'dexterity', 'paralysis', 'arthritis', 'tremor', 'switch', 'eye tracking'],
            primary: "Has motor impairment affecting input methods"
        },
        cognitive: {
            keywords: ['cognitive', 'memory', 'attention', 'dyslexia', 'autism', 'learning', 'processing'],
            primary: "Has cognitive differences affecting information processing"
        },
        speech: {
            keywords: ['speech', 'voice', 'communication', 'mute', 'aac', 'augmentative'],
            primary: "Has speech impairment affecting verbal communication"
        }
    };
    
    let bestMatch = { type: 'general', score: 0, primary: "Has accessibility needs" };
    
    for (const [type, pattern] of Object.entries(patterns)) {
        const score = pattern.keywords.reduce((acc, keyword) => {
            return acc + (content.includes(keyword) ? 1 : 0);
        }, 0);
        
        if (score > bestMatch.score) {
            bestMatch = { type, score, primary: pattern.primary };
        }
    }
    
    return bestMatch;
}

/**
 * Identify assistive technologies mentioned in content
 */
function identifyAssistiveTechnologies(content) {
    const techPatterns = [
        { pattern: /screen reader/i, tech: "screen reader software" },
        { pattern: /voice control/i, tech: "voice control software" },
        { pattern: /eye tracking/i, tech: "eye tracking devices" },
        { pattern: /switch/i, tech: "switch navigation" },
        { pattern: /magnifier/i, tech: "screen magnification" },
        { pattern: /braille/i, tech: "braille display" },
        { pattern: /keyboard nav/i, tech: "keyboard navigation" },
        { pattern: /high contrast/i, tech: "high contrast modes" },
        { pattern: /captions/i, tech: "caption support" },
        { pattern: /aac/i, tech: "augmentative communication devices" }
    ];
    
    return techPatterns
        .filter(({ pattern }) => pattern.test(content))
        .map(({ tech }) => tech);
}

/**
 * Identify accessibility barriers mentioned in content
 */
function identifyAccessibilityBarriers(content) {
    const barrierPatterns = [
        "Small text or low contrast elements",
        "Mouse-only interactions",
        "Time-sensitive interactions",
        "Audio-only content",
        "Visual-only content",
        "Complex navigation",
        "Unclear instructions",
        "Inconsistent interface patterns"
    ];
    
    return barrierPatterns.filter(barrier => {
        const keywords = barrier.toLowerCase().split(' ');
        return keywords.some(keyword => content.includes(keyword));
    });
}

/**
 * Extract accessibility needs from content
 */
function extractAccessibilityNeeds(content) {
    const needsPatterns = [
        { pattern: /zoom|magnif/i, need: "Ability to zoom content up to 400% without loss of functionality" },
        { pattern: /contrast/i, need: "High contrast mode and customizable color schemes" },
        { pattern: /keyboard/i, need: "Full keyboard navigation support" },
        { pattern: /screen reader/i, need: "Compatibility with screen reading software" },
        { pattern: /voice/i, need: "Voice input and output alternatives" },
        { pattern: /time|timeout/i, need: "Flexible timing without automatic timeouts" },
        { pattern: /simple|clear/i, need: "Clear and simple language and instructions" }
    ];
    
    return needsPatterns
        .filter(({ pattern }) => pattern.test(content))
        .map(({ need }) => need);
}

/**
 * Generate interaction style based on analysis
 */
function generateInteractionStyle(disabilityAnalysis, assistiveTech) {
    const baseStyle = {
        input: ["Keyboard navigation", "Alternative input methods"],
        output: ["Accessible content formats", "Multiple output modalities"],
        no_reliance_on: ["Single-mode interfaces", "Time-sensitive interactions"]
    };
    
    // Customize based on disability type
    switch (disabilityAnalysis.type) {
        case 'visual':
            baseStyle.input.push("Screen reader", "Voice commands");
            baseStyle.output.push("Audio feedback", "Tactile feedback");
            baseStyle.no_reliance_on.push("Visual-only content", "Color-only information");
            break;
        case 'hearing':
            baseStyle.input.push("Visual input methods");
            baseStyle.output.push("Visual feedback", "Text captions");
            baseStyle.no_reliance_on.push("Audio-only content", "Sound-dependent interactions");
            break;
        case 'motor':
            baseStyle.input.push("Switch navigation", "Eye tracking", "Voice control");
            baseStyle.output.push("Large click targets", "Hover-free interactions");
            baseStyle.no_reliance_on.push("Mouse-only interactions", "Precise motor control");
            break;
        case 'cognitive':
            baseStyle.input.push("Simple input methods", "Consistent patterns");
            baseStyle.output.push("Clear visual hierarchy", "Simple language");
            baseStyle.no_reliance_on.push("Complex instructions", "Memory-dependent tasks");
            break;
    }
    
    return baseStyle;
}

/**
 * Generate cross-functional considerations based on analysis
 */
function generateCrossFunctionalConsiderations(disabilityAnalysis, barriers) {
    const base = {
        customer_care: [
            "Provide multiple communication channels (phone, email, chat, text)",
            "Allow extra time for responses and interactions",
            "Use clear, simple language without jargon",
            "Avoid assumptions about user abilities"
        ],
        development: [
            "Follow WCAG 2.1 AA accessibility guidelines",
            "Test with assistive technologies",
            "Implement proper semantic markup and ARIA labels",
            "Ensure full keyboard accessibility"
        ],
        design_ux: [
            "Use sufficient color contrast (4.5:1 minimum)",
            "Provide clear visual hierarchy and navigation",
            "Design for multiple interaction modalities",
            "Include accessibility in design system components"
        ],
        testing: [
            "Include accessibility testing in QA processes",
            "Test with real assistive technologies",
            "Validate against accessibility standards",
            "Include users with disabilities in testing"
        ]
    };
    
    // Add specific considerations based on disability type
    switch (disabilityAnalysis.type) {
        case 'visual':
            base.development.push("Test with screen readers (NVDA, JAWS, VoiceOver)");
            base.design_ux.push("Ensure all interactive elements are focusable");
            base.testing.push("Test navigation with screen reader only");
            break;
        case 'hearing':
            base.customer_care.push("Provide text-based support options");
            base.development.push("Include captions for all video content");
            base.design_ux.push("Use visual indicators for audio alerts");
            break;
        case 'motor':
            base.customer_care.push("Allow longer session timeouts");
            base.development.push("Implement large click targets (44px minimum)");
            base.design_ux.push("Avoid hover-dependent interactions");
            base.testing.push("Test with keyboard-only navigation");
            break;
    }
    
    return base;
}

/**
 * Generate biography section from content
 */
function generateBiography(originalContent, disabilityAnalysis, sourceUrl) {
    // Try to extract meaningful content for biography
    const sentences = originalContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const relevantSentences = sentences.filter(s => 
        /user|person|individual|experience|challenge|difficult|frustrat|barrier|need|require/i.test(s)
    );
    
    const description = relevantSentences.length > 0 
        ? `This persona represents ${disabilityAnalysis.primary.toLowerCase()}. ` + relevantSentences[0].trim() + '.'
        : `This persona represents a user ${disabilityAnalysis.primary.toLowerCase()}.`;
    
    // Try to extract a quote or create one
    const quoteMatch = originalContent.match(/"([^"]+)"/);
    const quote = quoteMatch 
        ? quoteMatch[1] 
        : "I need technology that works with me, not against me.";
    
    // Extract key needs for the list
    const needsList = [
        "Consistent and predictable interface behavior",
        "Multiple ways to access the same information",
        "Clear feedback for all interactions",
        "Flexible timing and pacing options"
    ];
    
    return {
        description: description,
        background: relevantSentences.slice(1, 3).join(' ') || "This user has developed strategies for navigating digital environments but still encounters barriers in poorly designed interfaces.",
        quote: quote,
        needs_list: needsList
    };
}

/**
 * Generate the persona markdown file content
 */
async function generatePersonaFile(personaData) {
    // Create YAML frontmatter
    const frontmatter = {
        title: personaData.title,
        profile: personaData.profile,
        interaction_style: personaData.interaction_style,
        key_needs: personaData.key_needs,
        cross_functional_considerations: personaData.cross_functional_considerations
    };
    
    const yamlContent = yaml.dump(frontmatter, {
        flowLevel: -1,
        indent: 2,
        lineWidth: 120
    });
    
    // Generate biography section
    const biography = `## Biography

${personaData.biography.description}

${personaData.biography.background}

> "${personaData.biography.quote}"

When reviewing interfaces, this user looks for:
${personaData.biography.needs_list.map(need => `- ${need}`).join('\n')}

---

*Source: ${personaData.sourceUrl}*  
*Generated: ${personaData.generatedDate}*
`;

    return `---\n${yamlContent}---\n\n${biography}`;
}

/**
 * Interactive persona creation with web scraping
 */
async function createPersonaInteractively() {
    console.log('🤖 Accessibility Persona Generator');
    console.log('===================================\n');
    
    // In a real implementation, this would prompt for input
    // For now, show the expected interface
    console.log('This script requires:');
    console.log('1. URL to scrape');
    console.log('2. Persona name/filename');
    console.log('3. Integration with MCP scraping tools\n');
    
    console.log('Example usage:');
    console.log('node persona-scraper.js "https://example.com/persona-page" "cognitive-disability"');
    console.log('');
    
    // Example call (commented out since we need actual scraping integration)
    // await scrapeAndCreatePersona('https://example.com', 'example-persona');
}

/**
 * Enhanced persona data extraction with AI assistance
 */
async function enhancePersonaWithAI(basicPersonaData, scrapedContent) {
    // This would integrate with AI/LLM to enhance the persona
    // Could use GPT-4 or similar to:
    // 1. Analyze scraped content for disability-specific information
    // 2. Generate appropriate interaction styles
    // 3. Create realistic biography and quotes
    // 4. Suggest cross-functional considerations
    
    console.log('🧠 AI Enhancement would analyze:');
    console.log('- Disability type and severity');
    console.log('- Assistive technology usage');
    console.log('- Common interaction patterns');
    console.log('- Accessibility barriers and solutions');
    console.log('- Cross-functional team needs');
    
    return basicPersonaData;
}

/**
 * Validate persona against template structure
 */
async function validatePersona(personaData) {
    const requiredFields = [
        'title', 'profile', 'interaction_style', 'key_needs', 
        'cross_functional_considerations'
    ];
    
    const missingFields = requiredFields.filter(field => !personaData[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Validate cross_functional_considerations structure
    const requiredTeams = ['customer_care', 'development', 'design_ux', 'testing'];
    const missingTeams = requiredTeams.filter(team => 
        !personaData.cross_functional_considerations[team]
    );
    
    if (missingTeams.length > 0) {
        throw new Error(`Missing cross-functional teams: ${missingTeams.join(', ')}`);
    }
    
    console.log('✅ Persona structure validation passed');
    return true;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);
    
    if (args.length >= 2) {
        const [url, personaName] = args;
        scrapeAndCreatePersona(url, personaName)
            .then(filePath => {
                console.log(`\n🎉 Success! Persona created at: ${filePath}`);
                process.exit(0);
            })
            .catch(error => {
                console.error(`\n💥 Failed: ${error.message}`);
                process.exit(1);
            });
    } else {
        createPersonaInteractively();
    }
}

export { scrapeAndCreatePersona, extractPersonaData, generatePersonaFile };
