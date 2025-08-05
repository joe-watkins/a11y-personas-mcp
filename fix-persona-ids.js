import fs from 'fs';

// Read the accessibility patterns file
let content = fs.readFileSync('./data/accessibility-patterns.json', 'utf8');

// Define the mappings for corrections
const corrections = {
    '"autism-non-speaking"': '"autistic-non-speaking"',
    '"chronic-fatigue-syndrome"': '"fatigue-chronic-fatigue-syndrome"',
    '"chronic-pain-mobility"': '"mobility-chronic-pain"',
    '"holding-child-one-handed"': '"temp-holding-child-one-handed"',
    '"one-handed-limb-difference"': '"mobility-one-handed-limb-difference"',
    '"public-place-privacy-concern"': '"temp-public-place-privacy-concern"'
};

// Remove invalid personas that don't exist
const removePersonas = [
    '"deafness-profound"',
    '"low-vision-taylor"',
    '"temp-low-bandwidth-connection"'
];

let correctionCount = 0;

// Apply corrections
for (const [incorrect, correct] of Object.entries(corrections)) {
    const beforeCount = (content.match(new RegExp(incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    content = content.replace(new RegExp(incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), correct);
    const afterCount = (content.match(new RegExp(correct.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    if (beforeCount > 0) {
        console.log(`✓ Corrected ${beforeCount} instances of ${incorrect} to ${correct}`);
        correctionCount += beforeCount;
    }
}

// Remove invalid personas
for (const invalid of removePersonas) {
    const beforeCount = (content.match(new RegExp(invalid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    // Remove the persona and any trailing comma and newline
    content = content.replace(new RegExp(`\\s*${invalid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},?\\s*`, 'g'), '');
    // Clean up any resulting double commas or trailing commas before closing brackets
    content = content.replace(/,\s*,/g, ',');
    content = content.replace(/,(\s*])/g, '$1');
    if (beforeCount > 0) {
        console.log(`✓ Removed ${beforeCount} instances of invalid persona ${invalid}`);
        correctionCount += beforeCount;
    }
}

// Write the corrected content back to the file
fs.writeFileSync('./data/accessibility-patterns.json', content, 'utf8');

console.log(`\n✅ Total corrections made: ${correctionCount}`);
console.log('🎉 Accessibility patterns file has been corrected!');
