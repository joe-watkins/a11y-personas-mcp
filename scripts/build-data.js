#!/usr/bin/env node
/**
 * Build script: Pulls latest personas from submodule and copies to data/personas.json
 */
import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const submoduleDir = join(rootDir, 'data', 'a11y-personas');
const distFile = join(submoduleDir, 'dist', 'personas.json');
const outputFile = join(rootDir, 'data', 'personas.json');

console.log('🔄 Building personas data...\n');

// Step 1: Update submodule to latest
console.log('📥 Pulling latest from submodule...');
try {
  execSync('git submodule update --remote --merge', { cwd: rootDir, stdio: 'inherit' });
} catch (error) {
  console.log('   (Submodule already up to date or not in git context)');
}

// Step 2: Install submodule dependencies if needed
const nodeModulesPath = join(submoduleDir, 'node_modules');
if (!existsSync(nodeModulesPath)) {
  console.log('📦 Installing submodule dependencies...');
  execSync('npm install', { cwd: submoduleDir, stdio: 'inherit' });
}

// Step 3: Build personas.json in submodule
console.log('🏗️  Building personas.json...');
execSync('npm run build', { cwd: submoduleDir, stdio: 'inherit' });

// Step 4: Copy to data/personas.json for import
console.log('📄 Copying to data/personas.json...');
if (!existsSync(dirname(outputFile))) {
  mkdirSync(dirname(outputFile), { recursive: true });
}
copyFileSync(distFile, outputFile);

console.log('\n✅ Done! Personas data is ready at data/personas.json');
