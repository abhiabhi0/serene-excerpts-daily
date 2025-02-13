import fs from 'fs';
import path from 'path';

// Define the directory containing the images
const imagesDir = path.join(process.cwd(), 'public', 'lovable-uploads', 'bg-images');
const imagesJsonPath = path.join(process.cwd(), '', 'images.json');

// Function to get all image files
const getImages = () => {
  return fs.readdirSync(imagesDir)
    .filter(file => /\.(jpg|jpeg|png|gif)$/.test(file)) // Filter for image files
    .map(file => `/lovable-uploads/bg-images/${file}`); // Map to full path
};

// Get the images
const images = getImages();

// Write the images to a JSON file
fs.writeFileSync(imagesJsonPath, JSON.stringify(images, null, 2), 'utf8');
console.log('Images JSON file generated successfully.');
