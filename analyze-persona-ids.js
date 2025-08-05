import fs from 'fs';

// Read the accessibility patterns file
const data = JSON.parse(fs.readFileSync('./data/accessibility-patterns.json', 'utf8'));

// Extract all unique persona IDs from patterns
const personaIdsInPatterns = new Set();

data.patterns.forEach(pattern => {
    if (pattern.personas && Array.isArray(pattern.personas)) {
        pattern.personas.forEach(persona => {
            personaIdsInPatterns.add(persona);
        });
    }
});

// Also check contextual checks
if (data.contextualChecks) {
    data.contextualChecks.forEach(check => {
        if (check.personas && Array.isArray(check.personas)) {
            check.personas.forEach(persona => {
                personaIdsInPatterns.add(persona);
            });
        }
    });
}

// Convert to sorted array for easier review
const sortedPersonaIds = Array.from(personaIdsInPatterns).sort();

console.log('All persona IDs found in patterns file:');
console.log('=====================================');
sortedPersonaIds.forEach((id, index) => {
    console.log(`${(index + 1).toString().padStart(3)}. ${id}`);
});

console.log(`\nTotal unique persona IDs: ${sortedPersonaIds.length}`);

// Known persona filenames from the personas directory structure
const knownPersonaFiles = [
    'adhd-attention',
    'aging-multiple-impairments',
    'anxiety-mental-health',
    'arthritis-rheumatoid',
    'autistic-communication-differences',
    'autistic-executive-function',
    'autistic-non-speaking',
    'autistic-rule-oriented',
    'autistic-sensory-sensitive',
    'autistic-visual-thinker',
    'autistic',
    'blindness-braille-user',
    'blindness-braille',
    'blindness-light-perception',
    'blindness-low-vision-progressive',
    'blindness-screen-reader-nvda',
    'blindness-screen-reader-voiceover',
    'broken-dominant-arm',
    'cognitive-memory-loss',
    'color-vision-deficiency',
    'concussion-cognitive-fatigue',
    'deaf-blind',
    'deafness-deafblind',
    'deafness-hard-of-hearing',
    'deafness-hoh',
    'deafness-late-deafened',
    'deafness-oral-communicator',
    'deafness-sign-language-first',
    'deafness-sign-language-plus-speech',
    'deafness-sign-language-user',
    'deafness-sign-language',
    'depression-major',
    'dyslexia-reading',
    'epilepsy-seizure-risk',
    'eye-patch-temporary-vision',
    'fatigue-chronic-fatigue-syndrome',
    'hearing-loss-age-related',
    'intellectual-disability-mild',
    'laryngitis-temporary-voice-loss',
    'literacy-non-native-digital',
    'low-vision',
    'migraine-light-sensitivity',
    'mobility-chronic-pain',
    'mobility-one-handed-limb-difference',
    'motor-impaired-non-speaking',
    'multiple-sclerosis-fluctuating',
    'noisy-environment-limited-audio',
    'paraplegia-wheelchair',
    'parkinson-tremor',
    'ptsd-trauma',
    'sighted-deaf-hoh-low-tech',
    'speech-impairment-communication',
    'temp-broken-dominant-arm',
    'temp-concussion-cognitive-fatigue',
    'temp-crisis-situation',
    'temp-eye-patch-temporary-vision',
    'temp-holding-child-one-handed',
    'temp-laryngitis-temporary-voice-loss',
    'temp-migraine-light-sensitivity',
    'temp-noisy-environment-limited-audio',
    'temp-public-place-privacy-concern',
    'tourettes-syndrome',
    'visual-processing-disorder'
];

// Find persona IDs that are NOT in the known personas list
const invalidPersonaIds = sortedPersonaIds.filter(id => !knownPersonaFiles.includes(id));

console.log('\n\nPersona IDs that do NOT match actual persona files:');
console.log('===================================================');
if (invalidPersonaIds.length === 0) {
    console.log('✓ All persona IDs appear to be valid!');
} else {
    invalidPersonaIds.forEach((id, index) => {
        console.log(`${(index + 1).toString().padStart(3)}. ${id} ❌`);
    });
}

// Find known personas that are NOT referenced in patterns
const unusedPersonas = knownPersonaFiles.filter(file => !personaIdsInPatterns.has(file));

console.log('\n\nPersona files that are NOT referenced in any patterns:');
console.log('=====================================================');
if (unusedPersonas.length === 0) {
    console.log('✓ All personas are referenced in patterns!');
} else {
    unusedPersonas.forEach((id, index) => {
        console.log(`${(index + 1).toString().padStart(3)}. ${id} ⚠️`);
    });
}
