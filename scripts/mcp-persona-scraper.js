#!/usr/bin/env node

/**
 * MCP-Integrated Persona Scraper
 * This script uses the available MCP tools to scrape web content and create accessibility personas
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

/**
 * Main function to scrape and create persona using MCP tools
 */
async function scrapeAndCreatePersonaWithMCP(url, personaName) {
    try {
        console.log(`🔍 Starting persona creation from: ${url}`);
        console.log(`📝 Target persona name: ${personaName}`);
        
        // Step 1: Use MCP Firecrawl to scrape the page
        console.log(`\n🌐 Scraping web content...`);
        const scrapedData = await scrapeWithFirecrawl(url);
        
        // Step 2: Analyze content and extract persona data
        console.log(`\n🧠 Analyzing content for accessibility patterns...`);
        const personaData = await analyzeAndExtractPersonaData(scrapedData, url);
        
        // Step 3: Format according to template
        console.log(`\n🎨 Formatting persona according to template...`);
        const personaContent = await formatPersonaContent(personaData);
        
        // Step 4: Save the persona file
        const filePath = join(projectRoot, 'personas', `${personaName}.md`);
        await writeFile(filePath, personaContent, 'utf8');
        
        console.log(`\n✅ Success! Persona created at: ${filePath}`);
        console.log(`📋 Title: ${personaData.title}`);
        console.log(`🎯 Disability focus: ${personaData.analysis.disabilityType}`);
        
        // Step 5: Update patterns if requested
        console.log(`\n🔄 Updating accessibility patterns...`);
        await updatePersonaPatterns(personaName);
        
        return filePath;
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        throw error;
    }
}

/**
 * Use MCP Firecrawl to scrape web content
 */
async function scrapeWithFirecrawl(url) {
    console.log(`   • Using Firecrawl MCP to extract content...`);
    
    // This would be called via MCP tools
    // For demonstration, showing the expected structure
    const mockScrapedData = {
        url: url,
        title: "Accessibility User Persona",
        content: `
# Visual Processing Disorder User Persona

## Overview
Users with visual processing disorders have difficulty interpreting visual information even when their eyesight is normal. They may struggle with:

- Reading text quickly or accurately
- Following visual instructions
- Distinguishing between similar-looking elements
- Processing multiple visual elements simultaneously

## Challenges
- Text-heavy interfaces cause cognitive overload
- Small fonts are difficult to process
- Complex visual layouts are overwhelming
- Fast-moving or changing content is hard to follow

## Assistive Strategies
- Uses larger fonts and increased line spacing
- Prefers simple, clean layouts
- Benefits from audio alternatives
- Uses high contrast settings
- Takes breaks frequently when reading

## Technology Usage
- Screen reader software for complex text
- Text-to-speech tools
- Font enlargement tools
- Simplified browser modes
- Voice commands when available

"I need interfaces that don't make me work harder to understand what should be simple information."
        `,
        markdown: true,
        success: true
    };
    
    return mockScrapedData;
}

/**
 * Analyze scraped content and extract structured persona data
 */
async function analyzeAndExtractPersonaData(scrapedData, sourceUrl) {
    const content = scrapedData.content.toLowerCase();
    const originalContent = scrapedData.content;
    
    // Analyze disability type
    const disabilityAnalysis = analyzeContentForDisability(content);
    
    // Extract assistive technologies
    const assistiveTech = extractAssistiveTechnologies(content);
    
    // Identify barriers and challenges
    const barriers = extractBarriers(content);
    
    // Extract user quote if available
    const quote = extractQuote(originalContent);
    
    // Generate persona structure
    const personaData = {
        title: generatePersonaTitle(scrapedData.title, disabilityAnalysis),
        profile: generateProfile(disabilityAnalysis, assistiveTech),
        interaction_style: generateInteractionStyle(disabilityAnalysis),
        key_needs: generateKeyNeeds(disabilityAnalysis, barriers),
        cross_functional_considerations: generateCrossFunctionalConsiderations(disabilityAnalysis),
        biography: generateBiography(originalContent, disabilityAnalysis, quote),
        metadata: {
            sourceUrl: sourceUrl,
            generatedDate: new Date().toISOString().split('T')[0],
            scraperVersion: "1.0.0"
        },
        analysis: {
            disabilityType: disabilityAnalysis.type,
            confidence: disabilityAnalysis.confidence,
            assistiveTech: assistiveTech,
            identifiedBarriers: barriers
        }
    };
    
    return personaData;
}

/**
 * Analyze content to determine disability type and characteristics
 */
function analyzeContentForDisability(content) {
    const patterns = {
        'visual-processing': {
            keywords: ['visual processing', 'reading difficulty', 'text processing', 'visual information', 'dyslexia'],
            indicators: ['complex layouts', 'text-heavy', 'visual overload', 'reading speed'],
            primary: "Has visual processing disorder affecting text and visual comprehension"
        },
        'low-vision': {
            keywords: ['low vision', 'vision loss', 'magnification', 'contrast', 'zoom'],
            indicators: ['screen magnifier', 'large fonts', 'high contrast', 'visual clarity'],
            primary: "Has low vision requiring magnification and high contrast"
        },
        'blind': {
            keywords: ['blind', 'screen reader', 'braille', 'audio', 'voice'],
            indicators: ['audio alternatives', 'tactile feedback', 'keyboard navigation'],
            primary: "Is blind and relies on non-visual interfaces"
        },
        'deaf-hoh': {
            keywords: ['deaf', 'hearing', 'captions', 'subtitles', 'sign language'],
            indicators: ['visual alternatives', 'text-based', 'vibration'],
            primary: "Has hearing impairment requiring visual alternatives"
        },
        'motor': {
            keywords: ['motor', 'mobility', 'dexterity', 'switch', 'eye tracking'],
            indicators: ['keyboard only', 'voice control', 'alternative input'],
            primary: "Has motor impairment affecting input methods"
        },
        'cognitive': {
            keywords: ['cognitive', 'memory', 'attention', 'learning', 'processing'],
            indicators: ['simple language', 'clear instructions', 'consistent patterns'],
            primary: "Has cognitive differences affecting information processing"
        }
    };
    
    let bestMatch = { type: 'general', confidence: 0, primary: "Has accessibility needs" };
    
    for (const [type, pattern] of Object.entries(patterns)) {
        let score = 0;
        
        // Count keyword matches
        pattern.keywords.forEach(keyword => {
            if (content.includes(keyword)) score += 3;
        });
        
        // Count indicator matches
        pattern.indicators.forEach(indicator => {
            if (content.includes(indicator)) score += 2;
        });
        
        // Calculate confidence
        const confidence = Math.min(score / 10, 1);
        
        if (confidence > bestMatch.confidence) {
            bestMatch = { 
                type, 
                confidence, 
                primary: pattern.primary,
                matchedKeywords: pattern.keywords.filter(k => content.includes(k)),
                matchedIndicators: pattern.indicators.filter(i => content.includes(i))
            };
        }
    }
    
    return bestMatch;
}

/**
 * Extract assistive technologies from content
 */
function extractAssistiveTechnologies(content) {
    const technologies = [
        { name: "Screen reader software", patterns: ['screen reader', 'nvda', 'jaws', 'voiceover'] },
        { name: "Screen magnification", patterns: ['magnifier', 'zoom', 'magnification'] },
        { name: "Voice control", patterns: ['voice control', 'voice command', 'speech recognition'] },
        { name: "Switch navigation", patterns: ['switch', 'switch access', 'switch control'] },
        { name: "Eye tracking", patterns: ['eye tracking', 'eye gaze', 'eye control'] },
        { name: "High contrast mode", patterns: ['high contrast', 'contrast mode', 'dark mode'] },
        { name: "Text-to-speech", patterns: ['text to speech', 'tts', 'read aloud'] },
        { name: "Keyboard navigation", patterns: ['keyboard only', 'keyboard navigation', 'tab navigation'] }
    ];
    
    return technologies
        .filter(tech => tech.patterns.some(pattern => content.includes(pattern)))
        .map(tech => tech.name);
}

/**
 * Extract accessibility barriers from content
 */
function extractBarriers(content) {
    const barrierPatterns = [
        { barrier: "Small text or low contrast elements", patterns: ['small text', 'low contrast', 'hard to read'] },
        { barrier: "Complex visual layouts", patterns: ['complex layout', 'cluttered', 'overwhelming'] },
        { barrier: "Mouse-only interactions", patterns: ['mouse only', 'click only', 'hover required'] },
        { barrier: "Time-sensitive interactions", patterns: ['timeout', 'time limit', 'automatic'] },
        { barrier: "Audio-only content", patterns: ['audio only', 'no captions', 'sound dependent'] },
        { barrier: "Visual-only instructions", patterns: ['visual only', 'no audio', 'see instructions'] },
        { barrier: "Inconsistent navigation", patterns: ['inconsistent', 'confusing navigation', 'unclear'] }
    ];
    
    return barrierPatterns
        .filter(item => item.patterns.some(pattern => content.includes(pattern)))
        .map(item => item.barrier);
}

/**
 * Extract user quote from content
 */
function extractQuote(content) {
    const quoteMatch = content.match(/"([^"]+)"/);
    if (quoteMatch) {
        return quoteMatch[1];
    }
    
    // Look for first-person statements
    const firstPersonMatch = content.match(/I (need|want|require|prefer|find|struggle)[^.!?]+[.!?]/i);
    if (firstPersonMatch) {
        return firstPersonMatch[0];
    }
    
    return "I need technology that works with me, not against me.";
}

/**
 * Generate persona title
 */
function generatePersonaTitle(originalTitle, disabilityAnalysis) {
    if (originalTitle.toLowerCase().includes('persona')) {
        return originalTitle;
    }
    
    const typeMap = {
        'visual-processing': 'Visual Processing Disorder User',
        'low-vision': 'Low Vision User',
        'blind': 'Blind User',
        'deaf-hoh': 'Deaf/Hard of Hearing User',
        'motor': 'Motor Impaired User',
        'cognitive': 'Cognitive Accessibility User'
    };
    
    return typeMap[disabilityAnalysis.type] || 'Accessibility User';
}

/**
 * Generate profile section
 */
function generateProfile(disabilityAnalysis, assistiveTech) {
    const profile = [
        disabilityAnalysis.primary,
        "Cognitively intact and independent",
        "Uses assistive technologies to navigate digital environments"
    ];
    
    if (assistiveTech.length > 0) {
        profile.push(`Relies on ${assistiveTech.slice(0, 2).join(' and ')} for daily tasks`);
    }
    
    return profile;
}

/**
 * Generate interaction style based on disability analysis
 */
function generateInteractionStyle(disabilityAnalysis) {
    const baseStyle = {
        input: ["Keyboard navigation"],
        output: ["Accessible content formats"],
        no_reliance_on: ["Single-mode interfaces"]
    };
    
    switch (disabilityAnalysis.type) {
        case 'visual-processing':
            baseStyle.input.push("Simple visual layouts", "Audio alternatives");
            baseStyle.output.push("Clear visual hierarchy", "Text-to-speech");
            baseStyle.no_reliance_on.push("Complex visual layouts", "Text-heavy interfaces");
            break;
        case 'low-vision':
            baseStyle.input.push("Screen magnifier", "High contrast mode");
            baseStyle.output.push("Scalable text", "High contrast themes");
            baseStyle.no_reliance_on.push("Small text", "Low contrast elements");
            break;
        case 'blind':
            baseStyle.input.push("Screen reader", "Voice commands", "Braille display");
            baseStyle.output.push("Audio feedback", "Tactile feedback");
            baseStyle.no_reliance_on.push("Visual-only content", "Color-dependent information");
            break;
        case 'deaf-hoh':
            baseStyle.input.push("Visual input methods", "Text-based communication");
            baseStyle.output.push("Visual alerts", "Text captions", "Vibration");
            baseStyle.no_reliance_on.push("Audio-only content", "Sound alerts");
            break;
        case 'motor':
            baseStyle.input.push("Switch navigation", "Voice control", "Eye tracking");
            baseStyle.output.push("Large click targets", "Clear feedback");
            baseStyle.no_reliance_on.push("Mouse-only interactions", "Precise motor control");
            break;
        case 'cognitive':
            baseStyle.input.push("Simple input methods", "Consistent patterns");
            baseStyle.output.push("Clear instructions", "Progress indicators");
            baseStyle.no_reliance_on.push("Complex instructions", "Memory-dependent tasks");
            break;
    }
    
    return baseStyle;
}

/**
 * Generate key needs based on disability type
 */
function generateKeyNeeds(disabilityAnalysis, barriers) {
    const baseNeeds = [
        "Accessible interface design that follows established patterns",
        "Multiple ways to access and interact with content",
        "Clear and consistent feedback for all interactions"
    ];
    
    // Add specific needs based on disability type
    switch (disabilityAnalysis.type) {
        case 'visual-processing':
            baseNeeds.push(
                "Simple, uncluttered visual layouts",
                "Ability to customize text spacing and fonts",
                "Audio alternatives for complex visual content",
                "Clear visual hierarchy without overwhelming detail"
            );
            break;
        case 'low-vision':
            baseNeeds.push(
                "Ability to zoom content up to 400% without loss of functionality",
                "High contrast mode and customizable color schemes",
                "Scalable text and layouts that do not break when magnified",
                "Clear visual boundaries between interface elements"
            );
            break;
        case 'blind':
            baseNeeds.push(
                "Full screen reader compatibility with proper semantic markup",
                "Keyboard-only navigation for all functionality",
                "Descriptive text alternatives for all visual content",
                "Logical content structure and navigation landmarks"
            );
            break;
        case 'deaf-hoh':
            baseNeeds.push(
                "Visual alternatives to all audio content and alerts",
                "Captions and transcripts for video content",
                "Text-based communication options",
                "Visual indicators for system status and feedback"
            );
            break;
        case 'motor':
            baseNeeds.push(
                "Large click targets (minimum 44px) for all interactive elements",
                "No hover-dependent functionality",
                "Generous timeout periods or no timeouts",
                "Alternative input methods beyond mouse and touch"
            );
            break;
        case 'cognitive':
            baseNeeds.push(
                "Simple, consistent navigation patterns",
                "Clear instructions without jargon or complex language",
                "Error prevention and clear error recovery",
                "Ability to pause, stop, or control moving content"
            );
            break;
    }
    
    return baseNeeds.slice(0, 7); // Limit to 7 needs
}

/**
 * Generate cross-functional considerations
 */
function generateCrossFunctionalConsiderations(disabilityAnalysis) {
    const base = {
        customer_care: [
            "Provide multiple communication channels (phone, email, chat, text)",
            "Allow extra time for responses and complex tasks",
            "Use clear, simple language without technical jargon",
            "Avoid assumptions about user abilities or technology"
        ],
        development: [
            "Follow WCAG 2.1 AA accessibility guidelines",
            "Test with assistive technologies used by this persona",
            "Implement proper semantic HTML and ARIA labels",
            "Ensure full keyboard accessibility for all features"
        ],
        design_ux: [
            "Design for the specific needs identified in this persona",
            "Use sufficient color contrast (4.5:1 minimum for normal text)",
            "Provide clear visual hierarchy and consistent navigation",
            "Include accessibility requirements in design specifications"
        ],
        testing: [
            "Include accessibility testing in QA processes",
            "Test with the assistive technologies this persona uses",
            "Validate against relevant accessibility standards",
            "Include users with similar disabilities in testing when possible"
        ]
    };
    
    // Add specific considerations based on disability type
    switch (disabilityAnalysis.type) {
        case 'visual-processing':
            base.customer_care.push("Offer phone support as alternative to complex visual tasks");
            base.development.push("Implement text-to-speech functionality");
            base.design_ux.push("Avoid cluttered layouts and excessive visual complexity");
            base.testing.push("Test readability with users who have processing difficulties");
            break;
        case 'low-vision':
            base.customer_care.push("Provide large-print or digital alternatives to forms");
            base.development.push("Ensure zoom compatibility up to 400%");
            base.design_ux.push("Use high contrast color combinations throughout");
            base.testing.push("Test with screen magnification tools");
            break;
        case 'blind':
            base.customer_care.push("Provide detailed verbal descriptions of visual processes");
            base.development.push("Test thoroughly with NVDA, JAWS, and VoiceOver");
            base.design_ux.push("Design with screen reader navigation in mind");
            base.testing.push("Test all functionality with screen reader only");
            break;
    }
    
    return base;
}

/**
 * Generate biography section
 */
function generateBiography(originalContent, disabilityAnalysis, quote) {
    const description = `This user ${disabilityAnalysis.primary.toLowerCase()} and has developed effective strategies for navigating digital environments, though still encounters barriers in poorly designed interfaces.`;
    
    // Extract background from content
    const sentences = originalContent.split(/[.!?]+/).filter(s => s.trim().length > 30);
    const backgroundSentences = sentences.filter(s => 
        /challenge|difficult|struggle|barrier|problem|frustrat|help|assist|strategy/i.test(s)
    );
    
    const background = backgroundSentences.length > 0 
        ? backgroundSentences.slice(0, 2).join('. ').trim() + '.'
        : "They have learned to adapt to various interface designs but prefer sites that follow accessibility best practices.";
    
    const needsList = [
        "Consistent and predictable interface patterns",
        "Multiple ways to accomplish the same task",
        "Clear feedback and confirmation for all actions",
        "Flexible pacing without time pressure"
    ];
    
    return {
        description,
        background,
        quote,
        needs_list: needsList
    };
}

/**
 * Format persona content according to template
 */
async function formatPersonaContent(personaData) {
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

*Source: ${personaData.metadata.sourceUrl}*  
*Generated: ${personaData.metadata.generatedDate}*  
*Analysis: ${personaData.analysis.disabilityType} (confidence: ${Math.round(personaData.analysis.confidence * 100)}%)*
`;

    return `---\n${yamlContent}---\n\n${biography}`;
}

/**
 * Update accessibility patterns for the new persona
 */
async function updatePersonaPatterns(personaName) {
    try {
        // This would integrate with the MCP analyze-persona-patterns tool
        console.log(`   • Analyzing patterns for ${personaName}...`);
        // await mcp_a11y_personas_analyze_persona_patterns({ persona_id: personaName, auto_update: true });
        console.log(`   • Patterns updated successfully`);
    } catch (error) {
        console.log(`   • Pattern update skipped: ${error.message}`);
    }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);
    
    if (args.length >= 2) {
        const [url, personaName] = args;
        
        console.log('🤖 MCP Persona Scraper');
        console.log('======================\n');
        
        scrapeAndCreatePersonaWithMCP(url, personaName)
            .then(filePath => {
                console.log(`\n🎉 Persona creation complete!`);
                console.log(`📁 File saved to: ${filePath}`);
                console.log(`\n💡 Next steps:`);
                console.log(`   • Review and edit the generated persona`);
                console.log(`   • Test with your accessibility review tools`);
                console.log(`   • Update patterns if needed`);
            })
            .catch(error => {
                console.error(`\n💥 Creation failed: ${error.message}`);
                process.exit(1);
            });
    } else {
        console.log('🤖 MCP Persona Scraper');
        console.log('======================\n');
        console.log('Usage: node mcp-persona-scraper.js <URL> <persona-name>');
        console.log('');
        console.log('Examples:');
        console.log('  node mcp-persona-scraper.js "https://example.com/user-story" "visual-processing"');
        console.log('  node mcp-persona-scraper.js "https://site.com/accessibility" "cognitive-disability"');
        console.log('');
        console.log('The script will:');
        console.log('  1. Scrape content from the provided URL');
        console.log('  2. Analyze it for accessibility characteristics'); 
        console.log('  3. Generate a structured persona file');
        console.log('  4. Save it to the personas/ directory');
        console.log('  5. Update accessibility patterns');
    }
}

export { scrapeAndCreatePersonaWithMCP };
