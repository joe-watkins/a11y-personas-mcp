import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load patterns
const patternsPath = join(__dirname, 'data', 'accessibility-patterns.json');
const patternsData = JSON.parse(readFileSync(patternsPath, 'utf8'));

const script = "Agent: To continue, you must press the green button on your screen now. If you do not press the button within 10 seconds, your call will be disconnected.";

console.log("Testing script:", script);
console.log("\n=== Pattern Tests ===");

// Test specific patterns
const patterns = patternsData.patterns;
patterns.forEach(pattern => {
    if (pattern.id === 'color-dependency' || pattern.id === 'time-pressure') {
        console.log(`\nTesting pattern: ${pattern.id}`);
        console.log(`Pattern: ${pattern.pattern}`);
        console.log(`Flags: ${pattern.flags}`);
        
        try {
            const regex = new RegExp(pattern.pattern, pattern.flags);
            console.log(`Regex: ${regex}`);
            const matches = script.match(regex);
            console.log(`Matches: ${matches}`);
        } catch (error) {
            console.log(`Error creating regex: ${error.message}`);
        }
    }
});
