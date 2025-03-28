import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const BOOKS_DIR = path.join(__dirname, '../src/data/books');
const STATIC_EXCERPTS_FILE = path.join(__dirname, '../src/data/staticExcerpts.json');
const HASH_FILE = path.join(__dirname, '../src/data/books-hash.json');

// Helper function to calculate hash of a file
function calculateFileHash(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
}

// Helper function to get all JSON files from a directory
function getJsonFiles(dir) {
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(dir, file));
}

// Function to create a deterministic ID based on content and source
function createStableId(excerpt, sourceFile) {
  // Create a string that uniquely identifies this excerpt
  const content = `${sourceFile}-${excerpt.text}-${excerpt.chapter || ''}-${excerpt.verse || ''}`;
  
  // Create a hash of the content
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  
  // Use first 8 characters as ID (still very unique but shorter)
  return hash.substring(0, 8);
}

// Function to process a single book file
function processBookFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const bookData = JSON.parse(content);
  const sourceFile = path.basename(filePath, '.json');

  return bookData.excerpts.map(excerpt => ({
    id: createStableId(excerpt, sourceFile),
    text: excerpt.text,
    chapter: excerpt.chapter,
    verse: excerpt.verse,
    commentary: excerpt.commentary,
    themes: excerpt.themes || [],
    metadata: {
      title: bookData.metadata.title,
      author: bookData.metadata.author,
      translator: bookData.metadata.translator,
      amazonLink: bookData.metadata.amazonLink,
      category: bookData.metadata.category,
      language: bookData.metadata.language,
      tags: bookData.metadata.tags || [],
      sourceFile
    }
  }));
}

// Main function to generate/update static excerpts
async function generateStaticExcerpts() {
  try {
    // Get all JSON files
    const jsonFiles = getJsonFiles(BOOKS_DIR);
    
    // Calculate current hash of all files
    const currentHashes = {};
    jsonFiles.forEach(file => {
      currentHashes[path.basename(file)] = calculateFileHash(file);
    });

    // Read previous hash if exists
    let previousHashes = {};
    if (fs.existsSync(HASH_FILE)) {
      previousHashes = JSON.parse(fs.readFileSync(HASH_FILE, 'utf8'));
    }

    // Check if we have new or modified files
    const hasChanges = Object.entries(currentHashes).some(([file, hash]) => 
      !previousHashes[file] || previousHashes[file] !== hash
    );

    if (!hasChanges) {
      console.log('No changes detected in book files. Using existing static excerpts.');
      return;
    }

    console.log('Changes detected in book files. Updating static excerpts...');

    // Process all book files and combine excerpts
    const allExcerpts = jsonFiles.flatMap(file => {
      return processBookFile(file);
    });

    // Save the new excerpts
    fs.writeFileSync(
      STATIC_EXCERPTS_FILE,
      JSON.stringify({ excerpts: allExcerpts }, null, 2)
    );

    // Save the new hashes
    fs.writeFileSync(
      HASH_FILE,
      JSON.stringify(currentHashes, null, 2)
    );

    console.log(`Successfully generated ${allExcerpts.length} static excerpts`);
    console.log('Available themes:', [...new Set(allExcerpts.flatMap(e => e.themes))].sort());

  } catch (error) {
    console.error('Error generating static excerpts:', error);
    process.exit(1);
  }
}

// Run the script
generateStaticExcerpts(); 