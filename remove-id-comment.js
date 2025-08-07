import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const personasDir = join(__dirname, 'personas');
const personaFiles = readdirSync(personasDir).filter(file => file.endsWith('.md') && !file.startsWith('_'));

let updatedCount = 0;
personaFiles.forEach(filename => {
    const filePath = join(personasDir, filename);
    try {
        let content = readFileSync(filePath, 'utf-8');
        // Remove the comment from the id line
        const updated = content.replace(/(id: [^\n#]+) *# Unique identifier for the persona \(kebab-case\)/, '$1');
        if (updated !== content) {
            writeFileSync(filePath, updated, 'utf-8');
            updatedCount++;
            console.log(`✅ Removed comment from id in ${filename}`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message);
    }
});
console.log(`\nDone. Updated ${updatedCount} persona files.`);
