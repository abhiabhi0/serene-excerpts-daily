
const fs = require('fs');
const path = require('path');

// Get all JSON files from the data directory
const dataDir = path.join(__dirname, '../public/data');
const files = fs.readdirSync(dataDir)
  .filter(file => file.endsWith('.json'))
  .filter(file => file !== 'files.json');

// Write the files array to files.json
fs.writeFileSync(
  path.join(dataDir, 'files.json'),
  JSON.stringify(files, null, 2)
);

console.log('Updated files.json with current data directory contents');
