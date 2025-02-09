
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'public', 'data');
const filesJsonPath = path.join(dataDir, 'files.json');

// Read the filenames in the data directory, excluding files.json itself
const filenames = fs.readdirSync(dataDir)
  .filter(file => file.endsWith('.json') && file !== 'files.json');

// Write the filenames to files.json
fs.writeFileSync(filesJsonPath, JSON.stringify(filenames, null, 2), 'utf-8');

console.log('Updated files.json with the following files:', filenames);
