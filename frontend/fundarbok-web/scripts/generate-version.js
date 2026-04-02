#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read package.json for version
const packageJson = require(path.join(__dirname, '../package.json'));
const version = packageJson.version;

// Get current date in ISO format (YYYY-MM-DD)
const buildDate = new Date().toISOString().split('T')[0];

// Get git commit hash
let commitHash = 'unknown';
try {
  commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (error) {
  console.warn('Warning: Could not get git commit hash. Using "unknown"');
}

// Create version.json content
const versionInfo = {
  version,
  buildDate,
  commitHash
};

// Create directory if it doesn't exist
const versionDir = path.join(__dirname, '../src/assets');
if (!fs.existsSync(versionDir)) {
  fs.mkdirSync(versionDir, { recursive: true });
}

// Write version.json
const versionFile = path.join(versionDir, 'version.json');
fs.writeFileSync(versionFile, JSON.stringify(versionInfo, null, 2));

console.log('✓ Generated version.json with:');
console.log(`  Version: ${version}`);
console.log(`  Build Date: ${buildDate}`);
console.log(`  Commit Hash: ${commitHash}`);
