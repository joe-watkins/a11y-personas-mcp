#!/usr/bin/env node

/**
 * Test the persona scraper with example content
 */

import { scrapeAndCreatePersonaWithMCP } from './mcp-persona-scraper.js';

async function testPersonaScraper() {
    console.log('🧪 Testing Persona Scraper');
    console.log('==========================\n');
    
    try {
        // Test with a mock URL and persona name
        const testUrl = "https://example.com/visual-processing-user";
        const testPersonaName = "visual-processing-disorder";
        
        console.log(`Testing with:`);
        console.log(`  URL: ${testUrl}`);
        console.log(`  Persona: ${testPersonaName}`);
        console.log('');
        
        const result = await scrapeAndCreatePersonaWithMCP(testUrl, testPersonaName);
        
        console.log(`\n✅ Test completed successfully!`);
        console.log(`📄 Generated file: ${result}`);
        
    } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
        console.error(error.stack);
    }
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testPersonaScraper();
}
